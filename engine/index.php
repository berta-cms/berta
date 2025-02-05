<?php
if (empty($INDEX_INCLUDED)) {
    $INDEX_INCLUDED = false;
}

if (!$INDEX_INCLUDED) {
    define('AUTH_AUTHREQUIRED', true); // require authentification if inside engine folder
    define('BERTA_ENVIRONMENT', 'engine');
} else {
    define('SETTINGS_INSTALLREQUIRED', true); // don't require INSTALL if just watching the site
}

include __dir__ . '/inc.page.php';

if (!$berta->security->userLoggedIn) {
    if ($INDEX_INCLUDED) {
        include_once $ENGINE_ROOT_PATH . 'editor/inc.editor.php';
        exit;
    } else {
        header('Location: /');
        exit;
    }
}
