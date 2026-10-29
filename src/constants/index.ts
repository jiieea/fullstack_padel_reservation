import type {Addon, Config, CourtFilter, Member, PayMethod} from '@/types';

export const STORAGE_KEYS = {
    BOOKINGS: 'padelia_v3_bookings',
    CONFIG: 'padelia_v3_config',
    MEMBERS: 'padelia_v3_members',
    BLOCKS: 'padelia_v3_blocks',
    USERS: 'padelia_v3_users',
    SESSION: 'padelia_v3_session',
} as const;

export const DEFAULT_CONFIG: Config = {
    courts: [
        {id: 1, name: 'Court Emerald', type: 'indoor', price: 180000, info: 'Indoor, AC, Kaca Panoramic'},
        {id: 2, name: 'Court Ivory', type: 'indoor', price: 180000, info: 'Indoor, AC, Kaca Panoramic'},
        {id: 3, name: 'Court Champagne', type: 'outdoor', price: 150000, info: 'Outdoor, Atap UV, Lampu Turnamen'},
        {id: 4, name: 'Court Lime', type: 'outdoor', price: 150000, info: 'Outdoor, Atap UV, Lampu Turnamen'},
    ],
    pricing: {peakStart: 17, peakEnd: 21, peakPct: 30, weekendPct: 15, earlyPct: 10},
    promos: [{code: 'PADELIA10', pct: 10}],
};

export const DEFAULT_MEMBERS: Member[] = [
    {
        id: 'MBR-GOLD01',
        name: 'Andi Wijaya',
        wa: '08123456001',
        tier: 'Gold',
        disc: 15,
        court: 1,
        dow: 3,
        hour: 19,
        dur: 2
    },
];

export const ADDONS: Addon[] = [
    {id: 'raket', n: 'Sewa Raket Carbon (4x)', p: 60000},
    {id: 'bola', n: 'Bola Kaleng Baru (3 Bola)', p: 45000},
    {id: 'coach', n: 'Pelatih Lisensi (1 Jam)', p: 150000},
    {id: 'minum', n: 'Paket Isotonik Dingin (4x)', p: 36000},
];

export const HOURS = Array.from({length: 16}, (_, i) => i + 7);
export const MAX_SLOT_HOURS = 4;
export const MAX_DISCOUNT_PCT = 50;
export const PAYMENT_TIMEOUT_SECONDS = 599;
export const PHONE_REGEX = /^(\+?62|0)8\d{7,12}$/;
export const DEFAULT_AUTH_NOTE = 'Masuk untuk melanjutkan.';
export const CHECKOUT_PENDING = 'checkout';
export const OCC_THRESHOLDS = {high: 0.65, mid: 0.3};

export const DOW_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
export const DOW_OPTIONS = [
    {value: 1, label: 'Senin'}, {value: 2, label: 'Selasa'}, {value: 3, label: 'Rabu'},
    {value: 4, label: 'Kamis'}, {value: 5, label: 'Jumat'}, {value: 6, label: 'Sabtu'},
    {value: 0, label: 'Minggu'},
];
export const TIER_OPTIONS = [
    {value: 'Gold|15', label: 'Member Gold (15%)'},
    {value: 'VIP|25', label: 'Member VIP (25%)'},
    {value: 'Komunitas|20', label: 'Komunitas (20%)'},
];

export const COURT_FILTERS: { id: CourtFilter; label: string }[] = [
    {id: 'all', label: 'Semua Court'},
    {id: 'indoor', label: 'Indoor AC'},
    {id: 'outdoor', label: 'Outdoor'},
];
export const PAY_METHODS: { id: PayMethod; label: string }[] = [
    {id: 'QRIS', label: 'QRIS Instan'},
    {id: 'VA_BCA', label: 'BCA Virtual Account'},
    {id: 'CARD', label: 'Kartu Kredit/Debit'},
];
export const ADMIN_TABS = [
    {id: 'schedule', icon: '📅', title: 'Master Schedule Board'},
    {id: 'pricing', icon: '⚡', title: 'Dynamic Pricing System'},
    {id: 'members', icon: '👥', title: 'Manajemen Member Tetap'},
    {id: 'finance', icon: '📊', title: 'Laporan Keuangan & Okupansi'},
] as const;
export type AdminTabId = (typeof ADMIN_TABS)[number]['id'];
