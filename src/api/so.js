// ============================================
// FILE: api/so.js
// FUNGSI: CRUD SO beserta detail barangnya
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

    async create(so, details) {
    // 1. Buat header SO
    const { data: newSo, error: errSo } = await supabase
      .from('sales_orders')
      .insert(so)
      .select()
      .single();
    if (errSo) throw errSo;

    // 2. Simpan detail barangnya (Hanya ambil kolom yang ada di DB)
    const detailData = details.map(d => ({
      so_id: newSo.id,
      item_id: d.item_id,
      qty: d.qty,
      harga_satuan: d.harga_satuan
      // 'nama' tidak dimasukkan karena tidak ada di tabel database
    }));
    
    const { error: errDetail } = await supabase
      .from('so_items')
      .insert(detailData);
    if (errDetail) throw errDetail;

    return newSo;
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
};