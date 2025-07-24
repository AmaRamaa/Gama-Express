// Backend Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get environment variables (without VITE_ prefix for backend)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Don't persist auth in backend
  },
  global: {
    headers: {
      'X-Client-Info': 'gamaexpress-backend@1.0.0'
    }
  }
});

export default supabase;
