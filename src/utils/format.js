// ============================================
// FILE: format.js
// FUNGSI: Format angka & mata uang Indonesia
// ============================================

// 140000 → "Rp 140.000"
export const rp = (n) => 'Rp ' + n.toLocaleString('id-ID');

// 1400 → "1.400"
export const nf = (n) => n.toLocaleString('id-ID');