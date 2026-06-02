'use client';

import { useEffect, useState } from 'react';

/** Returns true after the component has mounted on the client. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Intentional: flip to client-mounted exactly once after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  return mounted;
}
