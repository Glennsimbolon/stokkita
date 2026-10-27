// ============================================
// PAGE: PurchaseOrder
// FUNGSI: Kanban PO + Form + Detail Modal
// ============================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { posApi } from '../api/pos';
import { rp } from '../utils/format';
import { PO_COLUMNS } from '../data/constants';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export default function PurchaseOrder() {
  const { items, pos, movePo, createPo, softDelete } = useApp();
  
  // State untuk Form Buat PO
  const [isOpen, setIsOpen] = useState(false);
  const [supplier, setSupplier] = useState('PT Nusa Tani');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [qty, setQty] = useState(10);
  const [cart, setCart] = useState([]);

  // State untuk Modal Detail PO
  const [detailPo, setDetailPo] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // --- FUNGSI BUKA DETAIL ---
  const handleOpenDetail = async (po) => {
    setDetailPo(po);
    setIsLoadingDetail(true);
    try {
      const data = await posApi.getDetails(po.id);
      setDetailItems(data);
    } catch (err) {
      alert('Gagal memuat detail: ' + err.message);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // --- FUNGSI FORM BUAT PO ---
  const handleAddItem = () => {
    if (!selectedItemId || qty <= 0) return;
    const item = items.find(i => i.id === selectedItemId);
    const existing = cart.find(c => c.item_id === item.id);
    
    if (existing) {
      setCart(cart.map(c => c.item_id === item.id ? { ...c, qty: c.qty + Number(qty) } : c));
    } else {
      setCart([...cart, { item_id: item.id, nama: item.nama, qty: Number(qty), harga_satuan: item.harga }]);
    }
    setSelectedItemId('');
    setQty(10);
  };

  const handleRemoveItem = (itemId) => {
    setCart(cart.filter(c => c.item_id !== itemId));
  };

  const totalAmount = cart.reduce((sum, c) => sum + (c.qty * c.harga_satuan), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Tambahkan minimal 1 barang!');
    await createPo(supplier, cart);
    setIsOpen(false);
    setCart([]);
    setSupplier('PT Nusa Tani');
  };

  return (
    <>
      <PageHeader
        title="Pembelian (Purchase Order)"
        subtitle="Pantau PO dari draft sampai barang diterima"
        action={<Button variant="pri" onClick={() => setIsOpen(true)}>+ Buat PO</Button>}
      />

      <div className="row">
        {PO_COLUMNS.map((colName, ci) => (
          <section className="col" aria-label={colName} key={colName}>
            <h3>{colName} ({pos.filter((p) => p.kolom === ci).length})</h3>
            {pos.filter((p) => p.kolom === ci).map((p) => {
              const isDone = p.kolom >= PO_COLUMNS.length - 1;
              return (
                <div 
                  className="po" 
                  key={p.id} 
                  style={{ position: 'relative', cursor: 'pointer' }}
                  onClick={() => handleOpenDetail(p)} // ✅ Klik kartu untuk buka detail
                >
                  {/* Tombol Hapus (stopPropagation agar tidak bentrok dengan klik kartu) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Mencegah modal terbuka saat klik hapus
                      if (window.confirm(`Hapus PO ${p.kode} dari laporan?`)) {
                        softDelete('purchase_orders', p.kode);
                      }
                    }}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, fontSize: 14 }}
                    title="Sembunyikan PO"
                  >
                    🗑️
                  </button>

                  <b>{p.kode}</b>
                  <small>{p.supplier}</small>
                  <div className="f">
                    <span>{rp(p.amount)}</span>
                    {isDone ? (
                      <Badge tone="ok">Selesai</Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation(); // Mencegah modal terbuka saat klik Lanjut
                          movePo(p.kode);
                        }}
                      >
                        Lanjut
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        ))}
      </div>

      {/* =========================================
          MODAL 1: FORM BUAT PO (Sama seperti sebelumnya)
          ========================================= */}
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="stack" style={{ gap: 16 }}>
          <h2 style={{ margin: 0 }}>Buat Purchase Order</h2>
          <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <Input label="Pemasok / Supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} required />
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Daftar Barang</div>
            {cart.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8', border: '1px dashed #CBD5E1', borderRadius: 8 }}>
                Belum ada barang.
              </div>
            ) : (
              <table className="tbl" style={{ minWidth: 'auto', fontSize: 13 }}>
                <thead><tr><th>Nama Barang</th><th>Qty</th><th>Harga Satuan</th><th>Subtotal</th><th></th></tr></thead>
                <tbody>
                  {cart.map((c) => (
                    <tr key={c.item_id}>
                      <td>{c.nama}</td><td>{c.qty}</td><td>{rp(c.harga_satuan)}</td><td>{rp(c.qty * c.harga_satuan)}</td>
                      <td><Button type="button" size="sm" onClick={() => handleRemoveItem(c.item_id)} style={{ color: 'red', padding: '0 8px' }}>✕</Button></td>
                    </tr>
                  ))}
                  <tr><td colSpan="3" style={{ textAlign: 'right', fontWeight: 700 }}>Total</td><td colSpan="2" style={{ fontWeight: 700, color: 'var(--acc)' }}>{rp(totalAmount)}</td></tr>
                </tbody>
              </table>
            )}
          </div>

          <div style={{ background: '#F1F5F9', padding: 16, borderRadius: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 13 }}>+ Tambah Barang ke Daftar</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ flex: 2 }}>
                <Select label="Pilih Produk" value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)}>
                  <option value="">-- Pilih Barang --</option>
                  {items.map(i => <option key={i.id} value={i.id}>{i.nama} ({rp(i.harga)})</option>)}
                </Select>
              </div>
              <div style={{ flex: 1 }}>
                <Input label="Qty" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
              </div>
              <Button type="button" onClick={handleAddItem} style={{ height: 44 }}>Tambah</Button>
            </div>
          </div>

          <div className="row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" onClick={() => setIsOpen(false)}>Batal</Button>
            <Button variant="pri" type="submit">Simpan PO</Button>
          </div>
        </form>
      </Modal>

      {/* =========================================
          MODAL 2: DETAIL PO (BARU)
          ========================================= */}
      <Modal open={!!detailPo} onClose={() => setDetailPo(null)}>
        {detailPo && (
          <div className="stack">
            <h2 style={{ margin: 0 }}>Detail PO: {detailPo.kode}</h2>
            <p className="sub" style={{ marginBottom: 12 }}>Supplier: <b>{detailPo.supplier}</b></p>
            
            {isLoadingDetail ? (
              <p>Memuat detail barang...</p>
            ) : (
              <table className="tbl" style={{ minWidth: 'auto', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Qty</th>
                    <th>Harga Satuan</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detailItems.length === 0 && (
                    <tr><td colSpan="4">Tidak ada detail (PO lama).</td></tr>
                  )}
                  {detailItems.map((d) => (
                    <tr key={d.id}>
                      <td>{d.items?.nama || 'Produk dihapus'}</td>
                      <td>{d.qty}</td>
                      <td>{rp(d.harga_satuan)}</td>
                      <td>{rp(d.qty * d.harga_satuan)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'right', fontWeight: 700 }}>Total</td>
                    <td style={{ fontWeight: 700, color: 'var(--acc)' }}>{rp(detailPo.amount)}</td>
                  </tr>
                </tbody>
              </table>
            )}
            
            <div className="row" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
              <Button onClick={() => setDetailPo(null)}>Tutup</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}