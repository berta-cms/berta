<?php

if (empty($INDEX_INCLUDED)) {
    $INDEX_INCLUDED = false;
}
if (!$INDEX_INCLUDED) {
    define('AUTH_AUTHREQUIRED', true);  // require authentification if inside engine folder
    define('BERTA_ENVIRONMENT', 'engine');
} else {
    define('SETTINGS_INSTALLREQUIRED', true);  // don't require INSTALL if just watching the site
}

include dirname(__DIR__) . '/inc.page.php';
include __DIR__ . '/inc.editor.php';
