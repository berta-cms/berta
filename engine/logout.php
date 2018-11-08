<?php
define('AUTH_AUTHREQUIRED', true);
define('SETTINGS_INSTALLREQUIRED', false);
define('BERTA_ENVIRONMENT', 'engine');
require 'inc.page.php';

setcookie(session_name(), "", time() - 42000, "/");
setcookie('token', '', time() + 42000, '/');

$berta->security->destroy();

//destroy cookies
reset($_COOKIE);
foreach ($_COOKIE as $idx => $cookie) {
	if(strpos($idx, '_berta_') === 0) {
		//unset($_COOKIE[$idx]);
		setcookie($idx, "", time() - 3600);
	}
}

$int_version = $options['int_version'];

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $berta->settings->get('texts', 'page-title') ?> / logout</title>
<link rel="stylesheet" href="<?php echo $ENGINE_ROOT_URL ?>css/backend.min.css?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
<link rel="stylesheet" href="<?php echo $ENGINE_ROOT_URL ?>css/editor.css.php?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
<link rel="stylesheet" href="<?php echo $ENGINE_ROOT_URL ?>css/login.css?<?php echo $int_version ?>" type="text/css" />
</head>

<body class="xLoginPageBody" onload="setTimeout('window.location=\'<?php echo $SITE_ROOT_URL ?>\'', 1500)">
	<div class="xMAlign-container xPanel">
		<div class="xMAlign-outer">
			<div class="xMAlign-inner">
				<p class="xLogout"><?php echo I18n::_('Logout ok. Please wait...') ?></p>
			</div>
		</div>
	</div>
</body>
</html>
