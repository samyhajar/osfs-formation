import { createClient } from '@/lib/supabase/server-client';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSiteUrl } from '@/lib/utils/urls';

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
    console.log('🔍 [SIGNUP DEBUG] Starting signup process for:', email);
    console.log('🔍 [SIGNUP DEBUG] Email redirect URL:', getSiteUrl(`/${locale}/auth/callback`));
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // NO emailRedirectTo - this prevents Supabase from sending emails
        data: {
          name,
          role, // This will be used by the handle_new_user trigger
        },
      },
    });
    
    console.log('🔍 [SIGNUP DEBUG] Supabase signup response:', { 
      hasUser: !!data?.user, 
      hasError: !!error,
      errorMessage: error?.message 
    });

    // Auto-confirm the user's email so they can login immediately
    if (data.user && !error) {
      console.log('🔍 [SIGNUP DEBUG] Auto-confirming user email for:', data.user.id);
      const supabaseAdmin = createAdminClient();
      const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
        email_confirm: true,
      });
      
      if (confirmError) {
        console.error('❌ [SIGNUP DEBUG] Error auto-confirming user email:', confirmError);
      } else {
        console.log('✅ [SIGNUP DEBUG] User email auto-confirmed successfully');
      }
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // No email sent during signup - emails only sent when admin approves
    console.log('📧 [SIGNUP DEBUG] NO EMAIL SENT - User must wait for admin approval');
    console.log(`✅ [SIGNUP DEBUG] User ${email} signed up successfully, awaiting admin approval`);

    return NextResponse.json(
      {
        message:
          'Signup successful. Your account is pending admin approval.',
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
