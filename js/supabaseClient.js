
const SUPABASE_URL = "https://onsbxjfexnewuuuhtcve.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uc2J4amZleG5ld3V1dWh0Y3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTU2MTksImV4cCI6MjA4OTU5MTYxOX0.1KLH9CjO7V9_PWQflpZo56KyjhtaQi1M6zYWPCzFtks";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
