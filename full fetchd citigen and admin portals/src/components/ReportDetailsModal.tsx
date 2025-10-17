import { useState } from 'react';
import { Report } from '../types/report';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { MapPin, Calendar, Clock, Users, DollarSign, CheckCircle2, AlertCircle, Star } from 'lucide-react';
import { format } from '../utils/date';
import { FeedbackModal } from './FeedbackModal';
import { getFeedbackByReport } from '../data/feedbackMockData';

interface ReportDetailsModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
  showFeedbackButton?: boolean;
}

export function ReportDetailsModal({ report, open, onClose, showFeedbackButton = false }: ReportDetailsModalProps) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  
  if (!report) return null;

  const feedbacks = getFeedbackByReport(report.id);
  const hasFeedback = feedbacks.length > 0;

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-900 pr-8">{report.title}</DialogTitle>
          <DialogDescription className="text-slate-600">
            Detailed information about this civic issue report
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(report.status)}>
              {report.status.replace('-', ' ')}
            </Badge>
            <Badge variant="outline" className="bg-slate-100">
              {report.category.replace('-', ' ')}
            </Badge>
          </div>

          {/* Original Report Image */}
          <div>
            <h4 className="mb-2 text-slate-700">Reported Issue</h4>
            <img
              src={report.image}
              alt={report.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Description */}
          <div>
            <h4 className="mb-2 text-slate-700">Description</h4>
            <p className="text-slate-600 text-sm">{report.description}</p>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="text-slate-900">{report.location.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-500">Submitted On</p>
                <p className="text-slate-900">
                  {format(new Date(report.submittedAt), 'PPpp')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-500">Total Reports</p>
                <p className="text-slate-900">{report.complaintCount} people</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-500">Submitted By</p>
                <p className="text-slate-900">{report.submittedBy}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status-specific sections */}
          {report.status === 'resolved' && report.financialData && (
            <>
              <div>
                <h4 className="mb-3 text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Resolution Details
                </h4>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-green-700" />
                    <p className="text-sm text-green-700">
                      Completed on {format(new Date(report.completedAt!), 'PPP')}
                    </p>
                  </div>
                </div>

                {report.completionImage && (
                  <div className="mb-4">
                    <p className="text-sm text-slate-500 mb-2">After Completion</p>
                    <img
                      src={report.completionImage}
                      alt="Completion"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="mb-3 text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Financial Transparency
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sanctioned Amount:</span>
                      <span className="text-slate-900">${report.financialData.sanctionedAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Amount Used:</span>
                      <span className="text-slate-900">${report.financialData.usedAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Savings:</span>
                      <span className="text-green-600">
                        ${(report.financialData.sanctionedAmount - report.financialData.usedAmount).toLocaleString()}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div>
                      <p className="text-slate-600 mb-1">Usage Breakdown:</p>
                      <p className="text-slate-900">{report.financialData.usageDetails}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {report.status === 'in-progress' && (
            <>
              <div>
                <h4 className="mb-3 text-slate-700">Progress Update</h4>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-yellow-700" />
                    <p className="text-sm text-yellow-700">
                      Expected completion: {report.predictedCompletion && format(new Date(report.predictedCompletion), 'PPP')}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    {report.progressDetails}
                  </p>
                </div>

                {report.progressImages && report.progressImages.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Progress Photos</p>
                    <div className="grid grid-cols-2 gap-3">
                      {report.progressImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Progress ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {report.status === 'pending' && (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-700" />
                  <h4 className="text-red-900">Pending Review</h4>
                </div>
                <p className="text-sm text-red-700 mb-2">
                  This report is currently under review by the municipal authorities.
                </p>
                {report.predictedCompletion && (
                  <p className="text-sm text-slate-600">
                    Estimated review completion: {format(new Date(report.predictedCompletion), 'PPP')}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Feedback Section */}
          {hasFeedback && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 text-slate-700 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Citizen Feedback
                </h4>
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= feedback.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-slate-600 ml-2">
                        {feedback.rating}/5 Stars
                      </span>
                    </div>
                    {feedback.comment && (
                      <p className="text-sm text-slate-700 mb-2">{feedback.comment}</p>
                    )}
                    <p className="text-xs text-slate-500">
                      Submitted by {feedback.userName} on {format(new Date(feedback.submittedAt), 'PPP')}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Give Feedback Button (for resolved reports) */}
          {showFeedbackButton && report.status === 'resolved' && !hasFeedback && (
            <>
              <Separator />
              <div className="flex justify-center">
                <Button
                  onClick={() => setFeedbackModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Give Feedback
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>

      {/* Feedback Modal */}
      <FeedbackModal
        reportId={report.id}
        reportTitle={report.title}
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </Dialog>
  );
}
