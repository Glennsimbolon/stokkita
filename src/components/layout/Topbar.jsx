// ============================================
// KOMPONEN: Topbar
// FUNGSI: Search bar, scan barcode (simulasi),
//         tombol tambah barang, avatar user
// ============================================

import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export function Topbar({ onAddClick }) {
  const {
    query, setQuery, go, toast,
    sidebarOpen, setSidebarOpen,
  } = useApp();

  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (e.target.value) go('stok');
  };

  const handleScan = () => {
    setQuery('KP-0142');
    go('stok');
    toast('Barcode terdeteksi: KP-0142');
  };

  return (
    <div className="top">
      <Button
        className="menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Buka menu"
      >
        Menu
      </Button>

      <input
        type="search"
        value={query}
        onChange={handleSearch}
        placeholder="Cari SKU atau produk…"
        aria-label="Cari SKU atau produk"
      />

      <Button onClick={handleScan}>Scan Barcode</Button>
      <Button variant="pri" onClick={onAddClick}>+ Barang Baru</Button>

      <div className="av" aria-label="Akun AR">AR</div>
    </div>
  );
}

// ---------- PROPS ----------
//   onAddClick: () => void  (buka modal tambah barang)