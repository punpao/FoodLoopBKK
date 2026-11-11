'use client';

import { LOOP, POINTS, STORES, USER_NAME } from '@/lib/data';
import { baht, bestRecipeFor, cx, daysLeft, fmtDist, missionTarget, pctOff, sortedFridge, whenWord } from '@/lib/helpers';
import { useDemo } from '@/lib/store';
import { Icon } from '../Icon';
import { FULL_LOOP, LoopRing } from '../LoopRing';
import { ItemPill, ProtoNote, TopbarActions } from '../Shared';

function Mission() {
  const { state, actions } = useDemo();
  if (state.mission.done) {
    return (
      <section className="card mission is-done">
        <p className="eyebrow"><Icon name="check" size={16} />ภารกิจวันนี้สำเร็จ</p>
        <h2>เยี่ยมเลย อาหารจานนี้ไม่ต้องลงถัง</h2>
        <p className="meta">ได้รับโบนัส +{POINTS.mission} แต้มแล้ว</p>
      </section>
    );
  }
  const target = missionTarget(state);
  const recipe = target && bestRecipeFor(state.fridge, target.key);
  if (!target || !recipe) {
    return (
      <section className="card mission">
        <p className="eyebrow"><Icon name="star" size={16} />ภารกิจวันนี้</p>
        <h2>รับดีลอาหารส่วนเกินใกล้คุณสัก 1 ดีล</h2>
        <button className="btn btn-primary btn-block" onClick={() => actions.goTab('deals')}><Icon name="tag" size={20} />ดูดีลทั้งหมด</button>
      </section>
    );
  }
  return (
    <section className="card mission">
      <p className="eyebrow"><Icon name="star" size={16} />ภารกิจวันนี้</p>
      <h2>ทำอาหารจาก{target.name}ที่จะหมดอายุ{whenWord(daysLeft(target))}</h2>
      <p className="meta mission-meta">รับโบนัส +{POINTS.mission} แต้ม · {recipe.name} ใช้เวลา {recipe.mins} นาที</p>
      <button className="btn btn-primary btn-block" onClick={() => actions.openRecipe(recipe.id)}><Icon name="pot" size={20} />ดูสูตรอาหาร</button>
    </section>
  );
}

export function Home() {
  const { state, actions, guideTarget } = useDemo();
  const doneCount = LOOP.filter(l => state.loop[l.key]).length;
  const soon = sortedFridge(state.fridge).filter(it => { const d = daysLeft(it); return d >= 0 && d <= 3; }).slice(0, 3);
  const deal = state.deals.filter(d => !d.navigated).sort((a, b) => STORES[a.store].dist - STORES[b.store].dist)[0];

  return (
    <div className="view">
      <header className="topbar">
        <div>
          <p className="brand"><LoopRing done={FULL_LOOP} size={20} light />FoodLoopBKK</p>
          <h1>สวัสดี {USER_NAME}</h1>
        </div>
        <TopbarActions />
      </header>

      <section className={cx('card loop-card on-dark', guideTarget === 'loop' && 'guide-target')} aria-label="ลูปของวันนี้">
        <div className="loop-top">
          <div className="ring-wrap">
            <LoopRing done={state.loop} fresh={state.freshArcs} />
            <div className="ring-center">
              <b><span className="flame"><Icon name="flame" size={24} /></span>{state.streak}</b>
              <small>วันต่อเนื่อง</small>
            </div>
          </div>
          <div className="loop-copy">
            <h2>{doneCount === 3 ? 'ปิดลูปวันนี้ครบแล้ว' : doneCount ? `ปิดแล้ว ${doneCount} จาก 3` : 'ปิดลูปของวันนี้'}</h2>
            <ul className="loop-list">
              {LOOP.map(l => (
                <li key={l.key}>
                  <button className={state.loop[l.key] ? 'is-done' : ''} onClick={() => actions.goTab(l.tab)} aria-label={`${l.label}${state.loop[l.key] ? ' ทำแล้ว' : ''}`}>
                    <i className="check">{state.loop[l.key] && <Icon name="check" size={16} />}</i>
                    <span>{l.label}</span>
                    <i className="go"><Icon name="chev" size={16} /></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="loop-money"><b>{baht(state.stats.money)}</b><span>ประหยัดได้เดือนนี้</span></div>
      </section>

      <Mission />

      <section>
        <div className="section-head">
          <h2>ควรรีบใช้</h2>
          <button className="link" onClick={() => actions.setFridgeView('recipes')}>สูตรทั้งหมด<Icon name="chev" size={16} /></button>
        </div>
        {soon.length ? (
          <div className="soon-strip">
            {soon.map(it => {
              const r = bestRecipeFor(state.fridge, it.key);
              return (
                <button key={it.id} className="soon-card" onClick={() => (r ? actions.openRecipe(r.id) : actions.goTab('fridge'))}>
                  <span className="emoji" aria-hidden="true">{it.icon}</span>
                  <b>{it.name}</b>
                  <ItemPill item={it} />
                  <span className="cook">{r ? <><Icon name="pot" size={16} />{r.name}</> : <><Icon name="fridge" size={16} />เปิดตู้เย็น</>}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="card empty"><b>ไม่มีอะไรเร่งด่วน</b>วันนี้ของในตู้เย็นยังอยู่ดี</div>
        )}
      </section>

      {deal && (
        <section>
          <div className="section-head">
            <h2>ใกล้คุณ</h2>
            <button className="link" onClick={() => actions.goTab('deals')}>ดีลทั้งหมด<Icon name="chev" size={16} /></button>
          </div>
          <button className="card deal-top home-deal" onClick={() => actions.goTab('deals')}>
            <span className="tile" aria-hidden="true">{deal.icon}</span>
            <span className="deal-body">
              <b>{deal.name}</b>
              <span className="meta">{STORES[deal.store].name} · {fmtDist(STORES[deal.store].dist)}</span>
              <span className="price"><span className="now">{baht(deal.now)}</span><span className="was">{baht(deal.was)}</span></span>
            </span>
            <span className="off">−{pctOff(deal)}%</span>
          </button>
        </section>
      )}

      <ProtoNote />
    </div>
  );
}
