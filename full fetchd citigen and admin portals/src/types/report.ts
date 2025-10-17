export type ReportStatus = 'resolved' | 'in-progress' | 'pending' | 'rejected' | 'not-started';

export type ReportCategory = 
  | 'potholes'
  | 'streetlight'
  | 'drainage'
  | 'garbage'
  | 'water-supply'
  | 'road-damage'
  | 'park-maintenance'
  | 'other';

export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  priority: ReportPriority;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  submittedBy: string;
  submittedByEmail?: string;
  submittedAt: Date;
  image: string;
  complaintCount: number;
  
  // Assignment fields
  assignedTo?: string; // Staff ID
  assignedToName?: string;
  assignedToDepartment?: string; // Department ID
  assignedDepartmentName?: string;
  assignedAt?: Date;
  
  // For in-progress reports
  progressDetails?: string;
  progressImages?: string[];
  predictedCompletion?: Date;
  estimatedStartDate?: Date;
  delayReason?: string;
  
  // For resolved reports
  completedAt?: Date;
  completionImage?: string;
  financialData?: {
    sanctionedAmount: number;
    usedAmount: number;
    usageDetails: string;
  };
  
  // For rejected reports
  rejectedAt?: Date;
  rejectionReason?: string;
  
  // Admin notes
  adminNotes?: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: Date;
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
