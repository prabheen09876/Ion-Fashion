import { supabase } from '../lib/supabaseClient';

export async function createAdminUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin.ionfashion@gmail.com',
    password: 'AdminPass123!',
    options: {
      data: {
        isAdmin: true,
        full_name: 'ION Admin'
      }
    }
  });

  if (error) {
    console.error('Error creating admin user:', error);
    return { error };
  }

  console.log('Admin user created:', data);
  return { data };
}

// Don't call the function automatically
// It will be called by SetupAdmin component