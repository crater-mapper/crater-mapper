import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { Crater } from '../types/crater';
import CraterMarker from './CraterMarker';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  craters: Crater[];
  center: [number, number];
  flyTo: [number, number] | null;
  currentUsername: string;
  isModerator: boolean;
  onToggleVerified: (id: number) => void;
  onConfirm: (id: number) => void;
  onToggleFixed: (id: number) => void;
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
  currentUsername,
  isModerator,
  onToggleVerified,
  onConfirm,
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
        attribution='&copy; <a href="https://www.stadiamaps.com/">Stadia</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
      <FlyToHandler flyTo={flyTo} />
      {craters.map((crater) => (
        <CraterMarker
          key={crater.id}
          crater={crater}
          currentUsername={currentUsername}
          isModerator={isModerator}
          onToggleVerified={onToggleVerified}
          onConfirm={onConfirm}
          onToggleFixed={onToggleFixed}
        />
      ))}
    </MapContainer>
  );
}
