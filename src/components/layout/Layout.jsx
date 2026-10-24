// ============================================
// KOMPONEN: Layout
// FUNGSI: Wrapper semua halaman (Sidebar + Topbar + konten)
//         + modal tambah barang + toast global
// ============================================

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Toast } from '../ui/Toast';
import { useApp } from '../../context/AppContext';

export function Layout({ children }) {
  const { toastMessage, toastVisible } = useApp();
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <div className="app">
      <Sidebar />

      <div className="main">
        <Topbar onAddClick={() => setAddModalOpen(true)} />
        <div className="wrap">{children}</div>
      </div>

      <Toast message={toastMessage} visible={toastVisible} />

      {/* Modal tambah barang akan dibuat di Batch 3 */}
      {addModalOpen && (
        <div
          className="dialog"
          style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 100 }}
        >
          <h3>Form tambah barang</h3>
          <p className="sub">Akan dibuat di Batch 3.</p>
          <button className="btn" onClick={() => setAddModalOpen(false)} style={{ marginTop: 12 }}>
            Tutup
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- PROPS ----------
//   children: ReactNode (isi halaman)