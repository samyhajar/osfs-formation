import { createClient } from '@/lib/supabase/server-client';
import { omnisendClient } from '@/lib/omnisend/client';
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

    // Build login URL
    const loginUrl = `${
      process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
    }/${locale}/dashboard/user`;

    // Send emails via Omnisend
    const emailResults = [];
    const errors = [];

    for (const recipient of recipients) {
      try {
        // Skip recipients without email
        if (!recipient.email) {
          console.warn(`Skipping recipient ${recipient.id} - no email address`);
          continue;
        }

        // Send document recommendation email
        await omnisendClient.sendDocumentEmail(
          recipient.email,
          recipient.name || 'User',
          documents,
          loginUrl,
        );

        // Update contact in Omnisend with document recommendation tag
        await omnisendClient.createContact({
          email: recipient.email,
          firstName: recipient.name || 'User',
          tags: ['osfs-formation', 'document-recommendations'],
        });

        emailResults.push({
          id: recipient.id,
          email: recipient.email,
          name: recipient.name,
          status: 'sent',
        });

        console.log(`Document email sent successfully to ${recipient.email}`);
      } catch (emailError) {
        console.error(`Error sending email to ${recipient.email}:`, emailError);
        errors.push({
          id: recipient.id,
          email: recipient.email,
          name: recipient.name,
          error:
            emailError instanceof Error ? emailError.message : 'Unknown error',
        });
      }
    }

    // Log summary
    console.log('Document recommendation emails sent:');
    console.log('Documents:', documents.map((d) => d.title).join(', '));
    console.log('Successful sends:', emailResults.length);
    console.log('Errors:', errors.length);
    console.log('Login URL:', loginUrl);

    return NextResponse.json({
      success: true,
      message: `Document recommendation emails sent successfully to ${emailResults.length} recipients`,
      results: {
        successful: emailResults,
        errors: errors,
        documents: documents.map((d) => ({ id: d.id, title: d.title })),
        loginUrl,
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
