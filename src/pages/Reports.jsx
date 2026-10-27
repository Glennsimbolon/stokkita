// ============================================
// PAGE: Reports
// FUNGSI: Laporan lengkap + Export CSV & PDF
// ============================================

import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { rp, nf } from '../utils/format';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GUDANG } from '../data/constants';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  // ---------- EXPORT CSV ----------
  const handleExportCSV = () => {
    const headers = ['SKU', 'Nama', 'Kategori', 'Gudang', 'Stok', 'Harga', 'Total Nilai'];
    const rows = items.map((i) => [
      i.sku, `"${i.nama}"`, i.kategori, i.gudang, i.stok, i.harga, i.stok * i.harga,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_StokKita_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ---------- EXPORT PDF ----------
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(15, 118, 110);
    doc.text('StokKita — Laporan Persediaan', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, pageWidth / 2, 27, { align: 'center' });

    // Ringkasan
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Total Nilai Aset: Rp ${totalNilaiAset.toLocaleString('id-ID')}`, 14, 40);
    doc.text(`Total Belanja (PO): Rp ${totalBelanja.toLocaleString('id-ID')} (${totalPO} PO)`, 14, 47);
    doc.text(`Total Pendapatan (SO): Rp ${totalPendapatan.toLocaleString('id-ID')} (${totalSO} SO)`, 14, 54);
    doc.text(`Total Opname: ${totalOpname} kali · Total Transfer: ${totalTransfer} kali`, 14, 61);

    // Tabel 1: Nilai Aset per Gudang
    autoTable(doc, {
      startY: 70,
      head: [['Gudang', 'Total Unit', 'Nilai Aset']],
      body: nilaiPerGudang.map((g) => [
        g.gudang, nf(g.unit), `Rp ${g.nilai.toLocaleString('id-ID')}`,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [15, 118, 110] },
      styles: { fontSize: 10 },
    });

    // Tabel 2: Top 10 Produk
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('10 Produk Nilai Stok Terbesar', 14, finalY);

    autoTable(doc, {
      startY: finalY + 4,
      head: [['SKU', 'Produk', 'Gudang', 'Stok', 'Harga', 'Total Nilai']],
      body: produkTermahal.map((i) => [
        i.sku, i.nama, i.gudang, nf(i.stok),
        `Rp ${i.harga.toLocaleString('id-ID')}`,
        `Rp ${(i.stok * i.harga).toLocaleString('id-ID')}`,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [15, 118, 110] },
      styles: { fontSize: 9 },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Halaman ${i} dari ${pageCount} — StokKita`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`Laporan_StokKita_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <>
      <PageHeader
        title="Laporan & Analitik"
        subtitle="Ringkasan seluruh aktivitas bisnis StokKita"
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={handleExportCSV}>📥 Export CSV</Button>
            <Button variant="pri" onClick={handleExportPDF}>📄 Export PDF</Button>
          </div>
        }
      />

      {/* ====== KARTU UTAMA ====== */}
      <div className="row">
        <Card className="kpi" style={{ flex: 2, background: 'var(--side)', color: '#fff', padding: 24 }}>
          <div className="l" style={{ color: '#CFE3E1', fontSize: 13 }}>Nilai Aset Persediaan</div>
          <div className="v" style={{ color: 'var(--mint)', fontSize: 32, margin: '8px 0' }}>
            {rp(totalNilaiAset)}
          </div>
          <div style={{ color: '#CFE3E1', fontSize: 12 }}>
            {nf(totalUnitAset)} unit · {items.length} SKU aktif
          </div>
        </Card>

        <Card className="kpi" style={{ flex: 1 }}>
          <div className="l">Total Belanja (PO)</div>
          <div className="v" style={{ color: '#DC2626' }}>{rp(totalBelanja)}</div>
          <div className="d">{totalPO} Purchase Order</div>
        </Card>

        <Card className="kpi" style={{ flex: 1 }}>
          <div className="l">Total Pendapatan (SO)</div>
          <div className="v" style={{ color: '#166534' }}>{rp(totalPendapatan)}</div>
          <div className="d">{totalSO} Sales Order</div>
        </Card>
      </div>

      {/* ====== GRID DETAIL ====== */}
      <div className="row">
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

        <Card style={{ flex: 1, minWidth: 280 }}>
          <div className="h2">Ringkasan Operasional</div>
          <div className="li"><span>PO Selesai</span><b>{poSelesai} / {totalPO}</b></div>
          <div className="li"><span>SO Selesai</span><b>{soSelesai} / {totalSO}</b></div>
          <div className="li"><span>Total Transfer Gudang</span><b>{totalTransfer} kali</b></div>
          <div className="li"><span>Stock Opname</span><b>{totalOpname} kali</b></div>
          <div className="li">
            <span>Selisih Fisik Opname</span>
            <b style={{ color: totalSelisih < 0 ? '#DC2626' : '#166534' }}>
              {totalSelisih > 0 ? '+' : ''}{totalSelisih} unit
            </b>
          </div>
        </Card>
      </div>

      {/* ====== TABEL PRODUK ====== */}
      <Card>
        <div className="h2">10 Produk dengan Nilai Stok Terbesar</div>
        <div className="tw">
          <table className="tbl">
            <thead>
              <tr>
                <th>SKU</th><th>Produk</th><th>Gudang</th>
                <th>Stok</th><th>Harga Satuan</th><th>Total Nilai</th>
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