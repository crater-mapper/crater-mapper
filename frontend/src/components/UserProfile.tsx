import { useState } from 'react';
import type { User } from '../types/user';

interface UserProfileProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
  points: number;
}

export default function UserProfile({ user, onUpdate, points }: UserProfileProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="user-profile">
      <div className="user-profile-row">
        <button className="user-avatar" onClick={() => setOpen(!open)} aria-label="User profile">
          <svg className="rover-icon" viewBox="0 0 64 64" width="30" height="30">
            <rect x="16" y="18" width="32" height="20" rx="4" fill="#c8c0b0" />
            <rect x="22" y="12" width="20" height="10" rx="3" fill="#a89e8e" />
            <rect x="26" y="8" width="4" height="6" rx="1" fill="#888" />
            <circle cx="32" cy="10" r="2" fill="#ff6644" />
            <rect x="24" y="24" width="6" height="4" rx="1" fill="#334" />
            <rect x="34" y="24" width="6" height="4" rx="1" fill="#334" />
            <circle cx="14" cy="42" r="6" fill="#555" stroke="#777" strokeWidth="2" />
            <circle cx="50" cy="42" r="6" fill="#555" stroke="#777" strokeWidth="2" />
            <circle cx="32" cy="44" r="5" fill="#555" stroke="#777" strokeWidth="2" />
            <rect x="12" y="36" width="40" height="4" rx="2" fill="#888" />
          </svg>
        </button>
        <span className="user-points">{points} pts</span>
      </div>

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
