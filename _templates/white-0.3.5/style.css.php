<?php
header("Content-Type: text/css");
include('../../engine/inc.page.php');

$s =& $berta->template->settings;
$isResponsive = $s->get('pageLayout', 'responsive')=='yes';


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

<?php if( $isResponsive ){ ?>

	#sideColumn.xCentered {
		left: auto;
		margin-left: 0;
	}

	img,
	ol#pageEntries li.xEntry .xGalleryContainer .xGallery,
	ol#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem,
	ol#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem .image {
		max-width: 100% !important;
		height: auto !important;
	}

	ol#pageEntries li.xEntry,
	ol#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem,
	.row .column {
		-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;
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
		ol#pageEntries li.xEntry .xGalleryType-row .xGallery {
			max-width: inherit !important;
		}
	}

	/* small tablet */
	@media (max-width: 767px)  {

		#sideColumn {
			position: absolute;
			bottom: auto;
			left: 0;
			padding-left: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
		}

		#sideColumnTop {
			padding-left: 0;
		}

		#sideColumnTop h1 {
			min-height: initial;
		}

		#sideColumnTop  > ul {
			display: none;
		}

		#sideColumnTop #multisites {
			display: block;
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

		.xNarrow #mainColumn.xCentered {
			margin-left: 0;
		}

		.floating-banners {
			margin-left: 0;
		}

		#sideColumnBottom {
			padding-left: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
		}

		ol#pageEntries li.xEntry .xGalleryType-row .xGallery .xGalleryItem {
			padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
			padding-right: 0;
		}
	}

<?php } ?>

<?php if(!1) { ?></style><?php } ?>
