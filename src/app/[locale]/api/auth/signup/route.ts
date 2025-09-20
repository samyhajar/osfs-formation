import { createClient } from '@/lib/supabase/server-client';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSiteUrl } from '@/lib/utils/urls';
import { emailService } from '@/lib/omnisend/email-service';

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'editor', 'user']).default('user'),
});

export async function POST(request: NextRequest) {
  try {
    const requestData: unknown = await request.json();

    // Validate the request data
    const validatedData = signupSchema.parse(requestData);
    const { email, password, name, role } = validatedData;

    // Extract locale from the request URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const locale = pathSegments[0] || 'en';

    // Create a Supabase client (server-side)
    const supabase = await createClient();

    // Sign up the user with role in metadata and auto-confirm email
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getSiteUrl(`/${locale}/auth/callback`),
        data: {
          name,
          role, // This will be used by the handle_new_user trigger
        },
      },
    });

    // Auto-confirm the user's email so they can login immediately
    if (data.user && !error) {
      const supabaseAdmin = createAdminClient();
      const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
        email_confirm: true,
      });
      
      if (confirmError) {
        console.error('Error auto-confirming user email:', confirmError);
      }
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send confirmation email through Omnisend
    try {
      const confirmationUrl = getSiteUrl(`/${locale}/auth/callback`);
      await emailService.sendApprovalEmail(email, name, confirmationUrl);
      
      console.log(`Confirmation email sent via Omnisend to ${email}`);
    } catch (emailError) {
      console.error('Error sending confirmation email via Omnisend:', emailError);
      // Don't fail the signup if email fails, but log the error
    }

    return NextResponse.json(
      {
        message:
          'Signup successful. Please check your email to confirm your account.',
        user: data.user,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup' },
      { status: 500 },
    );
  }
}
