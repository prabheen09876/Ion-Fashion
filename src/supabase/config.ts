import { createClient } from '@supabase/supabase-js';

// Get these values from your Supabase project settings > API
// Go to: Project Settings > API > Project URL and anon/public key
const supabaseUrl = 'https://hwnszrgiqmdgeykydkoq.supabase.co'; // e.g., 'https://abcdefghijklm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3bnN6cmdpcW1kZ2V5a3lka29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MjYzMjMsImV4cCI6MjA2MzUwMjMyM30.igE8dyuRL2KWRYbcRZQbRDxoIiTDkXpaiBoWQM20dpk'; // e.g., 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export type Tables = {
  users: {
    id: string;
    email: string;
    display_name: string;
    role: 'admin' | 'customer';
    created_at: string;
  };
  products: {
    id: string;
    name: string;
    category: string;
    product_type: string;
    price: number;
    description: string;
    image_url: string;
    featured: boolean;
    in_stock: boolean;
    created_at: string;
    updated_at: string;
  };
};
