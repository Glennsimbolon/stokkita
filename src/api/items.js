// ============================================
// FILE: api/items.js
// FUNGSI: Semua request terkait tabel `items`
// ============================================

import { supabase } from '../lib/supabase';

export const itemsApi = {
  // Ambil semua produk
   async list() {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .is('deleted_at', null) // ✅ TAMBAHKAN BARIS INI
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Ambil satu produk berdasarkan SKU
  async getBySku(sku) {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('sku', sku)
      .single();

    if (error) throw error;
    return data;
  },

  // Tambah produk baru
  async create(item) {
    const { data, error } = await supabase
      .from('items')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update produk (partial)
  async update(sku, patch) {
    const { data, error } = await supabase
      .from('items')
      .update(patch)
      .eq('sku', sku)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Hapus produk
  async remove(sku) {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('sku', sku);

    if (error) throw error;
  },
};