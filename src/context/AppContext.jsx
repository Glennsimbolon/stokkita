// ============================================
// FILE: AppContext.jsx
// FUNGSI: State global (Data + Auth + UI) - FINAL
// ============================================

import {
  createContext, useContext, useState, useEffect, useMemo,
} from 'react';
import { supabase } from '../lib/supabase'; // ✅ 1. Tambah import ini
import { itemsApi }      from '../api/items';
import { posApi }        from '../api/pos';
import { soApi }         from '../api/so';
import { transfersApi }  from '../api/transfers';
import { opnamesApi }    from '../api/opnames';
import { suppliersApi }  from '../api/suppliers';
import { warehousesApi } from '../api/warehouses';
import { usersApi }      from '../api/users';
import { PO_COLUMNS }    from '../data/constants';
import { useToast }      from '../hooks/useToast';
const Ctx = createContext(null);

// ---------- HELPER ----------
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
  // ---------- AUTH STATE ----------
  const [session, setSession] = useState(null); // ✅ 2. Tambah state session

  // ---------- DATA ----------
  const [items, setItems]           = useState([]);
  const [pos, setPos]               = useState([]);
  const [so, setSo]                 = useState([]);
  const [transfers, setTransfers]   = useState([]);
  const [opnames, setOpnames]       = useState([]);
  const [suppliers, setSuppliers]   = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // ---------- UI ----------
  const [page, setPage]               = useState('dash');
  const [tab, setTab]                 = useState('all');
  const [gudang, setGudang]           = useState('');
  const [query, setQuery]             = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { message, visible, toast } = useToast();

  // ---------- AUTH CEK SESI ----------
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ---------- FETCH AWAL ----------
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [
          itemsData, posData, soData, trData, opData,
          supData, whData, userData,
        ] = await Promise.all([
          itemsApi.list(), posApi.list(), soApi.list(),
          transfersApi.list(), opnamesApi.list(),
          suppliersApi.list(), warehousesApi.list(), usersApi.list(),
        ]);
        if (!cancelled) {
          setItems(itemsData); setPos(posData); setSo(soData);
          setTransfers(trData); setOpnames(opData); setSuppliers(supData);
          setWarehouses(whData); setUsers(userData); setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [session]); // Fetch ulang setiap login/logout

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
      // ✅ JIKA PINDAH KE SELESAI, TAMBAH STOK
      if (po.kolom === 2) { 
        const { data: details } = await supabase.from('po_items').select('*').eq('po_id', po.id);
        for (const d of details) {
          const item = items.find(i => i.id === d.item_id);
          if (item) {
            const newStok = item.stok + d.qty;
            await itemsApi.update(item.sku, { stok: newStok });
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, stok: newStok } : i));
          }
        }
      }

      const updated = await posApi.update(kode, { kolom: po.kolom + 1 });
      setPos((prev) => prev.map((p) => (p.kode === kode ? updated : p)));
      toast(`${kode} dipindah ke ${PO_COLUMNS[po.kolom + 1]}`);
    } catch (err) {
      toast(`Gagal pindah PO: ${err.message}`);
    }
  };

  const createPo = async (supplier, details) => {
    const totalAmount = details.reduce((sum, d) => sum + (d.qty * d.harga_satuan), 0);
    const newPo = { kode: `PO-${Date.now()}`, supplier, amount: totalAmount, kolom: 0 };
    try {
      const created = await posApi.create(newPo, details);
      setPos((prev) => [created, ...prev]);
      toast(`PO ${created.kode} berhasil dibuat`);
      return created;
    } catch (err) {
      toast(`Gagal buat PO: ${err.message}`);
      throw err;
    }
  };

  const moveSo = async (kode) => {
    const s = so.find((x) => x.kode === kode);
    if (!s || s.kolom >= 3) return;
    const columns = ['Baru', 'Diproses', 'Dikirim', 'Selesai'];

    try {
      if (s.kolom === 2) {
        const { data: details, error: errDetail } = await supabase
          .from('so_items')
          .select('*')
          .eq('so_id', s.id);
          
        if (errDetail) throw errDetail;

        for (const d of details) {
          const item = items.find(i => i.id === d.item_id);
          if (item) {
            const newStok = Math.max(0, item.stok - d.qty); // Cegah stok minus
            await itemsApi.update(item.sku, { stok: newStok });
            
           
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, stok: newStok } : i));
          }
        }
      }

    
      const updated = await soApi.update(kode, { kolom: s.kolom + 1 });
      setSo((prev) => prev.map((x) => (x.kode === kode ? updated : x)));
      
      toast(`${kode} dipindah ke ${columns[s.kolom + 1]}`);
    } catch (err) {
      toast(`Gagal pindah SO: ${err.message}`);
    }
  };

  const createSo = async (customer, details) => {
    const totalAmount = details.reduce((sum, d) => sum + (d.qty * d.harga_satuan), 0);
    const newSo = { kode: `SO-${Date.now()}`, customer, amount: totalAmount, kolom: 0 };
    try {
      const created = await soApi.create(newSo, details);
      setSo((prev) => [created, ...prev]);
      toast(`SO ${created.kode} berhasil dibuat`);
      return created;
    } catch (err) {
      toast(`Gagal buat SO: ${err.message}`);
      throw err;
    }
  };

  // ---------- SOFT DELETE ----------
  const softDelete = async (tableName, kode) => {
    try {
      const userEmail = session?.user?.email || 'System';
      const { error } = await supabase
        .from(tableName)
        .update({ deleted_at: new Date().toISOString(), deleted_by: userEmail })
        .eq('kode', kode);

      if (error) throw error;
      
      if (tableName === 'purchase_orders') setPos(prev => prev.filter(p => p.kode !== kode));
      if (tableName === 'sales_orders') setSo(prev => prev.filter(s => s.kode !== kode));
      if (tableName === 'suppliers') setSuppliers(prev => prev.filter(s => s.kode !== kode));
      
      toast(`Data berhasil dihapus (masuk ke Sampah)`);
    } catch (err) {
      toast(`Gagal menghapus: ${err.message}`);
    }
  };

  // ---------- TRANSFERS ----------
  const createTransfer = async (payload) => {
    const newTr = { kode: nextTransferCode(transfers), ...payload, status: 'pending' };
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
    const newOp = { kode: nextOpnameCode(opnames), ...payload };
    try {
      const created = await opnamesApi.create(newOp);
      setOpnames((prev) => [created, ...prev]);

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

  // ---------- SUPPLIERS ----------
  const addSupplier = async (newSupplier) => {
    try {
      const created = await suppliersApi.create(newSupplier);
      setSuppliers((prev) => [...prev, created]);
      toast('Pemasok ditambahkan');
      return created;
    } catch (err) {
      toast(`Gagal tambah pemasok: ${err.message}`);
    }
  };

  const toggleSupplierStatus = async (kode, currentStatus) => {
    try {
      const updated = await suppliersApi.update(kode, { aktif: !currentStatus });
      setSuppliers((prev) => prev.map((s) => (s.kode === kode ? updated : s)));
      toast(`Pemasok ${updated.nama} ${updated.aktif ? 'diaktifkan' : 'dinonaktifkan'}`);
    } catch (err) {
      toast(`Gagal ubah status: ${err.message}`);
    }
  };

  const removeSupplier = async (kode) => {
    try {
      await suppliersApi.remove(kode);
      setSuppliers((prev) => prev.filter((s) => s.kode !== kode));
      toast('Pemasok dihapus');
    } catch (err) {
      toast(`Gagal hapus pemasok: ${err.message}`);
    }
  };
     // ---------- WAREHOUSES ----------
  const addWarehouse = async (newWarehouse) => {
    try {
      const existingKodes = warehouses
        .map((w) => parseInt(w.kode.replace('W-', ''), 10))
        .filter((n) => !isNaN(n));
      
      const nextNumber = existingKodes.length ? Math.max(...existingKodes) + 1 : 1;
      const kodeOtomatis = `W-${String(nextNumber).padStart(2, '0')}`;
      
      const created = await warehousesApi.create({
        ...newWarehouse,
        kode: kodeOtomatis,
      });
      
      setWarehouses((prev) => [...prev, created]);
      toast(`Gudang ${created.nama} ditambahkan (${created.kode})`);
      return created;
    } catch (err) {
      toast(`Gagal tambah gudang: ${err.message}`);
    }
  };

  const updateWarehouse = async (kode, patch) => {
    try {
      const updated = await warehousesApi.update(kode, patch);
      setWarehouses((prev) => prev.map((w) => (w.kode === kode ? updated : w)));
      toast('Gudang diperbarui');
    } catch (err) {
      toast(`Gagal update gudang: ${err.message}`);
    }
  };

  // ✅ FUNGSI HAPUS GUDANG (Ini yang tadi hilang)
   const deleteWarehouse = async (kode) => {
    try {
      await warehousesApi.remove(kode); // Pastikan API ini ada
      setWarehouses((prev) => prev.filter((w) => w.kode !== kode));
      toast('Gudang dihapus');
    } catch (err) {
      toast(`Gagal hapus gudang: ${err.message}`);
    }
  };

  // ---------- VALUE ----------
  const value = useMemo(
    () => ({
      items, pos, so, transfers, opnames, suppliers, warehouses, users,
      loading, error, session, // ✅ Kembalikan session
      addSupplier, toggleSupplierStatus, removeSupplier,
      addItem, updateItemStock, removeItem, 
      addWarehouse, updateWarehouse, deleteWarehouse,
      movePo, createPo,
      moveSo, createSo,
      createTransfer, updateTransferStatus,
      createOpname, softDelete,
      page, go, tab, setTab, gudang, setGudang, query, setQuery,
      sidebarOpen, setSidebarOpen,
      toast, toastMessage: message, toastVisible: visible,
    }),
    [
      items, pos, so, transfers, opnames, suppliers, warehouses, users,
      loading, error, session,
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