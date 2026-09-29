<?php

/*
 * Server requirements shared by the pre-boot guard (requirements_guard.php) and
 * App\Setup\ServerRequirementsService.
 *
 * Keep this file parsable by old PHP versions: the guard includes it before
 * checking the PHP version, so no modern syntax here.
 */

return [
    // Matches Composer's platform_check.php for the "php": "^8.4" constraint
    'php' => '8.4.1',

    // Extensions Berta uses and that can be missing on a server: not built by
    // default (mbstring, gd, openssl, curl) or often packaged separately / disabled
    // by hosts (dom, fileinfo, session, tokenizer, filter).
    // Left out on purpose: always compiled in (hash, json, pcre), implied by dom
    // (libxml), polyfilled (ctype), unused by Berta (pdo, xml), although Laravel
    // lists them. `mbstring` is required despite symfony/polyfill-mbstring, the
    // polyfill does not provide `mb_ereg_replace`.
    'extensions' => [
        'mbstring' => 'Multibyte strings (international characters)',
        'gd' => 'GD graphics library (image resizing and thumbnails)',
        'dom' => 'DOM (XML content storage)',
        'fileinfo' => 'Fileinfo (uploaded file type detection)',
        'openssl' => 'OpenSSL',
        'session' => 'Session',
        'tokenizer' => 'Tokenizer',
        'filter' => 'Filter',
        'curl' => 'cURL',
    ],
];
