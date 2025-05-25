// Direct admin user creation script
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://hwnszrgiqmdgeykydkoq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3bnN6cmdpcW1kZ2V5a3lka29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MjYzMjMsImV4cCI6MjA2MzUwMjMyM30.igE8dyuRL2KWRYbcRZQbRDxoIiTDkXpaiBoWQM20dpk';

// Admin user details - you can change these
// Using a Gmail address which is more likely to pass validation
const ADMIN_EMAIL = 'admin.ionfashion@gmail.com';
const ADMIN_PASSWORD = 'AdminPass123!';
const ADMIN_NAME = 'ION Admin';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const createAdmin = async () => {
  try {
    console.log('Creating admin user...');
    
    // Step 1: Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    if (authError) {
      console.error('Error creating auth user:', authError.message);
      return;
    }
    
    if (!authData.user) {
      console.error('User creation failed - no user returned');
      return;
    }
    
    console.log('Auth user created successfully!');
    console.log('User ID:', authData.user.id);
    
    // Step 2: Insert the user profile with admin role
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
      console.error('Error inserting user profile:', insertError.message);
      console.log('Manual SQL to run in Supabase SQL Editor:');
      console.log(`
      INSERT INTO users (id, email, display_name, role)
      VALUES ('${authData.user.id}', '${ADMIN_EMAIL}', '${ADMIN_NAME}', 'admin');
      `);
      return;
    }
    
    console.log('Admin user created successfully!');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('User ID:', authData.user.id);
    console.log('\nYou can now log in with these credentials.');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

createAdmin();
