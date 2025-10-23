import { useState } from 'react';
import { Navigation, MapPin, AlertTriangle, Home as HomeIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

type Language = 'en' | 'fil';

interface MapViewProps {
  language: Language;
  userLocation: { lat: number; lng: number };
}

interface SafeZone {
  id: string;
  name: { en: string; fil: string };
  lat: number;
  lng: number;
  capacity: number;
  distance: number; // in km
  status: 'available' | 'limited' | 'full';
}

export default function MapView({ language, userLocation }: MapViewProps) {
  const [selectedSafeZone, setSelectedSafeZone] = useState<SafeZone | null>(null);
  const [showRoute, setShowRoute] = useState(false);

  const content = {
    en: {
      title: 'Evacuation Routes',
      yourLocation: 'Your Location',
      safeZones: 'Safe Zones & Shelters',
      floodedAreas: 'Flooded Areas',
      selectDestination: 'Select a safe zone to view the route',
      distance: 'Distance',
      capacity: 'Capacity',
      status: {
        available: 'Available',
        limited: 'Limited Space',
        full: 'At Capacity'
      },
      navigate: 'Start Navigation',
      legend: 'Map Legend',
      userMarker: 'You are here',
      safeZone: 'Safe Zone',
      flooded: 'Flooded/Avoid',
      safeRoute: 'Safe Route'
    },
    fil: {
      title: 'Mga Ruta ng Evacuation',
      yourLocation: 'Inyong Lokasyon',
      safeZones: 'Mga Ligtas na Lugar at Shelter',
      floodedAreas: 'Mga Binabahang Lugar',
      selectDestination: 'Pumili ng ligtas na lugar upang makita ang ruta',
      distance: 'Layo',
      capacity: 'Kapasidad',
      status: {
        available: 'May Puwang',
        limited: 'Limitadong Puwang',
        full: 'Puno Na'
      },
      navigate: 'Simulan ang Navigation',
      legend: 'Paliwanag ng Mapa',
      userMarker: 'Nandito kayo',
      safeZone: 'Ligtas na Lugar',
      flooded: 'Binabaha/Iwasan',
      safeRoute: 'Ligtas na Ruta'
    }
  };

  const t = content[language];

  // Mock safe zones data
  const safeZones: SafeZone[] = [
    {
      id: '1',
      name: { en: 'Barangay Hall Evacuation Center', fil: 'Barangay Hall Evacuation Center' },
      lat: 14.5770,
      lng: 120.9840,
      capacity: 150,
      distance: 0.3,
      status: 'available'
    },
    {
      id: '2',
      name: { en: 'Zone 79 Elementary School', fil: 'Zone 79 Elementary School' },
      lat: 14.5755,
      lng: 120.9850,
      capacity: 200,
      distance: 0.5,
      status: 'available'
    },
    {
      id: '3',
      name: { en: 'Community Center Shelter', fil: 'Community Center Shelter' },
      lat: 14.5780,
      lng: 120.9825,
      capacity: 100,
      distance: 0.4,
      status: 'limited'
    }
  ];

  // Mock flooded areas
  const floodedAreas = [
    { lat: 14.5760, lng: 120.9835, severity: 'high' },
    { lat: 14.5768, lng: 120.9842, severity: 'medium' }
  ];

  const statusColors = {
    available: 'bg-green-500',
    limited: 'bg-yellow-500',
    full: 'bg-red-500'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl">{t.title}</h1>
        <Badge variant="secondary" className="bg-white text-blue-600">
          <Navigation className="w-3 h-3 mr-1" />
          GPS Active
        </Badge>
      </div>

      {/* Map Container (Simulated) */}
      <div className="relative h-96 bg-gray-200">
        {/* This would be replaced with actual map library (e.g., Mapbox, Google Maps) */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-50">
          <div className="text-center space-y-4">
            {/* Simulated map elements */}
            <div className="relative w-64 h-64 mx-auto">
              {/* User location */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ animation: 'pulse 2s infinite' }}
              >
                <div className="bg-blue-600 rounded-full p-2 shadow-lg border-4 border-white">
                  <Navigation className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Safe zones */}
              {safeZones.map((zone, idx) => (
                <div
                  key={zone.id}
                  className="absolute cursor-pointer"
                  style={{
                    top: `${20 + idx * 30}%`,
                    left: `${60 + idx * 10}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => {
                    setSelectedSafeZone(zone);
                    setShowRoute(false);
                  }}
                >
                  <div className="bg-green-500 rounded-full p-2 shadow-lg border-2 border-white hover:scale-110 transition-transform">
                    <HomeIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
              ))}

              {/* Flooded areas */}
              {floodedAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="absolute"
                  style={{
                    top: `${30 + idx * 35}%`,
                    left: `${25 + idx * 15}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="bg-red-500 rounded-full p-2 shadow-lg opacity-70">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                </div>
              ))}

              {/* Route line when selected */}
              {showRoute && selectedSafeZone && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 128 128 Q 160 100, 200 80"
                    stroke="#2563eb"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                </svg>
              )}
            </div>

            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Interactive map showing evacuation routes and safe zones' 
                : 'Interactive na mapa na nagpapakita ng evacuation routes at ligtas na lugar'}
            </p>
          </div>
        </div>

        {/* Legend */}
        <Card className="absolute top-4 left-4 max-w-xs">
          <CardContent className="p-3 space-y-2">
            <p className="text-xs text-gray-500 mb-2">{t.legend}</p>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 rounded-full p-1">
                <Navigation className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs">{t.userMarker}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-500 rounded-full p-1">
                <HomeIcon className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs">{t.safeZone}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-red-500 rounded-full p-1 opacity-70">
                <AlertTriangle className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs">{t.flooded}</span>
            </div>
            {showRoute && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-blue-600" style={{ borderTop: '2px dashed' }}></div>
                <span className="text-xs">{t.safeRoute}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Safe Zones List */}
      <div className="px-4 py-4 space-y-3">
        <h2 className="text-gray-700">{t.safeZones}</h2>
        
        {safeZones.map((zone) => (
          <Card
            key={zone.id}
            className={`cursor-pointer transition-all ${
              selectedSafeZone?.id === zone.id ? 'border-2 border-blue-600 bg-blue-50' : ''
            }`}
            onClick={() => {
              setSelectedSafeZone(zone);
              setShowRoute(false);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{zone.name[language]}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-4 h-4" />
                      {zone.distance} km
                    </span>
                    <span>
                      {t.capacity}: {zone.capacity}
                    </span>
                  </div>
                </div>
                <Badge className={`${statusColors[zone.status]} text-white`}>
                  {t.status[zone.status]}
                </Badge>
              </div>
              
              {selectedSafeZone?.id === zone.id && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRoute(true);
                  }}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                >
                  <Navigation className="mr-2 w-4 h-4" />
                  {t.navigate}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {!selectedSafeZone && (
          <p className="text-sm text-gray-500 text-center py-4">
            {t.selectDestination}
          </p>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
