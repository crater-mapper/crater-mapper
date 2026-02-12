<?php
/**
 * API router – pothole reports, users, auth, confirmations
 */

declare(strict_types=1);

function apiRouter(array $segments, string $method): void
{
    $resource = $segments[1] ?? '';
    $sub = $segments[2] ?? null;
    $id = $segments[3] ?? null;

    if ($resource === '') {
        echo json_encode([
            'message' => 'Pothole Tracker API',
            'version' => '1.0',
            'endpoints' => [
                'POST /api/auth/register' => 'Register (username, email, password)',
                'POST /api/auth/login' => 'Login (email, password) → token',
                'GET /api/potholes' => 'List pothole reports (optional ?lat=&lng=&radius=)',
                'GET /api/potholes/:id' => 'Get one report + confirmation count',
                'POST /api/potholes' => 'Create report (auth; lat, lng, size_category, …)',
                'POST /api/potholes/:id/confirm' => 'Confirm a report (auth); reporter gains reputation',
                'GET /api/users/me' => 'Current user profile + reputation (auth)',
            ],
        ]);
        return;
    }

    switch ($resource) {
        case 'auth':
            require __DIR__ . '/auth.php';
            handleAuth($sub, $method);
            break;
        case 'users':
            require __DIR__ . '/users.php';
            handleUsers($sub, $method);
            break;
        case 'potholes':
            require __DIR__ . '/potholes.php';
            handlePotholes($sub, $id, $method);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Not found', 'resource' => $resource]);
    }
}
