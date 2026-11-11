import type { CSSProperties, ReactNode } from 'react';
import { YOU } from '@/lib/data';

/** Position a marker on the illustrative map (viewBox 100 x 72). */
export const mapPos = (p: { x: number; y: number }): CSSProperties => ({ left: `${p.x}%`, top: `${(p.y / 72) * 100}%` });

/** A drawn, fictional street map. No maps service is involved. */
export function DealMap({ route, caption, children }: { route?: string; caption: string; children?: ReactNode }) {
  return (
    <div className="map">
      <svg viewBox="0 0 100 72" preserveAspectRatio="none" aria-hidden="true">
        <rect width="100" height="72" fill="#EAF1E2" />
        <rect x="44" y="22" width="18" height="14" rx="3" fill="#CFE6BC" />
        <rect x="18" y="44" width="18" height="12" rx="3" fill="#DCEBCF" />
        <path d="M0 30C18 26 30 50 54 48s34-18 46-14" stroke="#CFE2E6" strokeWidth={5} fill="none" />
        <g stroke="#fff" strokeWidth={3.2} strokeLinecap="round"><path d="M0 18h100M0 40h100M0 60h100M14 0v72M40 0v72M66 0v72M88 0v72" /></g>
        {route && <path className="route" d={route} />}
      </svg>
      <i className="you" style={mapPos(YOU)} />
      <span className="you-label" style={mapPos(YOU)}>คุณ</span>
      {children}
      <span className="map-tag">{caption}</span>
    </div>
  );
}
