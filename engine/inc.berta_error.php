<?php

if(!isset($BERTA_ERROR)) $BERTA_ERROR = '';

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $berta->settings->get('texts', 'pageTitle') ?> / error!</title>
<link rel="stylesheet" href="<?php echo Berta::$options['ENGINE_ROOT_URL'] ?>css/backend.min.css?<?php echo Berta::$options['version'] ?>" type="text/css" charset="utf-8" />
<link href="<?php echo Berta::$options['ENGINE_ROOT_URL'] ?>css/editor.css.php?<?php echo Berta::$options['version'] ?>" rel="stylesheet" type="text/css" />
<link href="<?php echo Berta::$options['ENGINE_ROOT_URL'] ?>css/login.css?<?php echo Berta::$options['version'] ?>" rel="stylesheet" type="text/css" />
</head>
<body class="xLoginPageBody">
	<div class="xMAlign-container xPanel">
		<div class="xMAlign-outer">
			<div class="xMAlign-inner">
				<h2>Berta says: <em>ERROR!</em></h2>
				<div class="error"><?php echo $BERTA_ERROR ?></div>
			</div>
		</div>
	</div>
</body>
</html>
