'use client';

import { CATEGORIES, DISTANCES, ENDING_SOON_MIN, STORES } from '@/lib/data';
import { baht, cx, filteredDeals, fmtDist, pctOff } from '@/lib/helpers';
import { useDemo } from '@/lib/store';
import type { Deal } from '@/lib/types';
import { DealMap, mapPos } from '../DealMap';
import { Icon } from '../Icon';
import { ProtoNote, Topbar } from '../Shared';

/** One surplus deal. Pickup only: the single action is "นำทางไปร้าน". */
function DealCard({ deal, highlight }: { deal: Deal; highlight: boolean }) {
  const { actions } = useDemo();
  const s = STORES[deal.store];
  return (
    <article className="card deal-card">
      <div className="deal-top">
        <span className="tile" aria-hidden="true">{deal.icon}</span>
        <div className="deal-body">
          <b>{deal.name}</b>
          <span className="meta">{s.name} · {s.type}</span>
          <div className="price">
            <span className="now">{baht(deal.now)}</span>
            <span className="was"><span className="sr-only">ราคาเดิม </span>{baht(deal.was)}</span>
          </div>
        </div>
        <span className="off" aria-label={`ลด ${pctOff(deal)} เปอร์เซ็นต์`}>−{pctOff(deal)}%</span>
      </div>
      <div className="facts">
        <span><Icon name="pin" size={16} />{fmtDist(s.dist)}</span>
        <span><Icon name="clock" size={16} />รับได้ {deal.pickup}</span>
        <span><Icon name="box" size={16} />เหลือ {deal.left}</span>
        {deal.endsIn <= ENDING_SOON_MIN && <span className="pill pill-soon">หมดเวลาใน {deal.endsIn} นาที</span>}
      </div>
      {deal.navigated ? (
        <>
          <div className="saved-row"><Icon name="check" size={18} />วางแผนไปรับแล้ว · ประหยัด {baht(deal.was - deal.now)}</div>
          <button className="btn btn-secondary btn-block" onClick={() => actions.navigate(deal.id)}><Icon name="nav" size={18} />ดูเส้นทาง</button>
        </>
      ) : (
        <button className={cx('btn btn-primary btn-block', highlight && 'guide-target')} onClick={() => actions.navigate(deal.id)}><Icon name="nav" size={18} />นำทางไปร้าน</button>
      )}
    </article>
  );
}

export function Deals() {
  const { state, actions, guideTarget } = useDemo();
  const f = state.filters;
  const deals = filteredDeals(state);
  const filtersOn = f.cat !== 'all' || f.dist > 0 || f.endingSoon;
  const firstOpen = deals.find(d => !d.navigated)?.id;
  const card = (d: Deal) => <DealCard key={d.id} deal={d} highlight={guideTarget === 'navigate' && d.id === firstOpen} />;

  const empty = (
    <div className="card empty">
      <b>ไม่มีดีลที่ตรงกับตัวกรอง</b>ลองขยายระยะทางหรือเลือกหมวดอื่น
      <div className="empty-action"><button className="btn btn-secondary btn-sm" onClick={actions.clearFilters}>ล้างตัวกรอง</button></div>
    </div>
  );

  const storeIds = [...new Set(deals.map(d => d.store))];
  const selected = storeIds.includes(state.mapStore) ? state.mapStore : storeIds[0];

  return (
    <div className="view">
      <Topbar eyebrow="ก่อนเหลือทิ้ง" title="ดีล" />
      <p className="meta under-title">อาหารดีๆ ลด 40–60% ก่อนร้านปิด ไปรับและจ่ายเงินที่ร้าน</p>
      <div className="seg" role="group" aria-label="มุมมองดีล">
        <button onClick={() => actions.setDealsView('list')} aria-pressed={state.dealsView === 'list'}><Icon name="list" size={18} />รายการ</button>
        <button onClick={() => actions.setDealsView('map')} aria-pressed={state.dealsView === 'map'}><Icon name="map" size={18} />แผนที่</button>
      </div>
      <div className="chips" role="group" aria-label="หมวดหมู่">
        {CATEGORIES.map(([id, label]) => (
          <button key={id} className="chip" onClick={() => actions.setCategory(id)} aria-pressed={f.cat === id}>{label}</button>
        ))}
      </div>
      <div className="chips" role="group" aria-label="ระยะทางและเวลา">
        <button className="chip" onClick={actions.toggleEndingSoon} aria-pressed={f.endingSoon}><Icon name="clock" size={16} />ใกล้หมดเวลา</button>
        {DISTANCES.map(([m, label]) => (
          <button key={m} className="chip" onClick={() => actions.setDistance(m)} aria-pressed={f.dist === m}>{label}</button>
        ))}
      </div>
      <p className="meta" aria-live="polite">{deals.length} ดีล{filtersOn ? 'ตรงกับตัวกรอง' : 'ใกล้คุณ'} · ชื่อร้านเป็นชื่อสมมติ</p>

      {state.dealsView === 'list' ? (
        deals.length ? deals.map(card) : empty
      ) : (
        <>
          <DealMap caption="แผนที่จำลอง ไม่ตรงตามมาตราส่วน">
            {storeIds.map(id => {
              const best = Math.max(...deals.filter(d => d.store === id).map(pctOff));
              return (
                <button key={id} className="pin" style={mapPos(STORES[id])} onClick={() => actions.selectStore(id)} aria-pressed={id === selected}
                  aria-label={`${STORES[id].name} ห่าง ${fmtDist(STORES[id].dist)} ลดสูงสุด ${best} เปอร์เซ็นต์`}>
                  <span>−{best}%</span>
                </button>
              );
            })}
          </DealMap>
          {selected ? (
            <>
              <div className="section-head flush"><h2>{STORES[selected].name}</h2><span className="meta">{fmtDist(STORES[selected].dist)}</span></div>
              {deals.filter(d => d.store === selected).map(card)}
            </>
          ) : empty}
        </>
      )}
      <ProtoNote />
    </div>
  );
}
