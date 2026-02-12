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
  const { craters, addCrater, toggleVerified, upvote, downvote, toggleFixed } =
    useCraters(user.name);
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

  const userPoints = craters
    .filter((c) => c.user === user.name)
    .reduce((sum, c) => sum + c.points, 0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Crater Map</h1>
      </header>

      <MapView
        craters={craters}
        center={[position.lat, position.lng]}
        flyTo={flyTo}
        currentUser={user.name}
        isModerator={user.is_moderator}
        onToggleVerified={toggleVerified}
        onUpvote={upvote}
        onDownvote={downvote}
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
