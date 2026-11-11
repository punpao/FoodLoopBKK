// Shared types for the FoodLoopBKK prototype. Everything is plain data so the
// whole demo state can be cloned, reset and reasoned about easily.

export type TabId = 'home' | 'fridge' | 'deals' | 'dispose' | 'rewards';
export type LoopKey = 'eat' | 'save' | 'sort';
export type IconName =
  | 'home' | 'fridge' | 'tag' | 'bin' | 'trophy' | 'scan' | 'plus' | 'camera' | 'pin' | 'nav'
  | 'clock' | 'flame' | 'check' | 'x' | 'chev' | 'list' | 'map' | 'lock' | 'leaf' | 'star'
  | 'play' | 'info' | 'walk' | 'box' | 'pot' | 'cloud' | 'wallet';

export interface Food { name: string; icon: string; alias: string[] }

/** [food key, quantity label, days until expiry, price THB, weight kg] */
export type ItemSeed = [key: string, qty: string, days: number, price: number, kg: number];

export interface FridgeItem {
  id: string;
  key: string | null;      // null for manual entries that match no known food
  name: string;
  icon: string;
  qty: string;
  expires: string;         // ISO date, local time
  price: number;
  kg: number;
  isNew?: boolean;         // one-shot highlight after being added
}

export interface Ingredient { key: string; keep?: boolean }
export interface Recipe {
  id: string; name: string; icon: string; mins: number;
  ings: Ingredient[]; pantry: string; steps: string[];
}

export interface Store { name: string; type: string; dist: number; x: number; y: number }
export type DealCategory = 'bakery' | 'ready' | 'produce' | 'dairy';
export interface Deal {
  id: string; store: string; cat: DealCategory; icon: string; name: string;
  was: number; now: number; left: number; pickup: string; endsIn: number; kg: number;
  navigated: boolean;
}

export interface Perk { id: string; icon: string; name: string; partner: string; cost: number }
export interface Level { name: string; min: number; icon: string }
export interface LogEntry { icon: string; text: string; pts: number; when: string }

export type Overlay =
  | { type: 'scan'; phase: 'scanning' | 'found' }
  | { type: 'add' }
  | { type: 'recipe'; id: string }
  | { type: 'cooked'; name: string; icon: string; rescued: string[]; money: number; pts: number; mission: boolean; levelUp: Level | null }
  | { type: 'directions'; id: string; first: boolean }
  | { type: 'perk'; id: string }
  | { type: 'demo' };

export type DisposeStatus = 'idle' | 'photo' | 'checking' | 'rejected' | 'success';
export type GuideEvent = 'scan' | 'cook' | 'deal' | 'dispose';
export type GuideTarget = 'loop' | 'scan' | 'recipe' | 'navigate' | 'dispose' | 'metrics';

export interface GuideStep {
  tab: TabId; view?: 'items' | 'recipes'; target: GuideTarget; on?: GuideEvent; title: string; text: string;
}

export interface DemoState {
  screen: 'onboarding' | 'app';
  obStep: number;
  tab: TabId;
  overlay: Overlay | null;

  fridge: FridgeItem[];
  fridgeView: 'items' | 'recipes';
  scanned: boolean;
  mission: { key: string; done: boolean };

  deals: Deal[];
  dealsView: 'list' | 'map';
  filters: { cat: 'all' | DealCategory; dist: number; endingSoon: boolean };
  mapStore: string;

  dispose: { status: DisposeStatus; photo: string | null; forceFail: boolean };

  stats: { money: number; kg: number; items: number };
  points: number;                 // spendable balance
  xp: number;                     // lifetime points, drives the level
  streak: number;
  todayDone: boolean;
  pastWeek: boolean[];            // the six days before today
  loop: Record<LoopKey, boolean>;
  loopBonus: boolean;
  freshArcs: LoopKey[];           // arcs to animate the next time Home shows
  redeemed: Record<string, string>;
  log: LogEntry[];

  guide: { active: boolean; step: number; done: Partial<Record<GuideEvent, boolean>> };
  nextId: number;
}

export interface Toast { id: number; strong?: string; text: string; amber?: boolean; out?: boolean }
