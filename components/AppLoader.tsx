'use client';

import dynamic from 'next/dynamic';

// The demo seeds its dates from the visitor's clock, so it renders in the browser only.
const App = dynamic(() => import('./App'), { ssr: false });

export default function AppLoader() {
  return <App />;
}
