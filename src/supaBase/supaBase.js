import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase project URL and anon key
const supabaseUrl = 'https://xnsetzrgwdeufezcugjn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhuc2V0enJnd2RldWZlemN1Z2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDA3NzEsImV4cCI6MjA2MzkxNjc3MX0.S51kUa0dFbUpbMI_QeSWuxXef-qp6uMVtHr44OYQ-tU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);