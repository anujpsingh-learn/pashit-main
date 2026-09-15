import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fgwcaxvuabpvfweytqvf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_VShgZv7JcNJv9y56_AbNbg_QBXjSlap';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
