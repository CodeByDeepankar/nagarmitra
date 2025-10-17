# 🎯 Issue Detail Page - View, Edit & Withdraw Feature

## ✨ New Features Added

### 1. **Public Issue Viewing** 
- ✅ Anyone can now view issue details (no login required)
- ✅ Only the issue owner sees edit/withdraw options
- ✅ Non-logged-in users see a prompt to sign in for commenting

### 2. **Edit Issue** (Owner Only)
- ✅ Edit button appears for issue owners on **Pending** issues
- ✅ Opens a dialog with a form to edit:
  - Title (min 10 characters)
  - Category (dropdown with emojis)
  - Description (min 20 characters)
- ✅ Real-time character counters
- ⚠️ Cannot edit: location, image, or status
- ✅ Changes saved to database and page auto-refreshes

### 3. **Withdraw Issue** (Owner Only)
- ✅ Withdraw button always visible to owner
- ✅ Confirmation dialog before deletion
- ✅ Permanently deletes the issue and all comments
- ✅ Redirects to dashboard after withdrawal
- ⚠️ Action cannot be undone

---

## 🎨 UI Components Used

All components are from the existing shadcn/ui library:

- **Dialog** - For edit form modal
- **AlertDialog** - For withdraw confirmation
- **Input** - For title field
- **Textarea** - For description field
- **Select** - For category dropdown
- **Label** - For form labels
- **Button** - For all actions
- **Icons** - Pencil (edit), Trash2 (withdraw) from lucide-react

---

## 📁 Files Modified/Created

### Created:
- `apps/citizen/app/issues/[id]/IssueActions.tsx` - Edit & withdraw functionality

### Modified:
- `apps/citizen/app/issues/[id]/page.tsx` - Made public, added owner checks, integrated actions

---

## 🔐 Security & Permissions

### What Anyone Can Do:
- ✅ View any issue detail page
- ✅ See all issue information (title, description, images, location, status)
- ✅ Read comments (if logged in)

### What Only the Owner Can Do:
- ✅ See Edit and Withdraw buttons
- ✅ Edit issue details (if status is "Pending")
- ✅ Withdraw (delete) the issue at any time

### Backend Security:
- ✅ Supabase RLS (Row Level Security) policies enforce:
  - Only owners can update their issues
  - Only owners can delete their issues
- ✅ Frontend checks are for UX only - backend enforces security

---

## 🎬 User Flow

### For Issue Owners:

**Viewing Own Issue:**
1. Navigate to issue detail page
2. See green banner: "👤 You are the reporter of this issue"
3. See Edit and Withdraw buttons in the header

**Editing an Issue:**
1. Click "Edit" button (only visible for pending issues)
2. Dialog opens with current values pre-filled
3. Modify title, category, and/or description
4. Click "Save Changes"
5. Page refreshes with updated information
6. Toast notification confirms success

**Withdrawing an Issue:**
1. Click "Withdraw" button (red, with trash icon)
2. Confirmation dialog appears with warning
3. Click "Yes, Withdraw" to confirm
4. Issue is permanently deleted
5. Redirected to dashboard
6. Toast notification confirms withdrawal

### For Other Users (Not Logged In):

1. Navigate to any issue detail page
2. View all issue information
3. Cannot see edit/withdraw buttons
4. See yellow banner: "Sign in to add comments"
5. Click "Sign In" button to go to login page

### For Logged-In Users (Not Owner):

1. Navigate to any issue detail page
2. View all issue information
3. Cannot see edit/withdraw buttons
4. Can view and add comments
5. No owner banner visible

---

## ⚡ Technical Details

### Component Architecture:

```
page.tsx (Server Component)
├─ Fetches issue data
├─ Gets current user (no redirect if not logged in)
├─ Checks if user is owner
└─ Renders:
   ├─ IssueActions.tsx (Client Component - only if owner)
   │  ├─ Edit Dialog
   │  └─ Withdraw Alert Dialog
   └─ CommentsSection.tsx (only if user logged in)
```

### State Management:
- **Edit Dialog**: Local state for form data
- **Withdraw Dialog**: Simple open/closed state
- **Loading States**: Prevents double-submission during API calls

### Database Operations:

**Edit Issue:**
```typescript
await supabase
  .from("issues")
  .update({
    title: formData.title,
    description: formData.description,
    category: formData.category,
  })
  .eq("id", issue.id);
```

**Withdraw Issue:**
```typescript
await supabase
  .from("issues")
  .delete()
  .eq("id", issue.id);
```

---

## 🎨 Styling Details

### Edit Button:
- Ghost variant (transparent background)
- Pencil icon from lucide-react
- Hover effect (light background)

### Withdraw Button:
- Ghost variant with red text
- Trash2 icon from lucide-react
- Red hover effect (bg-red-50)

### Owner Banner:
- Green background (bg-green-50)
- Green border (border-green-200)
- User emoji (👤) for visual identification

### Guest Banner (Not Logged In):
- Yellow background (bg-yellow-50)
- Yellow border (border-yellow-200)
- Call-to-action "Sign In" button

---

## ✅ Validation Rules

### Edit Form Validation:

**Title:**
- Required field
- Minimum 10 characters
- Maximum 100 characters
- Shows character counter

**Description:**
- Required field
- Minimum 20 characters
- Maximum 1000 characters
- Shows character counter

**Category:**
- Required field
- Dropdown selection
- Options: Pothole, Streetlight, Garbage, Drainage, Road, Water, Other

### Edit Restrictions:
- ⚠️ Can only edit if issue status is "Pending"
- ⚠️ Cannot edit location or image
- ⚠️ If need to change these, must withdraw and create new issue

---

## 🐛 Error Handling

### Edit Errors:
- Toast notification for validation errors
- Toast notification for API errors
- Loading spinner during save
- Dialog remains open if error occurs

### Withdraw Errors:
- Toast notification for API errors
- Confirmation dialog prevents accidental deletion
- Clear warning about permanent deletion

---

## 🎉 Success Messages

- **Edit Success**: "Issue updated successfully! 🎉"
- **Withdraw Success**: "Issue withdrawn successfully"
- **Location Captured**: (from report form) "Location captured successfully!"

---

## 📱 Responsive Design

- ✅ Edit dialog is responsive (max-w-2xl)
- ✅ Works on mobile, tablet, and desktop
- ✅ Buttons stack properly on small screens
- ✅ Form fields adjust to screen size

---

## 🔄 Future Enhancements (Optional)

Consider adding:
- [ ] Edit history/audit log
- [ ] Reason field for withdrawal
- [ ] Email notification to owner on status change
- [ ] Ability to reopen withdrawn issues
- [ ] Image replacement during edit
- [ ] Location update during edit

---

## 🆘 Troubleshooting

### Issue: Edit button not showing
**Solution**: Check that:
1. You are logged in
2. You are the issue owner
3. Issue status is "Pending"

### Issue: Withdraw not working
**Solution**: Check that:
1. You are logged in
2. You are the issue owner
3. Supabase RLS policies allow deletion

### Issue: Changes not reflecting
**Solution**: 
1. Wait for page to refresh (automatic)
2. Hard refresh browser if needed (Ctrl+Shift+R)

### Issue: TypeScript errors
**Solution**: 
1. Restart TypeScript server
2. Check all imports are correct
3. Run `npm install` if needed

---

## ✨ Summary

The issue detail page now provides:
- 🌍 **Public access** to view issues
- ✏️ **Edit capability** for owners (pending issues)
- 🗑️ **Withdraw option** for owners (any time)
- 🔒 **Smart permissions** based on ownership
- 🎨 **Beautiful UI** with existing components
- ✅ **Full validation** and error handling

**User Experience**: Clean, intuitive, and secure! 🎉
