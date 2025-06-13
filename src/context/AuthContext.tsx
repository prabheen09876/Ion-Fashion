import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthChangeEvent, AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

type AuthUser = User & {
  user_metadata?: {
    isAdmin?: boolean;
    full_name?: string;
    [key: string]: any;
  };
};

type AuthState = {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  error: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
    isAdmin: false,
    error: null,
  });

  // Handle auth state changes
  useEffect(() => {
    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          const { data: { user } } = await supabase.auth.getUser();
          const isAdmin = user?.user_metadata?.isAdmin === true;
          
          setState({
            user: user as AuthUser,
            session,
            loading: false,
            isAuthenticated: true,
            isAdmin,
            error: null,
          });
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            session: null,
            loading: false,
            isAuthenticated: false,
            isAdmin: false,
            error: null,
          });
        } else if (event === 'INITIAL_SESSION') {
          setState(prev => ({
            ...prev,
            loading: false,
          }));
        }
      }
    );

    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          const { data: { user } } = await supabase.auth.getUser();
          const isAdmin = user?.user_metadata?.isAdmin === true;
          
          setState({
            user: user as AuthUser,
            session: currentSession,
            loading: false,
            isAuthenticated: true,
            isAdmin,
            error: null,
          });
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            isAuthenticated: false,
          }));
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to check authentication status',
        }));
      }
    };

    checkSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('Sign in error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to sign in',
        }));
        return { error };
      }

      // Get fresh user data to ensure we have the latest metadata
      const { data: { user } } = await supabase.auth.getUser();
      const isAdmin = user?.user_metadata?.isAdmin === true;

      setState({
        user: user as AuthUser,
        session: data.session,
        loading: false,
        isAuthenticated: true,
        isAdmin,
        error: null,
      });

      return { error: null };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { error: { message: errorMessage } as AuthError };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, userData: Record<string, any> = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            ...userData,
            // Default metadata for new users
            created_at: new Date().toISOString(),
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to sign up',
        }));
        return { error };
      }

      // If email confirmation is required, we don't sign in automatically
      if (data.user) {
        const isAdmin = data.user.user_metadata?.isAdmin === true;
        
        setState(prev => ({
          ...prev,
          user: data.user as AuthUser,
          session: data.session,
          loading: false,
          isAuthenticated: true,
          isAdmin,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: null,
        }));
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { error: { message: errorMessage } as AuthError };
    }
  }, []);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to sign out',
        }));
        return { error };
      }

      setState({
        user: null,
        session: null,
        loading: false,
        isAuthenticated: false,
        isAdmin: false,
        error: null,
      });

      return { error: null };
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { error: { message: errorMessage } as AuthError };
    }
  }, []);

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!state.loading ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};