// ============================================
// PAGE: Suppliers
// FUNGSI: CRUD & Toggle Status Pemasok
// ============================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

export default function Suppliers() {
  const { suppliers, addSupplier, toggleSupplierStatus, removeSupplier } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ kode: '', nama: '', kota: '', telp: '', aktif: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addSupplier(form);
    setIsOpen(false);
    setForm({ kode: '', nama: '', kota: '', telp: '', aktif: true });
  };

  return (
    <>
      <PageHeader
        title="Pemasok"
        subtitle={`${suppliers.length} pemasok terdaftar`}
        action={<Button variant="pri" onClick={() => setIsOpen(true)}>+ Tambah Pemasok</Button>}
      />

      <Card>
        {suppliers.length === 0 && <p className="sub">Belum ada pemasok.</p>}
        
        {suppliers.map((s) => (
          <div className="li" key={s.id} style={{ alignItems: 'center' }}>
            <div>
              <b>{s.nama}</b>
              <small>{s.kode} · {s.kota} · {s.telp}</small>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Badge tone={s.aktif ? 'ok' : 'wr'}>
                {s.aktif ? 'Aktif' : 'Nonaktif'}
              </Badge>
              <Button
                size="sm"
                onClick={() => toggleSupplierStatus(s.kode, s.aktif)}
              >
                {s.aktif ? 'Nonaktifkan' : 'Aktifkan'}
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (window.confirm(`Hapus pemasok ${s.nama}?`)) removeSupplier(s.kode);
                }}
                style={{ color: 'red' }}
              >
                Hapus
              </Button>
            </div>
          </div>
        ))}
      </Card>

      {/* Modal Tambah Pemasok */}
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="stack">
          <h2 style={{ margin: 0 }}>Tambah Pemasok</h2>
          <Input label="Kode" name="kode" value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} required />
          <Input label="Nama Pemasok" name="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required />
          <Input label="Kota" name="kota" value={form.kota} onChange={(e) => setForm({ ...form, kota: e.target.value })} required />
          <Input label="Telepon" name="telp" value={form.telp} onChange={(e) => setForm({ ...form, telp: e.target.value })} required />
          <div className="row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" onClick={() => setIsOpen(false)}>Batal</Button>
            <Button variant="pri" type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}