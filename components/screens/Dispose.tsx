'use client';

import { useMemo, type ChangeEvent } from 'react';
import { FEE_THB } from '@/lib/data';
import { baht, cx } from '@/lib/helpers';
import { useDemo } from '@/lib/store';
import type { DisposeStatus } from '@/lib/types';
import { Icon } from '../Icon';
import { ProtoNote, Topbar } from '../Shared';

/** A drawn stand-in "photo" of a food-scrap bin, so the flow can be demoed without a camera. */
function SamplePhoto() {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="รูปตัวอย่าง: ถังสีเขียวที่มีแต่เศษอาหาร" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#D9D4C7" /><rect y="210" width="400" height="90" fill="#B9B2A2" />
      <path d="M120 110h160l-16 150a10 10 0 0 1-10 9H146a10 10 0 0 1-10-9z" fill="#4BA254" /><rect x="108" y="92" width="184" height="24" rx="8" fill="#2A6419" />
      <ellipse cx="200" cy="96" rx="76" ry="16" fill="#5B3A1E" />
      <circle cx="170" cy="90" r="13" fill="#E9B44C" /><circle cx="212" cy="86" r="11" fill="#C8553D" />
      <path d="M228 96c10-16 30-14 34-4-12 8-24 9-34 4z" fill="#7BB661" /><path d="M140 96c6-12 20-12 26-4-8 6-18 8-26 4z" fill="#F2E3B3" />
      <path d="M176 170c0-18 12-30 30-30 0 18-12 30-30 30zm0 0v24" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** A decorative, non-scannable QR-style pattern for the demo voucher. */
function FakeQr() {
  const cells = useMemo(() => {
    const n = 21, out: [number, number][] = [];
    let seed = 20;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const finder = (x: number, y: number, ox: number, oy: number): boolean | null => {
      const a = x - ox, b = y - oy;
      if (a < 0 || b < 0 || a > 6 || b > 6) return null;
      return a === 0 || b === 0 || a === 6 || b === 6 || (a > 1 && a < 5 && b > 1 && b < 5);
    };
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const f = [finder(x, y, 0, 0), finder(x, y, 14, 0), finder(x, y, 0, 14)].find(v => v !== null);
      const nearFinder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
      if (f !== undefined ? f : !nearFinder && rnd() > 0.5) out.push([x, y]);
    }
    return out;
  }, []);
  return (
    <svg viewBox="0 0 21 21" role="img" aria-label="คิวอาร์โค้ดสาธิต สแกนไม่ได้" fill="#14230E" shapeRendering="crispEdges">
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />)}
    </svg>
  );
}

const STEPS = ['แยก', 'ถ่ายรูป', 'ตรวจสอบ', `รับสิทธิ์ ${baht(FEE_THB)}`];
const STEP_NOW: Record<DisposeStatus, number> = { idle: 0, photo: 1, rejected: 1, checking: 2, success: 4 };

function Voucher() {
  const { actions } = useDemo();
  return (
    <>
      <section className="ticket" aria-label="คูปองค่าธรรมเนียมเก็บขยะอัตราลด">
        <div className="ticket-head"><span>ไม่เทรวม</span><span className="ticket-ok"><Icon name="check" size={16} inline /> ยืนยันรูปแล้ว</span></div>
        <div className="ticket-main">
          <div className="fee">{FEE_THB}<small> บาท</small></div>
          <div><b>ค่าธรรมเนียมเก็บขยะอัตราลด</b><p>ปลดล็อกแล้ว เพราะคุณแยกขยะอินทรีย์</p></div>
        </div>
        <div className="ticket-cut" />
        <div className="ticket-qr">
          <FakeQr />
          <div>
            <p className="code">MTR-DEMO-2049</p>
            <p className="meta">แสดงรหัสนี้เมื่อชำระค่าเก็บขยะ</p>
            <p className="meta"><b>คูปองต้นแบบ</b> ใช้ชำระเงินจริงไม่ได้</p>
          </div>
        </div>
      </section>
      <button className="btn btn-primary btn-block" onClick={() => actions.goTab('rewards')}><Icon name="trophy" size={20} />ดูสิ่งที่คุณได้รับ</button>
    </>
  );
}

export function Dispose() {
  const { state, actions, guideTarget } = useDemo();
  const d = state.dispose;
  const now = STEP_NOW[d.status];
  const cta = cx('btn btn-primary btn-block', guideTarget === 'dispose' && 'guide-target');
  const onFile = (e: ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) actions.pickPhoto(file); };
  const photo = d.photo === 'sample' ? <SamplePhoto /> : d.photo ? <img src={d.photo} alt="รูปขยะอินทรีย์ที่คุณแยกไว้" /> : null;
  const fileInput = <input className="sr-only" type="file" accept="image/*" capture="environment" onChange={onFile} />;

  return (
    <div className="view">
      <Topbar eyebrow="เมื่อต้องทิ้ง" title="ไม่เทรวม" />
      <section className="card">
        <div className="bma-head">
          <h2>โครงการ “ไม่เทรวม”</h2>
          <p>โครงการคัดแยกขยะของกรุงเทพมหานคร ยืนยันว่าคุณแยกขยะอินทรีย์ แล้วรับสิทธิ์ค่าเก็บขยะอัตราลด {baht(FEE_THB)}</p>
        </div>
        <span className="proto-tag"><Icon name="info" size={14} />ต้นแบบสาธิต · ยังไม่ได้เชื่อมกับระบบของ กทม.</span>
      </section>

      <ol className="stepper" aria-label="ขั้นตอน">
        {STEPS.map((label, i) => (
          <li key={label} className={i < now ? 'is-done' : i === now ? 'is-now' : ''} aria-current={i === now ? 'step' : undefined}>{i + 1}. {label}</li>
        ))}
      </ol>

      {d.status === 'success' ? <Voucher /> : (
        <section className="card dispose-card">
          {d.status === 'idle' && (
            <>
              <h3>แยกเศษอาหารก่อนทิ้ง</h3>
              <div className="sort-guide">
                <div className="yes"><b><Icon name="check" size={18} />ถังขยะอินทรีย์</b>เศษอาหาร เปลือกผลไม้ กระดูก ของเหลือ</div>
                <div className="no"><b><Icon name="x" size={18} />ห้ามปน</b>พลาสติก บรรจุภัณฑ์ ทิชชู แก้ว</div>
              </div>
              <p className="meta">จากนั้นถ่ายรูปถังหรือถุงให้เห็นชัด รูปเดียวก็พอ</p>
              <label className={cta}><Icon name="camera" size={20} />ถ่ายรูปหรืออัปโหลดรูป{fileInput}</label>
              <button className="btn btn-ghost btn-block" onClick={actions.samplePhoto}>ใช้รูปตัวอย่าง</button>
            </>
          )}
          {d.status === 'photo' && (
            <>
              <h3>รูปชัดดีแล้วใช่ไหม ส่งตรวจได้เลย</h3>
              <div className="photo">{photo}</div>
              <button className={cta} onClick={actions.verify}><Icon name="check" size={20} />ส่งรูปนี้ไปตรวจ</button>
              <button className="btn btn-ghost btn-block" onClick={actions.clearPhoto}>เลือกรูปอื่น</button>
            </>
          )}
          {d.status === 'checking' && (
            <>
              <h3>กำลังตรวจรูปของคุณ</h3>
              <div className="photo is-checking">{photo}</div>
              <p className="status-row" role="status"><i className="spinner" />กำลังมองหาขยะอินทรีย์ที่แยกไว้…</p>
            </>
          )}
          {d.status === 'rejected' && (
            <>
              <h3>รูปนี้ยังไม่ผ่าน</h3>
              <div className="alert" role="alert">
                <Icon name="info" size={20} />
                <div><b>ยังมองไม่เห็นขยะอินทรีย์ที่แยกไว้</b>ใส่เศษอาหารในถังหรือถุงแยกต่างหาก ไม่มีพลาสติกปน ถ่ายให้เต็มเฟรม แล้วลองอีกครั้ง</div>
              </div>
              <label className={cta}><Icon name="camera" size={20} />ลองอีกครั้งด้วยรูปใหม่{fileInput}</label>
              <button className="btn btn-ghost btn-block" onClick={actions.samplePhoto}>ใช้รูปตัวอย่าง</button>
            </>
          )}
        </section>
      )}

      {d.status !== 'success' && d.status !== 'checking' && (
        <label className="presenter-toggle">
          <input type="checkbox" checked={d.forceFail} onChange={e => actions.setForceFail(e.target.checked)} />
          สำหรับผู้นำเสนอ: ให้การตรวจครั้งถัดไปไม่ผ่าน
        </label>
      )}
      <ProtoNote />
    </div>
  );
}
