
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://cxrlytcsoyfkevoewkvk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cmx5dGNzb3lma2V2b2V3a3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODg3NjYsImV4cCI6MjA1NTk2NDc2Nn0.fQwJIQyuJhe8dGFCzaV5XPALeD3fZrHB_rXajqTosLs";

export const supabase = createClient(supabaseUrl, supabaseKey);
