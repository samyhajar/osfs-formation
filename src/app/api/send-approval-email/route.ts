import { createClient } from '@/lib/supabase/server-client';
import { NextRequest, NextResponse } from 'next/server';

// Define an interface for the request body
interface ApprovalEmailRequest {
  user_id: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validate request and authorization
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the user is an admin
    const { data: adminCheck } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!adminCheck || adminCheck.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can send approval emails' },
        { status: 403 },
      );
    }

    // Get request data with proper typing
    const requestData = (await request.json()) as ApprovalEmailRequest;
    const { user_id, email } = requestData;

    if (!user_id || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 },
      );
    }

    // Send the magic link to confirm the account
    const { error: emailError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (emailError) {
      console.error('Error sending approval email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send approval email' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Approval email sent successfully',
    });
  } catch (error) {
    console.error('Error in send-approval-email API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
