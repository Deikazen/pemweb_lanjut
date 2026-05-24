import { createClient } from '@supabase/supabase-js';




// Ganti nilai di bawah ini dengan URL dan Anon Key dari project Supabase kamu
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);