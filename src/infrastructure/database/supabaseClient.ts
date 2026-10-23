import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vpsyrnrteotrrjuvilmh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwc3lybnJ0ZW90cnJqdXZpbG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NjYwNzYsImV4cCI6MjEwODI0MjA3Nn0.1ol5h30ilqLilxRkDUjOQUZM0QpMZROvIxA7n8SMGNU';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
