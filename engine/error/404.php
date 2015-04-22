<?php
header("HTTP/1.0 404 Not Found");
?><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
	<title><?php echo $berta->settings->get('texts', 'page-title') ?></title>
	<link rel="SHORTCUT ICON" href="<?php echo $SITE_ABS_ROOT ?>favicon.ico">
	<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/id.css.php" type="text/css">
</head>
<body>
	<div id="allContainer">
		<h1 id="allPageTitle"><a href="./"><?php echo $berta->settings->get('site-texts', 'site-heading') ?></a></h1>
		<p>Page not found!</p>
	</div>
</body>
</html>