import { LOOP } from '@/lib/data';
import { cx } from '@/lib/helpers';
import type { LoopKey } from '@/lib/types';

/** The loop ring: three arcs (eat, save, sort) on one circle. Turns amber when all three are closed. */
export function LoopRing({ done, size = 122, fresh = [], light = false }: {
  done: Record<LoopKey, boolean>; size?: number; fresh?: LoopKey[]; light?: boolean;
}) {
  const closed = LOOP.every(l => done[l.key]);
  return (
    <svg className={cx('ring', closed && 'is-closed', light && 'on-light')} width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <g transform="rotate(-90 60 60)">
        {LOOP.map((l, i) => {
          const arc = { cx: 60, cy: 60, r: 50, pathLength: 300, strokeDasharray: '80 220', strokeDashoffset: -(i * 100 + 10) };
          return (
            <g key={l.key}>
              <circle className="ring-track" {...arc} />
              {done[l.key] && <circle className={cx('ring-fill', fresh.includes(l.key) && 'is-fresh')} {...arc} />}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export const FULL_LOOP: Record<LoopKey, boolean> = { eat: true, save: true, sort: true };
