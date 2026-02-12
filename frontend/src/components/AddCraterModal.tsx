import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CRATER_TYPES, CRATER_POINTS } from '../types/crater';
import type { Crater } from '../types/crater';
import 'leaflet/dist/leaflet.css';

const pinIcon = L.divIcon({
  html: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#ff6b6b" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
  </svg>`,
  className: 'pin-icon',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

interface AddCraterModalProps {
  center: [number, number];
  onAdd: (crater: Pick<Crater, 'lat' | 'lng' | 'type' | 'notes'>) => void;
  onClose: () => void;
}

function LocationPicker({
  position,
  onPick,
}: {
  position: [number, number];
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });

  return <Marker position={position} icon={pinIcon} />;
}

export default function AddCraterModal({ center, onAdd, onClose }: AddCraterModalProps) {
  const [lat, setLat] = useState(center[0]);
  const [lng, setLng] = useState(center[1]);
  const [type, setType] = useState<string>(CRATER_TYPES[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ lat, lng, type, notes });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report a Crater</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="form-label">
            Location
            <span className="form-hint">Tap the map to set the pin</span>
          </label>
          <div className="mini-map-wrapper">
            <MapContainer
              center={[lat, lng]}
              zoom={15}
              className="mini-map"
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              <LocationPicker
                position={[lat, lng]}
                onPick={(newLat, newLng) => {
                  setLat(newLat);
                  setLng(newLng);
                }}
              />
            </MapContainer>
          </div>

          <label className="form-label">
            Type
            <select value={type} onChange={(e) => setType(e.target.value)} className="form-select">
              {CRATER_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t} ({CRATER_POINTS[t]} pts)
                </option>
              ))}
            </select>
          </label>

          <label className="form-label">
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
              placeholder="Describe the crater..."
              rows={3}
            />
          </label>

          <button type="submit" className="form-submit">
            Report Crater
          </button>
        </form>
      </div>
    </div>
  );
}
