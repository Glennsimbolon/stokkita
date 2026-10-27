// ============================================
// PAGE: Stock
// FUNGSI: Tabel stok lengkap + filter tab & gudang
// ============================================

import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { rp, nf } from '../utils/format';
import { getStatus } from '../utils/status';
import { GUDANG } from '../data/constants';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Tabs } from '../components/ui/Tabs';
import { PageHeader } from '../components/ui/PageHeader';

export default function Stock() {
  // ✅ Hapus updateItemStock, tambahkan softDelete
  const { items, tab, setTab, gudang, setGudang, query, softDelete } = useApp();

  // ---------- DERIVED ----------
  const filtered = useMemo(() => {
    let r = items.filter((i) => !gudang || i.gudang === gudang);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((i) => (i.nama + i.sku).toLowerCase().includes(q));
    }
    return r;
  }, [items, gudang, query]);

  const counts = {
    all: filtered.length,
    low: filtered.filter((i) => i.stok < i.reorder).length,
    ed:  filtered.filter((i) => i.ed_hari).length,
  };

  let rows = filtered;
  if (tab === 'low') rows = rows.filter((i) => i.stok < i.reorder);
  if (tab === 'ed')  rows = rows.filter((i) => i.ed_hari);

  return (
    <>
      <PageHeader
        title="Stok Produk"
        subtitle={`${items.length} SKU di 3 gudang`}
      />

      <Card>
        <div className="row" style={{ alignItems: 'center', marginBottom: 16 }}>
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { id: 'all', label: `Semua (${counts.all})` },
              { id: 'low', label: `Menipis (${counts.low})` },
              { id: 'ed',  label: `Kedaluwarsa dekat (${counts.ed})` },
            ]}
          />
          <Select
            value={gudang}
            onChange={(e) => setGudang(e.target.value)}
            aria-label="Filter gudang"
          >
            <option value="">Semua gudang</option>
            {GUDANG.map((g) => <option key={g}>{g}</option>)}
          </Select>
        </div>

        <div className="tw">
          <table className="tbl">
            <thead>
              <tr>
                <th>SKU</th><th>Produk</th><th>Gudang</th>
                <th>Stok</th><th>Reorder</th><th>Status</th>
                <th>Nilai</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8}>Tidak ada barang yang cocok.</td>
                </tr>
              )}
              {rows.map((i) => {
                const [tone, label] = getStatus(i);
                return (
                  <tr key={i.id}>
                    <td>{i.sku}</td>
                    <td><b>{i.nama}</b></td>
                    <td>{i.gudang}</td>
                    <td>{nf(i.stok)}</td>
                    <td>{nf(i.reorder)}</td>
                    <td><Badge tone={tone}>{label}</Badge></td>
                    <td>{rp(i.stok * i.harga)}</td>
                    <td>
                      {/* ✅ Hanya Tombol Hapus (Soft Delete) */}
                      <Button
                        size="sm"
                        onClick={() => {
                          if (window.confirm(`Sembunyikan produk ${i.nama} dari daftar?`)) {
                            softDelete('items', i.sku);
                          }
                        }}
                        style={{ color: '#ef4444' }}
                        aria-label={`Hapus ${i.nama}`}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}