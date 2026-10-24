// ============================================
// FILE: api/opnames.js
// FUNGSI: Request untuk tabel opnames
// ============================================

import { supabase } from '../lib/supabase';

export const opnamesApi = {
  async list() {
    const { data, error } = await supabase
      .from('opnames')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(o) {
    const { data, error } = await supabase
      .from('opnames')
      .insert(o)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};