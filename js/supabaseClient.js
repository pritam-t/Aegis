
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
