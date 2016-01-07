<?php
define('AUTH_AUTHREQUIRED', true);
define('BERTA_ENVIRONMENT', 'engine');
include('inc.page.php');

if ($options['HOSTING_PROFILE']) {header('location:' . $options['HOSTING_PROFILE']); exit;}

$loggedIn = $berta->security->userLoggedIn;
include_once $ENGINE_ROOT . '_classes/class.bertaeditor.php';

$allSections = BertaContent::getSections();
$topPanelHTML = BertaEditor::getTopPanelHTML('profile');
$int_version = BertaEditor::$options['int_version'];

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title><?php echo $berta->settings->get('texts', 'pageTitle') ?> / <?php echo I18n::_('Profile') ?></title>
<link rel="SHORTCUT ICON" href="favicon.ico"/>
<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/backend.min.css?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/editor.css.php?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
<?php include('inc.init_state.php'); ?>
<script src="<?php echo $ENGINE_ABS_ROOT ?>js/backend.min.js?<?php echo $int_version ?>"></script>
</head>

<body class="xSettingsPageBody" x_mode="profile">
	<form name="infoForm" id="infoForm">
		<input type="hidden" name="ENGINE_ROOT" id="ENGINE_ROOT" value="<?php echo htmlspecialchars($ENGINE_ROOT) ?>" />
	</form>
	<?php echo $topPanelHTML ?>
	<div id="allContainer">
		<div id="contentContainer">
			<h1 id="allPageTitle"><?php echo I18n::_('Profile') ?></h1>

			<div id="xSectionsEditor">

				<form name="password_form" id="password_form" method="get" action="<?php echo htmlspecialchars($ENGINE_ROOT) ?>update.php" >
					<label for="old_password"><?php echo I18n::_('Old password') ?></label><br />
					<input type="password" name="old_password" id="old_password" value="" /><br />
					<label for="new_password"><?php echo I18n::_('New password') ?></label><br />
					<input type="password" name="new_password" id="new_password" value="" /><br />
					<label for="retype_password"><?php echo I18n::_('Retype new password') ?></label><br />
					<input type="password" name="retype_password" id="retype_password" value="" /><br />
					<input type="submit" name="xBertaEditorChangePassword" id="xBertaEditorChangePassword" value="<?php echo I18n::_('Change password') ?>" />
				</form>

				<br class="clear" />
				<hr />

				<div class="entry">
					<div class="value value-long">
						<?php echo I18n::_('password_help_text') ?>
					</div>
				</div>
				<p>&nbsp; </p>
			</div>
		</div>
	</div>
</body>
</html>
