// ============================================
// FILE: api/transfers.js
// FUNGSI: Request untuk tabel transfers
// ============================================

import { supabase } from '../lib/supabase';

export const transfersApi = {
  async list() {
    const { data, error } = await supabase
      .from('transfers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(t) {
    const { data, error } = await supabase
      .from('transfers')
      .insert(t)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(kode, patch) {
    const { data, error } = await supabase
      .from('transfers')
      .update(patch)
      .eq('kode', kode)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};