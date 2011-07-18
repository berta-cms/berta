<?

header("HTTP/1.0 404 Not Found");

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title><? echo $berta->settings->get('texts', 'page-title') ?></title>
	<link rel="SHORTCUT ICON" href="<? echo $SITE_ABS_ROOT ?>favicon.ico"/>
	<link rel="stylesheet" href="<? echo $ENGINE_ABS_ROOT ?>css/id.css.php" type="text/css" />
	
</head>

<body>
	<div id="allContainer">


		<h1 id="allPageTitle"><a href="./"><? echo $berta->settings->get('site-texts', 'site-heading') ?></a></h1>

		<p>Page not found!</p>
	</div>
</body>
</html>
