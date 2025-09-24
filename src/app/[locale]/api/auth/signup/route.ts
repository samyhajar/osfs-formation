import { createClient } from '@/lib/supabase/server-client';
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
    console.log('🔍 [SIGNUP DEBUG] Starting signup process...');

    const requestData: unknown = await request.json();
    console.log('🔍 [SIGNUP DEBUG] Request data received:', {
      email: (requestData as Record<string, unknown>)?.email,
      hasPassword: !!(requestData as Record<string, unknown>)?.password,
      name: (requestData as Record<string, unknown>)?.name,
      role: (requestData as Record<string, unknown>)?.role,
    });

    // Validate the request data
    const validatedData = signupSchema.parse(requestData);
    const { email, password, name, role } = validatedData;
    console.log('✅ [SIGNUP DEBUG] Data validation passed');

    // Extract locale from the request URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const locale = pathSegments[0] || 'en';
    console.log('🔍 [SIGNUP DEBUG] Locale:', locale);

    // Create Supabase client and test connection
    console.log('🔍 [SIGNUP DEBUG] Creating Supabase client...');
    const supabase = await createClient();
    console.log('✅ [SIGNUP DEBUG] Supabase client created');

    // Test Supabase connection
    console.log('🔍 [SIGNUP DEBUG] Testing Supabase connection...');
    try {
      const { data: _healthCheck } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      console.log('✅ [SIGNUP DEBUG] Supabase connection test successful');
    } catch (connectionError) {
      console.error(
        '❌ [SIGNUP DEBUG] Supabase connection test failed:',
        connectionError,
      );
    }

    // Try regular signup with email confirmation
    console.log(
      '🔍 [SIGNUP DEBUG] Attempting regular signup with email confirmation...',
    );
    console.log(
      '🔍 [SIGNUP DEBUG] Email redirect URL:',
      getSiteUrl(`/${locale}/auth/callback`),
    );

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

    console.log('🔍 [SIGNUP DEBUG] Supabase signup response:', {
      hasUser: !!data?.user,
      hasError: !!error,
      errorMessage: error?.message,
      errorCode: error?.status,
      userEmail: data?.user?.email,
      userConfirmed: data?.user?.email_confirmed_at,
    });

    if (error) {
      console.error('❌ [SIGNUP DEBUG] Signup error:', {
        message: error.message,
        status: error.status,
        name: error.name,
        stack: error.stack,
      });
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      console.error('❌ [SIGNUP DEBUG] No user created in response');
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 },
      );
    }

    console.log('✅ [SIGNUP DEBUG] User created successfully:', {
      userId: data.user.id,
      email: data.user.email,
      confirmed: data.user.email_confirmed_at,
      createdAt: data.user.created_at,
    });

    // Check if email confirmation was sent
    if (!data.user.email_confirmed_at) {
      console.log('📧 [SIGNUP DEBUG] Email confirmation should have been sent');
      console.log(
        '📧 [SIGNUP DEBUG] User needs to check email and click confirmation link',
      );
    } else {
      console.log('✅ [SIGNUP DEBUG] User email already confirmed');
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
    console.error('❌ [SIGNUP DEBUG] Unexpected error in signup:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });

    if (error instanceof z.ZodError) {
      console.error('❌ [SIGNUP DEBUG] Validation error:', error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred during signup' },
      { status: 500 },
    );
  }
}
