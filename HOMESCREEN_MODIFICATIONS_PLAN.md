# HomeScreen Dynamic Data Implementation Plan

## 📊 Current State Analysis

### **What HomeScreen Currently Has:**
- ✅ **Static/Mock Data** (Lines 22-26)
  ```typescript
  const [floodStatus] = useState<FloodStatus>('warning');  // HARDCODED
  const [waterLevel] = useState(8);  // HARDCODED - cm
  const [rainfallIntensity] = useState(5.2);  // HARDCODED - mm/hr
  const [lastUpdated] = useState(new Date());  // HARDCODED
  ```
- ✅ **User Location Fetch** (Lines 41-137) - Already dynamic! ✨
- ✅ **UI Components** - Complete and functional
- ✅ **Report/Rescue Dialogs** - Complete but send mock data

### **What Needs to Be Made Dynamic:**
1. ❌ **Flood Status** - Currently hardcoded as `'warning'`
2. ❌ **Water Level** - Currently hardcoded as `8 cm`
3. ❌ **Rainfall Intensity** - Currently hardcoded as `5.2 mm/hr`
4. ❌ **Last Updated Timestamp** - Currently hardcoded as `new Date()`
5. ❌ **Report Submission** - Currently just console.log (Line 285)
6. ❌ **Rescue Request** - Currently just console.log (Line 295)

---

## 🗄️ Available Backend Resources

### **Firestore Collections:**

1. **`rawSensorData`** - Raw IoT sensor readings
   ```typescript
   {
     locationId: string,
     waterLevel: number,  // ← Use this!
     timestamp: Timestamp,
     temperature?: number,
     batteryLevel?: number,
     receivedAt: Timestamp
   }
   ```

2. **`pagasaForecasts`** - Weather data from PAGASA
   ```typescript
   {
     fetchTimestamp: Timestamp,
     sourceTimestamp: string,
     locationRegion: string,
     barangayFocus: string,
     temperatureC: number,
     rainfallAmount: number,  // ← Use this!
     warningLevel: string
   }
   ```

3. **`alerts`** - Calculated risk alerts
   ```typescript
   {
     locationId: string,
     riskScore: number,  // 0-100
     severity: string,  // "Low" | "Moderate" | "High" | "Critical"
     message: string,
     timestamp: Timestamp,
     location: {
       lat: number,
       long: number,
       city: string
     }
   }
   ```

4. **`users`** - User profiles
   ```typescript
   {
     email: string,
     name: string,
     role: string,
     barangay: string,
     coordinates?: {
       latitude: number,
       longitude: number
     }
   }
   ```

### **Cloud Function Endpoints:**

1. ✅ **`getUserLocation`** - Already used! (Line 53)
   - URL: `https://us-central1-hydroalert-user.cloudfunctions.net/getUserLocation`
   - Method: GET
   - Auth: Bearer token required

2. ❌ **Missing Endpoints Needed:**
   - `getFloodStatus` - Get current flood status for user's location
   - `getSensorData` - Get latest sensor readings
   - `submitReport` - Submit flood condition reports
   - `requestRescue` - Submit rescue requests

---

## 🎯 Implementation Plan

### **Phase 1: Create Missing Backend Endpoints** 🔧

#### **1.1 Create `getFloodStatus` Endpoint**
**Purpose:** Get current flood status, water level, and risk data for user's location

**File:** `Backend/functions/src/index.ts`

**Implementation:**
```typescript
export const getFloodStatus = onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  try {
    // Verify user token
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response.status(401).json({ success: false, message: "Authorization required." });
      return;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get user's location from profile
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      response.status(404).json({ success: false, message: "User not found." });
      return;
    }

    const userData = userDoc.data();
    const userBarangay = userData?.barangay || "Barangay 728, Zone 79";

    // Get latest alert for user's location
    const alertsSnapshot = await db.collection("alerts")
      .where("locationId", "==", userBarangay)
      .orderBy("timestamp", "desc")
      .limit(1)
      .get();

    // Get latest sensor data
    const sensorSnapshot = await db.collection("rawSensorData")
      .where("locationId", "==", userBarangay)
      .orderBy("timestamp", "desc")
      .limit(1)
      .get();

    // Get latest PAGASA data
    const pagasaSnapshot = await db.collection("pagasaForecasts")
      .orderBy("fetchTimestamp", "desc")
      .limit(1)
      .get();

    // Default values
    let floodStatus = "safe";
    let riskScore = 0;
    let waterLevel = 0;
    let rainfallIntensity = 0;
    let lastUpdated = new Date();

    // Process alert data
    if (!alertsSnapshot.empty) {
      const alert = alertsSnapshot.docs[0].data();
      riskScore = alert.riskScore || 0;
      
      // Map severity to flood status
      if (alert.severity === "Critical") floodStatus = "danger";
      else if (alert.severity === "High") floodStatus = "warning";
      else if (alert.severity === "Moderate") floodStatus = "monitoring";
      else floodStatus = "safe";

      lastUpdated = alert.timestamp?.toDate() || new Date();
    }

    // Process sensor data
    if (!sensorSnapshot.empty) {
      const sensor = sensorSnapshot.docs[0].data();
      waterLevel = sensor.waterLevel || 0;
    }

    // Process PAGASA data
    if (!pagasaSnapshot.empty) {
      const pagasa = pagasaSnapshot.docs[0].data();
      rainfallIntensity = pagasa.rainfallAmount || 0;
    }

    // Return comprehensive flood status
    response.status(200).json({
      success: true,
      data: {
        floodStatus,
        riskScore,
        waterLevel,
        rainfallIntensity,
        lastUpdated: lastUpdated.toISOString(),
        location: userBarangay
      }
    });

  } catch (error: unknown) {
    console.error("Get flood status error:", error);
    response.status(500).json({
      success: false,
      message: "Failed to fetch flood status."
    });
  }
});
```

#### **1.2 Create `submitReport` Endpoint**
**Purpose:** Submit user flood condition reports

**Implementation:**
```typescript
export const submitReport = onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ success: false, message: "Method not allowed." });
    return;
  }

  try {
    // Verify user token
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response.status(401).json({ success: false, message: "Authorization required." });
      return;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get user data
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      response.status(404).json({ success: false, message: "User not found." });
      return;
    }

    const userData = userDoc.data();
    const { condition, details, location } = request.body;

    // Validate input
    if (!condition) {
      response.status(400).json({ success: false, message: "Condition is required." });
      return;
    }

    // Save report to Firestore
    const reportData = {
      userId,
      userName: userData?.name || "Anonymous",
      userEmail: userData?.email || "",
      barangay: userData?.barangay || "Unknown",
      condition,
      details: details || "",
      location: location || {
        lat: userData?.coordinates?.latitude || 0,
        lng: userData?.coordinates?.longitude || 0
      },
      timestamp: admin.firestore.Timestamp.now(),
      status: "pending", // pending, verified, resolved
      type: "user_report"
    };

    await db.collection("reports").add(reportData);

    console.log(`Report submitted by user ${userId}: ${condition}`);

    response.status(200).json({
      success: true,
      message: "Report submitted successfully.",
      reportId: reportData.timestamp.toMillis().toString()
    });

  } catch (error: unknown) {
    console.error("Submit report error:", error);
    response.status(500).json({
      success: false,
      message: "Failed to submit report."
    });
  }
});
```

#### **1.3 Create `requestRescue` Endpoint**
**Purpose:** Submit emergency rescue requests

**Implementation:**
```typescript
export const requestRescue = onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ success: false, message: "Method not allowed." });
    return;
  }

  try {
    // Verify user token
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response.status(401).json({ success: false, message: "Authorization required." });
      return;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get user data
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      response.status(404).json({ success: false, message: "User not found." });
      return;
    }

    const userData = userDoc.data();
    const { location, phone, emergencyDetails } = request.body;

    // Validate input
    if (!location || !location.lat || !location.lng) {
      response.status(400).json({ success: false, message: "Location is required." });
      return;
    }

    // Save rescue request to Firestore with HIGH PRIORITY
    const rescueData = {
      userId,
      userName: userData?.name || "Anonymous",
      userEmail: userData?.email || "",
      phone: phone || userData?.phone || "Not provided",
      barangay: userData?.barangay || "Unknown",
      location: {
        lat: location.lat,
        lng: location.lng,
        address: userData?.barangay || "Unknown location"
      },
      emergencyDetails: emergencyDetails || "",
      timestamp: admin.firestore.Timestamp.now(),
      status: "pending", // pending, dispatched, completed, cancelled
      priority: "URGENT",
      type: "rescue_request"
    };

    const rescueRef = await db.collection("rescueRequests").add(rescueData);

    // Log for emergency dispatch
    console.log(`🚨 RESCUE REQUEST from ${userData?.name} at ${userData?.barangay}`);
    console.log(`Location: ${location.lat}, ${location.lng}`);
    console.log(`Phone: ${phone || "Not provided"}`);

    // TODO: Send SMS/Push notification to emergency responders
    // TODO: Trigger alert to barangay officials

    response.status(200).json({
      success: true,
      message: "Emergency request sent! Help is on the way.",
      rescueId: rescueRef.id
    });

  } catch (error: unknown) {
    console.error("Request rescue error:", error);
    response.status(500).json({
      success: false,
      message: "Failed to send rescue request."
    });
  }
});
```

---

### **Phase 2: Update HomeScreen Frontend** 🎨

#### **2.1 Create New API Service**
**File:** `Frontend/Hydro_Alert_User/src/services/floodDataApi.ts` (NEW FILE)

```typescript
import { auth } from '../firebaseConfig';

interface FloodStatusData {
  floodStatus: 'safe' | 'monitoring' | 'warning' | 'danger';
  riskScore: number;
  waterLevel: number;
  rainfallIntensity: number;
  lastUpdated: string;
  location: string;
}

interface ReportSubmission {
  condition: string;
  details: string;
  location: { lat: number; lng: number };
}

interface RescueRequest {
  location: { lat: number; lng: number };
  phone?: string;
  emergencyDetails?: string;
}

class FloodDataApiService {
  private readonly BASE_URL = 'https://us-central1-hydroalert-user.cloudfunctions.net';

  private async getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }
    return await user.getIdToken();
  }

  async getFloodStatus(): Promise<FloodStatusData> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.BASE_URL}/getFloodStatus`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch flood status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch flood status');
      }
    } catch (error) {
      console.error('Get flood status error:', error);
      throw error;
    }
  }

  async submitReport(report: ReportSubmission): Promise<void> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.BASE_URL}/submitReport`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit report: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Submit report error:', error);
      throw error;
    }
  }

  async requestRescue(rescue: RescueRequest): Promise<void> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.BASE_URL}/requestRescue`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rescue),
      });

      if (!response.ok) {
        throw new Error(`Failed to request rescue: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to request rescue');
      }
    } catch (error) {
      console.error('Request rescue error:', error);
      throw error;
    }
  }
}

export const floodDataApi = new FloodDataApiService();
```

#### **2.2 Update HomeScreen Component**
**File:** `Frontend/Hydro_Alert_User/src/components/HomeScreen.tsx`

**Changes:**

1. **Import the new API service** (Add at top):
```typescript
import { floodDataApi } from '../services/floodDataApi';
```

2. **Replace mock data state** (Replace lines 22-26):
```typescript
// BEFORE (Mock data):
const [floodStatus] = useState<FloodStatus>('warning');
const [waterLevel] = useState(8);
const [rainfallIntensity] = useState(5.2);
const [lastUpdated] = useState(new Date());

// AFTER (Dynamic data):
const [floodStatus, setFloodStatus] = useState<FloodStatus>('safe');
const [waterLevel, setWaterLevel] = useState(0);
const [rainfallIntensity, setRainfallIntensity] = useState(0);
const [lastUpdated, setLastUpdated] = useState(new Date());
const [dataLoading, setDataLoading] = useState(false);
```

3. **Add useEffect to fetch flood data** (Add after location useEffect):
```typescript
// Fetch real-time flood status data
useEffect(() => {
  const fetchFloodStatus = async () => {
    setDataLoading(true);
    
    try {
      const data = await floodDataApi.getFloodStatus();
      
      setFloodStatus(data.floodStatus);
      setWaterLevel(data.waterLevel);
      setRainfallIntensity(data.rainfallIntensity);
      setLastUpdated(new Date(data.lastUpdated));
      
      console.log('✅ Flood status fetched:', data);
    } catch (error) {
      console.error('❌ Failed to fetch flood status:', error);
      // Keep default/previous values on error
    } finally {
      setDataLoading(false);
    }
  };

  // Fetch immediately
  fetchFloodStatus();

  // Refresh every 5 minutes (300000 ms)
  const interval = setInterval(fetchFloodStatus, 300000);

  return () => clearInterval(interval);
}, []); // Run once on mount
```

4. **Update report submission** (Replace handleSubmitReport function):
```typescript
const handleSubmitReport = async () => {
  try {
    await floodDataApi.submitReport({
      condition: reportCondition,
      details: reportDetails,
      location: userLocation
    });
    
    setReportDialogOpen(false);
    setReportCondition('');
    setReportDetails('');
    
    alert(t.notifications.reportSuccess);
  } catch (error) {
    console.error('Failed to submit report:', error);
    alert('Failed to submit report. Please try again.');
  }
};
```

5. **Update rescue request** (Replace handleRequestRescue function):
```typescript
const handleRequestRescue = async () => {
  try {
    await floodDataApi.requestRescue({
      location: userLocation,
      // phone can be added via dialog form if needed
      emergencyDetails: '' // Can be added via dialog form
    });
    
    setRescueDialogOpen(false);
    alert(t.notifications.rescueSuccess);
  } catch (error) {
    console.error('Failed to request rescue:', error);
    alert('Failed to send rescue request. Please try again.');
  }
};
```

6. **Add loading indicator** (Update water level and rainfall cards):
```typescript
<p className="text-blue-600">
  {dataLoading ? (
    <span className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      Loading...
    </span>
  ) : (
    `${waterLevel} cm`
  )}
</p>
```

---

## 📋 Implementation Checklist

### **Backend Tasks:**
- [ ] Create `getFloodStatus` Cloud Function
- [ ] Create `submitReport` Cloud Function
- [ ] Create `requestRescue` Cloud Function
- [ ] Deploy all new functions: `firebase deploy --only functions`
- [ ] Test endpoints with Postman/curl
- [ ] Verify Firestore collections are created
- [ ] Add indexes if needed for queries

### **Frontend Tasks:**
- [ ] Create `floodDataApi.ts` service file
- [ ] Update HomeScreen imports
- [ ] Replace mock state with dynamic state
- [ ] Add useEffect for fetching flood data
- [ ] Update handleSubmitReport function
- [ ] Update handleRequestRescue function
- [ ] Add loading indicators
- [ ] Test with real authentication
- [ ] Add error handling UI
- [ ] Test auto-refresh (5-minute intervals)

### **Testing Tasks:**
- [ ] Test flood status fetch on page load
- [ ] Test auto-refresh every 5 minutes
- [ ] Test report submission
- [ ] Test rescue request
- [ ] Test with different user roles
- [ ] Test error scenarios (network failure, token expiry)
- [ ] Test with different flood status levels
- [ ] Test location-based data filtering

### **Documentation Tasks:**
- [ ] Document new API endpoints
- [ ] Update API documentation
- [ ] Add inline code comments
- [ ] Create user testing guide
- [ ] Update README with new features

---

## 🎯 Expected Outcome

### **After Implementation:**

1. ✅ **HomeScreen displays REAL data:**
   - Flood status from `alerts` collection
   - Water level from `rawSensorData` collection
   - Rainfall from `pagasaForecasts` collection
   - All data specific to user's barangay

2. ✅ **Auto-refresh every 5 minutes:**
   - Users see up-to-date information
   - No need to manually refresh

3. ✅ **Reports are saved to database:**
   - Stored in `reports` collection
   - Available for officials to review
   - Tracked with user information

4. ✅ **Rescue requests trigger alerts:**
   - Stored in `rescueRequests` collection
   - High priority flagged
   - Emergency responders notified

5. ✅ **Location-based personalization:**
   - Each user sees data for their barangay
   - Location determined from user profile
   - Dynamic and accurate

---

## 🚀 Deployment Strategy

### **Phase 1: Backend Deployment**
```bash
# Build and deploy new functions
cd Backend/functions
npm run build
firebase deploy --only functions:getFloodStatus,functions:submitReport,functions:requestRescue
```

### **Phase 2: Frontend Update**
```bash
# Create API service
# Update HomeScreen
# Test locally
cd Frontend/Hydro_Alert_User
npm run dev
```

### **Phase 3: Integration Testing**
```bash
# Test all features together
# Verify data flow
# Check error handling
```

### **Phase 4: Production Deployment**
```bash
# Build production frontend
npm run build

# Deploy to hosting
firebase deploy --only hosting
```

---

## 📊 Timeline Estimate

| Task | Time Estimate | Priority |
|------|---------------|----------|
| Backend: getFloodStatus | 2 hours | 🔴 High |
| Backend: submitReport | 1 hour | 🟡 Medium |
| Backend: requestRescue | 1.5 hours | 🔴 High |
| Backend Testing | 1 hour | 🔴 High |
| Frontend: API Service | 1 hour | 🔴 High |
| Frontend: HomeScreen Updates | 2 hours | 🔴 High |
| Frontend: Error Handling | 1 hour | 🟡 Medium |
| Integration Testing | 2 hours | 🔴 High |
| Documentation | 1 hour | 🟢 Low |
| **Total** | **12.5 hours** | |

---

## 💡 Additional Enhancements (Future)

1. **Real-time Updates with WebSockets**
   - Use Firebase Realtime Database
   - Push updates immediately
   - No need to poll every 5 minutes

2. **Photo Upload for Reports**
   - Firebase Storage integration
   - Image compression
   - Preview before upload

3. **Push Notifications**
   - Firebase Cloud Messaging
   - Alert users of danger status
   - Rescue request confirmations

4. **Offline Support**
   - Cache last known data
   - Service Workers
   - Progressive Web App (PWA)

5. **Historical Data Charts**
   - Water level trends
   - Rainfall patterns
   - Risk score history

---

**Next Step:** Merge authentication to main, then create `feature/homescreen-dynamic-data` branch and start implementation! 🚀

