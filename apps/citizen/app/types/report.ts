export type ReportStatus = 'resolved' | 'in-progress' | 'pending';

export type ReportCategory = 
  | 'potholes'
  | 'streetlight'
  | 'drainage'
  | 'garbage'
  | 'water-supply'
  | 'road-damage'
  | 'park-maintenance'
  | 'other';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  submittedBy: string;
  submittedAt: Date;
  image: string;
  complaintCount: number;
  
  // For in-progress reports
  progressDetails?: string;
  progressImages?: string[];
  predictedCompletion?: Date;
  
  // For resolved reports
  completedAt?: Date;
  completionImage?: string;
  financialData?: {
    sanctionedAmount: number;
    usedAmount: number;
    usageDetails: string;
  };
}

export interface NewReport {
  title: string;
  description: string;
  category: ReportCategory;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  image: File | null;
}
