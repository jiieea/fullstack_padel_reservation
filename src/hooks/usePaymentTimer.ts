import { useEffect, useRef, useState } from 'react';
import { fmtCountdown } from '@/lib/format';

/** Counts down from mount; calls onExpire once when it reaches zero. */
export function usePaymentTimer(totalSeconds: number, onExpire: () => void): string {
  const [remaining, setRemaining] = useState(totalSeconds);
  const expireRef = useRef(onExpire);
  useEffect(() => { expireRef.current = onExpire; });

  useEffect(() => {
    const id = setInterval(() => setRemaining(s => s - 1), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => { if (remaining <= 0) expireRef.current(); }, [remaining]);
  return fmtCountdown(remaining);
}
