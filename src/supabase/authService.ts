import { supabase } from './config';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'customer';
}

// Register a new user
export const registerUser = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<User> => {
  try {
    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');
    
    // Create user profile in the users table
    const userData: Omit<User, 'id'> & { id?: string } = {
      id: authData.user.id,
      email: authData.user.email || email,
      displayName,
      role: 'customer', // Default role for new users
    };
    
    const { error: profileError } = await supabase
      .from('users')
      .insert([userData]);
    
    if (profileError) throw profileError;
    
    return {
      id: authData.user.id,
      email: authData.user.email || email,
      displayName,
      role: 'customer'
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    if (!data.user) throw new Error('Login failed');
    
    // Get user data from the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (userError) throw userError;
    
    return {
      id: userData.id,
      email: userData.email,
      displayName: userData.display_name,
      role: userData.role
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Get current user data
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session?.user) return null;
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();
    
    if (error) throw error;
    
    return {
      id: userData.id,
      email: userData.email,
      displayName: userData.display_name,
      role: userData.role
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Check if user is admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Create admin user (run this once to set up your admin)
export const createAdminUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    // Register the user first
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) throw authError;
    if (!authData.user) throw new Error('Admin creation failed');
    
    // Create admin profile in the users table
    const adminData = {
      id: authData.user.id,
      email: authData.user.email || email,
      display_name: displayName,
      role: 'admin'
    };
    
    const { error: profileError } = await supabase
      .from('users')
      .insert([adminData]);
    
    if (profileError) throw profileError;
    
    return {
      id: authData.user.id,
      email: authData.user.email || email,
      displayName,
      role: 'admin'
    };
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};
