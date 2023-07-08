import { atom } from 'recoil';

import type { RootAtom } from './util';
import { attachedSelectorsSymbol } from './util';

// Root atoms need to be fully under recoil-bootstrap's control, since
// bootstrapped atoms rely closely on the lifecycle of this atom for all of
// their functionality. Allowing users more control would likely destabilize
// this interdependence, plus this is meant to be a black box anyways. As such,
// the only thing that users are allowed to set is the atom key
/**
 * Creates a root atom.
 *
 * @param key The key to assign to the root atom.
 * @returns The root atom to be passed to a corresponding BootstrapRoot
 *  component.
 */
export function rootAtom<T>(key: string) {
  const newRoot = atom<T>({ key }) as RootAtom<T>;
  newRoot[attachedSelectorsSymbol] = [];
  return newRoot;
}
