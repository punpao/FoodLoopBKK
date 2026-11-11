'use client';

// The demo store: one in-memory state object plus the actions that change it.
// Nothing here touches a network, camera API or browser storage. Scans and
// photo checks are simulated with timers.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { GUIDE, LEVELS, LOOP, PERKS, POINTS, RECEIPT, RECIPES, STREAK_MILESTONES } from './data';
import { daysLeft, guessFood, isNear, levelIndex, makeItem, missionTarget, recipeInfo, seedState } from './helpers';
import type { DealCategory, DemoState, GuideEvent, GuideTarget, Level, LoopKey, TabId, Toast } from './types';

/** Feedback collected while an action runs, shown once the state is committed. */
interface Fx { toasts: Omit<Toast, 'id'>[]; confetti: boolean }
interface AwardInput { pts: number; text: string; icon: string; money?: number; kg?: number; items?: number; loop?: LoopKey }

const SCAN_MS = 2400;
const VERIFY_MS = 2200;
const NO_FILTERS = { cat: 'all' as const, dist: 0, endingSoon: false };

// Every qualifying action goes through award(): points, totals, streak, loop arcs, level-ups, celebration.
function award(s: DemoState, fx: Fx, { pts, text, icon, money = 0, kg = 0, items = 0, loop }: AwardInput): { levelUp: Level | null } {
  const levelBefore = levelIndex(s.xp);
  fx.toasts.push({ strong: `+${pts} แต้ม`, text });

  s.xp += pts; s.points += pts;
  s.stats.money += money;
  s.stats.kg = Math.round((s.stats.kg + kg) * 10) / 10;
  s.stats.items += items;
  s.log.unshift({ icon, text, pts, when: 'เมื่อสักครู่' });

  if (!s.todayDone) {                               // first action today extends the streak
    s.todayDone = true; s.streak += 1;
    const milestone = STREAK_MILESTONES.includes(s.streak);
    fx.toasts.push({ text: `🔥 ต่อเนื่อง ${s.streak} วัน${milestone ? ' ถึงเป้าแล้ว!' : 'แล้ว'}`, amber: milestone });
    fx.confetti ||= milestone;
  }
  if (loop && !s.loop[loop]) {                      // close one arc of today's loop
    s.loop[loop] = true; s.freshArcs.push(loop);
    if (LOOP.every(l => s.loop[l.key]) && !s.loopBonus) {
      s.loopBonus = true; s.xp += POINTS.loopBonus; s.points += POINTS.loopBonus;
      s.log.unshift({ icon: '🔄', text: 'ปิดลูปของวันนี้', pts: POINTS.loopBonus, when: 'เมื่อสักครู่' });
      fx.toasts.push({ text: `ปิดลูปวันนี้ครบแล้ว รับโบนัส +${POINTS.loopBonus} แต้ม`, amber: true });
      fx.confetti = true;
    }
  }
  const levelAfter = levelIndex(s.xp);
  const levelUp = levelAfter > levelBefore ? LEVELS[levelAfter] : null;
  if (levelUp) { fx.toasts.push({ text: `${levelUp.icon} เลื่อนระดับ: ตอนนี้คุณคือ${levelUp.name}`, amber: true }); fx.confetti = true; }
  return { levelUp };
}

// Leaving a tab clears its one-shot animation flags so they do not replay on return.
function go(s: DemoState, tab: TabId) {
  if (s.tab === 'home') s.freshArcs = [];
  if (s.tab === 'fridge') s.fridge.forEach(it => { it.isNew = false; });
  s.tab = tab;
}
function guideGo(s: DemoState, i: number) {
  const step = GUIDE[i];
  s.guide.step = i; s.overlay = null;
  go(s, step.tab);
  if (step.view) s.fridgeView = step.view;
  if (step.tab === 'deals') { s.dealsView = 'list'; s.filters = { ...NO_FILTERS }; }
}
const signal = (s: DemoState, evt: GuideEvent) => { if (s.guide.active) s.guide.done[evt] = true; };

function useDemoStore() {
  const [state, setState] = useState<DemoState>(seedState);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [bursts, setBursts] = useState<number[]>([]);
  const ref = useRef(state);          // latest state, so actions never read a stale closure
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const seq = useRef(0);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => { timers.current = timers.current.filter(t => t !== id); fn(); }, ms);
    timers.current.push(id);
  }, []);
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current = []; }, []);

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++seq.current;
    setToasts(list => [...list, { ...t, id }]);
    later(() => setToasts(list => list.map(x => (x.id === id ? { ...x, out: true } : x))), 2800);
    later(() => setToasts(list => list.filter(x => x.id !== id)), 3200);
  }, [later]);

  const confetti = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = ++seq.current;
    setBursts(list => [...list, id]);
    later(() => setBursts(list => list.filter(x => x !== id)), 2400);
  }, [later]);

  /** Apply a change to a copy of the state, commit it, then play any feedback it queued. */
  const commit = useCallback((change: (s: DemoState, fx: Fx) => void) => {
    const draft = structuredClone(ref.current);
    const fx: Fx = { toasts: [], confetti: false };
    change(draft, fx);
    ref.current = draft;
    setState(draft);
    fx.toasts.forEach((t, i) => later(() => pushToast(t), i * 550));
    if (fx.confetti) confetti();
  }, [confetti, later, pushToast]);

  const actions = useMemo(() => {
    const releasePhoto = () => { const p = ref.current.dispose.photo; if (p && p !== 'sample') URL.revokeObjectURL(p); };
    const setPhoto = (src: string | null) => {
      releasePhoto();
      commit(s => { s.dispose.photo = src; s.dispose.status = src ? 'photo' : 'idle'; });
    };

    return {
      // --- Onboarding
      obNext: () => commit(s => { if (s.obStep < 2) s.obStep += 1; else s.screen = 'app'; }),
      obBack: () => commit(s => { s.obStep = Math.max(0, s.obStep - 1); }),
      obSkip: () => commit(s => { s.screen = 'app'; }),

      // --- Navigation
      goTab: (tab: TabId) => commit(s => { s.overlay = null; go(s, tab); }),
      closeOverlay: () => commit(s => { s.overlay = null; }),
      setFridgeView: (view: 'items' | 'recipes') => commit(s => { if (s.tab !== 'fridge') go(s, 'fridge'); s.fridgeView = view; }),

      // --- Fridge: simulated receipt scan
      openScan: () => {
        commit(s => { s.overlay = { type: 'scan', phase: 'scanning' }; });
        later(() => commit(s => { if (s.overlay?.type === 'scan') s.overlay.phase = 'found'; }), SCAN_MS);
      },
      confirmScan: () => commit((s, fx) => {
        RECEIPT.items.forEach(row => s.fridge.push(makeItem('i' + ++s.nextId, row, true)));
        s.scanned = true; s.overlay = null; s.fridgeView = 'items';
        award(s, fx, { pts: POINTS.scan, text: `บันทึก ${RECEIPT.items.length} รายการจากใบเสร็จ`, icon: '🧾', loop: 'eat' });
        signal(s, 'scan');
      }),

      // --- Fridge: manual entry and item actions
      openAdd: () => commit(s => { s.overlay = { type: 'add' }; }),
      addItem: (name: string, qty: string, expires: string) => commit((s, fx) => {
        const g = guessFood(name);
        s.fridge.push({ id: 'i' + ++s.nextId, key: g.key, name, icon: g.icon, qty: qty || '1', expires, price: 30, kg: 0.2, isNew: true });
        s.overlay = null; s.fridgeView = 'items';
        award(s, fx, { pts: POINTS.log, text: `บันทึก${name}`, icon: g.icon, loop: 'eat' });
      }),
      markUsed: (id: string) => commit((s, fx) => {
        const it = s.fridge.find(x => x.id === id);
        if (!it) return;
        s.fridge = s.fridge.filter(x => x.id !== id);
        if (isNear(daysLeft(it))) award(s, fx, { pts: POINTS.use, text: `ใช้${it.name}ทันเวลา`, icon: it.icon, money: it.price, kg: it.kg, items: 1, loop: 'eat' });
        else award(s, fx, { pts: POINTS.log, text: `ใช้${it.name}แล้ว`, icon: it.icon, loop: 'eat' });
      }),
      binItem: (id: string) => commit((s, fx) => {
        const it = s.fridge.find(x => x.id === id);
        if (!it) return;
        s.fridge = s.fridge.filter(x => x.id !== id);
        go(s, 'dispose');
        fx.toasts.push({ text: `นำ${it.name}ออกแล้ว แยกทิ้งเป็นขยะอินทรีย์เพื่อรับสิทธิ์ค่าเก็บขยะ` });
      }),

      // --- Recipes
      openRecipe: (id: string) => commit(s => { s.overlay = { type: 'recipe', id }; }),
      cook: (id: string) => commit((s, fx) => {
        const r = RECIPES.find(x => x.id === id)!;
        const info = recipeInfo(s.fridge, r);
        const target = missionTarget(s);
        const used = info.have.filter(g => !g.keep);                    // staples marked keep stay in the fridge
        const rescued = used.filter(g => g.near).map(g => g.item!);     // near-expiry items count as rescued
        const usedIds = new Set(used.map(g => g.item!.id));
        s.fridge = s.fridge.filter(it => !usedIds.has(it.id));
        const missionHit = !s.mission.done && !!target && info.have.some(g => g.item!.id === target.id);
        if (missionHit) s.mission.done = true;
        const pts = POINTS.cook + POINTS.perRescue * rescued.length + (missionHit ? POINTS.mission : 0);
        const money = rescued.reduce((sum, it) => sum + it.price, 0);
        const { levelUp } = award(s, fx, { pts, text: `ทำ${r.name}`, icon: r.icon, money, kg: rescued.reduce((sum, it) => sum + it.kg, 0), items: rescued.length, loop: 'eat' });
        s.overlay = { type: 'cooked', name: r.name, icon: r.icon, rescued: rescued.map(it => it.name), money, pts, mission: missionHit, levelUp };
        signal(s, 'cook');
      }),

      // --- Deals
      setDealsView: (view: 'list' | 'map') => commit(s => { s.dealsView = view; }),
      setCategory: (cat: 'all' | DealCategory) => commit(s => { s.filters.cat = cat; }),
      setDistance: (dist: number) => commit(s => { s.filters.dist = dist; }),
      toggleEndingSoon: () => commit(s => { s.filters.endingSoon = !s.filters.endingSoon; }),
      clearFilters: () => commit(s => { s.filters = { ...NO_FILTERS }; }),
      selectStore: (store: string) => commit(s => { s.mapStore = store; }),
      navigate: (id: string) => commit((s, fx) => {
        const deal = s.deals.find(x => x.id === id)!;
        const first = !deal.navigated;
        if (first) {                                                    // the saving counts once, on the first tap
          deal.navigated = true; deal.left = Math.max(0, deal.left - 1);
          award(s, fx, { pts: POINTS.deal, text: `รับดีล ${deal.name}`, icon: deal.icon, money: deal.was - deal.now, kg: deal.kg, items: 1, loop: 'save' });
          signal(s, 'deal');
        }
        s.overlay = { type: 'directions', id, first };
      }),

      // --- Dispose
      pickPhoto: (file: File) => setPhoto(URL.createObjectURL(file)),
      samplePhoto: () => setPhoto('sample'),
      clearPhoto: () => setPhoto(null),
      setForceFail: (on: boolean) => commit(s => { s.dispose.forceFail = on; }),
      verify: () => {
        commit(s => { s.dispose.status = 'checking'; });
        later(() => commit((s, fx) => {
          if (s.dispose.status !== 'checking') return;
          if (s.dispose.forceFail) { s.dispose.forceFail = false; s.dispose.status = 'rejected'; return; }
          s.dispose.status = 'success';
          award(s, fx, { pts: POINTS.dispose, text: 'แยกขยะอินทรีย์ ยืนยันรูปแล้ว', icon: '🗑️', loop: 'sort' });
          signal(s, 'dispose');
          fx.confetti = true;
        }), VERIFY_MS);
      },

      // --- Rewards
      openPerk: (id: string) => commit(s => { s.overlay = { type: 'perk', id }; }),
      redeem: (id: string) => commit((s, fx) => {
        const p = PERKS.find(x => x.id === id)!;
        if (s.redeemed[id] || s.points < p.cost) return;
        s.points -= p.cost;
        s.redeemed[id] = `LOOP-${id.toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        fx.toasts.push({ text: `แลกแล้ว: ${p.name}`, amber: true });
        fx.confetti = true;
      }),

      // --- Demo tools
      openDemo: () => commit(s => { s.overlay = { type: 'demo' }; }),
      replayIntro: () => commit(s => { s.overlay = null; s.guide.active = false; s.screen = 'onboarding'; s.obStep = 0; }),
      reset: () => {
        timers.current.forEach(clearTimeout); timers.current = [];
        releasePhoto();
        setToasts([]); setBursts([]);
        const fresh = seedState();
        ref.current = fresh;
        setState(fresh);
      },
      guideStart: () => commit(s => { s.screen = 'app'; s.guide = { active: true, step: 0, done: {} }; guideGo(s, 0); }),
      guideNext: () => commit(s => { if (s.guide.step < GUIDE.length - 1) guideGo(s, s.guide.step + 1); else s.guide.active = false; }),
      guideBack: () => commit(s => { if (s.guide.step > 0) guideGo(s, s.guide.step - 1); }),
      guideExit: () => commit(s => { s.guide.active = false; }),
    };
  }, [commit, later]);

  // The control the demo guide is pointing at right now, if it is on screen.
  const step = GUIDE[state.guide.step];
  const guideTarget: GuideTarget | null =
    state.guide.active && state.screen === 'app' && !state.overlay && state.tab === step.tab ? step.target : null;

  return { state, actions, toasts, bursts, guideTarget };
}

type DemoStore = ReturnType<typeof useDemoStore>;
const DemoContext = createContext<DemoStore | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const store = useDemoStore();
  return <DemoContext.Provider value={store}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoStore {
  const store = useContext(DemoContext);
  if (!store) throw new Error('useDemo must be used inside <DemoProvider>');
  return store;
}
