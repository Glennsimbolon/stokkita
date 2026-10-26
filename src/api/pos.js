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

    // 2. Simpan detail barangnya
    const detailData = details.map(d => ({
      ...d,
      po_id: newPo.id
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