'use client';

import type { ReactNode } from 'react';
import { LOOP } from '@/lib/data';
import { useDemo } from '@/lib/store';
import { Icon } from '../Icon';
import { FULL_LOOP, LoopRing } from '../LoopRing';

const RING = { cx: 100, cy: 100, r: 78, pathLength: 100 };
const RingArt = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 200 200" width={210} height={210} aria-hidden="true">
    <g transform="rotate(-90 100 100)" fill="none" strokeWidth={22}>{children}</g>
  </svg>
);

// Three pages: the problem (stats from the pitch brief), the gap, then the loop.
const PAGES: ReactNode[] = [
  <>
    <div className="ob-art">
      <RingArt>
        <circle {...RING} stroke="rgba(255,255,255,.16)" />
        <circle {...RING} stroke="#B9E08A" strokeDasharray="49 51" />
        <circle {...RING} stroke="#F6A609" strokeDasharray="19.6 80.4" />
      </RingArt>
      <div className="center"><span className="big">5,700+</span><span className="small">ตันต่อวัน</span></div>
    </div>
    <h1>กรุงเทพฯ ทิ้งขยะอาหารกว่า 5,700 ตันทุกวัน</h1>
    <ul className="ob-legend">
      <li><i className="sw" style={{ background: '#B9E08A' }} /><div><b>เกือบ 50%</b><br />ของขยะทั้งเมืองคือขยะอาหาร</div></li>
      <li><i className="sw" style={{ background: '#F6A609' }} /><div><b>40% ในนั้น</b><br />ยังกินได้ดีอยู่</div></li>
    </ul>
  </>,
  <>
    <div className="ob-art">
      <RingArt>
        <circle {...RING} stroke="rgba(255,255,255,.16)" strokeDasharray="2 2" />
        <circle {...RING} stroke="#B9E08A" strokeDasharray="76 24" strokeDashoffset={-12} strokeLinecap="round" />
      </RingArt>
      <div className="center"><span className="small">ตั้งใจ</span><span className="big is-word">ช่องว่าง</span><span className="small">ลงมือทำ</span></div>
    </div>
    <h1>ใส่ใจที่สุด แต่ยังทิ้งมากกว่า</h1>
    <p>Gen Y และ Gen Z กังวลเรื่องโลกร้อนมากที่สุด แต่กลับทิ้งอาหารในบ้านมากกว่าคนรุ่นก่อน</p>
    <p>ธนาคารอาหารช่วยได้แค่ที่ปลายทาง โปสเตอร์รณรงค์ก็ไม่ได้ให้เหตุผลที่ต้องลงมือทำในแต่ละวัน</p>
  </>,
  <>
    <div className="ob-art">
      <LoopRing done={FULL_LOOP} size={210} fresh={['eat', 'save', 'sort']} />
      <div className="center"><span className="big is-word">FoodLoop</span><span className="small">BKK</span></div>
    </div>
    <h1>ปิดลูปให้ครบ ทีละวัน</h1>
    <ul className="ob-steps">
      {LOOP.map(l => (
        <li key={l.key}><span className="tile"><Icon name={l.icon} /></span><div><b>{l.phase}</b><span>{l.blurb}</span></div></li>
      ))}
    </ul>
  </>,
];

export function Onboarding() {
  const { state, actions } = useDemo();
  const step = state.obStep;
  const last = step === PAGES.length - 1;
  return (
    <section className="ob on-dark" aria-label={`แนะนำแอป หน้า ${step + 1} จาก ${PAGES.length}`}>
      <div className="ob-top">
        <span className="ob-brand"><LoopRing done={FULL_LOOP} size={22} />FoodLoopBKK</span>
        {!last && <button className="ob-skip" onClick={actions.obSkip}>ข้าม</button>}
      </div>
      <div className="ob-body" key={step}>{PAGES[step]}</div>
      <div className="ob-foot">
        <div className="ob-dots" aria-hidden="true">{PAGES.map((_, i) => <i key={i} className={i === step ? 'on' : ''} />)}</div>
        {step > 0 && <button className="btn btn-ghost on-green" onClick={actions.obBack}>ย้อนกลับ</button>}
        <button className="btn btn-light" onClick={actions.obNext}>{last ? 'เริ่มลูปของฉัน' : 'ถัดไป'}<Icon name="chev" size={18} /></button>
      </div>
      <p className="ob-note">ตัวเลขในหน้าแนะนำมาจากเอกสารนำเสนอ ส่วนข้อมูลภายในแอปเป็นข้อมูลจำลองทั้งหมด</p>
    </section>
  );
}
