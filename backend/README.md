# Pothole Tracker – PHP Backend

Backend for tracking potholes: location, size, user reports, and a **Waze-style reputation system** (users gain reputation when others confirm their reports).

## Structure

- `index.php` – Entry point; CORS and routing.
- `config.php` – App and MySQL config.
- `db.php` – PDO MySQL connection.
- `auth.php` – Resolve user from `Authorization: Bearer <token>`.
- `api/router.php` – API router.
- `api/auth.php` – Register, login (returns token).
- `api/users.php` – Current user profile (reputation).
- `api/potholes.php` – Pothole reports and confirmations.

## MySQL setup

1. Create database and tables (from project root):

```bash
mysql -u root -p < database/schema.sql
```

2. Configure credentials in `config.php` or via environment variables:

| Variable  | Default          | Description   |
|-----------|------------------|---------------|
| `DB_HOST` | `localhost`      | MySQL host    |
| `DB_NAME` | `pothole_tracker`| Database name |
| `DB_USER` | `root`           | MySQL user    |
| `DB_PASS` | (empty)          | MySQL password|

## Run locally

```bash
cd backend
php -S localhost:8080
```

- `http://localhost:8080/?path=api` – API info
- `http://localhost:8080/?path=health` – Health check

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Register: `{ "username", "email", "password" }` |
| POST | /api/auth/login | No | Login: `{ "email", "password" }` → returns `token` |
| GET | /api/users/me | Bearer | Current user + reputation |
| GET | /api/potholes | No | List reports; optional `?lat=&lng=&radius=` (km) |
| GET | /api/potholes/:id | No | One report + confirmation count |
| POST | /api/potholes | Bearer | Create report: `{ "latitude", "longitude", "size_category", "diameter_cm?", "description?" }` |
| POST | /api/potholes/:id/confirm | Bearer | Confirm report; reporter gains +1 reputation |

**Size categories:** `small`, `medium`, `large`.

**Auth:** Send header `Authorization: Bearer <token>` for protected routes.

## Reputation (Waze-style)

- Users get **+1 reputation** each time another user confirms one of their pothole reports.
- One confirmation per user per report; you cannot confirm your own report.

## Requirements

- PHP 7.4+ (8.x recommended) with `pdo_mysql`
- MySQL 5.7+ or MariaDB
