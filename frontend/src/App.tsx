import { useState, useCallback } from 'react';
import MapView from './components/MapView';
import SearchBar from './components/SearchBar';
import AddCraterButton from './components/AddCraterButton';
import AddCraterModal from './components/AddCraterModal';
import UserProfile from './components/UserProfile';
import { useCraters } from './hooks/useCraters';
import { useGeolocation } from './hooks/useGeolocation';
import { useUser } from './hooks/useUser';
import './App.css';

export default function App() {
  const { user, updateUser } = useUser();
  const { craters, addCrater, toggleVerified, confirm, toggleFixed } =
    useCraters(user.username);
  const { position, loaded } = useGeolocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const handleSelectLocation = useCallback((lat: number, lng: number) => {
    setFlyTo([lat, lng]);
  }, []);

  const userPoints = craters
    .filter((c) => c.reporter_username === user.username)
    .reduce((sum, c) => sum + c.points, 0);

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
      <header className="app-header">
        <h1>Crater Map</h1>
      </header>

      <MapView
        craters={craters}
        center={[position.lat, position.lng]}
        flyTo={flyTo}
        currentUsername={user.username}
        isModerator={user.is_moderator}
        onToggleVerified={toggleVerified}
        onConfirm={confirm}
        onToggleFixed={toggleFixed}
      />

      <UserProfile user={user} onUpdate={updateUser} points={userPoints} />

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
