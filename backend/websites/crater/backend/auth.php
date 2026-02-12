<?php
/**
 * Auth helper: resolve current user from Bearer token
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

function getCurrentUserId(): ?int
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(\S+)$/i', $header, $m)) {
        return null;
    }
    $token = $m[1];
    $pdo = getDb();
    $stmt = $pdo->prepare('SELECT user_id FROM auth_tokens WHERE token = ? AND expires_at > NOW()');
    $stmt->execute([$token]);
    $row = $stmt->fetch();
    return $row ? (int) $row['user_id'] : null;
}

function requireAuth(): int
{
    $userId = getCurrentUserId();
    if ($userId === null) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized', 'message' => 'Valid token required']);
        exit;
    }
    return $userId;
}
