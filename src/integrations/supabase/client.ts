import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bkqziuplpxijkhspagxn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcXppdXBscHhpamtoc3BhZ3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MTkzODgsImV4cCI6MjA1MDk5NTM4OH0.OXJlssxJZ5tDXO9AAEvNYVGj1YsnnOm05oSBNIHgsxo";

// Initialize the Supabase client with explicit options
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});