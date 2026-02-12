import { useState, useEffect } from 'react';

interface GeoPosition {
  lat: number;
  lng: number;
}

const DEFAULT_POSITION: GeoPosition = { lat: 52.2405, lng: -0.9027 };

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition>(DEFAULT_POSITION);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoaded(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoaded(true);
      },
      () => {
        // Permission denied or error — use default
        setLoaded(true);
      },
    );
  }, []);

  return { position, loaded };
}
