// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bkqziuplpxijkhspagxn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcXppdXBscHhpamtoc3BhZ3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MTkzODgsImV4cCI6MjA1MDk5NTM4OH0.OXJlssxJZ5tDXO9AAEvNYVGj1YsnnOm05oSBNIHgsxo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);