<?php
define('AUTH_AUTHREQUIRED', true);
define('BERTA_ENVIRONMENT', 'engine');
include('inc.page.php');
$loggedIn = $berta->security->userLoggedIn;
include_once $ENGINE_ROOT . '_classes/class.bertaeditor.php';

// $allSections = BertaContent::getSections();
$topPanelHTML = BertaEditor::getTopPanelHTML('multisite');

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title><?php echo $berta->settings->get('texts', 'pageTitle') ?> / <?php echo I18n::_('Multisite') ?></title>
<link rel="SHORTCUT ICON" href="favicon.ico"/>
<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/default.css" type="text/css"  charset="utf-8" />
<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/editor.css.php" type="text/css"  charset="utf-8" />
<?php include 'inc.header_default_scripts.php' ?>
<script type="text/javascript" src="<?php echo $ENGINE_ABS_ROOT ?>js/Assets.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo $ENGINE_ABS_ROOT ?>js/BertaEditorBase.js"></script>
<script type="text/javascript" src="<?php echo $ENGINE_ABS_ROOT ?>js/inline_edit.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo $ENGINE_ABS_ROOT ?>js/BertaEditor_Multisite.js" charset="utf-8"></script>
</head>

<body class="xSettingsPageBody" x_mode="multisite">
	<form name="infoForm" id="infoForm">
		<input type="hidden" name="ENGINE_ROOT" id="ENGINE_ROOT" value="<?php echo htmlspecialchars($ENGINE_ROOT) ?>" />
	</form>
	<?php echo $topPanelHTML ?>
	<div id="allContainer">
		<div id="contentContainer">
			<h1><?php echo I18n::_('Multisite') ?></h1>
			<div id="xMultisiteEditor">
				<p>...</p>
			</div>
		</div>
	</div>
</body>
</html>
