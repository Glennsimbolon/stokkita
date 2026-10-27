// ============================================
// KOMPONEN: NewItemForm
// FUNGSI: Form tambah barang dengan Auto-SKU
// ============================================

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GUDANG } from '../../data/constants';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

// ✅ Peta prefix SKU (Kode Unik per Kategori)
const SKU_PREFIX = {
  'Minuman':     'MNM',
  'Makanan':     'MKN',
  'Kemasan':     'KMS',
  'Bahan pokok': 'BHP',
  'Elektronik':  'ELK',
  'Alat Tulis':  'ATK',
  'Umum':        'UMN',
};

export function NewItemForm({ onClose }) {
  const { items, addItem, toast, go } = useApp();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    sku: '',
    nama: '',
    kategori: 'Minuman',
    gudang: 'Jakarta',
    stok: 0,
    reorder: 50,
    harga: 10000,
    ed_hari: '',
  });

  // ✅ GENERATE SKU OTOMATIS
  // Berjalan setiap kali kategori berubah, atau daftar items berubah
  useEffect(() => {
    const prefix = SKU_PREFIX[form.kategori] || 'UMN';
    
    // Cari semua produk dengan prefix yang sama di database
    const samePrefix = items
      .filter((i) => i.sku.startsWith(prefix + '-'))
      .map((i) => parseInt(i.sku.split('-')[1], 10))
      .filter((n) => !isNaN(n));
    
    // Ambil nomor terbesar, lalu +1
    const nextNumber = samePrefix.length ? Math.max(...samePrefix) + 1 : 1;
    
    // Format jadi 3 digit (001, 002, dst)
    const nextSku = `${prefix}-${String(nextNumber).padStart(3, '0')}`;
    
    // Simpan ke state form
    setForm((prev) => ({ ...prev, sku: nextSku }));
  }, [form.kategori, items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama.trim()) {
      toast('Nama produk wajib diisi!');
      return;
    }

    if (Number(form.harga) <= 0) {
      toast('Harga harus lebih dari 0!');
      return;
    }

    setLoading(true);
    try {
      await addItem({
        sku: form.sku,
        nama: form.nama.trim(),
        kategori: form.kategori,
        gudang: form.gudang,
        stok: Number(form.stok),
        reorder: Number(form.reorder),
        harga: Number(form.harga),
        ed_hari: form.ed_hari ? Number(form.ed_hari) : null,
      });
      onClose();
      go('stok');
    } catch (err) {
      // Error sudah di-handle di AppContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stack" style={{ gap: 20 }}>
      
      <div>
        <h2 style={{ margin: 0 }}>Tambah Barang Baru</h2>
        <p className="sub" style={{ marginTop: 4 }}>
          Pilih kategori, sistem akan membuatkan SKU otomatis.
        </p>
      </div>

      {/* BAGIAN 1: KATEGORI & SKU */}
      <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 8, border: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--mut)', marginBottom: 12, textTransform: 'uppercase' }}>
          📦 Kategori & Kode
        </div>
        
        <div className="row" style={{ marginBottom: 12 }}>
          <Select 
            label="Kategori Produk *" 
            name="kategori" 
            value={form.kategori} 
            onChange={handleChange} 
            style={{ flex: 1 }}
          >
            {Object.keys(SKU_PREFIX).map((k) => <option key={k}>{k}</option>)}
          </Select>
          
          {/* Kotak SKU (Read-only, tidak bisa diedit) */}
          <div style={{ flex: 1 }}>
            <label className="field">
              SKU Otomatis
              <input
                value={form.sku}
                readOnly
                style={{
                  background: '#CCFBF1',
                  fontWeight: 700,
                  color: '#0F766E',
                  cursor: 'not-allowed',
                  textAlign: 'center',
                  letterSpacing: 1,
                }}
                title="SKU dibuat otomatis oleh sistem"
              />
            </label>
          </div>
        </div>

        <Input
          label="Nama Produk *"
          name="nama"
          placeholder="cth: Kopi Arabika 1 kg"
          value={form.nama}
          onChange={handleChange}
          required
        />
      </div>

      {/* BAGIAN 2: STOK */}
      <div style={{ background: '#F1F5F9', padding: 16, borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--mut)', marginBottom: 12, textTransform: 'uppercase' }}>
          📊 Stok & Peringatan
        </div>
        <div className="row" style={{ marginBottom: 12 }}>
          <Select label="Gudang" name="gudang" value={form.gudang} onChange={handleChange} style={{ flex: 1 }}>
            {GUDANG.map((g) => <option key={g}>{g}</option>)}
          </Select>
        </div>
        <div className="row">
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
            label="Titik Reorder"
            name="reorder"
            type="number"
            min="0"
            value={form.reorder}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
          <Input
            label="ED (hari)"
            name="ed_hari"
            type="number"
            min="0"
            placeholder="Opsional"
            value={form.ed_hari}
            onChange={handleChange}
            style={{ flex: 1 }}
          />
        </div>
      </div>

      {/* BAGIAN 3: HARGA */}
      <div style={{ background: '#FEF3C7', padding: 16, borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 12, textTransform: 'uppercase' }}>
          💰 Harga
        </div>
        <Input
          label="Harga Satuan (Rp)"
          name="harga"
          type="number"
          min="1"
          value={form.harga}
          onChange={handleChange}
          required
          placeholder="cth: 140000"
        />
      </div>

      {/* AKSI */}
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
        <Button type="button" onClick={onClose} disabled={loading}>Batal</Button>
        <Button variant="pri" type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : '💾 Simpan Barang'}
        </Button>
      </div>
    </form>
  );
}