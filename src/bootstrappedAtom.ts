import type { AtomOptions } from 'recoil';
import { selector } from 'recoil';

import type { BootstrappedRecoilAtom, RootAtom } from './util';
import { attachedSelectorsSymbol, rootAtomSymbol } from './util';

type BootstrappedAtomOptions<AtomValue, BootstrapData> = Omit<
  AtomOptions<AtomValue>,
  'default'
> & {
  initialValue: (bootstrapData: BootstrapData) => AtomValue;
};

// Bootstrapped atoms are initialized by creating a special hidden selector that
// we assign to the `default` prop in our atom we create. This selector is tied
// to the root atom, causing this atom's loadable state to match that of the
// root atom.
/**
 * Creates a bootstrapped atom for accessing bootstrap data.
 *
 * @param rootAtom The root atom containing the bootstrap data to initialize
 *  this atom with.
 * @param options Options here are the mostly the same as the options passed to
 *  the built-in `atom()` function in Recoil. The difference is that the
 *  `default` property is _not_ allowed, and there is a new `initialValue`
 *  function to replace `default`.
 * @param options.initialValue A function to initialize the bootstrapped atom
 *  with. This function is called at runtime with all of the bootstrap data
 *  passed to BootstrapRoot. The atom's value is then set to the value returned
 *  from this function.
 * @returns The bootstrapped atom that can then be passed to
 *  bootstrappedAtomValueHook to create a hook for safely accessing this data.
 *  The returned atom is a normal off-the-shelf Recoil atom, and can be used
 *  accordingly.
 */
export function bootstrappedSelector<SelectorValue, BootstrapData>(
  rootAtom: RootAtom<BootstrapData>,
  {
    initialValue,
    ...options
  }: BootstrappedAtomOptions<SelectorValue, BootstrapData>,
) {
  // Extra checking for vanilla JS users. This isn't possible in TypeScript
  if ('get' in options) {
    throw new Error(
      'The "get" prop is not allowed in bootstrapped selectors. Use "initialValue" instead',
    );
  }
  const newAtom = selector({
    ...options,
    get: ({ get }) => {
      console.log(get(rootAtom));
      return initialValue(get(rootAtom));
    },
    // We have to do an `as` cast here because the rootAtomSymbol property is
    // currently missing. Technically this is a gap in typing (which I call a
    // "type hole"), but we set it correctly in the next line anyways.
  }) as BootstrappedRecoilAtom<SelectorValue, BootstrapData>;

  newAtom[rootAtomSymbol] = rootAtom;
  rootAtom[attachedSelectorsSymbol].push(newAtom);

  return newAtom;
}
