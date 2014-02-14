<?php

if(empty($CHECK_INCLUDED)) {
	$SITE_ROOT = '../../';
	$ENGINE_ROOT = '../../engine/';
	define('AUTH_AUTHREQUIRED', true);
	define('SETTINGS_INSTALLREQUIRED', false);
	include $ENGINE_ROOT . 'inc.page.php';
}

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $berta->settings->get('texts', 'pageTitle') ?> / <?php echo I18n::_('welcome') ?></title>
<link href="<?php echo $ENGINE_ABS_ROOT ?>css/default.css" rel="stylesheet" type="text/css" />
<link href="<?php echo $ENGINE_ABS_ROOT ?>css/login.css" rel="stylesheet" type="text/css" />
<link href="<?php echo $ENGINE_ABS_ROOT ?>css/editor.css.php" rel="stylesheet" type="text/css" />
</head>
<body class="xLoginPageBody">
	<div class="xMAlign-container xPanel">
		<div class="xMAlign-outer">
			<div class="xMAlign-inner">
				<?php echo sprintf(I18n::_('welcome_text__not_installed'), $ENGINE_ABS_ROOT . (!empty($options['MULTISITE']) ? '?site='.$options['MULTISITE'] : '')) ?>
			</div>
		</div>
	</div>
</body>
</html>