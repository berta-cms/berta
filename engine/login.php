<?
define('AUTH_AUTHREQUIRED', false);
define('SETTINGS_INSTALLREQUIRED', false);
define('BERTA_ENVIRONMENT', 'engine');
require 'inc.page.php';


if($berta->security->user) {
	$berta->security->destroy();
	header("Location: login.php?" . uniqid());
	exit;
}
	

$auth_action = isset($_POST["auth_action"]) ? $_POST["auth_action"] : false;

$errStr = "";
$authErr = isset($_GET["autherror"]) ? $_GET["autherror"] : false;
if($authErr)
    $errStr = $berta->security->getError("auth", $authErr);

if($auth_action == "login" && !$errStr) {
	if(empty($_REQUEST['auth_browser']) || $_REQUEST['auth_browser'] == 'invalid') {
		header('Location: ./ie.php');
		exit;
		
	} else {
	
    	if($berta->security->login($_REQUEST['auth_user'], $_REQUEST['auth_pass'], $options['AUTH_user'], $options['AUTH_password'])) {
		
			// update media cache for all sections ...
		
			include 'inc.cleanup_and_update.php';
		
			// redirect to main page ...
		
			header("Location: $ENGINE_ABS_ROOT");
	        exit;


	    } else
	        $errStr = $berta->security->getError("login", $berta->security->errLogin);
	}
}

?><!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie6 ie-old"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie7 ie-old"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html> <!--<![endif]-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><? echo $berta->settings->get('texts', 'page-title') ?> / login</title>
<link href="<? echo $ENGINE_ABS_ROOT ?>css/default.css" rel="stylesheet" type="text/css" />
<link href="<? echo $ENGINE_ABS_ROOT ?>css/login.css" rel="stylesheet" type="text/css" />
<link href="<? echo $ENGINE_ABS_ROOT ?>css/editor.css.php" rel="stylesheet" type="text/css" />
<? include 'inc.header_default_scripts.php' ?>
<script type="text/javascript">
	window.addEvent('domready', function() {
		$('auth_user').focus();
	});
</script>


</head>

<body class="xLoginPageBody">
	<div class="xMAlign-container xPanel">
		<div class="xMAlign-outer">
			<div class="xMAlign-inner">
				<form name="xLoginForm" action="<? echo $ENGINE_ABS_ROOT ?>login.php" method="post">
					<? if($errStr) { ?>
					 	<div class="xLoginError"><? echo $errStr ?></div>
					<? } ?>
					<input type="hidden" name="auth_action" value="login" />
					<!--[if IE ]> <input type="hidden" name="auth_browser" value="invalid" /> <![endif]-->
					<!--[if (gte IE 9)|!(IE)]><!--> <input type="hidden" name="auth_browser" value="supported" /> <!--<![endif]-->
					<input type="text" name="auth_user" id="auth_user" class="xLoginField" />
					<input type="password" name="auth_pass" id="auth_pass" class="xLoginField" />
					<input type="submit" name="auth_subm" id="auth_subm" class="xLoginSubmit" value="BERTA v<? echo BertaBase::$options['version'] ?>" />
				</form>
			</div>
		</div>
	</div>
</body>
</html>
