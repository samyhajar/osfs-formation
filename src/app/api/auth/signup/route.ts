import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';
import { emailService } from '@/lib/omnisend/email-service';

type UserRole = 'user' | 'admin' | 'editor';

interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export async function POST(request: Request) {
  try {
    const requestData = (await request.json()) as SignupRequest;
    const email = requestData.email;
    const password = requestData.password;
    const name = requestData.name;
    const role = requestData.role || 'user';

    // Validate inputs
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      );
    }

    // Validate password strength
    if (typeof password === 'string' && password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 },
      );
    }

    // Check for at least one uppercase letter, one lowercase letter, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (typeof password === 'string' && !passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        },
        { status: 400 },
      );
    }

    // Initialize Supabase client
    const supabase = await createClient();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 },
      );
    }

    // Create user in Supabase Auth (without email confirmation)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role,
        },
      },
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 },
      );
    }

    // Create profile in profiles table
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      email,
      full_name: name,
      role,
      is_approved: false, // Require admin approval
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);

      // Try to clean up the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);

      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 },
      );
    }

    // Send confirmation email through Omnisend
    try {
      const confirmationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://osfs-formation-1mxnswszr-aaronfaustfield-gmailcoms-projects.vercel.app'}/auth/callback`;
      await emailService.sendApprovalEmail(email, name, confirmationUrl);
      
      console.log(`Confirmation email sent via Omnisend to ${email}`);
    } catch (emailError) {
      console.error('Error sending confirmation email via Omnisend:', emailError);
      // Don't fail the signup if email fails, but log the error
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully. Please check your email to confirm your account.',
    });
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup' },
      { status: 500 },
    );
  }
}
