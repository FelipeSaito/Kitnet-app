import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://yqohevzqrwigjmfbzxbi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxb2hldnpxcndpZ2ptZmJ6eGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjI4ODQsImV4cCI6MjA5MjkzODg4NH0.X8AXRj42t4Z2qrXGXxtdH9rQPgriUkvsSf5xuTLXt3Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});