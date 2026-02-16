
const SUPABASE_URL = "https://stwizpiwwqzzggbeinjj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0d2l6cGl3d3F6emdnYmVpbmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjA4NjksImV4cCI6MjA4NjYzNjg2OX0.kXH5Ab3w90Wddn45g7yBjfQ7yzAaYFHoGWue_waxrdA"
;

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
