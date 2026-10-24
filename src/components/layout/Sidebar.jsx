// ============================================
// KOMPONEN: Sidebar
// FUNGSI: Navigasi 12 halaman dari menu.js
// ============================================

import { MENU } from './menu';
import { useApp } from '../../context/AppContext';

export function Sidebar() {
  const { page, go, sidebarOpen } = useApp();

  return (
    <aside
      className={`side ${sidebarOpen ? 'open' : ''}`}
      aria-label="Navigasi utama"
    >
      <div className="logo"><b></b>StokKita</div>

      {MENU.map((section) => (
        <div key={section.group}>
          <div className="grp">{section.group}</div>
          {section.items.map((item) => (
            <button
              key={item.id}
              className={`nav ${page === item.id ? 'on' : ''}`}
              onClick={() => go(item.id)}
            >
              <span style={{ marginRight: 8 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}

// ---------- PROPS ----------
//   (tidak ada — semua dari useApp)