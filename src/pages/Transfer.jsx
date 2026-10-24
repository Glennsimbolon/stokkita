// ============================================
// PAGE: Transfer
// FUNGSI: Transfer stok antar gudang
// ============================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GUDANG } from '../data/constants';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';

const STATUS_TONE = {
  pending:  'wr',
  dikirim:  'if',
  diterima: 'ok',
  dibatalkan: 'er',
};

const STATUS_LABEL = {
  pending:   'Pending',
  dikirim:   'Dikirim',
  diterima:  'Diterima',
  dibatalkan:'Dibatalkan',
};

export default function Transfer() {
  const { items, transfers, createTransfer, updateTransferStatus, toast } = useApp();
  const [form, setForm] = useState({ item_id: '', dari: 'Jakarta', ke: 'Bekasi', qty: 10 });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.item_id) return toast('Pilih produk dulu');
    if (form.dari === form.ke) return toast('Gudang asal & tujuan harus beda');
    const qty = Number(form.qty);
    if (qty <= 0) return toast('Qty harus lebih dari 0');

    await createTransfer({
      item_id: form.item_id,
      dari: form.dari,
      ke: form.ke,
      qty,
    });
    setForm({ ...form, qty: 10 });
  };

  return (
    <>
      <PageHeader
        title="Transfer Gudang"
        subtitle="Pindahkan stok antar lokasi"
      />

      {/* Form buat transfer */}
      <Card>
        <div className="h2">Buat transfer baru</div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <Select
              label="Produk"
              name="item_id"
              value={form.item_id}
              onChange={handleChange}
              style={{ minWidth: 240 }}
            >
              <option value="">-- Pilih produk --</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.sku} — {i.nama} ({i.gudang}, stok {i.stok})
                </option>
              ))}
            </Select>
            <Select label="Dari" name="dari" value={form.dari} onChange={handleChange}>
              {GUDANG.map((g) => <option key={g}>{g}</option>)}
            </Select>
            <Select label="Ke" name="ke" value={form.ke} onChange={handleChange}>
              {GUDANG.map((g) => <option key={g}>{g}</option>)}
            </Select>
            <Input
              label="Qty"
              name="qty"
              type="number"
              min="1"
              value={form.qty}
              onChange={handleChange}
            />
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button variant="pri" type="submit">Buat Transfer</Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Daftar transfer */}
      <Card>
        <div className="h2">Daftar transfer ({transfers.length})</div>
        {transfers.length === 0 && <p className="sub">Belum ada transfer.</p>}
        {transfers.map((t) => {
          const item = items.find((i) => i.id === t.item_id);
          return (
            <div className="li" key={t.id}>
              <div>
                <b>{t.kode}</b>
                <small>
                  {item ? item.nama : 'Produk dihapus'} · {t.dari} → {t.ke} · qty {t.qty}
                </small>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Badge tone={STATUS_TONE[t.status] || 'wr'}>
                  {STATUS_LABEL[t.status] || t.status}
                </Badge>
                {t.status === 'pending' && (
                  <Button size="sm" onClick={() => updateTransferStatus(t.kode, 'dikirim')}>
                    Kirim
                  </Button>
                )}
                {t.status === 'dikirim' && (
                  <Button size="sm" onClick={() => updateTransferStatus(t.kode, 'diterima')}>
                    Terima
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </Card>
    </>
  );
}