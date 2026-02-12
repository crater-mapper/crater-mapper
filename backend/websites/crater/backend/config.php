<?php
/**
 * Backend configuration
 */

declare(strict_types=1);

// Set to false in production
define('APP_DEBUG', true);

// Base path for API (e.g. /backend/ or /)
define('APP_BASE_PATH', '/backend/');

// Default timezone
date_default_timezone_set('Europe/London');

// MySQL / MariaDB
define('DB_HOST', getenv('DB_HOST') ?: 'mysql');
define('DB_NAME', getenv('DB_NAME') ?: 'pothole_tracker');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: 'v.je');
define('DB_CHARSET', 'utf8mb4');
