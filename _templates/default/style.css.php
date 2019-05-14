<?php
include '../../engine/inc.page.php';

$s = &$berta->template->settings;

$expires = 60 * 60 * 24 * 1;	// 1 day
header('Pragma: public');
header('Cache-Control: max-age=' . $expires);
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $expires) . ' GMT');
if ($lastMod = $berta->settings->get('berta', 'lastUpdated')) {
    header('Last-Modified: ' . $lastMod);
}
header('Content-Type: text/css');

$contentFloat = substr($s->get('pageLayout', 'contentAlign'), -4) == 'left' ? 'left' : 'right';
$contentTextAlign = strpos($s->get('pageLayout', 'contentAlign'), 'justify') === 0 ? 'justify' : $s->get('pageLayout', 'contentAlign');

if(!1) { ?><style type="text/css"><?php } ?>

body {
	color: <?php echo $s->get('generalFontSettings', 'color') ?>;
	font-family: <?php echo $s->getFont('generalFontSettings') ?>;
	font-size: <?php echo $s->get('generalFontSettings', 'fontSize') ?>;
	font-weight: <?php echo $s->get('generalFontSettings', 'fontWeight') ?>;
	font-style: <?php echo $s->get('generalFontSettings', 'fontStyle') ?>;
	font-variant: <?php echo $s->get('generalFontSettings', 'fontVariant') ?>;
	line-height: <?php echo $s->get('generalFontSettings', 'lineHeight') ?>;
	text-align: <?php echo $contentFloat ?>;

	background-color: <?php echo $s->get('background', 'backgroundColor') ?>;
	<?php if($s->get('background', 'backgroundImageEnabled') == 'yes' && ($bgAttachment = $s->get('background', 'backgroundAttachment')) != 'fill') { ?>
		<?php if($s->get('background', 'backgroundImage')) { ?>
			background-image:url(<?php echo Berta::$options['MEDIA_ABS_ROOT'] . $s->get('background', 'backgroundImage') ?>);
		<?php } ?>
		background-repeat: <?php echo $s->get('background', 'backgroundRepeat') ?>;
		background-position: <?php echo $s->get('background', 'backgroundPosition') ?>;
		background-attachment: <?php echo $bgAttachment ?>;
	<?php } ?>
}

a:link {
	color: <?php echo $s->get('links', 'colorLink') ?>;
	text-decoration: <?php echo $s->get('links', 'textDecorationLink') ?>;
}

a:visited {
	color: <?php echo $s->get('links', 'colorVisited') ?>;
	text-decoration: <?php echo $s->get('links', 'textDecorationVisited') ?>;
}

a:hover {
	color: <?php echo $s->get('links', 'colorHover') ?>;
	text-decoration: <?php echo $s->get('links', 'textDecorationHover') ?>;
}

.social-icon path {
    fill: <?php echo $s->get('socialMediaLinks', 'color') ?>;
}

a:active,
div#siteTopMenu ul li.selected span {
	color: <?php echo $s->get('links', 'colorActive') ?>;
	text-decoration: <?php echo $s->get('links', 'textDecorationActive') ?>;
}

h1 {
	color: <?php echo $s->get('pageHeading', 'color') ?>;
	font-family: <?php echo $s->getFont('pageHeading') ?>;
	font-size: <?php echo $s->get('pageHeading', 'fontSize') ?>;
	font-weight: <?php echo $s->get('pageHeading', 'fontWeight') ?>;
	font-style: <?php echo $s->get('pageHeading', 'fontStyle') ?>;
	font-variant: <?php echo $s->get('pageHeading', 'fontVariant') ?>;
	line-height: <?php echo $s->get('pageHeading', 'lineHeight') ?>;
	float: <?php echo $contentFloat ?>;
	margin: <?php echo $s->get('pageHeading', 'margin') ?>;
}

#contentContainer h1 a,
#contentContainer h1 a:link,
#contentContainer h1 a:visited,
#contentContainer h1 a:hover,
#contentContainer h1 a:active {
	color: <?php echo $s->get('pageHeading', 'color') ?>;
}

#contentContainer {
	width: <?php echo $s->get('pageLayout', 'contentWidth') ?>;
	padding: <?php echo $s->get('pageLayout', 'bodyMargin') ?>;
	margin-left: <?php echo $s->get('pageLayout', 'contentPosition') == 'left' ? 0 : 'auto' ?>;
	margin-right: <?php echo $s->get('pageLayout', 'contentPosition') == 'right' ? 0 : 'auto' ?>;
}

#siteTopMenu {
    padding: <?php echo $s->get('pageLayout', 'siteMenuMargin') ?>;
}

#siteTopMenu ul {
    float: <?php echo $contentFloat ?>;
}

#siteTopMenu ul li a:link,
#siteTopMenu ul li a:visited {
    color: <?php echo $s->get('menu', 'colorLink') ?>;
}

#siteTopMenu ul li a:active,
#siteTopMenu ul li.selected > span,
#siteTopMenu ul li.selected > a {
    color: <?php echo $s->get('menu', 'colorActive') ?>;
}

#siteTopMenu ul li a:hover {
    color: <?php echo $s->get('menu', 'colorHover') ?>;
}

#siteTopMenu ul li.selected span.separator {
    color: <?php echo $s->get('generalFontSettings', 'color') ?>;
}

#siteTopMenu #mainMenu {
    padding: <?php echo $s->get('menu', 'margin') ?>;
}

#siteTopMenu #mainMenu li {
    font-family: <?php echo $s->getFont('menu') ?>;
    font-size: <?php echo $s->get('menu', 'fontSize') ?>;
    font-weight: <?php echo $s->get('menu', 'fontWeight') ?>;
    font-style: <?php echo $s->get('menu', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('menu', 'fontVariant') ?>;
    line-height: <?php echo $s->get('menu', 'lineHeight') ?>;
}

#siteTopMenu #mainMenu li .separator {
    padding-left: <?php echo $s->get('menu', 'separatorDistance') ?>;
    padding-right: <?php echo $s->get('menu', 'separatorDistance') ?>;
}

#siteTopMenu #subMenu {
    clear: <?php echo $contentFloat ?>;
    padding: <?php echo $s->get('subMenu', 'margin') ?>;
}

#siteTopMenu #subMenu li {
    font-family: <?php echo $s->getFont('subMenu') ?>;
    font-size: <?php echo $s->get('subMenu', 'fontSize') ?>;
    font-weight: <?php echo $s->get('subMenu', 'fontWeight') ?>;
    font-style: <?php echo $s->get('subMenu', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('subMenu', 'fontVariant') ?>;
    line-height: <?php echo $s->get('subMenu', 'lineHeight') ?>;
}

#siteTopMenu #subMenu li .separator {
    padding-left: <?php echo $s->get('subMenu', 'separatorDistance') ?>;
    padding-right: <?php echo $s->get('subMenu', 'separatorDistance') ?>;
}

#pageEntries {
    margin: <?php echo $contentFloat == 'left' ? '0' : '0 0 0 auto' ?>;
}

#pageEntries li.xEntry {
    margin: <?php echo $s->get('entryLayout', 'margin') ?>;
}

#pageEntries li.xEntry h2 {
    float: <?php echo $contentFloat ?>;
    color: <?php echo $s->get('entryHeading', 'color') ?>;
    font-family: <?php echo $s->getFont('entryHeading') ?>;
    font-size: <?php echo $s->get('entryHeading', 'fontSize') ?>;
    font-weight: <?php echo $s->get('entryHeading', 'fontWeight') ?>;
    font-style: <?php echo $s->get('entryHeading', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('entryHeading', 'fontVariant') ?>;
    line-height: <?php echo $s->get('entryHeading', 'lineHeight') ?>;
    margin: <?php echo $s->get('entryHeading', 'margin') ?>;
}

#pageEntries li.xEntry p.shortDesc {
    clear: <?php echo $contentFloat ?>;
}

#pageEntries li.xEntry .xGalleryContainer {
    clear: <?php echo $contentFloat ?>;
    margin: <?php echo $contentFloat ? '0' : '0 0 0 auto' ?>;
}

#pageEntries li.xEntry .xGalleryContainer .xGallery {
    margin: <?php echo $s->get('entryLayout', 'galleryMargin') ?>;
}

#pageEntries li.xEntry .xGalleryType-column .xGalleryItem {
    padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
}

#pageEntries li.xEntry .xGalleryType-row .xGalleryItem {
    margin-right: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
}

#pageEntries .xGalleryContainer ul.xGalleryNav li {
    float: <?php echo $contentFloat ?>;
    padding: <?php echo $contentFloat ? '0 5px 0 0' : '0 0 0 5px' ?>;
}

#pageEntries li.xEntry .entryText {
    float: <?php echo $contentFloat ?>;
    text-align: <?php echo $contentTextAlign ?>;
}

#pageEntries li.xEntry .entryContent {
    color: <?php echo $s->get('entryFooter', 'color') ?>;
    font-family: <?php echo $s->getFont('entryFooter') ?>;
    font-size: <?php echo $s->get('entryFooter', 'fontSize') ?>;
    font-weight: <?php echo $s->get('entryFooter', 'fontWeight') ?>;
    font-style: <?php echo $s->get('entryFooter', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('entryFooter', 'fontVariant') ?>;
    line-height: <?php echo $s->get('entryFooter', 'lineHeight') ?>;
}

#pageEntries li.xEntry .entryContent table {
    float: <?php echo $contentFloat ?>;
}

#pageEntries li.xEntry .entryContent .items {
    float: <?php echo $contentFloat ?>;
}

#pageEntries li.xEntry .entryContent p.itm {
    float: <?php echo $contentFloat ?>;
}

#pageEntries li.xEntry .entryContent .tagsList div {
    float: <?php echo $contentFloat ?> !important;
}

.bt-responsive #contentContainer {
    max-width: <?php echo $s->get('pageLayout', 'contentWidth') ?>;
}


/* small tablet */
@media (max-width: 767px)  {
    .bt-responsive #pageEntries li.xEntry .xGalleryType-row .xGallery .xGalleryItem {
        padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
    }
}

<?php if(!1) { ?></style><?php } ?>
