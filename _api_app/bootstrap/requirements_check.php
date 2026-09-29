<?php

/*
 * Requirements that must be met before Laravel can boot: a too old PHP makes
 * vendor/composer/platform_check.php throw, a missing vendor/ makes the autoloader
 * require fail.
 *
 * Returns the failed requirements (same shape as App\Setup\ServerRequirementsService
 * rows), an empty array when all is fine. Outputs nothing, callers decide how to
 * respond: the API guard (requirements_guard.php) answers with JSON, the engine
 * (engine/loader.helper.php) redirects to the editor.
 *
 * Keep this file parsable by old PHP versions: no `??`, typed or arrow functions,
 * `match` etc.
 */

$bertaRequirements = require __DIR__ . '/requirements.php';
$bertaFailedRequirements = [];

if (version_compare(PHP_VERSION, $bertaRequirements['php'], '<')) {
    $bertaFailedRequirements[] = [
        'key' => 'php',
        'group' => 'server',
        'label' => 'Supported PHP version (' . $bertaRequirements['php'] . ' or newer)',
        'ok' => false,
        'fatal' => true,
        'message' => 'Berta needs PHP ' . $bertaRequirements['php'] . ' or newer, this server runs PHP ' . PHP_VERSION . '. Ask your server administrator to enable a supported PHP version.',
    ];
}

if (! file_exists(__DIR__ . '/../vendor/autoload.php')) {
    $bertaFailedRequirements[] = [
        'key' => 'vendor',
        'group' => 'installation',
        'label' => 'Dependencies installed',
        'ok' => false,
        'fatal' => true,
        'message' => 'The "_api_app/vendor" folder is missing. Upload the complete Berta package or run "composer install" in the "_api_app" folder.',
    ];
}

// Required into the engine's global scope, don't leave anything behind
unset($bertaRequirements);

return $bertaFailedRequirements;
