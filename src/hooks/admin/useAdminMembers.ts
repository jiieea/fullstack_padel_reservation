import { useState } from 'react';
import { buildMemberWithAccount, type MemberForm } from '@/actions/admin.actions';
import { useAuth } from '@/providers/AuthProvider';
import { useData } from '@/providers/DataProvider';

const EMPTY: MemberForm = { id: '', name: '', wa: '', tier: 'Gold|15', court: '0', dow: '1', hour: '19', dur: '2' };

export function useAdminMembers() {
  const { isAdmin } = useAuth();
  const { members, users, dispatch } = useData();
  const [form, setForm] = useState<MemberForm>(EMPTY);

  return {
    members, form,
    setField: (patch: Partial<MemberForm>) => setForm(f => ({ ...f, ...patch })),
    add: async () => {
      if (!isAdmin) return;
      const built = await buildMemberWithAccount(form, users);
      if (!built) return;
      dispatch({ type: 'ADD_MEMBER', member: built.member, user: built.user });
      setForm(f => ({ ...f, id: '', name: '', wa: '' }));
    },
    remove: (id: string) => { if (isAdmin) dispatch({ type: 'REMOVE_MEMBER', id }); },
  };
}
