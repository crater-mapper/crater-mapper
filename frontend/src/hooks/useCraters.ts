import { useState, useCallback } from 'react';
import type { Crater } from '../types/crater';
import { mockCraters } from '../data/mockCraters';

export function useCraters() {
  const [craters, setCraters] = useState<Crater[]>(mockCraters);

  const addCrater = useCallback(
    (crater: Omit<Crater, 'id' | 'datetime' | 'user' | 'verified'>) => {
      const newCrater: Crater = {
        ...crater,
        id: crypto.randomUUID(),
        datetime: new Date().toISOString(),
        user: 'mock-user',
        verified: false,
      };
      setCraters((prev) => [newCrater, ...prev]);
    },
    [],
  );

  return { craters, addCrater };
}
