import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {onDocumentCreated} from "firebase-functions/v2/firestore";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// --- Configuration ---
// IMPORTANT: REPLACE THIS WITH YOUR SECURE KEY SHARED WITH YOUR IoT DEVICES.
const IOT_SECRET_KEY = "YOUR_SECURE_IOT_SECRET_KEY";
// PAGASA API placeholder details (Must be replaced with actual endpoint)
const PAGASA_API_URL = "https://api.pagasa.ph/weather/latest";

// --- Interfaces for Type Safety ---
interface RawSensorData {
    locationId: string;
    waterLevel: number;
    timestamp: number; // Unix timestamp in seconds
    temperature?: number;
    batteryLevel?: number;
}

interface ForecastData {
    rainfallAmount: number;
    warningLevel: string;
}

// --- 1. IoT Data Ingestion Endpoint (HTTP Trigger) ---

/**
 * Secure HTTP endpoint for IoT devices to post raw sensor data.
 * Endpoint URL: https://[REGION]-[PROJECT_ID].cloudfunctions.net/ingestIoTData
 */
export const ingestIoTData = functions.https.onRequest(
  async (request, response) => {
  // CORS and Method Check logic
    if (request.method === "OPTIONS") {
      response.set("Access-Control-Allow-Origin", "*");
      response.set("Access-Control-Allow-Methods", "POST");
      response.set("Access-Control-Allow-Headers",
        "Content-Type, X-API-Key");
      response.status(204).send("");
      return;
    }
    response.set("Access-Control-Allow-Origin", "*");
    if (request.method !== "POST") {
      response.status(405).send({
        status: "error",
        message: "Method Not Allowed. Use POST.",
      });
      return;
    }

    // Security Check (API Key/Header)
    const apiKey = request.headers["x-api-key"];
    if (!apiKey || apiKey !== IOT_SECRET_KEY) {
      response.status(401).send({
        status: "error",
        message: "Unauthorized. Missing or invalid API Key.",
      });
      return;
    }

    const data: RawSensorData = request.body;

    // Basic Data Validation
    if (!data.locationId || typeof data.waterLevel !== "number" ||
      !data.timestamp) {
      response.status(400).send({
        status: "error",
        message: "Bad Request. Missing required fields.",
      });
      return;
    }

    try {
    // Save raw data. This write will automatically trigger calculateRiskScore.
      await db.collection("rawSensorData").add({
        ...data,
        receivedAt: admin.firestore.Timestamp.now(),
        timestamp: admin.firestore.Timestamp.fromMillis(data.timestamp * 1000),
      });

      console.info(`Data ingested for ${data.locationId}.`);
      response.status(200).send({
        status: "success",
        message: "Data accepted and logged.",
      });
      return;
    } catch (error) {
      console.error("Firestore write failed:", error);
      response.status(500).send({
        status: "error",
        message: "Internal Server Error during data logging.",
      });
      return;
    }
  });


// --- 2. PAGASA API Polling Service Deployment (Scheduled Trigger) ---

/**
 * Scheduled Cloud Function (Cron Job) to poll the PAGASA API for weather data.
 * Schedule: Runs every three hours (e.g., 00:00, 03:00, 06:00, etc. UTC).
 */
export const pollPAGASA = onSchedule("0 */3 * * *", async () => {
  console.log("Starting PAGASA API polling scheduled job...");

  try {
    // 1. Fetch data from PAGASA API
    const response = await axios.get(PAGASA_API_URL);
    const pagasaData = response.data;

    if (!pagasaData || response.status !== 200) {
      console.error("PAGASA API returned non-200 status or empty data.");
      return;
    }

    // 2. Normalize and Extract Relevant Data
    const relevantForecast = {
      fetchTimestamp: admin.firestore.Timestamp.now(),
      sourceTimestamp: pagasaData.current_timestamp,
      locationRegion: "CALABARZON",
      barangayFocus: "Barangay 728, Manila",
      temperatureC: pagasaData.temperature,
      rainfallAmount: pagasaData.rainfall_mm,
      warningLevel: pagasaData.warning_level || "None",
    };

    // 3. Store the Normalized Forecast Data in Firestore
    await db.collection("pagasaForecasts").add(relevantForecast);

    console.log("Successfully fetched and stored PAGASA data.");
    return;
  } catch (error) {
    console.error("Error during PAGASA API polling:", error);
    return;
  }
});


// --- 3. AI Risk Decision Scheduler Deployment (Firestore Trigger) ---

/**
 * Triggered when new sensor data arrives. Calculates a HydroAlert Risk Score.
 */
export const calculateRiskScore = onDocumentCreated(
  "rawSensorData/{docId}", async (event) => {
    const snapshot = event.data;

    if (!snapshot) {
      console.error("No snapshot data available");
      return;
    }

    const sensorData = snapshot.data() as RawSensorData & {
        receivedAt: admin.firestore.Timestamp,
        timestamp: admin.firestore.Timestamp
    };

    const {waterLevel, locationId, receivedAt} = sensorData;

    // 1. Get the latest PAGASA forecast data
    const latestForecastSnapshot = await db.collection("pagasaForecasts")
      .orderBy("fetchTimestamp", "desc")
      .limit(1)
      .get();

    const forecastData: ForecastData =
      latestForecastSnapshot.docs[0]?.data() as ForecastData || {
        rainfallAmount: 0,
        warningLevel: "None",
      };

    // --- CORE RISK CALCULATION LOGIC (Heuristic Model) ---
    let riskScore = 0; // 0 to 100
    let severity = "Low";
    let alertMessage = "Water level is normal.";

    // A. Sensor Data Contribution (Weight: 60%)
    const CRITICAL_WATER_LEVEL = 1.5; // Example: 1.5 meters is critical
    const sensorContribution =
      Math.min(1, waterLevel / CRITICAL_WATER_LEVEL) * 60;
    riskScore += sensorContribution;

    // B. PAGASA Forecast Contribution (Weight: 40%)
    let weatherContribution = 0;
    const rainfall = forecastData.rainfallAmount;

    if (rainfall > 20) {
      weatherContribution = 25;
      alertMessage = "Heavy rainfall forecasted.";
    } else if (rainfall > 5) {
      weatherContribution = 15;
      alertMessage = "Moderate rainfall expected.";
    }

    if (forecastData.warningLevel !== "None") {
      weatherContribution += 15;
      alertMessage = `PAGASA Warning: ${forecastData.warningLevel}.`;
    }

    riskScore += Math.min(weatherContribution, 40);

    // Final Risk Score and Severity Classification
    riskScore = Math.round(Math.min(riskScore, 100)); // Cap at 100

    if (riskScore >= 75) {
      severity = "Critical";
      alertMessage =
        `IMMEDIATE EVACUATION RECOMMENDED. Current Risk Score: ${riskScore}.`;
    } else if (riskScore >= 50) {
      severity = "High";
      alertMessage =
        `PREPARE FOR EVACUATION. Current Risk Score: ${riskScore}.`;
    } else if (riskScore >= 25) {
      severity = "Moderate";
    }
    // --- END CORE RISK CALCULATION ---

    // 2. Store the calculated alert in the user-facing 'alerts' collection
    const newAlert = {
      locationId: locationId,
      riskScore: riskScore,
      severity: severity,
      message: alertMessage,
      timestamp: receivedAt,
      // Use the actual location data we set up for the frontend map view
      location: {
        lat: 14.6042,
        long: 120.9822,
        city: "Manila",
      },
    };

    // Save the final alert
    await db.collection("alerts").add(newAlert);
    console.log(
      `Risk Score calculated and alert published for ${locationId}: ` +
      `${riskScore} (${severity})`);

    return;
  });
