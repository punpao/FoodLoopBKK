'use client';

import { useState, type CSSProperties } from 'react';
import { useDemo } from '@/lib/store';

/** Toasts for points, streaks and level-ups. */
export function Toasts() {
  const { toasts } = useDemo();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={['toast', t.amber ? 'is-amber' : '', t.out ? 'out' : ''].join(' ')}>
          {t.strong && <b>{t.strong}</b>}{t.text}
        </div>
      ))}
    </div>
  );
}

const COLORS = ['#F6A609', '#4BA254', '#B9E08A', '#2A6419', '#FFEFC9'];

function Burst() {
  // Random piece positions are fixed once per burst so re-renders do not reshuffle them.
  const [pieces] = useState(() => Array.from({ length: 40 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    background: COLORS[i % COLORS.length],
    animationDelay: `${Math.random() * 0.35}s`,
    '--dx': `${(Math.random() - 0.5) * 160}px`,
    '--rot': `${(Math.random() - 0.5) * 900}deg`,
  }) as CSSProperties));
  return <>{pieces.map((style, i) => <i key={i} className="confetti" style={style} />)}</>;
}

/** Confetti for milestones. The store skips it when reduced motion is requested. */
export function Confetti() {
  const { bursts } = useDemo();
  return <div className="fx" aria-hidden="true">{bursts.map(id => <Burst key={id} />)}</div>;
}
