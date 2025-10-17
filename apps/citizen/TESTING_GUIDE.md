# 🧪 Testing Guide - Edit & Withdraw Features

## Quick Test Checklist

### ✅ Test 1: View Issue as Guest (Not Logged In)

1. **Log out** if you're currently logged in
2. Navigate to any issue detail page: `http://localhost:3001/issues/{issue-id}`
3. **Expected behavior:**
   - ✅ Can see all issue details
   - ✅ Can see images, location, description
   - ✅ Yellow banner: "Sign in to add comments"
   - ❌ No Edit button visible
   - ❌ No Withdraw button visible
   - ❌ No green "You are the reporter" banner

---

### ✅ Test 2: View Your Own Issue (Logged In as Owner)

1. **Log in** to your account
2. Go to **Dashboard**: `http://localhost:3001/dashboard`
3. Click **"View Details"** on one of YOUR issues
4. **Expected behavior:**
   - ✅ Can see all issue details
   - ✅ Green banner: "👤 You are the reporter of this issue"
   - ✅ **Edit button** visible (with pencil icon) - IF status is "Pending"
   - ✅ **Withdraw button** visible (with trash icon, red text)
   - ✅ Comments section visible

---

### ✅ Test 3: Edit an Issue (Owner, Pending Status)

**Prerequisites:** Issue must have status "Pending"

1. On your issue detail page, click **"Edit"** button
2. **Expected behavior:**
   - ✅ Dialog opens with form
   - ✅ Title pre-filled with current value
   - ✅ Category pre-filled with current value
   - ✅ Description pre-filled with current value
   - ✅ Character counters showing

3. **Make changes:**
   - Change title (e.g., add "Updated:" prefix)
   - Change category to different option
   - Modify description (e.g., add "Additional info:")

4. **Try invalid data:**
   - Clear title → Click "Save Changes"
   - ✅ Should show error: "Title must be at least 10 characters"
   - Clear description → Click "Save Changes"
   - ✅ Should show error: "Description must be at least 20 characters"

5. **Save valid changes:**
   - Enter valid title (10+ chars)
   - Enter valid description (20+ chars)
   - Click "Save Changes"
   - **Expected:**
     - ✅ Toast: "Issue updated successfully! 🎉"
     - ✅ Dialog closes
     - ✅ Page refreshes automatically
     - ✅ New values displayed on page

---

### ✅ Test 4: Edit Button Hidden (Non-Pending Status)

**If you have an issue with status "In Progress" or "Resolved":**

1. Navigate to that issue detail page
2. **Expected behavior:**
   - ❌ Edit button NOT visible
   - ✅ Withdraw button still visible
   - ℹ️ This is by design - can only edit pending issues

**To test this:**
- You may need to manually change an issue's status in Supabase dashboard
- Or wait for admin to change status

---

### ✅ Test 5: Withdraw an Issue (Owner)

**⚠️ WARNING: This permanently deletes the issue!**

1. On your issue detail page, click **"Withdraw"** button (red)
2. **Expected behavior:**
   - ✅ Confirmation dialog appears
   - ✅ Warning message about permanent deletion
   - ✅ Two buttons: "Cancel" and "Yes, Withdraw"

3. **Test Cancel:**
   - Click "Cancel"
   - ✅ Dialog closes
   - ✅ Issue still exists
   - ✅ Page unchanged

4. **Test Withdraw:**
   - Click "Withdraw" button again
   - Click "Yes, Withdraw"
   - **Expected:**
     - ✅ Toast: "Issue withdrawn successfully"
     - ✅ Redirected to dashboard
     - ✅ Issue no longer in dashboard list
     - ✅ Issue detail page shows 404 if revisited

---

### ✅ Test 6: View Someone Else's Issue (Logged In, Not Owner)

**Prerequisites:** Find an issue ID that belongs to another user

1. Navigate to that issue: `http://localhost:3001/issues/{other-user-issue-id}`
2. **Expected behavior:**
   - ✅ Can see all issue details
   - ✅ Comments section visible
   - ❌ No Edit button
   - ❌ No Withdraw button
   - ❌ No green "You are the reporter" banner
   - ✅ Can add comments

---

### ✅ Test 7: Responsive Design

**Test on different screen sizes:**

1. **Desktop (1920x1080):**
   - ✅ Edit dialog displays nicely (centered, max-w-2xl)
   - ✅ Buttons side-by-side in header

2. **Tablet (768x1024):**
   - ✅ Edit dialog adjusts width
   - ✅ Form fields stack properly

3. **Mobile (375x667):**
   - ✅ Edit dialog full-width with padding
   - ✅ Buttons may stack vertically
   - ✅ All text readable

**How to test:**
- Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
- Try different device presets

---

### ✅ Test 8: Error Handling

**Test Network Errors:**

1. Open Chrome DevTools → Network tab
2. Enable "Offline" mode
3. Try to edit and save an issue
4. **Expected:**
   - ✅ Error toast appears
   - ✅ Dialog stays open
   - ✅ Can try again when back online

**Test Database Errors:**

1. Temporarily break Supabase connection (wrong API key in .env.local)
2. Try to edit/withdraw
3. **Expected:**
   - ✅ Error toast with message
   - ✅ No crash or white screen

---

## 🎯 Success Criteria

All tests should pass:
- ✅ Non-owners cannot see edit/withdraw buttons
- ✅ Owners can edit pending issues
- ✅ Owners can withdraw any issue
- ✅ Validation prevents invalid data
- ✅ Changes persist after page refresh
- ✅ Withdrawal redirects to dashboard
- ✅ Toast notifications appear correctly
- ✅ Responsive on all screen sizes
- ✅ Error handling works gracefully

---

## 🐛 Known Issues / Limitations

1. **Cannot edit location or image**
   - By design - withdraw and recreate if needed

2. **Edit only available for pending issues**
   - By design - prevents changing in-progress work

3. **Withdraw is permanent**
   - No undo or archive feature (yet)

4. **No edit history**
   - Cannot see what changed (future enhancement)

---

## 📸 Screenshots to Take (Optional)

For documentation:
1. Issue detail page (owner view) - showing Edit/Withdraw buttons
2. Edit dialog - with form filled
3. Withdraw confirmation dialog
4. Green owner banner
5. Yellow guest banner
6. Mobile view

---

## ✅ Final Checklist

Before marking as complete:
- [ ] All 8 tests pass
- [ ] No console errors in browser
- [ ] No TypeScript errors in VS Code
- [ ] Server running without errors
- [ ] All UI components render correctly
- [ ] Toast notifications work
- [ ] Database operations succeed
- [ ] Page refreshes properly after edits
- [ ] Redirects work after withdrawal

---

## 🎉 You're Done!

If all tests pass, the feature is working correctly! 

**Next steps:**
- Document any issues found
- Create user-facing documentation
- Train users on new features
- Monitor for bugs in production

---

## 🆘 Troubleshooting

### Edit button not showing:
- Check: Are you logged in?
- Check: Is this your issue?
- Check: Is status "Pending"?

### Withdraw not working:
- Check: Are you the issue owner?
- Check: Database RLS policies allow deletion
- Check: Network connection is working

### Changes not saving:
- Check: Supabase credentials in .env.local
- Check: Network tab for failed requests
- Check: Browser console for errors

### TypeScript errors:
- Run: `npm install` in apps/citizen
- Restart: TypeScript server in VS Code
- Check: All imports are correct

---

**Happy Testing! 🧪✨**
