'use client';

import { Fragment } from 'react';
import { NEAR_DAYS, RECIPES } from '@/lib/data';
import { cx, daysLeft, freshness, rankedRecipes, sortedFridge } from '@/lib/helpers';
import { useDemo } from '@/lib/store';
import { Icon } from '../Icon';
import { FreshPill, ProtoNote, Topbar } from '../Shared';

/** Inventory sorted by soonest expiry, grouped and colour-coded by freshness. */
function ItemList() {
  const { state, actions } = useDemo();
  const items = sortedFridge(state.fridge);
  if (!items.length) return <div className="card empty"><b>ตู้เย็นยังว่างอยู่</b>สแกนใบเสร็จหรือเพิ่มรายการเพื่อเริ่มติดตาม</div>;
  let lastGroup = '';
  return (
    <>
      {items.map(it => {
        const d = daysLeft(it), f = freshness(d);
        const showHead = f.group !== lastGroup;
        lastGroup = f.group;
        return (
          <Fragment key={it.id}>
            {showHead && <p className="group-label">{f.group}</p>}
            <article className={cx('card item', `is-${f.state}`, it.isNew && 'is-new')}>
              <span className="tile" aria-hidden="true">{it.icon}</span>
              <div className="item-body">
                <span className="item-name">{it.name}</span>
                <span className="meta">{it.qty}</span>
                <FreshPill days={d} />
              </div>
              {f.state === 'expired' ? (
                <button className="item-act" onClick={() => actions.binItem(it.id)} aria-label={`แยกทิ้ง${it.name}เป็นขยะอินทรีย์`}><Icon name="bin" /></button>
              ) : (
                <button className="item-act" onClick={() => actions.markUsed(it.id)} aria-label={`ทำเครื่องหมายว่าใช้${it.name}แล้ว`}><Icon name="check" /></button>
              )}
            </article>
          </Fragment>
        );
      })}
    </>
  );
}

/** Recipes built from the fridge. Those that use near-expiry items come first. */
function RecipeList() {
  const { state, actions, guideTarget } = useDemo();
  return (
    <>
      <p className="meta">เรียงตามของที่ใกล้หมดอายุก่อน <Icon name="check" size={12} inline /> มีในตู้เย็น <Icon name="plus" size={12} inline /> ต้องซื้อเพิ่ม</p>
      {rankedRecipes(state.fridge).map(({ r, info }, i) => (
        <button key={r.id} className={cx('card recipe-card', i === 0 && guideTarget === 'recipe' && 'guide-target')} onClick={() => actions.openRecipe(r.id)}>
          <span className="tile" aria-hidden="true">{r.icon}</span>
          <span className="recipe-body">
            <span className="recipe-title"><b>{r.name}</b><span className="meta">{r.mins} นาที</span></span>
            {info.near.length > 0 && <span className="pill pill-amber"><Icon name="flame" size={14} />ใช้ของใกล้หมดอายุ {info.near.length} รายการ</span>}
            <span className="ing-chips">
              {info.have.map(g => <span key={g.key} className="ing ing-have"><Icon name="check" size={12} />{g.food.name}</span>)}
              {info.missing.map(g => <span key={g.key} className="ing ing-miss"><Icon name="plus" size={12} />{g.food.name}</span>)}
            </span>
          </span>
        </button>
      ))}
    </>
  );
}

export function Fridge() {
  const { state, actions, guideTarget } = useDemo();
  const count = state.fridge.length;
  const attention = state.fridge.filter(it => daysLeft(it) <= NEAR_DAYS).length;
  return (
    <div className="view">
      <Topbar eyebrow="ก่อนกิน" title="ตู้เย็น" />
      <p className="meta under-title">{count} รายการ · {attention ? `${attention} รายการต้องรีบจัดการ` : 'ไม่มีอะไรเร่งด่วน'}</p>
      <div className="action-row">
        <button className={cx('btn btn-primary', guideTarget === 'scan' && 'guide-target')} onClick={actions.openScan}><Icon name="scan" size={20} />สแกนใบเสร็จ</button>
        <button className="btn btn-secondary" onClick={actions.openAdd}><Icon name="plus" size={20} />เพิ่มรายการ</button>
      </div>
      <div className="seg" role="group" aria-label="มุมมองตู้เย็น">
        <button onClick={() => actions.setFridgeView('items')} aria-pressed={state.fridgeView === 'items'}>ของในตู้ ({count})</button>
        <button onClick={() => actions.setFridgeView('recipes')} aria-pressed={state.fridgeView === 'recipes'}>สูตรอาหาร ({RECIPES.length})</button>
      </div>
      {state.fridgeView === 'items' ? <ItemList /> : <RecipeList />}
      <ProtoNote />
    </div>
  );
}
