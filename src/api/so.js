// ============================================
// FILE: api/so.js
// FUNGSI: Semua request untuk tabel sales_orders
// ============================================

import { supabase } from '../lib/supabase';

export const soApi = {
  async list() {
    const { data, error } = await supabase
      .from('sales_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(so) {
    const { data, error } = await supabase
      .from('sales_orders')
      .insert(so)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(kode, patch) {
    const { data, error } = await supabase
      .from('sales_orders')
      .update(patch)
      .eq('kode', kode)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(kode) {
    const { error } = await supabase
      .from('sales_orders')
      .delete()
      .eq('kode', kode);
    if (error) throw error;
  },
};