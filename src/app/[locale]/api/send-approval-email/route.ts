import { createClient } from '@/lib/supabase/server-client';
import { NextRequest, NextResponse } from 'next/server';
import { sendApprovalEmail } from '@/lib/omnisend/email-service';

interface ApprovalEmailBody {
  user_id: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = (await request.json()) as ApprovalEmailBody;

    // Get the authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract user_id and email from the request body
    const { user_id, email } = body;

    if (!user_id || !email) {
      return NextResponse.json(
        { error: 'Missing user_id or email parameter' },
        { status: 400 },
      );
    }

    // Verify that the user is an admin
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized or invalid session' },
        { status: 401 },
      );
    }

    // Check if the user is an admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can perform this action.' },
        { status: 403 },
      );
    }

    // Ensure the user is marked as approved in the profiles table
    // This should already be set by the PendingUsersList component,
    // but we double-check here to ensure consistency
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_approved: true,
        approval_date: new Date().toISOString(),
      })
      .eq('id', user_id);

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to update user profile: ${updateError.message}` },
        { status: 500 },
      );
    }

    // Extract locale from URL path
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const locale = pathSegments.length > 0 ? pathSegments[0] : 'en';

    // Get user name for the email
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user_id)
      .single();

    const userName = userProfile?.name || 'User';

    // Send approval email using Omnisend
    const loginUrl = `${
      process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
    }/${locale}/auth/confirmation`;

    const emailResult = await sendApprovalEmail({
      recipient: {
        email,
        name: userName,
      },
      loginUrl,
      locale,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          error: `Failed to send approval email: ${emailResult.errors.join(', ')}`,
          details: {
            sentCount: emailResult.sentCount,
            failedCount: emailResult.failedCount,
            errors: emailResult.errors,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Approval email sent successfully. ${emailResult.sentCount} emails sent, ${emailResult.failedCount} failed.`,
      details: {
        sentCount: emailResult.sentCount,
        failedCount: emailResult.failedCount,
        messageIds: emailResult.messageIds,
        recipient: {
          email,
          name: userName,
        },
        loginUrl,
      },
    });
  } catch (error) {
    console.error('Error in send-approval-email API route:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 },
    );
  }
}
