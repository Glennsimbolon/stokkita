// ============================================
// FILE: status.js
// FUNGSI: Tentukan status stok (aman/menipis/kritis/ED)
// ============================================

import { CRITICAL_RATIO } from '../data/constants';

// Return [tone, label]
// tone: 'ok' | 'wr' | 'er' | 'if'
export function getStatus(item) {
  // Guard: kalau field tidak lengkap, kembalikan aman
  const stok = item.stok ?? 0;
  const reorder = item.reorder ?? 0;
  const critical = reorder * CRITICAL_RATIO;

  if (stok <= critical) return ['er', 'Habis segera'];
  if (stok < reorder)   return ['wr', 'Menipis'];
  if (item.ed_hari)     return ['if', `ED ${item.ed_hari} hari`];
  return ['ok', 'Aman'];
}