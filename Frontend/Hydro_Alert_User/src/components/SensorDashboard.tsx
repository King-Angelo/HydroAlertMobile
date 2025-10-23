import { useState } from 'react';
import { Activity, Battery, Wifi, WifiOff, Settings, Droplets, CloudRain, MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { UserSession } from './SignInScreen';

type Language = 'en' | 'fil';

interface SensorDashboardProps {
  language: Language;
  user: UserSession;
}

export interface IoTSensor {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  status: 'online' | 'offline' | 'warning';
  lastTransmission: Date;
  battery: number;
  connectivity: number;
  currentData: {
    waterLevel: number; // cm above base
    rainfallIntensity: number; // mm/hr
    temperature: number; // celsius
  };
  thresholds: {
    normal: number; // cm
    alert: number; // cm
    critical: number; // cm
  };
}

export default function SensorDashboard({ language, user }: SensorDashboardProps) {
  const [sensors] = useState<IoTSensor[]>([
    {
      id: 'S-01',
      name: 'Arlegui Street Station',
      location: 'Arlegui Street, Zone 79',
      coordinates: { lat: 14.5765, lng: 120.9835 },
      status: 'online',
      lastTransmission: new Date(Date.now() - 2 * 60000), // 2 min ago
      battery: 87,
      connectivity: 95,
      currentData: {
        waterLevel: 15,
        rainfallIntensity: 12.5,
        temperature: 28.3
      },
      thresholds: {
        normal: 10,
        alert: 20,
        critical: 30
      }
    },
    {
      id: 'S-02',
      name: 'Side Street A Station',
      location: 'Side Street A, Zone 79',
      coordinates: { lat: 14.5770, lng: 120.9840 },
      status: 'online',
      lastTransmission: new Date(Date.now() - 1 * 60000), // 1 min ago
      battery: 92,
      connectivity: 88,
      currentData: {
        waterLevel: 8,
        rainfallIntensity: 10.2,
        temperature: 27.8
      },
      thresholds: {
        normal: 10,
        alert: 20,
        critical: 30
      }
    },
    {
      id: 'S-03',
      name: 'Riverside Monitoring Point',
      location: 'Riverside Area, Zone 79',
      coordinates: { lat: 14.5768, lng: 120.9830 },
      status: 'warning',
      lastTransmission: new Date(Date.now() - 25 * 60000), // 25 min ago
      battery: 23,
      connectivity: 65,
      currentData: {
        waterLevel: 22,
        rainfallIntensity: 15.8,
        temperature: 28.1
      },
      thresholds: {
        normal: 10,
        alert: 20,
        critical: 30
      }
    },
    {
      id: 'S-04',
      name: 'Main Street Station',
      location: 'Main Street, Zone 79',
      coordinates: { lat: 14.5762, lng: 120.9838 },
      status: 'offline',
      lastTransmission: new Date(Date.now() - 120 * 60000), // 2 hrs ago
      battery: 5,
      connectivity: 0,
      currentData: {
        waterLevel: 0,
        rainfallIntensity: 0,
        temperature: 0
      },
      thresholds: {
        normal: 10,
        alert: 20,
        critical: 30
      }
    }
  ]);

  const [selectedSensor, setSelectedSensor] = useState<IoTSensor | null>(null);

  const content = {
    en: {
      title: 'IoT Sensor Network',
      subtitle: 'Real-time monitoring of Barangay 728 flood sensors',
      overview: 'Network Overview',
      sensorList: 'Sensor List',
      stats: {
        totalSensors: 'Total Sensors',
        onlineSensors: 'Online',
        offlineSensors: 'Offline',
        avgBattery: 'Avg Battery'
      },
      status: {
        online: 'Online',
        offline: 'Offline',
        warning: 'Warning'
      },
      sensorDetails: 'Sensor Details',
      currentReadings: 'Current Readings',
      waterLevel: 'Water Level',
      rainfall: 'Rainfall Intensity',
      temperature: 'Temperature',
      battery: 'Battery',
      connectivity: 'Connectivity',
      lastUpdate: 'Last Update',
      location: 'Location',
      thresholds: 'Alert Thresholds',
      normal: 'Normal',
      alert: 'Alert Level',
      critical: 'Critical Level',
      actions: {
        viewOnMap: 'View on Map',
        editThresholds: 'Edit Thresholds',
        viewHistory: 'View History',
        calibrate: 'Calibrate Sensor',
        refresh: 'Refresh Data'
      },
      units: {
        cm: 'cm',
        mmhr: 'mm/hr',
        celsius: '°C',
        percent: '%',
        ago: 'ago'
      },
      noData: 'No data available',
      lowBattery: 'Low Battery',
      poorConnection: 'Poor Connection',
      healthStatus: 'Health Status',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor'
    },
    fil: {
      title: 'IoT Sensor Network',
      subtitle: 'Real-time monitoring ng mga flood sensor sa Barangay 728',
      overview: 'Pangkalahatang Network',
      sensorList: 'Listahan ng Sensor',
      stats: {
        totalSensors: 'Kabuuang Sensors',
        onlineSensors: 'Online',
        offlineSensors: 'Offline',
        avgBattery: 'Avg na Battery'
      },
      status: {
        online: 'Online',
        offline: 'Offline',
        warning: 'Babala'
      },
      sensorDetails: 'Detalye ng Sensor',
      currentReadings: 'Kasalukuyang Readings',
      waterLevel: 'Water Level',
      rainfall: 'Intensity ng Ulan',
      temperature: 'Temperatura',
      battery: 'Battery',
      connectivity: 'Koneksyon',
      lastUpdate: 'Huling Update',
      location: 'Lokasyon',
      thresholds: 'Mga Threshold ng Alerto',
      normal: 'Normal',
      alert: 'Alert Level',
      critical: 'Critical Level',
      actions: {
        viewOnMap: 'Tingnan sa Mapa',
        editThresholds: 'I-edit ang Thresholds',
        viewHistory: 'Tingnan ang History',
        calibrate: 'I-calibrate ang Sensor',
        refresh: 'I-refresh ang Datos'
      },
      units: {
        cm: 'cm',
        mmhr: 'mm/hr',
        celsius: '°C',
        percent: '%',
        ago: 'nakakaraan'
      },
      noData: 'Walang available na datos',
      lowBattery: 'Mababang Battery',
      poorConnection: 'Mahinang Koneksyon',
      healthStatus: 'Kalagayan',
      good: 'Mabuti',
      fair: 'Katamtaman',
      poor: 'Mahina'
    }
  };

  const t = content[language];

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    warning: 'bg-yellow-500'
  };

  const onlineSensors = sensors.filter(s => s.status === 'online').length;
  const offlineSensors = sensors.filter(s => s.status === 'offline').length;
  const avgBattery = Math.round(
    sensors.reduce((sum, s) => sum + s.battery, 0) / sensors.length
  );

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ${t.units.ago}`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ${t.units.ago}`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${t.units.ago}`;
  };

  const getSensorHealthStatus = (sensor: IoTSensor) => {
    if (sensor.status === 'offline') return 'poor';
    if (sensor.battery < 30 || sensor.connectivity < 70) return 'fair';
    return 'good';
  };

  const getWaterLevelStatus = (waterLevel: number, thresholds: IoTSensor['thresholds']) => {
    if (waterLevel >= thresholds.critical) return { label: t.critical, color: 'text-red-600' };
    if (waterLevel >= thresholds.alert) return { label: t.alert, color: 'text-yellow-600' };
    return { label: t.normal, color: 'text-green-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-6">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-6 h-6" />
          <h1>{t.title}</h1>
        </div>
        <p className="text-sm text-blue-100">{t.subtitle}</p>
      </div>

      {/* Stats Overview */}
      <div className="px-4 -mt-6 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-blue-600">{sensors.length}</p>
                  <p className="text-xs text-gray-600">{t.stats.totalSensors}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-green-600">{onlineSensors}</p>
                  <p className="text-xs text-gray-600">{t.stats.onlineSensors}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gray-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-gray-600">{offlineSensors}</p>
                  <p className="text-xs text-gray-600">{t.stats.offlineSensors}</p>
                </div>
                <WifiOff className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-purple-600">{avgBattery}%</p>
                  <p className="text-xs text-gray-600">{t.stats.avgBattery}</p>
                </div>
                <Battery className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sensor List */}
      <div className="px-4">
        <h2 className="mb-3">{t.sensorList}</h2>
        <div className="space-y-3">
          {sensors.map((sensor) => {
            const healthStatus = getSensorHealthStatus(sensor);
            const waterLevelStatus = getWaterLevelStatus(sensor.currentData.waterLevel, sensor.thresholds);

            return (
              <Card
                key={sensor.id}
                className={`border-l-4 ${
                  sensor.status === 'online'
                    ? 'border-l-green-500'
                    : sensor.status === 'warning'
                    ? 'border-l-yellow-500'
                    : 'border-l-gray-500'
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm">{sensor.name}</h3>
                        <Badge className={`${statusColors[sensor.status]} text-white text-xs`}>
                          {t.status[sensor.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                        <MapPin className="w-3 h-3" />
                        {sensor.location}
                      </div>
                      <div className="text-xs text-gray-500">
                        <strong>{sensor.id}</strong> • {formatTimeAgo(sensor.lastTransmission)}
                      </div>
                    </div>
                  </div>

                  {sensor.status !== 'offline' && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-blue-50 rounded p-2">
                        <Droplets className="w-4 h-4 text-blue-600 mb-1" />
                        <p className="text-xs text-gray-600">{t.waterLevel}</p>
                        <p className={`text-sm ${waterLevelStatus.color}`}>
                          {sensor.currentData.waterLevel} {t.units.cm}
                        </p>
                      </div>
                      <div className="bg-cyan-50 rounded p-2">
                        <CloudRain className="w-4 h-4 text-cyan-600 mb-1" />
                        <p className="text-xs text-gray-600">{t.rainfall}</p>
                        <p className="text-sm text-cyan-700">
                          {sensor.currentData.rainfallIntensity} {t.units.mmhr}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <Activity className="w-4 h-4 text-gray-600 mb-1" />
                        <p className="text-xs text-gray-600">{t.temperature}</p>
                        <p className="text-sm text-gray-700">
                          {sensor.currentData.temperature} {t.units.celsius}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{t.battery}</span>
                        <span className={sensor.battery < 30 ? 'text-red-600' : 'text-gray-700'}>
                          {sensor.battery}%
                        </span>
                      </div>
                      <Progress value={sensor.battery} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{t.connectivity}</span>
                        <span className={sensor.connectivity < 70 ? 'text-yellow-600' : 'text-gray-700'}>
                          {sensor.connectivity}%
                        </span>
                      </div>
                      <Progress value={sensor.connectivity} className="h-1.5" />
                    </div>
                  </div>

                  {(sensor.battery < 30 || sensor.connectivity < 70) && (
                    <div className="flex gap-2 mb-3">
                      {sensor.battery < 30 && (
                        <Badge variant="outline" className="text-xs border-red-300 text-red-600">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {t.lowBattery}
                        </Badge>
                      )}
                      {sensor.connectivity < 70 && (
                        <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-600">
                          <WifiOff className="w-3 h-3 mr-1" />
                          {t.poorConnection}
                        </Badge>
                      )}
                    </div>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedSensor(sensor)}
                      >
                        <Settings className="w-3 h-3 mr-2" />
                        {t.sensorDetails}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw]">
                      <DialogHeader>
                        <DialogTitle>{sensor.name}</DialogTitle>
                        <DialogDescription>{sensor.location}</DialogDescription>
                      </DialogHeader>
                      {selectedSensor && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-gray-600">{t.waterLevel}</Label>
                              <p className={`text-lg ${waterLevelStatus.color}`}>
                                {selectedSensor.currentData.waterLevel} {t.units.cm}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">{t.rainfall}</Label>
                              <p className="text-lg text-cyan-700">
                                {selectedSensor.currentData.rainfallIntensity} {t.units.mmhr}
                              </p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600 mb-2 block">{t.thresholds}</Label>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                                <span className="text-sm">{t.normal}</span>
                                <span className="text-sm text-green-700">
                                  {'<'} {selectedSensor.thresholds.normal} {t.units.cm}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                                <span className="text-sm">{t.alert}</span>
                                <span className="text-sm text-yellow-700">
                                  {selectedSensor.thresholds.alert} {t.units.cm}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                                <span className="text-sm">{t.critical}</span>
                                <span className="text-sm text-red-700">
                                  {selectedSensor.thresholds.critical} {t.units.cm}
                                </span>
                              </div>
                            </div>
                          </div>

                          {user.role === 'administrator' && (
                            <div className="space-y-2">
                              <Button variant="outline" className="w-full">
                                <Settings className="w-4 h-4 mr-2" />
                                {t.actions.editThresholds}
                              </Button>
                              <Button variant="outline" className="w-full">
                                {t.actions.calibrate}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
