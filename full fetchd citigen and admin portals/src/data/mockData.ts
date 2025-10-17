import { Report } from '../types/report';

export const CURRENT_USER = 'John Doe';

export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    description: 'Deep pothole causing traffic disruption near the central market.',
    category: 'potholes',
    status: 'resolved',
    priority: 'high',
    location: {
      address: '123 Main Street, Downtown',
      lat: 40.7128,
      lng: -74.0060,
    },
    submittedBy: 'John Doe',
    submittedByEmail: 'john.doe@email.com',
    submittedAt: new Date('2024-01-15T10:30:00'),
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
    complaintCount: 15,
    assignedTo: 'staff-1',
    assignedToName: 'Mike Thompson',
    assignedToDepartment: 'dept-1',
    assignedDepartmentName: 'Road & Infrastructure',
    assignedAt: new Date('2024-01-16T09:00:00'),
    completedAt: new Date('2024-02-01T14:00:00'),
    completionImage: 'https://images.unsplash.com/photo-1621544402532-7a4f28222a07?w=400',
    financialData: {
      sanctionedAmount: 5000,
      usedAmount: 4800,
      usageDetails: 'Materials: $3000, Labor: $1500, Equipment: $300',
    },
    lastUpdatedBy: 'Admin Officer',
    lastUpdatedAt: new Date('2024-02-01T14:00:00'),
  },
  {
    id: '2',
    title: 'Broken streetlight near park',
    description: 'Streetlight not working, creating safety concerns at night.',
    category: 'streetlight',
    status: 'in-progress',
    priority: 'medium',
    location: {
      address: '456 Park Avenue, Greenfield',
      lat: 40.7580,
      lng: -73.9855,
    },
    submittedBy: 'John Doe',
    submittedByEmail: 'john.doe@email.com',
    submittedAt: new Date('2024-02-10T08:15:00'),
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
    complaintCount: 8,
    assignedTo: 'staff-3',
    assignedToName: 'David Martinez',
    assignedToDepartment: 'dept-3',
    assignedDepartmentName: 'Public Utilities',
    assignedAt: new Date('2024-02-11T10:00:00'),
    progressDetails: 'Electrician assigned. Parts ordered and expected to arrive by end of week.',
    progressImages: [
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400',
    ],
    predictedCompletion: new Date('2024-03-05T17:00:00'),
    estimatedStartDate: new Date('2024-02-15T09:00:00'),
    lastUpdatedBy: 'Admin Officer',
    lastUpdatedAt: new Date('2024-02-12T11:00:00'),
  },
  {
    id: '3',
    title: 'Clogged drainage system',
    description: 'Water overflow during rain due to blocked drainage.',
    category: 'drainage',
    status: 'pending',
    priority: 'medium',
    location: {
      address: '789 River Road, Westside',
      lat: 40.7489,
      lng: -73.9680,
    },
    submittedBy: 'John Doe',
    submittedByEmail: 'john.doe@email.com',
    submittedAt: new Date('2024-02-20T16:45:00'),
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    complaintCount: 3,
    predictedCompletion: new Date('2024-03-15T12:00:00'),
  },
  {
    id: '4',
    title: 'Overflowing garbage bins',
    description: 'Multiple garbage bins overflowing near residential area.',
    category: 'garbage',
    status: 'resolved',
    priority: 'high',
    location: {
      address: '321 Oak Street, Hillside',
      lat: 40.7614,
      lng: -73.9776,
    },
    submittedBy: 'Jane Smith',
    submittedByEmail: 'jane.smith@email.com',
    submittedAt: new Date('2024-01-20T11:00:00'),
    image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400',
    complaintCount: 12,
    assignedTo: 'staff-2',
    assignedToName: 'Emily Chen',
    assignedToDepartment: 'dept-2',
    assignedDepartmentName: 'Sanitation & Waste Management',
    assignedAt: new Date('2024-01-20T14:00:00'),
    completedAt: new Date('2024-01-22T09:00:00'),
    completionImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    financialData: {
      sanctionedAmount: 1500,
      usedAmount: 1400,
      usageDetails: 'Additional bins: $1000, Collection service: $400',
    },
    lastUpdatedBy: 'Admin Officer',
    lastUpdatedAt: new Date('2024-01-22T09:00:00'),
  },
  {
    id: '5',
    title: 'Water supply interruption',
    description: 'No water supply for past 48 hours in the area.',
    category: 'water-supply',
    status: 'in-progress',
    priority: 'critical',
    location: {
      address: '555 Lake View, Northside',
      lat: 40.7282,
      lng: -74.0776,
    },
    submittedBy: 'Mike Johnson',
    submittedByEmail: 'mike.johnson@email.com',
    submittedAt: new Date('2024-02-18T07:30:00'),
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
    complaintCount: 25,
    assignedTo: 'staff-3',
    assignedToName: 'David Martinez',
    assignedToDepartment: 'dept-3',
    assignedDepartmentName: 'Public Utilities',
    assignedAt: new Date('2024-02-18T09:00:00'),
    progressDetails: 'Main pipeline repair underway. Temporary tankers deployed.',
    progressImages: [
      'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400',
    ],
    predictedCompletion: new Date('2024-02-28T18:00:00'),
    estimatedStartDate: new Date('2024-02-18T10:00:00'),
    adminNotes: 'High priority - multiple complaints. Ensure daily updates to affected residents.',
    lastUpdatedBy: 'Admin Officer',
    lastUpdatedAt: new Date('2024-02-20T15:00:00'),
  },
  {
    id: '6',
    title: 'Damaged road surface',
    description: 'Multiple cracks and uneven surface on highway.',
    category: 'road-damage',
    status: 'pending',
    priority: 'medium',
    location: {
      address: 'Highway 101, Mile 23',
      lat: 40.7389,
      lng: -73.9897,
    },
    submittedBy: 'Sarah Williams',
    submittedByEmail: 'sarah.williams@email.com',
    submittedAt: new Date('2024-02-22T13:20:00'),
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
    complaintCount: 7,
    predictedCompletion: new Date('2024-03-20T10:00:00'),
  },
];

export const getReportsByStatus = (status: 'resolved' | 'in-progress' | 'pending', userId: string = CURRENT_USER) => {
  return mockReports.filter(report => report.status === status && report.submittedBy === userId);
};

export const getAllUserReports = (userId: string = CURRENT_USER) => {
  return mockReports.filter(report => report.submittedBy === userId);
};

export const getAllReports = () => {
  return mockReports;
};

export const findSimilarReport = (title: string, location: string): Report | null => {
  // Simple similarity check - in real app, use more sophisticated matching
  const lowerTitle = title.toLowerCase();
  const lowerLocation = location.toLowerCase();
  
  const similar = mockReports.find(report => {
    const titleMatch = report.title.toLowerCase().includes(lowerTitle.slice(0, 10)) || 
                      lowerTitle.includes(report.title.toLowerCase().slice(0, 10));
    const locationMatch = report.location.address.toLowerCase().includes(lowerLocation.slice(0, 15)) ||
                         lowerLocation.includes(report.location.address.toLowerCase().slice(0, 15));
    return titleMatch && locationMatch;
  });
  
  return similar || null;
};
