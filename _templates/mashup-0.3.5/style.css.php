<?php
include '../../engine/inc.page.php';

$s = &$berta->template->settings;
$isResponsive = $s->get('pageLayout', 'responsive') == 'yes';

$expires = 60 * 60 * 24 * 1;	// 1 day
header('Pragma: public');
header('Cache-Control: max-age=' . $expires);
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $expires) . ' GMT');
if ($lastMod = $berta->settings->get('berta', 'lastUpdated')) {
    header('Last-Modified: ' . $lastMod);
}
header('Content-Type: text/css');

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
    max-width: <?php echo intval($s->get('pageLayout', 'contentWidth')) + intval($s->get('pageLayout', 'paddingLeft')) + intval($s->get('sideBar', 'width')) ?>px;
}

#sideColumn {
    left: <?php echo $s->get('sideBar', 'marginLeft') ?>;
    width: <?php echo $s->get('sideBar', 'width') ?>;
    <?php if($s->get('sideBar', 'transparent') == 'no') { ?>
        background-color: <?php echo $s->get('sideBar', 'backgroundColor') ?>;
    <?php } ?>
}

#sideColumn.xCentered {
    margin-left: -<?php echo (intval($s->get('pageLayout', 'contentWidth')) + intval($s->get('pageLayout', 'paddingLeft')) + intval($s->get('sideBar', 'width'))) / 2 ?>px;
}

#sideColumnTop {
    padding-top: <?php echo $s->get('sideBar', 'marginTop') ?>;
}

#sideColumnTop h1 {
    color: <?php echo $s->get('sideBar', 'color') ?>;
    font-family: <?php echo $s->getFont('sideBar') ?>;
    font-size: <?php echo $s->get('sideBar', 'fontSize') ?>;
    font-weight: <?php echo $s->get('sideBar', 'fontWeight') ?>;
    font-style: <?php echo $s->get('sideBar', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('sideBar', 'fontVariant') ?>;
    line-height: <?php echo $s->get('sideBar', 'lineHeight') ?>;
    margin-bottom: <?php echo $s->get('sideBar', 'marginBottom') ?>;
}

#sideColumnTop h1 a {
    color: <?php echo $s->get('sideBar', 'color') ?> !important;
}

#sideColumnTop li a:link, #sideColumnTop li a:visited {
    color: <?php echo $s->get('menu', 'colorLink') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationLink') ?>;
}

#sideColumnTop li a:hover {
    color: <?php echo $s->get('menu', 'colorHover') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationHover') ?>;
}

#sideColumnTop li a:active,
#sideColumnTop li.selected > a,
#sideColumnTop li.selected > span {
    color: <?php echo $s->get('menu', 'colorActive') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationActive') ?>;
}

#sideColumnTop li li a:link,
#sideColumnTop li li a:visited {
    color: <?php echo $s->get('tagsMenu', 'colorLink') ?>;
    text-decoration: <?php echo $s->get('tagsMenu', 'textDecorationLink') ?>;
}

#sideColumnTop li li a:hover {
    color: <?php echo $s->get('tagsMenu', 'colorHover') ?>;
    text-decoration: <?php echo $s->get('tagsMenu', 'textDecorationHover') ?>;
}

#sideColumnTop li li a:active,
#sideColumnTop li li.selected > a {
    color: <?php echo $s->get('tagsMenu', 'colorActive') ?>;
    text-decoration: <?php echo $s->get('tagsMenu', 'textDecorationActive') ?>;
}

#sideColumnTop ul li {
    font-family: <?php echo $s->getFont('menu') ?>;
    font-size: <?php echo $s->get('menu', 'fontSize') ?>;
    font-weight: <?php echo $s->get('menu', 'fontWeight') ?>;
    font-style: <?php echo $s->get('menu', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('menu', 'fontVariant') ?>;
    line-height: <?php echo $s->get('menu', 'lineHeight') ?>;
}

#sideColumnTop ul ul li {
    font-family: <?php echo $s->getFont('tagsMenu') ?>;
    font-size: <?php echo $s->get('tagsMenu', 'fontSize') ?>;
    font-weight: <?php echo $s->get('tagsMenu', 'fontWeight') ?>;
    font-style: <?php echo $s->get('tagsMenu', 'fontStyle') ?>;
    font-variant: <?php echo $s->get('tagsMenu', 'fontVariant') ?>;
    line-height: <?php echo $s->get('tagsMenu', 'lineHeight') ?>;
}

#firstPageMarkedEntries .xEntry {
    max-width: <?php echo $s->get('pageLayout', 'contentWidth') ?>;
}

<?php if($s->get('firstPage', 'imageHaveShadows') == 'yes') { ?>
    .firstPagePic .xGallery {
        -webkit-box-shadow: 5px 5px 2px #ccc;
        -moz-box-shadow: 5px 5px 2px #ccc;
        box-shadow: 5px 5px 2px #ccc;
    }
<?php } ?>

#mainColumnContainer {
    padding-left: <?php echo $s->get('sideBar', 'marginLeft') ?>;
}

#mainColumn {
    margin-left: <?php echo $s->get('sideBar', 'width') ?>;
    padding-top: <?php echo $s->get('pageLayout', 'paddingTop') ?>;
    padding-left: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
    padding-right: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
    max-width: <?php echo $s->get('pageLayout', 'contentWidth') ?>;
}

#mainColumn.xCentered {
    margin-left: -<?php echo (intval($s->get('pageLayout', 'contentWidth')) + intval($s->get('pageLayout', 'paddingLeft')) + intval($s->get('sideBar', 'width'))) / 2 - intval($s->get('sideBar', 'width')) ?>px;
}

.xNarrow #mainColumn.xCentered {
    margin-left: <?php echo $s->get('sideBar', 'width') ?>;
}

#pageEntries li.xEntry {
    margin-bottom: <?php echo $s->get('entryLayout', 'spaceBetween') ?>;
}

#pageEntries li.xEntry .xGalleryContainer {
    margin-bottom: <?php echo $s->get('entryLayout', 'galleryMargin') ?>;
}

#pageEntries li.xEntry .xGalleryType-slideshow .xGallery {
    margin-bottom: <?php echo $s->get('entryLayout', 'galleryNavMargin') ?>;
}

.xGalleryType-column div.xGalleryItem {
    padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
}

.xGalleryType-row .xGalleryItem {
    margin-right: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
}

#pageEntries .xGalleryContainer ul.xGalleryNav li a {
    color: <?php echo $s->get('menu', 'colorLink') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationLink') ?>;
}

#pageEntries .xGalleryContainer ul.xGalleryNav li a:hover {
    color: <?php echo $s->get('menu', 'colorHover') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationHover') ?>;
}

#pageEntries .xGalleryContainer ul.xGalleryNav li.selected a {
    color: <?php echo $s->get('menu', 'colorActive') ?>;
    text-decoration: <?php echo $s->get('menu', 'textDecorationActive') ?>;
}

.floating-banners {
    margin-left: <?php echo $s->get('sideBar', 'width') ?>;
    padding-left: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
}

.xSectionType-portfolio #pageEntries li.xEntry .xGalleryType-row .xGallery .xGalleryItem {
    padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
}


<?php if( $isResponsive ){ ?>

	#sideColumn.xCentered {
		left: auto;
		margin-left: 0;
	}

	.firstPagePic {
		position: relative;
		margin-bottom: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
	}

	#firstPageMarkedEntries .xEntry {
		max-width: <?php echo $s->get('firstPage', 'imageSizeRatio')*100 ?>%;
	}


	#firstPageMarkedEntries .xEntry .xGalleryContainer .xGallery div.xGalleryItem {
		font-size: 0;
	}

	img,
	#pageEntries li.xEntry .xGalleryContainer .xGallery,
	#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem,
	#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem .image,
	#firstPageMarkedEntries .xEntry .xGalleryContainer .xGallery,
	#firstPageMarkedEntries .xEntry .xGalleryContainer .xGallery div.xGalleryItem,
	#firstPageMarkedEntries .xEntry .xGalleryContainer .xGallery div.xGalleryItem .image
	{
		max-width: 100% !important;
		height: auto !important;
	}

	#pageEntries li.xEntry,
	#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem,
	#firstPageMarkedEntries .xEntry,
	#firstPageMarkedEntries .xEntry .xGalleryContainer .xGallery div.xGalleryItem,
	.row .column {
		-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;
	}

	#firstPageMarkedEntries.columns-2 .xEntry,
	#firstPageMarkedEntries.columns-3 .xEntry,
	#firstPageMarkedEntries.columns-4 .xEntry {
		float: left;
		padding-right: 15px;
	}

	#firstPageMarkedEntries.columns-2 .xEntry {
		width: 50%;
	}

	#firstPageMarkedEntries.columns-3 .xEntry {
		width: 33.33333%;
	}

	#firstPageMarkedEntries.columns-4 .xEntry {
		width: 25%;
	}

	#firstPageMarkedEntries.columns-2 .xEntry:nth-child(2n),
	#firstPageMarkedEntries.columns-3 .xEntry:nth-child(3n),
	#firstPageMarkedEntries.columns-4 .xEntry:nth-child(4n) {
		padding-right: 0;
	}

	#firstPageMarkedEntries.columns-2 .xEntry:nth-child(2n+1),
	#firstPageMarkedEntries.columns-3 .xEntry:nth-child(3n+1),
	#firstPageMarkedEntries.columns-4 .xEntry:nth-child(4n+1) {
		clear: left;
	}

	.vjs-poster {
		position: absolute;
		top: 0;
		left: 0;
	}

	#contentContainer {
		width: auto;
	}

	#menuToggle {
		display: none;
		width: 1.5em;
		height: auto;
		padding: 1.5em 1em;
		margin-bottom: 0.5em;
		border: 1px solid black;
		background-color: black;
	}

	#menuToggle.active {
		background-color: white;
	}

	#menuToggle span {
		position: relative;
		display: block;
	}

	#menuToggle span,
	#menuToggle span:before,
	#menuToggle span:after {
		background-color: white;
		width: 100%;
		height: 2px;
	}

	#menuToggle.active span,
	#menuToggle.active span:before,
	#menuToggle.active span:after {
		background-color: black;
	}

	#menuToggle span:before,
	#menuToggle span:after {
		position: absolute;
		margin-top: -.6em;
		content: " ";
	}

	#menuToggle span:after {
		margin-top: .6em;
	}

	#sideColumnTop ul {
		margin-bottom: 0;
	}

	.xNarrow #mainColumn.xCentered {
		margin-left: 0;
	}


	#additionalText {
		position: static;
	}

	.floating-banner {
		position: static;
		display: inline-block;
		margin: 10px 10px 10px 0;
	}

	/* larger than tablet */
	@media (min-width: 768px) {
		#pageEntries li.xEntry .xGalleryType-row .xGallery {
			max-width: inherit !important;
		}
	}

	/* small tablet */
	@media (max-width: 767px)  {

		#sideColumn {
			position: absolute;
			bottom: auto;
			left: 0;
			width: 100%;
		}

		#sideColumnTop {
			padding-left: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
		}

		#sideColumnTop > ul {
			display: none;
		}

		#sideColumnTop #multisites {
			display: block;
		}

		#sideColumnTop h1 {
			min-height: initial;
		}

		#sideColumnTop ul li {
			margin-top: 1em;
		}

		#menuToggle {
			display: inline-block;
		}

		#mainColumn {
			margin-left: 0;
		}

		#mainColumn.xCentered {
			left: auto;
			margin-left: 0;
		}

		.floating-banners {
			margin-left: 0;
		}

		#sideColumnBottom {
			padding-left: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
		}


		#firstPageMarkedEntries.columns-3 .xEntry {
			width: 50%;
		}

		#firstPageMarkedEntries.columns-4 .xEntry {
			width: 50%;
		}

		#firstPageMarkedEntries.columns-3 .xEntry:nth-child(3n+1) {
			clear: none;
		}

		#firstPageMarkedEntries.columns-3 .xEntry:nth-child(2n+1),
		#firstPageMarkedEntries.columns-4 .xEntry:nth-child(2n+1) {
			clear: left;
		}

		#firstPageMarkedEntries.columns-3 .xEntry:nth-child(2n),
		#firstPageMarkedEntries.columns-4 .xEntry:nth-child(2n) {
			padding-right: 0;
		}

		#firstPageMarkedEntries.columns-3 .xEntry:nth-child(3n) {
			padding-right: 15px;
		}

		#pageEntries li.xEntry .xGalleryType-row .xGallery .xGalleryItem {
			padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
			padding-right: 0;
		}
	}

	@media (max-width: 480px) {
		#firstPageMarkedEntries.columns-2 .xEntry,
		#firstPageMarkedEntries.columns-3 .xEntry,
		#firstPageMarkedEntries.columns-4 .xEntry {
			float: none;
			width: 100%;
			padding-right: 0;
		}
	}

<?php } ?>

<?php if(!1) { ?></style><?php } ?>
