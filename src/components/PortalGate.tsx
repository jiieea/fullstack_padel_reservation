'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/providers/AuthProvider';

/** Shows the admin portal for admin sessions, otherwise the member portal. */
export function PortalGate({ member, admin }: { member: ReactNode; admin: ReactNode }) {
  const { isAdmin } = useAuth();
  return <>{isAdmin ? admin : member}</>;
}
