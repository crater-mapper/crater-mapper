import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Crater } from '../types/crater';

function severityColor(points: number): string {
  if (points >= 10) return '#ff4444';
  if (points >= 5) return '#ffaa33';
  return '#88ccff';
}

function createCraterIcon(crater: Crater) {
  const color = crater.fixed ? '#555566' : severityColor(crater.points);
  const size = Math.min(18 + crater.points * 0.8, 36);
  const opacity = crater.fixed ? 0.4 : 1;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" opacity="${opacity}">
      <circle cx="20" cy="20" r="18" fill="${color}" opacity="0.25" />
      <circle cx="20" cy="20" r="13" fill="${color}" opacity="0.4" />
      <circle cx="20" cy="20" r="8"  fill="${color}" opacity="0.8" />
      <circle cx="20" cy="20" r="4"  fill="#fff" opacity="0.9" />
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'crater-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function sizeLabel(size: string): string {
  return size.charAt(0).toUpperCase() + size.slice(1);
}

interface CraterMarkerProps {
  crater: Crater;
  currentUsername: string;
  isModerator: boolean;
  onToggleVerified: (id: number) => void;
  onConfirm: (id: number) => void;
  onToggleFixed: (id: number) => void;
}

export default function CraterMarker({
  crater,
  currentUsername,
  isModerator,
  onToggleVerified,
  onConfirm,
  onToggleFixed,
}: CraterMarkerProps) {
  const isOwn = crater.reporter_username === currentUsername;

  return (
    <Marker position={[crater.latitude, crater.longitude]} icon={createCraterIcon(crater)}>
      <Popup className="crater-popup">
        <div className="crater-popup-content">
          <div className="crater-title-row">
            <h3>{sizeLabel(crater.size_category)}</h3>
            {crater.fixed && <span className="badge fixed">Fixed</span>}
          </div>

          <p className="crater-meta">
            <span className={`badge ${crater.verified ? 'verified' : 'unverified'}`}>
              {crater.verified ? 'Verified' : 'Unverified'}
            </span>
            <span className="points">{crater.points} pts</span>
          </p>

          {crater.description && (
            <p className="crater-notes">{crater.description}</p>
          )}

          {/* Confirm button -- only for craters not owned by current user */}
          {!isOwn && (
            <div className="vote-row">
              <button className="vote-btn upvote" onClick={() => onConfirm(crater.id)} title="Confirm this report">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
              </button>
              <span className={`vote-count ${crater.confirmation_count > 0 ? 'positive' : ''}`}>
                {crater.confirmation_count}
              </span>
            </div>
          )}

          {/* Moderator verify button */}
          {isModerator && (
            <button className="popup-action mod-btn" onClick={() => onToggleVerified(crater.id)}>
              {crater.verified ? 'Unverify' : 'Verify'}
            </button>
          )}

          {/* Fixed toggle */}
          <button className="popup-action fixed-btn" onClick={() => onToggleFixed(crater.id)}>
            {crater.fixed ? 'Mark as Unfixed' : 'Mark as Fixed'}
          </button>

          <p className="crater-footer">
            Reported by <strong>{crater.reporter_username}</strong>
            <br />
            {formatDate(crater.created_at)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
