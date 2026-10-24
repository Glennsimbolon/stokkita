// ============================================
// KOMPONEN: Toast
// FUNGSI: Notifikasi kecil di bawah layar
// ============================================

export function Toast({ message, visible }) {
  return (
    <div className={`toast ${visible ? 'show' : ''}`} role="status">
      {message}
    </div>
  );
}

// ---------- PROPS ----------
//   message : string
//   visible : boolean