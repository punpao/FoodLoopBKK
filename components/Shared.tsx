'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { daysLeft, freshness } from '@/lib/helpers';
import { useDemo } from '@/lib/store';
import type { FridgeItem } from '@/lib/types';
import { Icon } from './Icon';

/** Points balance in the top bar. Bumps briefly when the balance changes. */
function PointsPill() {
  const { state, actions } = useDemo();
  const prev = useRef(state.points);
  const [bump, setBump] = useState(false);
  useEffect(() => {
    if (prev.current === state.points) return;
    prev.current = state.points;
    setBump(true);
    const t = setTimeout(() => setBump(false), 500);
    return () => clearTimeout(t);
  }, [state.points]);
  return (
    <button className={bump ? 'pts-pill bump' : 'pts-pill'} onClick={() => actions.goTab('rewards')} aria-label={`${state.points} แต้ม เปิดหน้ารางวัล`}>
      <Icon name="star" size={16} />{state.points}
    </button>
  );
}

/** Points pill plus the discreet presenter button, shown on every tab. */
export function TopbarActions() {
  const { actions } = useDemo();
  return (
    <div className="topbar-actions">
      <PointsPill />
      <button className="icon-btn" onClick={actions.openDemo} aria-label="เครื่องมือสาธิต" title="เครื่องมือสาธิต">
        <Icon name="play" />
      </button>
    </div>
  );
}

export function Topbar({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="topbar">
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>
      <TopbarActions />
    </header>
  );
}

export function ProtoNote() {
  return <p className="proto-note">ต้นแบบสาธิต การสแกน การตรวจรูป แผนที่ ร้านค้า และพาร์ตเนอร์เป็นการจำลองทั้งหมด ตัวเลขในแอปเป็นข้อมูลสมมติ</p>;
}

/** Colour-coded countdown pill for a days-left value. */
export function FreshPill({ days }: { days: number }) {
  const f = freshness(days);
  return <span className={`pill pill-${f.state}`}><Icon name={f.state === 'fresh' ? 'leaf' : 'clock'} size={14} />{f.label}</span>;
}
export const ItemPill = ({ item }: { item: FridgeItem }) => <FreshPill days={daysLeft(item)} />;

/** Bottom sheet dialog. Moves focus into itself when it opens; a tap on the backdrop closes it. */
export function Sheet({ title, children, full = false, bare = false }: { title?: ReactNode; children: ReactNode; full?: boolean; bare?: boolean }) {
  const { actions } = useDemo();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.focus({ preventScroll: true }); }, []);
  const dialog = (
    <div ref={ref} className={full ? 'sheet is-full' : 'sheet'} role="dialog" aria-modal="true" aria-labelledby="sheetTitle" tabIndex={-1}>
      {title && (
        <div className="sheet-head">
          <h2 id="sheetTitle">{title}</h2>
          <button className="close" onClick={actions.closeOverlay} aria-label="ปิด"><Icon name="x" /></button>
        </div>
      )}
      {children}
    </div>
  );
  if (bare) return dialog;
  return <div className="overlay" onClick={e => { if (e.target === e.currentTarget) actions.closeOverlay(); }}>{dialog}</div>;
}
