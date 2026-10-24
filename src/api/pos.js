// ============================================
// FILE: api/pos.js
// FUNGSI: Semua request terkait tabel `purchase_orders`
// ============================================

import { supabase } from '../lib/supabase';

export const posApi = {
  // Ambil semua PO, urutkan dari yang terbaru
  async list() {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Buat PO baru
  async create(po) {
    const { data, error } = await supabase
      .from('purchase_orders')
      .insert(po)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update PO (partial) — misal pindah kolom kanban
  async update(kode, patch) {
    const { data, error } = await supabase
      .from('purchase_orders')
      .update(patch)
      .eq('kode', kode)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Hapus PO
  async remove(kode) {
    const { error } = await supabase
      .from('purchase_orders')
      .delete()
      .eq('kode', kode);

    if (error) throw error;
  },
};