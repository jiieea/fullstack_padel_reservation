# Padelia – Next.js (App Router, TypeScript)

    npm install
    npm run dev      # http://localhost:3000

Demo logins: member `MBR-GOLD01` / `member123` · admin `ADMIN` / `admin123`
Data is persisted in localStorage (same keys as the original HTML).

## Structure
- `src/types`, `src/constants` – models, defaults, config
- `src/lib` – pure helpers (format, pricing, slots, validation, download, crypto)
- `src/actions` – reducers + business rules (data, booking, auth, admin, seed)
- `src/providers` – Data (persistence), Auth, Booking (UI state), Admin
- `src/hooks` (+ `admin/`) – one hook per feature; components only render
- `src/components` – layout, sections, booking, mine, modals, admin
