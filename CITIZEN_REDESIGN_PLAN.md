# 🚀 Citizen Portal Redesign - Implementation Plan

## Phase 1: Core Components Migration (Priority)

### 1. Enhanced Report Form
**Reference:** `ReportForm.tsx`
**Target:** `apps/citizen/app/report/page.tsx`
**Features to Add:**
- Photo preview with multiple images support
- Enhanced location picker
- Category icons
- Form validation
- Progress indicators

### 2. Dashboard Components
**Reference Files:**
- `CivilianDashboard.tsx`
- `DashboardStats.tsx`
- `MyReports.tsx`
- `ReportCard.tsx`

**Target:** `apps/citizen/app/dashboard/`
**Features to Add:**
- Tab navigation (Dashboard | My Reports | Map View)
- Enhanced statistics with charts
- Report cards with status indicators
- Search and filter functionality

### 3. Report Details Modal
**Reference:** `ReportDetailsModal.tsx`
**Target:** `apps/citizen/app/dashboard/IssueDetailModal.tsx`
**Features to Add:**
- Enhanced layout with better typography
- Timeline view
- Feedback button
- Share functionality
- Print option

### 4. Map View
**Reference:** `MapView.tsx`
**Target:** NEW `apps/citizen/app/components/MapView.tsx`
**Features:**
- Interactive SVG map with markers
- Color-coded by priority (red/yellow/blue/green)
- Click to view issue details
- Filter by status

### 5. Notifications & Profile
**Reference:**
- `NotificationsPage.tsx`
- `ProfilePage.tsx`
- `SettingsPage.tsx`

**Target:** NEW pages in `apps/citizen/app/`

## Phase 2: UI Components Setup

### Copy shadcn/ui components from reference:
✅ Already have most components
🔄 Need to verify: accordion, carousel, chart, sidebar

## Phase 3: Context & State Management

### Language Context
**Reference:** `LanguageContext.tsx`
**Features:**
- Multi-language support
- Translation system
- Language switcher

## Implementation Strategy

### Step 1: Setup Base Structure ✓
- Copy UI components
- Setup contexts
- Create utility functions

### Step 2: Integrate Report Form
- Add multiple image upload
- Enhanced validation
- Better UX

### Step 3: Dashboard Redesign
- Tab navigation
- Enhanced stats
- Map view integration

### Step 4: Details & Modals
- Enhanced report details
- Feedback modal
- Help modal

### Step 5: Additional Pages
- Notifications
- Profile
- Settings

## File Mapping

```
Reference → Target

Components:
- CivilianDashboard.tsx → apps/citizen/app/dashboard/page.tsx
- ReportForm.tsx → apps/citizen/app/report/page.tsx
- MapView.tsx → apps/citizen/app/components/MapView.tsx
- MyReports.tsx → apps/citizen/app/components/MyReports.tsx
- ReportCard.tsx → apps/citizen/app/components/ReportCard.tsx
- DashboardStats.tsx → apps/citizen/app/components/DashboardStats.tsx (✓ Done)
- NotificationsPage.tsx → apps/citizen/app/notifications/page.tsx
- ProfilePage.tsx → apps/citizen/app/profile/page.tsx
- SettingsPage.tsx → apps/citizen/app/settings/page.tsx

UI Components:
- ui/* → apps/citizen/app/components/ui/* (most exist)

Contexts:
- LanguageContext.tsx → apps/citizen/app/contexts/LanguageContext.tsx

Types:
- report.ts → packages/lib/types.ts (merge)

Utils:
- date.ts → apps/citizen/app/utils/date.ts
```

## Next Actions

1. ✅ Run database migration
2. 🔄 Integrate enhanced ReportForm
3. 🔄 Add MapView component
4. 🔄 Update Dashboard with tabs
5. 🔄 Add Notifications page
6. 🔄 Add Profile page
7. 🔄 Setup Language context

Let's start! 🚀
