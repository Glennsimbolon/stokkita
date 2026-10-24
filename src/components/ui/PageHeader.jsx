// ============================================
// KOMPONEN: PageHeader
// FUNGSI: Judul halaman + subtitle + tombol aksi
// ============================================

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <div>
        <h1>{title}</h1>
        {subtitle && <div className="sub">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

// ---------- PROPS ----------
//   title   : string
//   subtitle: string (opsional)
//   action  : ReactNode (opsional, biasanya tombol)