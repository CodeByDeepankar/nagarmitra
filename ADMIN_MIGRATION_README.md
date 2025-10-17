# Admin Dashboard Database Migration

## Issue
The admin dashboard update functionality is failing because the database is missing the required columns for admin management features.

## Solution
Run the SQL migration to add all necessary columns for the admin dashboard.

## Steps to Fix

### 1. Open Supabase SQL Editor
- Go to your Supabase project dashboard
- Navigate to **SQL Editor** from the left sidebar

### 2. Run the Migration
- Copy the contents of `supabase-migrations-admin-fields.sql`
- Paste it into the SQL Editor
- Click **Run** to execute the migration

### 3. Verify the Migration
After running the migration, your `issues` table should have these additional columns:

#### Admin Management Fields:
- ✅ `priority` - Priority level (low, medium, high)
- ✅ `complaint_count` - Number of similar complaints
- ✅ `sanctioned_amount` - Budget allocated for fixing the issue
- ✅ `used_amount` - Amount spent so far
- ✅ `amount_breakdown` - Detailed breakdown of expenses
- ✅ `estimated_start_date` - Planned start date
- ✅ `estimated_completion_date` - Expected completion date
- ✅ `actual_completion_date` - Actual completion date
- ✅ `assigned_to` - Admin/department assigned to the issue
- ✅ `department` - Responsible department
- ✅ `rejection_reason` - Reason if issue is rejected
- ✅ `progress_notes` - Detailed progress updates

#### Updated Status:
- Status constraint updated to include 'Rejected' status

#### RLS Policies:
- Admins can now view and update all issues
- Users can still view their own issues

## Testing
After running the migration:
1. Restart your dev server
2. Open the admin dashboard (http://localhost:3002)
3. Click the Eye icon on any issue
4. Click "Update Report Progress"
5. Fill in the form and click "Save Changes"
6. You should see "Issue updated successfully!" message

## Note
The `is_admin()` function currently returns `true` for all authenticated users for testing purposes. In production, you should implement proper admin role checking based on your authentication setup.
