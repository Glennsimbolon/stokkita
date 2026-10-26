// ============================================
// PAGE: Reports
// FUNGSI: Laporan nilai persediaan + Export CSV & PDF
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
  const { items } = useApp();

  // ---------- KALKULASI DATA ----------
  const totalNilai = items.reduce((a, i) => a + (i.stok * i.harga), 0);
  const totalUnit  = items.reduce((a, i) => a + i.stok, 0);

  const nilaiPerGudang = GUDANG.map((g) => {
    const total = items
      .filter((i) => i.gudang === g)
      .reduce((a, i) => a + (i.stok * i.harga), 0);
    return { gudang: g, nilai: total };
  });

  const produkTermahal = useMemo(() => {
    return [...items]
      .sort((a, b) => (b.stok * b.harga) - (a.stok * a.harga))
      .slice(0, 10);
  }, [items]);

  // ---------- EXPORT CSV ----------
  const handleExportCSV = () => {
    const headers = ['SKU', 'Nama', 'Kategori', 'Gudang', 'Stok', 'Harga', 'Total Nilai'];
    const rows = items.map((i) => [
      i.sku,
      `"${i.nama}"`,
      i.kategori,
      i.gudang,
      i.stok,
      i.harga,
      i.stok * i.harga,
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

    // --- HEADER ---
    doc.setFontSize(20);
    doc.setTextColor(15, 118, 110); // warna aksen
    doc.text('StokKita — Laporan Persediaan', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, pageWidth / 2, 27, { align: 'center' });
    
    // --- RINGKASAN ---
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Total Nilai Aset: Rp ${totalNilai.toLocaleString('id-ID')}`, 14, 40);
    doc.text(`Total Unit Barang: ${totalUnit.toLocaleString('id-ID')} unit`, 14, 47);
    doc.text(`Total SKU: ${items.length}`, 14, 54);

    // --- TABEL NILAI PER GUDANG ---
    autoTable(doc, {
      startY: 62,
      head: [['Gudang', 'Nilai Aset']],
      body: nilaiPerGudang.map((g) => [
        g.gudang,
        `Rp ${g.nilai.toLocaleString('id-ID')}`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [15, 118, 110] },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });

    // --- TABEL 10 PRODUK TERMAHAL ---
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('10 Produk dengan Nilai Stok Terbesar', 14, finalY);

    autoTable(doc, {
      startY: finalY + 4,
      head: [['SKU', 'Produk', 'Gudang', 'Stok', 'Harga', 'Total Nilai']],
      body: produkTermahal.map((i) => [
        i.sku,
        i.nama,
        i.gudang,
        nf(i.stok),
        `Rp ${i.harga.toLocaleString('id-ID')}`,
        `Rp ${(i.stok * i.harga).toLocaleString('id-ID')}`,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [15, 118, 110] },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    });

    // --- FOOTER ---
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

    // --- SAVE ---
    doc.save(`Laporan_StokKita_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <>
      <PageHeader
        title="Laporan Persediaan"
        subtitle="Ringkasan nilai aset dan stok barang"
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={handleExportCSV}>📥 Export CSV</Button>
            <Button variant="pri" onClick={handleExportPDF}>📄 Export PDF</Button>
          </div>
        }
      />

      <div className="row">
        <Card className="kpi" style={{ flex: 2, background: 'var(--side)', color: '#fff' }}>
          <div className="l" style={{ color: '#CFE3E1' }}>Total Nilai Aset Persediaan</div>
          <div className="v" style={{ color: 'var(--mint)' }}>{rp(totalNilai)}</div>
          <div className="d" style={{ color: '#CFE3E1' }}>Berdasarkan {items.length} SKU aktif</div>
        </Card>
        
        <Card className="kpi" style={{ flex: 1 }}>
          <div className="l">Total Unit Barang</div>
          <div className="v">{nf(totalUnit)}</div>
          <div className="d">Seluruh gudang</div>
        </Card>
      </div>

      <div className="row">
        <Card style={{ flex: 1, minWidth: 260 }}>
          <div className="h2">Nilai Aset per Gudang</div>
          {nilaiPerGudang.map((g) => (
            <div className="li" key={g.gudang}>
              <span>Gudang {g.gudang}</span>
              <b style={{ color: 'var(--acc)' }}>{rp(g.nilai)}</b>
            </div>
          ))}
        </Card>

        <Card style={{ flex: 2, minWidth: 300 }}>
          <div className="h2">10 Produk dengan Nilai Stok Terbesar</div>
          <div className="tw">
            <table className="tbl" style={{ minWidth: 'auto' }}>
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Stok</th>
                  <th>Harga Satuan</th>
                  <th>Total Nilai</th>
                </tr>
              </thead>
              <tbody>
                {produkTermahal.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <b>{i.nama}</b>
                      <small style={{ display: 'block', color: 'var(--mut)' }}>{i.sku}</small>
                    </td>
                    <td>{nf(i.stok)}</td>
                    <td>{rp(i.harga)}</td>
                    <td style={{ fontWeight: 600 }}>{rp(i.stok * i.harga)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}