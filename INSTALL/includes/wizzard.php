<?php

if(empty($CHECK_INCLUDED)) {
	$SITE_ROOT = '../../';
	$ENGINE_ROOT = '../../engine/';
	define('AUTH_AUTHREQUIRED', true);
	define('SETTINGS_INSTALLREQUIRED', false);
	include $ENGINE_ROOT . 'inc.page.php';
}

include($ENGINE_ROOT . 'inc.settings.php');
$berta->settings = new Settings($settingsDefinition);

include_once $ENGINE_ROOT . '_classes/class.bertaeditor.php';

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $berta->settings->get('texts', 'pageTitle') ?> / welcome</title>
<link href="<?php echo $ENGINE_ABS_ROOT ?>css/default.css" rel="stylesheet" type="text/css" />
<link href="<?php echo $ENGINE_ABS_ROOT ?>css/login.css" rel="stylesheet" type="text/css" />
<link href="<?php echo $ENGINE_ABS_ROOT ?>css/editor.css.php" rel="stylesheet" type="text/css" />
<?php include $ENGINE_ROOT . 'inc.header_default_scripts.php' ?>
<script type="text/javascript" src="<?php echo $ENGINE_ABS_ROOT ?>js/Assets.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo $ENGINE_ABS_ROOT ?>_lib/moorainbow/mooRainbow.1.2b2.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo $ENGINE_ABS_ROOT ?>js/BertaEditorBase.js"></script>
<script type="text/javascript" src="<?php echo $ENGINE_ABS_ROOT ?>js/inline_edit.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo $ENGINE_ABS_ROOT ?>js/BertaEditor.js" charset="utf-8"></script>
</head><?php

if(!empty($settings['berta']['installed'])) {
	?><body class="xLoginPageBody">
		<div class="xMAlign-container xPanel">
			<div class="xMAlign-outer">
				<div class="xMAlign-inner">
					<p>Berta is already installed.<br />Please delete folder named <strong><code>INSTALL</code></strong> in your Berta's root folder! <br />&nbsp;<br /><input type="button" value="  OK  " onclick="window.location='<?php echo $SITE_ABS_ROOT ?>';"></p>
				</div>
			</div>
		</div>
	</body><?php

} else {
	
	?><body class="xLoginPageBody" x_mode="settings">
		<div class="xMAlign-container xPanel">
			<div class="xMAlign-outer">
				<div class="xMAlign-inner justify">
					<div id="xFirstTimeWizzard">
						<h2><?php echo I18n::_('Setup your site') ?></h2>

						<p class="emphasis"><?php echo I18n::_('setup_info_text') ?></p>
						

						<p>1. <?php echo I18n::_('What is the title of your site?') ?></p>
						<p class="subInfo"><?php echo I18n::_('Site title will be visible in all sections of your site.') ?></p>

						<?php /* OLD: <p class="xFirstTimeField <?php echo $xEditSelectorSimple ?> xProperty-siteHeading xRequired-<?php echo $berta->settings->isRequired('siteTexts', 'siteHeading') ? '1': '0' ?>"><?php echo $berta->settings->get('siteTexts', 'siteHeading', true) ?></p>*/ ?>
						<?php echo BertaEditor::getSettingsItemEditHTML(
								'siteTexts/siteHeading',
								$berta->settings->getDefinition('siteTexts', 'siteHeading'),
								$berta->settings->get('siteTexts', 'siteHeading', false),
								array('xCaption' => str_replace(' ', '+', $berta->settings->getDefinitionParam('siteTexts', 'siteHeading', 'title'))),
								"p") ?>


						<p>2. <?php echo I18n::_('What is your name?') ?></p>
						<p class="subInfo"><?php echo I18n::_('Your name will be put in the copyright notice in the footer of yout site. You can leave it blank.') ?></p>

						<?php /* OLD: <p class="xFirstTimeField <?php echo $xEditSelectorSimple ?> xProperty-texts/ownerName xRequired-<?php echo $berta->settings->isRequired('texts', 'ownerName') ? '1': '0' ?>"><?php echo $berta->settings->get('texts', 'ownerName', true) ?></p>*/ ?>
						<?php echo BertaEditor::getSettingsItemEditHTML(
								'texts/ownerName',
								$berta->settings->getDefinition('texts', 'ownerName'),
								$berta->settings->get('texts', 'ownerName', false),
								array('xCaption' => str_replace(' ', '+', $berta->settings->getDefinitionParam('texts', 'ownerName', 'title'))),
								"p") ?>


						<p>3. <?php echo I18n::_('How would you — in one sentence — describe your site?') ?></p>
						<p class="subInfo"><?php echo I18n::_('This will appear under your site name as an excerpt in search engine results.') ?></p>
						<p class="subInfo"><?php echo I18n::_('Note: the fields that already have value appear yellow only when you roll over them with your mouse. Click on the text below to edit.') ?></p>
						<p class="xFirstTimeField <?php echo $xEditSelectorSimple ?> xProperty-texts/metaDescription xRequired-<?php echo $berta->settings->isRequired('texts', 'metaDescription') ? '1': '0' ?>"><?php echo $berta->settings->get('texts', 'metaDescription', true) ?></p>

						<p><input type="button" value=" <?php echo I18n::_('Done!') ?> " id="xFirstTimeCheckContinue" onclick="window.location='<?php echo $ENGINE_ABS_ROOT ?>?_berta_install_done=1'" /></p>

					</div>
					<?php

				?></div>
			</div>
		</div>
	</body><?php
	

}



?></html><?php







?>