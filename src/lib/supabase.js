// ============================================
// FILE: lib/supabase.js
// FUNGSI: Inisialisasi Supabase client
// Satu-satunya tempat yang import library supabase
// ============================================

import { createClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL;
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validasi dini — error jelas kalau .env belum diisi
if (!url || !key) {
  throw new Error(
    'VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum di-set di .env.local'
  );
}

export const supabase = createClient(url, key);