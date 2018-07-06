<?php
define('AUTH_AUTHREQUIRED', false);
define('SETTINGS_INSTALLREQUIRED', false);
define('BERTA_ENVIRONMENT', 'engine');
require 'inc.page.php';

if(is_mobile()){
	header('Location: ./mobile.php');exit;
}

if( $berta->security->user && !isset($_GET['auth_key']) ) {
	$berta->security->destroy();
	header("Location: login.php?" . uniqid());
	exit;
}

if ($options['HOSTING_PROFILE']) {

	// if key, cURL check if autorized on auth_server
	if (isset($_GET['auth_key'])){

		$isLoggedIn = $berta->security->isLoggedIn($options['HOSTING_PROFILE'].'?auth_key='.$_GET['auth_key'].'&auth_user='.$options['AUTH_user'], $_GET['auth_key']);

		if ($isLoggedIn) {
			$_POST['auth_action'] = 'login';
			$_REQUEST['auth_browser'] = 'supported';
			$_REQUEST['auth_user'] = $options['AUTH_user'];
			$_REQUEST['auth_pass'] = $options['AUTH_password'];
		}else{
			header("Location: login.php?autherror=1");
			exit;
		}
	}

	$login_action = $options['HOSTING_PROFILE'] . '?remote_redirect=' . urlencode($options['SITE_HOST_ADDRESS'] . $SITE_ABS_ROOT . '_api/auth/login');
}else{
    $login_action = $SITE_ABS_ROOT . '_api/auth/login';
}

$auth_action = isset($_POST["auth_action"]) ? $_POST["auth_action"] : false;

$errStr = "";
$authErr = isset($_GET["autherror"]) ? $_GET["autherror"] : false;
if($authErr)
    //$errStr = $berta->security->getError("auth", $authErr);
	$errStr = $berta->security->getError("login", 5);

if($auth_action == "login" && !$errStr) {

	if(empty($_REQUEST['auth_browser']) || $_REQUEST['auth_browser'] == 'invalid') {
		header('Location: ./ie.php');exit;
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

$int_version = $options['int_version'];

?><!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie6 ie-old"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie7 ie-old"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html> <!--<![endif]-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $berta->settings->get('texts', 'page-title') ?> / login</title>
<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/backend.min.css?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/editor.css.php?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/login.css?<?php echo $int_version ?>" type="text/css" />
<?php include 'inc.header_default_scripts.php' ?>
<?php echo BertaTemplate::sentryScripts(); ?>
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
				<form name="xLoginForm" action="<?php echo $login_action ?>" method="post">
                    <div class="xLoginLogo">
                        <img src="<?php echo $ENGINE_ABS_ROOT ?>layout/berta.png" alt="berta v <?php echo BertaBase::$options['version'] ?>" />
                    </div>
					<?php if($errStr) { ?>
					 	<div class="xLoginError"><?php echo $errStr ?></div>
					<?php } ?>
					<input type="hidden" name="auth_action" value="login" />
					<!--[if IE ]> <input type="hidden" name="auth_browser" value="invalid" /> <![endif]-->
					<!--[if !(IE)]><!--> <input type="hidden" name="auth_browser" value="supported" /> <!--<![endif]-->
                    <?php if ($options['HOSTING_PROFILE']) { ?>
                        <a href="<?php echo $login_action . '&amp;provider=facebook' ?>" class="social_button social_button_facebook"><span class="icon-facebook"></span>Log in with Facebook</a>
                        <a href="<?php echo $login_action . '&amp;provider=google' ?>" class="social_button social_button_google"><span class="icon-google-plus"></span>Log in with Google</a>
                        <p class="social_or">or</p>
                    <?php } ?>
                    <input type="text" name="auth_user" id="auth_user" class="xLoginField" />
					<input type="password" name="auth_pass" id="auth_pass" class="xLoginField" />
					<input type="submit" name="auth_subm" id="auth_subm" class="xLoginSubmit" value="<?php echo I18n::_('Log in') ?>" />
					<p><a href="<?php echo $options['FORGOTPASSWORD_LINK']?>" target="_blank"><?php echo I18n::_('Forgot password?') ?></a></p>

					<p>
                        berta v <?php echo BertaBase::$options['version'] ?> 2008-<?php echo date('Y') ?>
                    </p>
				</form>
			</div>
		</div>
	</div>
</body>
</html>
