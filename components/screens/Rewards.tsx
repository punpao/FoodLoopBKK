'use client';

import { CO2E_PER_KG, LEVELS, PERKS } from '@/lib/data';
import { addDays, baht, cx, levelIndex } from '@/lib/helpers';
import { useDemo } from '@/lib/store';
import { Icon } from '../Icon';
import { ProtoNote, Topbar } from '../Shared';

const DAY_LETTERS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const DAY_NAMES = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];

export function Rewards() {
  const { state, actions, guideTarget } = useDemo();
  const li = levelIndex(state.xp), level = LEVELS[li], next = LEVELS[li + 1];
  const pct = next ? Math.round(((state.xp - level.min) / (next.min - level.min)) * 100) : 100;
  const co2 = (state.stats.kg * CO2E_PER_KG).toFixed(1);
  const week = [...state.pastWeek, state.todayDone];

  return (
    <div className="view">
      <Topbar eyebrow="ลูปนิสัยของคุณ" title="รางวัล" />

      <section className="card level-card">
        <div className="level-top">
          <span className="tile" aria-hidden="true">{level.icon}</span>
          <div><p className="meta">ระดับ {li + 1} จาก {LEVELS.length}</p><h2>{level.name}</h2></div>
          <div className="balance"><b>{state.points}</b><span className="meta">แต้มที่ใช้ได้</span></div>
        </div>
        <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="ความคืบหน้าสู่ระดับถัดไป"><i style={{ width: `${pct}%` }} /></div>
        <p className="meta level-meta">
          <span>สะสมแล้ว {state.xp}{next ? ` จาก ${next.min}` : ''} แต้ม</span>
          <span>{next ? `อีก ${next.min - state.xp} แต้มถึง${next.name}` : 'ถึงระดับสูงสุดแล้ว'}</span>
        </p>
        <ol className="level-track">
          {LEVELS.map((l, i) => <li key={l.name} className={i <= li ? 'is-on' : ''}><span className="emo" aria-hidden="true">{l.icon}</span>{l.name}</li>)}
        </ol>
      </section>

      <section>
        <div className="section-head"><h2>ผลลัพธ์ของคุณเดือนนี้</h2></div>
        <div className={cx('metrics', guideTarget === 'metrics' && 'guide-target')}>
          <div className="card metric"><Icon name="wallet" /><b>{baht(state.stats.money)}</b><span>เงินที่ประหยัดได้</span></div>
          <div className="card metric"><Icon name="leaf" /><b>{state.stats.kg.toFixed(1)}<small> กก.</small></b><span>อาหารที่ไม่ถูกทิ้ง</span></div>
          <div className="card metric"><Icon name="cloud" /><b>{co2}<small> กก.</small></b><span>CO₂e ที่ลดได้<br />ค่าประมาณ</span></div>
          <div className="card metric"><Icon name="box" /><b>{state.stats.items}</b><span>รายการที่ช่วยไว้</span></div>
        </div>
        <p className="meta note">ข้อมูลสมมติเพื่อการสาธิต CO₂e คำนวณด้วยค่าตัวอย่าง {CO2E_PER_KG} กก. ต่ออาหาร 1 กก.</p>
      </section>

      <section className="card">
        <div className="streak-head">
          <span className="flame"><Icon name="flame" size={30} /></span>
          <b>{state.streak}</b>
          <span>วันต่อเนื่อง<br /><span className="meta">{state.todayDone ? 'นับวันนี้แล้ว' : 'ทำสักอย่างวันนี้เพื่อไม่ให้ขาดช่วง'}</span></span>
        </div>
        <ol className="week">
          {week.map((done, i) => {
            const date = addDays(i - 6), isToday = i === 6;
            return (
              <li key={i} className={cx(done && 'is-done', isToday && 'is-today')} aria-label={`${DAY_NAMES[date.getDay()]}${isToday ? ' (วันนี้)' : ''}: ${done ? 'ทำแล้ว' : 'ยังไม่ได้ทำ'}`}>
                <span className="dot">{done && <Icon name="flame" size={18} />}</span>
                {isToday ? 'วันนี้' : DAY_LETTERS[date.getDay()]}
              </li>
            );
          })}
        </ol>
        <p className="meta note">บันทึกอาหาร ทำอาหาร ไปรับดีล หรือแยกขยะที่ยืนยันแล้ว นับทั้งหมด</p>
      </section>

      <section>
        <div className="section-head"><h2>สิทธิพิเศษ</h2><span className="meta">พาร์ตเนอร์สมมติ</span></div>
        <div className="perk-list">
          {PERKS.map(p => {
            const code = state.redeemed[p.id], can = state.points >= p.cost;
            return (
              <article key={p.id} className={cx('card perk', !code && !can && 'is-locked')}>
                <span className="tile" aria-hidden="true">{p.icon}</span>
                <div className="perk-body"><b>{p.name}</b><span className="meta">{p.partner}<br />{p.cost} แต้ม</span></div>
                <div className="perk-state">
                  {code ? (
                    <button className="btn btn-secondary btn-sm" onClick={() => actions.openPerk(p.id)}><Icon name="check" size={16} />แลกแล้ว</button>
                  ) : can ? (
                    <button className="btn btn-primary btn-sm" onClick={() => actions.openPerk(p.id)}>แลก</button>
                  ) : (
                    <span className="locked-label"><Icon name="lock" size={16} />อีก {p.cost - state.points} แต้ม</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card">
        <div className="section-head flush"><h2>กิจกรรมล่าสุด</h2></div>
        <ul className="log">
          {state.log.slice(0, 6).map((e, i) => (
            <li key={i}><span aria-hidden="true">{e.icon}</span><div>{e.text}<br /><span className="when">{e.when}</span></div><span className="pts">+{e.pts}</span></li>
          ))}
        </ul>
      </section>
      <ProtoNote />
    </div>
  );
}
