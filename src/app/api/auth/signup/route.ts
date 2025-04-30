import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSiteUrl } from '@/lib/utils/urls';

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'formator', 'formee']).default('formee'),
});

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();

    // Validate the request data
    const validatedData = signupSchema.parse(requestData);
    const { email, password, name, role } = validatedData;

    // Create a Supabase client (server-side)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Sign up the user with role in metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getSiteUrl('/auth/callback'),
        data: {
          name,
          role, // This will be used by the handle_new_user trigger
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
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
