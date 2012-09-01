<?php

$SITE_ROOT = '../../';
$ENGINE_ROOT = '../../engine/';
define('AUTH_AUTHREQUIRED', false);
define('SETTINGS_INSTALLREQUIRED', false);
include $ENGINE_ROOT . 'inc.page.php';

if(empty($settings['berta']['installed'])) {
	if(file_exists('./READ-ME!.html')) {
		include 'READ-ME!.html';
	} else {
		echo 'Berta is not installed. Please go to Berta\'s homepage for instructions.';
	}
} else {
	header('Location: ../');
	exit;
}



?>