# FoodLoopBKK

Clickable, mobile-first prototype of FoodLoopBKK, a consumer app concept that turns food-waste
reduction into a daily habit for Gen Y and Gen Z in Bangkok. Built for a case-competition pitch.

## Run it

Open `index.html` in a modern browser. There is no build step, no backend and no API key.

- On a desktop it renders in a 390 × 844 phone frame with a presenter panel beside it.
- On a phone it runs full screen.
- Fonts (Mitr and Anuphan) load from Google Fonts when online and fall back to system Thai fonts offline.

## Demo flow

1. Onboarding shows the problem stats from the pitch, then lands on Home.
2. **Fridge** (before you eat): scan a receipt (simulated), add items by hand, cook a recipe that uses near-expiry food.
3. **Deals** (before you waste): surplus food at 40–60% off, pickup only. "Navigate to store" shows the saving.
4. **Dispose** (when you dispose): Mai Thay Ruam photo proof unlocks a ฿20 collection-fee voucher.
5. **Rewards**: money saved, food saved, CO₂e estimate, streak, levels and perks update from those actions.

Presenter controls live behind the round play button in the top bar (and in the desktop side panel):

- **Start demo guide** walks Home → Fridge → Deals → Dispose → Rewards and highlights each key control. `←` / `→` step through it.
- **Reset demo** restores the seeded state. State is held in memory only, so a reload also resets it.
- On the Dispose tab, tick **Presenter: make the next check fail** to show the rejected-photo state.

## What is mock

Everything. Receipt scanning, photo verification, the map and directions, stores, partners, vouchers
and codes are simulated with timers and canned data. Nothing connects to BMA systems. The onboarding
figures come from the pitch brief; every number inside the app (prices, kg, CO₂e, points) is
illustrative demo data.

## Code map

`index.html` is one file with labelled sections:

- **Styles**: design tokens first (greens `#2A6419` / `#4BA254` from the BMA web CI notes, one amber accent), then components per screen.
- **Script**: `1. Data` → `2. State` (`seedState()`) → `3. Helpers` → `4. Rendering` (one function per screen and overlay) → `5. Handlers` (`actions{}` keyed by `data-action`) → `6. Demo guide` → `7. Boot`.

To extend it, add data to the catalogues at the top, a `view…()` function for a new screen, and an entry in `actions` for each new control.
