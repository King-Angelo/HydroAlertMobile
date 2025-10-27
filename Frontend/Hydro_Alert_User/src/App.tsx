import { useState, useEffect, useCallback } from 'react';
import { Home, Map, Bell, MessageSquare, Settings, BarChart3 } from 'lucide-react';

// Firebase Imports
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebaseConfig';

// Import the UserSession type from SignInScreen
import { UserSession } from './components/SignInScreen';

// Import the actual designed components
import SignInScreen from './components/SignInScreen';
import OnboardingScreen from './components/OnboardingScreen';
import HomeScreen from './components/HomeScreen';
import MapView from './components/MapView';
import AlertsScreen from './components/AlertsScreen';
import ChatbotScreen from './components/ChatbotScreen';
import SettingsScreen from './components/SettingsScreen';
import OfficialDashboard from './components/OfficialDashboard';
import AdminDashboard from './components/AdminDashboard';
import ResetPasswordScreen from './components/ResetPasswordScreen';

// --- FIREBASE INITIALIZATION ---
// Firebase is already initialized in firebaseConfig.ts
// auth and db are imported from firebaseConfig.ts

// --- APP COMPONENT ---

type Language = 'en' | 'fil';
type Screen = 'home' | 'map' | 'alerts' | 'chatbot' | 'settings' | 'dashboard';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 14.5765, lng: 120.9835 }); // Default: Barangay 728
  
  // Replace userSession with Firebase's User object or null, and its derived role/session
  const [firebaseUser, setFirebaseUser] = useState<User | null | undefined>(undefined); // undefined means loading
  const [userSession, setUserSession] = useState<UserSession | null>(null);


  // --- 1. FIREBASE AUTH STATE LISTENER ---
  useEffect(() => {
    // Listen for auth state changes (no anonymous sign-in attempt)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        // Convert Firebase User to UserSession format
        let role: UserSession['role'] = 'resident'; 

        // Check if the current user is an admin/official based on email
        if (user.email && user.email.includes('@admin.com')) { 
          role = 'administrator';
        } else if (user.email && user.email.includes('@official.com')) {
          role = 'official';
        }
        
        setUserSession({
          id: user.uid,
          username: user.displayName || user.email || 'user',
          email: user.email || '',
          role: role,
          name: user.displayName || 'User',
          barangay: 'Barangay 728, Zone 79' // Default barangay
        });

      } else {
        setUserSession(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- 2. EXISTING STATE/LOCATION/ONBOARDING EFFECTS (MODIFIED) ---

  // Check onboarding status and set initial screen (Runs when userSession is set)
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('hydroalert_onboarding_complete');
    const savedLanguage = localStorage.getItem('hydroalert_language') as Language;
    
    if (onboardingComplete === 'true') {
      setHasCompletedOnboarding(true);
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    if (userSession) {
      // Set default screen based on role
      if (userSession.role === 'official' || userSession.role === 'administrator') {
        setCurrentScreen('dashboard');
      } else {
        setCurrentScreen('home');
      }
    }
  }, [userSession]); // Depend on userSession instead of local storage check

  // Get user location
  useEffect(() => {
    if (userSession && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied or unavailable:', error);
          // Keep default location
        }
      );
    }
  }, [userSession]);

  // --- 3. HANDLERS ---

  const handleSignIn = (session: UserSession) => {
    // This is called by the SignInScreen component when user signs in
    setUserSession(session); 
  };

  const handleSignOut = useCallback(async () => {
    await signOut(auth); // Use Firebase SignOut
    setUserSession(null);
    setHasCompletedOnboarding(false);
    localStorage.removeItem('hydroalert_onboarding_complete');
    setCurrentScreen('home');
  }, []);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('hydroalert_onboarding_complete', 'true');
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('hydroalert_language', lang);
  };

  const handleNavigateToMap = () => {
    setCurrentScreen('map');
  };

  // --- 4. RENDER LOGIC ---

  // Check if this is a password reset URL
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const oobCode = urlParams.get('oobCode');

  // Show reset password screen if URL contains reset parameters
  if (mode === 'resetPassword' && oobCode) {
    return <ResetPasswordScreen />;
  }

  // Show loading while Firebase state is resolving (brief moment)
  if (firebaseUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex items-center space-x-3 text-white">
          <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-medium">Loading HydroAlert...</p>
        </div>
      </div>
    );
  }

  // Show sign-in screen if not authenticated
  if (!userSession) {
    return <SignInScreen language={language} onSignIn={handleSignIn} />; 
  }

  // Show onboarding if not completed (for new users)
  if (!hasCompletedOnboarding) {
    return (
      <OnboardingScreen 
        language={language} 
        onComplete={handleOnboardingComplete} 
      />
    );
  }

  // Navigation items based on role
  const getNavigationItems = () => {
    const baseItems = [
      { 
        id: 'settings' as Screen, 
        icon: Settings, 
        label: { en: 'Settings', fil: 'Settings' } 
      }
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
    } else {
      return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  // Render current screen based on role
  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        if (userSession.role === 'official') {
          return <OfficialDashboard language={language} user={userSession} />;
        } else if (userSession.role === 'administrator') {
          return <AdminDashboard language={language} user={userSession} />;
        }
        return <HomeScreen language={language} userLocation={userLocation} onNavigateToMap={handleNavigateToMap} />;
      
      case 'home':
        return (
          <HomeScreen 
            language={language} 
            userLocation={userLocation}
            onNavigateToMap={handleNavigateToMap}
          />
        );
      
      case 'map':
        return (
          <MapView 
            language={language} 
            userLocation={userLocation}
          />
        );
      
      case 'alerts':
        return <AlertsScreen language={language} />;
      
      case 'chatbot':
        return <ChatbotScreen language={language} />;
      
      case 'settings':
        return (
          <SettingsScreen 
            language={language}
            onLanguageChange={handleLanguageChange}
            user={userSession}
            onSignOut={handleSignOut}
          />
        );
      
      default:
        // Default to dashboard for officials/admins, otherwise home
        if (userSession.role === 'official' || userSession.role === 'administrator') {
          return userSession.role === 'official' 
            ? <OfficialDashboard language={language} user={userSession} />
            : <AdminDashboard language={language} user={userSession} />;
        }
        return (
          <HomeScreen 
            language={language} 
            userLocation={userLocation}
            onNavigateToMap={handleNavigateToMap}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {renderScreen()}
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="bg-white border-t border-gray-200 safe-bottom">
        <div className={`grid h-16`} style={{ gridTemplateColumns: `repeat(${navigationItems.length}, minmax(0, 1fr))` }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-xs">{item.label[language]}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Add safe area padding for mobile devices */}
      <style>{`
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        /* Ensure mobile-friendly viewport */
        @media (max-width: 448px) {
          body {
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
}
