import { createClient } from '@/lib/supabase/server-client';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/types/supabase';

// Define an interface for the request body
interface DeleteUserRequest {
  user_id: string;
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
        { error: 'Only admins can delete pending users' },
        { status: 403 },
      );
    }

    // Get user ID from request body with proper typing
    const requestBody = (await request.json()) as DeleteUserRequest;
    const { user_id } = requestBody;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    // Create a direct admin client with service role key
    const supabaseAdmin = createAdminClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Delete the user's profile first
    const { error: profileDeleteError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', user_id);

    if (profileDeleteError) {
      console.error('Error deleting user profile:', profileDeleteError);
      return NextResponse.json(
        { error: 'Failed to delete user profile' },
        { status: 500 },
      );
    }

    // Delete the user from auth
    const { error: authDeleteError } =
      await supabaseAdmin.auth.admin.deleteUser(user_id);

    if (authDeleteError) {
      console.error('Error deleting user from auth:', authDeleteError);
      return NextResponse.json(
        { error: 'Failed to delete user from authentication system' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User rejected and deleted successfully',
    });
  } catch (error) {
    console.error('Error in delete-pending-user API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
