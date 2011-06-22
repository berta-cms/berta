<?
define('AUTH_AUTHREQUIRED', true);
define('BERTA_ENVIRONMENT', 'engine');
include('inc.page.php');
$loggedIn = $berta->security->userLoggedIn;
include_once $ENGINE_ROOT . '_classes/class.bertaeditor.php';

$allSections = BertaContent::getSections();
$topPanelHTML = BertaEditor::getTopPanelHTML('profile');

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title><? echo $berta->settings->get('texts', 'pageTitle') ?> / sections</title>
<link rel="SHORTCUT ICON" href="favicon.ico"/>
<link rel="stylesheet" href="<? echo $ENGINE_ABS_ROOT ?>css/default.css" type="text/css"  charset="utf-8" />
<link rel="stylesheet" href="<? echo $ENGINE_ABS_ROOT ?>css/editor.css.php" type="text/css"  charset="utf-8" />
<? include 'inc.header_default_scripts.php' ?>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/Assets.js" charset="utf-8"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/BertaEditorBase.js"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/inline_edit.js" charset="utf-8"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/BertaEditor_ChangePassword.js" charset="utf-8"></script>
</head>

<body class="xSettingsPageBody" x_mode="profile">
	<form name="infoForm" id="infoForm">
		<input type="hidden" name="ENGINE_ROOT" id="ENGINE_ROOT" value="<? echo htmlspecialchars($ENGINE_ROOT) ?>" />
	</form>
	<? echo $topPanelHTML ?>
	<div id="allContainer">
		<div id="contentContainer">
			<h1 id="allPageTitle">Profile</h1>

			<div id="xSectionsEditor">
						
				<form name="password_form" id="password_form" method="get" action="<? echo htmlspecialchars($ENGINE_ROOT) ?>update.php" >
					<label for="old_password">Old password</label><br />
					<input type="password" name="old_password" id="old_password" value="" /><br />
					<label for="new_password">New password</label><br />
					<input type="password" name="new_password" id="new_password" value="" /><br />
					<label for="retype_password">Retype new password</label><br />
					<input type="password" name="retype_password" id="retype_password" value="" /><br />
					<input type="submit" name="xBertaEditorChangePassword" id="xBertaEditorChangePassword" value="Change password" />
				</form>				
			
				<br class="clear" />
				<hr />
		
				<div class="entry">
					<div class="value value-long">
						Password must be at least 6 characters long<br /> and containing alphanumeric (A-Z, a-z, 0-9) characters.
					</div>
				</div>
				<p>&nbsp; </p>
			</div>			
		</div>
	</div>
</body>
</html>
