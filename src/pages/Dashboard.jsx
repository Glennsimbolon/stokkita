// ============================================
// PAGE: Dashboard
// FUNGSI: Ringkasan Bisnis (Aset, PO, SO, Laba/Rugi)
// ============================================

import { useApp } from '../context/AppContext';
import { rp, nf } from '../utils/format';
import { getStatus } from '../utils/status';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';

export default function Dashboard() {
  const { items, pos, so } = useApp();

  // ---------- 1. PERHITUNGAN ASET ----------
  const nilaiAset = items.reduce((a, i) => a + (i.stok * i.harga), 0);
  const stokMenipis = items.filter((i) => i.stok < i.reorder).length;

  // ---------- 2. PERHITUNGAN KEUANGAN ----------
  // Pendapatan: Hanya ambil SO yang sudah Selesai (kolom 3)
  const soSelesai = so.filter(s => s.kolom === 3);
  const totalPendapatan = soSelesai.reduce((a, s) => a + s.amount, 0);

  // Belanja: Hanya ambil PO yang sudah Selesai (kolom 3)
  const poSelesai = pos.filter(p => p.kolom === 3);
  const totalBelanja = poSelesai.reduce((a, p) => a + p.amount, 0);

  // Laba/Rugi Bersih
  const labaBersih = totalPendapatan - totalBelanja;
  const isUntung = labaBersih >= 0;

  return (
    <>
      <PageHeader
        title="Dasbor Bisnis"
        subtitle="Ringkasan performa dan kesehatan inventori"
      />

      {/* ===== BARIS 1: KARTU KEUANGAN (Laba/Rugi) ===== */}
      <div className="row">
        <Card className="kpi" style={{ flex: 1, borderLeft: '4px solid #166534' }}>
          <div className="l">Total Pendapatan (SO)</div>
          <div className="v" style={{ color: '#166534' }}>{rp(totalPendapatan)}</div>
          <div className="d">{soSelesai.length} Pesanan Selesai</div>
        </Card>

        <Card className="kpi" style={{ flex: 1, borderLeft: '4px solid #DC2626' }}>
          <div className="l">Total Belanja (PO)</div>
          <div className="v" style={{ color: '#DC2626' }}>{rp(totalBelanja)}</div>
          <div className="d">{poSelesai.length} Pembelian Selesai</div>
        </Card>

        <Card className="kpi" style={{ flex: 1, background: isUntung ? '#166534' : '#991B1B', color: '#fff' }}>
          <div className="l" style={{ color: '#fff', opacity: 0.8 }}>Laba / Rugi Bersih</div>
          <div className="v" style={{ color: '#fff' }}>
            {isUntung ? '+' : ''}{rp(labaBersih)}
          </div>
          <div className="d" style={{ color: '#fff', opacity: 0.8 }}>
            {isUntung ? '📈 Bisnis Untung' : '📉 Bisnis Rugi'}
          </div>
        </Card>
      </div>

      {/* ===== BARIS 2: KARTU ASET & STOK ===== */}
      <div className="row">
        <Card className="kpi" style={{ flex: 2 }}>
          <div className="l">Total Nilai Aset Persediaan</div>
          <div className="v">{rp(nilaiAset)}</div>
          <div className="d">{items.length} SKU aktif di 3 gudang</div>
        </Card>

        <Card className="kpi" style={{ flex: 1 }}>
          <div className="l">Stok Menipis</div>
          <div className="v" style={{ color: stokMenipis > 0 ? '#DC2626' : '#166534' }}>
            {stokMenipis} SKU
          </div>
          <div className="d">{stokMenipis > 0 ? 'Perlu restock segera!' : 'Semua aman'}</div>
        </Card>
      </div>

      {/* ===== BARIS 3: PERLU PERHATIAN ===== */}
      <Card>
        <div className="h2">Produk Perlu Perhatian</div>
        {items.filter(i => i.stok < i.reorder).length === 0 && (
          <p className="sub">Semua stok dalam kondisi aman.</p>
        )}
        {items.filter(i => i.stok < i.reorder).map((i) => {
          const [tone, label] = getStatus(i);
          return (
            <div className="li" key={i.id}>
              <div>
                <b>{i.nama}</b>
                <small>{i.sku} · {i.gudang} · sisa {nf(i.stok)}</small>
              </div>
              <Badge tone={tone}>{label}</Badge>
            </div>
          );
        })}
      </Card>
    </>
  );
}