'use client';

import { useEffect } from 'react';
import { GUIDE } from '@/lib/data';
import { useDemo } from '@/lib/store';
import { Icon } from './Icon';

/** The presenter's step-by-step guide, docked above the tab bar. */
export function Guide() {
  const { state, actions, guideTarget } = useDemo();
  const g = state.guide;
  const visible = g.active && state.screen === 'app';

  // Keep the highlighted control in view as the step or the screen changes.
  useEffect(() => {
    if (!guideTarget) return;
    const target = document.querySelector('.guide-target');
    const screen = document.getElementById('screen');
    if (!target || !screen) return;
    const box = target.getBoundingClientRect(), view = screen.getBoundingClientRect();
    if (box.top < view.top || box.bottom > view.bottom) target.scrollIntoView({ block: 'center' });
  });

  if (!visible) return null;
  const step = GUIDE[g.step];
  const last = g.step === GUIDE.length - 1;
  const done = step.on && g.done[step.on];
  return (
    <div className="guide" role="region" aria-label="ไกด์สาธิต">
      <div className="guide-top">
        ไกด์สาธิต · {g.step + 1} จาก {GUIDE.length}
        {done && <span className="done"><Icon name="check" size={14} />เสร็จแล้ว</span>}
      </div>
      <b>{step.title}</b>
      <p>{step.text}</p>
      <div className="guide-actions">
        <button className="btn g-ghost" onClick={actions.guideExit}>ออก</button>
        {g.step > 0 && <button className="btn g-ghost" onClick={actions.guideBack}>ย้อนกลับ</button>}
        <button className="btn g-next" onClick={actions.guideNext}>{last ? 'จบไกด์' : 'ถัดไป'}<Icon name="chev" size={16} /></button>
      </div>
    </div>
  );
}
