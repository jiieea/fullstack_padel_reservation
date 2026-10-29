'use client';

import {ADMIN_TABS} from '@/constants';
import {useAdmin} from '@/providers/AdminProvider';
import {useAuth} from '@/providers/AuthProvider';
import {FinancePanel} from './FinancePanel';
import {MasterSchedulePanel} from './MasterSchedulePanel';
import {MembersPanel} from './MembersPanel';
import {PricingPanel} from './PricingPanel';

export function AdminPortal() {
    const {tab, setTab} = useAdmin();
    const {session, logout} = useAuth();
    const active = ADMIN_TABS.find(t => t.id === tab)!;

    return (
        <div className="admin-app" aria-label="Portal Administrasi Padelia">
            <aside className="adm-side">
                <div>
                    <div className="adm-brand">PADELHUB ADMIN</div>
                    <div className="adm-nav">
                        {ADMIN_TABS.map(t => (
                            <button key={t.id} type="button" className={t.id === tab ? 'active' : ''}
                                    onClick={() => setTab(t.id)}>{t.icon} {t.title}</button>
                        ))}
                    </div>
                </div>
                <div style={{borderTop: '1px solid rgba(255,255,255,.15)', paddingTop: 16}}>
                    <p style={{fontSize: 12, color: '#97a8a0', margin: '0 0 10px'}}>Login
                        sebagai: <strong>{session?.name ?? 'Super Admin'}</strong></p>
                    <button type="button" className="btn sm ghost" style={{width: '100%'}} onClick={logout}>🚪 Keluar
                    </button>
                </div>
            </aside>

            <main className="adm-main">
                <div className="adm-header">
                    <div>
                        <h2 style={{fontSize: 32}}>{active.title}</h2>
                        <p style={{margin: 0, color: 'var(--mut)', fontSize: 14}}>Kelola operasional lapangan, blokir
                            jadwal maintenance, dan pantau booking real-time.</p>
                    </div>
                    <div style={{display: 'flex', gap: 10, alignItems: 'center'}}><span className="badge ok">Sinkronisasi Real-Time Aktif</span>
                    </div>
                </div>
                {tab === 'schedule' && <MasterSchedulePanel/>}
                {tab === 'pricing' && <PricingPanel/>}
                {tab === 'members' && <MembersPanel/>}
                {tab === 'finance' && <FinancePanel/>}
            </main>
        </div>
    );
}
