import { supabase } from '../lib/supabaseClient';

// This script updates an existing user to have admin privileges
// Replace with the email of the user you want to make an admin
// This should be the email you used to register/login
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
