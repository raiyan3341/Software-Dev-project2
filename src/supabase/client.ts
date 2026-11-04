import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co'
);

// Initialize Supabase client if configured, otherwise provide resilient fallback client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const getSupabaseConnectionStatus = () => {
  return {
    isLiveConnected: Boolean(supabase),
    url: isSupabaseConfigured ? supabaseUrl : 'Local Persistent Database Engine',
    databaseEngine: isSupabaseConfigured ? 'PostgreSQL (Supabase Cloud)' : 'PostgreSQL Local Simulation',
  };
};
