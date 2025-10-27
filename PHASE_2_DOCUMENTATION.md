# Phase 2: Core Data Engine Activation Documentation

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [IoT Data Ingestion Pipeline](#iot-data-ingestion-pipeline)
4. [PAGASA API Polling Service](#pagasa-api-polling-service)
5. [AI Risk Decision Scheduler](#ai-risk-decision-scheduler)
6. [Deployment Guide](#deployment-guide)
7. [Configuration Management](#configuration-management)
8. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
9. [Security Considerations](#security-considerations)
10. [Testing and Validation](#testing-and-validation)

---

## Overview

Phase 2 focuses on deploying the core data processing engine that powers HydroAlert's real-time flood monitoring capabilities. This phase involves three critical components:

1. **IoT Data Ingestion Pipeline** - Secure endpoint for receiving sensor data
2. **PAGASA API Polling Service** - Automated weather data collection
3. **AI Risk Decision Scheduler** - Real-time risk assessment and alert generation

### Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   IoT Sensors   │───▶│  Data Ingestion  │───▶│  Risk Scheduler │
│                 │    │     Pipeline     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Firestore DB   │    │  Alert System   │
                       │                  │    │                 │
                       └──────────────────┘    └─────────────────┘
                                ▲
                                │
                       ┌──────────────────┐
                       │ PAGASA API Poll  │
                       │     Service      │
                       └──────────────────┘
```

---

## Prerequisites

### System Requirements
- Node.js 22.x or higher
- Firebase CLI 12.x or higher
- Firebase project with Firestore enabled
- Active PAGASA API access (if available)

### Required Dependencies
```json
{
  "firebase-admin": "^12.6.0",
  "firebase-functions": "^6.0.1",
  "axios": "^1.12.2"
}
```

### Environment Setup
1. Ensure Firebase project is properly configured
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Login to Firebase: `firebase login`
4. Initialize project: `firebase init functions`

---

## IoT Data Ingestion Pipeline

### Overview
The IoT Data Ingestion Pipeline provides a secure HTTP endpoint for IoT devices to submit sensor readings. It validates, processes, and stores raw sensor data while triggering the risk assessment system.

### Key Features
- **Secure Authentication**: API key-based authentication
- **Data Validation**: Comprehensive input validation
- **Real-time Processing**: Immediate data processing and storage
- **CORS Support**: Cross-origin resource sharing for web applications
- **Error Handling**: Robust error handling and logging

### Endpoint Details
- **URL**: `https://[REGION]-[PROJECT_ID].cloudfunctions.net/ingestIoTData`
- **Method**: POST
- **Authentication**: X-API-Key header
- **Content-Type**: application/json

### Request Format
```json
{
  "locationId": "sensor_001",
  "waterLevel": 1.2,
  "timestamp": 1703123456,
  "temperature": 25.5,
  "batteryLevel": 85
}
```

### Response Format
```json
{
  "status": "success",
  "message": "Data accepted and logged."
}
```

### Security Configuration
```typescript
// Configure your IoT secret key
const IOT_SECRET_KEY = "YOUR_SECURE_IOT_SECRET_KEY";
```

**⚠️ Security Note**: Replace the default secret key with a strong, unique key shared only with authorized IoT devices.

### Data Flow
1. IoT device sends POST request with sensor data
2. System validates API key and request format
3. Data is stored in `rawSensorData` collection
4. Firestore trigger automatically initiates risk calculation
5. Response sent back to IoT device

### Error Handling
- **401 Unauthorized**: Invalid or missing API key
- **400 Bad Request**: Missing required fields or invalid data format
- **405 Method Not Allowed**: Non-POST requests
- **500 Internal Server Error**: Database or processing errors

---

## PAGASA API Polling Service

### Overview
The PAGASA API Polling Service automatically fetches weather data from the Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA) at regular intervals.

### Key Features
- **Scheduled Execution**: Runs every 3 hours (00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00 UTC)
- **Data Normalization**: Converts PAGASA data to standardized format
- **Error Resilience**: Continues operation even if individual API calls fail
- **Regional Focus**: Optimized for CALABARZON region and Barangay 728, Manila

### Schedule Configuration
```typescript
// Cron expression: Every 3 hours
export const pollPAGASA = onSchedule("0 */3 * * *", async () => {
  // Polling logic
});
```

### API Configuration
```typescript
// PAGASA API endpoint (replace with actual endpoint)
const PAGASA_API_URL = "https://api.pagasa.ph/weather/latest";
```

### Data Structure
The service normalizes PAGASA data into the following format:
```typescript
interface NormalizedForecast {
  fetchTimestamp: Timestamp;
  sourceTimestamp: string;
  locationRegion: "CALABARZON";
  barangayFocus: "Barangay 728, Manila";
  temperatureC: number;
  rainfallAmount: number;
  warningLevel: string;
}
```

### Storage Location
Normalized data is stored in the `pagasaForecasts` collection in Firestore.

### Error Handling
- API timeout handling
- Invalid response format detection
- Network connectivity issues
- Rate limiting considerations

---

## AI Risk Decision Scheduler

### Overview
The AI Risk Decision Scheduler is a Firestore-triggered function that automatically calculates flood risk scores when new sensor data arrives. It combines IoT sensor readings with PAGASA weather forecasts to generate real-time flood alerts.

### Key Features
- **Real-time Processing**: Triggered immediately when sensor data arrives
- **Multi-factor Analysis**: Combines sensor data and weather forecasts
- **Intelligent Scoring**: Weighted algorithm for risk assessment
- **Automatic Alert Generation**: Creates alerts based on risk levels

### Trigger Configuration
```typescript
// Triggered when new document is created in rawSensorData collection
export const calculateRiskScore = onDocumentCreated(
  "rawSensorData/{docId}", async (event) => {
    // Risk calculation logic
  }
);
```

### Risk Calculation Algorithm

#### Scoring Components
1. **Sensor Data Contribution (60% weight)**
   - Water level measurements
   - Critical threshold: 1.5 meters
   - Formula: `Math.min(1, waterLevel / CRITICAL_WATER_LEVEL) * 60`

2. **Weather Forecast Contribution (40% weight)**
   - Rainfall amount analysis
   - PAGASA warning levels
   - Formula: Rainfall + Warning Level adjustments

#### Risk Levels
- **Low (0-24)**: Normal conditions
- **Moderate (25-49)**: Increased monitoring recommended
- **High (50-74)**: Prepare for evacuation
- **Critical (75-100)**: Immediate evacuation recommended

### Alert Generation
```typescript
interface Alert {
  locationId: string;
  riskScore: number;
  severity: "Low" | "Moderate" | "High" | "Critical";
  message: string;
  timestamp: Timestamp;
  location: {
    lat: number;
    long: number;
    city: string;
  };
}
```

### Data Integration
The scheduler integrates data from:
- `rawSensorData` collection (IoT readings)
- `pagasaForecasts` collection (weather data)
- Generates alerts in `alerts` collection

---

## Deployment Guide

### Step 1: Environment Preparation
```bash
# Navigate to backend directory
cd Hydro_Alert/Backend

# Install dependencies
cd functions
npm install

# Build the project
npm run build
```

### Step 2: Configuration Setup
1. **Update IoT Secret Key**:
   ```typescript
   const IOT_SECRET_KEY = "your-secure-random-key-here";
   ```

2. **Configure PAGASA API**:
   ```typescript
   const PAGASA_API_URL = "https://actual-pagasa-api-endpoint.com";
   ```

3. **Update Location Coordinates**:
   ```typescript
   // Update coordinates for your specific monitoring area
   location: {
     lat: 14.6042,  // Your latitude
     long: 120.9822, // Your longitude
     city: "Manila", // Your city
   }
   ```

### Step 3: Firebase Deployment
```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:ingestIoTData
firebase deploy --only functions:pollPAGASA
firebase deploy --only functions:calculateRiskScore
```

### Step 4: Verification
```bash
# Check deployment status
firebase functions:list

# View function logs
firebase functions:log

# Test IoT endpoint
curl -X POST https://[REGION]-[PROJECT_ID].cloudfunctions.net/ingestIoTData \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{"locationId":"test","waterLevel":1.0,"timestamp":1703123456}'
```

---

## Configuration Management

### Environment Variables
For production deployments, use Firebase environment configuration:

```bash
# Set environment variables
firebase functions:config:set \
  iot.secret_key="your-production-secret" \
  pagasa.api_url="https://production-pagasa-api.com" \
  monitoring.critical_water_level="1.5"
```

### Accessing Configuration
```typescript
import * as functions from 'firebase-functions';

const config = functions.config();
const IOT_SECRET_KEY = config.iot.secret_key;
const PAGASA_API_URL = config.pagasa.api_url;
```

### Firestore Security Rules
Ensure proper security rules for data collections:

```javascript
// Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Raw sensor data - write only for IoT devices
    match /rawSensorData/{document} {
      allow write: if request.auth != null;
      allow read: if false; // Only system can read
    }
    
    // PAGASA forecasts - system write, public read
    match /pagasaForecasts/{document} {
      allow write: if request.auth != null;
      allow read: if true;
    }
    
    // Alerts - system write, authenticated read
    match /alerts/{document} {
      allow write: if request.auth != null;
      allow read: if request.auth != null;
    }
  }
}
```

---

## Monitoring and Troubleshooting

### Logging and Monitoring
```bash
# View real-time logs
firebase functions:log --follow

# View specific function logs
firebase functions:log --only ingestIoTData

# Check function metrics
firebase functions:list
```

### Common Issues and Solutions

#### 1. IoT Data Ingestion Issues
**Problem**: 401 Unauthorized errors
**Solution**: 
- Verify API key configuration
- Check X-API-Key header format
- Ensure secret key matches between client and server

**Problem**: 400 Bad Request errors
**Solution**:
- Validate JSON format
- Check required fields (locationId, waterLevel, timestamp)
- Verify data types (waterLevel must be number)

#### 2. PAGASA API Polling Issues
**Problem**: API timeout or connection errors
**Solution**:
- Verify PAGASA API endpoint URL
- Check network connectivity
- Implement retry logic for failed requests

**Problem**: Invalid data format
**Solution**:
- Update data parsing logic for API response changes
- Add data validation for new fields
- Handle missing or null values

#### 3. Risk Calculation Issues
**Problem**: No alerts being generated
**Solution**:
- Check Firestore trigger configuration
- Verify data exists in both sensor and forecast collections
- Review risk calculation thresholds

**Problem**: Incorrect risk scores
**Solution**:
- Validate sensor data ranges
- Check weather data integration
- Review algorithm weights and thresholds

### Performance Optimization
```typescript
// Optimize Firestore queries
const latestForecastSnapshot = await db.collection("pagasaForecasts")
  .orderBy("fetchTimestamp", "desc")
  .limit(1)
  .get();

// Use batch writes for multiple operations
const batch = db.batch();
batch.set(alertRef, newAlert);
await batch.commit();
```

---

## Security Considerations

### API Security
1. **Strong Authentication**: Use cryptographically secure random keys
2. **Rate Limiting**: Implement request rate limiting
3. **Input Validation**: Validate all incoming data
4. **CORS Configuration**: Restrict CORS to known domains

### Data Security
1. **Encryption**: All data encrypted in transit and at rest
2. **Access Control**: Implement proper Firestore security rules
3. **Audit Logging**: Log all data access and modifications
4. **Key Rotation**: Regularly rotate API keys

### Network Security
1. **HTTPS Only**: All communications over HTTPS
2. **Firewall Rules**: Restrict access to necessary ports
3. **VPN Access**: Use VPN for administrative access
4. **Monitoring**: Monitor for suspicious activity

---

## Testing and Validation

### Unit Testing
```typescript
// Example test for risk calculation
import { calculateRiskScore } from '../src/index';

describe('Risk Calculation', () => {
  test('should calculate high risk for critical water level', () => {
    const sensorData = {
      waterLevel: 2.0, // Above critical threshold
      locationId: 'test',
      timestamp: Date.now() / 1000
    };
    
    const result = calculateRiskScore(sensorData, mockForecastData);
    expect(result.riskScore).toBeGreaterThan(75);
    expect(result.severity).toBe('Critical');
  });
});
```

### Integration Testing
```bash
# Test IoT endpoint
curl -X POST https://[REGION]-[PROJECT_ID].cloudfunctions.net/ingestIoTData \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-key" \
  -d '{"locationId":"test-sensor","waterLevel":1.2,"timestamp":1703123456}'

# Verify data in Firestore
# Check alerts collection for generated alerts
```

### Load Testing
```bash
# Use tools like Apache Bench or Artillery for load testing
ab -n 1000 -c 10 -H "X-API-Key: your-key" \
  -H "Content-Type: application/json" \
  -p test-data.json \
  https://[REGION]-[PROJECT_ID].cloudfunctions.net/ingestIoTData
```

### Validation Checklist
- [ ] IoT data ingestion working correctly
- [ ] PAGASA API polling functioning
- [ ] Risk calculation generating appropriate alerts
- [ ] Security measures properly implemented
- [ ] Error handling working as expected
- [ ] Performance meets requirements
- [ ] Logging and monitoring operational

---

## Next Steps

After successful Phase 2 deployment:

1. **Phase 3**: Frontend Integration and User Interface
2. **Phase 4**: Advanced Analytics and Reporting
3. **Phase 5**: Mobile Application Development
4. **Phase 6**: System Optimization and Scaling

### Maintenance Tasks
- Regular security key rotation
- Performance monitoring and optimization
- API endpoint health checks
- Data backup and recovery procedures
- Documentation updates

---

## Support and Resources

### Documentation References
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [PAGASA API Documentation](https://www.pagasa.dost.gov.ph/)

### Contact Information
- Technical Support: [Your support email]
- Emergency Contact: [Your emergency contact]
- Documentation Updates: [Your documentation contact]

---

*This documentation is part of the HydroAlert project and should be updated as the system evolves.*
