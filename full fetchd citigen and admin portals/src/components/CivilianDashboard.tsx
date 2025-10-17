import { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { MyReports } from './MyReports';
import { MapView } from './MapView';
import { ReportForm } from './ReportForm';
import { SettingsPage } from './SettingsPage';
import { NotificationsPage } from './NotificationsPage';
import { ProfilePage } from './ProfilePage';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, FileText, Map } from 'lucide-react';
import { Toaster } from './ui/sonner';
import { useLanguage } from '../contexts/LanguageContext';

export default function CivilianDashboard() {
  const { t } = useLanguage();
  const [reportFormOpen, setReportFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my-reports');
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'settings' | 'notifications' | 'profile'>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'settings':
        return <SettingsPage userType="civilian" />;
      case 'notifications':
        return <NotificationsPage userType="civilian" />;
      case 'profile':
        return <ProfilePage userType="civilian" />;
      default:
        return (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-slate-900 mb-2">{t('dashboard.welcome')}</h2>
              <p className="text-slate-600 mb-6">
                {t('dashboard.subtitle')}
              </p>

              {/* Stats Overview */}
              <DashboardStats />
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="my-reports" className="gap-2">
                  <FileText className="w-4 h-4" />
                  {t('tabs.myReports')}
                </TabsTrigger>
                <TabsTrigger value="map-view" className="gap-2">
                  <Map className="w-4 h-4" />
                  {t('tabs.mapView')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="my-reports" className="space-y-4">
                <MyReports />
              </TabsContent>

              <TabsContent value="map-view" className="space-y-4">
                <MapView />
              </TabsContent>
            </Tabs>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pb-24">
      <DashboardHeader onNavigate={setCurrentPage} />
      
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>

      {/* Floating Report Button - Large, Red, Bottom-Right */}
      <button
        onClick={() => setReportFormOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center gap-3 px-6 py-4 group"
        style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
      >
        <Plus className="w-7 h-7" />
        <span className="font-semibold hidden sm:inline">Report a Problem</span>
      </button>

      {/* Report Form Modal */}
      <ReportForm open={reportFormOpen} onClose={() => setReportFormOpen(false)} />

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />

      {/* Footer */}
      <footer className="mt-16 border-t bg-white/50 backdrop-blur-sm">

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600">
            <p>{t('footer.copyright')}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-600 transition-colors">{t('footer.about')}</a>
              <a href="#" className="hover:text-blue-600 transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-blue-600 transition-colors">{t('footer.terms')}</a>
              <a href="#" className="hover:text-blue-600 transition-colors">{t('footer.contact')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
