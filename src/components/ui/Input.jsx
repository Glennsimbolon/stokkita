// ============================================
// KOMPONEN: Input
// FUNGSI: Input teks dengan label opsional
// ============================================

export function Input({ label, ...props }) {
  const input = <input {...props} />;
  if (!label) return input;

  return (
    <label className="field">
      {label}
      {input}
    </label>
  );
}

// ---------- PROPS ----------
//   label: string (opsional)
//   ...sisa props diteruskan ke <input>