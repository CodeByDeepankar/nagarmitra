import { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { MyReports } from './MyReports';
import { MapView } from './MapView';
import { ReportForm } from './ReportForm';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, FileText, Map } from 'lucide-react';
import { Toaster } from './ui/sonner';
import { useLanguage } from '../contexts/LanguageContext';

export default function CivilianDashboard() {
  const { t } = useLanguage();
  const [reportFormOpen, setReportFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my-reports');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-slate-900 mb-2">{t('dashboard.welcome')}</h2>
          <p className="text-slate-600 mb-6">
            {t('dashboard.subtitle')}
          </p>

          {/* Stats Overview */}
          <DashboardStats />
        </div>

        {/* Main Action Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-slate-900">{t('dashboard.overview')}</h3>
          <Button
            onClick={() => setReportFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('dashboard.reportNew')}
          </Button>
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
      </main>

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
