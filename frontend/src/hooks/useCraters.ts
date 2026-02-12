import { useState, useCallback } from 'react';
import type { Crater } from '../types/crater';
import { CRATER_POINTS } from '../types/crater';
import { mockCraters } from '../data/mockCraters';

export function useCraters(currentUser: string) {
  const [craters, setCraters] = useState<Crater[]>(mockCraters);

  const addCrater = useCallback(
    (crater: Pick<Crater, 'lat' | 'lng' | 'type' | 'notes'>) => {
      const newCrater: Crater = {
        ...crater,
        id: crypto.randomUUID(),
        datetime: new Date().toISOString(),
        user: currentUser,
        verified: false,
        points: CRATER_POINTS[crater.type] ?? 5,
        upvotes: 0,
        downvotes: 0,
        fixed: false,
      };
      setCraters((prev) => [newCrater, ...prev]);
    },
    [currentUser],
  );

  const toggleVerified = useCallback((id: string) => {
    setCraters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, verified: !c.verified } : c)),
    );
  }, []);

  const upvote = useCallback(
    (id: string) => {
      setCraters((prev) =>
        prev.map((c) =>
          c.id === id && c.user !== currentUser
            ? { ...c, upvotes: c.upvotes + 1 }
            : c,
        ),
      );
    },
    [currentUser],
  );

  const downvote = useCallback(
    (id: string) => {
      setCraters((prev) =>
        prev.map((c) =>
          c.id === id && c.user !== currentUser
            ? { ...c, downvotes: c.downvotes + 1 }
            : c,
        ),
      );
    },
    [currentUser],
  );

  const toggleFixed = useCallback((id: string) => {
    setCraters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, fixed: !c.fixed } : c)),
    );
  }, []);

  return { craters, addCrater, toggleVerified, upvote, downvote, toggleFixed };
}
