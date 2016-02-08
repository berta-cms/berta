<?php
define('AUTH_AUTHREQUIRED', true);
define('BERTA_ENVIRONMENT', 'engine');
include('inc.page.php');
$loggedIn = $berta->security->userLoggedIn;
include_once $ENGINE_ROOT . '_classes/class.bertaeditor.php';

if ($options['MULTISITE_DISABLED']) {
	header("Location: ./");
   	exit;
}

$allSites = BertaContent::getSites();
$topPanelHTML = BertaEditor::getTopPanelHTML('multisite');
$int_version = BertaEditor::$options['int_version'];

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title><?php echo $berta->settings->get('texts', 'pageTitle') ?> / <?php echo I18n::_('Multisite') ?></title>
<link rel="SHORTCUT ICON" href="favicon.ico"/>
<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/backend.min.css?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/editor.css.php?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
<?php include('inc.head.php'); ?>
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
				<div class="listHead">
					<div class="csHandle">&nbsp;</div>
					<div class="csTitle"><?php echo I18n::_('Site title') ?></div>
					<div class="csName"><?php echo I18n::_('Link address') ?></div>
					<div class="csPub"><?php echo I18n::_('Is published?') ?></div>
					<div class="csClone"><?php echo I18n::_('Clone') ?></div>
					<div class="csDelete"><?php echo I18n::_('Delete') ?></div>
					<br class="clear" />
				</div>
				<ul>
					<?php
                    $i = 0;

					foreach($allSites as $sN => $s) {
                        $base_path = 'site/' . $i . '/';
						echo '<li class="xSite-' . $sN . '">';
						echo '<div class="csHandle"><span class="handle"></span></div>';
						echo '<div class="csTitle"><span class="' . $xEditSelectorSimple . ' xProperty-title xNoHTMLEntities xSite-' . $sN . ' xSiteField"' . ' data-path="' . $base_path . 'title" ' . '>' . (!empty($s['title']['value']) ? htmlspecialchars($s['title']['value']) : '') . '</span></div>';
						if ($sN) {
							echo '<div class="csName">'.$options['SITE_HOST_ADDRESS'].$options['SITE_ABS_ROOT'].'<span class="' . $xEditSelectorSimple . ' xProperty-name xNoHTMLEntities xSite-' . $sN . ' xSiteField"' . ' data-path="' . $base_path . 'name" ' . '>' . (!empty($s['name']['value']) ? htmlspecialchars($s['name']['value']) : '') . '</span></div>';
							echo '<div class="csPub"><span class="' . $xEditSelectorYesNo . ' xProperty-published xSite-' . $sN . ' xSiteField"' . ' data-path="' . $base_path . '@attributes/published" ' . '>' . (!empty($s['@attributes']['published']) ? '1' : '0') . '</span></div>';
						}else{
							echo '<div class="csName"><span>'.$options['SITE_HOST_ADDRESS'].$options['SITE_ABS_ROOT'].'</span></div>';
							echo '<div class="csPub"><span>-</span></div>';
						}

						echo '<div class="csClone"><a href="#" class="xSiteClone">'.I18n::_('clone').'</a></div>';

						if ($sN) {
							echo '<div class="csDelete"><a href="#" class="xSiteDelete">'.I18n::_('delete').'</a></div>';
						}else{
							echo '<div class="csDelete">-</div>';
						}
						echo '</li>';
                        $i++;
					}
					?>
				</ul>
				<br class="clear" />
				<a id="xCreateNewSite" class="xPanel" href="#" class="xAction-siteCreateNew"><span><?php echo I18n::_('create new site') ?></span></a>
				<br class="clear" />
				<hr />

				<div class="entry">
					<div class="caption"><?php echo I18n::_('What are multisites?') ?></div>
					<div class="value value-long">
						<?php echo I18n::_('sites_help_text') ?>
					</div>
				</div>
				<br class="clear" />
				<p>&nbsp;</p>
			</div>
		</div>
	</div>
    <?php echo BertaEditor::intercomScript() ?>
</body>
</html>
