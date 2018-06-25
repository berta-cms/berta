<?php
define('AUTH_AUTHREQUIRED', true);
define('BERTA_ENVIRONMENT', 'engine');
include('inc.page.php');
$loggedIn = $berta->security->userLoggedIn;
include_once $ENGINE_ROOT_PATH . '_classes/class.bertaeditor.php';

if ($shopEnabled) {
	include($SITE_ROOT_PATH . '_plugin_shop/shopsettings.php');
}
