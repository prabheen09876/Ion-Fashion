// Simple script to update a user to admin role
// This uses JavaScript instead of TypeScript to avoid compilation issues

import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key from your config.ts
const supabaseUrl = 'https://hwnszrgiqmdgeykydkoq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3bnN6cmdpcW1kZ2V5a3lka29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MjYzMjMsImV4cCI6MjA2MzUwMjMyM30.igE8dyuRL2KWRYbcRZQbRDxoIiTDkXpaiBoWQM20dpk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Replace with the email of the user you want to make an admin
const USER_EMAIL = 'admin.ionfashion@gmail.com';

const updateUserToAdmin = async () => {
  try {
    console.log(`Updating user ${USER_EMAIL} to admin role...`);
    
    // First, find the user by email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', USER_EMAIL)
      .single();
    
    if (userError) {
      console.error('Error finding user:', userError.message);
      return;
    }
    
    if (!userData) {
      console.error('User not found with email:', USER_EMAIL);
      return;
    }
    
    console.log('Found user:', userData);
    
    // Update the user's role to admin
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', userData.id);
    
    if (updateError) {
      console.error('Error updating user role:', updateError.message);
      return;
    }
    
    console.log(`Successfully updated user ${USER_EMAIL} to admin role!`);
    console.log('User ID:', userData.id);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

// Execute the function
updateUserToAdmin();
