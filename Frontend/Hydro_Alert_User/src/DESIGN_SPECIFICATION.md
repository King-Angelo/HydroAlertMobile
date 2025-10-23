# Hydro Alert - Design & Interaction Specification

## 📋 Document Overview

This document provides a comprehensive, step-by-step technical specification for all core modules of the Hydro Alert mobile application, focusing on **Awareness, Alert, Route, and Response** objectives. Each section details user workflows, data integration, system feedback mechanisms, and real-time update logic.

---

## 1. Authentication and Role-Based Access Control (RBAC)

### 1.1 Sign-In Flow

#### **User Journey**
1. **Initial Screen**: User opens app → Presented with Sign-In Screen (`/components/SignInScreen.tsx`)
2. **Credential Entry**:
   - User enters email/username in text field
   - User enters password (masked by default, toggleable via eye icon)
3. **Validation Trigger**: User taps "Sign In" button
4. **Loading State**: Button shows spinner + "Signing in..." text (disabled during processing)
5. **Authentication Process**:
   ```javascript
   // Pseudocode for authentication logic
   IF credentials match database:
     → Retrieve user profile including role
     → Create UserSession object:
       {
         id: "unique_user_id",
         username: "user_name",
         email: "user@email.com",
         role: "resident" | "official" | "administrator",
         name: "Full Name",
         barangay: "Barangay 728, Zone 79"
       }
     → Store in App state: setUserSession(userSession)
     → Persist to localStorage: 'hydroalert_user_session'
     → Route based on role (see 1.2)
   ELSE:
     → Display error message (localized)
     → Clear password field
     → Re-enable form
   ```

#### **Role Retrieval & Storage**
- **Data Source**: Mock user database (production: backend API)
- **Session Object Structure**:
  ```typescript
  interface UserSession {
    id: string;
    username: string;
    email: string;
    role: 'resident' | 'official' | 'administrator';
    name: string;
    barangay: string;
  }
  ```
- **State Management**:
  - Primary: React state in `App.tsx` → `const [userSession, setUserSession] = useState<UserSession | null>(null)`
  - Persistence: `localStorage.setItem('hydroalert_user_session', JSON.stringify(userSession))`
  - Restoration: On app load, check localStorage and restore session

#### **Demo Mode**
- **Purpose**: Quick role testing without credentials
- **Flow**:
  1. User selects role from dropdown (Resident/Official/Administrator)
  2. Taps "Sign In as Demo User"
  3. System creates pre-configured UserSession for that role
  4. Immediate sign-in (no validation)

### 1.2 Role Differentiation

#### **Post-Authentication Routing Logic**
```typescript
// App.tsx routing decision
IF userSession.role === 'resident':
  → Navigate to 'home' screen
  → Show standard navigation bar (5 items)

ELSE IF userSession.role === 'official':
  → Navigate to 'dashboard' screen (OfficialDashboard)
  → Show official navigation bar (5 items, Dashboard replaces Home)

ELSE IF userSession.role === 'administrator':
  → Navigate to 'dashboard' screen (AdminDashboard)
  → Show admin navigation bar (5 items, Admin replaces Home)
```

#### **Navigation Bar Composition**

**Resident Navigation** (5 items):
| Position | Icon | Label (EN) | Label (FIL) | Route | Description |
|----------|------|------------|-------------|-------|-------------|
| 1 | Home | Home | Home | `/home` | Flood status dashboard |
| 2 | Map | Map | Mapa | `/map` | Evacuation routes |
| 3 | Bell | Alerts | Alerto | `/alerts` | Notification log |
| 4 | MessageSquare | AI Help | AI Tulong | `/chatbot` | AI chatbot |
| 5 | Settings | Settings | Settings | `/settings` | App settings |

**Official Navigation** (5 items):
| Position | Icon | Label (EN) | Label (FIL) | Route | Description |
|----------|------|------------|-------------|-------|-------------|
| 1 | BarChart3 | Dashboard | Dashboard | `/dashboard` | **Official command center** |
| 2 | Map | Map | Mapa | `/map` | Route planning |
| 3 | Bell | Alerts | Alerto | `/alerts` | System notifications |
| 4 | MessageSquare | AI Help | AI Tulong | `/chatbot` | Decision support |
| 5 | Settings | Settings | Settings | `/settings` | Settings + Sign Out |

**Administrator Navigation** (5 items):
| Position | Icon | Label (EN) | Label (FIL) | Route | Description |
|----------|------|------------|-------------|-------|-------------|
| 1 | BarChart3 | Admin | Admin | `/dashboard` | **System administration** |
| 2 | Map | Map | Mapa | `/map` | Infrastructure overview |
| 3 | Bell | Alerts | Alerto | `/alerts` | System alerts |
| 4 | MessageSquare | AI Help | AI Tulong | `/chatbot` | Support tool |
| 5 | Settings | Settings | Settings | `/settings` | Config + Sign Out |

#### **Visual & Functional Changes for Officials**

**New Dashboard Access** (`/components/OfficialDashboard.tsx`):
1. **Statistics Overview** (4 cards):
   - Active Reports (orange card)
   - Pending Rescue Requests (red card)
   - People Evacuated (green card)
   - Shelter Capacity % (blue card)

2. **Tabbed Interface**:
   - **Tab 1: Community Reports**
     - List of flood reports from residents
     - Priority badges (Low/Medium/High)
     - Status indicators (Pending/Verified/Resolved)
     - Action buttons: "Verify", "View Location", "Mark Resolved"
   - **Tab 2: Rescue Requests**
     - SOS requests with timestamps
     - Location coordinates
     - Number of people
     - Action button: "Dispatch Team"

3. **Evacuation Center Monitoring**:
   - Real-time capacity tracking
   - Progress bars for each shelter
   - Current occupancy vs. maximum capacity

**Additional Administrator Features** (`/components/AdminDashboard.tsx`):
1. **User Management Tab**:
   - View all registered users
   - Edit user profiles
   - Enable/disable accounts
   - View last activity

2. **System Configuration Tab**:
   - **Sensor Control** (`/components/SensorDashboard.tsx` integration):
     - Toggle water level sensor on/off
     - Toggle rainfall sensor on/off
     - Toggle weather station on/off
   - **Notification Settings**:
     - Enable/disable SMS alerts
     - Enable/disable push notifications
     - Enable/disable email alerts
   - **Data Source Health**:
     - PAGASA integration status
     - Local sensor network health
     - Community reports system status

### 1.3 Sign-Out Interaction

#### **UI Location**
- **Path**: Settings Screen → Scroll to bottom → "Sign Out" section
- **Visual**: Red button with LogOut icon + confirmation dialog

#### **Step-by-Step Flow**
1. **User Action**: Taps "Sign Out" button in Settings
2. **Confirmation Dialog** (AlertDialog):
   ```
   Title: "Sign Out?"
   Message: "Are you sure you want to sign out? You'll need to sign in again to access flood alerts."
   Buttons: [Cancel] [Sign Out]
   ```
3. **User Confirms**: Taps "Sign Out" in dialog
4. **System Actions** (in order):
   ```javascript
   // App.tsx handleSignOut()
   → setUserSession(null)  // Clear state
   → localStorage.removeItem('hydroalert_user_session')  // Clear persistence
   → localStorage.removeItem('hydroalert_onboarding_complete')  // Clear onboarding flag
   → setCurrentScreen('home')  // Reset screen
   → Navigate to SignInScreen  // Auto-redirect
   ```
5. **Result**: User sees Sign-In Screen, all role-based permissions cleared

#### **Security & State Cleanup**
- **Cleared Data**:
  - User session object
  - Authentication tokens (if using backend)
  - Role-based permissions
  - Onboarding completion flag
- **Preserved Data**:
  - Language preference
  - App settings (if user re-signs in with same account)
- **No Residual Access**: All role-specific screens/features become inaccessible

---

## 2. Home Screen: Real-Time Awareness and Risk Status

### 2.1 Risk Level Update Logic

#### **Primary Risk Card** (`/components/HomeScreen.tsx`)

**Update Frequency**:
- **Real-time updates**: Every 30 seconds
- **Critical alerts**: Immediate (push notification triggers instant refresh)
- **Manual refresh**: Pull-to-refresh gesture

**Risk Calculation Algorithm**:
```javascript
// Priority-based decision tree (highest priority wins)

FUNCTION determineRiskLevel():
  // Priority 1: PAGASA Official Warnings (highest authority)
  IF PAGASA_Warning_Level === 'RED':
    RETURN {
      level: 'CRITICAL',
      color: 'red',
      action: 'EVACUATE NOW',
      icon: 'AlertTriangle',
      message: 'Immediate evacuation required. Life-threatening flooding expected.'
    }
  
  ELSE IF PAGASA_Warning_Level === 'ORANGE':
    RETURN {
      level: 'HIGH',
      color: 'orange',
      action: 'PREPARE TO EVACUATE',
      icon: 'AlertCircle',
      message: 'Prepare emergency kit. Monitor alerts closely.'
    }
  
  // Priority 2: Local IoT Sensor Readings (real-time ground truth)
  ELSE IF ANY local_sensor.waterLevel >= critical_threshold (30cm):
    RETURN {
      level: 'CRITICAL',
      color: 'red',
      action: 'EVACUATE NOW',
      icon: 'AlertTriangle',
      message: 'Critical water level detected in your area.'
    }
  
  ELSE IF ANY local_sensor.waterLevel >= alert_threshold (20cm):
    RETURN {
      level: 'HIGH',
      color: 'orange',
      action: 'PREPARE TO EVACUATE',
      icon: 'AlertCircle',
      message: 'Rising water levels detected. Stay alert.'
    }
  
  // Priority 3: Rainfall Intensity
  ELSE IF local_sensor.rainfallIntensity > 15 mm/hr AND duration > 2 hours:
    RETURN {
      level: 'MODERATE',
      color: 'yellow',
      action: 'MONITOR CONDITIONS',
      icon: 'Info',
      message: 'Heavy rainfall ongoing. Stay indoors if possible.'
    }
  
  // Priority 4: Community Reports (corroboration)
  ELSE IF community_reports.count >= 3 AND severity === 'high' AND timeframe < 30min:
    RETURN {
      level: 'MODERATE',
      color: 'yellow',
      action: 'MONITOR CONDITIONS',
      icon: 'Info',
      message: 'Flooding reported by residents in your area.'
    }
  
  // Default: Normal conditions
  ELSE:
    RETURN {
      level: 'NORMAL',
      color: 'green',
      action: 'STAY INFORMED',
      icon: 'CheckCircle',
      message: 'No immediate flood risk detected.'
    }
```

**Visual Presentation**:
- **Card Background**: Gradient based on risk color
- **Large Icon**: Risk-appropriate (Shield, AlertTriangle, Info)
- **Primary Text**: Current risk level (e.g., "CRITICAL RISK")
- **Action Button**: Color-coded CTA (e.g., "EVACUATE NOW" in red)
- **Last Updated**: Timestamp (e.g., "Updated 30 sec ago")

### 2.2 IoT Data Integration

#### **Water Level/Rainfall Widget**

**Data Source Priority**:
1. **Primary**: Nearest local sensor (within 500m of user GPS)
2. **Secondary**: Zone-wide average (all Barangay 728 sensors)
3. **Fallback**: PAGASA regional data

**Display Logic**:
```javascript
FUNCTION displaySensorData():
  // Get nearest sensor
  nearestSensor = findNearestSensor(userLocation, sensors)
  
  IF nearestSensor EXISTS:
    timeSinceLastTransmission = NOW - nearestSensor.lastTransmission
    
    IF nearestSensor.status === 'online' AND timeSinceLastTransmission < 10 minutes:
      // Display real-time data
      DISPLAY {
        waterLevel: nearestSensor.currentData.waterLevel + ' cm',
        rainfall: nearestSensor.currentData.rainfallIntensity + ' mm/hr',
        location: nearestSensor.location,
        freshness: 'Live data',
        indicator: 'green pulse icon'
      }
    
    ELSE IF timeSinceLastTransmission < 60 minutes:
      // Display stale data with warning
      DISPLAY {
        waterLevel: nearestSensor.currentData.waterLevel + ' cm',
        rainfall: nearestSensor.currentData.rainfallIntensity + ' mm/hr',
        location: nearestSensor.location,
        freshness: timeSinceLastTransmission + ' min ago',
        indicator: 'yellow warning icon',
        warning: 'Data may be outdated'
      }
    
    ELSE:
      // Sensor offline - show fallback
      DISPLAY {
        message: 'Local sensor offline',
        fallback: 'Using PAGASA regional data',
        waterLevel: PAGASA_data.regionalWaterLevel,
        rainfall: PAGASA_data.regionalRainfall,
        indicator: 'gray offline icon'
      }
  
  ELSE:
    // No local sensors - PAGASA only
    DISPLAY {
      message: 'No local sensors nearby',
      fallback: 'PAGASA Metro Manila data',
      waterLevel: PAGASA_data.regionalWaterLevel,
      rainfall: PAGASA_data.regionalRainfall
    }
```

**Offline/Failure Messaging**:
- **Sensor Offline > 1 hour**:
  ```
  ⚠️ Local Sensor Offline
  Last reading: 2 hours ago
  Using PAGASA regional data as backup
  ```
- **No Sensor Network**:
  ```
  📡 No Local Sensors Available
  Showing PAGASA Metro Manila forecast data
  For emergencies, call: 911
  ```
- **Complete Data Failure**:
  ```
  ❌ Unable to Load Data
  Please check your internet connection
  Emergency contacts available in Settings
  ```

### 2.3 Critical Alert Actions

#### **RED (Evacuate) Status Behavior**

**Automatic Triggers**:
```javascript
IF riskLevel === 'CRITICAL':
  // Immediate UI changes (non-dismissible)
  1. Full-screen overlay appears (95% opacity red gradient)
  2. Siren animation + haptic vibration (3 pulses)
  3. Auto-play audio alert (if enabled in settings)
  4. Lock home screen with critical message:
     
     🚨 CRITICAL FLOOD WARNING
     
     EVACUATE IMMEDIATELY
     
     Dangerous flooding detected in your area.
     Life-threatening conditions expected.
     
     [VIEW EVACUATION ROUTE] ← Primary CTA (full-width, pulsing)
     [CALL EMERGENCY] ← Secondary CTA
     [I'M SAFE] ← Tertiary (dismisses alert)
```

**User Interactions**:

1. **"View Evacuation Route" Button**:
   - **Action**: Immediately navigates to Map Screen
   - **Map Behavior**:
     - Auto-centers on user's current location
     - Highlights nearest safe evacuation center
     - Displays optimized route avoiding flooded areas
     - Shows "Start Navigation" button
   - **No Back Button**: User cannot return to home until marking safe or downgrade

2. **"Call Emergency" Button**:
   - **Action**: Direct phone call to Barangay 728 Emergency Hotline
   - **Fallback**: If no SIM, shows emergency contact list with copy buttons

3. **"I'm Safe" Button**:
   - **Action**: 
     - Logs user safety status (timestamp + GPS)
     - Sends confirmation to Barangay officials dashboard
     - Dismisses critical overlay
     - Returns to normal home screen
   - **Confirmation Dialog**:
     ```
     Are you in a safe location?
     
     This will confirm to officials that you've evacuated or are in a secure area.
     
     [Cancel] [Confirm I'm Safe]
     ```

**Persistent Indicators** (after dismissal):
- Red banner at top of screen: "Critical flood warning active"
- Notification badge on Alerts tab
- Quick access to evacuation map in top-right corner

---

## 3. Response & Reporting System

### 3.1 "Report Flood Condition" Flow

#### **Access Points**:
1. Home Screen → "Report Condition" button (below risk card)
2. Map Screen → Long-press on location → "Report Flooding Here"
3. Quick Action: Shake phone (if enabled) → Report dialog

#### **Submission Workflow**:

**Step 1: Report Dialog Opens**
```
Report Flood Condition

Help us keep the community informed!

MANDATORY FIELDS:
┌─────────────────────────────────┐
│ Location                        │
│ ⦿ Current Location (GPS)        │← Default selected
│ ○ Choose Different Location     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Flood Severity                  │
│ [ Ankle-deep ]                  │← Dropdown
│   (Dropdown options:             │
│    - Wet/Puddling               │
│    - Ankle-deep                 │
│    - Knee-deep                  │
│    - Waist-deep                 │
│    - Road Impassable)           │
└─────────────────────────────────┘

OPTIONAL FIELDS:
┌─────────────────────────────────┐
│ Additional Details              │
│ [Text area for description]    │← Max 200 chars
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Add Photo (Optional)            │
│ [📷 Take Photo] [🖼️ Choose]   │
└─────────────────────────────────┘

[Cancel]          [Submit Report]
```

**Step 2: Data Packet Creation**
```javascript
reportData = {
  id: generateUniqueID(),
  reporter: {
    userId: userSession.id,
    name: userSession.name,
    contact: userSession.email
  },
  location: {
    coordinates: { lat: 14.5765, lng: 120.9835 },
    address: "Arlegui Street, Zone 79",
    gpsAccuracy: "±5m"
  },
  condition: {
    severity: "knee-deep",
    description: "Water rising rapidly near canal",
    photo: base64ImageData (optional)
  },
  timestamp: "2025-10-20T14:32:15+08:00",
  status: "pending",  // pending → verified → resolved
  priority: calculatePriority()  // based on severity
}
```

**Step 3: Submission & Feedback**
```javascript
ON Submit:
  1. Show loading spinner (2-3 seconds)
  2. Send data to backend API
  3. ON SUCCESS:
     → Display confirmation toast:
       "✓ Report submitted successfully!
        Officials have been notified."
     → Add to user's "My Reports" list
     → Close dialog
     → Return to home screen
  
  4. ON FAILURE:
     → Save report locally (offline queue)
     → Display message:
       "⚠️ Unable to submit. Report saved offline.
        We'll send it when connection is restored."
```

#### **Official Dashboard Update**:
- **Latency**: < 5 seconds from submission to official view
- **Display**: Appears in "Community Reports" tab
- **Sorting**: Newest first, with unverified reports highlighted
- **Notification**: Officials receive push notification (if enabled)

### 3.2 "Request Rescue Assistance" Interaction

#### **High-Priority Access** (Streamlined 2-Tap Process):

**Trigger Method 1**: Emergency Button
- **Location**: Home screen → Floating red "SOS" button (bottom-right)
- **Visibility**: Always visible, pulsing animation during critical alerts

**Trigger Method 2**: Quick Action
- **Gesture**: Long-press power button (if OS supports)
- **Voice**: "Alexa/Siri, request rescue from Hydro Alert"

#### **Interaction Flow**:

**Tap 1: Initial Press on SOS Button**
```
┌─────────────────────────────────────┐
│        🚨 EMERGENCY RESCUE          │
│                                     │
│  You're about to request immediate  │
│  rescue assistance from Barangay    │
│  728 Emergency Response Team.       │
│                                     │
│  Your location will be shared:      │
│  📍 14.5765, 120.9835               │
│     Arlegui Street, Zone 79         │
│                                     │
│  Number of people needing help:     │
│  [1] [2] [3] [4] [5+] ← Tap count  │
│                                     │
│  [CANCEL]    [SEND RESCUE REQUEST]  │
│               ↑ Tap 2 (confirm)     │
└─────────────────────────────────────┘
```

**Tap 2: Confirm Request**
```javascript
// Data packet sent immediately
rescueRequest = {
  id: "SOS-" + timestamp,
  requester: {
    userId: userSession.id,
    name: userSession.name,
    phone: userSession.phone,
    medicalInfo: userSession.medicalNotes (if provided)
  },
  location: {
    coordinates: { lat: 14.5765, lng: 120.9835 },
    accuracy: "±3m",
    address: "Arlegui Street, Zone 79",
    landmark: "Near San Sebastian Church"
  },
  details: {
    peopleCount: 3,
    urgency: "high",  // auto-set for rescue requests
    accessibility: getUserAccessibilityFlags()  // elderly, disabled, children
  },
  timestamp: "2025-10-20T14:35:42+08:00",
  status: "pending",  // pending → dispatched → completed
  estimatedResponseTime: calculateETA()
}

// Immediate transmission
SEND to Emergency Response API
LOG in Barangay Officials Dashboard
TRIGGER push notification to on-duty officials
START real-time location tracking (updates every 10 sec)
```

**User Confirmation Screen**:
```
✓ RESCUE REQUEST SENT

Emergency Response Team notified

Your Details:
• Name: Juan dela Cruz
• Location: 14.5765, 120.9835
• People: 3 persons
• Time: 2:35 PM

Help is on the way!
Estimated response: 15-20 minutes

[VIEW RESCUE STATUS] ← Live tracking
[CANCEL REQUEST]     ← If situation changes
[CALL 911]          ← Fallback
```

### 3.3 Official's View: Manage Reports

#### **Dashboard Interface** (`/components/OfficialDashboard.tsx`)

**Tab 1: Community Reports**
```
Community Reports (12 active)

Filters: [All] [Pending] [Verified] [High Priority]
Sort: [Newest First ▼]

┌─────────────────────────────────────┐
│ 🔴 HIGH PRIORITY                    │
│ Maria Garcia                        │
│ 📍 Main Street, Zone 79             │
│ "Knee-deep water blocking road"    │
│ ⏰ 15 min ago                        │
│ Status: ⚠️ Pending Review           │
│                                     │
│ [View Location] [Verify] [Resolve]  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🟡 MEDIUM PRIORITY                  │
│ Jose Reyes                          │
│ 📍 Side Street A                    │
│ "Ankle-deep water near school"      │
│ ⏰ 30 min ago                        │
│ Status: ✓ Verified                  │
│                                     │
│ [View Location] [Mark Resolved]     │
└─────────────────────────────────────┘
```

**Status Change Actions**:

1. **"Verify" Button** (Pending → Verified):
   ```javascript
   ON Tap Verify:
     1. Prompt: "Confirm this report as accurate?"
     2. IF confirmed:
        → Update status to "verified"
        → Add to verified reports feed
        → Notify other officials
        → Update public map with verified flood zone
   ```

2. **"Resolve" Button** (Any Status → Resolved):
   ```javascript
   ON Tap Resolve:
     1. Prompt: "Mark as resolved? Add resolution notes:"
        [Text field: "Flood water receded" / "Road cleared" / etc.]
     2. IF confirmed:
        → Update status to "resolved"
        → Log resolution time & official name
        → Notify original reporter
        → Archive report (visible in history only)
   ```

**Tab 2: Rescue Requests**
```
Rescue Requests (2 active)

┌─────────────────────────────────────┐
│ 🚨 URGENT - 10 min ago              │
│ Pedro Cruz Family                   │
│ 📍 14.5765, 120.9835                │
│ 👥 5 people (2 children)            │
│ ⏰ Sent: 2:35 PM                    │
│ Status: ⚠️ Pending Dispatch         │
│                                     │
│ [View Location] [DISPATCH TEAM]     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ✓ Team Dispatched - 25 min ago     │
│ Carmen Lopez                        │
│ 📍 14.5770, 120.9840                │
│ 👥 2 people                         │
│ 🚁 Rescue Team: Unit Alpha          │
│ ETA: 5 minutes                      │
│ Status: 🟢 En Route                 │
│                                     │
│ [Track Team] [Contact Team]         │
└─────────────────────────────────────┘
```

**Dispatch Workflow**:
```javascript
ON Tap "Dispatch Team":
  1. Show team selection:
     "Select rescue team:
      ○ Unit Alpha (3 personnel, available)
      ○ Unit Bravo (4 personnel, available)
      ○ Unit Charlie (2 personnel, on another rescue)"
  
  2. ON team selected:
     → Update request status to "dispatched"
     → Assign team to request
     → Send notification to rescue team
     → Start live tracking (team + requester)
     → Calculate & display ETA
     → Notify requester: "Help is on the way! ETA: 15 min"
```

**Filtering & Priority**:
- **Auto-Priority Calculation**:
  ```javascript
  priority = calculatePriority({
    severity: report.condition.severity,
    reporterCount: duplicateReports.length,  // multiple reports same location
    sensorData: nearbySensor.waterLevel,
    time: ageInMinutes
  })
  
  IF severity === "road impassable" OR sensorData > critical:
    priority = "HIGH" (red badge)
  ELSE IF severity === "knee-deep" OR reporterCount > 2:
    priority = "MEDIUM" (yellow badge)
  ELSE:
    priority = "LOW" (blue badge)
  ```

---

## 4. Map Screen: Evacuation Route & Navigation

### 4.1 Route Generation Algorithm

#### **Safest Route Calculation**

**Input Data Sources**:
1. **PAGASA Hazard Maps**: Pre-defined flood-prone zones
2. **Live Sensor Data**: Current water levels from IoT network
3. **Community Reports**: User-submitted flood conditions (verified only)
4. **Historical Data**: Known flood patterns for Barangay 728

**Route Calculation Logic**:
```javascript
FUNCTION calculateSafestRoute(userLocation, destinationShelter):
  
  // Step 1: Get all potential routes
  baseRoutes = getMapsAPIRoutes(userLocation, destinationShelter)
  
  // Step 2: Overlay hazard data
  FOR EACH route IN baseRoutes:
    route.hazardScore = 0
    
    FOR EACH segment IN route.segments:
      // Check PAGASA flood zones
      IF segment.intersects(PAGASA_FloodZone_Level3):
        route.hazardScore += 100  // Critical - avoid
      ELSE IF segment.intersects(PAGASA_FloodZone_Level2):
        route.hazardScore += 50   // High risk
      
      // Check live sensor data
      nearbySensors = getSensorsNearSegment(segment, radius: 200m)
      FOR EACH sensor IN nearbySensors:
        IF sensor.currentData.waterLevel >= critical_threshold:
          route.hazardScore += 80
        ELSE IF sensor.currentData.waterLevel >= alert_threshold:
          route.hazardScore += 30
      
      // Check verified community reports
      recentReports = getVerifiedReports(segment, timeWindow: 30min)
      FOR EACH report IN recentReports:
        IF report.severity === "road impassable":
          route.hazardScore += 90
        ELSE IF report.severity === "knee-deep" OR "waist-deep":
          route.hazardScore += 40
        ELSE IF report.severity === "ankle-deep":
          route.hazardScore += 15
      
      // Check road type (prefer main roads during floods)
      IF segment.roadType === "main_highway":
        route.hazardScore -= 10  // Slight preference
      ELSE IF segment.roadType === "narrow_alley":
        route.hazardScore += 20  // Avoid during floods
  
  // Step 3: Select safest route
  safestRoute = route WITH LOWEST hazardScore
  
  // Step 4: Add safety waypoints
  safestRoute.waypoints = addEmergencySafePoints(safestRoute)
  
  RETURN safestRoute
```

**Real-Time Avoidance**:
```javascript
// Continuously update route during navigation
EVERY 30 seconds WHILE navigating:
  currentRoute = activatedRoute
  newHazards = checkForNewHazards(currentRoute.remainingPath)
  
  IF newHazards.severity > THRESHOLD:
    // Alert user
    SHOW notification:
      "⚠️ Flooding detected ahead on your route.
       Calculating safer alternative..."
    
    // Recalculate
    newRoute = calculateSafestRoute(userCurrentLocation, destination)
    
    IF newRoute.hazardScore < currentRoute.hazardScore:
      // Automatic re-route
      VIBRATE phone
      PLAY audio: "Route updated to avoid flooding"
      UPDATE map with new route
      HIGHLIGHT changed sections in blue
```

### 4.2 Shelter Information Display

#### **Map Markers**:
- **Icon**: Green building icon with capacity indicator
- **Size**: Scales with zoom level
- **Label**: Shelter name (visible when zoomed in)

#### **Tap Interaction**:
```javascript
ON TAP shelter marker:
  SHOW bottom sheet:
  
  ┌─────────────────────────────────────┐
  │ Barangay Hall Evacuation Center    │
  │                                     │
  │ 📍 Main Street, Zone 79             │
  │ 🚶 850 meters (12 min walk)        │
  │                                     │
  │ CAPACITY                            │
  │ 107 / 150 people (71% full)         │
  │ [▓▓▓▓▓▓▓░░░] 71%                    │
  │                                     │
  │ FACILITIES                          │
  │ ✓ Drinking water                    │
  │ ✓ Medical aid                       │
  │ ✓ Food supplies (limited)           │
  │ ✓ Phone charging                    │
  │ ✓ Sleeping mats                     │
  │                                     │
  │ CONTACT                             │
  │ 📞 (02) 8123-4567                   │
  │ 👤 Coordinator: Brgy. Capt. Santos  │
  │                                     │
  │ SAFETY PROTOCOLS                    │
  │ • Check in at registration desk     │
  │ • Follow social distancing          │
  │ • Keep emergency kit with you       │
  │                                     │
  │ [CALL SHELTER] [START NAVIGATION]   │
  └─────────────────────────────────────┘
```

**Capacity Color Coding**:
```javascript
IF capacity < 50%: color = green, status = "Available"
ELSE IF capacity < 80%: color = yellow, status = "Limited Space"
ELSE IF capacity < 100%: color = orange, status = "Nearly Full"
ELSE: color = red, status = "FULL - Seek Alternative"
```

**Alternative Shelter Suggestion**:
```javascript
IF selected_shelter.capacity >= 90%:
  DISPLAY message below capacity bar:
    "⚠️ This shelter is nearly full.
     Alternative: Zone 79 Elementary (1.2 km)
     [View Alternative]"
```

### 4.3 Dynamic Re-Routing

#### **Mid-Navigation Alert System**:

**Trigger Conditions**:
```javascript
WHILE user.isNavigating === true:
  MONITOR every 15 seconds:
    1. New sensor alerts on current route
    2. New verified flood reports
    3. PAGASA warning level upgrades
  
  IF critical_hazard_detected ON route_ahead:
    TRIGGER immediate re-route
```

**User Notification Flow**:

**Step 1: Hazard Detection**
```javascript
// Example: Sensor S-03 reports critical water level on user's route
newHazard = {
  type: "sensor_critical",
  location: "Main Street intersection",
  severity: "road impassable",
  distanceAhead: 350m,
  timestamp: NOW
}

// Check if user will reach hazard
IF userETA_to_hazard < 10 minutes:
  TRIGGER critical re-route
```

**Step 2: Alert Presentation** (Multi-Modal)
```javascript
// Visual Alert
SHOW full-screen banner (non-dismissible for 5 sec):
  "🚨 DANGER AHEAD
   
   Flooding detected 350m ahead
   Route is being updated
   
   [Calculating safer route...]"

// Haptic Feedback
VIBRATE pattern: [100ms, 50ms pause, 100ms, 50ms pause, 200ms]

// Audio Alert (if enabled)
PLAY voice: "Warning: Flooding detected ahead. Calculating new route."

// Visual Cues on Map
FLASH red zone on hazardous segment
PULSE user location marker
```

**Step 3: Automatic Re-Calculation** (< 3 seconds)
```javascript
// Background process
newRoute = calculateSafestRoute(
  userCurrentLocation,
  originalDestination,
  avoidZones: [newHazard.location, ...existingHazards]
)

// Compare routes
IF newRoute.estimatedTime < originalRoute.estimatedTime + 10 minutes:
  // Auto-accept (minor detour)
  APPLY newRoute
  SHOW confirmation:
    "✓ Route updated
     New ETA: 18 minutes (+3 min detour)
     Avoiding flooded Main Street"
  
ELSE:
  // Significant detour - ask user
  SHOW dialog:
    "Route Change Required
     
     Original route is blocked by flooding.
     
     New Route:
     • Distance: +1.2 km
     • Time: +15 minutes
     • Avoids: Main Street, Side Street A
     
     Alternative: Stay in current location?
     
     [ACCEPT NEW ROUTE] [FIND SHELTER NEARBY]"
```

**Step 4: Visual Route Update**
```javascript
// Animate route change on map
ANIMATE {
  // Fade out old route (red dashed line)
  oldRoute.opacity: 1.0 → 0.3 (500ms)
  oldRoute.color: blue → red
  
  // Draw new route (green solid line)
  newRoute.opacity: 0.0 → 1.0 (500ms)
  newRoute.color: green
  
  // Highlight changed segments
  FOR EACH segment IN newRoute.differentSegments:
    PULSE segment with blue outline (3 times)
}

// Update turn-by-turn directions
REFRESH navigation instructions
ANNOUNCE first new instruction: "In 200 meters, turn right onto Safe Street"
```

**Voice Guidance Priority** (during re-route):
```
Priority 1 (immediate):
  "Flooding ahead. Route updated."

Priority 2 (within 5 seconds):
  "Continue for 400 meters, then turn right."

Priority 3 (after compliance):
  "Following new route. Estimated arrival: 18 minutes."
```

**Edge Case Handling**:
```javascript
// If NO safe route exists
IF allRoutes.hazardScore > UNSAFE_THRESHOLD:
  STOP navigation
  SHOW critical alert:
    "🚨 NO SAFE ROUTE AVAILABLE
     
     All routes to [Shelter Name] are blocked by flooding.
     
     RECOMMENDED ACTIONS:
     1. Stay in current location if safe
     2. Seek shelter in nearby building
     3. Call emergency: 911
     
     [SHOW NEARBY SHELTERS] [CALL 911] [REQUEST RESCUE]"
  
  // Auto-suggest nearest high ground
  nearbyBuildings = findMultiStoryBuildings(userLocation, radius: 500m)
  HIGHLIGHT on map
```

---

## 5. AI Help (Chatbot) and Alerts Log

### 5.1 PAGASA Translation (AI Chatbot)

#### **Core Function**: Simplify Technical Warnings

**Example Interaction Flow**:

**User Query**:
```
User types: "What should I do for a PAGASA Red Warning?"
```

**AI Processing**:
```javascript
// Step 1: Identify intent
intent = "understand_pagasa_warning"
warningLevel = "red"
userLocation = "Barangay 728, Zone 79"

// Step 2: Retrieve relevant data
pagasaWarning = getCurrentPAGASAWarning(userLocation)
localProtocols = getBarangay728Protocols(warningLevel)
currentConditions = getLocalSensorData()

// Step 3: Generate localized, actionable response
```

**AI Response** (English):
```
🚨 PAGASA Red Warning - CRITICAL

Here's what you need to do RIGHT NOW:

1. EVACUATE IMMEDIATELY
   • This is life-threatening flooding
   • Do NOT wait for water to rise
   • Leave now even if roads seem clear

2. GO TO NEAREST SHELTER
   📍 Barangay Hall (850m, 12 min walk)
   📍 Zone 79 Elementary (1.2km, 18 min)
   
   [Show me the route] ← Tap to navigate

3. BRING THESE ESSENTIALS
   ✓ Important documents (in waterproof bag)
   ✓ Phone + charger
   ✓ Drinking water + food for 24 hours
   ✓ Medications
   ✓ Flashlight

4. STAY INFORMED
   • Keep your phone charged
   • Monitor this app for updates
   • Follow Barangay officials' instructions

CURRENT CONDITIONS IN YOUR AREA:
• Water level: 22 cm (rising)
• Rainfall: Heavy (15.8 mm/hr)
• Risk: CRITICAL

Need rescue? → [Request Emergency Assistance]

Have questions? Ask me anything!
```

**AI Response** (Filipino):
```
🚨 PAGASA Red Warning - KRITIKAL

Ito ang dapat ninyong gawin NGAYON:

1. LUMIKAS NA
   • Mapanganib ang baha na ito
   • HUWAG nang maghintay na tumaas ang tubig
   • Umalis na kahit mukhang ligtas pa ang daan

2. PUMUNTA SA PINAKAMALAPIT NA EVACUATION CENTER
   📍 Barangay Hall (850m, 12 min lakad)
   📍 Zone 79 Elementary (1.2km, 18 min)
   
   [Ipakita ang ruta] ← I-tap para mag-navigate

3. DALHIN ANG MGA ITO
   ✓ Mahalagang dokumento (sa waterproof na bag)
   ✓ Cellphone + charger
   ✓ Tubig at pagkain para sa 24 oras
   ✓ Gamot
   ✓ Flashlight

4. MANATILING UPDATED
   • I-charge ang inyong phone
   • Bantayan ang app na ito
   • Sundin ang mga opisyal ng Barangay

KASALUKUYANG KALAGAYAN SA INYONG LUGAR:
• Water level: 22 cm (tumataas)
• Ulan: Malakas (15.8 mm/hr)
• Panganib: KRITIKAL

Kailangan ng rescue? → [Humingi ng Emergency Assistance]

May tanong? Magtanong lang!
```

#### **Additional Sample Queries & Responses**:

**Query 2**: "Is it safe to drive?"
```
🚗 DRIVING SAFETY - Current Status

Based on conditions in Barangay 728:

⛔ NOT RECOMMENDED

Here's why:
• Water level: 15 cm (knee-deep in some areas)
• 3 roads reported as impassable
• Visibility: Poor due to heavy rain

DANGERS:
⚠️ Your vehicle can stall in as little as 15 cm of water
⚠️ Flowing water can sweep cars away
⚠️ You cannot see potholes or debris underwater

WHAT TO DO INSTEAD:
✓ Stay where you are if you're safe
✓ If you must evacuate, walk to nearest shelter
✓ If already driving, park on high ground immediately

REMEMBER:
"Turn Around, Don't Drown"
6 inches of water can knock you down
12 inches can move a car
24 inches can sweep away most vehicles

Need evacuation help? → [Request Assistance]
```

**Query 3**: "How long will the flooding last?"
```
⏰ FLOOD FORECAST

Based on PAGASA and local sensor data:

CURRENT SITUATION:
• Rainfall intensity: 12.5 mm/hr (moderate to heavy)
• Water level: 15 cm (rising slowly)

FORECAST:
• Next 3 hours: Rain expected to continue
• Peak water level: Estimated 6:00 PM today
• Receding: Likely starts after 9:00 PM

STAY SAFE:
✓ Water may continue rising for 4-6 hours
✓ Even after rain stops, drainage takes time
✓ Roads may be unsafe until tomorrow morning

WHEN IT'S SAFE TO RETURN:
I'll notify you when:
• Water level drops below 10 cm
• Barangay officials clear roads
• Conditions return to "Low Risk"

Want alerts? Enable notifications in Settings.

[View Detailed Forecast] [Set Return Reminder]
```

#### **Technical Implementation**:
```javascript
// Chatbot response generation
FUNCTION generateResponse(userQuery, language):
  
  // Step 1: Analyze query
  intent = classifyIntent(userQuery)  // NLP classification
  entities = extractEntities(userQuery)  // warnings, locations, actions
  
  // Step 2: Gather context
  context = {
    userLocation: getUserGPSLocation(),
    currentRiskLevel: getCurrentRiskLevel(),
    pagasaWarnings: getPAGASAWarnings(),
    localSensorData: getLocalSensorReadings(),
    barangayProtocols: getBarangay728Protocols()
  }
  
  // Step 3: Generate response template
  IF intent === "understand_warning":
    response = generateWarningExplanation(entities.warningLevel, context, language)
  
  ELSE IF intent === "safety_advice":
    response = generateSafetyGuidance(entities.activity, context, language)
  
  ELSE IF intent === "forecast_duration":
    response = generateForecastSummary(context, language)
  
  ELSE IF intent === "evacuation_help":
    response = generateEvacuationGuidance(context, language)
  
  // Step 4: Add contextual CTAs
  response.actions = generateSmartActions(intent, context)
  // Examples: [View Route], [Request Rescue], [Call Emergency]
  
  // Step 5: Simplify language
  response.text = simplifyTechnicalTerms(response.text, language)
  response.text = addEmojisForClarity(response.text)
  
  RETURN response
```

**Avoidance of Technical Jargon**:
```javascript
// Translation rules
technicalTerms = {
  "accumulated rainfall": "total rain that fell",
  "hydrological threshold": "danger level for flooding",
  "tropical depression": "weak storm",
  "tropical storm": "moderate storm with strong rain",
  "typhoon": "very strong storm",
  "intertropical convergence zone": "weather pattern bringing rain",
  "low pressure area": "area of clouds and rain",
  "monsoonal flow": "seasonal rain pattern"
}

FUNCTION simplifyTechnicalTerms(text, language):
  FOR EACH term IN technicalTerms:
    IF term IN text:
      IF language === 'en':
        text = replace(term, technicalTerms[term])
      ELSE IF language === 'fil':
        text = replace(term, technicalTerms_Filipino[term])
  
  RETURN text
```

### 5.2 Alerts Log Interaction

#### **Alerts Screen Structure** (`/components/AlertsScreen.tsx`)

**Header Section**:
```
┌─────────────────────────────────────┐
│ 🔔 Alerts & Notifications           │
│                                     │
│ Filters: [All] [PAGASA] [Local]    │
│          [Resolved] [Active Only]   │
│                                     │
│ Sort: [Newest First ▼]              │
└─────────────────────────────────────┘
```

**Alert Entry Structure**:
```
┌─────────────────────────────────────┐
│ 🚨 CRITICAL ALERT                   │← Severity badge
│ PAGASA Red Warning - Evacuate Now   │← Title
│ ⏰ Today, 2:35 PM                    │← Timestamp
│ 📍 Metro Manila, Barangay 728       │← Location
│                                     │
│ Heavy to intense rainfall expected  │← Summary (1-2 lines)
│ in the next 3 hours. Flooding...    │
│                                     │
│ Status: ✓ Acknowledged              │← User status
│                                     │
│ [View Full Alert] [View on Map]     │← Actions
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ⚠️ WARNING                          │
│ Water Level Alert - Arlegui Station │
│ ⏰ Today, 1:15 PM                    │
│ 📍 Arlegui Street, Zone 79          │
│                                     │
│ Water level reached 20 cm (alert    │
│ threshold). Monitor closely.         │
│                                     │
│ Status: 🔄 Ongoing                  │
│                                     │
│ [View Details] [View on Map]        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ℹ️ INFORMATION                      │
│ Flood Advisory - Light Rain Expected│
│ ⏰ Yesterday, 6:00 PM                │← Historical
│ 📍 Metro Manila                     │
│                                     │
│ Light to moderate rain forecasted.  │
│ No flooding expected.               │
│                                     │
│ Status: ✓ Resolved                  │
│                                     │
│ [View Details] [View Historical Map]│← Historical map
└─────────────────────────────────────┘
```

#### **Filtering System**:

**Filter Options**:
```javascript
filters = {
  source: {
    all: "All alerts",
    pagasa: "PAGASA warnings only",
    local: "Local sensor alerts only",
    community: "Community reports only"
  },
  status: {
    active: "Active alerts only",
    resolved: "Resolved/past alerts",
    all: "All statuses"
  },
  severity: {
    critical: "Critical only",
    high: "High priority",
    moderate: "Moderate",
    low: "Informational",
    all: "All severities"
  },
  timeRange: {
    today: "Today",
    week: "Past 7 days",
    month: "Past 30 days",
    all: "All time"
  }
}

// Example: User selects [PAGASA] + [Active Only]
displayedAlerts = alerts.filter(alert => 
  alert.source === "pagasa" && 
  alert.status === "active"
)
```

#### **Map Link Behavior**:

**"View on Map" Button Tap**:
```javascript
ON TAP "View on Map" FOR alert:
  
  // Determine map mode based on alert age
  alertAge = NOW - alert.timestamp
  
  IF alertAge < 24 hours:
    // Show CURRENT conditions
    mapMode = "current"
    NAVIGATE_TO MapScreen
    CENTER_MAP on alert.location
    DISPLAY current_sensor_data
    SHOW "Current Conditions" badge
    OVERLAY:
      "This alert was issued [X hours] ago.
       Showing CURRENT flood data for this area.
       
       Alert Status: [Active/Resolved]"
  
  ELSE:
    // Show HISTORICAL snapshot
    mapMode = "historical"
    historicalData = fetchHistoricalSnapshot(alert.timestamp)
    
    NAVIGATE_TO MapScreen
    CENTER_MAP on alert.location
    DISPLAY historicalData
    SHOW "Historical View" badge with date/time
    
    // Visual differentiation
    MAP_STYLE = grayscale  // Desaturated to indicate past
    SHOW banner:
      "📅 Historical View
       Showing conditions at [Date, Time]
       This alert is now [Resolved/Outdated]
       
       [View Current Conditions]" ← Button to switch modes
```

**Historical Data Preservation**:
```javascript
// Alert data structure
alertRecord = {
  id: "ALT-20251020-143500",
  timestamp: "2025-10-20T14:35:00+08:00",
  type: "pagasa_warning",
  severity: "critical",
  title: "PAGASA Red Warning - Evacuate Now",
  message: "Heavy to intense rainfall...",
  location: {
    coordinates: { lat: 14.5765, lng: 120.9835 },
    name: "Metro Manila, Barangay 728"
  },
  
  // Historical snapshot
  conditionsAtTime: {
    waterLevels: [
      { sensorId: "S-01", level: 22, location: "Arlegui" },
      { sensorId: "S-02", level: 18, location: "Side Street A" }
    ],
    rainfallIntensity: 15.8,
    riskLevel: "critical",
    floodedAreas: ["Main Street", "Riverside Area"]
  },
  
  // Current status
  status: "resolved",  // active, acknowledged, resolved
  resolvedAt: "2025-10-20T21:00:00+08:00",
  userAcknowledged: true,
  acknowledgedAt: "2025-10-20T14:36:15+08:00"
}
```

**Map Overlay for Historical Alerts**:
```javascript
// Visual indicators on historical map view
DISPLAY on map:
  1. Flood extent (semi-transparent blue polygons)
     → "Flooded areas at [timestamp]"
  
  2. Sensor markers (grayed out)
     → Tap shows: "Water level was 22 cm at 2:35 PM"
  
  3. Affected roads (red dashed lines)
     → "Road was impassable at time of alert"
  
  4. Comparison button
     → "Compare with current conditions"
     → Split-screen: Historical (left) vs Current (right)
```

#### **Alert Acknowledgment**:
```javascript
// Mark alert as read/acknowledged
ON USER views full alert:
  IF alert.status === "active" AND alert.userAcknowledged === false:
    alert.userAcknowledged = true
    alert.acknowledgedAt = NOW
    
    // Update badge count
    unacknowledgedCount -= 1
    UPDATE notification badge
    
    // Optional: Log acknowledgment for officials
    IF alert.requiresAcknowledgment === true:
      SEND confirmation to backend:
        "User [Name] acknowledged [Alert ID] at [Time]"
```

#### **Detailed Alert View**:
```javascript
ON TAP "View Full Alert":
  SHOW full-screen alert details:
  
  ┌─────────────────────────────────────┐
  │ ← Back             [Share] [✓ Ack]  │
  │                                     │
  │ 🚨 CRITICAL ALERT                   │
  │                                     │
  │ PAGASA Red Rainfall Warning         │
  │ Issued: Oct 20, 2025 at 2:35 PM    │
  │ Valid Until: Oct 20, 2025 at 9:00 PM│
  │                                     │
  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
  │                                     │
  │ SUMMARY                             │
  │ Heavy to intense rainfall (15-30 mm │
  │ per hour) expected within the next  │
  │ 3 hours. Serious flooding is likely │
  │ in low-lying areas and near rivers. │
  │                                     │
  │ AFFECTED AREAS                      │
  │ • Metro Manila                      │
  │   - Barangay 728, Zone 79           │
  │   - Barangay 729                    │
  │   - Barangay 730                    │
  │                                     │
  │ CURRENT CONDITIONS                  │
  │ 💧 Water Level: 22 cm (rising)      │
  │ 🌧️ Rainfall: 15.8 mm/hr (heavy)    │
  │ 🎯 Risk Level: CRITICAL             │
  │                                     │
  │ RECOMMENDED ACTIONS                 │
  │ 1. Evacuate immediately to:         │
  │    • Barangay Hall                  │
  │    • Zone 79 Elementary School      │
  │                                     │
  │ 2. Avoid flooded areas              │
  │                                     │
  │ 3. Stay informed via this app       │
  │                                     │
  │ ISSUED BY                           │
  │ PAGASA Weather Division             │
  │ Philippine Atmospheric, Geophysical │
  │ and Astronomical Services Admin     │
  │                                     │
  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
  │                                     │
  │ [VIEW ON MAP]                       │
  │ [GET EVACUATION ROUTE]              │
  │ [SHARE WITH FAMILY]                 │
  │ [REPORT FLOODING]                   │
  └─────────────────────────────────────┘
```

---

## 6. Cross-Module Integration Summary

### **Data Flow Architecture**

```
┌─────────────────────────────────────────────────────┐
│              EXTERNAL DATA SOURCES                  │
├─────────────────────────────────────────────────────┤
│  PAGASA API  │  IoT Sensors  │  Community Reports  │
└──────┬───────┴───────┬───────┴──────────┬──────────┘
       │               │                   │
       │               │                   │
       ▼               ▼                   ▼
┌─────────────────────────────────────────────────────┐
│           HYDRO ALERT BACKEND / API                 │
│  • Data aggregation                                 │
│  • Risk calculation                                 │
│  • Alert generation                                 │
│  • User authentication                              │
└──────┬──────────────────────────────────────────────┘
       │
       │ (Real-time updates via WebSocket/SSE)
       │
       ▼
┌─────────────────────────────────────────────────────┐
│           MOBILE APP (React State)                  │
│  • userSession (RBAC)                               │
│  • currentRiskLevel                                 │
│  • sensorData                                       │
│  • alerts                                           │
│  • communityReports                                 │
└──────┬──────────────────────────────────────────────┘
       │
       │ (Props/Context distribution)
       │
       ├─────────────┬─────────────┬─────────────┬────────────┐
       ▼             ▼             ▼             ▼            ▼
   HomeScreen   MapView    AlertsScreen  Chatbot   OfficialDashboard
```

### **Real-Time Update Strategy**

**Update Frequencies**:
- **Critical Data** (water levels, alerts): 30 seconds
- **Standard Data** (weather, forecasts): 5 minutes
- **User Reports**: Real-time push notifications
- **Map Routes**: 15 seconds during navigation, 5 minutes idle

**Offline Resilience**:
```javascript
// Handle network failures gracefully
IF networkStatus === 'offline':
  1. Display banner: "Offline - Using cached data"
  2. Queue user actions (reports, rescue requests)
  3. Show last known data with timestamp
  4. Enable emergency phone calls (no internet needed)
  5. Store location history for later sync

WHEN networkStatus === 'online':
  1. Sync queued actions
  2. Refresh all data
  3. Display: "Back online - Data updated"
```

---

## 7. Performance & UX Benchmarks

### **Target Performance Metrics**

| Action | Target Time | Acceptable Max |
|--------|-------------|----------------|
| App launch to home screen | < 2 seconds | 3 seconds |
| Sign-in processing | < 1 second | 2 seconds |
| Risk level refresh | < 500ms | 1 second |
| Map route calculation | < 3 seconds | 5 seconds |
| Rescue request submission | < 2 seconds | 3 seconds |
| Chatbot response | < 2 seconds | 4 seconds |
| Alert notification delivery | < 5 seconds | 10 seconds |
| Emergency re-route calculation | < 3 seconds | 5 seconds |

### **Accessibility Requirements**

- **Font Scaling**: Support 100%-200% text size
- **Color Contrast**: WCAG AA minimum (4.5:1 for text)
- **Screen Readers**: Full VoiceOver/TalkBack support
- **Haptic Feedback**: Critical alerts use vibration patterns
- **Audio Alerts**: Optional voice notifications for emergencies
- **Localization**: English and Filipino (Tagalog) throughout

---

## 8. Testing Scenarios

### **Critical Path Testing**

**Scenario 1: Resident During Critical Flood**
1. User receives PAGASA Red Warning notification
2. Opens app → Home screen shows CRITICAL status
3. Taps "EVACUATE NOW" → Routes to nearest shelter
4. Mid-navigation, flooding detected ahead
5. App re-routes automatically with voice alert
6. User arrives at shelter, taps "I'm Safe"
7. Confirmation sent to officials

**Scenario 2: Official Coordinating Response**
1. Official signs in → Dashboard shows active reports
2. Reviews 3 pending flood reports
3. Verifies 2 reports, marks 1 as resolved
4. Receives SOS rescue request (5 people)
5. Dispatches Rescue Team Alpha
6. Tracks team location in real-time
7. Marks rescue as completed when done

**Scenario 3: Administrator System Check**
1. Admin signs in → Views system health
2. Notices Sensor S-04 is offline
3. Views sensor details, sees low battery
4. Schedules maintenance alert
5. Checks user activity logs
6. Exports system logs for analysis
7. Disables false-alarm-prone sensor temporarily

---

This specification provides the foundation for development, QA testing, and user training. Each module is designed to prioritize **speed, clarity, and life-saving functionality** during flood emergencies.
