<?php
header('HTTP/1.0 404 Not Found');
?><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
	<title><?php echo $berta->settings->get('texts', 'page-title') ?></title>
	<link rel="icon" type="image/x-icon" href="<?php echo $SITE_ROOT_URL ?>favicon.ico">
	<link rel="stylesheet" href="<?php echo $ENGINE_ROOT_URL ?>css/frontend.min.css" type="text/css">
</head>
<body>
	<div id="allContainer">
        <h1 id="allPageTitle"><a href="/"><?php echo $berta->settings->get('site-texts', 'site-heading')
            ? $berta->settings->get('site-texts', 'site-heading')
            : '404' ?></a></h1>
		<p>Page not found!</p>
	</div>
</body>
</html>
