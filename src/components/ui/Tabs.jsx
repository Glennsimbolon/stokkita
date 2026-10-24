// ============================================
// KOMPONEN: Tabs
// FUNGSI: Tombol tab filter
// ============================================

export function Tabs({ items, value, onChange }) {
  return (
    <div className="tabs">
      {items.map((item) => (
        <button
          key={item.id}
          className="tab"
          aria-pressed={value === item.id}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ---------- PROPS ----------
//   items   : [{ id, label }, ...]
//   value   : string (id yang aktif)
//   onChange: (id) => void