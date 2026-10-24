// ============================================
// PAGE: Opname
// FUNGSI: Stock opname — koreksi stok sistem vs fisik
// ============================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { nf } from '../utils/format';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';

export default function Opname() {
  const { items, opnames, createOpname, toast } = useApp();
  const [form, setForm] = useState({ item_id: '', stok_fisik: 0, catatan: '' });

  const selectedItem = items.find((i) => i.id === form.item_id);
  const selisih = selectedItem ? Number(form.stok_fisik) - selectedItem.stok : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectItem = (e) => {
    const id = e.target.value;
    const item = items.find((i) => i.id === id);
    setForm({
      item_id: id,
      stok_fisik: item ? item.stok : 0,
      catatan: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.item_id) return toast('Pilih produk dulu');
    if (!selectedItem) return;
    const fisik = Number(form.stok_fisik);
    if (fisik < 0) return toast('Stok fisik tidak boleh negatif');

    await createOpname({
      item_id: form.item_id,
      stok_sistem: selectedItem.stok,
      stok_fisik: fisik,
      selisih: fisik - selectedItem.stok,
      catatan: form.catatan,
      dilakukan_oleh: 'Andi Rahman',
    });
    setForm({ item_id: '', stok_fisik: 0, catatan: '' });
  };

  return (
    <>
      <PageHeader
        title="Stock Opname"
        subtitle="Cocokkan stok sistem dengan stok fisik"
      />

      {/* Form opname */}
      <Card>
        <div className="h2">Catat opname baru</div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <Select
              label="Produk"
              value={form.item_id}
              onChange={handleSelectItem}
              style={{ minWidth: 280 }}
            >
              <option value="">-- Pilih produk --</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.sku} — {i.nama} (sistem: {i.stok})
                </option>
              ))}
            </Select>
            <Input
              label="Stok fisik (hasil hitung)"
              type="number"
              name="stok_fisik"
              value={form.stok_fisik}
              onChange={handleChange}
              min="0"
            />
            <Input
              label="Catatan (opsional)"
              name="catatan"
              value={form.catatan}
              onChange={handleChange}
              placeholder="cth: rusak, hilang, salah hitung"
            />
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button variant="pri" type="submit">Simpan Opname</Button>
            </div>
          </div>

          {selectedItem && (
            <div style={{ marginTop: 12 }}>
              <span className="sub">
                Stok sistem: <b>{nf(selectedItem.stok)}</b> · Stok fisik:{' '}
                <b>{nf(Number(form.stok_fisik))}</b> · Selisih:{' '}
                <Badge tone={selisih === 0 ? 'ok' : selisih > 0 ? 'if' : 'er'}>
                  {selisih > 0 ? '+' : ''}{selisih}
                </Badge>
              </span>
            </div>
          )}
        </form>
      </Card>

      {/* Riwayat opname */}
      <Card>
        <div className="h2">Riwayat opname ({opnames.length})</div>
        {opnames.length === 0 && <p className="sub">Belum ada opname.</p>}
        {opnames.map((o) => {
          const item = items.find((i) => i.id === o.item_id);
          const tone = o.selisih === 0 ? 'ok' : o.selisih > 0 ? 'if' : 'er';
          return (
            <div className="li" key={o.id}>
              <div>
                <b>{o.kode}</b>
                <small>
                  {item ? item.nama : 'Produk dihapus'} · sistem {o.stok_sistem} → fisik {o.stok_fisik}
                  {o.catatan ? ` · ${o.catatan}` : ''}
                </small>
              </div>
              <Badge tone={tone}>
                {o.selisih > 0 ? '+' : ''}{o.selisih}
              </Badge>
            </div>
          );
        })}
      </Card>
    </>
  );
}