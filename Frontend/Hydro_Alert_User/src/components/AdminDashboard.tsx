import { useState } from 'react';
import { Users, Database, Settings as SettingsIcon, Activity, Server, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import type { UserSession } from './SignInScreen';

type Language = 'en' | 'fil';

interface AdminDashboardProps {
  language: Language;
  user: UserSession;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastActive: Date;
}

export default function AdminDashboard({ language, user }: AdminDashboardProps) {
  const [systemUsers] = useState<SystemUser[]>([
    {
      id: 'U001',
      name: 'Juan dela Cruz',
      email: 'resident@barangay728.ph',
      role: 'Resident',
      status: 'active',
      lastActive: new Date(Date.now() - 5 * 60000)
    },
    {
      id: 'U002',
      name: 'Maria Santos',
      email: 'official@barangay728.ph',
      role: 'Barangay Official',
      status: 'active',
      lastActive: new Date(Date.now() - 15 * 60000)
    },
    {
      id: 'U003',
      name: 'Pedro Reyes',
      email: 'pedro.reyes@email.com',
      role: 'Resident',
      status: 'inactive',
      lastActive: new Date(Date.now() - 120 * 60000)
    }
  ]);

  const [sensorStatus, setSensorStatus] = useState({
    waterLevel: true,
    rainfall: true,
    weatherStation: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    smsAlerts: true,
    pushNotifications: true,
    emailAlerts: false
  });

  const content = {
    en: {
      title: 'Administrator Dashboard',
      welcome: 'Welcome back',
      systemOverview: 'System Overview',
      userManagement: 'User Management',
      systemConfig: 'System Configuration',
      dataMonitoring: 'Data Monitoring',
      stats: {
        totalUsers: 'Total Users',
        activeUsers: 'Active Users',
        sensorHealth: 'Sensor Health',
        systemUptime: 'System Uptime'
      },
      users: {
        title: 'Registered Users',
        name: 'Name',
        email: 'Email',
        role: 'Role',
        status: 'Status',
        lastActive: 'Last Active',
        active: 'Active',
        inactive: 'Inactive',
        actions: 'Actions'
      },
      sensors: {
        title: 'Sensor Status',
        waterLevel: 'Water Level Sensor',
        rainfall: 'Rainfall Sensor',
        weatherStation: 'Weather Station',
        operational: 'Operational',
        offline: 'Offline'
      },
      notifications: {
        title: 'Notification Settings',
        sms: 'SMS Alerts',
        push: 'Push Notifications',
        email: 'Email Alerts',
        description: 'Configure system-wide notification preferences'
      },
      dataSources: {
        title: 'Data Sources',
        pagasa: 'PAGASA Integration',
        localSensors: 'Local Sensors',
        communityReports: 'Community Reports',
        status: 'Status',
        connected: 'Connected',
        lastSync: 'Last Sync'
      },
      actions: {
        viewDetails: 'View Details',
        editUser: 'Edit',
        disableUser: 'Disable',
        refreshData: 'Refresh Data',
        exportLogs: 'Export Logs'
      }
    },
    fil: {
      title: 'Administrator Dashboard',
      welcome: 'Maligayang pagbabalik',
      systemOverview: 'Pangkalahatang Sistema',
      userManagement: 'Pamamahala ng User',
      systemConfig: 'Configuration ng Sistema',
      dataMonitoring: 'Pagsubaybay ng Datos',
      stats: {
        totalUsers: 'Kabuuang Users',
        activeUsers: 'Aktibong Users',
        sensorHealth: 'Kalusugan ng Sensor',
        systemUptime: 'System Uptime'
      },
      users: {
        title: 'Nakarehistrong Users',
        name: 'Pangalan',
        email: 'Email',
        role: 'Role',
        status: 'Status',
        lastActive: 'Huling Aktibo',
        active: 'Aktibo',
        inactive: 'Hindi Aktibo',
        actions: 'Aksyon'
      },
      sensors: {
        title: 'Status ng Sensor',
        waterLevel: 'Water Level Sensor',
        rainfall: 'Rainfall Sensor',
        weatherStation: 'Weather Station',
        operational: 'Gumagana',
        offline: 'Offline'
      },
      notifications: {
        title: 'Settings ng Notification',
        sms: 'SMS Alerts',
        push: 'Push Notifications',
        email: 'Email Alerts',
        description: 'I-configure ang system-wide notification preferences'
      },
      dataSources: {
        title: 'Mga Pinagmumulan ng Datos',
        pagasa: 'PAGASA Integration',
        localSensors: 'Lokal na Sensors',
        communityReports: 'Ulat ng Komunidad',
        status: 'Status',
        connected: 'Konektado',
        lastSync: 'Huling Sync'
      },
      actions: {
        viewDetails: 'Tingnan ang Detalye',
        editUser: 'I-edit',
        disableUser: 'I-disable',
        refreshData: 'I-refresh ang Datos',
        exportLogs: 'I-export ang Logs'
      }
    }
  };

  const t = content[language];

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 1) return language === 'en' ? 'Just now' : 'Kamakailan lang';
    if (minutes < 60) return `${minutes} ${language === 'en' ? 'min ago' : 'min nakakaraan'}`;
    const hours = Math.floor(minutes / 60);
    return `${hours} ${language === 'en' ? 'hr ago' : 'oras nakakaraan'}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-6">
        <p className="text-purple-100 text-sm">{t.welcome},</p>
        <h1 className="mb-1">{user.name}</h1>
        <Badge className="bg-purple-800 text-white">
          <Shield className="w-3 h-3 mr-1" />
          Administrator
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="px-4 -mt-6 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-blue-600">1,247</p>
                  <p className="text-xs text-gray-600">{t.stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-green-600">892</p>
                  <p className="text-xs text-gray-600">{t.stats.activeUsers}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-purple-600">98%</p>
                  <p className="text-xs text-gray-600">{t.stats.sensorHealth}</p>
                </div>
                <Database className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-orange-600">99.9%</p>
                  <p className="text-xs text-gray-600">{t.stats.systemUptime}</p>
                </div>
                <Server className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="users">{t.userManagement}</TabsTrigger>
            <TabsTrigger value="system">{t.systemConfig}</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="mt-0 space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>{t.users.title}</CardTitle>
                <CardDescription>
                  {systemUsers.length} {language === 'en' ? 'users shown' : 'users na ipinakita'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {systemUsers.map((systemUser) => (
                  <div
                    key={systemUser.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm">{systemUser.name}</h4>
                        <Badge
                          className={`text-xs ${
                            systemUser.status === 'active'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-400 text-white'
                          }`}
                        >
                          {systemUser.status === 'active' ? t.users.active : t.users.inactive}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{systemUser.email}</p>
                      <p className="text-xs text-gray-500">
                        {t.users.role}: {systemUser.role} • {formatTimeAgo(systemUser.lastActive)}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      {t.actions.editUser}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Configuration Tab */}
          <TabsContent value="system" className="mt-0 space-y-3">
            {/* Sensor Status */}
            <Card>
              <CardHeader>
                <CardTitle>{t.sensors.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-600" />
                    <div>
                      <Label>{t.sensors.waterLevel}</Label>
                      <p className="text-xs text-gray-500">
                        {sensorStatus.waterLevel ? t.sensors.operational : t.sensors.offline}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={sensorStatus.waterLevel}
                    onCheckedChange={(checked) =>
                      setSensorStatus({ ...sensorStatus, waterLevel: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-600" />
                    <div>
                      <Label>{t.sensors.rainfall}</Label>
                      <p className="text-xs text-gray-500">
                        {sensorStatus.rainfall ? t.sensors.operational : t.sensors.offline}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={sensorStatus.rainfall}
                    onCheckedChange={(checked) =>
                      setSensorStatus({ ...sensorStatus, rainfall: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-600" />
                    <div>
                      <Label>{t.sensors.weatherStation}</Label>
                      <p className="text-xs text-gray-500">
                        {sensorStatus.weatherStation ? t.sensors.operational : t.sensors.offline}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={sensorStatus.weatherStation}
                    onCheckedChange={(checked) =>
                      setSensorStatus({ ...sensorStatus, weatherStation: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{t.notifications.title}</CardTitle>
                <CardDescription>{t.notifications.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t.notifications.sms}</Label>
                  <Switch
                    checked={notificationSettings.smsAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, smsAlerts: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t.notifications.push}</Label>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t.notifications.email}</Label>
                  <Switch
                    checked={notificationSettings.emailAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, emailAlerts: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle>{t.dataSources.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm">{t.dataSources.pagasa}</p>
                    <p className="text-xs text-gray-500">
                      {t.dataSources.lastSync}: 2 min ago
                    </p>
                  </div>
                  <Badge className="bg-green-500 text-white">{t.dataSources.connected}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm">{t.dataSources.localSensors}</p>
                    <p className="text-xs text-gray-500">
                      {t.dataSources.lastSync}: 30 sec ago
                    </p>
                  </div>
                  <Badge className="bg-green-500 text-white">{t.dataSources.connected}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm">{t.dataSources.communityReports}</p>
                    <p className="text-xs text-gray-500">
                      {t.dataSources.lastSync}: 1 min ago
                    </p>
                  </div>
                  <Badge className="bg-green-500 text-white">{t.dataSources.connected}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* System Actions */}
            <div className="space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Database className="w-4 h-4 mr-2" />
                {t.actions.refreshData}
              </Button>
              <Button variant="outline" className="w-full">
                <SettingsIcon className="w-4 h-4 mr-2" />
                {t.actions.exportLogs}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
