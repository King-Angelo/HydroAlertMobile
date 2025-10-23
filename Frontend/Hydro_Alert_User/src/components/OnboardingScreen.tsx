import { useState } from 'react';
import { MapPin, Bell, Shield, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

type Language = 'en' | 'fil';

interface OnboardingScreenProps {
  language: Language;
  onComplete: () => void;
}

export default function OnboardingScreen({ language, onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);

  const content = {
    en: {
      welcome: {
        title: 'Welcome to Hydro Alert',
        subtitle: 'Real-Time Flood Monitoring for Barangay 728',
        description: 'Stay informed and safe with AI-powered flood alerts, evacuation routes, and community support.',
        next: 'Get Started'
      },
      location: {
        title: 'Enable Location Services',
        subtitle: 'Get Accurate Street-Level Data',
        description: 'Hydro Alert needs your location to provide real-time flood status and safe evacuation routes specific to your area in Barangay 728.',
        action: 'Enable Location',
        skip: 'Skip for now'
      },
      notifications: {
        title: 'Enable Push Notifications',
        subtitle: 'Receive Instant Flood Alerts',
        description: 'Get critical warnings even when the app is closed. Timely alerts can save lives during flood emergencies.',
        action: 'Enable Notifications',
        skip: 'Skip for now'
      },
      privacy: {
        title: 'Your Privacy Matters',
        subtitle: 'How We Use Your Data',
        description: 'We collect flood data from PAGASA, local sensors, and community reports to provide accurate alerts. Your location is used only for personalized warnings and is never shared.',
        action: 'I Understand',
        finish: 'Start Using Hydro Alert'
      }
    },
    fil: {
      welcome: {
        title: 'Maligayang Pagdating sa Hydro Alert',
        subtitle: 'Real-Time na Pagsubaybay sa Baha para sa Barangay 728',
        description: 'Manatiling updated at ligtas sa AI-powered flood alerts, evacuation routes, at suporta ng komunidad.',
        next: 'Magsimula'
      },
      location: {
        title: 'I-enable ang Location Services',
        subtitle: 'Kumuha ng Tumpak na Datos ng Kalye',
        description: 'Kailangan ng Hydro Alert ang iyong lokasyon upang magbigay ng real-time flood status at ligtas na evacuation routes para sa iyong lugar sa Barangay 728.',
        action: 'I-enable ang Lokasyon',
        skip: 'Laktawan muna'
      },
      notifications: {
        title: 'I-enable ang Push Notifications',
        subtitle: 'Tumanggap ng Instant Flood Alerts',
        description: 'Makatanggap ng mahalagang babala kahit nakasara ang app. Ang mabilis na alerto ay maaaring magligtas ng buhay sa panahon ng baha.',
        action: 'I-enable ang Notifications',
        skip: 'Laktawan muna'
      },
      privacy: {
        title: 'Mahalaga ang Iyong Privacy',
        subtitle: 'Paano Namin Ginagamit ang Iyong Datos',
        description: 'Kinokolekta namin ang datos ng baha mula sa PAGASA, lokal na sensors, at ulat ng komunidad upang magbigay ng tumpak na alerto. Ang iyong lokasyon ay ginagamit lamang para sa personalized warnings at hindi kailanman ibinabahagi.',
        action: 'Naiintindihan Ko',
        finish: 'Simulan ang Paggamit ng Hydro Alert'
      }
    }
  };

  const t = content[language];

  const handleLocationPermission = () => {
    // Request location permission
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setStep(2);
        },
        () => {
          setStep(2);
        }
      );
    } else {
      setStep(2);
    }
  };

  const handleNotificationPermission = () => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission().then(() => {
        setStep(3);
      });
    } else {
      setStep(3);
    }
  };

  const steps = [
    {
      icon: <Shield className="w-16 h-16 text-blue-600" />,
      ...t.welcome
    },
    {
      icon: <MapPin className="w-16 h-16 text-blue-600" />,
      ...t.location
    },
    {
      icon: <Bell className="w-16 h-16 text-blue-600" />,
      ...t.notifications
    },
    {
      icon: <Shield className="w-16 h-16 text-blue-600" />,
      ...t.privacy
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gradient-to-b from-blue-50 to-white">
      {/* Progress Indicator */}
      <div className="flex gap-2 p-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors ${
              index <= step ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-6">{currentStep.icon}</div>
        
        <h1 className="mb-2">{currentStep.title}</h1>
        <h2 className="text-blue-600 mb-4">{currentStep.subtitle}</h2>
        <p className="text-gray-600 mb-8 max-w-sm">
          {currentStep.description}
        </p>

        {step === 0 && (
          <Button
            onClick={() => setStep(1)}
            className="w-full max-w-xs bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {currentStep.next}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        )}

        {step === 1 && (
          <div className="w-full max-w-xs space-y-3">
            <Button
              onClick={handleLocationPermission}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {currentStep.action}
            </Button>
            <Button
              onClick={() => setStep(2)}
              variant="ghost"
              className="w-full"
            >
              {currentStep.skip}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-xs space-y-3">
            <Button
              onClick={handleNotificationPermission}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {currentStep.action}
            </Button>
            <Button
              onClick={() => setStep(3)}
              variant="ghost"
              className="w-full"
            >
              {currentStep.skip}
            </Button>
          </div>
        )}

        {step === 3 && (
          <Button
            onClick={onComplete}
            className="w-full max-w-xs bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {t.privacy.finish}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
