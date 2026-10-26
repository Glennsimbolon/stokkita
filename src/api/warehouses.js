// ============================================
// FILE: api/warehouses.js
// ============================================
import { supabase } from '../lib/supabase';

export const warehousesApi = {
  async list() {
    const { data, error } = await supabase.from('warehouses').select('*').order('nama');
    if (error) throw error;
    return data;
  },
};