'use client';

import type { ReactNode } from 'react';
import { AdminProvider } from './AdminProvider';
import { AuthProvider } from './AuthProvider';
import { BookingProvider } from './BookingProvider';
import { DataProvider } from './DataProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DataProvider>
      <AuthProvider>
        <BookingProvider>
          <AdminProvider>{children}</AdminProvider>
        </BookingProvider>
      </AuthProvider>
    </DataProvider>
  );
}
