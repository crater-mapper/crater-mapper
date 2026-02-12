import { useState } from 'react';
import type { User } from '../types/user';

interface UserProfileProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
}

export default function UserProfile({ user, onUpdate }: UserProfileProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="user-profile">
      <button className="user-avatar" onClick={() => setOpen(!open)} aria-label="User profile">
        <span>{user.name.charAt(0).toUpperCase()}</span>
      </button>

      {open && (
        <div className="user-panel">
          <h3>Profile</h3>

          <label className="form-label">
            Name
            <input
              type="text"
              value={user.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="form-input"
              placeholder="Your name"
            />
          </label>

          <label className="form-label">
            Password
            <input
              type="password"
              value={user.password}
              onChange={(e) => onUpdate({ password: e.target.value })}
              className="form-input"
              placeholder="Password"
            />
          </label>

          <label className="user-checkbox">
            <input
              type="checkbox"
              checked={user.is_moderator}
              onChange={(e) => onUpdate({ is_moderator: e.target.checked })}
            />
            <span>Moderator</span>
          </label>

          {user.is_moderator && (
            <p className="user-mod-hint">You can verify/unverify craters</p>
          )}
        </div>
      )}
    </div>
  );
}
