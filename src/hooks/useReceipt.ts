import { buildWaLink, receiptRows } from '@/actions/booking.actions';
import { downloadICS } from '@/lib/download';
import { useBooking } from '@/providers/BookingProvider';

export function useReceipt() {
  const { state, dispatch } = useBooking();
  const receipt = state.receipt;
  return {
    receipt,
    rows: receipt ? receiptRows(receipt) : [],
    waLink: receipt ? buildWaLink(receipt) : '',
    saveCalendar: () => { if (receipt) downloadICS(receipt); },
    close: () => dispatch({ type: 'CLOSE_RECEIPT' }),
  };
}
