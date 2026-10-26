// ============================================
// FILE: api/pos.js
// FUNGSI: CRUD PO beserta detail barangnya
// ============================================

import { supabase } from '../lib/supabase';

export const posApi = {
  async list() {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

   async create(po, details) {
    // 1. Buat header PO
    const { data: newPo, error: errPo } = await supabase
      .from('purchase_orders')
      .insert(po)
      .select()
      .single();
    if (errPo) throw errPo;

    // 2. Simpan detail barangnya (Hanya ambil kolom yang ada di DB)
    const detailData = details.map(d => ({
      po_id: newPo.id,
      item_id: d.item_id,
      qty: d.qty,
      harga_satuan: d.harga_satuan
      // 'nama' tidak dimasukkan
    }));
    
    const { error: errDetail } = await supabase
      .from('po_items')
      .insert(detailData);
    if (errDetail) throw errDetail;

    return newPo;
  },

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
};