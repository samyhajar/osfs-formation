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
import { useAuthErrorHandler } from '@/hooks/useAuthErrorHandler';

// Update the UserProfile type to make it match the database type
type ProfileFromDB = Database['public']['Tables']['profiles']['Row'];

// Define UserProfile with required role (no null)
type UserProfile = Omit<ProfileFromDB, 'role'> & {
  role: 'admin' | 'editor' | 'user' | 'formator' | 'formee'
};

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

  const { handleAuthError } = useAuthErrorHandler(supabase);

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

      // Handle null roles by providing a default 'user' role
      if (data) {
        const processedProfile: UserProfile = {
          ...data,
          role: data.role ?? 'user' // Default to 'user' if role is null
        };
        return processedProfile;
      }

      return null;
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

      if (sessionError) {
        console.error("[AuthContext] Session error:", sessionError);

        // Handle refresh token errors
        const wasHandled = await handleAuthError(sessionError, setSession, setUser, setProfile);
        if (wasHandled) return;

        throw sessionError;
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      console.log('[AuthContext] Session/User refreshed. User:', !!(currentSession?.user));
    } catch (error) {
      console.error("[AuthContext] Error in refreshSessionAndUser:", error);

      // Handle auth errors
      const wasHandled = await handleAuthError(error, setSession, setUser, setProfile);
      if (wasHandled) return;

      setSession(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
      console.log('[AuthContext] refreshSessionAndUser finished. Loading:', false);
    }
  }, [supabase, handleAuthError]);

  useEffect(() => {
    console.log('[AuthContext] Subscribing to onAuthStateChange.');
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`[AuthContext] onAuthStateChange event: ${event}. Session exists:`, !!newSession);

        // Handle token refresh errors
        if (event === 'TOKEN_REFRESHED' && !newSession) {
          console.log('[AuthContext] Token refresh failed, clearing session');
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          // Redirect to login
          window.location.href = '/login';
          return;
        }

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setLoading(false);

          // Clear user introduction modal flag and timestamp so it shows again on next login
          try {
            sessionStorage.removeItem('osfs_user_intro_seen_session');
            sessionStorage.removeItem('osfs_user_intro_timestamp');
            console.log('[AuthContext] Cleared user introduction flag and timestamp on logout');
          } catch (error) {
            // sessionStorage might not be available in some environments
            console.warn('[AuthContext] Could not clear user introduction flag:', error);
          }
        }
      }
    );

    void refreshSessionAndUser();

    return () => {
      console.log('[AuthContext] Unsubscribing auth listener.');
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, refreshSessionAndUser]);

  // Simplified useEffect for profile fetching
  useEffect(() => {
    const currentUserId = user?.id;

    if (currentUserId) {
      console.log(`[AuthContext] User detected (ID: ${currentUserId}), fetching profile.`);
      setLoading(true); // Set loading true ONLY when starting fetch
      fetchProfile(currentUserId)
        .then((fetchedProfile) => {
          console.log(`[AuthContext] Profile fetch completed for ${currentUserId}. Profile found:`, !!fetchedProfile);
          setProfile(fetchedProfile);
        })
        .catch((error) => {
          console.error(`[AuthContext] Error fetching profile for ${currentUserId}:`, error);
          setProfile(null);
        })
        .finally(() => {
          console.log(`[AuthContext] Profile fetch attempt finished for ${currentUserId}. Setting loading false.`);
          setLoading(false);
        });
    } else {
      console.log('[AuthContext] No user detected, clearing profile and setting loading false.');
      // If there is no user, clear the profile and ensure loading is false.
      setProfile(null);
      setLoading(false);
    }
    // Depend only on user ID and the fetch function instance
  }, [user?.id, fetchProfile]);

  const signOut = async () => {
    console.log('[AuthContext] signOut function called.');
    try {
      // Clear user introduction modal flag and timestamp immediately on signout
      try {
        sessionStorage.removeItem('osfs_user_intro_seen_session');
        sessionStorage.removeItem('osfs_user_intro_timestamp');
        console.log('[AuthContext] Cleared user introduction flag and timestamp on signOut call');
      } catch (error) {
        console.warn('[AuthContext] Could not clear user introduction flag in signOut:', error);
      }

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