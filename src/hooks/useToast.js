// ============================================
// FILE: useToast.js
// FUNGSI: Kontrol tampil/sembunyi toast
// ============================================

import { useState, useCallback, useRef } from 'react';
import { TOAST_DURATION } from '../data/constants';

export function useToast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const toast = useCallback((msg) => {
    setMessage(msg);
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), TOAST_DURATION);
  }, []);

  return { message, visible, toast };
}