import { sha256 } from '@/lib/crypto';
import { fmtIsoFull } from '@/lib/format';
import type { Booking, PersistedData } from '@/types';



/** Ensures demo admin/member accounts and a demo booking exist. */
export async function seedData(data: PersistedData, todayIso: string): Promise<PersistedData> {
  const users = [...data.users];
  if (!users.some(u => u.role === 'admin'))
    users.push({ uid: 'ADMIN', name: 'Super Admin', role: 'admin', pass: await sha256('admin123') });
  if (!users.some(u => u.uid === 'MBR-GOLD01'))
    users.push({ uid: 'MBR-GOLD01', name: 'Andi Wijaya', wa: '08123456001', email: 'andi@example.com', role: 'member', pass: await sha256('member123') });
  return { ...data, users };
}
