<?php
define('AUTH_AUTHREQUIRED', true);
define('BERTA_ENVIRONMENT', 'engine');
include('inc.page.php');
$loggedIn = $berta->security->userLoggedIn;
include_once $ENGINE_ROOT . '_classes/class.bertaeditor.php';

$allSections = BertaContent::getSections();
$topPanelHTML = BertaEditor::getTopPanelHTML('seo');
$int_version = BertaEditor::$options['int_version'];

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title><?php echo $berta->settings->get('texts', 'pageTitle') ?> / <?php echo I18n::_('seo') ?></title>
<link rel="SHORTCUT ICON" href="favicon.ico"/>
<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/backend.min.css?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/editor.css.php?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
<?php include('inc.head.php'); ?>
</head>

<body class="xSettingsPageBody" x_mode="seo">
	<form name="infoForm" id="infoForm">
		<input type="hidden" name="ENGINE_ROOT" id="ENGINE_ROOT" value="<?php echo htmlspecialchars($ENGINE_ROOT) ?>" />
	</form>
	<?php echo $topPanelHTML ?>
	<div id="allContainer">
		<div id="contentContainer">

			<h1 id="allPageTitle"><?php echo I18n::_('SEO') ?></h1>

			<div id="xSeoEditor">
				<div class="listHead">
					<div class="csTitle"><?php echo I18n::_('Sections') ?></div>
					<div class="csSeoTitle"><?php echo I18n::_('Title') ?></div>
					<div class="csSeoKeywords"><?php echo I18n::_('Keywords') ?></div>
					<div class="csSeoDescription"><?php echo I18n::_('Content description') ?></div>
					<br class="clear" />
				</div>
				<ul><?php
				foreach($allSections as $sN => $s) {
					echo '<li class="xSection-' . $sN . '">';
					echo '<div class="csTitle">' . (!empty($s['title']['value']) ? htmlspecialchars($s['title']['value']) : htmlspecialchars($s['name']['value'])) . '</div>';

					echo '<div class="csSeoTitle"><span class="' . $xEditSelectorSimple . ' xProperty-seoTitle xNoHTMLEntities xSection-' . $sN . ' xSectionField">' . (!empty($s['seoTitle']['value']) ? htmlspecialchars(strip_tags($s['seoTitle']['value'])) : '') . '</span></div>';

					echo '<div class="csSeoKeywords"><span class="' . $xEditSelectorSimple . ' xProperty-seoKeywords xNoHTMLEntities xSection-' . $sN . ' xSectionField">' . (!empty($s['seoKeywords']['value']) ? htmlspecialchars(strip_tags($s['seoKeywords']['value'])) : '') . '</span></div>';

					echo '<div class="csSeoDescription"><span class="' . $xEditSelectorTA . ' xProperty-seoDescription xNoHTMLEntities xSection-' . $sN . ' xSectionField">' . (!empty($s['seoDescription']['value']) ? htmlspecialchars(strip_tags($s['seoDescription']['value'])) : '') . '</span></div>';

					echo '</li>';
				}

				?></ul><br class="clear" />

				<hr />
				<h2></h2>

				<div class="entry">
					<div class="caption"><?php echo I18n::_('What is SEO?') ?></div>
					<div class="value value-long">
						<?php echo I18n::_('seo_help_text') ?>
					</div>
				</div>
				<br class="clear" />
				<p>&nbsp; </p>
			</div>
		</div>
	</div>
    <?php echo BertaEditor::intercomScript() ?>
</body>
</html>
