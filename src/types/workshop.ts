import { Database } from './supabase';

export type Workshop = Database['public']['Tables']['workshops']['Row'];
