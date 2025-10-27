# Phase 1: Foundation and Security Provisioning Documentation

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Cloud Infrastructure Provisioning](#cloud-infrastructure-provisioning)
4. [Database Provisioning (Firestore)](#database-provisioning-firestore)
5. [Security Rules Definition (RBAC)](#security-rules-definition-rbac)
6. [Third-Party API Key Configuration](#third-party-api-key-configuration)
7. [Environment Setup and Configuration](#environment-setup-and-configuration)
8. [Project Structure and Architecture](#project-structure-and-architecture)
9. [Deployment Guide](#deployment-guide)
10. [Security Implementation](#security-implementation)
11. [Testing and Validation](#testing-and-validation)
12. [Troubleshooting](#troubleshooting)

---

## Overview

Phase 1 establishes the foundational infrastructure and security framework for the HydroAlert system. This phase focuses on setting up the cloud infrastructure, configuring the database, implementing role-based access control, and managing third-party API integrations.

### Key Components
1. **Cloud Infrastructure Provisioning** - Firebase project setup and configuration
2. **Database Provisioning** - Firestore database schema and collections
3. **Security Rules Definition** - RBAC implementation and access control
4. **Third-Party API Key Configuration** - Environment variables and API management

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    HydroAlert Foundation                    │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React + Vite)                                   │
│  ├── Firebase Authentication                               │
│  ├── Firestore Database Access                            │
│  ├── Role-Based UI Components                             │
│  └── Environment Configuration                            │
├─────────────────────────────────────────────────────────────┤
│  Backend (Firebase Functions)                              │
│  ├── Cloud Functions                                       │
│  ├── Firestore Triggers                                   │
│  ├── Scheduled Functions                                   │
│  └── HTTP Endpoints                                        │
├─────────────────────────────────────────────────────────────┤
│  Database (Firestore)                                      │
│  ├── Users Collection                                      │
│  ├── Alerts Collection                                     │
│  ├── Sensor Data Collection                                │
│  └── Weather Data Collection                               │
├─────────────────────────────────────────────────────────────┤
│  Security Layer                                            │
│  ├── RBAC (Role-Based Access Control)                     │
│  ├── Firestore Security Rules                             │
│  ├── API Key Management                                   │
│  └── Environment Variables                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### System Requirements
- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **Firebase CLI**: Version 12.x or higher
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Required Accounts
- **Firebase Account**: Google account with Firebase access
- **Google Cloud Platform**: For Firebase project management
- **PAGASA API Access**: For weather data integration (if available)

### Development Tools
- **Code Editor**: VS Code (recommended)
- **Firebase Extensions**: VS Code Firebase extension
- **Git Client**: For version control

---

## Cloud Infrastructure Provisioning

### Firebase Project Setup

#### 1. Create Firebase Project
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init
```

#### 2. Project Configuration
```json
// firebase.json
{
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "disallowLegacyRuntimeConfig": true,
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log",
        "*.local"
      ],
      "predeploy": [
        "npm --prefix \"$RESOURCE_DIR\" run lint",
        "npm --prefix \"$RESOURCE_DIR\" run build"
      ]
    }
  ],
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### 3. Firebase Services Configuration
```typescript
// firebaseConfig.ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

### Firebase Services Enabled
- **Authentication**: User management and authentication
- **Firestore**: NoSQL database for real-time data
- **Cloud Functions**: Serverless backend functions
- **Hosting**: Static web hosting
- **Analytics**: User behavior tracking

---

## Database Provisioning (Firestore)

### Database Schema Design

#### 1. Collections Structure
```
hydroalert-user/
├── users/                    # User profiles and authentication
├── alerts/                   # Flood alerts and notifications
├── rawSensorData/           # IoT sensor readings
├── pagasaForecasts/         # Weather forecast data
├── communityReports/        # User-submitted flood reports
├── rescueRequests/          # Emergency rescue requests
├── evacuationCenters/       # Evacuation center information
└── systemConfig/            # System configuration settings
```

#### 2. Users Collection Schema
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: 'resident' | 'official' | 'administrator';
  barangay: string;
  phoneNumber?: string;
  emergencyContact?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  isActive: boolean;
  preferences: {
    language: 'en' | 'fil';
    notifications: boolean;
    locationSharing: boolean;
  };
}
```

#### 3. Alerts Collection Schema
```typescript
interface Alert {
  id: string;
  locationId: string;
  riskScore: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  message: string;
  timestamp: Timestamp;
  location: {
    lat: number;
    long: number;
    city: string;
    barangay: string;
  };
  source: 'sensor' | 'manual' | 'pagasa';
  isActive: boolean;
  acknowledgedBy: string[];
}
```

#### 4. Raw Sensor Data Schema
```typescript
interface RawSensorData {
  id: string;
  locationId: string;
  waterLevel: number;
  temperature?: number;
  batteryLevel?: number;
  timestamp: Timestamp;
  receivedAt: Timestamp;
  deviceId: string;
  signalStrength?: number;
}
```

#### 5. Community Reports Schema
```typescript
interface CommunityReport {
  id: string;
  reporterId: string;
  location: {
    lat: number;
    long: number;
    address: string;
  };
  reportType: 'flood' | 'damage' | 'evacuation' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'verified' | 'resolved' | 'false_alarm';
  timestamp: Timestamp;
  verifiedBy?: string;
  verifiedAt?: Timestamp;
  images?: string[];
}
```

### Database Indexes Configuration
```json
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "alerts",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "severity",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "rawSensorData",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "locationId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "communityReports",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## Security Rules Definition (RBAC)

### Role-Based Access Control Implementation

#### 1. User Roles Definition
```typescript
type UserRole = 'resident' | 'official' | 'administrator';

interface RolePermissions {
  canReadAlerts: boolean;
  canCreateReports: boolean;
  canManageUsers: boolean;
  canAccessAdminPanel: boolean;
  canViewSystemConfig: boolean;
  canManageSensors: boolean;
}
```

#### 2. Role Permissions Matrix
| Permission | Resident | Official | Administrator |
|------------|----------|----------|---------------|
| View Alerts | ✅ | ✅ | ✅ |
| Create Reports | ✅ | ✅ | ✅ |
| Manage Reports | ❌ | ✅ | ✅ |
| View Users | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| System Config | ❌ | ❌ | ✅ |
| Sensor Control | ❌ | ❌ | ✅ |

#### 3. Firestore Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['official', 'administrator'];
    }
    
    // Alerts collection - all authenticated users can read, only system can write
    match /alerts/{alertId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'administrator';
    }
    
    // Raw sensor data - system write only, officials and admins can read
    match /rawSensorData/{dataId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['official', 'administrator'];
      allow write: if false; // Only system functions can write
    }
    
    // Community reports - residents can create, officials can manage
    match /communityReports/{reportId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['official', 'administrator'];
    }
    
    // PAGASA forecasts - public read, system write
    match /pagasaForecasts/{forecastId} {
      allow read: if true;
      allow write: if false; // Only system functions can write
    }
    
    // System configuration - admin only
    match /systemConfig/{configId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'administrator';
    }
    
    // Rescue requests - residents can create, officials can manage
    match /rescueRequests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['official', 'administrator'];
    }
  }
}
```

#### 4. Frontend RBAC Implementation
```typescript
// App.tsx - Role-based navigation and routing
const getNavigationItems = () => {
  const baseItems = [
    { id: 'settings' as Screen, icon: Settings, label: { en: 'Settings', fil: 'Settings' } }
  ];

  if (userSession.role === 'resident') {
    return [
      { id: 'home' as Screen, icon: Home, label: { en: 'Home', fil: 'Home' } },
      { id: 'map' as Screen, icon: Map, label: { en: 'Map', fil: 'Mapa' } },
      { id: 'alerts' as Screen, icon: Bell, label: { en: 'Alerts', fil: 'Alerto' } },
      { id: 'chatbot' as Screen, icon: MessageSquare, label: { en: 'AI Help', fil: 'AI Tulong' } },
      ...baseItems
    ];
  } else if (userSession.role === 'official' || userSession.role === 'administrator') {
    return [
      { id: 'dashboard' as Screen, icon: BarChart3, label: { en: 'Dashboard', fil: 'Dashboard' } },
      { id: 'map' as Screen, icon: Map, label: { en: 'Map', fil: 'Mapa' } },
      { id: 'alerts' as Screen, icon: Bell, label: { en: 'Alerts', fil: 'Alerto' } },
      { id: 'chatbot' as Screen, icon: MessageSquare, label: { en: 'AI Help', fil: 'AI Tulong' } },
      ...baseItems
    ];
  }
  return baseItems;
};
```

#### 5. Component-Level Access Control
```typescript
// Example: Admin-only features
{userSession?.role === 'administrator' && (
  <AdminOnlyComponent />
)}

// Example: Official and Admin features
{(userSession?.role === 'official' || userSession?.role === 'administrator') && (
  <OfficialFeature />
)}
```

---

## Third-Party API Key Configuration

### Environment Variables Setup

#### 1. Frontend Environment Configuration
```bash
# .env (Frontend)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional: PAGASA API (if available)
VITE_PAGASA_API_KEY=your_pagasa_api_key
VITE_PAGASA_API_URL=https://api.pagasa.ph/weather/latest
```

#### 2. Backend Environment Configuration
```bash
# Firebase Functions environment variables
firebase functions:config:set \
  iot.secret_key="your_secure_iot_secret_key" \
  pagasa.api_key="your_pagasa_api_key" \
  pagasa.api_url="https://api.pagasa.ph/weather/latest" \
  monitoring.critical_water_level="1.5" \
  notifications.sms_api_key="your_sms_api_key" \
  notifications.email_api_key="your_email_api_key"
```

#### 3. API Key Management Strategy
```typescript
// firebaseConfig.ts - Environment variable handling
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "fallback_key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fallback_domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fallback_project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fallback_bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "fallback_sender",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "fallback_app",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "fallback_measurement"
};
```

### API Integration Configuration

#### 1. PAGASA API Integration
```typescript
// Backend API configuration
const PAGASA_API_URL = functions.config().pagasa?.api_url || 
  "https://api.pagasa.ph/weather/latest";
const PAGASA_API_KEY = functions.config().pagasa?.api_key;

// API request with authentication
const response = await axios.get(PAGASA_API_URL, {
  headers: {
    'Authorization': `Bearer ${PAGASA_API_KEY}`,
    'Content-Type': 'application/json'
  }
});
```

#### 2. IoT Device API Configuration
```typescript
// IoT endpoint security
const IOT_SECRET_KEY = functions.config().iot?.secret_key || 
  "YOUR_SECURE_IOT_SECRET_KEY";

// API key validation
const apiKey = request.headers["x-api-key"];
if (!apiKey || apiKey !== IOT_SECRET_KEY) {
  response.status(401).send({
    status: "error",
    message: "Unauthorized. Missing or invalid API Key."
  });
  return;
}
```

---

## Environment Setup and Configuration

### Development Environment Setup

#### 1. Project Initialization
```bash
# Clone or create project directory
mkdir Hydro_Alert
cd Hydro_Alert

# Initialize frontend
cd Frontend/Hydro_Alert_User
npm create vite@latest . -- --template react-ts
npm install

# Initialize backend
cd ../../Backend
firebase init functions
cd functions
npm install
```

#### 2. Dependencies Installation
```bash
# Frontend dependencies
npm install firebase @radix-ui/react-* lucide-react tailwindcss

# Backend dependencies
npm install firebase-admin firebase-functions axios
```

#### 3. Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### Production Environment Setup

#### 1. Environment Variables for Production
```bash
# Set production environment variables
firebase functions:config:set \
  --project=your-production-project \
  iot.secret_key="production_secret_key" \
  pagasa.api_key="production_pagasa_key"
```

#### 2. Build and Deployment
```bash
# Build frontend
npm run build

# Deploy to Firebase
firebase deploy --only hosting,functions,firestore
```

---

## Project Structure and Architecture

### Directory Structure
```
Hydro_Alert/
├── Backend/
│   ├── functions/
│   │   ├── src/
│   │   │   └── index.ts          # Cloud Functions
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── firebase.json             # Firebase configuration
├── Frontend/
│   └── Hydro_Alert_User/
│       ├── src/
│       │   ├── components/       # React components
│       │   ├── firebaseConfig.ts # Firebase configuration
│       │   ├── App.tsx          # Main application
│       │   └── main.tsx         # Entry point
│       ├── package.json
│       └── vite.config.ts
├── PHASE_1_DOCUMENTATION.md     # This documentation
└── PHASE_2_DOCUMENTATION.md     # Phase 2 documentation
```

### Component Architecture
```
src/
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── SignInScreen.tsx         # Authentication
│   ├── HomeScreen.tsx           # Resident dashboard
│   ├── OfficialDashboard.tsx    # Official dashboard
│   ├── AdminDashboard.tsx       # Admin dashboard
│   ├── MapView.tsx              # Map interface
│   ├── AlertsScreen.tsx         # Alerts display
│   ├── ChatbotScreen.tsx        # AI assistant
│   └── SettingsScreen.tsx       # User settings
├── firebaseConfig.ts            # Firebase setup
├── App.tsx                      # Main app with routing
└── main.tsx                     # Application entry
```

---

## Deployment Guide

### Step 1: Firebase Project Setup
```bash
# Create Firebase project
firebase projects:create hydroalert-production

# Set active project
firebase use hydroalert-production

# Initialize services
firebase init
```

### Step 2: Environment Configuration
```bash
# Set environment variables
firebase functions:config:set \
  iot.secret_key="your_production_secret" \
  pagasa.api_key="your_pagasa_key"

# Deploy security rules
firebase deploy --only firestore:rules
```

### Step 3: Database Setup
```bash
# Deploy database indexes
firebase deploy --only firestore:indexes

# Initialize collections (if needed)
# This can be done through Firebase Console or programmatically
```

### Step 4: Frontend Deployment
```bash
# Build frontend
cd Frontend/Hydro_Alert_User
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Step 5: Backend Deployment
```bash
# Deploy Cloud Functions
cd Backend/functions
firebase deploy --only functions
```

### Step 6: Verification
```bash
# Check deployment status
firebase projects:list
firebase functions:list
firebase hosting:sites:list

# Test deployment
curl https://your-project.web.app
```

---

## Security Implementation

### Authentication Security
```typescript
// Firebase Authentication configuration
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const auth = getAuth();

// Secure sign-in
const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};
```

### Data Security
```typescript
// Secure data access patterns
const getUserData = async (userId: string) => {
  const userDoc = await db.collection('users').doc(userId).get();
  
  if (!userDoc.exists) {
    throw new Error('User not found');
  }
  
  const userData = userDoc.data();
  
  // Remove sensitive data before sending to client
  const { password, ...safeUserData } = userData;
  return safeUserData;
};
```

### API Security
```typescript
// Secure API endpoint
export const secureEndpoint = functions.https.onRequest(async (req, res) => {
  // CORS configuration
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Authentication check
  if (!req.headers.authorization) {
    res.status(401).send('Unauthorized');
    return;
  }
  
  // Process request
  // ...
});
```

---

## Testing and Validation

### Unit Testing Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Configure vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

### Integration Testing
```typescript
// Example integration test
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App Integration', () => {
  test('renders sign-in screen for unauthenticated users', () => {
    render(<App />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
  
  test('renders dashboard for authenticated officials', () => {
    // Mock authenticated user
    const mockUser = { role: 'official' };
    render(<App user={mockUser} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
```

### Security Testing
```typescript
// Security rule testing
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';

describe('Firestore Security Rules', () => {
  test('users can only read their own data', async () => {
    const testEnv = await initializeTestEnvironment({
      projectId: 'test-project',
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8'),
      },
    });
    
    const alice = testEnv.authenticatedContext('alice');
    const bob = testEnv.authenticatedContext('bob');
    
    await alice.firestore().collection('users').doc('alice').set({
      name: 'Alice',
      role: 'resident'
    });
    
    // Alice can read her own data
    await expect(
      alice.firestore().collection('users').doc('alice').get()
    ).toAllow();
    
    // Bob cannot read Alice's data
    await expect(
      bob.firestore().collection('users').doc('alice').get()
    ).toDeny();
  });
});
```

### Validation Checklist
- [ ] Firebase project created and configured
- [ ] Firestore database schema implemented
- [ ] Security rules deployed and tested
- [ ] Environment variables configured
- [ ] Authentication system working
- [ ] RBAC implementation verified
- [ ] API endpoints secured
- [ ] Frontend builds successfully
- [ ] Backend functions deploy correctly
- [ ] Database indexes created
- [ ] Security rules tested
- [ ] Environment variables loaded correctly

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Firebase Configuration Issues
**Problem**: Firebase not initializing
**Solution**:
```typescript
// Check environment variables
console.log('Firebase Config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
});

// Verify Firebase project ID
firebase projects:list
```

#### 2. Firestore Security Rules Issues
**Problem**: Permission denied errors
**Solution**:
```bash
# Test security rules locally
firebase emulators:start --only firestore

# Check rule syntax
firebase deploy --only firestore:rules --dry-run
```

#### 3. Environment Variables Not Loading
**Problem**: Environment variables undefined
**Solution**:
```bash
# Check .env file location
ls -la .env

# Verify variable names (must start with VITE_)
cat .env | grep VITE_

# Restart development server
npm run dev
```

#### 4. Authentication Issues
**Problem**: Users cannot sign in
**Solution**:
```typescript
// Check authentication state
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User signed in:', user.uid);
  } else {
    console.log('User signed out');
  }
});
```

#### 5. Build and Deployment Issues
**Problem**: Build failures
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run build

# Verify Firebase CLI version
firebase --version
```

### Debugging Tools
```typescript
// Firebase debugging
import { connectFirestoreEmulator } from 'firebase/firestore';

if (location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

// Environment debugging
console.log('Environment:', {
  NODE_ENV: import.meta.env.MODE,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID
});
```

---

## Next Steps

After successful Phase 1 completion:

1. **Phase 2**: Core Data Engine Activation
   - IoT Data Ingestion Pipeline
   - PAGASA API Polling Service
   - AI Risk Decision Scheduler

2. **Phase 3**: Frontend Integration
   - Real-time data display
   - Interactive maps
   - Alert notifications

3. **Phase 4**: Advanced Features
   - Machine learning integration
   - Advanced analytics
   - Mobile optimization

### Maintenance Tasks
- Regular security audits
- Environment variable rotation
- Database optimization
- Performance monitoring
- Documentation updates

---

## Support and Resources

### Documentation References
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

### Contact Information
- Technical Support: [Your support email]
- Emergency Contact: [Your emergency contact]
- Documentation Updates: [Your documentation contact]

---

*This documentation is part of the HydroAlert project and should be updated as the system evolves.*
