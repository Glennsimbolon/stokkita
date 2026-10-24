// ============================================
// FILE: AppContext.jsx
// FUNGSI: State global (semua data + UI state)
// ============================================

import {
  createContext, useContext, useState, useEffect, useMemo,
} from 'react';
import { itemsApi }     from '../api/items';
import { posApi }       from '../api/pos';
import { soApi }        from '../api/so';
import { transfersApi } from '../api/transfers';
import { opnamesApi }   from '../api/opnames';
import { PO_COLUMNS }   from '../data/constants';
import { useToast }     from '../hooks/useToast';

const Ctx = createContext(null);

// ---------- HELPER ----------
function nextPoCode(existing) {
  if (!existing.length) return 'PO-2049';
  const nums = existing
    .map((p) => parseInt(p.kode.replace('PO-', ''), 10))
    .filter((n) => !isNaN(n));
  return `PO-${(nums.length ? Math.max(...nums) : 2048) + 1}`;
}

function nextSoCode(existing) {
  if (!existing.length) return 'SO-1001';
  const nums = existing
    .map((s) => parseInt(s.kode.replace('SO-', ''), 10))
    .filter((n) => !isNaN(n));
  return `SO-${(nums.length ? Math.max(...nums) : 1000) + 1}`;
}

function nextTransferCode(existing) {
  if (!existing.length) return 'TRF-001';
  const nums = existing
    .map((t) => parseInt(t.kode.replace('TRF-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `TRF-${String(max + 1).padStart(3, '0')}`;
}

function nextOpnameCode(existing) {
  if (!existing.length) return 'OPN-001';
  const nums = existing
    .map((o) => parseInt(o.kode.replace('OPN-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `OPN-${String(max + 1).padStart(3, '0')}`;
}

export function AppProvider({ children }) {
  // ---------- DATA ----------
  const [items, setItems]         = useState([]);
  const [pos, setPos]             = useState([]);
  const [so, setSo]               = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [opnames, setOpnames]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // ---------- UI ----------
  const [page, setPage]               = useState('dash');
  const [tab, setTab]                 = useState('all');
  const [gudang, setGudang]           = useState('');
  const [query, setQuery]             = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { message, visible, toast } = useToast();

  // ---------- FETCH AWAL ----------
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [itemsData, posData, soData, trData, opData] = await Promise.all([
          itemsApi.list(),
          posApi.list(),
          soApi.list(),
          transfersApi.list(),
          opnamesApi.list(),
        ]);
        if (!cancelled) {
          setItems(itemsData);
          setPos(posData);
          setSo(soData);
          setTransfers(trData);
          setOpnames(opData);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // ---------- NAVIGASI ----------
  const go = (p) => {
    setPage(p);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  // ---------- ITEMS ----------
  const addItem = async (newItem) => {
    try {
      const created = await itemsApi.create(newItem);
      setItems((prev) => [created, ...prev]);
      toast('Barang disimpan');
      return created;
    } catch (err) {
      toast(`Gagal simpan: ${err.message}`);
      throw err;
    }
  };

  const updateItemStock = async (sku, amount) => {
    const item = items.find((x) => x.sku === sku);
    if (!item) return;
    try {
      const updated = await itemsApi.update(sku, { stok: item.stok + amount });
      setItems((prev) => prev.map((i) => (i.sku === sku ? updated : i)));
      toast(`+${amount} ${item.nama} diterima`);
    } catch (err) {
      toast(`Gagal update stok: ${err.message}`);
    }
  };

  const removeItem = async (sku) => {
    try {
      await itemsApi.remove(sku);
      setItems((prev) => prev.filter((i) => i.sku !== sku));
      toast('Barang dihapus');
    } catch (err) {
      toast(`Gagal hapus: ${err.message}`);
    }
  };

  // ---------- PO ----------
  const movePo = async (kode) => {
    const po = pos.find((x) => x.kode === kode);
    if (!po || po.kolom >= PO_COLUMNS.length - 1) return;
    try {
      const updated = await posApi.update(kode, { kolom: po.kolom + 1 });
      setPos((prev) => prev.map((p) => (p.kode === kode ? updated : p)));
      toast(`${kode} dipindah ke ${PO_COLUMNS[po.kolom + 1]}`);
    } catch (err) {
      toast(`Gagal pindah PO: ${err.message}`);
    }
  };

  const createPo = async (supplier = 'Pemasok baru') => {
    const newPo = {
      kode: nextPoCode(pos),
      supplier,
      amount: Math.round((Math.random() * 40 + 5)) * 1000000,
      kolom: 0,
    };
    try {
      const created = await posApi.create(newPo);
      setPos((prev) => [created, ...prev]);
      toast('PO draft dibuat');
      return created;
    } catch (err) {
      toast(`Gagal buat PO: ${err.message}`);
    }
  };

  // ---------- SALES ORDER ----------
  const moveSo = async (kode) => {
    const s = so.find((x) => x.kode === kode);
    if (!s || s.kolom >= 3) return;
    const columns = ['Baru', 'Diproses', 'Dikirim', 'Selesai'];
    try {
      const updated = await soApi.update(kode, { kolom: s.kolom + 1 });
      setSo((prev) => prev.map((x) => (x.kode === kode ? updated : x)));
      toast(`${kode} dipindah ke ${columns[s.kolom + 1]}`);
    } catch (err) {
      toast(`Gagal pindah SO: ${err.message}`);
    }
  };

  const createSo = async (customer = 'Pelanggan baru') => {
    const newSo = {
      kode: nextSoCode(so),
      customer,
      amount: Math.round((Math.random() * 20 + 2)) * 100000,
      kolom: 0,
    };
    try {
      const created = await soApi.create(newSo);
      setSo((prev) => [created, ...prev]);
      toast('SO baru dibuat');
      return created;
    } catch (err) {
      toast(`Gagal buat SO: ${err.message}`);
    }
  };

  // ---------- TRANSFERS ----------
  const createTransfer = async (payload) => {
    const newTr = {
      kode: nextTransferCode(transfers),
      ...payload,
      status: 'pending',
    };
    try {
      const created = await transfersApi.create(newTr);
      setTransfers((prev) => [created, ...prev]);
      toast('Transfer dibuat');
      return created;
    } catch (err) {
      toast(`Gagal buat transfer: ${err.message}`);
    }
  };

  const updateTransferStatus = async (kode, status) => {
    try {
      const updated = await transfersApi.update(kode, { status });
      setTransfers((prev) => prev.map((t) => (t.kode === kode ? updated : t)));
      toast(`${kode} → ${status}`);

      // Kalau status = 'diterima', kurangi stok di gudang asal, tambah di tujuan
      if (status === 'diterima') {
        const t = transfers.find((x) => x.kode === kode);
        if (t) {
          const item = items.find((i) => i.id === t.item_id);
          if (item) {
            const newStok = Math.max(0, item.stok - t.qty);
            const updatedItem = await itemsApi.update(item.sku, { stok: newStok });
            setItems((prev) => prev.map((i) => (i.id === item.id ? updatedItem : i)));
          }
        }
      }
    } catch (err) {
      toast(`Gagal update transfer: ${err.message}`);
    }
  };

  // ---------- OPNAME ----------
  const createOpname = async (payload) => {
    const newOp = {
      kode: nextOpnameCode(opnames),
      ...payload,
    };
    try {
      const created = await opnamesApi.create(newOp);
      setOpnames((prev) => [created, ...prev]);

      // Update stok item ke stok fisik
      const item = items.find((i) => i.id === payload.item_id);
      if (item) {
        const updatedItem = await itemsApi.update(item.sku, {
          stok: payload.stok_fisik,
          last_opname: new Date().toISOString(),
        });
        setItems((prev) => prev.map((i) => (i.id === item.id ? updatedItem : i)));
      }

      toast('Opname disimpan');
      return created;
    } catch (err) {
      toast(`Gagal simpan opname: ${err.message}`);
    }
  };

  // ---------- VALUE ----------
  const value = useMemo(
    () => ({
      // data
      items, pos, so, transfers, opnames,
      loading, error,
      // items
      addItem, updateItemStock, removeItem,
      // po
      movePo, createPo,
      // so
      moveSo, createSo,
      // transfers
      createTransfer, updateTransferStatus,
      // opnames
      createOpname,
      // ui
      page, go, tab, setTab,
      gudang, setGudang,
      query, setQuery,
      sidebarOpen, setSidebarOpen,
      // toast
      toast, toastMessage: message, toastVisible: visible,
    }),
    [
      items, pos, so, transfers, opnames,
      loading, error,
      page, tab, gudang, query, sidebarOpen,
      message, visible,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp harus dipakai di dalam <AppProvider>');
  return ctx;
}