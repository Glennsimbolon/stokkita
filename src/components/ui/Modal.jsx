// ============================================
// KOMPONEN: Modal
// FUNGSI: Dialog native <dialog>
// ============================================

import { useEffect, useRef } from 'react';

export function Modal({ open, onClose, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const handler = () => onClose?.();
    dlg.addEventListener('close', handler);
    return () => dlg.removeEventListener('close', handler);
  }, [onClose]);

  return (
    <dialog ref={ref} className="dialog">
      {children}
    </dialog>
  );
}

// ---------- PROPS ----------
//   open    : boolean
//   onClose : () => void
//   children: ReactNode