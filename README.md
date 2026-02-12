# Crater Mapper

A community-driven pothole tracking app with a lunar twist. Report, verify, and vote on road craters in your area — displayed on a dark, moon-themed map.

## Overview

Crater Mapper lets users log potholes ("craters") on an interactive map, upvote/downvote reports from others, and track their contribution points. Moderators can verify craters, and anyone can mark them as fixed.

Built as a monorepo with a **React + TypeScript frontend** and a **PHP + MariaDB backend**.

## Project Structure

```
crater-mapper/
├── frontend/          # React + Vite + TypeScript
│   └── src/
│       ├── components/   # MapView, CraterMarker, SearchBar, AddCraterModal, UserProfile, etc.
│       ├── hooks/        # useCraters, useGeolocation, useUser
│       ├── data/         # Mock crater data
│       └── types/        # Crater and User interfaces
├── backend/           # PHP backend + Docker setup
│   ├── docker-compose.yml
│   ├── websites/crater/
│   │   ├── backend/      # PHP API (auth, potholes, users)
│   │   └── database/     # SQL schema
│   └── nginx.conf
└── README.md
```

## Frontend

### Tech Stack

- React 19 + TypeScript
- Vite 7
- Leaflet + react-leaflet (Stadia Alidade Smooth Dark tiles)
- Orbitron + Exo 2 fonts

### Features

- Full-screen dark-themed map centered on Northampton
- Crater markers with severity-based sizing and colouring
- Click a marker to see type, verified status, votes, notes, and reporter
- Search bar with Nominatim geocoding — fly to any location
- Floating action button to report new craters
- User profile panel with moderator toggle
- Upvote/downvote craters from other users
- Mark craters as fixed (dimmed on map)
- Points system based on crater type (Pothole=8, Sinkhole=10, Crack=3, Erosion=5, Collapsed Drain=12)

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173/`.

## Backend

### Tech Stack

- PHP 8.4 (FPM)
- MariaDB
- Nginx
- Docker Compose

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Register (username, email, password) |
| POST | /api/auth/login | No | Login (email, password) → token |
| GET | /api/users/me | Bearer | Current user + reputation |
| GET | /api/potholes | No | List reports (optional ?lat=&lng=&radius=) |
| GET | /api/potholes/:id | No | Single report + confirmation count |
| POST | /api/potholes | Bearer | Create report |
| POST | /api/potholes/:id/confirm | Bearer | Confirm report (Waze-style reputation) |

### Run the Backend

```bash
cd backend
docker compose up -d
```

Requires Docker. MariaDB runs on port 3306, Nginx on port 80.

## Data Model

### Crater (Frontend)

| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| lat | number | Latitude |
| lng | number | Longitude |
| type | string | Pothole, Sinkhole, Crack, Erosion, Collapsed Drain |
| datetime | string | ISO timestamp |
| user | string | Reporter username |
| verified | boolean | Moderator-verified |
| notes | string | Description |
| points | number | Auto-assigned by type |
| upvotes | number | Community upvotes |
| downvotes | number | Community downvotes |
| fixed | boolean | Has it been repaired |

### User (Frontend)

| Field | Type | Description |
|-------|------|-------------|
| name | string | Username |
| password | string | Password |
| is_moderator | boolean | Can verify/unverify craters |

## Team

Built at a hackathon in Northampton.

## License

MIT
