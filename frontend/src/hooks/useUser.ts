import { useState, useCallback } from 'react';
import type { User } from '../types/user';

const DEFAULT_USER: User = {
  name: 'mock-user',
  password: '',
  is_moderator: false,
};

export function useUser() {
  const [user, setUser] = useState<User>(DEFAULT_USER);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  return { user, updateUser };
}
