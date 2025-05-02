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
  supabase: SupabaseClient<Database>;
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
  const supabase = useMemo(() => createClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    console.log(`[AuthContext] fetchProfile called for user: ${userId}`);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error(`[AuthContext] Supabase error fetching profile for ${userId}:`, error);
        return null;
      }
      console.log(`[AuthContext] Profile fetched for ${userId}:`, data);
      return data;
    } catch (err) {
      console.error(`[AuthContext] CAUGHT generic error fetching profile for ${userId}:`, err);
      return null;
    }
  }, [supabase]);

  const refreshSessionAndUser = useCallback(async () => {
    console.log('[AuthContext] refreshSessionAndUser called');
    setLoading(true);
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      console.log('[AuthContext] Session/User refreshed. User:', !!(currentSession?.user));
    } catch (error) {
      console.error("[AuthContext] Error in refreshSessionAndUser:", error);
      setSession(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
      console.log('[AuthContext] refreshSessionAndUser finished. Loading:', false);
    }
  }, [supabase]);

  useEffect(() => {
    console.log('[AuthContext] Subscribing to onAuthStateChange.');
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log(`[AuthContext] onAuthStateChange event: ${event}. Session exists:`, !!newSession);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    void refreshSessionAndUser();

    return () => {
      console.log('[AuthContext] Unsubscribing auth listener.');
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, refreshSessionAndUser]);

  useEffect(() => {
    const currentUserId = user?.id;
    if (currentUserId) {
      console.log(`[AuthContext] User detected (ID: ${currentUserId}), attempting profile fetch.`);
      setLoading(true);

      // --- Force refresh session first ---
      // Although the auth listener should handle this, let's try an explicit refresh
      // before fetching the profile to rule out stale session data issues.
      refreshSessionAndUser().then(() => {
         // Now fetch profile after ensuring session is fresh
          fetchProfile(currentUserId)
            .then((fetchedProfile) => {
              console.log(`[AuthContext] Profile fetch completed for ${currentUserId}. Profile found:`, !!fetchedProfile);
              setProfile(fetchedProfile);
            })
            .catch((error) => {
              console.error(`[AuthContext] Error in profile fetching effect for ${currentUserId}:`, error);
              setProfile(null);
            })
            .finally(() => {
              console.log(`[AuthContext] Profile fetch attempt finished for ${currentUserId}. Setting loading false.`);
              setLoading(false);
            });

      }).catch(err => {
          console.error("[AuthContext] Error during explicit refresh before profile fetch:", err);
          setLoading(false); // Ensure loading stops even if refresh fails
          setProfile(null);
      });

    } else {
      console.log('[AuthContext] No user detected, ensuring profile is null.');
      // Ensure profile is cleared if user becomes null
      if (profile !== null) {
          setProfile(null);
      }
      // If no user, we are not loading profile data
      if (loading) {
        setLoading(false);
      }
    }
    // Only depend on the user ID changing to trigger profile fetch
  }, [user?.id, fetchProfile, refreshSessionAndUser, loading, profile]);

  const signOut = async () => {
    console.log('[AuthContext] signOut function called.');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("[AuthContext] Error during supabase.auth.signOut:", error);
        throw error;
      }
      console.log('[AuthContext] supabase.auth.signOut successful. State update delegated to listener.');
      return true;
    } catch (error) {
      console.error("[AuthContext] Error caught in signOut function:", error);
      return false;
    }
  };

  const value = {
    supabase,
    session,
    user,
    profile,
    loading,
    signOut,
    refresh: refreshSessionAndUser,
  };

  console.log('[AuthContext] Rendering Provider. Loading:', loading, 'User:', !!user, 'Profile:', !!profile);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};