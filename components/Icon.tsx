import type { ReactNode } from 'react';
import type { IconName } from '@/lib/types';

// One small inline-SVG outline set, so the prototype needs no icon dependency.
const PATHS: Record<IconName, ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  fridge: <><rect x="5" y="2" width="14" height="20" rx="2.5" /><path d="M5 10h14M9 5.5v2M9 13.5v3" /></>,
  tag: <><path d="M12.6 2.6 21 11a2 2 0 0 1 0 2.8L13.8 21a2 2 0 0 1-2.8 0l-8.4-8.4A2 2 0 0 1 2 11.2V4a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6z" /><circle cx="7.5" cy="7.5" r="1.3" /></>,
  bin: <path d="M4 7h16M9 7V4h6v3M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6" />,
  trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></>,
  scan: <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M8 9v6M11 9v6M14 9v6M16.5 9v6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  camera: <><path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13" r="3.5" /></>,
  pin: <><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  nav: <path d="M3 11.5 21 3l-8.5 18-2.2-7.3z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  flame: <path d="M12 22c4 0 7-2.8 7-6.8 0-3-1.8-5.2-3.3-7.2-.4 1.7-1.2 2.7-2.4 3.3C13.6 8 12.7 4.5 9.5 2c.3 3.2-1.2 5-2.6 6.8C5.7 10.4 5 12.3 5 15.2 5 19.2 8 22 12 22z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  chev: <path d="m9 5 7 7-7 7" />,
  list: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  map: <><path d="m3 6 6-2.5 6 2.5 6-2.5V18l-6 2.5-6-2.5-6 2.5z" /><path d="M9 3.5V18M15 6v14.5" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  leaf: <><path d="M5 19C5 10 10 5 20 4c0 10-4.5 15.5-13 15.5" /><path d="M4 21c2.5-5 6-8.5 10.5-11" /></>,
  star: <path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9l-5.4 2.9 1.1-6.1-4.5-4.3 6.1-.8z" />,
  play: <><circle cx="12" cy="12" r="9" /><path d="M10 8.5v7l5.5-3.5z" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.8v.01" /></>,
  walk: <><circle cx="13" cy="4.5" r="1.8" /><path d="m9 21 2-6-2.5-2.5L10 8l3.5 1 2 3 3 1M13.5 21l-1-4.5" /></>,
  box: <><path d="M3 8 12 3l9 5v8l-9 5-9-5z" /><path d="m3 8 9 5 9-5M12 13v8" /></>,
  pot: <path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM2 10h20M9 6c0-1 1-1 1-2M14 6c0-1 1-1 1-2" />,
  cloud: <path d="M7 18a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5A3.8 3.8 0 0 1 17.5 18z" />,
  wallet: <path d="M4 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 6a2 2 0 0 1 2-2h10M16 13h.01" />,
};

export function Icon({ name, size = 22, inline = false }: { name: IconName; size?: number; inline?: boolean }) {
  return (
    <svg
      className={inline ? 'ic ic-inline' : 'ic'}
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
