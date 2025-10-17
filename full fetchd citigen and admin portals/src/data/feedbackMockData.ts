import { Feedback } from '../types/feedback';

export const mockFeedback: Feedback[] = [
  {
    id: 'feedback-1',
    reportId: '1',
    userId: 'user-1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Excellent work! The pothole was fixed very quickly and professionally.',
    wasProperlyFixed: 'yes',
    satisfiedWithTime: 'yes',
    submittedAt: new Date('2024-02-02T10:00:00'),
  },
  {
    id: 'feedback-2',
    reportId: '4',
    userId: 'user-2',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Good service, but took a bit longer than expected.',
    wasProperlyFixed: 'yes',
    satisfiedWithTime: 'somewhat',
    submittedAt: new Date('2024-01-23T14:30:00'),
  },
];

export const getFeedbackByReport = (reportId: string) => {
  return mockFeedback.filter(f => f.reportId === reportId);
};

export const addFeedback = (feedback: Feedback) => {
  mockFeedback.push(feedback);
};
