// ============================================
// KOMPONEN: Layout
// FUNGSI: Wrapper semua halaman + Modal Tambah Barang
// ============================================

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Toast } from '../ui/Toast';
import { Modal } from '../ui/Modal';
import { NewItemForm } from '../features/NewItemForm';
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

      {/* Modal Tambah Barang Baru — form lengkap dari features/NewItemForm.jsx */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <NewItemForm onClose={() => setAddModalOpen(false)} />
      </Modal>
    </div>
  );
}

// ---------- PROPS ----------
//   children: ReactNode (isi halaman)