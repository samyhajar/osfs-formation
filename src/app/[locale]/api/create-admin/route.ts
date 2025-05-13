import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server-client';
import { Database } from '@/types/supabase';
import { z } from 'zod';
import { AuthError } from '@supabase/supabase-js';

// Define schema for request validation
const createAdminSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

// Admin API should only be used in secure environments
export async function POST(request: Request) {
  try {
    const requestData: unknown = await request.json();
    const { email, password, name } = createAdminSchema.parse(requestData);

    // Create a regular Supabase client for queries
    const supabase = await createClient();

    // Check if admin already exists
    const { count, error: countError } = await supabase
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

    // Create admin Supabase client with service role key for admin operations
    const supabaseAdmin = createAdminClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

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
        createError instanceof AuthError &&
        createError.message.includes('duplicate key')
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

    const userName =
      (userData.user.user_metadata as { name?: string })?.name ?? name;

    // Update the profile to add the name and set the role to admin
    // The profile should already exist due to the on_auth_user_created trigger
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        name: userName,
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
  } catch (error: unknown) {
    console.error('Unhandled error in create-admin route:', error);
    let errorMessage = 'Unknown server error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
