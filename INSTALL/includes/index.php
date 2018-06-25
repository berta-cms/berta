<?php
/** @todo
 * - Check why is the 'inc.page.php' included here if this file is included in it
 * - fix this path:  */
// $SITE_ROOT = '../../';
define('AUTH_AUTHREQUIRED', false);
define('SETTINGS_INSTALLREQUIRED', false);
include '../../engine/inc.page.php';

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
