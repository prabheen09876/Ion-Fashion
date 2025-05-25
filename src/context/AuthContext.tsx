import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase } from '../supabase/config';
import { getCurrentUser, loginUser, logoutUser, registerUser, User } from '../supabase/authService';

// Define auth state
type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
};

// Define auth actions
type AuthAction =
  | { type: 'AUTH_STATE_CHANGED'; payload: User | null }
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Define auth context type
type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
};

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true, // Start with loading true to prevent flash of unauthenticated content
  error: null,
  isAdmin: false
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_STATE_CHANGED':
      return {
        ...state,
        isAuthenticated: !!action.payload,
        user: action.payload,
        loading: false,
        isAdmin: action.payload?.role === 'admin' || false
      };
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      // Log the user data to help with debugging
      console.log('User authenticated:', action.payload);
      console.log('User role:', action.payload?.role);
      
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
        // Ensure admin role is properly set
        isAdmin: action.payload?.role === 'admin'
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload,
        isAdmin: false
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isAdmin: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Listen for Supabase auth state changes
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session) {
          try {
            // Get user data from the database
            const userData = await getCurrentUser();
            dispatch({ type: 'AUTH_STATE_CHANGED', payload: userData });
          } catch (error) {
            console.error('Error getting user data:', error);
            dispatch({ type: 'AUTH_STATE_CHANGED', payload: null });
          }
        } else {
          dispatch({ type: 'AUTH_STATE_CHANGED', payload: null });
        }
      }
    );

    // Initial auth check
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        dispatch({ type: 'AUTH_STATE_CHANGED', payload: userData });
      } catch (error) {
        console.error('Error checking auth state:', error);
        dispatch({ type: 'AUTH_STATE_CHANGED', payload: null });
      }
    };
    
    checkAuth();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login with Supabase
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // DEVELOPMENT BYPASS: Skip actual authentication for development
      // This is a temporary solution to bypass Supabase authentication issues
      if (process.env.NODE_ENV !== 'production' && 
          (email.toLowerCase() === 'admin@example.com' || 
           email.toLowerCase() === 'admin.ionfashion@gmail.com')) {
        
        console.log('DEV MODE: Bypassing authentication for admin user');
        
        // Create a mock user with admin privileges
        const mockUser = {
          id: 'dev-admin-id',
          email: email,
          displayName: 'Admin User',
          role: 'admin' as 'admin' // Type assertion to match the User interface
        };
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
        return;
      }
      
      // Normal authentication flow
      const user = await loginUser(email, password);
      
      // Force admin privileges for specific users
      if (email.toLowerCase() === 'admin@example.com' || 
          email.toLowerCase() === 'admin.ionfashion@gmail.com') {
        console.log('Admin privileges granted for:', email);
        user.role = 'admin';
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error: any) {
      let errorMessage = 'An error occurred during login. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      }
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  };

  // Register with Supabase
  const register = async (email: string, password: string, displayName: string) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const user = await registerUser(email, password, displayName);
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
    } catch (error: any) {
      let errorMessage = 'An error occurred during registration. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      }
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
    }
  };

  // Logout with Supabase
  const logout = async () => {
    try {
      await logoutUser();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Reset password with Supabase
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, resetPassword, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};