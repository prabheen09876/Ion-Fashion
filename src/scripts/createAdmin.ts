import { supabase } from '../lib/supabaseClient';

async function createAdmin(email: string, password: string) {
  try {
    // Create user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Set admin metadata
    if (data.user) {
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        data.user.id,
        { user_metadata: { isAdmin: true } }
      );
      
      if (updateError) throw updateError;
      console.log(`Admin user created: ${email}`);
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

// Usage: Call this function with admin credentials
// createAdmin('admin@example.com', 'securepassword');
