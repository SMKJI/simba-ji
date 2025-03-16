
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pgypojvxyzoqwyikbjda.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBneXBvanZ4eXpvcXd5aWtiamRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MTkxNTUsImV4cCI6MjA1NzQ5NTE1NX0.I91Jjpnoc830XPXSLtHABjDk_bRt8Wk8zDJybaa_Drw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  name: string | null;
  role: string | null;
  avatar_url: string | null;
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
