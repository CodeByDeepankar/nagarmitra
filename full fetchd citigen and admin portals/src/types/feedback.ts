export interface Feedback {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5 stars
  comment: string;
  wasProperlyFixed: 'yes' | 'no' | 'somewhat';
  satisfiedWithTime: 'yes' | 'no' | 'somewhat';
  submittedAt: Date;
}
