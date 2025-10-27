import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {onRequest} from "firebase-functions/v2/https";

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

// --- 4. Authentication API Endpoints ---
interface SignInRequest {
  email: string;
  password: string;
}

interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  role: "resident" | "official" | "administrator";
  barangay: string;
}

/**
 * Sign In Endpoint
 * POST /signIn
 */
export const signIn = onRequest({cors: true}, async (request, response) => {
  // Set comprehensive CORS headers for all responses
  const origin = request.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    "https://hydroalert-user.web.app",
    "https://hydroalert-user.firebaseapp.com",
  ];

  if (origin && allowedOrigins.includes(origin)) {
    response.set("Access-Control-Allow-Origin", origin);
  } else {
    response.set("Access-Control-Allow-Origin", "*");
  }

  response.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  response.set("Access-Control-Allow-Credentials", "true");
  response.set("Access-Control-Max-Age", "86400"); // 24 hours

  // Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({
      success: false,
      message: "Method Not Allowed. Use POST.",
    });
    return;
  }

  try {
    const {email, password}: SignInRequest = request.body;

    if (!email || !password) {
      response.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
      return;
    }

    // Check if this is a demo user and handle accordingly
    const demoUsers = {
      "resident@barangay728.ph": {
        password: "resident123",
        role: "resident",
        name: "Demo Resident",
      },
      "official@barangay728.ph": {
        password: "official123",
        role: "official",
        name: "Demo Official",
      },
      "admin@barangay728.ph": {
        password: "admin123",
        role: "administrator",
        name: "Demo Admin",
      },
    };

    let signInData;
    let isDemoUser = false;

    if (demoUsers[email as keyof typeof demoUsers]) {
      const demoUser = demoUsers[email as keyof typeof demoUsers];
      if (password === demoUser.password) {
        // Demo user - create or get user
        isDemoUser = true;

        // Try to get existing user first
        try {
          const existingUser = await admin.auth().getUserByEmail(email);

          // User exists, use their UID as token (no custom token needed)
          signInData = {
            localId: existingUser.uid,
            email: email,
            emailVerified: true,
            idToken: existingUser.uid,
          };

          // Check if Firestore profile exists, create if not
          const existingProfile = await db
            .collection("users")
            .doc(existingUser.uid)
            .get();

          if (!existingProfile.exists) {
            await db.collection("users").doc(existingUser.uid).set({
              email: email,
              name: demoUser.name,
              role: demoUser.role,
              barangay: "Barangay 728, Zone 79",
              createdAt: admin.firestore.Timestamp.now(),
              isActive: true,
              isDemoUser: true,
            });
          }
        } catch (getUserError: any) {
          // Only create user if they truly don't exist
          if (getUserError.code === "auth/user-not-found") {
            const newUser = await admin.auth().createUser({
              email: email,
              password: password,
              displayName: demoUser.name,
              emailVerified: true,
            });

            await db.collection("users").doc(newUser.uid).set({
              email: email,
              name: demoUser.name,
              role: demoUser.role,
              barangay: "Barangay 728, Zone 79",
              createdAt: admin.firestore.Timestamp.now(),
              isActive: true,
              isDemoUser: true,
            });

            signInData = {
              localId: newUser.uid,
              email: email,
              emailVerified: true,
              idToken: newUser.uid,
            };
          } else {
            // Some other error occurred
            throw getUserError;
          }
        }
      } else {
        response.status(401).json({
          success: false,
          message: "Incorrect password for demo user.",
        });
        return;
      }
    } else {
      // Regular user - use Firebase REST API to verify credentials
      const firebaseApiKey = "AIzaSyBZOZUCWltSVebiL8sAnOTjk-28Oj6-bq0";
      const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`;

      const signInResponse = await fetch(signInUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      });

      signInData = await signInResponse.json();

      if (!signInResponse.ok) {
        let message = "Sign in failed. Please try again.";
        if (signInData.error?.message === "EMAIL_NOT_FOUND") {
          message = "No account found with this email.";
        } else if (signInData.error?.message === "INVALID_PASSWORD") {
          message = "Incorrect password.";
        } else if (signInData.error?.message === "INVALID_EMAIL") {
          message = "Invalid email format.";
        } else if (signInData.error?.message === "USER_DISABLED") {
          message = "This account has been disabled.";
        }

        response.status(401).json({
          success: false,
          message: message,
        });
        return;
      }
    }

    // Get user data from Firestore
    console.log("Fetching user profile for UID:", signInData.localId);
    let userDoc = await db.collection("users").doc(signInData.localId).get();

    // If user profile doesn't exist, create it (especially for demo users)
    if (!userDoc.exists) {
      console.log("User profile not found in Firestore, creating...");

      // Create profile for both demo and regular users
      await db.collection("users").doc(signInData.localId).set({
        email: signInData.email || email,
        name: isDemoUser ?
          demoUsers[email as keyof typeof demoUsers].name :
          signInData.email?.split("@")[0] || "User",
        role: isDemoUser ?
          demoUsers[email as keyof typeof demoUsers].role :
          "resident",
        barangay: "Barangay 728, Zone 79",
        createdAt: admin.firestore.Timestamp.now(),
        isActive: true,
        isDemoUser: isDemoUser,
      });

      // Re-fetch the document
      userDoc = await db.collection("users").doc(signInData.localId).get();
      console.log("Created and fetched user profile:", userDoc.exists);
    } else {
      console.log("User profile found in Firestore");
    }

    const userData = userDoc.data();

    // Use the ID token from Firebase Auth response
    const token = signInData.idToken || signInData.refreshToken || "";

    response.status(200).json({
      success: true,
      message: "Sign in successful.",
      user: {
        uid: signInData.localId,
        email: signInData.email || "",
        name: userData?.name || "",
        role: userData?.role || "resident",
        barangay: userData?.barangay || "Barangay 728, Zone 79",
      },
      token: token,
    });
  } catch (error: unknown) {
    console.error("Sign in error:", error);
    let message = "Sign in failed. Please try again.";
    if (error && typeof error === "object" && "code" in error) {
      const errorCode = (error as {code: string}).code;
      if (errorCode === "auth/user-not-found") {
        message = "No account found with this email.";
      } else if (errorCode === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (errorCode === "auth/invalid-email") {
        message = "Invalid email format.";
      }
    }

    response.status(401).json({
      success: false,
      message: message,
    });
  }
});

/**
 * Sign Up Endpoint
 * POST /signUp
 */
export const signUp = onRequest({cors: true}, async (request, response) => {
  // Set comprehensive CORS headers for all responses
  const origin = request.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    "https://hydroalert-user.web.app",
    "https://hydroalert-user.firebaseapp.com",
  ];

  if (origin && allowedOrigins.includes(origin)) {
    response.set("Access-Control-Allow-Origin", origin);
  } else {
    response.set("Access-Control-Allow-Origin", "*");
  }

  response.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  response.set("Access-Control-Allow-Credentials", "true");
  response.set("Access-Control-Max-Age", "86400"); // 24 hours

  // Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({
      success: false,
      message: "Method Not Allowed. Use POST.",
    });
    return;
  }

  try {
    const {email, password, name, role, barangay}: SignUpRequest = request.body;

    if (!email || !password || !name || !role) {
      response.status(400).json({
        success: false,
        message: "Email, password, name, and role are required.",
      });
      return;
    }

    // Create user with Firebase REST API (avoids permission issues)
    const firebaseApiKey = "AIzaSyBZOZUCWltSVebiL8sAnOTjk-28Oj6-bq0";
    const signUpUrl =
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`;

    const createUserResponse = await fetch(signUpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        displayName: name,
        returnSecureToken: true,
      }),
    });

    const createUserData = await createUserResponse.json();

    if (!createUserResponse.ok) {
      let message = "Sign up failed. Please try again.";
      let statusCode = 400;

      if (createUserData.error?.message === "EMAIL_EXISTS") {
        message = "An account with this email already exists.";
        statusCode = 409;
      } else if (createUserData.error?.message === "WEAK_PASSWORD") {
        message = "Password is too weak. Must be at least 6 characters.";
      } else if (createUserData.error?.message === "INVALID_EMAIL") {
        message = "Invalid email format.";
      } else if (createUserData.error?.message) {
        message = `Sign up failed: ${createUserData.error.message}`;
      }

      response.status(statusCode).json({
        success: false,
        message: message,
      });
      return;
    }

    const userId = createUserData.localId;
    const idToken = createUserData.idToken;

    // Save user data to Firestore
    await db.collection("users").doc(userId).set({
      email: email,
      name: name,
      role: role,
      barangay: barangay || "Barangay 728, Zone 79",
      createdAt: admin.firestore.Timestamp.now(),
      isActive: true,
    });

    response.status(200).json({
      success: true,
      message: "User account created successfully.",
      user: {
        uid: userId,
        email: email,
        name: name,
        role: role,
        barangay: barangay || "Barangay 728, Zone 79",
      },
      token: idToken,
    });
  } catch (error: unknown) {
    console.error("Sign up error:", error);
    console.error("Error type:", typeof error);
    console.error("Error details:", JSON.stringify(error, null, 2));

    let message = "Sign up failed. Please try again.";
    let statusCode = 400;

    if (error && typeof error === "object" && "code" in error) {
      const errorCode = (error as {code: string}).code;
      console.error("Firebase error code:", errorCode);

      if (errorCode === "auth/email-already-in-use") {
        message = "An account with this email already exists.";
        statusCode = 409;
      } else if (errorCode === "auth/weak-password") {
        message = "Password is too weak. Please choose a stronger password.";
      } else if (errorCode === "auth/invalid-email") {
        message = "Invalid email format.";
      } else {
        // Include the actual error code in the message for debugging
        message = `Sign up failed: ${errorCode}`;
      }
    } else if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      message = `Sign up failed: ${error.message}`;
    }

    response.status(statusCode).json({
      success: false,
      message: message,
    });
  }
});

/**
 * Forgot Password Endpoint
 * POST /forgotPassword
 */
export const forgotPassword = onRequest({cors: true},
  async (request, response) => {
  // Set CORS headers for all responses
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    if (request.method !== "POST") {
      response.status(405).json({
        success: false,
        message: "Method Not Allowed. Use POST.",
      });
      return;
    }

    try {
      const {email} = request.body;

      if (!email) {
        response.status(400).json({
          success: false,
          message: "Email is required.",
        });
        return;
      }

      // Send password reset email using Firebase REST API
      const firebaseApiKey = "AIzaSyBZOZUCWltSVebiL8sAnOTjk-28Oj6-bq0";
      const resetPasswordUrl =
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${firebaseApiKey}`;

      const resetResponse = await fetch(resetPasswordUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: email,
        }),
      });

      const resetData = await resetResponse.json();

      if (!resetResponse.ok) {
        let message = "Failed to send reset email. Please try again.";

        if (resetData.error?.message === "EMAIL_NOT_FOUND") {
          message = "No account found with this email.";
        } else if (resetData.error?.message === "INVALID_EMAIL") {
          message = "Invalid email format.";
        } else if (resetData.error?.message) {
          message = `Failed to send reset email: ${resetData.error.message}`;
        }

        response.status(400).json({
          success: false,
          message: message,
        });
        return;
      }

      console.log("Password reset email sent successfully to:", email);

      response.status(200).json({
        success: true,
        message: "Password reset email sent. Please check your inbox.",
      });
    } catch (error: unknown) {
      console.error("Forgot password error:", error);
      let message = "Failed to send reset email. Please try again.";

      if (error instanceof Error) {
        console.error("Error message:", error.message);
        message = `Failed to send reset email: ${error.message}`;
      }

      response.status(400).json({
        success: false,
        message: message,
      });
    }
  });

/**
 * Get User Profile Endpoint
 * GET /userProfile
 */
export const getUserProfile = onRequest({cors: true},
  async (request, response) => {
  // Set CORS headers for all responses
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    if (request.method !== "GET") {
      response.status(405).json({
        success: false,
        message: "Method Not Allowed. Use GET.",
      });
      return;
    }

    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        response.status(401).json({
          success: false,
          message: "Authorization token required.",
        });
        return;
      }

      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;

      // Get user data from Firestore
      const userDoc = await db.collection("users").doc(uid).get();

      if (!userDoc.exists) {
        response.status(404).json({
          success: false,
          message: "User profile not found.",
        });
        return;
      }

      const userData = userDoc.data();

      response.status(200).json({
        success: true,
        message: "User profile retrieved successfully.",
        user: {
          uid: uid,
          email: userData?.email || "",
          name: userData?.name || "",
          role: userData?.role || "resident",
          barangay: userData?.barangay || "Barangay 728, Zone 79",
        },
      });
    } catch (error: unknown) {
      console.error("Get user profile error:", error);
      response.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }
  });

// --- Get User Location Data ---
export const getUserLocation = onRequest(async (request, response) => {
  // Enable CORS
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response.status(401).json({
        success: false,
        message: "Authorization token required.",
      });
      return;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get user profile from Firestore
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      response.status(404).json({
        success: false,
        message: "User profile not found.",
      });
      return;
    }

    const userData = userDoc.data();

    // Return location data
    response.status(200).json({
      success: true,
      data: {
        location: userData?.barangay || "Barangay 728, Zone 79, Manila",
        coordinates: userData?.coordinates || {
          latitude: 14.5995,
          longitude: 120.9842,
        },
        monitoringArea: userData?.monitoringArea ||
          "Barangay 728 Flood Monitoring Zone",
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("Get user location error:", error);
    response.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
});
