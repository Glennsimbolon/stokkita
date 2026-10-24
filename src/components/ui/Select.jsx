// ============================================
// KOMPONEN: Select
// FUNGSI: Dropdown dengan label opsional
// ============================================

export function Select({ label, children, ...props }) {
  const select = <select {...props}>{children}</select>;
  if (!label) return select;

  return (
    <label className="field">
      {label}
      {select}
    </label>
  );
}

// ---------- PROPS ----------
//   label   : string (opsional)
//   children: <option>...</option>