'use client';

import type { RecoilValue } from 'recoil';
import { useRecoilValueLoadable } from 'recoil';

export function bootstrappedAtomValueHook<T>(
  initalStateValueAtom: RecoilValue<T>,
) {
  return () => {
    const valueLoadable = useRecoilValueLoadable(initalStateValueAtom);
    switch (valueLoadable.state) {
      case 'hasValue': {
        return valueLoadable.contents;
      }
      case 'loading': {
        throw new Error(
          'Bootstrap root atom not loaded. Did you call this hook outside of its bootstrap root?',
        );
      }
      case 'hasError': {
        throw valueLoadable.contents;
      }
    }
  };
}