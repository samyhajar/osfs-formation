import { createClient } from '@/lib/supabase/server-client';
import { emailService } from '@/lib/omnisend/email-service';
import { NextRequest, NextResponse } from 'next/server';

// Define an interface for the request body
interface ApprovalEmailRequest {
  user_id: string;
  email: string;
  name?: string;
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
    const { user_id, email, name } = requestData;

    if (!user_id || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 },
      );
    }

    // Get user profile for name if not provided
    let userName = name;
    if (!userName) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user_id)
        .single();
      userName = profile?.name || 'User';
    }

    // Generate the magic link for account confirmation
    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
      });

    if (linkError) {
      console.error('Error generating magic link:', linkError);
      return NextResponse.json(
        { error: 'Failed to generate approval link' },
        { status: 500 },
      );
    }

    if (!linkData?.properties?.action_link) {
      return NextResponse.json(
        { error: 'Failed to generate approval link' },
        { status: 500 },
      );
    }

    // Send approval email via Omnisend
    console.log('📧 [APPROVAL DEBUG] Sending approval email via Omnisend to:', email);
    console.log('📧 [APPROVAL DEBUG] Approval URL:', linkData.properties.action_link);
    
    try {
      await emailService.sendApprovalEmail(
        email,
        userName,
        linkData.properties.action_link,
      );

      console.log('✅ [APPROVAL DEBUG] Omnisend approval email sent successfully to', email);
    } catch (omnisendError) {
      console.error('❌ [APPROVAL DEBUG] Error sending approval email via Omnisend:', omnisendError);
      return NextResponse.json(
        { error: 'Failed to send approval email' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Approval email sent successfully',
      approvalUrl: linkData.properties.action_link,
    });
  } catch (error) {
    console.error('Error in send-approval-email API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
