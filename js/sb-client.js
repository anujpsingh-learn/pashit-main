// Load Supabase from CDN in your HTML <head> BEFORE this file:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>

const SUPABASE_URL = 'https://fgwcaxvuabpvfweytqvf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_VShgZv7JcNJv9y56_AbNbg_QBXjSlap'; // from Project Settings → API

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);