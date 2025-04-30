'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

type UserProfile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Create the Supabase client
  const getSupabase = useCallback(() => {
    return createClient();
  }, []);

  // Function to fetch the user data, session, and profile
  const refreshUserData = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();

      // Get the current session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        setSession(null);
        setUser(null);
        setProfile(null);
        return;
      }

      setSession(currentSession);

      if (!currentSession) {
        // No session, user is not logged in
        setUser(null);
        setProfile(null);
        return;
      }

      // Session exists, validate by getting user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

      if (userError || !currentUser) {
        console.error("Error validating user:", userError);
        setUser(null);
        setProfile(null);
        return;
      }

      // Set user state
      setUser(currentUser);

      // Now fetch the user's profile
      if (currentUser) {
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          // Continue with null profile but valid user
          setProfile(null);
        } else {
          setProfile(userProfile);
        }
      }
    } catch (error) {
      console.error("Unexpected error in refreshUserData:", error);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [getSupabase]);

  // Initialize and set up auth state change listener
  useEffect(() => {
    const supabase = getSupabase();

    // Handle OAuth redirects with hash fragments
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        supabase.auth
          .setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          .then(({ data, error }) => {
            if (error) {
              console.error('Error setting session from hash:', error);
            }
            // Clean up the URL
            window.history.replaceState(null, '', window.location.pathname);
          });
      }
    }

    // Initial data fetch
    refreshUserData();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Fetch profile if user exists
        if (newSession?.user) {
          try {
            const { data: userProfile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .single();

            if (profileError) {
              console.error("Error fetching profile on auth change:", profileError);
              setProfile(null);
            } else {
              setProfile(userProfile);
            }
          } catch (error) {
            console.error("Error in auth change profile fetch:", error);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Add a safety timeout to ensure loading state is not stuck
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 3000);

    // Cleanup on unmount
    return () => {
      authListener?.subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, [refreshUserData, getSupabase]);

  const signOut = async () => {
    setLoading(true);
    try {
      // Use the API endpoint for signout instead of direct signOut
      window.location.href = '/api/auth/signout';
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      setLoading(false);
      return false;
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
    refresh: refreshUserData,
  };

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