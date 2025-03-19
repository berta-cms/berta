<?php

/**
 * Berta's release version
 */
$composerConfig = json_decode(file_get_contents(dirname(__DIR__) . '/_api_app/composer.json'), true);

$options['app_version'] = explode('.', $composerConfig['version']);
$options['version'] = "v{$composerConfig['version']}";
