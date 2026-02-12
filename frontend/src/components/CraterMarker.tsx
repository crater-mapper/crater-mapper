import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Crater } from '../types/crater';

function severityColor(points: number): string {
  if (points >= 20) return '#ff4444';
  if (points >= 10) return '#ffaa33';
  return '#88ccff';
}

function createCraterIcon(points: number) {
  const color = severityColor(points);
  const size = Math.min(18 + points * 0.6, 36);

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
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

interface CraterMarkerProps {
  crater: Crater;
}

export default function CraterMarker({ crater }: CraterMarkerProps) {
  return (
    <Marker position={[crater.lat, crater.lng]} icon={createCraterIcon(crater.points)}>
      <Popup className="crater-popup">
        <div className="crater-popup-content">
          <h3>{crater.type}</h3>
          <p className="crater-meta">
            <span className={`badge ${crater.verified ? 'verified' : 'unverified'}`}>
              {crater.verified ? 'Verified' : 'Unverified'}
            </span>
            <span className="points">{crater.points} pts</span>
          </p>
          <p className="crater-notes">{crater.notes}</p>
          <p className="crater-footer">
            Reported by <strong>{crater.user}</strong>
            <br />
            {formatDate(crater.datetime)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
