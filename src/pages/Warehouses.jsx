// ============================================
// PAGE: Warehouses
// FUNGSI: Menampilkan gudang & total stok yang akurat
// ============================================

import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { nf } from '../utils/format';

export default function Warehouses() {
  const { warehouses, items, transfers } = useApp();

  return (
    <>
      <PageHeader title="Gudang & Lokasi" subtitle={`${warehouses.length} gudang aktif`} />
      <div className="row">
        {warehouses.map((w) => {
          // 1. Stok awal produk yang terdaftar di gudang ini
          const stokAwal = items
            .filter((i) => i.gudang === w.nama)
            .reduce((a, i) => a + i.stok, 0);

          // 2. Hitung total barang masuk (transfer ke gudang ini)
          const totalMasuk = transfers
            .filter((t) => t.ke === w.nama && t.status === 'diterima')
            .reduce((a, t) => a + t.qty, 0);

          // 3. Hitung total barang keluar (transfer dari gudang ini)
          const totalKeluar = transfers
            .filter((t) => t.dari === w.nama && t.status === 'diterima')
            .reduce((a, t) => a + t.qty, 0);

          // 4. Total akhir
          const totalStok = stokAwal + totalMasuk - totalKeluar;

          return (
            <Card key={w.id} style={{ flex: 1, minWidth: 220 }}>
              <div className="h2">{w.nama}</div>
              <div className="sub">{w.kota} · Kapasitas {nf(w.kapasitas)}</div>
              
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>
                {nf(totalStok)} <span style={{fontSize:14, color:'var(--mut)'}}>unit</span>
              </div>
              
              <div style={{ fontSize: 12, color: 'var(--mut)', marginTop: 8, display: 'flex', gap: 12 }}>
                <span>Masuk: +{totalMasuk}</span>
                <span>Keluar: -{totalKeluar}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}