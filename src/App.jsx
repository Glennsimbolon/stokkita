// ============================================
// FILE: App.jsx
// FUNGSI: Routing 12 halaman StokKita
// ============================================

import { useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';

// Batch 2
import Dashboard     from './pages/Dashboard';
import Stock         from './pages/Stock';
import PurchaseOrder from './pages/PurchaseOrder';

// Batch 3 — aktif sekarang
import SalesOrder from './pages/SalesOrder';
import Transfer   from './pages/Transfer';
import Opname     from './pages/Opname';

const PAGES = {
  dash: Dashboard,
  stok: Stock,
  po:   PurchaseOrder,
  so:       SalesOrder,
  transfer: Transfer,
  opname:   Opname,
};

function ComingSoon({ page }) {
  return (
    <>
      <div>
        <h1>Segera Hadir</h1>
        <div className="sub">
          Halaman <b>"{page}"</b> akan dibuat di batch berikutnya.
        </div>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Dalam Pengerjaan</div>
        <div className="sub">Akan tersedia di Batch 4.</div>
      </div>
    </>
  );
}

export default function App() {
  const { page } = useApp();
  const Current = PAGES[page];

  return (
    <Layout>
      {Current ? <Current /> : <ComingSoon page={page} />}
    </Layout>
  );
}