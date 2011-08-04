<?
define('AUTH_AUTHREQUIRED', false);
define('SETTINGS_INSTALLREQUIRED', false);
define('BERTA_ENVIRONMENT', 'engine');
require 'inc.page.php';

?><!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie6 ie-old"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie7 ie-old"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <htm> <!--<![endif]-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><? echo $berta->settings->get('texts', 'page-title') ?> / unsupported browser</title>
<link href="<? echo $ENGINE_ABS_ROOT ?>css/default.css" rel="stylesheet" type="text/css" />
<link href="<? echo $ENGINE_ABS_ROOT ?>css/login.css" rel="stylesheet" type="text/css" />
<link href="<? echo $ENGINE_ABS_ROOT ?>css/editor.css.php" rel="stylesheet" type="text/css" />
<? include 'inc.header_default_scripts.php' ?>
<script type="text/javascript">
	window.addEvent('domready', function() {
		
	});
</script>


</head>

<body class="xLoginPageBody">
	<div class="xMAlign-container xPanel">
		<div class="xMAlign-outer">
			<div class="xMAlign-inner">
				
				<h3>You can't use Internet Explorer to edit your site!</h3>
				<h3>^_^</h3>
				<h3>Please get <a href="http://www.mozilla.com/" target="_blank">Firefox</a>, 
					<a href="http://www.apple.com/safari/" target="_blank">Safari</a> or 
					<a href="http://www.google.com/chrome" target="_blank">Chrome</a>.</h3>
			</div>
		</div>
	</div>
</body>
</html>
