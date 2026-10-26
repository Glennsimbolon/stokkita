// ============================================
// PAGE: SalesOrder
// FUNGSI: Kanban SO + Form Input Barang
// ============================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { rp } from '../utils/format';
import { SO_COLUMNS } from '../data/constants';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export default function SalesOrder() {
  const { items, so, moveSo, createSo, softDelete } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomer] = useState('Pelanggan Umum');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);

  const handleAddItem = () => {
    if (!selectedItemId || qty <= 0) return;
    const item = items.find(i => i.id === selectedItemId);
    
    // Cek stok cukup atau tidak
    if (item.stok < Number(qty)) {
      alert(`Stok ${item.nama} tidak cukup! (Tersisa: ${item.stok})`);
      return;
    }

    const existing = cart.find(c => c.item_id === item.id);
    if (existing) {
      setCart(cart.map(c => c.item_id === item.id ? { ...c, qty: c.qty + Number(qty) } : c));
    } else {
      setCart([...cart, { item_id: item.id, nama: item.nama, qty: Number(qty), harga_satuan: item.harga }]);
    }
    setSelectedItemId('');
    setQty(1);
  };

  const handleRemoveItem = (itemId) => {
    setCart(cart.filter(c => c.item_id !== itemId));
  };

  const totalAmount = cart.reduce((sum, c) => sum + (c.qty * c.harga_satuan), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Tambahkan minimal 1 barang!');
    await createSo(customer, cart);
    setIsOpen(false);
    setCart([]);
    setCustomer('Pelanggan Umum');
  };

  return (
    <>
      <PageHeader
        title="Penjualan (Sales Order)"
        subtitle="Pantau pesanan pelanggan dari Baru → Selesai"
        action={<Button variant="pri" onClick={() => setIsOpen(true)}>+ Buat SO</Button>}
      />

       <div className="row">
        {SO_COLUMNS.map((colName, ci) => (
          <section className="col" aria-label={colName} key={colName}>
            <h3>{colName} ({so.filter((s) => s.kolom === ci).length})</h3>
            {so.filter((s) => s.kolom === ci).map((s) => {
              const isDone = s.kolom >= SO_COLUMNS.length - 1;
              return (
                <div className="po" key={s.id} style={{ position: 'relative' }}>
                  
                  {/* TOMBOL HAPUS (SOFT DELETE) */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus SO ${s.kode} dari laporan?`)) {
                        softDelete('sales_orders', s.kode);
                      }
                    }}
                    style={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      opacity: 0.5,
                      fontSize: 14
                    }}
                    title="Sembunyikan SO (Soft Delete)"
                  >
                    🗑️
                  </button>

                  <b>{s.kode}</b>
                  <small>{s.customer}</small>
                  <div className="f">
                    <span>{rp(s.amount)}</span>
                    {isDone ? (
                      <Badge tone="ok">Selesai</Badge>
                    ) : (
                      <Button size="sm" onClick={() => moveSo(s.kode)}>
                        Lanjut
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            {so.filter((s) => s.kolom === ci).length === 0 && (
              <p className="sub" style={{ padding: 8 }}>Tidak ada pesanan</p>
            )}
          </section>
        ))}
      </div>

      {/* MODAL FORM BUAT SO */}
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="stack" style={{ gap: 16 }}>
          <h2 style={{ margin: 0 }}>Buat Sales Order</h2>
          
          <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <Input 
              label="Nama Pelanggan" 
              value={customer} 
              onChange={(e) => setCustomer(e.target.value)} 
              required 
            />
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Daftar Barang Dipesan</div>
            {cart.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8', border: '1px dashed #CBD5E1', borderRadius: 8 }}>
                Belum ada barang. Tambahkan barang di bawah.
              </div>
            ) : (
              <table className="tbl" style={{ minWidth: 'auto', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Nama Barang</th>
                    <th>Qty</th>
                    <th>Harga Satuan</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((c) => (
                    <tr key={c.item_id}>
                      <td>{c.nama}</td>
                      <td>{c.qty}</td>
                      <td>{rp(c.harga_satuan)}</td>
                      <td>{rp(c.qty * c.harga_satuan)}</td>
                      <td>
                        <Button type="button" size="sm" onClick={() => handleRemoveItem(c.item_id)} style={{ color: 'red', padding: '0 8px' }}>
                          ✕
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'right', fontWeight: 700 }}>Total</td>
                    <td colSpan="2" style={{ fontWeight: 700, color: 'var(--acc)' }}>{rp(totalAmount)}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          <div style={{ background: '#F1F5F9', padding: 16, borderRadius: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 13 }}>+ Tambah Barang ke Pesanan</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ flex: 2 }}>
                <Select 
                  label="Pilih Produk" 
                  value={selectedItemId} 
                  onChange={(e) => setSelectedItemId(e.target.value)}
                >
                  <option value="">-- Pilih Barang --</option>
                  {items.map(i => <option key={i.id} value={i.id}>{i.nama} (Stok: {i.stok})</option>)}
                </Select>
              </div>
              <div style={{ flex: 1 }}>
                <Input 
                  label="Qty" 
                  type="number" 
                  min="1" 
                  value={qty} 
                  onChange={(e) => setQty(e.target.value)} 
                />
              </div>
              <Button type="button" onClick={handleAddItem} style={{ height: 44 }}>Tambah</Button>
            </div>
          </div>

          <div className="row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" onClick={() => setIsOpen(false)}>Batal</Button>
            <Button variant="pri" type="submit">Simpan SO</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}