// ============================================
// PAGE: Reports
// FUNGSI: Laporan lengkap (Aset, PO, SO, Opname, Transfer)
// ============================================

import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { rp, nf } from '../utils/format';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { GUDANG } from '../data/constants';

export default function Reports() {
  const { items, pos, so, transfers, opnames } = useApp();

  // ---------- KALKULASI ----------
  const totalNilaiAset = items.reduce((a, i) => a + (i.stok * i.harga), 0);
  const totalUnitAset  = items.reduce((a, i) => a + i.stok, 0);

  const nilaiPerGudang = GUDANG.map((g) => {
    const total = items
      .filter((i) => i.gudang === g)
      .reduce((a, i) => a + (i.stok * i.harga), 0);
    const unit = items.filter((i) => i.gudang === g).reduce((a, i) => a + i.stok, 0);
    return { gudang: g, nilai: total, unit };
  });

  const totalPO = pos.length;
  const totalBelanja = pos.reduce((a, p) => a + p.amount, 0);
  const poSelesai = pos.filter(p => p.kolom === 3).length;

  const totalSO = so.length;
  const totalPendapatan = so.reduce((a, s) => a + s.amount, 0);
  const soSelesai = so.filter(s => s.kolom === 3).length;

  const totalOpname = opnames.length;
  const totalSelisih = opnames.reduce((a, o) => a + o.selisih, 0);
  const totalTransfer = transfers.length;

  const produkTermahal = useMemo(() => {
    return [...items]
      .sort((a, b) => (b.stok * b.harga) - (a.stok * a.harga))
      .slice(0, 10);
  }, [items]);

  return (
    <>
      <PageHeader
        title="Laporan & Analitik"
        subtitle="Ringkasan seluruh aktivitas bisnis StokKita"
      />

      {/* ====== BAGIAN 1: KARTU UTAMA ====== */}
      <div className="row">
        {/* Kartu Nilai Aset (Gelap) */}
        <Card className="kpi" style={{ flex: 2, background: 'var(--side)', color: '#fff', padding: 24 }}>
          <div className="l" style={{ color: '#CFE3E1', fontSize: 13 }}>Nilai Aset Persediaan</div>
          <div className="v" style={{ color: 'var(--mint)', fontSize: 32, margin: '8px 0' }}>
            {rp(totalNilaiAset)}
          </div>
          <div style={{ color: '#CFE3E1', fontSize: 12 }}>
            {nf(totalUnitAset)} unit · {items.length} SKU aktif
          </div>
        </Card>

        {/* Kartu Belanja */}
        <Card className="kpi" style={{ flex: 1 }}>
          <div className="l">Total Belanja (PO)</div>
          <div className="v" style={{ color: '#DC2626' }}>{rp(totalBelanja)}</div>
          <div className="d">{totalPO} Purchase Order</div>
        </Card>

        {/* Kartu Pendapatan */}
        <Card className="kpi" style={{ flex: 1 }}>
          <div className="l">Total Pendapatan (SO)</div>
          <div className="v" style={{ color: '#166534' }}>{rp(totalPendapatan)}</div>
          <div className="d">{totalSO} Sales Order</div>
        </Card>
      </div>

      {/* ====== BAGIAN 2: GRID DETAIL ====== */}
      <div className="row">
        {/* Nilai Aset per Gudang */}
        <Card style={{ flex: 1, minWidth: 280 }}>
          <div className="h2">Nilai Aset per Gudang</div>
          {nilaiPerGudang.map((g) => (
            <div key={g.gudang} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Gudang {g.gudang}</span>
                <span style={{ fontWeight: 700, color: 'var(--acc)' }}>{rp(g.nilai)}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--mut)' }}>{nf(g.unit)} unit</div>
            </div>
          ))}
        </Card>

        {/* Ringkasan Operasional */}
        <Card style={{ flex: 1, minWidth: 280 }}>
          <div className="h2">Ringkasan Operasional</div>
          
          <div className="li">
            <span>PO Selesai</span>
            <b>{poSelesai} / {totalPO}</b>
          </div>
          <div className="li">
            <span>SO Selesai</span>
            <b>{soSelesai} / {totalSO}</b>
          </div>
          <div className="li">
            <span>Total Transfer Gudang</span>
            <b>{totalTransfer} kali</b>
          </div>
          <div className="li">
            <span>Stock Opname</span>
            <b>{totalOpname} kali</b>
          </div>
          <div className="li">
            <span>Selisih Fisik Opname</span>
            <b style={{ color: totalSelisih < 0 ? '#DC2626' : '#166534' }}>
              {totalSelisih > 0 ? '+' : ''}{totalSelisih} unit
            </b>
          </div>
        </Card>
      </div>

      {/* ====== BAGIAN 3: TABEL PRODUK ====== */}
      <Card>
        <div className="h2">10 Produk dengan Nilai Stok Terbesar</div>
        <div className="tw">
          <table className="tbl">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Produk</th>
                <th>Gudang</th>
                <th>Stok</th>
                <th>Harga Satuan</th>
                <th>Total Nilai</th>
              </tr>
            </thead>
            <tbody>
              {produkTermahal.map((i) => (
                <tr key={i.id}>
                  <td>{i.sku}</td>
                  <td><b>{i.nama}</b></td>
                  <td>{i.gudang}</td>
                  <td>{nf(i.stok)}</td>
                  <td>{rp(i.harga)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--acc)' }}>{rp(i.stok * i.harga)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}