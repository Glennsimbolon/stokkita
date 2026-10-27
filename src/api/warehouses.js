// ============================================
// FILE: api/warehouses.js
// FUNGSI: CRUD untuk tabel warehouses
// ============================================

import { supabase } from '../lib/supabase';

export const warehousesApi = {
  // Ambil semua gudang
  async list() {
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .order('nama');
    if (error) throw error;
    return data;
  },

  // ✅ TAMBAH GUDANG BARU (Ini yang tadi hilang)
  async create(warehouse) {
    const { data, error } = await supabase
      .from('warehouses')
      .insert(warehouse)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update gudang
  async update(kode, patch) {
    const { data, error } = await supabase
      .from('warehouses')
      .update(patch)
      .eq('kode', kode)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Hapus gudang
  async remove(kode) {
    const { error } = await supabase
      .from('warehouses')
      .delete()
      .eq('kode', kode);
    if (error) throw error;
  },