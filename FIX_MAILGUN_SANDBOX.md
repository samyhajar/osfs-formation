# Fix Mailgun Sandbox Account Issue

## Problem Identified
From the Supabase logs, the exact error is:
```
421 Domain sandboxe4a5db84fd9640c0994118da4250161b.mailgun.org is not allowed to send: 
Free accounts are for test purposes only. Please upgrade or add the address to your authorized recipients.
```

## The Issue
- Your Mailgun account is a **sandbox account** (free tier)
- Sandbox accounts can only send emails to **authorized recipients**
- The recipient email (`samyhajartest@gmail.com`) is not in your authorized recipients list

## Solutions

### Option 1: Add Authorized Recipients (Quick Fix)
1. Go to your Mailgun dashboard: `https://app.mailgun.com/`
2. Navigate to **Sending** → **Authorized Recipients**
3. Add the email address you want to test with: `samyhajartest@gmail.com`
4. Verify the email when prompted
5. Test signup again

### Option 2: Use Supabase Default Email Service (Recommended)
Instead of using Mailgun SMTP, use Supabase's default email service:

1. Go to Supabase Dashboard: `https://supabase.com/dashboard/project/khidnpzqnfvmhexierlo`
2. Navigate to **Authentication** → **Settings** → **SMTP Settings**
3. **Turn OFF "Enable custom SMTP"** (disable custom SMTP)
4. Save settings
5. This will use Supabase's default email service (no rate limits, no sandbox restrictions)

### Option 3: Upgrade Mailgun Account
1. Go to Mailgun dashboard
2. Upgrade to a paid plan
3. This removes the sandbox restrictions
4. You can send to any email address

## Recommended Solution
**Use Option 2** (Supabase default email service):
- No configuration needed
- No rate limits
- No sandbox restrictions
- Works immediately
- You can still use Mailgun for admin approval emails via Omnisend

## Current Temporary Fix
I've already modified the signup to bypass email confirmation temporarily so users can sign up while you fix this.

## After Fixing
Once you fix the email configuration, revert the signup back to use email confirmation:
1. Users sign up → Receive confirmation email
2. User clicks email → Account confirmed  
3. Database trigger creates profile with `is_approved: false`
4. User appears in admin pending approval
5. Admin approves → Welcome email via Omnisend

## Test Steps
1. Fix the email configuration (Option 1 or 2 above)
2. Test signup with the authorized email address
3. Check if confirmation email arrives
4. Verify user appears in pending approval after email confirmation
