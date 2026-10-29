'use client';

import { useEscapeToCloseModals } from '@/hooks/useModalControls';
import { AdminSlotModal } from './AdminSlotModal';
import { AuthModal } from './AuthModal';
import { PayModal } from './PayModal';
import { ReceiptModal } from './ReceiptModal';
import { ReminderModal } from './ReminderModal';

export function ModalsRoot() {
  useEscapeToCloseModals();
  return (
    <>
      <AuthModal />
      <PayModal />
      <ReceiptModal />
      <ReminderModal />
      <AdminSlotModal />
    </>
  );
}
