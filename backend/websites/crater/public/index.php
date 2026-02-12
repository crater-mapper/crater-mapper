<?php
/**
 * Pothole Tracker - PHP Backend Entry Point
 */

declare(strict_types=1);

// Load config and DB
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

// CORS headers for API usage from frontend
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Simple router: path is taken from query string or PATH_INFO
$path = $_GET['path'] ?? trim($_SERVER['PATH_INFO'] ?? '', '/') ?: 'api';
$path = trim($path, '/');
$segments = $path ? explode('/', $path) : ['api'];

$method = $_SERVER['REQUEST_METHOD'];

// Route to handler
try {
    switch ($segments[0]) {
        case 'api':
            require __DIR__ . '/api/router.php';
            apiRouter($segments, $method);
            break;
        case 'health':
            echo json_encode(['status' => 'ok', 'time' => date('c')]);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Not found', 'path' => $path]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    if (APP_DEBUG) {
        echo json_encode(['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
    } else {
        echo json_encode(['error' => 'Internal server error']);
    }
}
