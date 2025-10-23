# Hydro Alert - Resident User Guide

## 📱 Core Features for Residents of Barangay 728

This guide describes the five essential features available to Resident Users in the Hydro Alert mobile application, designed to help you stay safe during flood events.

---

## 1. Localized Flood Risk Card / Status Dashboard

### 🎯 **Purpose**
The Flood Risk Card is your **instant, at-a-glance indicator** of the current flood danger level in Barangay 728. It translates complex data from PAGASA, local IoT sensors, and community reports into a simple, color-coded status that tells you exactly what to do right now.

### 📍 **Where to Find It**
**Home Screen** → Top of screen (first thing you see when opening the app)

### 👀 **What You See**

The Risk Card displays in one of four color-coded levels:

#### **🟢 GREEN - NORMAL (Safe)**
```
┌─────────────────────────────────────┐
│   ✓ NORMAL CONDITIONS               │
│   No Flood Risk Detected            │
│                                     │
│   Stay informed and prepared        │
│                                     │
│   Current Status:                   │
│   • Water Level: 8 cm (Normal)      │
│   • Rainfall: Light (3.2 mm/hr)     │
│   • PAGASA: No warnings             │
│                                     │
│   [View Details]                    │
│   Updated 30 sec ago                │
└─────────────────────────────────────┘
```

**What It Means:**
- No flooding expected
- Normal daily activities can continue
- Good time to prepare emergency kit
- Monitor app periodically

**Your Action:** Stay informed, prepare supplies

---

#### **🟡 YELLOW - MODERATE RISK (Monitor)**
```
┌─────────────────────────────────────┐
│   ⚠️ MODERATE FLOOD RISK            │
│   Monitor Conditions Closely        │
│                                     │
│   Heavy rain detected in your area  │
│                                     │
│   Current Status:                   │
│   • Water Level: 15 cm (Elevated)   │
│   • Rainfall: Moderate (12 mm/hr)   │
│   • 2 flood reports in Zone 79      │
│                                     │
│   [Prepare Emergency Kit]           │
│   [View Flood Reports]              │
│   Updated 15 sec ago                │
└─────────────────────────────────────┘
```

**What It Means:**
- Flooding possible but not immediate
- Rain is ongoing or forecast
- Some low-lying areas may have water
- Time to prepare and stay alert

**Your Action:** Prepare emergency kit, monitor updates every 30 minutes

---

#### **🟠 ORANGE - HIGH RISK (Prepare to Evacuate)**
```
┌─────────────────────────────────────┐
│   🚨 HIGH FLOOD RISK                │
│   PREPARE TO EVACUATE               │
│                                     │
│   Significant flooding expected     │
│                                     │
│   Current Status:                   │
│   • Water Level: 22 cm (Alert!)     │
│   • Rainfall: Heavy (18 mm/hr)      │
│   • PAGASA: Orange Warning          │
│                                     │
│   [VIEW EVACUATION CENTERS]         │
│   [Prepare to Leave]                │
│   Updated 10 sec ago ⚡ LIVE        │
└─────────────────────────────────────┘
```

**What It Means:**
- Dangerous flooding is likely soon
- Water levels approaching critical threshold
- You should prepare to leave immediately
- Gather family, pets, important documents

**Your Action:** Pack emergency bag, identify safe route, prepare to evacuate within 1 hour

---

#### **🔴 RED - CRITICAL (Evacuate Now)**
```
┌─────────────────────────────────────┐
│   🚨🚨🚨 CRITICAL DANGER 🚨🚨🚨      │
│                                     │
│   EVACUATE IMMEDIATELY              │
│   LIFE-THREATENING FLOODING         │
│                                     │
│   ⚠️ Water: 30 cm (CRITICAL)        │
│   ⚠️ Rising rapidly                 │
│   ⚠️ PAGASA Red Warning Active      │
│                                     │
│   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│   ┃ GET EVACUATION ROUTE NOW    ┃ │← Pulsing button
│   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                     │
│   [CALL EMERGENCY: 911]             │
│   [REQUEST RESCUE]                  │
│                                     │
│   📍 Nearest Shelter: 850m away     │
│   Updated LIVE • Don't delay!       │
└─────────────────────────────────────┘
```

**What It Means:**
- THIS IS AN EMERGENCY
- Leave your home NOW
- Do not wait for water to rise higher
- Life-threatening conditions present or imminent

**Your Action:** EVACUATE IMMEDIATELY to nearest shelter

---

### 🔄 **How It Updates**

**Update Frequency:**
- 🟢 Normal: Every 5 minutes
- 🟡 Moderate: Every 2 minutes  
- 🟠 High: Every 30 seconds
- 🔴 Critical: Every 15 seconds (real-time)

**Data Sources (Priority Order):**
1. **PAGASA Official Warnings** (highest authority)
   - Red, Orange, Yellow warnings from national weather service
2. **Local IoT Sensors** (real-time ground truth)
   - Water level sensors in Arlegui Street, Side Street A, Riverside Area
   - Rainfall gauges
3. **Community Reports** (on-the-ground verification)
   - Reports from your neighbors and Barangay officials

### 🎯 **Key User Interactions**

**Tap "View Details"** → See full breakdown:
- Exact water level from nearest sensor
- Rainfall intensity and forecast
- Active PAGASA warnings
- Number of community reports
- Historical comparison ("Higher than yesterday")

**Tap Evacuation Route Button** → Instantly navigate to:
- Map screen with your location
- Nearest evacuation center highlighted
- Optimal route avoiding flooded areas
- Turn-by-turn navigation ready to start

**Pull Down to Refresh** → Manually refresh all data sources (2-3 second load)

### ✅ **Immediate Benefits**

✓ **Instant Understanding**: Know your safety status in 1 second  
✓ **No Technical Knowledge Needed**: Color + simple action (Stay/Monitor/Prepare/Evacuate)  
✓ **Multi-Source Truth**: Combines official warnings + local sensors + community data  
✓ **Actionable Guidance**: Every risk level tells you exactly what to do next  
✓ **Real-Time Updates**: Critical alerts refresh every 15 seconds  

---

## 2. Evacuation Route Mapping

### 🎯 **Purpose**
The Map feature provides **GPS-guided navigation to safety** during flood events. It shows you the safest route to evacuation centers, dynamically avoiding flooded streets based on real-time sensor data and community reports.

### 📍 **Where to Find It**
**Bottom Navigation Bar** → Tap **"Map"** icon (2nd icon from left)

OR

**From Home Screen** → Tap "GET EVACUATION ROUTE NOW" during critical alerts

### 👀 **What You See**

#### **Main Map Screen**
```
┌─────────────────────────────────────┐
│ ← Back        🔍 Search    ⋮ Menu   │
├─────────────────────────────────────┤
│                                     │
│         📍 Your Location            │
│         (Blue pulsing dot)          │
│                                     │
│     [Safe Route - Green Line]       │
│          ↓   ↓   ↓                  │
│                                     │
│     🏢 Barangay Hall                │
│     (Green building icon)           │
│     107/150 capacity                │
│                                     │
│  ⚠️ [Flooded Area - Red Zone]      │
│     (Main Street - avoid)           │
│                                     │
│     🏫 Zone 79 Elementary           │
│     (Green building icon)           │
│     20/200 capacity                 │
│                                     │
├─────────────────────────────────────┤
│ 🧭 850m to Barangay Hall           │
│ 12 min walk • Route is clear        │
│                                     │
│ [START NAVIGATION] ← Big button    │
└─────────────────────────────────────┘
```

### 🗺️ **Key Map Elements**

**Your Location:**
- 📍 Blue pulsing dot (updates every 5 seconds)
- Accuracy circle (shows GPS precision)
- Heading indicator (arrow shows direction you're facing)

**Evacuation Centers (Shelters):**
- 🏢 **Green building icons** = Safe, with space available
- 🟡 **Yellow building icons** = Nearly full (80-95% capacity)
- 🔴 **Red building icons** = FULL (seek alternative)

**Route Lines:**
- 🟢 **Green solid line** = Recommended safe route
- 🔵 **Blue dashed line** = Alternative route
- 🔴 **Red line with X** = Flooded/blocked route (avoid)

**Hazard Zones:**
- 🔴 **Red shaded areas** = Confirmed flooding (impassable)
- 🟠 **Orange shaded areas** = High water (risky, avoid if possible)
- 🟡 **Yellow shaded areas** = Minor flooding (passable but caution)

**Waypoints:**
- 🚨 **Red markers** = Emergency assembly points
- ⛑️ **Medical cross** = First aid stations
- 📞 **Phone icon** = Emergency contact points

### 🎯 **Key User Interactions**

#### **1. Find Nearest Shelter**

**Action:** Tap on any **green building icon** (evacuation center)

**What Appears:** Bottom sheet slides up
```
┌─────────────────────────────────────┐
│ Barangay Hall Evacuation Center    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ 📍 Main Street, Zone 79             │
│ 🚶 850 meters away (12 min walk)   │
│                                     │
│ CAPACITY                            │
│ 107 / 150 people (71% occupied)     │
│ ┣▓▓▓▓▓▓▓░░░┫ Space available ✓     │
│                                     │
│ FACILITIES AVAILABLE                │
│ ✓ Drinking water & food supplies    │
│ ✓ Medical aid station               │
│ ✓ Restrooms & hygiene facilities    │
│ ✓ Phone charging stations           │
│ ✓ Sleeping mats & blankets          │
│ ✓ Generator power (24/7)            │
│                                     │
│ CONTACT                             │
│ 📞 (02) 8123-4567                   │
│ 👤 Coordinator: Brgy. Capt. Santos  │
│                                     │
│ PROTOCOLS                           │
│ • Register at entrance desk         │
│ • Temperature check required        │
│ • Bring valid ID                    │
│ • Keep emergency kit with you       │
│                                     │
│ [CALL SHELTER]  [GET DIRECTIONS]    │
└─────────────────────────────────────┘
```

**Tap "GET DIRECTIONS":**
- Calculates safest route from your location
- Highlights route in green on map
- Shows distance, estimated time, route safety status
- **[START NAVIGATION]** button activates

---

#### **2. Start Navigation**

**Action:** Tap **"START NAVIGATION"** button

**What Happens:**
1. Map zooms to show your location + first turn
2. Turn-by-turn voice guidance begins:
   - "Head north on Arlegui Street for 200 meters"
3. Screen switches to navigation mode:

```
┌─────────────────────────────────────┐
│ 🧭 Turn Right in 200m               │← Next instruction
├─────────────────────────────────────┤
│                                     │
│         ↑  ↑  ↑                    │
│         YOUR ROUTE                  │
│       (Animated arrows)             │
│                                     │
│         📍 YOU                      │
│                                     │
│    Side Street A →                 │← Upcoming turn
│                                     │
├─────────────────────────────────────┤
│ 🏢 Barangay Hall - 650m remaining  │
│ ETA: 10 minutes                     │
│                                     │
│ Route is clear ✓                    │
│ [EXIT NAVIGATION] [REPORT ISSUE]    │
└─────────────────────────────────────┘
```

**Voice Guidance Examples:**
- "In 200 meters, turn right onto Side Street A"
- "Continue straight for 400 meters"
- "You have arrived at Barangay Hall Evacuation Center"

**Visual Cues:**
- Blue dot (your location) moves in real-time
- Remaining distance counts down
- Upcoming turn highlighted with flashing arrow
- Speed indicator if moving too slow/fast

---

#### **3. Dynamic Re-Routing (Mid-Navigation)**

**What Triggers Re-Route:**
- New sensor alert: water level critical on your route
- Community report: "Road impassable" ahead
- PAGASA warning upgrade affecting your path

**What You Experience:**

**Step 1: Immediate Alert** (multi-sensory)
- 📳 **Phone vibrates** (3 short pulses)
- 🔊 **Voice alert**: "Warning: Flooding detected ahead. Calculating new route."
- 🚨 **Screen flashes** red banner:
```
┌─────────────────────────────────────┐
│ ⚠️ DANGER AHEAD - ROUTE UPDATING    │
│ Flooding detected 350m ahead        │
│ Finding safer alternative...         │
└─────────────────────────────────────┘
```

**Step 2: Automatic Re-Calculation** (2-3 seconds)
- Map shows red hazard zone ahead
- Algorithm finds new safe route
- New route appears in blue (candidate) then green (confirmed)

**Step 3: Confirmation**
```
┌─────────────────────────────────────┐
│ ✓ ROUTE UPDATED                     │
│                                     │
│ New route avoids flooded area       │
│                                     │
│ New Distance: 1.1 km (+250m detour) │
│ New ETA: 18 minutes (+6 min)        │
│                                     │
│ Avoiding: Main Street (flooded)     │
│ New path: Via Side Street B         │
│                                     │
│ [ACCEPT] [VIEW ALTERNATIVES]        │
└─────────────────────────────────────┘
```

**Voice Announcement:**
"Route updated to avoid flooding. In 100 meters, turn left instead."

**If No Safe Route Exists:**
```
┌─────────────────────────────────────┐
│ 🚨 NO SAFE ROUTE AVAILABLE          │
│                                     │
│ All routes to Barangay Hall are     │
│ blocked by flooding.                │
│                                     │
│ RECOMMENDED ACTIONS:                │
│ 1. Stay where you are if safe       │
│ 2. Seek shelter in nearby building  │
│ 3. Request emergency rescue         │
│                                     │
│ Nearby alternatives:                │
│ 🏢 3-story building (150m north)    │
│ 🏫 Zone 79 Elementary (1.8km east)  │
│                                     │
│ [REQUEST RESCUE] [CALL 911]         │
│ [SHOW NEARBY BUILDINGS]             │
└─────────────────────────────────────┘
```

---

#### **4. View Flooded Areas**

**Action:** Tap **"Menu"** (⋮) → **"Show Flood Zones"**

**What Appears:**
- All flooded areas highlighted in red/orange/yellow
- Tap any zone to see details:
  - Water depth (e.g., "Knee-deep - 25 cm")
  - Last updated time
  - Source (sensor / community report)
  - Alternative routes around it

**Use Case:** 
- Check if your home area is flooded
- See which roads to avoid if traveling
- Verify community reports

---

#### **5. Report Flooding While Navigating**

**Action:** Tap **"REPORT ISSUE"** button during navigation

**Quick Report Dialog:**
```
┌─────────────────────────────────────┐
│ Report Flooding on Your Route       │
│                                     │
│ Location: Your current position     │
│ (Or tap map to change)              │
│                                     │
│ Flood Severity:                     │
│ ○ Wet/Puddling                      │
│ ○ Ankle-deep                        │
│ ● Knee-deep ← Selected              │
│ ○ Waist-deep                        │
│ ○ Road Impassable                   │
│                                     │
│ [SUBMIT] (Takes 2 seconds)          │
└─────────────────────────────────────┘
```

**Result:**
- Report sent to officials instantly
- Your report updates the map for other users
- Navigation continues automatically

---

### ✅ **Immediate Benefits**

✓ **Saves Lives**: Shows you the safest path during emergencies  
✓ **Real-Time Avoidance**: Dynamically routes around flooded areas  
✓ **Multiple Shelter Options**: Compare capacity, facilities, distance  
✓ **Turn-by-Turn Guidance**: No guesswork, just follow voice directions  
✓ **Automatic Re-Routing**: Never get stuck on a flooded road  
✓ **Works Offline**: Routes cached, basic navigation works without internet  
✓ **Community-Verified**: Routes informed by real resident reports  

---

## 3. Request Rescue Assistance (One-Tap/Two-Step Process)

### 🎯 **Purpose**
This feature is your **emergency lifeline** when you're trapped, injured, or in immediate danger during a flood. It sends your exact GPS location and emergency details directly to Barangay 728 rescue teams in under 10 seconds.

### 📍 **Where to Find It**

**Method 1: SOS Button (Always Visible)**
- **Home Screen** → Red **"SOS"** button (floating, bottom-right corner)
- Visible on every screen during critical alerts
- Pulsing animation during RED risk status

**Method 2: Critical Alert Prompt**
- Appears automatically during RED (Critical) status
- **"REQUEST RESCUE"** button in emergency overlay

**Method 3: Map Screen**
- Bottom bar → **"Emergency"** tab → **"Request Rescue"**

### 🎯 **The Two-Step Process**

This is designed to be **extremely fast** but prevent accidental activation.

---

#### **STEP 1: Initial Press (Tap SOS Button)**

**What Appears Immediately:**
```
┌─────────────────────────────────────┐
│        🚨 EMERGENCY RESCUE          │
│                                     │
│  You're about to request immediate  │
│  rescue assistance from:            │
│                                     │
│  🚑 Barangay 728 Emergency Response │
│  📞 911 Emergency Services          │
│                                     │
│  Your location will be shared:      │
│  📍 14.5765, 120.9835               │
│  📍 Arlegui Street, Zone 79         │
│  🎯 Accuracy: ±5 meters             │
│                                     │
│  How many people need help?         │
│  [1] [2] [3] [4] [5+] ← Tap number │
│      ↑ Auto-selected (you)          │
│                                     │
│  Emergency type (optional):         │
│  ☐ Trapped by water                 │
│  ☐ Medical emergency                │
│  ☐ Building collapse                │
│  ☐ Other danger                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    [CANCEL]    [SEND RESCUE   │ │
│  │                 REQUEST]       │ │← STEP 2
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Time on Screen:** 5-10 seconds (you choose)

**What You Do:**
1. **Select number of people** (optional, defaults to 1)
2. **Check emergency type** (optional, helps responders prepare)
3. **Tap "SEND RESCUE REQUEST"** → STEP 2

**OR**

- **Tap "CANCEL"** if you activated by accident

---

#### **STEP 2: Confirm & Send (Final Tap)**

**What Happens Instantly (< 3 seconds):**

1. **GPS Lock** → Your exact coordinates captured (updates every 10 sec)
2. **Data Packet Created:**
```javascript
{
  requestId: "SOS-20251020-143542",
  priority: "URGENT",
  requester: {
    name: "Juan dela Cruz",
    phone: "+63 917 123 4567",
    userId: "RES001"
  },
  location: {
    coordinates: { lat: 14.5765, lng: 120.9835 },
    accuracy: "±5m",
    address: "Arlegui Street, Zone 79",
    landmark: "Near San Sebastian Church"
  },
  details: {
    peopleCount: 3,
    emergencyType: "Trapped by water",
    medicalNeeds: false,
    accessibility: "Elderly person present"
  },
  timestamp: "2025-10-20 14:35:42",
  status: "DISPATCHED"
}
```

3. **Simultaneous Transmission:**
   - 📡 Barangay 728 Emergency Dashboard (Officials see it instantly)
   - 🚨 Push notification to on-duty rescue teams
   - 📞 Backup SMS to emergency hotline (if data fails)
   - 📍 Real-time location tracking activated

4. **Your Confirmation Screen:**
```
┌─────────────────────────────────────┐
│   ✓ RESCUE REQUEST SENT             │
│                                     │
│  🚑 Help is on the way!             │
│                                     │
│  Your rescue request has been       │
│  received by:                       │
│  • Barangay 728 Emergency Team      │
│  • 911 Emergency Services           │
│                                     │
│  REQUEST DETAILS                    │
│  Request #: SOS-20251020-143542     │
│  Time: 2:35 PM, Oct 20, 2025       │
│  Location: Arlegui St, Zone 79      │
│  People: 3 persons                  │
│                                     │
│  ESTIMATED RESPONSE TIME            │
│  🚁 15-20 minutes                   │
│  (Rescue Team Alpha dispatched)     │
│                                     │
│  YOUR LOCATION IS BEING TRACKED     │
│  📍 Live updates every 10 seconds   │
│                                     │
│  WHAT TO DO NOW:                    │
│  ✓ Stay in safe location if possible│
│  ✓ Keep phone charged & on          │
│  ✓ Wave flashlight or cloth         │
│  ✓ Answer if rescue team calls      │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  [VIEW RESCUE STATUS]          │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  [CALL RESCUE TEAM: 8123-4567] │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  [CALL 911 DIRECTLY]           │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  [UPDATE STATUS]               │ │← If situation changes
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Audio/Haptic Feedback:**
- ✓ **Chime sound** (success tone)
- ✓ **Single vibration** (confirmation)
- ✓ **Screen stays on** (prevents accidental lock)

---

#### **Real-Time Tracking Screen**

**Tap "VIEW RESCUE STATUS":**
```
┌─────────────────────────────────────┐
│ 🚁 RESCUE TEAM STATUS               │
├─────────────────────────────────────┤
│                                     │
│         🚑 TEAM ALPHA               │
│         (Moving toward you)         │
│           ↓  ↓  ↓                   │
│        [Route line]                 │
│           ↓  ↓                      │
│         📍 YOU                      │
│         (Pulsing red)               │
│                                     │
│  Distance: 450 meters               │
│  ETA: 8 minutes                     │
│                                     │
│  Team Status: EN ROUTE ✓            │
│  Last Updated: 5 sec ago            │
│                                     │
│  TEAM DETAILS                       │
│  • 3 rescue personnel               │
│  • 1 medic                          │
│  • Equipped with boat               │
│                                     │
│  [CALL TEAM] [UPDATE MY STATUS]     │
└─────────────────────────────────────┘
```

**Updates Automatically:**
- Rescue team location (every 10 seconds)
- ETA countdown
- Status changes (Dispatched → En Route → Arrived)

---

#### **If You're Safe Before Rescue Arrives**

**Tap "UPDATE STATUS":**
```
┌─────────────────────────────────────┐
│ Update Your Status                  │
│                                     │
│ ○ Still need rescue                 │
│ ● I'm safe now ← Select this        │
│ ○ Situation worsened                │
│                                     │
│ Where are you now?                  │
│ ○ Same location                     │
│ ● Moved to safe building            │
│ ○ Already evacuated                 │
│                                     │
│ [CANCEL RESCUE] [UPDATE & KEEP      │
│                  REQUEST ACTIVE]    │
└─────────────────────────────────────┘
```

**If You Cancel:**
- Rescue team notified immediately
- Request marked "RESOLVED - Self-rescued"
- Officials can reallocate team to other emergencies
- You receive confirmation: "Rescue request cancelled. Glad you're safe!"

---

### 📞 **What Rescue Teams See**

When you send a request, **Barangay Officials** immediately see:

```
┌─────────────────────────────────────┐
│ 🚨 NEW RESCUE REQUEST               │
│ URGENT - 2:35 PM                    │
│                                     │
│ Juan dela Cruz + 2 others (3 total) │
│ 📍 14.5765, 120.9835                │
│ Arlegui Street, Zone 79             │
│ "Near San Sebastian Church"         │
│                                     │
│ Emergency: Trapped by water         │
│ Accessibility: Elderly person       │
│                                     │
│ [DISPATCH TEAM] [CALL REQUESTER]    │
│ [VIEW LOCATION ON MAP]              │
└─────────────────────────────────────┘
```

**Official Actions:**
1. Dispatch nearest rescue team
2. Call you to assess situation
3. Track your location in real-time
4. Coordinate with other emergency services

---

### ✅ **Immediate Benefits**

✓ **Fastest Rescue Request**: 2 taps, 10 seconds from SOS to dispatch  
✓ **Automatic Location Sharing**: No need to explain where you are  
✓ **Live Tracking**: Rescue team can find you even if you move  
✓ **Multi-Channel Alert**: SMS backup if internet fails  
✓ **Two-Way Communication**: Officials can call you directly  
✓ **Real-Time Updates**: See rescue team approaching on map  
✓ **Prevents Duplication**: System knows you already requested help  
✓ **Accessible Anytime**: Works from any screen during emergencies  

**⏱️ Total Time from Tap to Rescue Team Notified: 8-12 seconds**

---

## 4. Report Flood Condition

### 🎯 **Purpose**
This feature turns **you into a community sensor**. By reporting real-time flood conditions you observe, you help:
- **Other residents** avoid flooded areas
- **Barangay officials** verify sensor data and coordinate response
- **The system** improve route calculations and risk assessments

Your report updates the map, triggers alerts, and appears on the Official Dashboard within 5 seconds.

### 📍 **Where to Find It**

**Method 1: Home Screen**
- **Home Screen** → Scroll down → **"Report Flood Condition"** button

**Method 2: Map Screen**
- **Map Screen** → Long-press any location → **"Report Flooding Here"**

**Method 3: During Navigation**
- **Navigation Mode** → **"REPORT ISSUE"** button (if you encounter unexpected flooding)

**Method 4: Quick Gesture** (if enabled in Settings)
- Shake phone → Report dialog appears

### 🎯 **The Reporting Process**

---

#### **STEP 1: Open Report Dialog**

**What Appears:**
```
┌─────────────────────────────────────┐
│ 📍 Report Flood Condition           │
├─────────────────────────────────────┤
│                                     │
│ Help keep your community informed!  │
│ Your report will be verified by     │
│ officials and shared with residents.│
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ LOCATION (Required) ✓               │
│ ⦿ Current Location                  │← Auto-selected
│   📍 Arlegui Street, Zone 79        │
│   (Detected via GPS)                │
│                                     │
│ ○ Choose Different Location         │
│   (Tap to select from map)          │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ FLOOD SEVERITY (Required) ✓         │
│ [  Select severity  ▼]              │← Tap to open
│                                     │
└─────────────────────────────────────┘
```

**Time to Complete:** 30-60 seconds

---

#### **STEP 2: Select Flood Severity**

**Tap dropdown → Choose from visual options:**
```
┌─────────────────────────────────────┐
│ Select Flood Severity               │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ 💧 Wet/Puddling                  ││
│ │ Small puddles, roads passable    ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ 💧💧 Ankle-Deep (5-10 cm)        ││
│ │ Walking possible, shoes wet      ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ 💧💧💧 Knee-Deep (15-30 cm)      ││← Selected
│ │ Difficult to walk, vehicles risky││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ 💧💧💧💧 Waist-Deep (50+ cm)     ││
│ │ Dangerous, evacuation needed     ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ ⛔ Road Impassable                ││
│ │ Complete blockage, do not enter  ││
│ └─────────────────────────────────┘│
│                                     │
│ [CANCEL] [SELECT]                   │
└─────────────────────────────────────┘
```

**Visual Guides:**
- Each option shows water level icon (💧 count)
- Clear height measurements (cm)
- Practical description (what you can/can't do)

**Selection Confirmed:**
```
FLOOD SEVERITY (Required) ✓
[💧💧💧 Knee-Deep (15-30 cm) ▼]
```

---

#### **STEP 3: Add Details (Optional)**

**Scroll down to see optional fields:**
```
┌─────────────────────────────────────┐
│ ADDITIONAL DETAILS (Optional)       │
│                                     │
│ Describe what you see:              │
│ ┌─────────────────────────────────┐│
│ │ Water rising from canal overflow ││← Text area
│ │ blocking entire road. Debris...  ││  200 char max
│ │                                  ││
│ └─────────────────────────────────┘│
│ 145 / 200 characters                │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ ADD PHOTO (Optional)                │
│ ┌──────────────┐ ┌──────────────┐ │
│ │ 📷 Take Photo │ │ 🖼️ Choose    │ │
│ │              │ │  from Gallery │ │
│ └──────────────┘ └──────────────┘ │
│                                     │
│ 💡 Tip: Photos help officials verify││
│    reports faster                   │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ YOUR CONTACT (Optional)             │
│ ☐ Allow officials to call me        │
│   Phone: +63 917 *** **67          │
│                                     │
└─────────────────────────────────────┘
```

**Photo Capture:**
- **Tap "Take Photo"** → Camera opens
- Take picture of flooded area
- Preview shown with option to retake
- Photo compressed automatically (max 2MB)

**Why Photos Help:**
- Officials can verify severity
- Other residents see real conditions
- Creates documentation for response planning

---

#### **STEP 4: Submit Report**

**Bottom of form:**
```
┌─────────────────────────────────────┐
│ PREVIEW YOUR REPORT                 │
│                                     │
│ 📍 Location: Arlegui Street, Zone 79│
│ 💧 Severity: Knee-Deep (15-30 cm)   │
│ 📝 Details: Water rising from can...│
│ 📷 Photo: Yes (1 image attached)    │
│                                     │
│ Your name: Juan dela Cruz           │
│ Time: 2:45 PM, Oct 20, 2025        │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ By submitting, you confirm this     │
│ report is accurate to the best of   │
│ your knowledge.                     │
│                                     │
│ ┌───────────────────────────────┐  │
│ │      [SUBMIT REPORT]           │  │← Tap to send
│ └───────────────────────────────┘  │
│                                     │
│ [Cancel]                            │
└─────────────────────────────────────┘
```

**Tap "SUBMIT REPORT":**

**Loading State (2-3 seconds):**
```
┌─────────────────────────────────────┐
│         Submitting report...        │
│                                     │
│         ⏳ Please wait               │
│                                     │
│    [Animated spinner]               │
└─────────────────────────────────────┘
```

---

#### **STEP 5: Confirmation**

**Success Screen:**
```
┌─────────────────────────────────────┐
│   ✓ REPORT SUBMITTED                │
│                                     │
│   Thank you, Juan!                  │
│                                     │
│   Your flood report has been sent   │
│   to Barangay 728 officials and     │
│   added to the community map.       │
│                                     │
│   REPORT DETAILS                    │
│   Report #: FLD-20251020-144530     │
│   Location: Arlegui Street          │
│   Severity: Knee-Deep               │
│   Status: ⚠️ Pending Verification   │
│                                     │
│   WHAT HAPPENS NEXT?                │
│   1. Officials will review (5-15min)│
│   2. If verified, status → ✓        │
│   3. Other residents will see it    │
│   4. Routes will avoid this area    │
│                                     │
│   You can track your report in:     │
│   Settings > My Reports             │
│                                     │
│   ┌───────────────────────────────┐│
│   │  [VIEW ON MAP]                 ││
│   └───────────────────────────────┘│
│   ┌───────────────────────────────┐│
│   │  [SUBMIT ANOTHER REPORT]       ││
│   └───────────────────────────────┘│
│   ┌───────────────────────────────┐│
│   │  [BACK TO HOME]                ││
│   └───────────────────────────────┘│
└─────────────────────────────────────┘
```

**Automatic Actions (Behind the Scenes):**
1. **Map Update** (instant): Red/orange/yellow zone appears on public map
2. **Official Dashboard**: Report appears in "Pending Review" tab
3. **Push Notification** to Officials: "New flood report: Knee-deep at Arlegui Street"
4. **Route Algorithm Update**: Routes start avoiding this area (if severe)
5. **Database Log**: Report stored with timestamp, GPS, photo

---

### 📊 **Tracking Your Reports**

**Settings → My Reports:**
```
┌─────────────────────────────────────┐
│ My Flood Reports (3)                │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐│
│ │ ✓ VERIFIED                       ││
│ │ Knee-Deep - Arlegui Street       ││
│ │ Oct 20, 2:45 PM                  ││
│ │ Verified by: Official Santos     ││
│ │ [View on Map]                    ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ ⚠️ PENDING REVIEW                ││
│ │ Ankle-Deep - Side Street A       ││
│ │ Oct 20, 1:30 PM                  ││
│ │ Awaiting official verification   ││
│ │ [View Details]                   ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ ✓ RESOLVED                       ││
│ │ Puddling - Main Street           ││
│ │ Oct 19, 4:15 PM                  ││
│ │ Water receded - Resolved Oct 19  ││
│ │ [View History]                   ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

**Report Statuses:**
- ⚠️ **Pending Review**: Waiting for official verification (5-30 min)
- ✓ **Verified**: Confirmed accurate by officials
- ⚠️ **Under Investigation**: Officials checking the area
- ✓ **Resolved**: Water receded, condition improved
- ❌ **Rejected**: Could not verify or incorrect location

---

### 🏆 **Community Impact**

**After 10 Reports, You Unlock:**
```
┌─────────────────────────────────────��
│   🏆 ACHIEVEMENT UNLOCKED            │
│                                     │
│   Community Guardian                │
│                                     │
│   You've submitted 10 verified      │
│   flood reports, helping keep       │
│   Barangay 728 safe!                │
│                                     │
│   Badge earned ⭐                    │
│   Added to your profile             │
└─────────────────────────────────────┘
```

**Leaderboard (Optional, in Settings):**
- See top community reporters
- Encourages participation
- Builds trust in report quality

---

### ✅ **Immediate Benefits**

✓ **Quick Submission**: 30-60 seconds from start to confirmation  
✓ **Helps Your Neighbors**: Your report updates routes for everyone  
✓ **Assists Officials**: Verifies sensor data, fills coverage gaps  
✓ **Simple Interface**: Just location + severity (2 required fields)  
✓ **Photo Evidence**: Optional but speeds up verification  
✓ **Real-Time Impact**: Map updates in 5 seconds  
✓ **Track Your Contribution**: See verification status and history  
✓ **Community Recognition**: Badges for active reporters  
✓ **Improves System Accuracy**: More reports = better risk calculations  

**Why Your Report Matters:**
- Sensors can't be everywhere → **You are the sensor**
- Officials can't see everything → **You are their eyes**
- Other residents need current info → **You help them stay safe**

---

## 5. AI Chatbot and Preparedness Guidance

### 🎯 **Purpose**
The AI Chatbot is your **personal flood safety advisor** that translates complex PAGASA warnings, answers safety questions, and provides clear, actionable guidance in simple language (English or Filipino). Think of it as having a flood expert available 24/7.

### 📍 **Where to Find It**
**Bottom Navigation Bar** → Tap **"AI Help"** icon (4th icon, MessageSquare bubble)

### 👀 **What You See**

**Chat Interface:**
```
┌─────────────────────────────────────┐
│ ← Back    AI Flood Assistant    ⋮   │
├─────────────────────────────────────┤
│                                     │
│ 🤖 Hi Juan! I'm here to help you   │
│    stay safe during floods.         │
│                                     │
│    Ask me anything about:           │
│    • PAGASA warnings                │
│    • Evacuation procedures          │
│    • Safety tips                    │
│    • Emergency preparedness         │
│                                     │
│    Try these quick questions:       │
│    ┌─────────────────────────────┐ │
│    │ What's the current risk?     │ │← Tap to ask
│    └─────────────────────────────┘ │
│    ┌─────────────────────────────┐ │
│    │ How do I prepare my kit?     │ │
│    └─────────────────────────────┘ │
│    ┌─────────────────────────────┐ │
│    │ Is it safe to drive?         │ │
│    └─────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ Type your question...          [>]  │← Input field
└─────────────────────────────────────┘
```

### 🎯 **Key Use Cases**

---

### **Use Case 1: Understanding PAGASA Warnings**

**You Type:**
```
"What should I do for a PAGASA Red Warning?"
```

**OR Tap Quick Button:**
```
┌─────────────────────────────────┐
│ Explain PAGASA Red Warning     │
└─────────────────────────────────┘
```

**AI Response (2-3 seconds):**
```
┌─────────────────────────────────────┐
│ 🤖 AI Assistant • Just now          │
├─────────────────────────────────────┤
│                                     │
│ 🚨 PAGASA Red Warning - CRITICAL    │
│                                     │
│ Here's what you need to do RIGHT NOW:│
│                                     │
│ 1️⃣ EVACUATE IMMEDIATELY             │
│   • This is life-threatening        │
│   • Do NOT wait for water to rise   │
│   • Leave now even if roads clear   │
│                                     │
│ 2️⃣ GO TO NEAREST SHELTER            │
│   📍 Barangay Hall (850m, 12 min)   │
│   📍 Zone 79 Elementary (1.2km)     │
│                                     │
│   ┌─────────────────────────────┐  │
│   │ Show me the route            │  │← Tap to navigate
│   └─────────────────────────────┘  │
│                                     │
│ 3️⃣ BRING ESSENTIALS                 │
│   ✓ Important documents             │
│   ✓ Phone + charger                 │
│   ✓ Water & food (24 hrs)           │
│   ✓ Medications                     │
│   ✓ Flashlight                      │
│                                     │
│ 4️⃣ STAY INFORMED                    │
│   • Keep phone charged              │
│   • Monitor this app                │
│   • Follow officials' instructions  │
│                                     │
│ CURRENT CONDITIONS IN YOUR AREA:    │
│ • Water: 22 cm (rising) ⬆️           │
│ • Rain: Heavy (15.8 mm/hr) 🌧️       │
│ • Risk: CRITICAL 🚨                 │
│                                     │
│ Need rescue? ↓                      │
│ ┌─────────────────────────────┐    │
│ │ Request Emergency Assistance │    │
│ └─────────────────────────────┘    │
│                                     │
│ Have more questions? Ask me!        │
└─────────────────────────────────────┘
```

**Key Features:**
- ✅ **Numbered steps**: Clear action sequence
- ✅ **No jargon**: "Life-threatening" instead of "hydrological threshold exceeded"
- ✅ **Immediate actions**: Buttons for navigation, rescue
- ✅ **Current data**: Shows real conditions in your area
- ✅ **Bilingual**: Same response available in Filipino

---

### **Use Case 2: Safety Advice**

**You Type:**
```
"Is it safe to drive during moderate flooding?"
```

**AI Response:**
```
┌─────────────────────────────────────┐
│ 🤖 AI Assistant • Just now          │
├─────────────────────────────────────┤
│                                     │
│ 🚗 DRIVING SAFETY - Current Status  │
│                                     │
│ ⛔ NOT RECOMMENDED                   │
│                                     │
│ Here's why:                         │
│ • Water level: 15 cm (knee-deep)    │
│ • 3 roads reported as impassable    │
│ • Visibility: Poor (heavy rain)     │
│                                     │
│ ⚠️ DANGERS OF DRIVING IN FLOODS:    │
│                                     │
│ • Your car can STALL in just 15 cm  │
│   of water (current level!)         │
│                                     │
│ • Flowing water can SWEEP AWAY cars │
│   (even large SUVs)                 │
│                                     │
│ • You CANNOT SEE underwater:        │
│   - Potholes                        │
│   - Debris                          │
│   - Open manholes                   │
│                                     │
│ WHAT TO DO INSTEAD:                 │
│ ✓ Stay where you are (if safe)      │
│ ✓ Walk to nearest shelter           │
│ ✓ If already driving: Park on       │
│   high ground immediately           │
│                                     │
│ 💡 REMEMBER:                         │
│ "Turn Around, Don't Drown"          │
│                                     │
│ • 6 inches (15 cm) → Knock you down │
│ • 12 inches (30 cm) → Move a car    │
│ • 24 inches (60 cm) → Sweep SUV     │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Show flooded roads on map    │    │
│ └─────────────────────────────┘    │
│                                     │
│ Need evacuation help?               │
│ ┌─────────────────────────────┐    │
│ │ Request Assistance           │    │
│ └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Why This Helps:**
- ✅ **Clear recommendation**: Yes/No answer upfront
- ✅ **Evidence-based**: Uses current conditions (15 cm water)
- ✅ **Visual measurements**: Relates cm to familiar depths
- ✅ **Practical alternatives**: Tells you what TO do, not just what NOT to do
- ✅ **Safety rules**: Memorable phrases ("Turn Around, Don't Drown")

---

### **Use Case 3: Forecast & Duration**

**You Type:**
```
"How long will the flooding last?"
```

**AI Response:**
```
┌─────────────────────────────────────┐
│ 🤖 AI Assistant • Just now          │
├─────────────────────────────────────┤
│                                     │
│ ⏰ FLOOD FORECAST FOR YOUR AREA     │
│                                     │
│ Based on PAGASA and local sensors:  │
│                                     │
│ CURRENT SITUATION (2:45 PM)         │
│ 🌧️ Rain: Moderate to heavy          │
│    (12.5 mm/hr)                     │
│ 💧 Water: 15 cm (rising slowly)     │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ FORECAST TIMELINE:                  │
│                                     │
│ 🕐 Next 3 hours (2:45 PM - 5:45 PM) │
│    Rain expected to CONTINUE        │
│    Water level may rise to 20-25 cm │
│    ⚠️ Risk increases to HIGH        │
│                                     │
│ 🕕 Peak Time: ~6:00 PM Tonight      │
│    Maximum water level expected     │
│    🔴 Critical risk period          │
│                                     │
│ 🕘 After 9:00 PM Tonight            │
│    Rain likely to stop              │
│    Water level starts RECEDING      │
│    ⬇️ Risk begins to decrease        │
│                                     │
│ 🕛 Tomorrow Morning (8:00 AM)       │
│    Water may drop below 10 cm       │
│    Roads clearing for travel        │
│    ✓ Conditions improving           │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ ⚠️ IMPORTANT NOTES:                 │
│                                     │
│ • Even after rain stops, drainage   │
│   takes 3-6 hours                   │
│                                     │
│ • Roads may be unsafe until         │
│   tomorrow morning                  │
│                                     │
│ • Stay in shelter overnight if      │
│   evacuated                         │
│                                     │
│ WHEN IT'S SAFE TO RETURN HOME:      │
│ I'll notify you when:               │
│ ✓ Water drops below 10 cm           │
│ ✓ Officials clear roads             │
│ ✓ Risk returns to "Low"             │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Enable Return Notifications   │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ View Detailed Forecast        │    │
│ └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Why This Helps:**
- ✅ **Timeline format**: Hour-by-hour breakdown
- ✅ **Visual timeline**: Clock emojis + time labels
- ✅ **Peak identification**: Knows when it's worst
- ✅ **Return guidance**: Tells you when it's safe to go home
- ✅ **Proactive alerts**: Offers to notify when safe

---

### **Use Case 4: Emergency Preparedness**

**You Type:**
```
"What should be in my emergency kit?"
```

**AI Response:**
```
┌─────────────────────────────────────┐
│ 🤖 AI Assistant • Just now          │
├─────────────────────────────────────┤
│                                     │
│ 🎒 EMERGENCY KIT CHECKLIST          │
│                                     │
│ Here's what to pack for evacuation: │
│                                     │
│ 📄 IMPORTANT DOCUMENTS              │
│ (Keep in waterproof bag)            │
│ ☐ IDs (Passport, Driver's License)  │
│ ☐ Birth certificates                │
│ ☐ Property documents                │
│ ☐ Insurance papers                  │
│ ☐ Medical records                   │
│                                     │
│ 🔋 ELECTRONICS                      │
│ ☐ Fully charged phone               │
│ ☐ Phone charger + power bank        │
│ ☐ Flashlight (with extra batteries) │
│ ☐ Portable radio                    │
│                                     │
│ 💊 MEDICAL SUPPLIES                 │
│ ☐ Prescription medications (7 days) │
│ ☐ First aid kit                     │
│ ☐ Personal hygiene items            │
│ ☐ Face masks                        │
│                                     │
│ 🥫 FOOD & WATER                     │
│ ☐ Drinking water (1 gal/person/day) │
│ ☐ Non-perishable food (3 days min)  │
│ ☐ Can opener                        │
│ ☐ Baby formula/food (if needed)     │
│                                     │
│ 👕 CLOTHING                         │
│ ☐ Change of clothes (2-3 days)      │
│ ☐ Raincoat/waterproof jacket        │
│ ☐ Sturdy shoes (not slippers)       │
│ ☐ Blanket or sleeping bag           │
│                                     │
│ 💰 CASH & VALUABLES                 │
│ ☐ Cash (ATMs may be offline)        │
│ ☐ Small bills for emergencies       │
│ ☐ Jewelry (if easily portable)      │
│                                     │
│ 🐾 FOR PETS                         │
│ ☐ Pet food & water (3 days)         │
│ ☐ Leash, carrier, or cage           │
│ ☐ Pet medications                   │
│ ☐ Pet ID tags                       │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ 💡 PRO TIPS:                         │
│                                     │
│ 1. Keep kit in ONE place (easy grab)│
│ 2. Use waterproof bags/containers   │
│ 3. Update every 6 months            │
│ 4. Each family member has own bag   │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Save Checklist to Phone      │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Share with Family             │    │
│ └─────────────────────────────┘    │
│                                     │
│ Want evacuation shelter info?       │
│ ┌─────────────────────────────┐    │
│ │ View Shelter Locations        │    │
│ └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Why This Helps:**
- ✅ **Checklist format**: Easy to follow, can check off items
- ✅ **Categorized**: Organized by type (documents, medical, etc.)
- ✅ **Quantities specified**: "7 days medication", "1 gal/person/day"
- ✅ **Actionable buttons**: Save, share, view shelters
- ✅ **Pro tips**: Practical advice from experience

---

### **Use Case 5: Quick Status Check**

**Tap Quick Button:**
```
┌─────────────────────────────────┐
│ What's the current risk?        │
└─────────────────────────────────┘
```

**AI Response (Instant):**
```
┌─────────────────────────────────────┐
│ 🤖 AI Assistant • Just now          │
├─────────────────────────────────────┤
│                                     │
│ 📊 CURRENT FLOOD STATUS             │
│ Barangay 728, Zone 79               │
│ As of: 2:45 PM, Oct 20, 2025       │
│                                     │
│ 🟠 RISK LEVEL: HIGH                 │
│ ⚠️ Prepare to Evacuate              │
│                                     │
│ DETAILS:                            │
│ • Water Level: 22 cm (Alert!)       │
│ • Rainfall: Heavy (15.8 mm/hr)      │
│ • PAGASA: Orange Warning            │
│ • Sensor Status: All online ✓       │
│ • Community Reports: 3 active       │
│                                     │
│ WHAT TO DO NOW:                     │
│ 1. Prepare emergency kit            │
│ 2. Identify evacuation route        │
│ 3. Monitor updates every 30 min     │
│ 4. Be ready to leave in 1 hour      │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ View Evacuation Centers       │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Get Detailed Forecast         │    │
│ └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

---

### 🌏 **Language Support**

**Switch to Filipino (Tagalog):**

Same question in Filipino:
```
"Ano ang dapat kong gawin para sa PAGASA Red Warning?"
```

**AI Response in Filipino:**
```
┌─────────────────────────────────────┐
│ 🤖 AI Assistant • Kamakailan        │
├─────────────────────────────────────┤
│                                     │
│ 🚨 PAGASA Red Warning - KRITIKAL    │
│                                     │
│ Ito ang dapat ninyong gawin NGAYON: │
│                                     │
│ 1️⃣ LUMIKAS NA                        │
│   • Mapanganib ang baha na ito      │
│   • HUWAG nang maghintay            │
│   • Umalis na kahit mukhang OK pa   │
│                                     │
│ 2️⃣ PUMUNTA SA EVACUATION CENTER     │
│   📍 Barangay Hall (850m, 12 min)   │
│   📍 Zone 79 Elementary (1.2km)     │
│                                     │
│   ┌─────────────────────────────┐  │
│   │ Ipakita ang ruta             │  │
│   └─────────────────────────────┘  │
│                                     │
│ 3️⃣ DALHIN ANG MGA ITO               │
│   ✓ Mahalagang dokumento            │
│   ✓ Cellphone + charger             │
│   ✓ Tubig at pagkain (24 oras)      │
│   ✓ Gamot                           │
│   ✓ Flashlight                      │
│                                     │
│ [Rest of response in Filipino...]   │
└─────────────────────────────────────┘
```

**Language Detection:**
- Automatically detects your language
- Responds in same language (English or Filipino)
- Can switch mid-conversation
- Settings → Language preference

---

### 🔍 **Additional Features**

#### **Conversation History**
```
[Scroll up to see past messages]

┌─────────────────────────────────────┐
│ 👤 You • 1:30 PM                    │
│ Is it safe to drive?                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🤖 AI Assistant • 1:30 PM           │
│ ⛔ NOT RECOMMENDED                   │
│ [Full response from earlier...]     │
└─────────────────────────────────────┘
```

**Benefit**: Review past advice without re-asking

---

#### **Quick Action Buttons**

Always visible at bottom:
```
┌─────────────────────────────────────┐
│ QUICK ACTIONS:                      │
│ [Current Risk] [Evacuation Info]    │
│ [Weather Forecast] [Safety Tips]    │
└─────────────────────────────────────┘
```

**Tap any button → Instant answer (no typing needed)**

---

#### **Share Responses**

```
[Top-right menu] → Share

Share this advice via:
• SMS (send to family)
• Messenger
• Copy text
```

**Use Case**: Share evacuation instructions with elderly relatives who don't have the app

---

### ✅ **Immediate Benefits**

✓ **Plain Language**: No technical jargon, simple explanations  
✓ **Instant Answers**: 2-3 second response time  
✓ **Context-Aware**: Uses YOUR current location and conditions  
✓ **Actionable Advice**: Every answer includes what to DO  
✓ **Bilingual**: Works in English and Filipino seamlessly  
✓ **24/7 Available**: Get answers anytime, even 3 AM  
✓ **No Training Needed**: Just ask like you're talking to a person  
✓ **Saves Time**: Faster than reading long PAGASA bulletins  
✓ **Emergency Shortcuts**: Quick buttons for urgent questions  
✓ **Shareable**: Send advice to family members  

**Translation Example:**
- ❌ **Before**: "The synoptic situation indicates a low-pressure area with enhanced southwest monsoon causing moderate to heavy rainfall..."
- ✅ **After (AI)**: "Heavy rain is coming in the next 3 hours. You should prepare your emergency kit and monitor the app every 30 minutes."

---

## 📱 Complete Resident User Journey Example

### **Scenario: Flood Event from Start to Finish**

**Morning (8:00 AM)**
1. ✅ Open app → 🟢 Green card "Normal Conditions"
2. ✅ Ask chatbot: "Should I prepare anything today?"
   - AI: "Light rain forecast, prepare emergency kit just in case"

**Afternoon (2:00 PM)**
1. 🔔 Push notification: "Flood risk upgraded to MODERATE"
2. ✅ Open app → 🟡 Yellow card "Monitor Conditions"
3. ✅ Check map → See yellow zones forming
4. ✅ Ask chatbot: "How long will it rain?"
   - AI: "Rain continues for 3-5 hours, prepare to evacuate"

**Late Afternoon (4:30 PM)**
1. 🔔 Push notification: "CRITICAL ALERT - Evacuate Now"
2. ✅ Open app → 🔴 Red card flashing
3. ✅ Tap "GET EVACUATION ROUTE NOW"
   - Map shows: Barangay Hall, 850m, 12 min walk
4. ✅ Tap "START NAVIGATION"
   - Voice: "Head north on Arlegui Street"

**During Evacuation (4:45 PM)**
1. ✅ See flooding on Side Street A
2. ✅ Tap "REPORT ISSUE" → "Knee-deep flooding"
3. ✅ Submit report with photo
4. ✅ Route automatically re-calculates
   - Voice: "Route updated, turn left instead"

**At Shelter (5:15 PM)**
1. ✅ Arrived safely
2. ✅ Tap "I'M SAFE" button
   - Confirmation sent to officials
3. ✅ Ask chatbot: "When can I go home?"
   - AI: "Water should recede by 9 PM, safe to return tomorrow morning"

**Next Day (8:00 AM)**
1. 🔔 Notification: "Flood risk lowered to NORMAL"
2. ✅ Check map → All green, routes clear
3. ✅ Ask chatbot: "Is it safe to return home?"
   - AI: "Yes, officials have cleared roads. Water level is 5 cm."
4. ✅ Return home safely

---

## 🎯 Summary: Why These Features Work Together

| Feature | Immediate Answer | Action Enabled | Time Saved |
|---------|------------------|----------------|------------|
| **Risk Card** | "Am I in danger?" | Know risk level in 1 sec | No need to read complex bulletins |
| **Map** | "How do I get to safety?" | Navigate to shelter in 2 taps | No guessing which route is safe |
| **Rescue** | "I need help NOW" | Rescue dispatched in 10 sec | Official knows exactly where you are |
| **Report** | "Others should know this" | Community warned in 5 sec | Prevents others from entering danger |
| **Chatbot** | "What does this warning mean?" | Understand + act in 2 min | No confusion, clear instructions |

**Result**: From **"I see flood warning"** to **"I'm safely evacuated"** in under 30 minutes, with clear guidance at every step.

---

*This guide is designed for Residents of Barangay 728. For Official and Administrator functions, see separate documentation.*
