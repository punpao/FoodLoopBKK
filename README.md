# FoodLoopBKK

Clickable, mobile-first prototype of FoodLoopBKK, a consumer app concept that turns food-waste
reduction into a daily habit for Gen Y and Gen Z in Bangkok. Built for a case-competition pitch.
The interface is in Thai.

## Run it

Requires Node.js 20.9 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000. For a production build, run `npm run build` followed by `npm start`.

- On a desktop it renders in a 390 × 844 phone frame with a presenter panel beside it.
- On a phone it runs full screen.
- Fonts (Mitr and Anuphan) are self-hosted by `next/font`, so the running app makes no external requests. `npm run build` needs internet once to download them.

## Demo flow

1. Onboarding shows the problem stats from the pitch, then lands on Home (หน้าหลัก).
2. **ตู้เย็น** (before you eat): scan a receipt (simulated), add items by hand, cook a recipe that uses near-expiry food.
3. **ดีล** (before you waste): surplus food at 40–60% off, pickup only. "นำทางไปร้าน" shows the saving.
4. **ไม่เทรวม** (when you dispose): Mai Thay Ruam photo proof unlocks a ฿20 collection-fee voucher.
5. **รางวัล**: money saved, food saved, CO₂e estimate, streak, levels and perks update from those actions.

Presenter controls live behind the round play button in the top bar (and in the desktop side panel):

- **เริ่มไกด์สาธิต** (demo guide) walks Home → Fridge → Deals → Dispose → Rewards and highlights each key control. `←` / `→` step through it.
- **รีเซ็ตเดโม** (reset demo) restores the seeded state. State is held in memory only, so a reload also resets it.
- On the ไม่เทรวม tab, tick **สำหรับผู้นำเสนอ: ให้การตรวจครั้งถัดไปไม่ผ่าน** to show the rejected-photo state.

## What is mock

Everything. Receipt scanning, photo verification, the map and directions, stores, partners, vouchers
and codes are simulated with timers and canned data. Nothing connects to BMA systems. The onboarding
figures come from the pitch brief; every number inside the app (prices, kg, CO₂e, points) is
illustrative demo data.

## Code map

Next.js (App Router) with TypeScript and plain CSS. No UI or state library.

| Path | What it holds |
|---|---|
| `app/layout.tsx` | Fonts, metadata, `lang="th"` |
| `app/globals.css` | Design tokens (greens `#2A6419` / `#4BA254` from the BMA web CI notes, one amber accent) and all component styles |
| `lib/data.ts` | Mock catalogues and Thai content: foods, recipes, stores, deals, perks, levels, guide steps |
| `lib/helpers.ts` | Dates, formatting, recipe ranking, deal filters, `seedState()` |
| `lib/store.tsx` | The in-memory demo state and every action (`useDemo()`) |
| `components/App.tsx` | Phone frame, tab bar, presenter panel, keyboard handling |
| `components/screens/` | One file per screen: Onboarding, Home, Fridge, Deals, Dispose, Rewards |
| `components/overlays/Overlays.tsx` | Sheets: scan, add item, recipe, directions, perk, demo tools |
| `components/Guide.tsx` | The presenter's demo guide |

To extend it, add data in `lib/data.ts`, an action in `lib/store.tsx`, and a component under `components/`.
