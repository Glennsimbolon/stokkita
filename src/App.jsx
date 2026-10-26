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

// Batch 3
import SalesOrder from './pages/SalesOrder';
import Transfer   from './pages/Transfer';
import Opname     from './pages/Opname';

// Batch 4 — Lengkap!
import Suppliers    from './pages/Suppliers';
import Warehouses   from './pages/Warehouses';
import Users        from './pages/Users';
import Reports      from './pages/Reports';
import Forecast     from './pages/Forecast';
import Integrations from './pages/Integrations';

const PAGES = {
  dash: Dashboard,
  stok: Stock,
  po:   PurchaseOrder,
  so:       SalesOrder,
  transfer: Transfer,
  opname:   Opname,
  suppliers:    Suppliers,
  warehouses:   Warehouses,
  users:        Users,
  reports:      Reports,
  forecast:     Forecast,
  integrations: Integrations,
};

export default function App() {
  const { page } = useApp();
  const Current = PAGES[page] || Dashboard;

  return (
    <Layout>
      <Current />
    </Layout>
  );
}