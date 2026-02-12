<?php
/**
 * Auth API: register, login (returns token)
 */

declare(strict_types=1);

require_once __DIR__ . '/../db.php';

function handleAuth(?string $action, string $method): void
{
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $pdo = getDb();

    if ($action === 'register') {
        $username = trim((string) ($input['username'] ?? ''));
        $email = trim((string) ($input['email'] ?? ''));
        $password = (string) ($input['password'] ?? '');
        if ($username === '' || $email === '' || $password === '') {
            http_response_code(400);
            echo json_encode(['error' => 'username, email and password are required']);
            return;
        }
        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(['error' => 'Password must be at least 6 characters']);
            return;
        }
        $hash = password_hash($password, PASSWORD_DEFAULT);
        try {
            $stmt = $pdo->prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
            $stmt->execute([$username, $email, $hash]);
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                http_response_code(409);
                echo json_encode(['error' => 'Username or email already taken']);
                return;
            }
            throw $e;
        }
        $userId = (int) $pdo->lastInsertId();
        $token = createToken($pdo, $userId);
        http_response_code(201);
        echo json_encode([
            'user_id' => $userId,
            'username' => $username,
            'email' => $email,
            'reputation' => 0,
            'token' => $token,
        ]);
        return;
    }

    if ($action === 'login') {
        $email = trim((string) ($input['email'] ?? ''));
        $password = (string) ($input['password'] ?? '');
        if ($email === '' || $password === '') {
            http_response_code(400);
            echo json_encode(['error' => 'email and password are required']);
            return;
        }
        $stmt = $pdo->prepare('SELECT id, username, email, password_hash, reputation FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid email or password']);
            return;
        }
        $token = createToken($pdo, (int) $user['id']);
        echo json_encode([
            'user_id' => (int) $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'reputation' => (int) $user['reputation'],
            'token' => $token,
        ]);
        return;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Not found', 'action' => $action]);
}

function createToken(PDO $pdo, int $userId): string
{
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', time() + 30 * 86400); // 30 days
    $stmt = $pdo->prepare('INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, ?)');
    $stmt->execute([$userId, $token, $expires]);
    return $token;
}
