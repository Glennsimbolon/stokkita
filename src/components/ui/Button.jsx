// ============================================
// KOMPONEN: Button
// FUNGSI: Tombol dengan varian & ukuran
// ============================================

import clsx from 'clsx';

export function Button({
  variant = 'default',  // 'default' | 'pri'
  size = 'md',          // 'md' | 'sm'
  className,
  children,
  ...props
}) {
  return (
    <button
      className={clsx(
        'btn',
        variant === 'pri' && 'btn-pri',
        size === 'sm' && 'btn-sm',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ---------- PROPS ----------
//   variant : 'default' | 'pri'   (default: 'default')
//   size    : 'md' | 'sm'         (default: 'md')
//   children: ReactNode