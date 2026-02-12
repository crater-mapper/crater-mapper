<?php
/**
 * Potholes API: list, get, create report, confirm (reputation)
 */

declare(strict_types=1);

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth.php';

function handlePotholes(?string $id, ?string $action, string $method): void
{
    $pdo = getDb();

    // POST /api/potholes/:id/confirm
    if ($id !== null && $action === 'confirm') {
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            return;
        }
        $userId = requireAuth();
        $stmt = $pdo->prepare('SELECT id, user_id FROM potholes WHERE id = ?');
        $stmt->execute([$id]);
        $pothole = $stmt->fetch();
        if (!$pothole) {
            http_response_code(404);
            echo json_encode(['error' => 'Pothole not found']);
            return;
        }
        $reporterId = (int) $pothole['user_id'];
        if ($reporterId === $userId) {
            http_response_code(400);
            echo json_encode(['error' => 'Cannot confirm your own report']);
            return;
        }
        try {
            $stmt = $pdo->prepare('INSERT INTO pothole_confirmations (pothole_id, user_id) VALUES (?, ?)');
            $stmt->execute([$id, $userId]);
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                http_response_code(409);
                echo json_encode(['error' => 'Already confirmed this report']);
                return;
            }
            throw $e;
        }
        // Waze-style: reporter gains reputation when someone confirms
        $pdo->prepare('UPDATE users SET reputation = reputation + 1 WHERE id = ?')->execute([$reporterId]);
        echo json_encode(['confirmed' => true, 'pothole_id' => (int) $id]);
        return;
    }

    switch ($method) {
        case 'GET':
            if ($id !== null) {
                $stmt = $pdo->prepare('
                  SELECT p.id, p.user_id, p.latitude, p.longitude, p.size_category, p.diameter_cm, p.description, p.created_at, p.updated_at,
                         u.username AS reporter_username,
                         (SELECT COUNT(*) FROM pothole_confirmations c WHERE c.pothole_id = p.id) AS confirmation_count
                  FROM potholes p
                  JOIN users u ON u.id = p.user_id
                  WHERE p.id = ?
                ');
                $stmt->execute([$id]);
                $row = $stmt->fetch();
                if (!$row) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Pothole not found']);
                    return;
                }
                echo json_encode(formatPotholeRow($row));
            } else {
                $lat = isset($_GET['lat']) ? (float) $_GET['lat'] : null;
                $lng = isset($_GET['lng']) ? (float) $_GET['lng'] : null;
                $radius = isset($_GET['radius']) ? (float) $_GET['radius'] : null; // km, approximate
                if ($lat !== null && $lng !== null && $radius !== null && $radius > 0) {
                    $stmt = $pdo->prepare('
                      SELECT p.id, p.user_id, p.latitude, p.longitude, p.size_category, p.diameter_cm, p.description, p.created_at,
                             u.username AS reporter_username,
                             (SELECT COUNT(*) FROM pothole_confirmations c WHERE c.pothole_id = p.id) AS confirmation_count
                      FROM potholes p
                      JOIN users u ON u.id = p.user_id
                      WHERE ( 111.0 * SQRT(POW(p.latitude - ?, 2) + POW(POW(111.0 * COS(RADIANS(?)), 2) * (p.longitude - ?), 2)) ) <= ?
                      ORDER BY p.created_at DESC
                    ');
                    $stmt->execute([$lat, $lat, $lng, $radius]);
                } else {
                    $stmt = $pdo->query('
                      SELECT p.id, p.user_id, p.latitude, p.longitude, p.size_category, p.diameter_cm, p.description, p.created_at,
                             u.username AS reporter_username,
                             (SELECT COUNT(*) FROM pothole_confirmations c WHERE c.pothole_id = p.id) AS confirmation_count
                      FROM potholes p
                      JOIN users u ON u.id = p.user_id
                      ORDER BY p.created_at DESC
                      LIMIT 500
                    ');
                }
                $rows = $stmt->fetchAll();
                echo json_encode(['potholes' => array_map('formatPotholeRow', $rows)]);
            }
            break;

        case 'POST':
            if ($id !== null) {
                http_response_code(404);
                echo json_encode(['error' => 'Not found']);
                return;
            }
            $userId = requireAuth();
            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            $latitude = (float) ($input['latitude'] ?? 0);
            $longitude = (float) ($input['longitude'] ?? 0);
            $size = strtolower(trim((string) ($input['size_category'] ?? 'medium')));
            if (!in_array($size, ['small', 'medium', 'large'], true)) {
                $size = 'medium';
            }
            $diameter_cm = isset($input['diameter_cm']) ? (float) $input['diameter_cm'] : null;
            $description = isset($input['description']) ? trim((string) $input['description']) : null;
            $stmt = $pdo->prepare('INSERT INTO potholes (user_id, latitude, longitude, size_category, diameter_cm, description) VALUES (?, ?, ?, ?, ?, ?)');
            $stmt->execute([$userId, $latitude, $longitude, $size, $diameter_cm, $description ?: null]);
            $newId = (int) $pdo->lastInsertId();
            $stmt = $pdo->prepare('
              SELECT p.id, p.user_id, p.latitude, p.longitude, p.size_category, p.diameter_cm, p.description, p.created_at, p.updated_at,
                     u.username AS reporter_username,
                     0 AS confirmation_count
              FROM potholes p
              JOIN users u ON u.id = p.user_id
              WHERE p.id = ?
            ');
            $stmt->execute([$newId]);
            $row = $stmt->fetch();
            http_response_code(201);
            echo json_encode(formatPotholeRow($row));
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

function formatPotholeRow(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'user_id' => (int) $row['user_id'],
        'reporter_username' => $row['reporter_username'] ?? null,
        'latitude' => (float) $row['latitude'],
        'longitude' => (float) $row['longitude'],
        'size_category' => $row['size_category'],
        'diameter_cm' => $row['diameter_cm'] !== null ? (float) $row['diameter_cm'] : null,
        'description' => $row['description'] !== null && $row['description'] !== '' ? $row['description'] : null,
        'confirmation_count' => isset($row['confirmation_count']) ? (int) $row['confirmation_count'] : 0,
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at'] ?? null,
    ];
}
