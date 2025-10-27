import { useState, useEffect } from 'react';
import { AlertTriangle, Droplets, CloudRain, Navigation, Phone, Camera, AlertCircle, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { auth } from '../firebaseConfig';

type Language = 'en' | 'fil';
type FloodStatus = 'safe' | 'monitoring' | 'warning' | 'danger';

interface HomeScreenProps {
  language: Language;
  userLocation: { lat: number; lng: number };
  onNavigateToMap: () => void;
}

export default function HomeScreen({ language, userLocation, onNavigateToMap }: HomeScreenProps) {
  // Mock real-time data (in production, this would come from backend/sensors)
  const [floodStatus] = useState<FloodStatus>('warning');
  const [waterLevel] = useState(8); // cm
  const [rainfallIntensity] = useState(5.2); // mm/hr
  const [lastUpdated] = useState(new Date());
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [rescueDialogOpen, setRescueDialogOpen] = useState(false);
  const [reportCondition, setReportCondition] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  
  // Dynamic location state
  const [currentLocation, setCurrentLocation] = useState({
    location: "Barangay 728, Zone 79, Manila",
    monitoringArea: "Barangay 728 Flood Monitoring Zone",
    lastUpdated: new Date().toISOString()
  });
  const [locationLoading, setLocationLoading] = useState(false);

  // Fetch user location data with multi-layered fallback strategy
  useEffect(() => {
    const fetchUserLocation = async () => {
      setLocationLoading(true);
      
      try {
        // 1. PRIMARY ATTEMPT: Cloud Function API call
        const user = auth.currentUser;
        if (!user) {
          throw new Error('No authenticated user');
        }

        const token = await user.getIdToken();
        const response = await fetch('https://us-central1-hydroalert-user.cloudfunctions.net/getUserLocation', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCurrentLocation({
              location: data.data.location,
              monitoringArea: data.data.monitoringArea,
              lastUpdated: data.data.lastUpdated
            });
            setLocationLoading(false);
            return; // Success - exit early
          }
        }
        
        // If we reach here, the API call failed
        throw new Error(`API call failed with status: ${response.status}`);
        
      } catch (error) {
        console.error('Primary location fetch failed:', error);
        
        try {
          // 2. FIRST FALLBACK: Native browser Geolocation API
          console.log('Attempting geolocation fallback...');
          
          const getCurrentPosition = (): Promise<GeolocationPosition> => {
            return new Promise((resolve, reject) => {
              if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
              }
              
              navigator.geolocation.getCurrentPosition(
                (position) => resolve(position),
                (error) => reject(error),
                {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 300000 // 5 minutes
                }
              );
            });
          };

          const position = await getCurrentPosition();
          const { latitude, longitude } = position.coords;
          
          // Update location with GPS coordinates
          setCurrentLocation({
            location: `GPS Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            monitoringArea: "Location from Device GPS",
            lastUpdated: new Date().toISOString()
          });
          
          console.log('Geolocation fallback successful');
          setLocationLoading(false);
          return; // Success - exit early
          
        } catch (geolocationError) {
          console.error('Geolocation fallback failed:', geolocationError);
          
          // 3. SECOND FALLBACK: Hardcoded default coordinates
          console.log('Using default location fallback...');
          
          setCurrentLocation({
            location: "Barangay 728, Zone 79, Manila (Default)",
            monitoringArea: "Default Monitoring Zone - Manila",
            lastUpdated: new Date().toISOString()
          });
          
          console.log('Default location fallback applied');
        }
      } finally {
        setLocationLoading(false);
      }
    };

    fetchUserLocation();
  }, []);

  const content = {
    en: {
      title: 'Hydro Alert',
      location: 'Barangay 728, Zone 79, Manila',
      currentStatus: 'Current Flood Status',
      waterLevel: 'Water Level',
      rainfall: 'Rainfall Intensity',
      lastAlert: 'Last Alert',
      updated: 'Updated',
      ago: 'ago',
      reportFlood: 'Report Flood',
      requestRescue: 'Request Rescue',
      viewRoute: 'View Safe Routes',
      status: {
        safe: 'Safe - No Flood Risk',
        monitoring: 'Monitoring - Low Risk',
        warning: 'Warning - Prepare to Evacuate',
        danger: 'Danger - Evacuate Now!'
      },
      reportDialog: {
        title: 'Report Flood Condition',
        description: 'Help your community by reporting current flood conditions in your area.',
        condition: 'Water Level Condition',
        conditions: {
          dry: 'Dry - No water',
          ankle: 'Ankle-deep water',
          knee: 'Knee-deep water',
          waist: 'Waist-deep or higher'
        },
        details: 'Additional details (optional)',
        detailsPlaceholder: 'Describe the situation, location, or any hazards...',
        addPhoto: 'Add Photo',
        cancel: 'Cancel',
        submit: 'Submit Report'
      },
      rescueDialog: {
        title: 'Request Rescue Assistance',
        description: 'Emergency responders will be notified immediately with your location.',
        warning: 'This will send your GPS coordinates and contact information to Barangay Officials and Emergency Responders.',
        location: 'Your Location',
        contactInfo: 'Contact Information',
        phone: 'Phone Number',
        phonePlaceholder: 'Enter your phone number',
        emergency: 'Emergency Details',
        emergencyPlaceholder: 'Number of people, medical conditions, etc.',
        cancel: 'Cancel',
        confirm: 'Confirm & Send SOS'
      },
      notifications: {
        reportSuccess: 'Report submitted successfully. Thank you for helping the community!',
        rescueSuccess: 'Emergency request sent! Help is on the way. Stay safe and stay visible.',
        locationShared: 'Your location has been shared with emergency responders.'
      }
    },
    fil: {
      title: 'Hydro Alert',
      location: 'Barangay 728, Zone 79, Maynila',
      currentStatus: 'Kasalukuyang Kalagayan ng Baha',
      waterLevel: 'Taas ng Tubig',
      rainfall: 'Lakas ng Ulan',
      lastAlert: 'Huling Alerto',
      updated: 'Na-update',
      ago: 'nakakaraan',
      reportFlood: 'Mag-ulat ng Baha',
      requestRescue: 'Humingi ng Tulong',
      viewRoute: 'Tingnan ang Ligtas na Ruta',
      status: {
        safe: 'Ligtas - Walang Panganib ng Baha',
        monitoring: 'Bantayan - Mababang Panganib',
        warning: 'Babala - Maghanda sa Pag-evacuate',
        danger: 'Panganib - Lumikas na Ngayon!'
      },
      reportDialog: {
        title: 'Mag-ulat ng Kalagayan ng Baha',
        description: 'Tulungan ang inyong komunidad sa pag-uulat ng kasalukuyang kalagayan ng baha.',
        condition: 'Kalagayan ng Taas ng Tubig',
        conditions: {
          dry: 'Tuyo - Walang tubig',
          ankle: 'Tubig hanggang bukung-bukong',
          knee: 'Tubig hanggang tuhod',
          waist: 'Tubig hanggang baywang o mas mataas'
        },
        details: 'Karagdagang detalye (opsyonal)',
        detailsPlaceholder: 'Ilarawan ang sitwasyon, lokasyon, o anumang panganib...',
        addPhoto: 'Magdagdag ng Larawan',
        cancel: 'Kanselahin',
        submit: 'Isumite ang Ulat'
      },
      rescueDialog: {
        title: 'Humingi ng Tulong sa Pag-rescue',
        description: 'Ang mga emergency responders ay agarang aabisuhan kasama ang inyong lokasyon.',
        warning: 'Ito ay magpapadala ng inyong GPS coordinates at contact information sa Barangay Officials at Emergency Responders.',
        location: 'Inyong Lokasyon',
        contactInfo: 'Impormasyon sa Pakikipag-ugnayan',
        phone: 'Numero ng Telepono',
        phonePlaceholder: 'Ilagay ang inyong numero ng telepono',
        emergency: 'Detalye ng Emergency',
        emergencyPlaceholder: 'Bilang ng tao, kondisyong medikal, atbp.',
        cancel: 'Kanselahin',
        confirm: 'Kumpirmahin at Ipadala ang SOS'
      },
      notifications: {
        reportSuccess: 'Matagumpay na naisumite ang ulat. Salamat sa pagtulong sa komunidad!',
        rescueSuccess: 'Naipadala na ang emergency request! Paparating na ang tulong. Manatiling ligtas at makita.',
        locationShared: 'Ang inyong lokasyon ay naibahagi na sa mga emergency responders.'
      }
    }
  };

  const t = content[language];

  const statusConfig = {
    safe: {
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      icon: <Droplets className="w-8 h-8 text-green-500" />
    },
    monitoring: {
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      icon: <CloudRain className="w-8 h-8 text-yellow-500" />
    },
    warning: {
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-700',
      icon: <AlertTriangle className="w-8 h-8 text-orange-500" />
    },
    danger: {
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-700',
      icon: <AlertCircle className="w-8 h-8 text-red-500" />
    }
  };

  const currentConfig = statusConfig[floodStatus];

  const handleSubmitReport = () => {
    // In production, send to backend
    console.log('Report submitted:', { reportCondition, reportDetails, location: userLocation });
    setReportDialogOpen(false);
    setReportCondition('');
    setReportDetails('');
    // Show success notification
    alert(t.notifications.reportSuccess);
  };

  const handleRequestRescue = () => {
    // In production, send to backend with GPS coordinates
    console.log('Rescue requested:', { location: userLocation });
    setRescueDialogOpen(false);
    // Show success notification
    alert(t.notifications.rescueSuccess);
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 1) return language === 'en' ? 'Just now' : 'Kamakailan lang';
    if (minutes < 60) return `${minutes} ${language === 'en' ? 'min' : 'min'} ${t.ago}`;
    const hours = Math.floor(minutes / 60);
    return `${hours} ${language === 'en' ? 'hr' : 'oras'} ${t.ago}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-6 pb-8">
        <h1 className="mb-1">{t.title}</h1>
        <p className="text-blue-100 text-sm flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {locationLoading ? (
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              Loading location...
            </span>
          ) : (
            currentLocation.location
          )}
        </p>
        {!locationLoading && (
          <p className="text-blue-200 text-xs mt-1">
            Monitoring: {currentLocation.monitoringArea}
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="px-4 -mt-4 pb-6 space-y-4">
        {/* Flood Risk Status Card */}
        <Card className={`border-2 ${currentConfig.borderColor} ${currentConfig.bgColor}`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div>{currentConfig.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{t.currentStatus}</p>
                <h2 className={currentConfig.textColor}>
                  {t.status[floodStatus]}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  {t.updated}: {formatTimeAgo(lastUpdated)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning Alert for High Risk */}
        {(floodStatus === 'warning' || floodStatus === 'danger') && (
          <Alert className="border-orange-500 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              {language === 'en' 
                ? 'Water levels are rising. Be ready to evacuate to safe zones if conditions worsen.'
                : 'Tumataas ang tubig. Maghanda na lumikas sa mga ligtas na lugar kung lulubha ang kalagayan.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Water Level & Rainfall Widgets */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <p className="text-sm text-gray-600">{t.waterLevel}</p>
              </div>
              <p className="text-blue-600">{waterLevel} cm</p>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' ? 'Above canal base' : 'Sa ibabaw ng canal'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <CloudRain className="w-5 h-5 text-blue-500" />
                <p className="text-sm text-gray-600">{t.rainfall}</p>
              </div>
              <p className="text-blue-600">{rainfallIntensity} mm/hr</p>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' ? 'Moderate rain' : 'Katamtamang ulan'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* View Safe Routes */}
          <Button
            onClick={onNavigateToMap}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14"
            size="lg"
          >
            <Navigation className="mr-2 w-5 h-5" />
            {t.viewRoute}
          </Button>

          {/* Report Flood Condition */}
          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-14 border-2"
                size="lg"
              >
                <Camera className="mr-2 w-5 h-5" />
                {t.reportFlood}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t.reportDialog.title}</DialogTitle>
                <DialogDescription>
                  {t.reportDialog.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label className="mb-3 block">{t.reportDialog.condition}</Label>
                  <RadioGroup value={reportCondition} onValueChange={setReportCondition}>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="dry" id="dry" />
                      <Label htmlFor="dry" className="font-normal">{t.reportDialog.conditions.dry}</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="ankle" id="ankle" />
                      <Label htmlFor="ankle" className="font-normal">{t.reportDialog.conditions.ankle}</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="knee" id="knee" />
                      <Label htmlFor="knee" className="font-normal">{t.reportDialog.conditions.knee}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="waist" id="waist" />
                      <Label htmlFor="waist" className="font-normal">{t.reportDialog.conditions.waist}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="details" className="mb-2 block">{t.reportDialog.details}</Label>
                  <Textarea
                    id="details"
                    placeholder={t.reportDialog.detailsPlaceholder}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button variant="outline" className="w-full">
                  <Camera className="mr-2 w-4 h-4" />
                  {t.reportDialog.addPhoto}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setReportDialogOpen(false)} className="flex-1">
                  {t.reportDialog.cancel}
                </Button>
                <Button 
                  onClick={handleSubmitReport} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!reportCondition}
                >
                  {t.reportDialog.submit}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Request Rescue */}
          <Dialog open={rescueDialogOpen} onOpenChange={setRescueDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full h-14 bg-red-600 hover:bg-red-700"
                size="lg"
              >
                <Phone className="mr-2 w-5 h-5" />
                {t.requestRescue}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-red-600">{t.rescueDialog.title}</DialogTitle>
                <DialogDescription>
                  {t.rescueDialog.description}
                </DialogDescription>
              </DialogHeader>
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">
                  {t.rescueDialog.warning}
                </AlertDescription>
              </Alert>
              <div className="space-y-4 py-2">
                <div>
                  <Label className="mb-2 block text-sm">{t.rescueDialog.location}</Label>
                  <div className="bg-gray-100 p-3 rounded-md text-sm">
                    <p className="text-gray-700">
                      {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{t.location}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setRescueDialogOpen(false)} className="flex-1">
                  {t.rescueDialog.cancel}
                </Button>
                <Button 
                  onClick={handleRequestRescue} 
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {t.rescueDialog.confirm}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
