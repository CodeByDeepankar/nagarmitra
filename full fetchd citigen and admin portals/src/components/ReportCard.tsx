import { useState } from 'react';
import { Report } from '../types/report';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Calendar, Users, Star } from 'lucide-react';
import { format } from '../utils/date';
import { FeedbackModal } from './FeedbackModal';

interface ReportCardProps {
  report: Report;
  onClick: () => void;
  showFeedbackButton?: boolean;
}

export function ReportCard({ report, onClick, showFeedbackButton = false }: ReportCardProps) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      potholes: 'bg-orange-100 text-orange-800',
      streetlight: 'bg-blue-100 text-blue-800',
      drainage: 'bg-cyan-100 text-cyan-800',
      garbage: 'bg-purple-100 text-purple-800',
      'water-supply': 'bg-indigo-100 text-indigo-800',
      'road-damage': 'bg-red-100 text-red-800',
      'park-maintenance': 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
          <img
            src={report.image}
            alt={report.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-slate-900 pr-4 line-clamp-2">{report.title}</h3>
            <Badge className={getStatusColor(report.status)}>
              {report.status.replace('-', ' ')}
            </Badge>
          </div>
          
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
            {report.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className={getCategoryColor(report.category)}>
              {report.category.replace('-', ' ')}
            </Badge>
          </div>
          
          <div className="space-y-1.5 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{report.location.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(report.submittedAt), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{report.complaintCount} {report.complaintCount === 1 ? 'person' : 'people'} reported</span>
            </div>
          </div>

          {/* Feedback Button for Resolved Reports */}
          {showFeedbackButton && report.status === 'resolved' && (
            <div className="mt-3 pt-3 border-t">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setFeedbackModalOpen(true);
                }}
                variant="outline"
                className="w-full border-green-500 text-green-700 hover:bg-green-50"
                size="sm"
              >
                <Star className="w-4 h-4 mr-2" />
                Give Feedback
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        reportId={report.id}
        reportTitle={report.title}
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </Card>
  );
}
