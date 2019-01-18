<?php
header("Content-Type: text/css");
include('../../engine/inc.page.php');

$s =& $berta->template->settings;

if(!1) { ?><style type="text/css"><?php } ?>

body {
	color: <?php echo $s->get('generalFontSettings', 'color') ?>;
	font-family: <?php echo $s->getFont('generalFontSettings') ?>;
	font-size: <?php echo $s->get('generalFontSettings', 'fontSize') ?>;
	font-weight: <?php echo $s->get('generalFontSettings', 'fontWeight') ?>;
	font-style: <?php echo $s->get('generalFontSettings', 'fontStyle') ?>;
	font-variant: <?php echo $s->get('generalFontSettings', 'fontVariant') ?>;
	line-height: <?php echo $s->get('generalFontSettings', 'lineHeight') ?>;

	background-color: <?php echo $s->get('background', 'backgroundColor') ?>;
	<?php if($s->get('background', 'backgroundImageEnabled') == 'yes') { ?>
		<?php if($s->get('background', 'backgroundImage')) { ?>
			background-image:url(<?php echo Berta::$options['MEDIA_ABS_ROOT'] . $s->get('background', 'backgroundImage') ?>);
		<?php } ?>
		background-repeat: <?php echo $s->get('background', 'backgroundRepeat') ?>;
		background-position: <?php echo $s->get('background', 'backgroundPosition') ?>;
		background-attachment: <?php echo $s->get('background', 'backgroundAttachment') ?>;
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
a:active {
	color: <?php echo $s->get('links', 'colorActive') ?>;
	text-decoration: <?php echo $s->get('links', 'textDecorationActive') ?>;
}

#allContainer.xCentered {
    max-width: <?php echo intval($s->get('pageLayout', 'leftColumnWidth')) + intval($s->get('pageLayout', 'contentWidth')) + intval($s->get('pageLayout', 'paddingLeft')) ?>px;
}

#sideColumn {
    width: <?php echo $s->get('pageLayout', 'leftColumnWidth') ?>;
}

#sideColumn.xCentered {
    margin-left: -<?php echo (intval($s->get('pageLayout', 'leftColumnWidth')) + intval($s->get('pageLayout', 'contentWidth')) + intval($s->get('pageLayout', 'paddingLeft'))) / 2 ?>px;
}

#sideColumnTop h1 {
    color: <?php echo $s->get('pageHeading', 'color') ?>;
    font-family: <?php echo $s->getFont('pageHeading') ?>;
    font-size: <?php echo $s->get('pageHeading', 'fontSize') ?>;
    font-weight: <?php echo $s->get('pageHeading', 'fontWeight') ?>;
    font-style: <?php echo $s->get('pageHeading', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('pageHeading', 'fontVariant') ?>;
    line-height: <?php echo $s->get('pageHeading', 'lineHeight') ?>;
    margin-top: <?php echo $s->get('pageHeading', 'marginTop') ?>;
    margin-bottom: <?php echo $s->get('pageHeading', 'marginBottom') ?>;
}

#sideColumnTop h1 a,
#sideColumnTop h1 a:link,
#sideColumnTop h1 a:visited,
#sideColumnTop h1 a:hover,
#sideColumnTop h1 a:active {
    color: <?php echo $s->get('pageHeading', 'color') ?> !important;
}

#sideColumnTop a:link,
#sideColumnTop a:visited {
    color: <?php echo $s->get('menu', 'colorLink') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationLink') ?>;
}

#sideColumnTop a:hover {
    color: <?php echo $s->get('menu', 'colorHover') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationHover') ?>;
}

#sideColumnTop a:active,
#sideColumnTop li.selected > a,
#sideColumnTop li.selected > span {
    color: <?php echo $s->get('menu', 'colorActive') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationActive') ?>;
}

#mainColumn {
    padding-top: <?php echo $s->get('pageLayout', 'paddingTop') ?>;
    margin-left: <?php echo $s->get('pageLayout', 'leftColumnWidth') ?>;
    padding-left: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
    padding-right: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
    max-width: <?php echo $s->get('pageLayout', 'contentWidth') ?>;
}

#mainColumn.xCentered {
    margin-left: -<?php echo (intval($s->get('pageLayout', 'leftColumnWidth')) + intval($s->get('pageLayout', 'contentWidth')) + intval($s->get('pageLayout', 'paddingLeft'))) / 2 - intval($s->get('pageLayout', 'leftColumnWidth')) ?>px;
}

.xNarrow #mainColumn.xCentered {
    margin-left: <?php echo $s->get('pageLayout', 'leftColumnWidth') ?>;
}

ol#pageEntries li.xEntry {
    margin-bottom: <?php echo $s->get('entryLayout', 'spaceBetween') ?>;
}

ol#pageEntries li.xEntry .xGalleryContainer {
    margin-bottom: <?php echo $s->get('entryLayout', 'galleryMargin') ?>;
}

ol#pageEntries li.xEntry .xGalleryType-slideshow .xGallery {
    margin-bottom: <?php echo $s->get('entryLayout', 'galleryNavMargin') ?>;
}

ol#pageEntries li.xEntry .xGalleryType-column .xGalleryItem {
    padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
}

ol#pageEntries li.xEntry .xGalleryType-row .xGalleryItem {
    margin-right: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
}

ol#pageEntries .xGalleryContainer ul.xGalleryNav li a {
    color: <?php echo $s->get('menu', 'colorLink') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationLink') ?>;
}

ol#pageEntries .xGalleryContainer ul.xGalleryNav li a:hover {
    color: <?php echo $s->get('menu', 'colorHover') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationHover') ?>;
}

ol#pageEntries .xGalleryContainer ul.xGalleryNav li.selected a {
    color: <?php echo $s->get('menu', 'colorActive') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationActive') ?>;
}

.floating-banners {
    margin-left: <?php echo $s->get('pageLayout', 'leftColumnWidth') ?>;
    padding-left: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
}

/* small tablet */
@media (max-width: 767px)  {
    .bt-responsive #sideColumn {
        padding-left: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
    }

    .bt-responsive #sideColumnBottom {
        padding-left: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
    }

    .bt-responsive ol#pageEntries li.xEntry .xGalleryType-row .xGallery .xGalleryItem {
        padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
    }
}

<?php if(!1) { ?></style><?php } ?>
