# Civic Issue Reporting Platform

A modern, responsive web application for reporting and tracking civic issues in your community.

## Features

### 🏠 Civilian Dashboard
- **Real-time Statistics**: View total reports, resolved issues, in-progress work, and pending requests
- **My Reports Section**: Track all your submitted reports categorized by status (Resolved, In Progress, Pending)
- **Interactive Map View**: Visualize all civic issues with color-coded markers based on priority and status

### 📝 Report Management

#### Submit New Reports
- Upload images of civic issues
- Add title and detailed description
- Select category (potholes, streetlight, drainage, garbage, water supply, road damage, park maintenance)
- Auto-capture or manually enter location
- Duplicate detection to prevent redundant reports

#### Track Report Progress
- **Pending Reports**: See estimated review completion time
- **In Progress Reports**: View progress updates, photos, and predicted completion dates
- **Resolved Reports**: 
  - View before/after images
  - Access transparent financial data (sanctioned amount, used amount, savings)
  - See detailed usage breakdown

### 🗺️ Interactive Map
- Color-coded markers for easy visualization:
  - 🔴 Red: High priority (10+ complaints)
  - 🟡 Yellow: Medium priority (5-9 complaints)
  - 🔵 Blue: Low priority (<5 complaints)
  - 🟢 Green: Work in progress
- Click markers to view full report details
- Zoom controls for better navigation
- Real-time complaint count display

### 🔐 User Authentication
- Secure login/signup interface
- User profile management
- Session persistence

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)
- **State Management**: React Hooks

## Getting Started

1. **Login/Signup**: Create an account or login to access the dashboard
2. **View Dashboard**: See your report statistics and overview
3. **Report an Issue**: Click "Report New Issue" to submit a civic problem
4. **Track Progress**: Monitor your reports in the "My Reports" tab
5. **Explore Map**: Use the "Map View" to see all community issues

## Key Components

- **CivilianDashboard**: Main dashboard with tabs and statistics
- **MyReports**: Displays user's submitted reports with filtering
- **ReportForm**: Form for submitting new civic issues with duplicate detection
- **MapView**: Interactive SVG map with color-coded markers
- **ReportDetailsModal**: Detailed view of individual reports with status-specific information
- **DashboardStats**: Overview cards showing report metrics

## Features in Detail

### Duplicate Detection
When submitting a report, the system checks for similar existing reports based on title and location. If a match is found:
- User is shown the existing report details
- Option to confirm if it's the same issue
- If confirmed, the complaint count is incremented
- If not, a new report is created

### Financial Transparency
For resolved issues, users can view:
- Total sanctioned amount
- Amount actually used
- Cost savings
- Detailed breakdown of expenses

### Progress Tracking
Reports show different information based on status:
- **Pending**: Waiting for review, estimated start time
- **In Progress**: Active work with photos and updates
- **Resolved**: Completion details and financial transparency

## Design Principles

- **Clean & Modern**: Professional UI with intuitive navigation
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: WCAG compliant with proper ARIA labels
- **User-Friendly**: Clear visual hierarchy and easy-to-use controls
- **Transparent**: Open data about civic work and finances

## Future Enhancements

- Real-time notifications for report status changes
- Integration with actual mapping APIs (Google Maps, Mapbox)
- Mobile app version
- Push notifications
- Photo comparison slider for before/after images
- Advanced filtering and search
- Report sharing and social features
- Multi-language support

---

**Making our communities better, one report at a time.** 🏙️
