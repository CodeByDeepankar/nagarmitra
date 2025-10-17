export interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string;
  staffCount: number;
  activeIssues: number;
  resolvedIssues: number;
  averageResolutionTime: number; // in days
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentId: string;
  assignedIssues: number;
  resolvedIssues: number;
  phone: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  reportId: string;
  adminId: string;
  adminName: string;
  action: string;
  timestamp: Date;
  details: string;
}

export interface Comment {
  id: string;
  reportId: string;
  authorId: string;
  authorName: string;
  authorRole: 'admin' | 'citizen';
  message: string;
  isPrivate: boolean;
  timestamp: Date;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'new_report' | 'overdue' | 'high_priority' | 'update' | 'comment';
  reportId?: string;
  isRead: boolean;
  timestamp: Date;
}
