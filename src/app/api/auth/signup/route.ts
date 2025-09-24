import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';

type UserRole = 'user' | 'admin' | 'editor';

interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export async function POST(request: Request) {
  try {
    const {
      email,
      password,
      name,
      role = 'user',
    }: SignupRequest = await request.json();

    // Validate required fields
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
        { error: 'Please enter a valid email address' },
        { status: 400 },
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 },
      );
    }

    // Validate name length
    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 },
      );
    }

    // Validate role
    if (!['user', 'admin', 'editor'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 },
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Sign up the user with role in metadata - let Supabase handle email sending
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_SITE_URL ||
          'https://osfs-formation-b7y9l6uje-aaronfaustfield-gmailcoms-projects.vercel.app'
        }/auth/callback`,
        data: {
          name,
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

    // Profile will be created automatically by the database trigger when user confirms email
    console.log(
      `User ${email} signed up successfully, confirmation email sent via Supabase`,
    );

    return NextResponse.json({
      success: true,
      message:
        'User created successfully. Please check your email to confirm your account.',
    });
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup' },
      { status: 500 },
    );
  }
}
