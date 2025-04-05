
import { createClient } from '@supabase/supabase-js';

// Directly use the values instead of environment variables
const supabaseUrl = 'https://xzgzvtjpatseayfxwbjk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Z3p2dGpwYXRzZWF5Znh3YmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjY4NDgsImV4cCI6MjA1ODE0Mjg0OH0.5tYIOa1SCMGFZKTWf1J_DC9qydZeiLecU9dSJo_tOJM';

// Interface for Supabase RPC parameters
export interface RPCParams {
  [key: string]: any;
}

// Make sure we have valid values before creating the client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anonymous Key');
}

// Create and export the Supabase client with explicit storage configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    detectSessionInUrl: true
  }
});

// Debug log to verify initialization
console.log('Supabase client initialized with URL:', supabaseUrl);
