import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Crater } from '../types/crater';

import hole1 from '../assets/hole1.png';
import hole2 from '../assets/hole2.png';
import hole3 from '../assets/hole3.png';
import hole4 from '../assets/hole4.png';

const holeImages = [hole1, hole2, hole3, hole4];

// Severity colour tint: returns a CSS filter string
// High points (>=10) -> red/warm, medium (>=5) -> orange, low -> blue/cool
function severityFilter(points: number): string {
  if (points >= 10) return 'hue-rotate(-15deg) saturate(2.2) brightness(1.1)';
  if (points >= 5) return 'hue-rotate(15deg) saturate(1.6) brightness(1.15)';
  return 'hue-rotate(170deg) saturate(1.4) brightness(1.3)';
}

function createCraterIcon(crater: Crater) {
  const h = crater.fixed ? 44 : Math.min(40 + crater.points * 1.2, 64);
  const w = h * 2; // 2x wider than tall
  // Deterministic random pick based on crater id
  const imgSrc = holeImages[crater.id % holeImages.length];
  const filter = crater.fixed
    ? 'grayscale(0.7) brightness(0.6)'
    : severityFilter(crater.points);
  const opacity = crater.fixed ? 0.45 : 1;

  const html = `<img src="${imgSrc}" style="width:${w}px;height:${h}px;filter:${filter};opacity:${opacity};" />`;

  return L.divIcon({
    html,
    className: 'crater-icon-img',
    iconSize: [w, h],
    iconAnchor: [w / 2, h / 2],
    popupAnchor: [0, -h / 2],
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
