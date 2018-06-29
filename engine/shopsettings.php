<?php
define('AUTH_AUTHREQUIRED', true);
define('BERTA_ENVIRONMENT', 'engine');
include 'inc.page.php';
$loggedIn = $berta->security->userLoggedIn;
if ($loggedIn) {
    include_once $ENGINE_ROOT . '_classes/class.bertaeditor.php';
} else {
    header("Location: ./login.php");
    exit;
}

if ($shopEnabled) {
    include '../_plugin_shop/shopsettings.php';
}
