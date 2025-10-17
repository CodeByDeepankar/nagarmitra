import { useState } from 'react';
import { Report } from '../types/report';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Card } from './ui/card';
import { Eye, MapPin, User, Calendar, Edit2 as Edit } from 'lucide-react';
import { ReportDetailsModal } from './ReportDetailsModal';
import { ProgressUpdateModal } from './ProgressUpdateModal';
import { format } from '../utils/date';

interface AuthorityReportsTableProps {
  reports: Report[];
  title: string;
}

export function AuthorityReportsTable({ reports, title, onReportUpdate }: AuthorityReportsTableProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getPriorityColor = (count: number) => {
    if (count >= 10) return 'text-red-600';
    if (count >= 5) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleUpdateProgress = (report: Report) => {
    setSelectedReport(report);
    setProgressModalOpen(true);
  };

  const handleProgressUpdate = (updatedReport: Report) => {
    onReportUpdate?.(updatedReport);
  };

  if (reports.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-slate-500">
          <p>No reports found in this category.</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Complaints</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report, index) => (
                <TableRow key={report.id} className="hover:bg-slate-50">
                  <TableCell className="text-slate-500">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={report.image}
                        alt={report.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="max-w-xs">
                        <p className="text-slate-900 line-clamp-1">{report.title}</p>
                        <p className="text-sm text-slate-500 line-clamp-1">
                          {report.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-100">
                      {report.category.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600 max-w-xs">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="line-clamp-1">{report.location.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <User className="w-3 h-3" />
                      <span>{report.submittedBy}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(report.submittedAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getPriorityColor(report.complaintCount)}`}>
                      {report.complaintCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(report)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateProgress(report)}
                        className="border-blue-500 text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Update
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ReportDetailsModal
        report={selectedReport}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <ProgressUpdateModal
        report={selectedReport}
        open={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
        onUpdate={handleProgressUpdate}
      />
    </>
  );
}
