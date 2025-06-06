<?php

if (empty($CHECK_INCLUDED)) {
    /** @todo
     * - fix this path:  */
    define('AUTH_AUTHREQUIRED', true);
    define('SETTINGS_INSTALLREQUIRED', false);
    include '../../engine/inc.page.php';
}

include $ENGINE_ROOT_PATH . 'inc.settings.php';
$berta->settings = new Settings($settingsDefinition);

include_once $ENGINE_ROOT_PATH . '_classes/class.bertaeditor.php';

$version = $options['version'];

$uriPath = explode('?', $_SERVER['REQUEST_URI'])[0];

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $berta->settings->get('texts', 'pageTitle') ?> / welcome</title>
<link rel="stylesheet" href="<?php echo $ENGINE_ROOT_URL ?>css/backend.min.css?<?php echo $version ?>" type="text/css" charset="utf-8" />
<link rel="stylesheet" href="<?php echo $ENGINE_ROOT_URL ?>css/editor.css.php?<?php echo $version ?>" type="text/css" charset="utf-8" />
<link rel="stylesheet" href="<?php echo $ENGINE_ROOT_URL ?>css/login.css?<?php echo $version ?>" type="text/css" />
<?php include $ENGINE_ROOT_PATH . 'inc.head.php'; ?>
</head><?php

if (! empty($settings['berta']['installed'])) {
    $redirectURL = strstr($uriPath, '/editor') ? $ENGINE_ROOT_URL . 'editor/' : $SITE_ROOT_URL;

    ?><body class="xLoginPageBody">
		<div class="xMAlign-container xPanel">
			<div class="xMAlign-outer">
				<div class="xMAlign-inner">
					<p>Berta is already installed.<br />Please delete folder named <strong><code>INSTALL</code></strong> in your Berta's root folder! <br />&nbsp;<br /><input type="button" value="  OK  " onclick="window.location='<?php echo $SITE_ROOT_URL ?>';"></p>
				</div>
			</div>
		</div>
	</body><?php

} else {
    $redirectURL = strstr($uriPath, '/editor') ? $ENGINE_ROOT_URL . 'editor/' : $ENGINE_ROOT_URL;
    $site = empty($options['MULTISITE']) ? '' : $options['MULTISITE'];
    $basePath = $site . '/settings';

    ?><body class="xLoginPageBody xSetupWizard" x_mode="settings">
		<div class="xMAlign-container xPanel">
			<div class="xMAlign-outer">
				<div class="xMAlign-inner justify">
					<div id="xFirstTimeWizzard">
						<h2><?php echo I18n::_('Setup your site') ?></h2>

						<p class="emphasis"><?php echo I18n::_('setup_info_text') ?></p>

						<p>1. <?php echo I18n::_('What is the title of your site?') ?></p>
						<p class="subInfo"><?php echo I18n::_('Site title will be visible in all sections of your site.') ?></p>

                        <?php
                            echo BertaEditor::getSettingsItemEditHTML(
                                'siteTexts/siteHeading',
                                $berta->settings->getDefinition('siteTexts', 'siteHeading'),
                                $berta->settings->get('siteTexts', 'siteHeading', false),
                                ['xCaption' => str_replace(' ', '+', $berta->settings->getDefinitionParam('siteTexts', 'siteHeading', 'title'))],
                                'p',
                                $basePath . '/siteTexts/siteHeading'
                            );
    ?>

						<p>2. <?php echo I18n::_('What is your name?') ?></p>
						<p class="subInfo"><?php echo I18n::_('It will appear in the copyright notice in the footer. You may leave it blank.') ?></p>

						<?php echo BertaEditor::getSettingsItemEditHTML(
						    'texts/ownerName',
						    $berta->settings->getDefinition('texts', 'ownerName'),
						    $berta->settings->get('texts', 'ownerName', false),
						    ['xCaption' => str_replace(' ', '+', $berta->settings->getDefinitionParam('texts', 'ownerName', 'title'))],
						    'p',
						    $basePath . '/texts/ownerName'
						);
    ?>

						<p>3. <?php echo I18n::_('What is this website about?') ?></p>
						<p class="subInfo"><?php echo I18n::_('It will appear under your site name in search engine results.') ?></p>
						<p class="subInfo"><?php echo I18n::_('Note: the fields that already have value appear yellow only when you roll over them with your mouse. Click on the text below to edit.') ?></p>

						<?php echo BertaEditor::getSettingsItemEditHTML(
						    'texts/metaDescription',
						    $berta->settings->getDefinition('texts', 'metaDescription'),
						    $berta->settings->get('texts', 'metaDescription', false),
						    ['xCaption' => str_replace(' ', '+', $berta->settings->getDefinitionParam('texts', 'metaDescription', 'title'))],
						    'p',
						    $basePath . '/texts/metaDescription'
						);
    ?>

                        <p><input type="button" value=" <?php echo I18n::_('Done!') ?> " id="xFinishInstall" data-path="<?php echo $basePath?>/berta/installed"></p>
					</div>
					<?php

    ?></div>
			</div>
		</div>
    </body>

<?php
}
?>

</html>
