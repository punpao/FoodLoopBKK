// Pure helpers: dates, formatting and values derived from the demo state.

import { DEALS, ENDING_SOON_MIN, FOODS, ICON_GUESS, LEVELS, NEAR_DAYS, RECIPES, SEED_FRIDGE, SEED_LOG, STORES } from './data';
import type { Deal, DemoState, Food, FridgeItem, Ingredient, ItemSeed, Recipe } from './types';

// ---------- Dates (date-only, local time) ----------
const DAY_MS = 86400000;
export function today(): Date { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
export function addDays(n: number): Date { const d = today(); d.setDate(d.getDate() + n); return d; }
export function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function fromIso(s: string): Date { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
export const daysLeft = (item: FridgeItem): number => Math.round((fromIso(item.expires).getTime() - today().getTime()) / DAY_MS);

// ---------- Freshness ----------
export type FreshState = 'expired' | 'today' | 'soon' | 'fresh';
/** Freshness state, list group and countdown label for a days-left value. */
export function freshness(d: number): { state: FreshState; group: string; label: string } {
  if (d < 0) return { state: 'expired', group: 'หมดอายุแล้ว', label: `หมดอายุมาแล้ว ${-d} วัน` };
  if (d === 0) return { state: 'today', group: 'หมดอายุวันนี้', label: 'หมดอายุวันนี้' };
  if (d <= NEAR_DAYS) return { state: 'soon', group: 'ควรรีบใช้', label: `เหลือ ${d} วัน` };
  return { state: 'fresh', group: 'ยังสด', label: `เหลือ ${d} วัน` };
}
export const isNear = (d: number): boolean => d >= 0 && d <= NEAR_DAYS;
export const whenWord = (d: number): string => (d === 0 ? 'วันนี้' : d === 1 ? 'พรุ่งนี้' : `ในอีก ${d} วัน`);

// ---------- Formatting ----------
export const baht = (n: number): string => '฿' + Math.round(n).toLocaleString('en-US');
export const fmtDist = (m: number): string => (m < 1000 ? `${m} ม.` : `${(m / 1000).toFixed(1)} กม.`);
export const pctOff = (d: Pick<Deal, 'was' | 'now'>): number => Math.round((1 - d.now / d.was) * 100);
export const walkMins = (m: number): number => Math.max(1, Math.round(m / 80));
export const cx = (...parts: (string | false | null | undefined)[]): string => parts.filter(Boolean).join(' ');

// ---------- Levels ----------
export const levelIndex = (xp: number): number => LEVELS.reduce((best, l, i) => (xp >= l.min ? i : best), 0);

// ---------- Fridge ----------
export function makeItem(id: string, [key, qty, days, price, kg]: ItemSeed, isNew = false): FridgeItem {
  const f = FOODS[key];
  return { id, key, name: f.name, icon: f.icon, qty, expires: iso(addDays(days)), price, kg, isNew };
}
export const sortedFridge = (fridge: FridgeItem[]): FridgeItem[] => [...fridge].sort((a, b) => daysLeft(a) - daysLeft(b));

/** Match a typed item name to a known food (for recipes) and pick an icon. */
export function guessFood(name: string): { key: string | null; icon: string } {
  const n = name.toLowerCase();
  const key = Object.keys(FOODS).find(k => FOODS[k].alias.some(a => n.includes(a)));
  if (key) return { key, icon: FOODS[key].icon };
  const hit = ICON_GUESS.find(([word]) => n.includes(word));
  return { key: null, icon: hit ? hit[1] : '🥡' };
}

// ---------- Recipes ----------
export interface RecipeIng extends Ingredient { food: Food; item: FridgeItem | null; d: number | null; near: boolean }
export interface RecipeInfo { ings: RecipeIng[]; near: RecipeIng[]; have: RecipeIng[]; missing: RecipeIng[]; soonest: number }

/** For one recipe: which ingredients are in the fridge (not expired), which are missing, how many expire soon. */
export function recipeInfo(fridge: FridgeItem[], r: Recipe): RecipeInfo {
  const have: Record<string, FridgeItem> = {};
  sortedFridge(fridge).forEach(it => { if (it.key && daysLeft(it) >= 0 && !have[it.key]) have[it.key] = it; });
  const ings: RecipeIng[] = r.ings.map(g => {
    const item = have[g.key] ?? null;
    const d = item ? daysLeft(item) : null;
    return { ...g, food: FOODS[g.key], item, d, near: d !== null && isNear(d) };
  });
  const inFridge = ings.filter(g => g.item);
  return {
    ings,
    near: ings.filter(g => g.near),
    have: inFridge,
    missing: ings.filter(g => !g.item),
    soonest: Math.min(99, ...inFridge.map(g => g.d as number)),
  };
}

/** Recipes that use near-expiry items come first, then the ones closest to expiry, then fewest missing. */
export function rankedRecipes(fridge: FridgeItem[]): { r: Recipe; info: RecipeInfo }[] {
  return RECIPES.map(r => ({ r, info: recipeInfo(fridge, r) }))
    .sort((a, b) => b.info.near.length - a.info.near.length || a.info.soonest - b.info.soonest || a.info.missing.length - b.info.missing.length);
}
export function bestRecipeFor(fridge: FridgeItem[], key: string | null): Recipe | undefined {
  if (!key) return undefined;
  return rankedRecipes(fridge).find(x => x.info.have.some(g => g.key === key))?.r;
}

/** Today's mission target: the seeded item while it is still in the fridge, else the next expiring item with a recipe. */
export function missionTarget(s: Pick<DemoState, 'fridge' | 'mission'>): FridgeItem | null {
  const usable = sortedFridge(s.fridge).filter(it => it.key && isNear(daysLeft(it)) && bestRecipeFor(s.fridge, it.key));
  return usable.find(it => it.key === s.mission.key) ?? usable[0] ?? null;
}

// ---------- Deals ----------
export function filteredDeals(s: Pick<DemoState, 'deals' | 'filters'>): Deal[] {
  const f = s.filters;
  return s.deals
    .filter(d => (f.cat === 'all' || d.cat === f.cat) && (!f.dist || STORES[d.store].dist <= f.dist) && (!f.endingSoon || d.endsIn <= ENDING_SOON_MIN))
    .sort((a, b) => STORES[a.store].dist - STORES[b.store].dist);
}

// ---------- Initial state ----------
/** The full initial state. Calling this again is exactly what "รีเซ็ตเดโม" does. */
export function seedState(): DemoState {
  let n = 0;
  return {
    screen: 'onboarding',
    obStep: 0,
    tab: 'home',
    overlay: null,

    fridge: SEED_FRIDGE.map(row => makeItem('i' + ++n, row)),
    fridgeView: 'items',
    scanned: false,
    mission: { key: 'bread', done: false },

    deals: DEALS.map(d => ({ ...d, navigated: false })),
    dealsView: 'list',
    filters: { cat: 'all', dist: 0, endingSoon: false },
    mapStore: 'yimyim',

    dispose: { status: 'idle', photo: null, forceFail: false },

    // Illustrative totals for "this month" so the app looks lived-in on first load.
    stats: { money: 486, kg: 4.2, items: 14 },
    points: 290,
    xp: 440,
    streak: 4,
    todayDone: false,
    pastWeek: [true, false, true, true, true, true],
    loop: { eat: false, save: false, sort: false },
    loopBonus: false,
    freshArcs: [],
    redeemed: { p1: 'LOOP-BAG-7F3K' },
    log: SEED_LOG.map(e => ({ ...e })),

    guide: { active: false, step: 0, done: {} },
    nextId: n,
  };
}
