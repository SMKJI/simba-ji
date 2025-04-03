
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xzgzvtjpatseayfxwbjk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Z3p2dGpwYXRzZWF5Znh3YmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjY4NDgsImV4cCI6MjA1ODE0Mjg0OH0.5tYIOa1SCMGFZKTWf1J_DC9qydZeiLecU9dSJo_tOJM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
