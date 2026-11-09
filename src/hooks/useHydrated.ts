import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** false on the server and during hydration, true afterwards. Avoids setState-in-effect. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
