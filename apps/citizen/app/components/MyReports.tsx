import { useState } from 'react';
import { Report } from '../types/report';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ReportCard } from './ReportCard';
import { ReportDetailsModal } from './ReportDetailsModal';
import { getReportsByStatus } from '../data/mockData';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export function MyReports() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const resolvedReports = getReportsByStatus('resolved');
  const inProgressReports = getReportsByStatus('in-progress');
  const pendingReports = getReportsByStatus('pending');

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12 text-slate-500">
      <p>{message}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900 mb-2">My Reports</h2>
        <p className="text-slate-600">Track the status of all your submitted civic issue reports</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">
            All ({resolvedReports.length + inProgressReports.length + pendingReports.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Resolved ({resolvedReports.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            In Progress ({inProgressReports.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Pending ({pendingReports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {[...pendingReports, ...inProgressReports, ...resolvedReports].length === 0 ? (
            <EmptyState message="You haven't submitted any reports yet." />
          ) : (
            [...pendingReports, ...inProgressReports, ...resolvedReports].map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => handleReportClick(report)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedReports.length === 0 ? (
            <EmptyState message="No resolved reports yet." />
          ) : (
            resolvedReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => handleReportClick(report)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressReports.length === 0 ? (
            <EmptyState message="No reports in progress." />
          ) : (
            inProgressReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => handleReportClick(report)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingReports.length === 0 ? (
            <EmptyState message="No pending reports." />
          ) : (
            pendingReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => handleReportClick(report)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      <ReportDetailsModal
        report={selectedReport}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
