import { useState, useCallback, useEffect } from 'react';
import type { Crater } from '../types/crater';
import { SIZE_POINTS } from '../types/crater';
import { mockCraters } from '../data/mockCraters';
import * as api from '../api/client';

export function useCraters(currentUsername: string) {
  const [craters, setCraters] = useState<Crater[]>(mockCraters);
  const [usingApi, setUsingApi] = useState(false);

  // Try to load from API on mount, fall back to mock data
  useEffect(() => {
    api.fetchPotholes()
      .then((data) => {
        setCraters(data);
        setUsingApi(true);
      })
      .catch(() => {
        // API not available, keep mock data
        setUsingApi(false);
      });
  }, []);

  const addCrater = useCallback(
    async (crater: Pick<Crater, 'latitude' | 'longitude' | 'size_category' | 'description'>) => {
      if (usingApi) {
        try {
          const newCrater = await api.createPothole(crater);
          setCraters((prev) => [newCrater, ...prev]);
          return;
        } catch {
          // Fall through to local
        }
      }
      // Local fallback
      const localCrater: Crater = {
        ...crater,
        id: Date.now(),
        user_id: 1,
        reporter_username: currentUsername,
        verified: false,
        fixed: false,
        points: SIZE_POINTS[crater.size_category] ?? 8,
        confirmation_count: 0,
        created_at: new Date().toISOString(),
      };
      setCraters((prev) => [localCrater, ...prev]);
    },
    [currentUsername, usingApi],
  );

  const toggleVerified = useCallback(
    async (id: number) => {
      const crater = craters.find((c) => c.id === id);
      if (!crater) return;
      if (usingApi) {
        try {
          const updated = await api.updatePothole(id, { verified: !crater.verified });
          setCraters((prev) => prev.map((c) => (c.id === id ? updated : c)));
          return;
        } catch {
          // Fall through
        }
      }
      setCraters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, verified: !c.verified } : c)),
      );
    },
    [craters, usingApi],
  );

  const confirm = useCallback(
    async (id: number) => {
      const crater = craters.find((c) => c.id === id);
      if (!crater || crater.reporter_username === currentUsername) return;
      if (usingApi) {
        try {
          await api.confirmPothole(id);
          setCraters((prev) =>
            prev.map((c) =>
              c.id === id ? { ...c, confirmation_count: c.confirmation_count + 1 } : c,
            ),
          );
          return;
        } catch {
          // Fall through
        }
      }
      setCraters((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, confirmation_count: c.confirmation_count + 1 } : c,
        ),
      );
    },
    [craters, currentUsername, usingApi],
  );

  const toggleFixed = useCallback(
    async (id: number) => {
      const crater = craters.find((c) => c.id === id);
      if (!crater) return;
      if (usingApi) {
        try {
          const updated = await api.updatePothole(id, { fixed: !crater.fixed });
          setCraters((prev) => prev.map((c) => (c.id === id ? updated : c)));
          return;
        } catch {
          // Fall through
        }
      }
      setCraters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, fixed: !c.fixed } : c)),
      );
    },
    [craters, usingApi],
  );

  return { craters, addCrater, toggleVerified, confirm, toggleFixed, usingApi };
}
