// ============================================
// PAGE: Warehouses
// FUNGSI: CRUD gudang + statistik stok real-time
// ============================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { nf, rp } from '../utils/format';

export default function Warehouses() {
  const { warehouses, items, transfers, addWarehouse, deleteWarehouse } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ kode: '', nama: '', kota: '', kapasitas: 10000 });

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama.trim()) return alert('Nama gudang wajib diisi!');

    // ✅ Tidak mengirim 'kode', karena akan dibuat otomatis di AppContext
    await addWarehouse({
      nama: form.nama.trim(),
      kota: form.kota.trim() || form.nama.trim(),
      kapasitas: Number(form.kapasitas),
    });
    
    setIsOpen(false);
    setForm({ kode: '', nama: '', kota: '', kapasitas: 10000 });
  };
  // Hitung statistik per gudang
  const getStats = (namaGudang) => {
    const stokAwal = items.filter((i) => i.gudang === namaGudang).reduce((a, i) => a + i.stok, 0);
    const nilaiAset = items
      .filter((i) => i.gudang === namaGudang)
      .reduce((a, i) => a + i.stok * i.harga, 0);
    
    const masuk = transfers
      .filter((t) => t.ke === namaGudang && t.status === 'diterima')
      .reduce((a, t) => a + t.qty, 0);
    const keluar = transfers
      .filter((t) => t.dari === namaGudang && t.status === 'diterima')
      .reduce((a, t) => a + t.qty, 0);

    return { stokAwal, nilaiAset, masuk, keluar, total: stokAwal + masuk - keluar };
  };

  return (
    <>
      <PageHeader
        title="Gudang & Lokasi"
        subtitle={`${warehouses.length} gudang aktif`}
        action={<Button variant="pri" onClick={() => setIsOpen(true)}>+ Tambah Gudang</Button>}
      />

      <div className="row">
        {warehouses.map((w) => {
          const stats = getStats(w.nama);
          const totalStok = items.filter((i) => i.gudang === w.nama).length;
          
          return (
            <Card key={w.id} style={{ flex: 1, minWidth: 280 }}>
              {/* Header Gudang */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{w.nama}</div>
                  <div className="sub">{w.kode} · {w.kota}</div>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    if (stats.stokAwal > 0) {
                      alert(`Tidak bisa hapus! Masih ada ${stats.stokAwal} unit di gudang ini.`);
                      return;
                    }
                    if (window.confirm(`Hapus gudang ${w.nama}?`)) deleteWarehouse(w.kode);
                  }}
                  style={{ color: '#ef4444' }}
                >
                  🗑️
                </Button>
              </div>

              {/* Statistik */}
              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--mut)' }}>Total Aset</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--acc)' }}>
                  {rp(stats.nilaiAset)}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <div>
                  <div style={{ color: 'var(--mut)' }}>Stok</div>
                  <b>{nf(stats.total)} unit</b>
                </div>
                <div>
                  <div style={{ color: 'var(--mut)' }}>SKU</div>
                  <b>{totalStok} produk</b>
                </div>
                <div>
                  <div style={{ color: 'var(--mut)' }}>Transfer</div>
                  <b>+{stats.masuk} / -{stats.keluar}</b>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

            {/* Modal Tambah Gudang */}
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="stack" style={{ gap: 16 }}>
          <h2 style={{ margin: 0 }}>Tambah Gudang Baru</h2>
          <p className="sub" style={{ marginTop: -8, marginBottom: 4 }}>
            Kode gudang akan dibuat otomatis oleh sistem.
          </p>
          
          <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--mut)', marginBottom: 12, textTransform: 'uppercase' }}>
              📍 Informasi Gudang
            </div>

            {/* ✅ Input Kode Gudang DIHAPUS */}
            <Input
              label="Nama Gudang *"
              placeholder="cth: Bandung"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
            />
            
            <div className="row" style={{ marginTop: 12 }}>
              <Input
                label="Kota"
                placeholder="cth: Bandung"
                value={form.kota}
                onChange={(e) => setForm({ ...form, kota: e.target.value })}
                style={{ flex: 1 }}
              />
              <Input
                label="Kapasitas (unit)"
                type="number"
                min="1"
                value={form.kapasitas}
                onChange={(e) => setForm({ ...form, kapasitas: e.target.value })}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className="row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" onClick={() => setIsOpen(false)}>Batal</Button>
            <Button variant="pri" type="submit">💾 Simpan Gudang</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}