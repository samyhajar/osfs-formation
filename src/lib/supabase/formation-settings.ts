import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type FormationSettings =
  Database['public']['Tables']['formation_settings']['Row'];
type FormationSettingsInsert =
  Database['public']['Tables']['formation_settings']['Insert'];
type FormationSettingsUpdate =
  Database['public']['Tables']['formation_settings']['Update'];

/**
 * Get the current formation personnel selection
 */
export async function getFormationSettings(): Promise<number[]> {
  const supabase = createClient<Database>();

  try {
    const response = await supabase
      .from('formation_settings')
      .select('selected_member_ids')
      .limit(1)
      .single();

    if (response.error) {
      console.error('Error fetching formation settings:', response.error);
      return [];
    }

    const data = response.data;
    // Parse the JSONB data to get the array of member IDs
    const memberIds = data?.selected_member_ids as number[] | undefined;
    return Array.isArray(memberIds) ? memberIds : [];
  } catch (error) {
    console.error('Error in getFormationSettings:', error);
    return [];
  }
}

/**
 * Update the formation personnel selection (admin only)
 */
export async function updateFormationSettings(
  selectedMemberIds: number[],
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient<Database>();

  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // First, try to get existing row
    const existingResponse = await supabase
      .from('formation_settings')
      .select('id')
      .limit(1)
      .single();

    if (existingResponse.error && existingResponse.error.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for first time
      console.error(
        'Error checking existing formation settings:',
        existingResponse.error,
      );
      return { success: false, error: existingResponse.error.message };
    }

    const existingData = existingResponse.data;

    if (existingData?.id) {
      // Update existing row
      const updateData: FormationSettingsUpdate = {
        selected_member_ids: selectedMemberIds,
        updated_by: user.id,
      };

      const { error } = await supabase
        .from('formation_settings')
        .update(updateData)
        .eq('id', existingData.id);

      if (error) {
        console.error('Error updating formation settings:', error);
        return { success: false, error: error.message };
      }
    } else {
      // Insert new row
      const insertData: FormationSettingsInsert = {
        selected_member_ids: selectedMemberIds,
        updated_by: user.id,
      };

      const { error } = await supabase
        .from('formation_settings')
        .insert(insertData);

      if (error) {
        console.error('Error inserting formation settings:', error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateFormationSettings:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Subscribe to formation settings changes for real-time updates
 */
export function subscribeToFormationSettings(
  callback: (selectedMemberIds: number[]) => void,
) {
  const supabase = createClient<Database>();

  const subscription = supabase
    .channel('formation_settings_changes')
    .on<FormationSettings>(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'formation_settings',
      },
      (payload: RealtimePostgresChangesPayload<FormationSettings>) => {
        if (
          payload.new &&
          'selected_member_ids' in payload.new &&
          payload.new.selected_member_ids
        ) {
          const memberIds = payload.new.selected_member_ids as number[];
          if (Array.isArray(memberIds)) {
            callback(memberIds);
          }
        }
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(subscription);
  };
}
