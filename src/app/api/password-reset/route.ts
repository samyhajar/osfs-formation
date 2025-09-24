import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';
import { z } from 'zod';

const passwordResetSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export async function POST(request: NextRequest) {
  try {
    const requestData: unknown = await request.json();
    const { email } = passwordResetSchema.parse(requestData);

    // Create Supabase client
    const supabase = await createClient();

    // Check if user exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, email, is_approved')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message:
          'If an account with this email exists, you will receive a password reset link.',
      });
    }

    // Check if user is approved
    if (!profile.is_approved) {
      return NextResponse.json({
        success: true,
        message:
          'If an account with this email exists, you will receive a password reset link.',
      });
    }

    // Generate password reset link using Supabase (let Supabase handle email sending)
    const { data: _resetData, error: resetError } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${
          process.env.NEXT_PUBLIC_SITE_URL ||
          'https://osfs-formation-b7y9l6uje-aaronfaustfield-gmailcoms-projects.vercel.app'
        }/auth/callback`,
      });

    if (resetError) {
      console.error('Error generating password reset link:', resetError);
      return NextResponse.json(
        { error: 'Failed to generate password reset link' },
        { status: 500 },
      );
    }

    console.log(
      `Password reset email sent successfully to ${email} via Supabase`,
    );

    return NextResponse.json({
      success: true,
      message:
        'If an account with this email exists, you will receive a password reset link.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during password reset' },
      { status: 500 },
    );
  }
}
