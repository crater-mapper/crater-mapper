<?php
/**
 * Users API: current user profile (reputation)
 */

declare(strict_types=1);

require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../db.php';

function handleUsers(?string $action, string $method): void
{
    if ($action === 'me' && $method === 'GET') {
        $userId = getCurrentUserId() ?? 1; // Public: fall back to user 1
        $pdo = getDb();
        $stmt = $pdo->prepare('SELECT id, username, email, reputation, created_at FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $row = $stmt->fetch();
        if (!$row) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        echo json_encode([
            'id' => (int) $row['id'],
            'username' => $row['username'],
            'email' => $row['email'],
            'reputation' => (int) $row['reputation'],
            'created_at' => $row['created_at'],
        ]);
        return;
    }
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
}
