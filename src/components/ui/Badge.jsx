// ============================================
// KOMPONEN: Badge
// FUNGSI: Label status berwarna
// ============================================

export function Badge({ tone = 'ok', children }) {
  return <span className={`bd ${tone}`}>{children}</span>;
}

// ---------- PROPS ----------
//   tone    : 'ok' | 'wr' | 'er' | 'if'   (default: 'ok')
//   children: ReactNode