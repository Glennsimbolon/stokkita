// ============================================
// KOMPONEN: NewItemForm
// FUNGSI: Form tambah barang dengan validasi & UI rapi
// ============================================

import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GUDANG } from '../../data/constants';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export function NewItemForm({ onClose }) {
  const { addItem, toast, go } = useApp();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    sku: '',
    nama: '',
    kategori: 'Umum',
    gudang: 'Jakarta',
    stok: 0,
    reorder: 50,
    harga: 10000,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sku || !form.nama) return toast('SKU dan Nama wajib diisi!');
    
    setLoading(true);
    try {
      await addItem({
        ...form,
        // Pastikan angka dikonversi ke integer
        stok: Number(form.stok),
        reorder: Number(form.reorder),
        harga: Number(form.harga),
        // Field optional
        ed_hari: null,
      });
      onClose(); // Tutup modal
      go('stok'); // Pindah ke halaman stok agar user lihat hasilnya
    } catch (err) {
      // Error ditangani di AppContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stack" style={{ gap: 16 }}>
      <div>
        <h2 style={{ margin: 0 }}>Tambah Barang Baru</h2>
        <p className="sub" style={{ marginTop: 4 }}>Isi detail produk yang akan ditambahkan ke inventaris.</p>
      </div>

      <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="row">
          <Input 
            label="SKU / Kode Barang" 
            name="sku" 
            placeholder="cth: KP-0143"
            value={form.sku} 
            onChange={handleChange} 
            required 
            style={{ flex: 1 }}
          />
          <Input 
            label="Nama Produk" 
            name="nama" 
            placeholder="cth: Kopi Arabika 1 kg"
            value={form.nama} 
            onChange={handleChange} 
            required 
            style={{ flex: 2 }}
          />
        </div>
        
        <div className="row">
          <Select label="Kategori" name="kategori" value={form.kategori} onChange={handleChange} style={{ flex: 1 }}>
            <option>Umum</option>
            <option>Minuman</option>
            <option>Makanan</option>
            <option>Kemasan</option>
            <option>Bahan pokok</option>
          </Select>
          <Select label="Gudang" name="gudang" value={form.gudang} onChange={handleChange} style={{ flex: 1 }}>
            {GUDANG.map((g) => <option key={g}>{g}</option>)}
          </Select>
        </div>
      </div>

      <div className="row" style={{ background: '#F1F5F9', padding: 16, borderRadius: 8 }}>
        <Input 
          label="Stok Awal" 
          name="stok" 
          type="number" 
          min="0"
          value={form.stok} 
          onChange={handleChange} 
          required 
          style={{ flex: 1 }}
        />
        <Input 
          label="Titik Reorder (Min. Stok)" 
          name="reorder" 
          type="number" 
          min="0"
          value={form.reorder} 
          onChange={handleChange} 
          required 
          style={{ flex: 1 }}
        />
        <Input 
          label="Harga Satuan (Rp)" 
          name="harga" 
          type="number" 
          min="0"
          value={form.harga} 
          onChange={handleChange} 
          required 
          style={{ flex: 1 }}
        />
      </div>

      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
        <Button type="button" onClick={onClose} disabled={loading}>Batal</Button>
        <Button variant="pri" type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Barang'}
        </Button>
      </div>
    </form>
  );
}