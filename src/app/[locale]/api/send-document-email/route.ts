import { createClient } from '@/lib/supabase/server-client';
import { NextRequest, NextResponse } from 'next/server';

interface DocumentEmailBody {
  documentIds: string[];
  recipientIds: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = (await request.json()) as DocumentEmailBody;

    // Validate the request body
    const { documentIds, recipientIds } = body;

    if (
      !documentIds ||
      !documentIds.length ||
      !recipientIds ||
      !recipientIds.length
    ) {
      return NextResponse.json(
        { error: 'Missing documentIds or recipientIds' },
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

    // Extract locale from URL path
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const locale = pathSegments.length > 0 ? pathSegments[0] : 'en';

    // First, get the document details
    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select('id, title')
      .in('id', documentIds);

    if (documentsError || !documents) {
      return NextResponse.json(
        { error: `Failed to fetch documents: ${documentsError?.message}` },
        { status: 500 },
      );
    }

    // Get recipient emails from profiles
    const { data: recipients, error: recipientsError } = await supabase
      .from('profiles')
      .select('id, email, name')
      .in('id', recipientIds);

    if (recipientsError || !recipients) {
      return NextResponse.json(
        { error: `Failed to fetch recipients: ${recipientsError?.message}` },
        { status: 500 },
      );
    }

    // In a production environment, this would send actual emails using a service
    // like SendGrid, Mailgun, or AWS SES. For this implementation, we'll just
    // simulate successful email sending.

    // Build list of documents for email content
    const documentList = documents.map((doc) => `- ${doc.title}`).join('\n');

    // Log details for demonstration (would be email sending in production)
    console.log('Sending document recommendation emails:');
    console.log('Documents:', documentList);
    console.log('Recipients:', recipients.map((r) => r.email).join(', '));
    console.log(
      'Login URL:',
      `${
        process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
      }/${locale}/auth`,
    );

    // In a real implementation, we would trigger emails here
    // For now, we'll simulate successful email sending

    return NextResponse.json({
      success: true,
      message: 'Document recommendation emails sent successfully',
      // Include details for testing/development
      debug: {
        documents: documents.map((d) => ({ id: d.id, title: d.title })),
        recipients: recipients.map((r) => ({
          id: r.id,
          email: r.email,
          name: r.name,
        })),
        loginUrl: `${
          process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
        }/${locale}/auth`,
      },
    });
  } catch (error) {
    console.error('Error in send-document-email API route:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 },
    );
  }
}
