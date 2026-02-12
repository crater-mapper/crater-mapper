import { useState, useCallback } from 'react';
import MapView from './components/MapView';
import SearchBar from './components/SearchBar';
import AddCraterButton from './components/AddCraterButton';
import AddCraterModal from './components/AddCraterModal';
import { useCraters } from './hooks/useCraters';
import { useGeolocation } from './hooks/useGeolocation';
import './App.css';

export default function App() {
  const { craters, addCrater } = useCraters();
  const { position, loaded } = useGeolocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const handleSelectLocation = useCallback((lat: number, lng: number) => {
    setFlyTo([lat, lng]);
  }, []);

  if (!loaded) {
    return (
      <div className="loading-screen">
        <div className="loading-crater" />
        <p>Mapping craters...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <MapView
        craters={craters}
        center={[position.lat, position.lng]}
        flyTo={flyTo}
      />

      <AddCraterButton onClick={() => setModalOpen(true)} />

      <SearchBar onSelectLocation={handleSelectLocation} />

      {modalOpen && (
        <AddCraterModal
          center={[position.lat, position.lng]}
          onAdd={addCrater}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
