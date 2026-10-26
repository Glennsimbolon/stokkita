// ============================================
// FILE: api/users.js
// ============================================
import { supabase } from '../lib/supabase';

export const usersApi = {
  async list() {
    const { data, error } = await supabase.from('users').select('*').order('nama');
    if (error) throw error;
    return data;
  },
};