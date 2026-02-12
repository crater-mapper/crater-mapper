import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { Crater } from '../types/crater';
import CraterMarker from './CraterMarker';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  craters: Crater[];
  center: [number, number];
  flyTo: [number, number] | null;
  currentUser: string;
  isModerator: boolean;
  onToggleVerified: (id: string) => void;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onToggleFixed: (id: string) => void;
}

function FlyToHandler({ flyTo }: { flyTo: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo, 15, { duration: 1.2 });
    }
  }, [flyTo, map]);

  return null;
}

export default function MapView({
  craters,
  center,
  flyTo,
  currentUser,
  isModerator,
  onToggleVerified,
  onUpvote,
  onDownvote,
  onToggleFixed,
}: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      className="map-container"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FlyToHandler flyTo={flyTo} />
      {craters.map((crater) => (
        <CraterMarker
          key={crater.id}
          crater={crater}
          currentUser={currentUser}
          isModerator={isModerator}
          onToggleVerified={onToggleVerified}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
          onToggleFixed={onToggleFixed}
        />
      ))}
    </MapContainer>
  );
}
