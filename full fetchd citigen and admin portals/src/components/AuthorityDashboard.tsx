import { useState } from 'react';
import { AuthorityHeader } from './AuthorityHeader';
import { AuthorityReportsTable } from './AuthorityReportsTable';
import { IssueManagementModal } from './IssueManagementModal';
import { DepartmentManagement } from './DepartmentManagement';
import { StaffManagement } from './StaffManagement';
import { AnalyticsCharts } from './AnalyticsCharts';
import { AuthorityMapView } from './AuthorityMapView';
import { SearchAndFilter, FilterCriteria } from './SearchAndFilter';
import { SettingsPage } from './SettingsPage';
import { NotificationsPage } from './NotificationsPage';
import { ProfilePage } from './ProfilePage';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  Bell,
  XCircle,
  Map,
} from 'lucide-react';
import { getAllReports } from '../data/mockData';
import { mockNotifications, getUnreadNotifications } from '../data/authorityMockData';
import { Report } from '../types/report';
import { Toaster } from './ui/sonner';

interface AuthorityDashboardProps {
  onLogout: () => void;
}

export default function AuthorityDashboard({ onLogout }: AuthorityDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'settings' | 'notifications' | 'profile'>('dashboard');
  const [allReports, setAllReports] = useState(getAllReports());
  const [filteredReports, setFilteredReports] = useState(getAllReports());
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const stats = {
    total: allReports.length,
    pending: allReports.filter(r => r.status === 'pending').length,
    inProgress: allReports.filter(r => r.status === 'in-progress').length,
    resolved: allReports.filter(r => r.status === 'resolved').length,
    rejected: allReports.filter(r => r.status === 'rejected').length,
    highPriority: allReports.filter(r => r.priority === 'high' || r.priority === 'critical').length,
  };

  const pendingReports = filteredReports.filter(r => r.status === 'pending');
  const inProgressReports = filteredReports.filter(r => r.status === 'in-progress');
  const resolvedReports = filteredReports.filter(r => r.status === 'resolved');
  const rejectedReports = filteredReports.filter(r => r.status === 'rejected');
  const newReports = filteredReports.filter(r => !r.assignedTo).slice(0, 10);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredReports(allReports);
      return;
    }
    
    const filtered = allReports.filter(report =>
      report.title.toLowerCase().includes(query.toLowerCase()) ||
      report.description.toLowerCase().includes(query.toLowerCase()) ||
      report.submittedBy.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredReports(filtered);
  };

  const handleFilter = (filters: FilterCriteria) => {
    let filtered = allReports;

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(r => r.category === filters.category);
    }
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(r => r.priority === filters.priority);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(r => new Date(r.submittedAt) >= new Date(filters.dateFrom!));
    }

    setFilteredReports(filtered);
  };

  const handleUpdateReport = (updatedReport: Report) => {
    setAllReports(allReports.map(r => r.id === updatedReport.id ? updatedReport : r));
    setFilteredReports(filteredReports.map(r => r.id === updatedReport.id ? updatedReport : r));
  };

  const renderPage = () => {
    if (currentPage === 'settings') return <SettingsPage userType="authority" />;
    if (currentPage === 'notifications') return <NotificationsPage userType="authority" />;
    if (currentPage === 'profile') return <ProfilePage userType="authority" onLogout={onLogout} />;

    return (
      <>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`p-6 border-l-4 ${stat.borderColor} hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-5xl grid-cols-7">
            <TabsTrigger value="overview">
              <FileText className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="new">
              New
              {newReports.length > 0 && (
                <Badge className="ml-2 bg-red-500">{newReports.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map className="w-4 h-4 mr-2" />
              Map
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="departments">
              <Users className="w-4 h-4 mr-2" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="staff">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
              {getUnreadNotifications().length > 0 && (
                <Badge className="ml-2 bg-red-500">{getUnreadNotifications().length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <SearchAndFilter onSearch={handleSearch} onFilter={handleFilter} />
            
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All ({filteredReports.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress ({stats.inProgress})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="all">
                  <AuthorityReportsTable reports={filteredReports} title="All Reports" onReportUpdate={handleUpdateReport} />
                </TabsContent>
                <TabsContent value="pending">
                  <AuthorityReportsTable reports={pendingReports} title="Pending Reports" onReportUpdate={handleUpdateReport} />
                </TabsContent>
                <TabsContent value="in-progress">
                  <AuthorityReportsTable reports={inProgressReports} title="In Progress Reports" onReportUpdate={handleUpdateReport} />
                </TabsContent>
                <TabsContent value="resolved">
                  <AuthorityReportsTable reports={resolvedReports} title="Resolved Reports" onReportUpdate={handleUpdateReport} />
                </TabsContent>
                <TabsContent value="rejected">
                  <AuthorityReportsTable reports={rejectedReports} title="Rejected Reports" onReportUpdate={handleUpdateReport} />
                </TabsContent>
              </div>
            </Tabs>
          </TabsContent>

          {/* New Reports Tab */}
          <TabsContent value="new">
            <div className="space-y-4">
              <h3 className="text-slate-900">New Unassigned Reports</h3>
              <AuthorityReportsTable reports={newReports} title="New Reports Requiring Action" onReportUpdate={handleUpdateReport} />
            </div>
          </TabsContent>

          {/* Map View Tab */}
          <TabsContent value="map">
            <AuthorityMapView reports={allReports} onReportUpdate={handleUpdateReport} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsCharts />
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments">
            <DepartmentManagement />
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff">
            <StaffManagement />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="space-y-4">
              <h3 className="text-slate-900">Notifications & Alerts</h3>
              {mockNotifications.map((notif) => (
                <Card key={notif.id} className={`p-4 ${!notif.isRead ? 'border-l-4 border-l-blue-600 bg-blue-50/50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-slate-900">{notif.title}</h4>
                        {!notif.isRead && (
                          <Badge className="bg-blue-100 text-blue-800">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{notif.message}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(notif.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Issue Management Modal */}
        <IssueManagementModal
          report={selectedReport}
          open={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          onUpdate={handleUpdateReport}
        />
      </>
    );
  };

  const statCards = [
    {
      title: 'Total Reports',
      value: stats.total,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
    },
    {
      title: 'High Priority',
      value: stats.highPriority,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <AuthorityHeader onLogout={onLogout} onNavigate={setCurrentPage} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-slate-900 mb-2">Authority Dashboard</h2>
          <p className="text-slate-600">
            Monitor and manage all civic issue reports from your jurisdiction
          </p>
        </div>

        {renderPage()}
      </main>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />

      {/* Footer */}
      <footer className="mt-16 border-t bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600">
            <p>© 2025 Municipal Authority Portal. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
              <a href="#" className="hover:text-blue-600 transition-colors">System Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
