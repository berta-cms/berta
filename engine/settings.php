<?
define('AUTH_AUTHREQUIRED', true);
define('BERTA_ENVIRONMENT', 'engine');
include('inc.page.php');
$loggedIn = $berta->security->userLoggedIn;
if($loggedIn) {
	include_once $ENGINE_ROOT . '_classes/class.bertaeditor.php';
} else {
	header("Location: ./login.php");
	exit;
}


$mode = !empty($_GET['mode']) ? $_GET['mode'] : 'settings';

include($ENGINE_ROOT . 'inc.settings.php');
$berta->settings = new Settings($settingsDefinition);
						  
$menuSeparator = $berta->settings->get('menu', 'separator');
$topPanelHTML = BertaEditor::getTopPanelHTML($mode);

include($ENGINE_ROOT . 'inc.tips.php');
$sttingsJS = json_encode($tipTexts);

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title><? echo $berta->settings->get('texts', 'pageTitle') ?> / settings</title>
<link rel="SHORTCUT ICON" href="favicon.ico"/>
<link rel="stylesheet" href="<? echo $ENGINE_ABS_ROOT ?>css/default.css" type="text/css"  charset="utf-8" />
<link rel="stylesheet" href="<? echo $ENGINE_ABS_ROOT ?>css/editor.css.php" type="text/css"  charset="utf-8" />
<!--<link rel="stylesheet" href="<? echo $ENGINE_ABS_ROOT ?>_lib/colorpicker/plugin.css" type="text/css" charset="utf-8" />-->
<link rel="stylesheet" href="<? echo $ENGINE_ABS_ROOT ?>_lib/moorainbow/mooRainbow.css" type="text/css" charset="utf-8" />
<? include 'inc.header_default_scripts.php' ?>
<script type="text/javascript">
	var bertaGlobalOptions = {
		"paths":{
			"engineRoot":"<? echo BertaEditor::$options['ENGINE_ROOT'] ?>",
			"engineABSRoot":"<? echo BertaEditor::$options['ENGINE_ABS_ROOT'] ?>",
			"siteABSRoot" : "<? echo BertaEditor::$options['SITE_ABS_ROOT'] ?>",
			"template" : "<? echo BertaEditor::$options['SITE_ABS_ROOT'] . 'templates/' . $berta->template->name . '/' ?>"
		},
		"i18n":<? echo $sttingsJS ?>
	};
</script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/Assets.js" charset="utf-8"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>_lib/moorainbow/mooRainbow.1.2b2.js" charset="utf-8"></script>
<!--<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>_lib/colorpicker/colorpicker.js" charset="utf-8"></script>-->
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>_lib/mgfx/rotater.js" charset="utf-8"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>_lib/mgfx/tabs.js" charset="utf-8"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>_lib/tiny_mce/tiny_mce_gzip.js"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/BertaEditorBase.js"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/swiff/Swiff.Uploader.js" charset="utf-8"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/BertaGalleryEditorAssets.js"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/inline_edit.js" charset="utf-8"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/BertaEditor.js" charset="utf-8"></script>
</head>

<body class="xSettingsPageBody" x_mode="settings">
	<form name="infoForm" id="infoForm">
		<input type="hidden" name="ENGINE_ROOT" id="ENGINE_ROOT" value="<? echo htmlspecialchars($ENGINE_ROOT) ?>" />
	</form>
	<? echo $topPanelHTML ?>
	<div id="allContainer">
		<div id="contentContainer">
			
			<h1 id="allPageTitle"><? echo $mode == 'template' ? I18n::_('Template design') : I18n::_('Settings') ?></h1>
			<? if($mode == 'template') { ?>
				<div class="entry" difficulty="0">
					<div><?= I18n::_('These are settings for template') ?> &quot;<?= $berta->template->name ?>&quot;.</div>
				</div>
			<? } ?>
			
			<?

			$settings = $mode == 'template' ? $berta->template->settings : $berta->settings;
			$propertyPrefix = $settings->templateName ? ($settings->templateFullName . '/') : '';
			
			$tabsHTML = '';
			$contentHTML = '';
			
			foreach($settings->settingsDefinition as $sSectionKey => $sSection) {

				if(empty($sSection['_']['invisible'])) {
					$tabCaption = !empty($sSection['_']['title']) ? htmlspecialchars($sSection['_']['title']) : "<em>$sSectionKey</em>";
					$tabsHTML .= "<li><a href=\"#\" class=\"settingsTab\">$tabCaption</a></li>";

					$contentHTML .= "<div class=\"settingsContent\">\n";
					foreach($sSection as $sKey => $s) {

						// Dont render keys that start with an underscore
						if(substr($sKey, 0, 1) != '_') {
							$contentHTML .= '	<div class="entry">' . "\n";

							// caption
							$contentHTML .= '	<div class="caption">' . ($s['title'] ? ($s['title']) : "<em>$sKey</em>") . '</div>';

							// value
							$value = $settings->get($sSectionKey, $sKey, false, false);	// don't use empty + don't inherit from base
							$contentHTML .= BertaEditor::getSettingsItemEditHTML($propertyPrefix . $sSectionKey . '/' . $sKey, $s, $value) . "\n";

							// description
							if(!empty($s['description'])) {
								$contentHTML .= '	<div class="description">' . $s['description'] . '</div>' . "\n";
							}

							$contentHTML .= '	<br class="clear" />' . "\n";
							$contentHTML .= "	</div>\n";
						}
					}
					$contentHTML .= "</div>\n";
				}
			}
			
			echo "<div id=\"settingsContentContainer\" class=\"settingsContentContainer\">
				$contentHTML\n
				<ul id=\"settingsTabs\" class=\"settingsTabs\">$tabsHTML<br class=\"clear\" /></ul>\n
			</div>\n";

			?>
			<br class="clear" />
			<hr />
			<h2><?= I18n::_('Some help with CSS values') ?></h2>

			<div class="entry">
				<div class="caption" style="width: 60px"><?= I18n::_('Units') ?></div>
				<div class="value" style="width: 300px; padding-right: 30px">
					<?= I18n::_('units_help_text') ?>
				</div>
				<div class="caption" style="width: 60px"><?= I18n::_('Margins') ?></div>
				<div class="value" style="width: 300px;">
					<?= I18n::_('margins_help_text') ?>
				</div>
			</div>
			<br class="clear" />
			<p>&nbsp; </p>
		</div>
	</div>
</body>
</html>
