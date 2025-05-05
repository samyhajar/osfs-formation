import { createClient } from '@/lib/supabase/server-client';
import { NextRequest, NextResponse } from 'next/server';

interface DeleteUserBody {
  user_id: string;
}

interface DeleteUserResponse {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = (await request.json()) as DeleteUserBody;

    // Get the authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract user_id from the request body
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing user_id parameter' },
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

    // Call the edge function
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-pending-user`;
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ user_id }),
    });

    // Return the response from the edge function
    const result = (await response.json()) as DeleteUserResponse;

    if (!response.ok) {
      return NextResponse.json(
        { error: result.error || 'Edge function failed' },
        { status: response.status },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in delete-pending-user API route:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 },
    );
  }
}
