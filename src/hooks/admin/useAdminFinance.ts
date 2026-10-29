import { useMemo } from 'react';
import { computeFinance } from '@/actions/admin.actions';
import { downloadBookingsCsv } from '@/lib/download';
import { useAuth } from '@/providers/AuthProvider';
import { useData } from '@/providers/DataProvider';

export function useAdminFinance() {
  const { isAdmin } = useAuth();
  const { bookings, members, config } = useData();
  const finance = useMemo(() => computeFinance(bookings, members.length, config.courts), [bookings, members.length, config.courts]);
  return { ...finance, bookings, exportCsv: () => { if (isAdmin) downloadBookingsCsv(bookings); } };
}
