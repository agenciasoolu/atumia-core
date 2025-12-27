
import { createClient } from '@supabase/supabase-js';

// Utilizando as credenciais fornecidas pelo usuário para estabelecer a conexão
const supabaseUrl = process.env.SUPABASE_URL || 'https://rfimlzqcmslmfupvlvqf.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmaW1senFjbXNsbWZ1cHZsdnFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE1MDA1OCwiZXhwIjoyMDgxNzI2MDU4fQ.fZh1czk4T7qPGA2DPvx4q62RMsXNhWW7fnwp5HScoWc';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
