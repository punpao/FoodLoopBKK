'use client';

import { useState, type FormEvent } from 'react';
import { FOODS, PERKS, POINTS, RECEIPT, RECIPES, STORES, YOU } from '@/lib/data';
import { addDays, baht, fmtDist, iso, recipeInfo, today, walkMins } from '@/lib/helpers';
import { useDemo } from '@/lib/store';
import type { Overlay } from '@/lib/types';
import { DealMap, mapPos } from '../DealMap';
import { Icon } from '../Icon';
import { FreshPill, Sheet } from '../Shared';

type Of<T extends Overlay['type']> = Extract<Overlay, { type: T }>;

/** Simulated receipt scan: a camera-style viewfinder, then the items it "read". No camera is used. */
function ScanOverlay({ o }: { o: Of<'scan'> }) {
  const { state, actions } = useDemo();
  const count = RECEIPT.items.length;
  return (
    <div className="scan on-dark">
      <div className="scan-top"><b>สแกนใบเสร็จ</b><button className="close" onClick={actions.closeOverlay} aria-label="ปิดตัวสแกน"><Icon name="x" /></button></div>
      <div className="viewfinder" aria-hidden="true">
        <div className="receipt">
          <b>{RECEIPT.store}</b>
          <div className="row"><span>ใบเสร็จรับเงิน</span><span>#000482</span></div>
          {RECEIPT.items.map(([key, , , price]) => <div className="row" key={key}><span>{FOODS[key].name}</span><span>{price}.00</span></div>)}
          <div className="barcode" />
        </div>
        <div className="frame" />
        {o.phase === 'scanning' && <div className="scanline" />}
      </div>
      <div className="scan-status" role="status">
        {o.phase === 'scanning' && <><b>กำลังอ่านบาร์โค้ด…</b><span>เป็นการสแกนจำลองด้วยใบเสร็จตัวอย่าง ไม่ได้ใช้กล้องจริง</span></>}
      </div>
      {o.phase === 'found' && (
        <Sheet bare title={`พบ ${count} รายการ`}>
          <p className="meta under-head">{RECEIPT.store} · วันหมดอายุประมาณจากอายุการเก็บทั่วไป</p>
          <ul className="found">
            {RECEIPT.items.map(([key, qty, days]) => (
              <li key={key}>
                <span className="emoji" aria-hidden="true">{FOODS[key].icon}</span>
                <div><b>{FOODS[key].name}</b><br /><span className="meta">{qty}</span></div>
                <span className="right"><FreshPill days={days} /></span>
              </li>
            ))}
          </ul>
          {state.scanned
            ? <button className="btn btn-primary btn-block" disabled>อยู่ในตู้เย็นแล้ว</button>
            : <button className="btn btn-primary btn-block" onClick={actions.confirmScan}><Icon name="plus" size={20} />เพิ่ม {count} รายการเข้าตู้เย็น</button>}
        </Sheet>
      )}
    </div>
  );
}

const QUICK_DATES: [number, string][] = [[0, 'วันนี้'], [3, '+3 วัน'], [7, '+1 สัปดาห์'], [14, '+2 สัปดาห์']];

/** Manual entry: name, quantity and expiry date, with quick-date chips. */
function AddOverlay() {
  const { actions } = useDemo();
  const [name, setName] = useState('');
  const [qty, setQty] = useState('1 แพ็ก');
  const [date, setDate] = useState(() => iso(addDays(3)));
  const [errors, setErrors] = useState<{ name?: string; date?: string }>({});

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const clean = name.trim();
    const next = { name: clean ? undefined : 'กรุณาใส่ชื่อรายการ', date: date ? undefined : 'กรุณาเลือกวันหมดอายุ' };
    setErrors(next);
    if (next.name) { e.currentTarget.querySelector<HTMLInputElement>('#fName')?.focus(); return; }
    if (next.date) { e.currentTarget.querySelector<HTMLInputElement>('#fDate')?.focus(); return; }
    actions.addItem(clean, qty.trim(), date);
  };

  return (
    <Sheet title="เพิ่มรายการ">
      <form className="form" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="fName">ชื่อรายการ</label>
          <input id="fName" type="text" autoComplete="off" autoFocus placeholder="เช่น กิมจิ" value={name} onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: undefined })); }} aria-describedby="fNameErr" aria-invalid={!!errors.name} required />
          <p className="error" id="fNameErr" role="alert">{errors.name}</p>
        </div>
        <div className="field">
          <label htmlFor="fQty">จำนวน</label>
          <input id="fQty" type="text" autoComplete="off" value={qty} onChange={e => setQty(e.target.value)} aria-describedby="fQtyHint" />
          <p className="hint" id="fQtyHint">ใส่หน่วยแบบไหนก็ได้ เช่น 2 ชิ้น, 500 กรัม, 1 แพ็ก</p>
        </div>
        <div className="field">
          <label htmlFor="fDate">วันหมดอายุ</label>
          <input id="fDate" type="date" value={date} min={iso(today())} onChange={e => { setDate(e.target.value); setErrors(v => ({ ...v, date: undefined })); }} aria-describedby="fDateErr" aria-invalid={!!errors.date} required />
          <div className="chips" role="group" aria-label="เลือกวันหมดอายุแบบเร็ว">
            {QUICK_DATES.map(([n, label]) => (
              <button key={n} type="button" className="chip" onClick={() => setDate(iso(addDays(n)))} aria-pressed={date === iso(addDays(n))}>{label}</button>
            ))}
          </div>
          <p className="error" id="fDateErr" role="alert">{errors.date}</p>
        </div>
        <button className="btn btn-primary btn-block" type="submit"><Icon name="plus" size={20} />เพิ่มเข้าตู้เย็น</button>
      </form>
    </Sheet>
  );
}

/** Recipe detail: what you have, what is missing, and "ทำเมนูนี้แล้ว". */
function RecipeOverlay({ o }: { o: Of<'recipe'> }) {
  const { state, actions } = useDemo();
  const r = RECIPES.find(x => x.id === o.id)!;
  const info = recipeInfo(state.fridge, r);
  return (
    <Sheet title={r.name}>
      <div className="pill-row">
        <span className="pill pill-outline"><Icon name="clock" size={14} />{r.mins} นาที</span>
        {info.near.length > 0 && <span className="pill pill-amber"><Icon name="flame" size={14} />ใช้ของใกล้หมดอายุ {info.near.length} รายการ</span>}
      </div>
      <div>
        <h3 className="sub">วัตถุดิบ</h3>
        <ul className="ing-list">
          {info.ings.map(g => (
            <li key={g.key} className={g.item ? '' : 'is-miss'}>
              <span className="mark"><Icon name={g.item ? 'check' : 'plus'} size={14} /></span>
              <span>{g.food.name}</span>
              <span className="right">{g.item && g.d !== null ? <FreshPill days={g.d} /> : <span className="meta">ไม่มีในตู้เย็น</span>}</span>
            </li>
          ))}
        </ul>
        <p className="meta note">ของติดครัว: {r.pantry}</p>
      </div>
      <div>
        <h3 className="sub">วิธีทำ</h3>
        <ol className="steps">{r.steps.map(s => <li key={s}>{s}</li>)}</ol>
      </div>
      {info.have.length > 0 ? (
        <button className="btn btn-primary btn-block" onClick={() => actions.cook(r.id)}><Icon name="pot" size={20} />ทำเมนูนี้แล้ว</button>
      ) : (
        <>
          <button className="btn btn-primary btn-block" disabled>ทำเมนูนี้แล้ว</button>
          <p className="meta center">ยังไม่มีวัตถุดิบของเมนูนี้ในตู้เย็น</p>
        </>
      )}
    </Sheet>
  );
}

function CookedOverlay({ o }: { o: Of<'cooked'> }) {
  const { actions } = useDemo();
  return (
    <Sheet>
      <div className="win">
        <span className="emoji" aria-hidden="true">{o.icon}</span>
        <h2 id="sheetTitle">ทำ{o.name}เรียบร้อย</h2>
        <p className="meta">{o.rescued.length ? `ช่วยไว้ทันเวลา: ${o.rescued.join(', ')}` : 'ใช้ของในตู้เย็น ไม่มีอะไรเหลือทิ้ง'}</p>
        <div className="win-stats">
          <div><b>{baht(o.money)}</b><span>ประหยัดได้</span></div>
          <div><b>{o.rescued.length}</b><span>รายการที่ช่วยไว้</span></div>
          <div><b>+{o.pts}</b><span>แต้ม</span></div>
        </div>
        {o.mission && <p className="banner-amber is-center"><Icon name="star" size={18} />ภารกิจวันนี้สำเร็จ รวมโบนัส +{POINTS.mission} แล้ว</p>}
        {o.levelUp && <p className="banner-amber is-center">{o.levelUp.icon} เลื่อนระดับ: ตอนนี้คุณคือ{o.levelUp.name}</p>}
      </div>
      <button className="btn btn-primary btn-block" onClick={actions.closeOverlay}>เสร็จสิ้น</button>
    </Sheet>
  );
}

/** In-app directions with the saving. Pickup only: the customer pays the store directly. */
function DirectionsOverlay({ o }: { o: Of<'directions'> }) {
  const { state, actions } = useDemo();
  const d = state.deals.find(x => x.id === o.id)!;
  const s = STORES[d.store];
  const first = Math.round((s.dist * 0.4) / 10) * 10;
  return (
    <Sheet full title={`เส้นทางไป${s.name}`}>
      <p className="banner-amber">
        <Icon name="wallet" size={22} />
        <span>คุณประหยัด <b>{baht(d.was - d.now)}</b><br /><span className="soft">{o.first ? 'เพิ่มในยอดเงินที่ประหยัดได้แล้ว' : 'นับรวมในยอดเงินที่ประหยัดได้ไปแล้ว'}</span></span>
      </p>
      <DealMap route={`M${YOU.x} ${YOU.y}H${s.x}V${s.y}`} caption="เส้นทางจำลอง ไม่ตรงตามมาตราส่วน">
        <span className="pin is-static" style={mapPos(s)}><span><Icon name="pin" size={16} /></span></span>
      </DealMap>
      <div className="facts is-large">
        <span><Icon name="walk" size={18} />{fmtDist(s.dist)} · เดินประมาณ {walkMins(s.dist)} นาที</span>
        <span><Icon name="clock" size={18} />รับได้ {d.pickup}</span>
      </div>
      <ol className="steps">
        <li>เดินตรงไปตามซอยลูป {first} ม.</li>
        <li>เลี้ยวที่หัวมุม แล้วเดินต่ออีก {s.dist - first} ม.</li>
        <li>{s.name}อยู่ทางซ้ายมือ แจ้งรับ “{d.name}” แล้วจ่าย {baht(d.now)} ที่เคาน์เตอร์</li>
      </ol>
      <p className="meta">รับที่ร้านเท่านั้น จ่ายเงินกับร้านโดยตรง ไม่ต้องชำระในแอป</p>
      <button className="btn btn-primary btn-block" onClick={actions.closeOverlay}>เข้าใจแล้ว</button>
    </Sheet>
  );
}

function PerkOverlay({ o }: { o: Of<'perk'> }) {
  const { state, actions } = useDemo();
  const p = PERKS.find(x => x.id === o.id)!;
  const code = state.redeemed[p.id];
  if (code) {
    return (
      <Sheet>
        <div className="win">
          <span className="emoji" aria-hidden="true">{p.icon}</span>
          <h2 id="sheetTitle">{p.name}</h2>
          <p className="meta">แลกกับ{p.partner}แล้ว แสดงรหัสนี้เพื่อรับสิทธิ์</p>
          <p className="code is-big">{code}</p>
          <p className="meta">รหัสสาธิต พาร์ตเนอร์เป็นชื่อสมมติ</p>
        </div>
        <button className="btn btn-primary btn-block" onClick={actions.closeOverlay}>เสร็จสิ้น</button>
      </Sheet>
    );
  }
  return (
    <Sheet title="แลกสิทธิ์นี้ไหม">
      <div className="perk is-plain"><span className="tile" aria-hidden="true">{p.icon}</span><div className="perk-body"><b>{p.name}</b><span className="meta">{p.partner}</span></div></div>
      <p>ใช้ <b>{p.cost} แต้ม</b> แล้วจะเหลือ {state.points - p.cost} แต้ม ระดับของคุณไม่เปลี่ยน</p>
      <button className="btn btn-primary btn-block" onClick={() => actions.redeem(p.id)}>แลกด้วย {p.cost} แต้ม</button>
      <button className="btn btn-ghost btn-block" onClick={actions.closeOverlay}>ไว้ก่อน</button>
    </Sheet>
  );
}

/** Presenter tools: demo guide, replay intro, reset. */
function DemoOverlay() {
  const { state, actions } = useDemo();
  return (
    <Sheet title="เครื่องมือสาธิต">
      <p className="meta under-head">สำหรับผู้นำเสนอ ไกด์จะพาเดินตามลำดับ ตู้เย็น ดีล ไม่เทรวม และรางวัล</p>
      <button className="btn btn-primary btn-block" onClick={actions.guideStart}><Icon name="play" size={20} />{state.guide.active ? 'เริ่มไกด์สาธิตใหม่' : 'เริ่มไกด์สาธิต'}</button>
      <button className="btn btn-secondary btn-block" onClick={actions.replayIntro}>ดูหน้าแนะนำอีกครั้ง</button>
      <button className="btn btn-secondary btn-block" onClick={actions.reset}>รีเซ็ตเดโม</button>
      <p className="meta">ทุกอย่างในแอปนี้เป็นการจำลอง ไม่มีการสแกนจริง การชำระเงิน บริการแผนที่ หรือการเชื่อมต่อกับ กทม. ข้อมูลเก็บไว้ในหน่วยความจำเท่านั้น และจะหายเมื่อรีเซ็ตหรือโหลดหน้าใหม่ ตัวเลขในแอปเป็นข้อมูลสมมติ</p>
    </Sheet>
  );
}

export function OverlayHost() {
  const { state } = useDemo();
  const o = state.overlay;
  if (!o) return null;
  switch (o.type) {
    case 'scan': return <ScanOverlay o={o} />;
    case 'add': return <AddOverlay />;
    case 'recipe': return <RecipeOverlay key={o.id} o={o} />;
    case 'cooked': return <CookedOverlay o={o} />;
    case 'directions': return <DirectionsOverlay key={o.id} o={o} />;
    case 'perk': return <PerkOverlay key={o.id + (state.redeemed[o.id] ? '-done' : '')} o={o} />;
    case 'demo': return <DemoOverlay />;
  }
}
