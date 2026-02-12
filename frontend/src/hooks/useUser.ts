import { useState, useCallback } from 'react';
import type { User } from '../types/user';

const DEFAULT_USER: User = {
  id: 1,
  username: 'mock-user',
  email: 'mock@crater.map',
  password: '',
  reputation: 0,
  is_moderator: false,
};

export function useUser() {
  const [user, setUser] = useState<User>(DEFAULT_USER);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  return { user, updateUser };
}
