import { AlertTriangle, CloudRain, Droplets, Info } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type Language = 'en' | 'fil';

interface AlertsScreenProps {
  language: Language;
}

interface Alert {
  id: string;
  type: 'warning' | 'advisory' | 'info';
  title: { en: string; fil: string };
  message: { en: string; fil: string };
  timestamp: Date;
  source: string;
  isRead: boolean;
}

export default function AlertsScreen({ language }: AlertsScreenProps) {
  const content = {
    en: {
      title: 'Alerts & Notifications',
      tabs: {
        all: 'All',
        warnings: 'Warnings',
        advisories: 'Advisories'
      },
      source: 'Source',
      noAlerts: 'No alerts at this time',
      markAllRead: 'Mark all as read'
    },
    fil: {
      title: 'Mga Alerto at Notification',
      tabs: {
        all: 'Lahat',
        warnings: 'Mga Babala',
        advisories: 'Mga Advisory'
      },
      source: 'Pinagmulan',
      noAlerts: 'Walang alerto sa ngayon',
      markAllRead: 'Markahan lahat bilang nabasa'
    }
  };

  const t = content[language];

  // Mock alerts data
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      title: {
        en: 'Orange Rainfall Warning',
        fil: 'Orange Rainfall Warning'
      },
      message: {
        en: 'Heavy rainfall (15-30mm/hr) expected in Barangay 728. Water levels rising. Prepare to evacuate if conditions worsen. Monitor updates closely.',
        fil: 'Malakas na ulan (15-30mm/hr) ang inaasahan sa Barangay 728. Tumataas ang tubig. Maghanda na lumikas kung lulubha ang kalagayan. Subaybayan ang mga update.'
      },
      timestamp: new Date(Date.now() - 30 * 60000), // 30 min ago
      source: 'PAGASA + AI Analysis',
      isRead: false
    },
    {
      id: '2',
      type: 'warning',
      title: {
        en: 'Flood Alert - Water Level Rising',
        fil: 'Alerto ng Baha - Tumataas ang Tubig'
      },
      message: {
        en: 'Local sensors detect water level at 8cm above canal base. This is above normal levels. Avoid low-lying areas and stay alert.',
        fil: 'Natukoy ng lokal na sensors na 8cm na ang taas ng tubig sa canal base. Ito ay higit sa normal. Iwasan ang mababang lugar at manatiling alerto.'
      },
      timestamp: new Date(Date.now() - 1 * 60 * 60000), // 1 hour ago
      source: 'Local Sensor Network',
      isRead: false
    },
    {
      id: '3',
      type: 'advisory',
      title: {
        en: 'Community Flood Report',
        fil: 'Ulat ng Komunidad tungkol sa Baha'
      },
      message: {
        en: 'Residents near Zone 79 reported ankle-deep water on Main Street. Road may be difficult to pass. Use alternate routes.',
        fil: 'Nag-ulat ang mga residente malapit sa Zone 79 ng tubig hanggang bukung-bukong sa Main Street. Maaaring mahirap dumaan ang daan. Gumamit ng alternatibong ruta.'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
      source: 'Community Reports',
      isRead: true
    },
    {
      id: '4',
      type: 'info',
      title: {
        en: 'Weather Update',
        fil: 'Update sa Panahon'
      },
      message: {
        en: 'Moderate to heavy rainfall expected to continue for the next 3 hours. Stay indoors if possible and monitor flood alerts.',
        fil: 'Katamtaman hanggang malakas na ulan ay inaasahang magpapatuloy sa susunod na 3 oras. Manatili sa loob ng bahay kung maaari at subaybayan ang flood alerts.'
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60000), // 4 hours ago
      source: 'PAGASA',
      isRead: true
    },
    {
      id: '5',
      type: 'advisory',
      title: {
        en: 'Evacuation Center Open',
        fil: 'Bukas ang Evacuation Center'
      },
      message: {
        en: 'Barangay Hall Evacuation Center is now open and accepting residents. Capacity: 150 people. Bring your emergency kit and important documents.',
        fil: 'Bukas na ang Barangay Hall Evacuation Center at tumatanggap ng mga residente. Kapasidad: 150 tao. Magdala ng emergency kit at mahalagang dokumento.'
      },
      timestamp: new Date(Date.now() - 5 * 60 * 60000), // 5 hours ago
      source: 'Barangay 728',
      isRead: true
    }
  ];

  const typeConfig = {
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      badge: 'bg-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    advisory: {
      icon: <CloudRain className="w-5 h-5 text-orange-500" />,
      badge: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      badge: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 1) return language === 'en' ? 'Just now' : 'Kamakailan lang';
    if (minutes < 60) return `${minutes} ${language === 'en' ? 'min ago' : 'min nakakaraan'}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${language === 'en' ? 'hr ago' : 'oras nakakaraan'}`;
    const days = Math.floor(hours / 24);
    return `${days} ${language === 'en' ? 'day ago' : 'araw nakakaraan'}`;
  };

  const renderAlerts = (filterType?: 'warning' | 'advisory') => {
    const filtered = filterType
      ? alerts.filter((a) => a.type === filterType)
      : alerts;

    if (filtered.length === 0) {
      return (
        <div className="text-center py-12">
          <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t.noAlerts}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filtered.map((alert) => {
          const config = typeConfig[alert.type];
          return (
            <Card
              key={alert.id}
              className={`${config.borderColor} border-l-4 ${
                !alert.isRead ? config.bgColor : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">{config.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-gray-900">
                        {alert.title[language]}
                      </h3>
                      {!alert.isRead && (
                        <Badge className={`${config.badge} text-white text-xs`}>
                          {language === 'en' ? 'New' : 'Bago'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {alert.message[language]}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {t.source}: {alert.source}
                      </span>
                      <span>{formatTimeAgo(alert.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl">{t.title}</h1>
        <Badge variant="destructive" className="bg-red-500">
          {alerts.filter((a) => !a.isRead).length}
        </Badge>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="all">{t.tabs.all}</TabsTrigger>
            <TabsTrigger value="warnings">{t.tabs.warnings}</TabsTrigger>
            <TabsTrigger value="advisories">{t.tabs.advisories}</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {renderAlerts()}
          </TabsContent>

          <TabsContent value="warnings" className="mt-0">
            {renderAlerts('warning')}
          </TabsContent>

          <TabsContent value="advisories" className="mt-0">
            {renderAlerts('advisory')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
