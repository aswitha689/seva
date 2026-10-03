import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Fetch services from Supabase if configured, otherwise fallback to local services.json.
 */
export const fetchServicesFromDb = async () => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('services').select('*');
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to local dataset', err);
    return null;
  }
};
