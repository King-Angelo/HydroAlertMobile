# Hydro Alert - Role-Based Access Control (RBAC) Documentation

## 🔐 Overview

The Hydro Alert application implements a comprehensive Role-Based Access Control system to provide differentiated access and functionality based on user roles. The system supports three distinct roles, each with specific permissions and interface customizations.

---

## 👥 User Roles

### 1. **Resident** (Standard User)
**Purpose**: General public users of Barangay 728

**Access Level**: Basic flood monitoring and emergency features

**Key Features**:
- Real-time flood status monitoring
- Water level and rainfall data
- Emergency alerts and notifications
- Evacuation route mapping
- Flood condition reporting
- Emergency rescue requests
- AI chatbot assistance
- Emergency contacts

**Navigation**:
- Home (Flood Status Dashboard)
- Map (Evacuation Routes)
- Alerts (Notifications)
- AI Help (Chatbot)
- Settings

---

### 2. **Barangay Official**
**Purpose**: Local government officials managing emergency response

**Access Level**: Enhanced monitoring + community report management

**Key Features**:
- All Resident features, plus:
- **Official Dashboard** with real-time statistics
  - Active flood reports count
  - Pending rescue requests
  - Evacuation center capacity
  - Community engagement metrics
- **Community Report Management**
  - Review and verify flood reports
  - Mark reports as resolved
  - View reporter details and locations
  - Priority-based report filtering
- **Rescue Request Coordination**
  - View pending rescue requests
  - Dispatch rescue teams
  - Track rescue operation status
  - View requester location and details
- **Evacuation Center Monitoring**
  - Real-time capacity tracking
  - Shelter status overview
  - Resource allocation insights

**Navigation**:
- Dashboard (Official Command Center)
- Map (Route Planning)
- Alerts (System Notifications)
- AI Help (Decision Support)
- Settings

**Dashboard Tabs**:
- Community Reports
- Rescue Requests

---

### 3. **System Administrator**
**Purpose**: Technical staff managing system operations

**Access Level**: Full system access and configuration

**Key Features**:
- All Official features, plus:
- **System Overview Dashboard**
  - Total users count
  - Active users monitoring
  - Sensor health status
  - System uptime metrics
- **User Management**
  - View all registered users
  - Edit user profiles
  - Enable/disable user accounts
  - View last activity timestamps
  - Role assignment capabilities
- **System Configuration**
  - Sensor status monitoring and control
    - Water Level Sensor
    - Rainfall Sensor
    - Weather Station
  - Toggle sensor operational status
- **Notification Settings Management**
  - SMS alerts configuration
  - Push notifications control
  - Email alerts settings
- **Data Source Monitoring**
  - PAGASA integration status
  - Local sensor network health
  - Community reports system
  - Last sync timestamps
- **System Maintenance**
  - Data refresh capabilities
  - Log export functionality
  - System health monitoring

**Navigation**:
- Admin (System Administration)
- Map (Infrastructure Overview)
- Alerts (System Alerts)
- AI Help (Support Tool)
- Settings

**Dashboard Tabs**:
- User Management
- System Configuration

---

## 🔑 Authentication Flow

### Sign In Process

1. **Sign In Screen** (`/components/SignInScreen.tsx`)
   - Email/Username and password input
   - Password visibility toggle
   - "Remember me" functionality via localStorage
   - Error handling with localized messages
   - Demo mode with role selection

2. **Authentication Validation**
   - Credentials checked against mock user database
   - Role retrieved from user profile
   - Session created and stored

3. **Session Management**
   - User session stored in localStorage
   - Automatic session restoration on app reload
   - Secure session data structure

4. **Post-Authentication Routing**
   - Residents → Home Screen
   - Officials → Official Dashboard
   - Administrators → Admin Dashboard

### Sign Out Process

1. **Sign Out Button Location**
   - Available in Settings screen for all roles
   - Requires confirmation via AlertDialog

2. **Sign Out Actions**
   - Clear user session from state
   - Remove session from localStorage
   - Clear onboarding completion flag
   - Reset to Sign In screen
   - Clear all role-based permissions

3. **Security Measures**
   - Confirmation dialog prevents accidental sign-out
   - Complete session cleanup
   - No residual user data

---

## 📊 Session Data Structure

```typescript
interface UserSession {
  id: string;                    // Unique user identifier
  username: string;              // Username for login
  email: string;                 // Email address
  role: 'resident' | 'official' | 'administrator';
  name: string;                  // Display name
  barangay: string;              // Assigned barangay
}
```

**Storage**: localStorage key `hydroalert_user_session`

---

## 🎨 Role-Based UI Customization

### Navigation Bar Differences

**Resident** (5 items):
```
Home | Map | Alerts | AI Help | Settings
```

**Official** (5 items):
```
Dashboard | Map | Alerts | AI Help | Settings
```

**Administrator** (5 items):
```
Admin | Map | Alerts | AI Help | Settings
```

### Dashboard Variations

| Feature | Resident | Official | Administrator |
|---------|----------|----------|---------------|
| Flood Status Card | ✅ | ✅ | ✅ |
| Community Reports | View Only | Review & Manage | Full Access |
| Rescue Requests | Create | Dispatch & Track | Full Access |
| User Management | ❌ | ❌ | ✅ Full Control |
| System Config | ❌ | ❌ | ✅ Full Control |
| Sensor Control | ❌ | ❌ | ✅ Enable/Disable |

---

## 🔒 Security Implementation

### Password Handling
- Passwords are validated but not exposed in session
- Demo credentials provided for testing
- Production should integrate with secure backend

### Session Security
- Sessions stored in localStorage (client-side)
- Automatic session expiration on sign-out
- No sensitive data in plain text

### Role Enforcement
- Role checked on every screen render
- Navigation items filtered by role
- Feature access controlled at component level

---

## 🧪 Demo Credentials

For testing purposes, the following demo accounts are available:

### Resident Account
- **Email**: `resident@barangay728.ph`
- **Username**: `juan.delaCruz`
- **Password**: `resident123`
- **Access**: Standard user features

### Official Account
- **Email**: `official@barangay728.ph`
- **Username**: `maria.santos`
- **Password**: `official123`
- **Access**: Official dashboard + report management

### Administrator Account
- **Email**: `admin@barangay728.ph`
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full system access

---

## 🚀 Implementation Details

### Files Structure

```
/components
  ├── SignInScreen.tsx          # Authentication interface
  ├── OfficialDashboard.tsx     # Barangay official view
  ├── AdminDashboard.tsx        # Administrator view
  ├── HomeScreen.tsx            # Resident home screen
  ├── SettingsScreen.tsx        # Settings (with Sign Out)
  └── ...

/App.tsx                        # Main app with RBAC routing
```

### State Management

**Authentication State**:
- `userSession: UserSession | null` - Current user session
- Stored in App.tsx root component
- Passed down to child components as needed

**Persistence**:
- localStorage for session persistence
- Automatic restoration on app reload
- Clear on sign-out

### Role-Based Rendering Logic

```typescript
// Example from App.tsx
const getNavigationItems = () => {
  if (userSession.role === 'resident') {
    return [...residentItems];
  } else if (userSession.role === 'official') {
    return [...officialItems];
  } else {
    return [...adminItems];
  }
};
```

---

## 🌐 Multilingual Support

All authentication and RBAC interfaces support both English and Filipino:

- Sign In screen fully translated
- Role descriptions in both languages
- Dashboard labels and messages
- Error messages localized

---

## 📱 Mobile Optimization

- Touch-friendly authentication forms
- Responsive dashboard layouts
- Optimized for 375px - 428px mobile screens
- Safe area insets for notched devices

---

## 🔄 Future Enhancements

### Recommended Improvements

1. **Backend Integration**
   - Connect to real authentication API
   - JWT token-based sessions
   - Refresh token mechanism
   - Secure password hashing

2. **Enhanced Security**
   - Two-factor authentication
   - Password strength requirements
   - Account lockout after failed attempts
   - Session timeout

3. **Additional Roles**
   - Emergency Responder role
   - PAGASA Coordinator role
   - Medical Team role

4. **Audit Logging**
   - Track user actions
   - Login/logout history
   - Role change logs
   - System modification tracking

5. **Permissions Granularity**
   - Fine-grained permissions per feature
   - Custom role creation
   - Permission inheritance

---

## 📖 Usage Guide

### For Developers

1. **Adding a New Role**:
   - Update `UserRole` type in `SignInScreen.tsx`
   - Add role to navigation logic in `App.tsx`
   - Create role-specific dashboard component
   - Update role-based rendering logic

2. **Protecting a Feature**:
   ```typescript
   {userSession?.role === 'administrator' && (
     <AdminOnlyFeature />
   )}
   ```

3. **Checking Permissions**:
   ```typescript
   const canManageUsers = 
     userSession?.role === 'administrator';
   ```

### For Users

1. **Signing In**:
   - Enter email/username and password
   - Or use Demo Mode to select a role
   - Click "Sign In"

2. **Switching Roles** (Demo):
   - Sign out from Settings
   - Sign in with different credentials

3. **Signing Out**:
   - Go to Settings
   - Scroll to bottom
   - Click "Sign Out"
   - Confirm in dialog

---

## ✅ Testing Checklist

- [ ] Resident can sign in and access basic features
- [ ] Official can access dashboard with reports
- [ ] Administrator can access system configuration
- [ ] Sign out clears session completely
- [ ] Session persists across page refresh
- [ ] Role-based navigation works correctly
- [ ] Unauthorized features are hidden
- [ ] Multilingual support works for all roles
- [ ] Demo mode allows quick role switching

---

## 📞 Support

For questions or issues with the RBAC system:
- Review this documentation
- Check demo credentials
- Test with different roles
- Verify localStorage is enabled in browser
