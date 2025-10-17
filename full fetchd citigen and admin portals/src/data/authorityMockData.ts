import { Department, Staff, AuditLog, Comment, NotificationItem } from '../types/authority';

export const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Road & Infrastructure',
    description: 'Manages road repairs, pothole filling, and infrastructure maintenance',
    headOfDepartment: 'John Smith',
    staffCount: 12,
    activeIssues: 8,
    resolvedIssues: 45,
    averageResolutionTime: 7,
  },
  {
    id: 'dept-2',
    name: 'Sanitation & Waste Management',
    description: 'Handles garbage collection, drainage, and cleanliness',
    headOfDepartment: 'Mary Johnson',
    staffCount: 15,
    activeIssues: 5,
    resolvedIssues: 68,
    averageResolutionTime: 3,
  },
  {
    id: 'dept-3',
    name: 'Public Utilities',
    description: 'Water supply, street lighting, and electrical maintenance',
    headOfDepartment: 'Robert Davis',
    staffCount: 10,
    activeIssues: 6,
    resolvedIssues: 52,
    averageResolutionTime: 5,
  },
  {
    id: 'dept-4',
    name: 'Parks & Recreation',
    description: 'Park maintenance, green spaces, and recreational facilities',
    headOfDepartment: 'Sarah Wilson',
    staffCount: 8,
    activeIssues: 3,
    resolvedIssues: 34,
    averageResolutionTime: 6,
  },
];

export const mockStaff: Staff[] = [
  {
    id: 'staff-1',
    name: 'Mike Thompson',
    email: 'mike.thompson@municipal.gov',
    role: 'Field Engineer',
    departmentId: 'dept-1',
    assignedIssues: 3,
    resolvedIssues: 12,
    phone: '+1 (555) 123-4567',
    isActive: true,
  },
  {
    id: 'staff-2',
    name: 'Emily Chen',
    email: 'emily.chen@municipal.gov',
    role: 'Sanitation Supervisor',
    departmentId: 'dept-2',
    assignedIssues: 2,
    resolvedIssues: 18,
    phone: '+1 (555) 234-5678',
    isActive: true,
  },
  {
    id: 'staff-3',
    name: 'David Martinez',
    email: 'david.martinez@municipal.gov',
    role: 'Electrician',
    departmentId: 'dept-3',
    assignedIssues: 2,
    resolvedIssues: 15,
    phone: '+1 (555) 345-6789',
    isActive: true,
  },
  {
    id: 'staff-4',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@municipal.gov',
    role: 'Parks Coordinator',
    departmentId: 'dept-4',
    assignedIssues: 1,
    resolvedIssues: 10,
    phone: '+1 (555) 456-7890',
    isActive: true,
  },
  {
    id: 'staff-5',
    name: 'James Wilson',
    email: 'james.wilson@municipal.gov',
    role: 'Road Crew Lead',
    departmentId: 'dept-1',
    assignedIssues: 4,
    resolvedIssues: 20,
    phone: '+1 (555) 567-8901',
    isActive: true,
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    reportId: '1',
    adminId: 'admin-1',
    adminName: 'Admin Officer',
    action: 'Status Changed',
    timestamp: new Date('2024-01-20T10:00:00'),
    details: 'Changed status from pending to in-progress',
  },
  {
    id: 'audit-2',
    reportId: '1',
    adminId: 'admin-1',
    adminName: 'Admin Officer',
    action: 'Assigned to Staff',
    timestamp: new Date('2024-01-20T10:05:00'),
    details: 'Assigned to Mike Thompson (Road & Infrastructure)',
  },
  {
    id: 'audit-3',
    reportId: '1',
    adminId: 'admin-1',
    adminName: 'Admin Officer',
    action: 'Status Changed',
    timestamp: new Date('2024-02-01T14:00:00'),
    details: 'Changed status from in-progress to resolved',
  },
];

export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    reportId: '2',
    authorId: 'admin-1',
    authorName: 'Admin Officer',
    authorRole: 'admin',
    message: 'We have assigned an electrician to inspect this issue. Parts have been ordered.',
    isPrivate: false,
    timestamp: new Date('2024-02-12T09:00:00'),
  },
  {
    id: 'comment-2',
    reportId: '2',
    authorId: 'staff-3',
    authorName: 'David Martinez',
    authorRole: 'admin',
    message: 'Internal note: Waiting for parts delivery from supplier. ETA 2 days.',
    isPrivate: true,
    timestamp: new Date('2024-02-13T11:00:00'),
  },
  {
    id: 'comment-3',
    reportId: '3',
    authorId: 'admin-1',
    authorName: 'Admin Officer',
    authorRole: 'admin',
    message: 'Your report has been received. Our drainage team will inspect the area within 48 hours.',
    isPrivate: false,
    timestamp: new Date('2024-02-21T08:00:00'),
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New High Priority Report',
    message: 'Water supply interruption reported with 25 complaints',
    type: 'high_priority',
    reportId: '5',
    isRead: false,
    timestamp: new Date('2024-02-23T10:30:00'),
  },
  {
    id: 'notif-2',
    title: 'Overdue Issue',
    message: 'Clogged drainage system is past predicted completion date',
    type: 'overdue',
    reportId: '3',
    isRead: false,
    timestamp: new Date('2024-02-22T15:00:00'),
  },
  {
    id: 'notif-3',
    title: 'New Report Submitted',
    message: 'Damaged road surface reported on Highway 101',
    type: 'new_report',
    reportId: '6',
    isRead: true,
    timestamp: new Date('2024-02-22T13:20:00'),
  },
];

export const getDepartmentById = (id: string) => {
  return mockDepartments.find(dept => dept.id === id);
};

export const getStaffById = (id: string) => {
  return mockStaff.find(staff => staff.id === id);
};

export const getStaffByDepartment = (departmentId: string) => {
  return mockStaff.filter(staff => staff.departmentId === departmentId);
};

export const getAuditLogsByReport = (reportId: string) => {
  return mockAuditLogs.filter(log => log.reportId === reportId);
};

export const getCommentsByReport = (reportId: string) => {
  return mockComments.filter(comment => comment.reportId === reportId);
};

export const getUnreadNotifications = () => {
  return mockNotifications.filter(notif => !notif.isRead);
};
