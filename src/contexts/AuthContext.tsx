'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { User, Session, SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

type UserProfile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  supabase: SupabaseClient<Database>; // Expose the client
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Create Supabase client instance once using useMemo
  const supabase = useMemo(() => createClient(), []);

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Helper function to fetch profile ---
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    console.log(`[AuthContext] fetchProfile called for user: ${userId}`);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error(`[AuthContext] Error fetching profile for ${userId}:`, error);
        return null;
      }
      console.log(`[AuthContext] Profile fetched for ${userId}:`, data);
      return data;
    } catch (err) {
      console.error(`[AuthContext] CAUGHT error fetching profile for ${userId}:`, err);
      return null;
    }
  }, [supabase]); // Depend only on the stable supabase client instance

  // --- Function to refresh all user data ---
  const refreshUserData = useCallback(async () => {
    console.log('[AuthContext] refreshUserData called');
    setLoading(true);
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      setSession(currentSession);

      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const fetchedProfile = await fetchProfile(currentUser.id);
        setProfile(fetchedProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("[AuthContext] Error in refreshUserData:", error);
      setSession(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
      console.log('[AuthContext] refreshUserData finished. Loading:', false);
    }
  }, [supabase, fetchProfile]); // Add fetchProfile dependency

  // --- Initialize and set up auth state change listener ---
  useEffect(() => {
    console.log('[AuthContext] useEffect setup starting.');
    // Initial data fetch - wrap with void
    void refreshUserData();

    // Auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`[AuthContext] onAuthStateChange event: ${event}`, newSession);
        setSession(newSession);
        const changedUser = newSession?.user ?? null;
        setUser(changedUser);

        if (changedUser) {
          const fetchedProfile = await fetchProfile(changedUser.id);
          setProfile(fetchedProfile);
        } else {
          setProfile(null);
        }
        // Loading state is managed by refreshUserData or initial load
        // Don't set loading here to avoid potential loops
      }
    );

    console.log('[AuthContext] Auth listener subscribed.');

    // Cleanup
    return () => {
      console.log('[AuthContext] Unsubscribing auth listener.');
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, refreshUserData, fetchProfile]);


  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // State updates will be handled by onAuthStateChange
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      setLoading(false);
      return false;
    }
  };

  const value = {
    supabase, // Provide the client instance
    session,
    user,
    profile,
    loading,
    signOut,
    refresh: refreshUserData,
  };

  // Add a log to see when provider renders
  console.log('[AuthContext] Rendering Provider. Loading:', loading, 'User:', !!user, 'Profile:', !!profile);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};