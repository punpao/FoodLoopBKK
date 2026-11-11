'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { LOOP, TABS } from '@/lib/data';
import { DemoProvider, useDemo } from '@/lib/store';
import type { TabId } from '@/lib/types';
import { Confetti, Toasts } from './Feedback';
import { Guide } from './Guide';
import { Icon } from './Icon';
import { FULL_LOOP, LoopRing } from './LoopRing';
import { OverlayHost } from './overlays/Overlays';
import { Deals } from './screens/Deals';
import { Dispose } from './screens/Dispose';
import { Fridge } from './screens/Fridge';
import { Home } from './screens/Home';
import { Onboarding } from './screens/Onboarding';
import { Rewards } from './screens/Rewards';

const SCREENS: Record<TabId, () => ReactNode> = { home: Home, fridge: Fridge, deals: Deals, dispose: Dispose, rewards: Rewards };

/** Shown beside the phone on wide screens only. */
function PresenterPanel() {
  const { actions } = useDemo();
  return (
    <aside className="presenter" aria-label="แผงผู้นำเสนอ">
      <h1><LoopRing done={FULL_LOOP} size={44} light />FoodLoopBKK</h1>
      <p className="lede">เปลี่ยนความใส่ใจเรื่องขยะอาหาร ให้เป็นนิสัยประจำวันที่ได้อะไรกลับมา</p>
      <ul className="journey">
        {LOOP.map(l => <li key={l.key}><span className="tile"><Icon name={l.icon} /></span><div><b>{l.phase}</b><span>{l.blurb}</span></div></li>)}
      </ul>
      <div className="controls">
        <button className="btn btn-primary btn-sm" onClick={actions.guideStart}>เริ่มไกด์สาธิต</button>
        <button className="btn btn-secondary btn-sm" onClick={actions.reset}>รีเซ็ตเดโม</button>
      </div>
      <p className="note">
        ขณะเปิดไกด์ กด <kbd>←</kbd> <kbd>→</kbd> เพื่อเลื่อนขั้นตอน<br />
        ต้นแบบสำหรับการแข่งขันเคส การสแกน การตรวจรูป แผนที่ ร้านค้า และพาร์ตเนอร์เป็นการจำลอง ตัวเลขในแอปเป็นข้อมูลสมมติ
      </p>
    </aside>
  );
}

function Phone() {
  const { state, actions } = useDemo();
  const screenRef = useRef<HTMLElement>(null);
  const inApp = state.screen === 'app';
  const Screen = SCREENS[state.tab];

  // Each new screen starts at the top.
  useEffect(() => { screenRef.current?.scrollTo(0, 0); }, [state.screen, state.tab, state.obStep]);

  // Keyboard: Escape closes a sheet; arrow keys step the demo guide.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if (e.key === 'Escape' && state.overlay) actions.closeOverlay();
      else if (state.guide.active && !typing && e.key === 'ArrowRight') actions.guideNext();
      else if (state.guide.active && !typing && e.key === 'ArrowLeft') actions.guideBack();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [actions, state.guide.active, state.overlay]);

  return (
    <div className="phone">
      <div className="app">
        <main className="screen" id="screen" ref={screenRef} tabIndex={-1}>
          {inApp ? <Screen /> : <Onboarding />}
        </main>
        <Guide />
        {inApp && (
          <nav className="tabbar" aria-label="เมนูหลัก">
            {TABS.map(t => (
              <button key={t.id} className="tab" onClick={() => actions.goTab(t.id)} aria-current={state.tab === t.id ? 'page' : undefined}>
                <span className="tab-ic"><Icon name={t.icon} /></span>
                <span className="tab-label">{t.label}</span>
              </button>
            ))}
          </nav>
        )}
        <OverlayHost />
        <Toasts />
        <Confetti />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <div className="stage">
        <PresenterPanel />
        <Phone />
      </div>
    </DemoProvider>
  );
}
