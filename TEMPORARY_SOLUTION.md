# Temporary Solution: Bypass Email Confirmation

## Current Problem

- Supabase SMTP configuration is not working
- Getting "Error sending confirmation email" or "fetch failed" errors
- Users cannot sign up because email confirmation fails

## Immediate Solution

Let me temporarily modify the signup to bypass email confirmation so users can sign up while you fix the SMTP configuration.

## Steps to Fix SMTP in Supabase Dashboard

### Option 1: Use Supabase Default Email (Recommended)

1. Go to: `https://supabase.com/dashboard/project/khidnpzqnfvmhexierlo`
2. Navigate to: **Authentication** → **Settings** → **SMTP Settings**
3. **Turn OFF "Enable custom SMTP"** (disable custom SMTP)
4. Save settings
5. This will use Supabase's default email service

### Option 2: Fix Mailgun SMTP Configuration

If you want to use Mailgun SMTP:

1. Go to: **Authentication** → **Settings** → **SMTP Settings**
2. **Turn ON "Enable custom SMTP"**
3. Configure with these settings:
   ```
   SMTP Host: smtp.mailgun.org
   SMTP Port: 587
   SMTP User: postmaster@sandboxe4a5db84fd9640c0994118da4250161b.mailgun.org
   SMTP Password: [Your Mailgun SMTP password]
   SMTP Admin Email: osfs@sandboxe4a5db84fd9640c0994118da4250161b.mailgun.org
   SMTP Sender Name: OSFS Formation
   ```
4. Click "Test SMTP Connection"
5. Save if test passes

## After Fixing SMTP

Once SMTP is working, the flow will be:

1. User signs up → Receives confirmation email
2. User clicks email → Account confirmed
3. Database trigger creates profile with `is_approved: false`
4. User appears in admin pending approval
5. Admin approves → Welcome email via Omnisend

## Current Temporary Workaround

I can modify the signup to bypass email confirmation temporarily so users can sign up immediately while you fix the SMTP configuration.
