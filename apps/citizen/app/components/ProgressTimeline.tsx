"use client";

import { Check, Clock, XCircle, AlertCircle } from "lucide-react";

interface TimelineEvent {
  status: string;
  date: string | null;
  label: string;
  icon: React.ReactNode;
  color: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface ProgressTimelineProps {
  currentStatus: string;
  createdAt: string;
  estimatedStartDate?: string | null;
  estimatedCompletionDate?: string | null;
  actualCompletionDate?: string | null;
}

export default function ProgressTimeline({
  currentStatus,
  createdAt,
  estimatedStartDate,
  estimatedCompletionDate,
  actualCompletionDate,
}: ProgressTimelineProps) {
  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'Pending': return 0;
      case 'In Progress': return 1;
      case 'Resolved': return 2;
      case 'Rejected': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex(currentStatus);

  const timeline: TimelineEvent[] = [
    {
      status: 'Pending',
      date: createdAt,
      label: 'Issue Reported',
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'text-blue-600',
      isActive: currentIndex === 0,
      isCompleted: currentIndex > 0,
    },
    {
      status: 'In Progress',
      date: estimatedStartDate || null,
      label: 'Work Started',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-yellow-600',
      isActive: currentIndex === 1,
      isCompleted: currentIndex > 1,
    },
    {
      status: 'Resolved',
      date: actualCompletionDate || estimatedCompletionDate || null,
      label: 'Issue Resolved',
      icon: <Check className="w-5 h-5" />,
      color: 'text-green-600',
      isActive: currentIndex === 2,
      isCompleted: false,
    },
  ];

  const formatDate = (date: string | null) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle rejected status
  if (currentStatus === 'Rejected') {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-900 text-lg">Issue Rejected</h3>
            <p className="text-sm text-red-700">
              Reported on {formatDate(createdAt)}
            </p>
          </div>
        </div>
        <p className="text-sm text-red-800">
          This issue has been reviewed and rejected by the authorities.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-lg">
      <h3 className="font-semibold text-gray-900 mb-6 text-lg">Progress Timeline</h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300" />
        
        {/* Progress line */}
        <div 
          className="absolute left-6 top-0 w-0.5 bg-blue-600 transition-all duration-500"
          style={{ 
            height: `${(currentIndex / (timeline.length - 1)) * 100}%` 
          }}
        />

        {/* Timeline events */}
        <div className="space-y-8">
          {timeline.map((event, index) => (
            <div key={event.status} className="relative flex items-start gap-6">
              {/* Icon circle */}
              <div
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  event.isCompleted
                    ? 'bg-blue-600 shadow-lg'
                    : event.isActive
                    ? 'bg-blue-600 shadow-lg ring-4 ring-blue-200'
                    : 'bg-white border-2 border-gray-300'
                }`}
              >
                <div
                  className={
                    event.isCompleted || event.isActive
                      ? 'text-white'
                      : 'text-gray-400'
                  }
                >
                  {event.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={`font-semibold text-lg ${
                      event.isCompleted || event.isActive
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}
                  >
                    {event.label}
                  </h4>
                  {event.isActive && (
                    <span className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
                      Current
                    </span>
                  )}
                  {event.isCompleted && (
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full border border-green-200">
                      Completed
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm ${
                    event.isCompleted || event.isActive
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }`}
                >
                  {event.date ? formatDate(event.date) : 'Date not available'}
                </p>
                
                {/* Additional info for estimated dates */}
                {event.status === 'In Progress' && currentIndex === 1 && estimatedCompletionDate && (
                  <p className="text-xs text-blue-700 mt-1">
                    Expected completion: {formatDate(estimatedCompletionDate)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status message */}
      <div className="mt-6 pt-4 border-t border-blue-200">
        <p className="text-sm text-gray-700">
          {currentIndex === 0 && (
            <>
              <span className="font-medium text-blue-700">Status:</span> Your issue has been submitted and is awaiting assignment.
            </>
          )}
          {currentIndex === 1 && (
            <>
              <span className="font-medium text-yellow-700">Status:</span> Authorities are actively working on resolving this issue.
            </>
          )}
          {currentIndex === 2 && (
            <>
              <span className="font-medium text-green-700">Status:</span> This issue has been successfully resolved! Thank you for your patience.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
