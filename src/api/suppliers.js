// ============================================
// FILE: api/suppliers.js
// ============================================
import { supabase } from '../lib/supabase';

export const suppliersApi = {
  async list() {
    const { data, error } = await supabase.from('suppliers').select('*').order('nama');
    if (error) throw error;
    return data;
  },
};