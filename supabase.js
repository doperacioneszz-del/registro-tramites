import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const SUPABASE_URL = "https://wwarejublxmfptdkriwt.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YXJlanVibHhtZnB0ZGtyaXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODUxMjQsImV4cCI6MjA3MDg2MTEyNH0.T9IJymOsHXYGePKFxW5KTSOT1QU25ViAu7pGhVMfvhs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
