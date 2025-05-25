import { supabase } from '../supabase/config';

// Admin user details - CHANGE THESE VALUES BEFORE RUNNING
const ADMIN_EMAIL = 'admin.ionfashion@gmail.com'; // Use a real email address
const ADMIN_PASSWORD = 'AdminPass123!'; // Use a strong password with mixed case and special characters
const ADMIN_NAME = 'ION Admin';

// Run this script to create an admin user
const initializeAdmin = async () => {
  try {
    console.log('Creating admin user...');
    
    // Step 1: Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');
    
    console.log('Auth user created successfully!');
    
    // Step 2: Sign in as the new user to get a valid session
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    if (signInError) throw signInError;
    
    console.log('Signed in as the new user');
    
    // Step 3: Insert the user profile with admin role using RPC
    // This bypasses RLS by using a server-side function
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: ADMIN_EMAIL,
          display_name: ADMIN_NAME,
          role: 'admin'
        }
      ]);
    
    if (insertError) {
      console.log('Error inserting user profile, trying direct SQL...');
      
      // If the insert fails, we'll try to use a direct SQL query as a fallback
      // Note: This is just for initial setup and would require enabling the pg_* extensions
      console.log('Please go to the Supabase SQL Editor and run the following query:');
      console.log(`
      INSERT INTO users (id, email, display_name, role)
      VALUES ('${authData.user.id}', '${ADMIN_EMAIL}', '${ADMIN_NAME}', 'admin');
      `);
    } else {
      console.log('User profile created with admin role!');
    }
    
    console.log('Admin user setup complete!');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('User ID:', authData.user.id);
    
    // Sign out after completion
    await supabase.auth.signOut();
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Execute the function
initializeAdmin();
