import { useState } from 'react';
import { Users, AlertTriangle, MapPin, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import type { UserSession } from './SignInScreen';

type Language = 'en' | 'fil';

interface OfficialDashboardProps {
  language: Language;
  user: UserSession;
}

interface CommunityReport {
  id: string;
  reporter: string;
  location: string;
  condition: string;
  timestamp: Date;
  status: 'pending' | 'verified' | 'resolved';
  priority: 'low' | 'medium' | 'high';
}

interface RescueRequest {
  id: string;
  name: string;
  location: string;
  people: number;
  timestamp: Date;
  status: 'pending' | 'dispatched' | 'completed';
}

export default function OfficialDashboard({ language, user }: OfficialDashboardProps) {
  const [reports] = useState<CommunityReport[]>([
    {
      id: 'R001',
      reporter: 'Maria Garcia',
      location: 'Main Street, Zone 79',
      condition: 'Knee-deep water',
      timestamp: new Date(Date.now() - 15 * 60000),
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'R002',
      reporter: 'Jose Reyes',
      location: 'Side Street A',
      condition: 'Ankle-deep water',
      timestamp: new Date(Date.now() - 30 * 60000),
      status: 'verified',
      priority: 'medium'
    },
    {
      id: 'R003',
      reporter: 'Ana Santos',
      location: 'Riverside Area',
      condition: 'Road impassable',
      timestamp: new Date(Date.now() - 45 * 60000),
      status: 'resolved',
      priority: 'high'
    }
  ]);

  const [rescueRequests] = useState<RescueRequest[]>([
    {
      id: 'SOS001',
      name: 'Pedro Cruz Family',
      location: '14.5765, 120.9835',
      people: 5,
      timestamp: new Date(Date.now() - 10 * 60000),
      status: 'dispatched'
    },
    {
      id: 'SOS002',
      name: 'Carmen Lopez',
      location: '14.5770, 120.9840',
      people: 2,
      timestamp: new Date(Date.now() - 25 * 60000),
      status: 'pending'
    }
  ]);

  const content = {
    en: {
      title: 'Official Dashboard',
      welcome: 'Welcome back',
      overview: 'Overview',
      reports: 'Community Reports',
      rescueRequests: 'Rescue Requests',
      evacuationStatus: 'Evacuation Status',
      stats: {
        activeReports: 'Active Reports',
        pendingRescue: 'Pending Rescue',
        evacuated: 'People Evacuated',
        shelterCapacity: 'Shelter Capacity'
      },
      reportStatus: {
        pending: 'Pending Review',
        verified: 'Verified',
        resolved: 'Resolved'
      },
      rescueStatus: {
        pending: 'Pending Dispatch',
        dispatched: 'Team Dispatched',
        completed: 'Completed'
      },
      priority: {
        low: 'Low',
        medium: 'Medium',
        high: 'High'
      },
      actions: {
        verify: 'Verify',
        dispatch: 'Dispatch Team',
        resolve: 'Mark Resolved',
        viewLocation: 'View Location'
      },
      noReports: 'No reports at this time',
      noRescue: 'No rescue requests',
      people: 'people',
      shelters: {
        barangayHall: 'Barangay Hall',
        elementary: 'Zone 79 Elementary',
        community: 'Community Center'
      }
    },
    fil: {
      title: 'Official Dashboard',
      welcome: 'Maligayang pagbabalik',
      overview: 'Pangkalahatang Datos',
      reports: 'Ulat ng Komunidad',
      rescueRequests: 'Mga Kahilingan ng Rescue',
      evacuationStatus: 'Status ng Evacuation',
      stats: {
        activeReports: 'Aktibong Ulat',
        pendingRescue: 'Naghihintay ng Rescue',
        evacuated: 'Nag-evacuate na',
        shelterCapacity: 'Kapasidad ng Shelter'
      },
      reportStatus: {
        pending: 'Naghihintay ng Review',
        verified: 'Naberipika na',
        resolved: 'Nalutas na'
      },
      rescueStatus: {
        pending: 'Naghihintay ng Dispatch',
        dispatched: 'Naka-dispatch na ang Team',
        completed: 'Tapos na'
      },
      priority: {
        low: 'Mababa',
        medium: 'Katamtaman',
        high: 'Mataas'
      },
      actions: {
        verify: 'I-verify',
        dispatch: 'Magpadala ng Team',
        resolve: 'Markahan bilang Tapos',
        viewLocation: 'Tingnan ang Lokasyon'
      },
      noReports: 'Walang ulat sa ngayon',
      noRescue: 'Walang rescue requests',
      people: 'tao',
      shelters: {
        barangayHall: 'Barangay Hall',
        elementary: 'Zone 79 Elementary',
        community: 'Community Center'
      }
    }
  };

  const t = content[language];

  const priorityColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };

  const statusColors = {
    pending: 'bg-orange-500',
    verified: 'bg-blue-500',
    resolved: 'bg-green-500',
    dispatched: 'bg-purple-500',
    completed: 'bg-green-500'
  };

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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-6">
        <p className="text-blue-100 text-sm">{t.welcome},</p>
        <h1 className="mb-1">{user.name}</h1>
        <p className="text-sm text-blue-100">{user.barangay}</p>
      </div>

      {/* Stats Overview */}
      <div className="px-4 -mt-6 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-orange-600">
                    {reports.filter(r => r.status === 'pending').length}
                  </p>
                  <p className="text-xs text-gray-600">{t.stats.activeReports}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-red-600">
                    {rescueRequests.filter(r => r.status === 'pending').length}
                  </p>
                  <p className="text-xs text-gray-600">{t.stats.pendingRescue}</p>
                </div>
                <Users className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-green-600">127</p>
                  <p className="text-xs text-gray-600">{t.stats.evacuated}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-blue-600">71%</p>
                  <p className="text-xs text-gray-600">{t.stats.shelterCapacity}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4">
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="reports">{t.reports}</TabsTrigger>
            <TabsTrigger value="rescue">{t.rescueRequests}</TabsTrigger>
          </TabsList>

          {/* Community Reports Tab */}
          <TabsContent value="reports" className="mt-0 space-y-3">
            {reports.length > 0 ? (
              reports.map((report) => (
                <Card key={report.id} className="border-l-4" style={{ borderLeftColor: priorityColors[report.priority].replace('bg-', '#') }}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-gray-900">{report.reporter}</h3>
                          <Badge className={`${priorityColors[report.priority]} text-white text-xs`}>
                            {t.priority[report.priority]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="w-3 h-3" />
                          {report.location}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>{language === 'en' ? 'Condition:' : 'Kalagayan:'}</strong> {report.condition}
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{formatTimeAgo(report.timestamp)}</span>
                          <Badge className={`${statusColors[report.status]} text-white text-xs ml-auto`}>
                            {t.reportStatus[report.status]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {report.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          {t.actions.viewLocation}
                        </Button>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                          {t.actions.verify}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">{t.noReports}</p>
              </div>
            )}
          </TabsContent>

          {/* Rescue Requests Tab */}
          <TabsContent value="rescue" className="mt-0 space-y-3">
            {rescueRequests.length > 0 ? (
              rescueRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-red-500 bg-red-50">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{request.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="w-3 h-3" />
                          {request.location}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          <Users className="w-3 h-3 inline mr-1" />
                          {request.people} {t.people}
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{formatTimeAgo(request.timestamp)}</span>
                          <Badge className={`${statusColors[request.status]} text-white text-xs ml-auto`}>
                            {t.rescueStatus[request.status]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          {t.actions.viewLocation}
                        </Button>
                        <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
                          {t.actions.dispatch}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">{t.noRescue}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Evacuation Center Status */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{t.evacuationStatus}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{t.shelters.barangayHall}</span>
                <span className="text-gray-600">107/150</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{t.shelters.elementary}</span>
                <span className="text-gray-600">20/200</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{t.shelters.community}</span>
                <span className="text-gray-600">0/100</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
