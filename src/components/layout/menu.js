// ============================================
// FILE: menu.js
// FUNGSI: Daftar 12 menu (single source of truth)
// Mau tambah/ubah menu? Edit di sini saja.
// ============================================

export const MENU = [
  {
    group: 'Operasional',
    items: [
      { id: 'dash',     label: 'Dasbor',            icon: '📊' },
      { id: 'stok',     label: 'Stok Produk',       icon: '📦' },
      { id: 'po',       label: 'Pembelian (PO)',    icon: '🛒' },
      { id: 'so',       label: 'Penjualan (SO)',    icon: '💰' },
      { id: 'transfer', label: 'Transfer Gudang',   icon: '🔀' },
      { id: 'opname',   label: 'Stock Opname',      icon: '📋' },
    ],
  },
  {
    group: 'Insight',
    items: [
      { id: 'forecast', label: 'Prediksi & Reorder', icon: '🔮' },
      { id: 'reports',  label: 'Laporan',            icon: '📈' },
    ],
  },
  {
    group: 'Pengaturan',
    items: [
      { id: 'warehouses',   label: 'Gudang & Lokasi',  icon: '🏢' },
      { id: 'suppliers',    label: 'Pemasok',          icon: '🚚' },
      { id: 'integrations', label: 'Integrasi',        icon: '🔌' },
      { id: 'users',        label: 'Pengguna & Akses', icon: '👥' },
    ],
  },
];