import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Admin API should only be used in secure environments
export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password and name are required' },
        { status: 400 },
      );
    }

    // Create admin Supabase client with service role key
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Check if admin already exists
    const { count, error: countError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    if (countError) {
      console.error('Error checking admin count:', countError);
      return NextResponse.json(
        { error: 'Database error checking for existing admins' },
        { status: 500 },
      );
    }

    if (count !== null && count > 0) {
      // Check count is not null
      return NextResponse.json(
        { error: 'An admin user already exists' },
        { status: 403 }, // Use 403 Forbidden
      );
    }

    // Create user with Supabase auth API
    const { data: userData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email for admin
        user_metadata: { name }, // Pass name in user_metadata for the trigger to use
      });

    if (createError) {
      console.error('Error creating auth user:', createError);
      if (
        createError.message.includes(
          'duplicate key value violates unique constraint "users_email_key"',
        )
      ) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: `Failed to create auth user: ${createError.message}` },
        { status: 500 },
      );
    }

    if (!userData || !userData.user) {
      console.error('Admin createUser returned no user data');
      return NextResponse.json(
        { error: 'Failed to get user data after creation' },
        { status: 500 },
      );
    }

    // Update the profile to add the name and set the role to admin
    // The profile should already exist due to the on_auth_user_created trigger
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        name: userData.user.user_metadata?.name || name,
        role: 'admin',
      })
      .eq('id', userData.user.id);

    if (updateError) {
      console.error('Error updating admin profile:', updateError);
      return NextResponse.json(
        {
          error: `User created but failed to set as admin: ${updateError.message}`,
        },
        { status: 500 },
      );
    }

    console.log(
      `Admin user ${userData.user.email} created successfully with profile.`,
    );

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: userData.user.id,
        email: userData.user.email,
      },
    });
  } catch (error: any) {
    console.error('Unhandled error in create-admin route:', error);
    return NextResponse.json(
      { error: error.message || 'Unknown server error occurred' },
      { status: 500 },
    );
  }
}
