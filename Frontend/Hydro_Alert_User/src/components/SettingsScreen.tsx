import { useState } from 'react';
import { Globe, Phone, FileText, Bell, MapPin, Info, ChevronRight, LogOut } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import type { UserSession } from './SignInScreen';

type Language = 'en' | 'fil';

interface SettingsScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user?: UserSession;
  onSignOut?: () => void;
}

export default function SettingsScreen({ language, onLanguageChange, user, onSignOut }: SettingsScreenProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const content = {
    en: {
      title: 'Settings',
      language: {
        title: 'Language',
        subtitle: 'Choose your preferred language',
        english: 'English',
        filipino: 'Filipino'
      },
      notifications: {
        title: 'Notifications',
        subtitle: 'Receive flood alerts and updates',
        enabled: 'Enabled',
        disabled: 'Disabled'
      },
      location: {
        title: 'Location Services',
        subtitle: 'Allow access for accurate flood data',
        enabled: 'Enabled',
        disabled: 'Disabled'
      },
      emergencyContacts: {
        title: 'Emergency Contacts',
        subtitle: 'Important phone numbers',
        barangay: 'Barangay 728 Hall',
        police: 'Police Station',
        fire: 'Fire Department',
        medical: 'Medical Emergency',
        ndrrmc: 'NDRRMC Hotline'
      },
      protocols: {
        title: 'Emergency Protocols',
        subtitle: 'View official procedures',
        button: 'View Protocols'
      },
      about: {
        title: 'About Hydro Alert',
        subtitle: 'Version 1.0.0',
        button: 'Learn More',
        dialogTitle: 'About Hydro Alert',
        description: 'Hydro Alert is an AI-powered flood monitoring and early warning system designed for residents of Barangay 728, Manila.',
        features: 'Key Features',
        featuresList: [
          'Real-time flood monitoring from PAGASA and local sensors',
          'AI-powered alert translation and analysis',
          'GPS-guided evacuation routes',
          'Community-based flood reporting',
          'Emergency rescue assistance'
        ],
        developers: 'Developed as part of the Hydro Alert Capstone Project.',
        privacy: 'Your privacy is important. Location data is used only for personalized alerts and is never shared with third parties.'
      }
    },
    fil: {
      title: 'Settings',
      language: {
        title: 'Wika',
        subtitle: 'Pumili ng inyong gustong wika',
        english: 'English',
        filipino: 'Filipino'
      },
      notifications: {
        title: 'Mga Notification',
        subtitle: 'Tumanggap ng flood alerts at updates',
        enabled: 'Naka-enable',
        disabled: 'Naka-disable'
      },
      location: {
        title: 'Location Services',
        subtitle: 'Payagan ang access para sa tumpak na flood data',
        enabled: 'Naka-enable',
        disabled: 'Naka-disable'
      },
      emergencyContacts: {
        title: 'Emergency Contacts',
        subtitle: 'Mahalagang numero ng telepono',
        barangay: 'Barangay 728 Hall',
        police: 'Police Station',
        fire: 'Fire Department',
        medical: 'Medical Emergency',
        ndrrmc: 'NDRRMC Hotline'
      },
      protocols: {
        title: 'Emergency Protocols',
        subtitle: 'Tingnan ang opisyal na proseso',
        button: 'Tingnan ang Protocols'
      },
      about: {
        title: 'Tungkol sa Hydro Alert',
        subtitle: 'Version 1.0.0',
        button: 'Alamin Pa',
        dialogTitle: 'Tungkol sa Hydro Alert',
        description: 'Ang Hydro Alert ay isang AI-powered flood monitoring at early warning system na dinisenyo para sa mga residente ng Barangay 728, Maynila.',
        features: 'Pangunahing Features',
        featuresList: [
          'Real-time flood monitoring mula sa PAGASA at lokal na sensors',
          'AI-powered alert translation at analysis',
          'GPS-guided evacuation routes',
          'Community-based flood reporting',
          'Emergency rescue assistance'
        ],
        developers: 'Ginawa bilang bahagi ng Hydro Alert Capstone Project.',
        privacy: 'Mahalaga ang inyong privacy. Ang location data ay ginagamit lamang para sa personalized alerts at hindi kailanman ibinabahagi sa third parties.'
      }
    }
  };

  const t = content[language];

  const emergencyNumbers = [
    { label: t.emergencyContacts.barangay, number: '(02) 8XXX-XXXX', icon: <Phone className="w-5 h-5" /> },
    { label: t.emergencyContacts.police, number: '117', icon: <Phone className="w-5 h-5" /> },
    { label: t.emergencyContacts.fire, number: '(02) 8426-0219', icon: <Phone className="w-5 h-5" /> },
    { label: t.emergencyContacts.medical, number: '911', icon: <Phone className="w-5 h-5" /> },
    { label: t.emergencyContacts.ndrrmc, number: '(02) 8911-5061', icon: <Phone className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4">
        <h1 className="text-xl">{t.title}</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Language Selection */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <Globe className="w-5 h-5 text-gray-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">{t.language.title}</h3>
                <p className="text-sm text-gray-600">{t.language.subtitle}</p>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => onLanguageChange('en')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                  language === 'en'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span>{t.language.english}</span>
                {language === 'en' && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
              <button
                onClick={() => onLanguageChange('fil')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                  language === 'fil'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span>{t.language.filipino}</span>
                {language === 'fil' && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <h3 className="text-gray-900 mb-1">{t.notifications.title}</h3>
                  <p className="text-sm text-gray-600">{t.notifications.subtitle}</p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Services */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <h3 className="text-gray-900 mb-1">{t.location.title}</h3>
                  <p className="text-sm text-gray-600">{t.location.subtitle}</p>
                </div>
              </div>
              <Switch
                checked={locationEnabled}
                onCheckedChange={setLocationEnabled}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Emergency Contacts */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="text-gray-900">{t.emergencyContacts.title}</h3>
                <p className="text-sm text-gray-600">{t.emergencyContacts.subtitle}</p>
              </div>
            </div>
            <div className="space-y-3">
              {emergencyNumbers.map((contact, idx) => (
                <div key={idx}>
                  <a
                    href={`tel:${contact.number}`}
                    className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <span className="text-sm text-gray-700">{contact.label}</span>
                    <span className="text-sm text-blue-600">{contact.number}</span>
                  </a>
                  {idx < emergencyNumbers.length - 1 && <Separator className="my-1" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Protocols */}
        <Card>
          <CardContent className="pt-6">
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <h3 className="text-gray-900">{t.protocols.title}</h3>
                  <p className="text-sm text-gray-600">{t.protocols.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardContent className="pt-6">
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <h3 className="text-gray-900">{t.about.title}</h3>
                      <p className="text-sm text-gray-600">{t.about.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t.about.dialogTitle}</DialogTitle>
                  <DialogDescription>
                    {t.about.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <h4 className="mb-2">{t.about.features}</h4>
                    <ul className="space-y-2">
                      {t.about.featuresList.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex gap-2">
                          <span>•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600">{t.about.developers}</p>
                  <p className="text-sm text-gray-500 italic">{t.about.privacy}</p>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Sign Out */}
        {user && onSignOut && (
          <Card>
            <CardContent className="pt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5 text-gray-600" />
                      <div className="text-left">
                        <h3 className="text-gray-900">Sign Out</h3>
                        <p className="text-sm text-gray-600">Log out of your account</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will sign you out of your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onSignOut}>Sign Out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}