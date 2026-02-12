<?php
/**
 * Pothole Tracker - Public entry point
 * Nginx routes all requests here; this proxies to the backend router.
 */
require_once __DIR__ . '/../backend/index.php';
