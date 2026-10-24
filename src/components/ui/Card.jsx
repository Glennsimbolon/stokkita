// ============================================
// KOMPONEN: Card
// FUNGSI: Kotak putih dengan border
// ============================================

import clsx from 'clsx';

export function Card({ variant = 'default', className, children, ...props }) {
  return (
    <div
      className={clsx('card', variant === 'ai' && 'ai', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ---------- PROPS ----------
//   variant  : 'default' | 'ai'   (default: 'default')
//   className: string (opsional)
//   children : ReactNode