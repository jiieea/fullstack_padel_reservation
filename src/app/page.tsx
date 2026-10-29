import { AdminPortal } from '@/components/admin/AdminPortal';
import { MemberPortal } from '@/components/MemberPortal';
import { ModalsRoot } from '@/components/modals/ModalsRoot';
import { PortalGate } from '@/components/PortalGate';
import { AppProviders } from '@/providers/AppProviders';

export default function HomePage() {
  return (
    <AppProviders>
      <PortalGate member={<MemberPortal />} admin={<AdminPortal />} />
      <ModalsRoot />
    </AppProviders>
  );
}
