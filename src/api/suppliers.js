// ============================================
// FILE: api/suppliers.js
// FUNGSI: CRUD untuk tabel suppliers
// ============================================

import { supabase } from '../lib/supabase';

export const suppliersApi = {
   async list() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .is('deleted_at', null) // ✅ TAMBAHKAN BARIS INI
      .order('nama');
    if (error) throw error;
    return data;
  },

  async create(supplier) {
    const { data, error } = await supabase
      .from('suppliers')
      .insert(supplier)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(kode, patch) {
    const { data, error } = await supabase
      .from('suppliers')
      .update(patch)
      .eq('kode', kode)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(kode) {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('kode', kode);
    if (error) throw error;
  },
};