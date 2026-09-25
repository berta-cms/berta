<?php

/*
 * Pre-boot requirements guard for the API.
 *
 * Runs before Composer's autoloader, so the API can still answer with JSON when
 * Laravel itself can not boot. The editor shows the response in its server
 * requirements modal.
 *
 * Keep this file parsable by old PHP versions: no `??`, typed or arrow functions,
 * `match` etc.
 */

$bertaFailedRequirements = require __DIR__ . '/requirements_check.php';

if ($bertaFailedRequirements) {
    http_response_code(503);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store');
    echo json_encode([
        'installed' => null,
        'requirements' => $bertaFailedRequirements,
    ]);
    exit;
}

unset($bertaFailedRequirements);
