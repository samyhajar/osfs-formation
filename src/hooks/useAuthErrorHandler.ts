import { useCallback } from 'react';
import { analyzeAuthError } from '@/lib/utils/auth-error-handler';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export function useAuthErrorHandler(supabase: SupabaseClient<Database>) {
  const handleAuthError = useCallback(
    async (
      error: unknown,
      setSession: (session: null) => void,
      setUser: (user: null) => void,
      setProfile: (profile: null) => void,
    ) => {
      const errorInfo = analyzeAuthError(error);

      if (errorInfo.shouldRedirectToLogin) {
        console.log(
          '[AuthErrorHandler] Auth error requires redirect to login:',
          errorInfo.userFriendlyMessage,
        );
        // Clear the session completely
        await supabase.auth.signOut({ scope: 'local' });
        setSession(null);
        setUser(null);
        setProfile(null);
        // Redirect to login page
        window.location.href = '/login';
        return true; // Indicates redirect was handled
      }

      return false; // No redirect needed
    },
    [supabase],
  );

  return { handleAuthError };
}
