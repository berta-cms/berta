<?php

$SITE_ROOT = '../../';
$IS_CSS_FILE = true;
include('../../engine/inc.page.php');
$s =& $berta->template->settings;
$isEngineView = $berta->security->userLoggedIn;
$isResponsive = $s->get('pageLayout', 'responsive')=='yes';

$expires= 60 * 60 * 24 * 1;	// 1 day
header('Pragma: public');
header('Cache-Control: max-age=' . $expires);
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $expires) . ' GMT');
if($lastMod = $berta->settings->get('berta', 'lastUpdated')) {
	header('Last-Modified: ' . $lastMod);
}
header("Content-Type: text/css");


if(!1) { ?><style type="text/css"><?php } ?>

html, body {
	width: 100%;
	height: 100%;
}

body {
	background-color: #fff;
	color: <?php echo $s->get('generalFontSettings', 'color') ?>;
	font-family: <?php echo $s->getFont('generalFontSettings') ?>;
	font-size: <?php echo $s->get('generalFontSettings', 'fontSize') ?>;
	font-weight: <?php echo $s->get('generalFontSettings', 'fontWeight') ?>;
	font-style: <?php echo $s->get('generalFontSettings', 'fontStyle') ?>;
	font-variant: <?php echo $s->get('generalFontSettings', 'fontVariant') ?>;
	line-height: <?php echo $s->get('generalFontSettings', 'lineHeight') ?>;

	text-align: left;

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
	/*border: <?php echo $s->get('links', 'border:link') ?>;*/
}
a:visited {
	color: <?php echo $s->get('links', 'colorVisited') ?>;
	text-decoration: <?php echo $s->get('links', 'textDecorationVisited') ?>;
	/*border: <?php echo $s->get('links', 'border:visited') ?>;*/
}
a:hover {
	color: <?php echo $s->get('links', 'colorHover') ?>;
	text-decoration: <?php echo $s->get('links', 'textDecorationHover') ?>;
	/*border: <?php echo $s->get('links', 'border:hover') ?>;*/
}
a:active {
	color: <?php echo $s->get('links', 'colorActive') ?>;
	text-decoration: <?php echo $s->get('links', 'textDecorationActive') ?>;
	/*border: <?php echo $s->get('links', 'border:active') ?>;*/
}

a img { border: none; }

.mess {
	<?php if( !$isResponsive ){ ?>
		position: absolute !important;
	<?php } ?>
}

.xCenteringGuide {
	<?php if($s->get('pageLayout', 'centeringGuidesColor') == 'dark') { ?>
		background-color: rgba(0,0,0,0.5);
	<?php } else { ?>
		background-color: rgba(255,255,255,0.5);
	<?php } ?>
	width: <?php echo $s->get('pageLayout', 'centeredWidth') ?>;
	position: fixed;
	height: 100%;
}

#allContainer {
	position: relative;
	margin: 0;
	padding: 0;
	min-height: 20px;
}


#contentContainer,
.contentContainer {
	position: relative;
	width: 100%;
}
	#contentContainer.xCentered,
	.contentContainer.xCentered {
		margin: 0 auto;
		width: <?php echo $s->get('pageLayout', 'centeredWidth') ?>;
	}
	#contentContainer.xResponsive,
	.contentContainer.xResponsive {
		width: auto;
		max-width: <?php echo $s->get('pageLayout', 'centeredWidth') ?>;
	}

#contentContainer h1,
.contentContainer h1 {
	padding: 0;
	margin: 0;
	z-index: 50000;
	color: <?php echo $s->get('heading', 'color') ?>;
	font-family: <?php echo $s->getFont('heading') ?>;
	font-size: <?php echo $s->get('heading', 'fontSize') ?>;
	font-weight: <?php echo $s->get('heading', 'fontWeight') ?>;
	font-style: <?php echo $s->get('heading', 'fontStyle') ?>;
	font-variant: <?php echo $s->get('heading', 'fontVariant') ?>;
	line-height: <?php echo $s->get('heading', 'lineHeight') ?>;
	<?php if( !$isResponsive ){ ?>
	position: <?php echo $s->get('heading', 'position') ?> !important;
	<?php } ?>
}
	h1 a {
		color: <?php echo $s->get('heading', 'color') ?> !important;
		text-decoration: none;
	}

#multisites {
	list-style: none;
	padding: 0;
	margin: 0;
	float: right;
	z-index: 100000;
}

#multisites li {
	display: inline-block;
	margin: 0 10px 10px 10px;
}


nav ul{
	list-style: none;
	padding: 0;
	margin: 0;
}

.menuItem {
	z-index: 45000;
	font-family: <?php echo $s->getFont('menu') ?>;
	font-size: <?php echo $s->get('menu', 'fontSize') ?>;
	font-weight: <?php echo $s->get('menu', 'fontWeight') ?>;
	font-style: <?php echo $s->get('menu', 'fontStyle') ?>;
	font-variant: <?php echo $s->get('menu', 'fontVariant') ?>;
	line-height: <?php echo $s->get('menu', 'lineHeight') ?>;
	white-space: nowrap;
	<?php if( !$isResponsive ){ ?>
		position: <?php echo $s->get('menu', 'position') ?> !important;
	<?php } ?>
}
	.menuItem a:link, .menuItem a:visited {
		color: <?php echo $s->get('menu', 'colorLink') ?>;
		text-decoration: <?php echo $s->get('menu', 'textDecorationLink') ?>;
	}
	.menuItem a:hover, .menuItem a:active {
		color: <?php echo $s->get('menu', 'colorHover') ?>;
		text-decoration: <?php echo $s->get('menu', 'textDecorationHover') ?>;
	}
	.menuItemSelected>a,
	.menuItemSelected>span {
		color: <?php echo $s->get('menu', 'colorActive') ?> !important;
		text-decoration: <?php echo $s->get('menu', 'textDecorationActive') ?> !important;
	}
	.menuItemSelected>span {
		cursor: text;
	}

	.menuItem ul {
		list-style: none;
		margin: 0;
		padding: 0;
		position: relative;
		left: <?php echo $s->get('tagsMenu', 'x') ?>;
		top: <?php echo $s->get('tagsMenu', 'y') ?>;
	}
		.menuItem li {
			margin: 0;
			padding: 0;
			font-family: <?php echo $s->getFont('tagsMenu') ?>;
			font-size: <?php echo $s->get('tagsMenu', 'fontSize') ?>;
			font-weight: <?php echo $s->get('tagsMenu', 'fontWeight') ?>;
			font-style: <?php echo $s->get('tagsMenu', 'fontStyle') ?>;
			font-variant: <?php echo $s->get('tagsMenu', 'fontVariant') ?>;
			line-height: <?php echo $s->get('tagsMenu', 'lineHeight') ?>;
		}

			.menuItem li a:link, .menuItem li a:visited {
				color: <?php echo $s->get('tagsMenu', 'colorLink') ?>;
				text-decoration: <?php echo $s->get('tagsMenu', 'textDecorationLink') ?>;
			}
			.menuItem li a:hover, .menuItem li a:active {
				color: <?php echo $s->get('tagsMenu', 'colorHover') ?>;
				text-decoration: <?php echo $s->get('tagsMenu', 'textDecorationHover') ?>;
			}
			.menuItem li.selected>a {
				color: <?php echo $s->get('tagsMenu', 'colorActive') ?> !important;
				text-decoration: <?php echo $s->get('tagsMenu', 'textDecorationActive') ?> !important;
			}



.cover {
	position: relative;
}

.cover .contentContainer {
	-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;
	position: relative;
	top: 50%;
	transform: translateY(-50%);
}

.coverGallery {
	position: absolute;
	height: 100%;
	width: 100%;
}

.coverGallery .slide {
	position: absolute;
	height: 100%;
	width: 100%;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	opacity: 0;
}

#pageEntries {
	position: relative;
	margin: 0;
	padding: 0;
	list-style: none;
	width: 100%;
}
	#pageEntries .xEntry {
		position: relative;
		<?php if( $isResponsive ){ ?>
			min-height: 1px;
			-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;
		<?php } else { ?>
			max-width: <?php echo $s->get('entryLayout', 'contentWidth') ?>;
			min-width: 150px;
			padding: 0;
			clear: both;
		<?php } ?>
		list-style:none;
		margin-bottom: <?php echo $s->get('entryLayout', 'spaceBetween') ?>;
	}

	#pageEntries.columns-2 .xEntry,
	#pageEntries.columns-3 .xEntry,
	#pageEntries.columns-4 .xEntry {
		float: left;
	}

	#pageEntries.columns-2 .xEntry {
		width: 50%;
	}

	#pageEntries.columns-3 .xEntry {
		width: 33.33333%;
	}

	#pageEntries.columns-4 .xEntry {
		width: 25%;
	}

	#pageEntries.columns-2 .xEntry:nth-child(2n+1),
	#pageEntries.columns-3 .xEntry:nth-child(3n+1),
	#pageEntries.columns-4 .xEntry:nth-child(4n+1) {
		clear: left;
	}

	#pageEntries .xEntry h2 {
				color: <?php echo $s->get('entryHeading', 'color') ?>;
				font-family: <?php echo $s->getFont('entryHeading') ?>;
				font-size: <?php echo $s->get('entryHeading', 'fontSize') ?>;
				font-weight: <?php echo $s->get('entryHeading', 'fontWeight') ?>;
				font-style: <?php echo $s->get('entryHeading', 'fontStyle') ?>;
				font-variant: <?php echo $s->get('entryHeading', 'fontVariant') ?>;
				line-height: <?php echo $s->get('entryHeading', 'lineHeight') ?>;
				margin: <?php echo $s->get('entryHeading', 'margin') ?>;
	}

	#pageEntries .xEntry .xGalleryContainer {
		position: relative;
		clear: both;
		padding: 0;
		margin-bottom: <?php echo $s->get('entryLayout', 'galleryMargin') ?>;
	}
	#pageEntries .xEntry .xGalleryType-slideshow {}
	#pageEntries .xEntry .xGalleryType-row {}
    #pageEntries .xEntry .xGalleryType-pile {}
    #pageEntries .xEntry .xGalleryType-column {}

		#pageEntries .xEntry .xGalleryContainer .xGallery {
			position: relative;
			display: block;
		}
		#pageEntries .xEntry .xGalleryType-slideshow .xGallery {
			margin-bottom: <?php echo $s->get('entryLayout', 'galleryNavMargin') ?>;
		}

            #pageEntries .xEntry .xGalleryType-column .xGalleryItem {
                padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
            }

			#pageEntries .xEntry .xGalleryType-row .xGalleryItem {
				position: relative;
				float: left;
				padding-right: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
			}

		#pageEntries .xEntry .xGalleryContainer ul.xGalleryNav {
			display: block;
			position: relative;
			clear: both;
			margin: 0 0 2px;
			padding: 0;
			list-style: none;
			height: 18px;
		}
			#pageEntries .xEntry .xGalleryContainer ul.xGalleryNav li {
				display: block;
				float: left;
				list-style: none;
				line-height: 96%;
				margin: 0;
			}
				#pageEntries .xEntry .xGalleryContainer ul.xGalleryNav .xGalleryImageCaption { display: none; }
				#pageEntries .xEntry .xGalleryContainer ul.xGalleryNav a {
					display: block;
					float: left;
					padding: 1px 5px 1px;
					color: <?php echo $s->get('menu', 'colorLink') ?>;
					text-decoration: <?php echo $s->get('menu', 'textDecorationLink') ?>;
					outline: none;
				}

				.xGalleryImageCaption { display: none; }

			#pageEntries .xGalleryContainer ul.xGalleryNav li a:hover {
				color: <?php echo $s->get('menu', 'colorHover') ?>;
				text-decoration: <?php echo $s->get('menu', 'textDecorationHover') ?>;
			}
			#pageEntries .xGalleryContainer ul.xGalleryNav li.selected a {
				color: <?php echo $s->get('menu', 'colorActive') ?>;
				text-decoration: <?php echo $s->get('menu', 'textDecorationActive') ?>;
			}










	#pageEntries .xEntry .entryText {
		position: relative;
		clear: both;
		margin: 0 0 6px;
	}
		#pageEntries .xEntry .entryText p {
			margin: 0 0 6px;
		}

		/* disqus fix */
		#pageEntries #dsq-content ul, #pageEntries #dsq-content li {
		    list-style-position: outside;
		    list-style-type: none;
		    margin: 0;
		    padding: 0;
		}

		#pageEntries .xEntry .entryText ul {
			margin: 0 0 6px;
			padding: 0 0 0 15px;
		}
			#pageEntries .xEntry .entryText ul li {
				list-style-type: circle;
				margin: 0 0 3px 0;
				padding: 0;
			}
		#pageEntries .xEntry .entryText ol {
			margin: 0 0 6px;
			padding: 0 0 0 15px;
		}
			#pageEntries .xEntry .entryText ol li {
				margin: 0 0 3px 0;
				padding: 0;
				list-style-type: decimal;
			}


	#pageEntries li.xEntry .entryTags {
		position: relative;
		clear: both;
	}





	#additionalText {
		z-index: 49000;
		min-width: 140px;
	}
		#additionalText p { margin: 0; padding: 0; }


	.floating-banner {
		position: absolute;
		z-index: 3000;
	}



#bottom {
	position: absolute;
	padding-top: 20px;
	bottom: 0;
	font-size: 10px;
	right: 20px;
	left: 20px;
	z-index: 100000;
}

	#additionalFooterText {
		float: left;
		margin-left: 10px;
		width: 45%;
	}

	#bertaCopyright, #userCopyright {
		float: right;
		margin: 0 10px 0 0;
		padding: 10px 0 10px 0;
	}


::-moz-selection {
   background:#000000;
   color:#ffffff;
}

::selection{
   background:#000000;
   color:#ffffff;
}

.hidden {
	display: none;
}

.xFixed {
	position: fixed !important;
}


/* section background --------------------------------------*/

#xBackgroundContainer #xBackground {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
    #xBackground #xBackgroundLoader {
        width: 31px;
        height: 31px;
        position: absolute;
        background: url(layout/loader_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.gif) no-repeat;
        left: 50%; top: 50%;
        margin-left: -15px; margin-top: -15px;
        display: none;
    }

    #xBackground .visual-list {
	    display: none;
	}
	#xBackground .visual-image {
	    position: absolute;
	    top: 0; right: 0; bottom: 0; left: 0;
	    overflow: hidden;
	}
	    #xBackground .visual-image .bg-element {
	    	position: absolute;
	    	display: block;
	    }
	#xBackground .visual-caption {
	    position: absolute;
	    width: <?php echo $s->get('entryLayout', 'contentWidth') ?>;
	    text-align: left;
	    top: 50%; left: 50%;
	    margin-left: -<?php echo $s->get('entryLayout', 'contentWidth')/2 ?>px;
	    padding: 0 10px;
	}
	    #xBackground .visual-caption * {
	    	background: inherit !important;
	    	color: inherit !important;
	    	background-color: transparent !important;
	    }

    #xBackground #xBackgroundRight,
    #xBackground #xBackgroundLeft {
        position: absolute;
        width: 50%;
        height: 100%;
    }
    #xBackground #xBackgroundRight {
        right: 0;
        <?php if (preg_match('/msie/i',$DEVICE_USER_AGENT)) { ?>
            cursor: url(layout/arrow_right_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.cur), pointer;
        <?php } else { ?>
            cursor: url(layout/arrow_right_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.gif), pointer;
        <?php } ?>
    }
    #xBackground #xBackgroundLeft {
        left: 0;
        <?php if (preg_match('/msie/i',$DEVICE_USER_AGENT)) { ?>
            cursor: url(layout/arrow_left_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.cur), pointer;
        <?php } else { ?>
            cursor: url(layout/arrow_left_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.gif), pointer;
        <?php } ?>
    }

    #xBackground #xBackgroundRightCounter,
    #xBackground #xBackgroundLeftCounter {
        position: absolute;
        color: <?php echo $s->get('heading', 'color') ?>;
        font-family: <?php echo $s->getFont('heading') ?>;
        font-size: <?php echo $s->get('heading', 'fontSize') ?>;
        font-weight: <?php echo $s->get('heading', 'fontWeight') ?>;
        font-style: <?php echo $s->get('heading', 'fontStyle') ?>;
        font-variant: <?php echo $s->get('heading', 'fontVariant') ?>;
        line-height: <?php echo $s->get('heading', 'lineHeight') ?>;
    }
        #xBackground #xBackgroundRightCounter .counterContent {
            position: absolute;
            right: 8px;
            <?php if (preg_match('/msie/i',$DEVICE_USER_AGENT)) { ?>
                cursor: url(layout/arrow_right_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.cur), pointer;
            <?php } else { ?>
                cursor: url(layout/arrow_right_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.gif), pointer;
            <?php } ?>
        }
        #xBackground #xBackgroundLeftCounter .counterContent {
            position: absolute;
            left: 26px;
            <?php if (preg_match('/msie/i',$DEVICE_USER_AGENT)) { ?>
                cursor: url(layout/arrow_left_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.cur), pointer;
            <?php } else { ?>
                cursor: url(layout/arrow_left_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.gif), pointer;
            <?php } ?>
        }

#xBackgroundContainer #xBackgroundNext,
#xBackgroundContainer #xBackgroundPrevious {
	position: fixed;
	width: 24px;
	z-index: 1000;
	top: 50%;
	margin-top: -12px;
	visibility: visible;
}
#xBackgroundContainer #xBackgroundNext { right: 20px; }
#xBackgroundContainer #xBackgroundPrevious { left: 20px; }
	#xBackgroundNext a,
	#xBackgroundPrevious a {
		background: url(layout/bg_nav_buttons_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.png);
		width: 24px;
		height: 24px;
		display: block;
	}
	#xBackgroundNext a { background-position: -24px 0px; }
	#xBackgroundPrevious a { background-position: 0px 0px; }
	#xBackgroundNext a span,
	#xBackgroundPrevious a span { display: none; }

#xGridView {
	top: 100px;
	padding-bottom: 100px;
	left: <?php echo (100 - $s->get('grid', 'contentWidth'))/2 ?>%;
	right: <?php echo (100 - $s->get('grid', 'contentWidth'))/2 ?>%;
	width: <?php echo $s->get('grid', 'contentWidth') ?>;
	visibility: hidden;
}
	#xGridView .box {
		float: left;
		margin: 5px;
	}

#xGridViewTriggerContainer {
	width: 22px;
	position: absolute;
	right: 12px;
	top: 12px;
	margin-right: 10px;
	display: block;
}
	#xGridViewTriggerContainer a {
		width: 24px;
		height: 24px;
		background: url('layout/bg_nav_buttons_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.png');
		background-position: -48px 0px;
		display: block;
	}

		#xGridViewTriggerContainer a:hover {
			background-position: -48px -24px;
		}

		#xGridViewTriggerContainer a span {
			display: none;
		}


.iframeWrapper  {
	position: relative;
	padding-bottom: 56.25%;
}

.iframeWrapper iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100% !important;
}

#xBackgroundVideoEmbed {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
}

#xBackgroundVideoEmbed.fillWindow .iframeWrapper {
	padding-bottom: 0 !important;
}

#xBackgroundVideoEmbed.fillWindow .iframeWrapper iframe {
	max-width: none !important;
}


/* responsive row/column classes */
.row {
	width: 100%;
	clear: both;
	vertical-align: baseline;
	zoom: 1;
}

.row:before,
.row:after { content: ""; display: table; }
.row:after { clear: both; }

.row .column {
	float: left;
	position: relative;
	min-height: 1px;
	vertical-align: baseline;
	-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;
}

.row .column.pull-right {
	float: right;
}

.row .column-half {
	width: 50%;
}

.row .column-third {
	width: 33.33333%;
}

.row .column-third {
	width: 33.33333%;
}

.row .column-fourth {
	width: 25%;
}

.pull-right {
	float: right;
}



<?php if( $isResponsive ){ ?>
	img,
	iframe,
	#pageEntries .xEntry .xGalleryContainer .xGallery,
	#pageEntries .xEntry .xGalleryContainer .xGallery .xGalleryItem,
	#pageEntries .xEntry .xGalleryContainer .xGallery .xGalleryItem .image {
		max-width: 100% !important;
		height: auto !important;
	}

	#xBackground img,
	#xFilledBackground img {
	    max-width: none !important;
	}

	#pageEntries .xEntry .xGalleryType-row .xGalleryItem {
		-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;
	}

	#contentContainer h1,
	.contentContainer h1 {
		margin: <?php echo $s->get('pageLayout', 'headingMargin') ?>;
	}

	nav {
		margin: <?php echo $s->get('pageLayout', 'menuMargin') ?>;
		position: relative;
		z-index: 1;
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

	nav ul li {
		display: inline-block;
		white-space: nowrap;
		margin-right: 10px;
	}

	nav ul li a {
		display: block;
	}

	nav ul li:hover ul {
		display: block;
		position: absolute;
		top: auto;
		left: auto;
	}

	nav ul li ul {
		display: none;
	}

	nav ul li ul li {
		display: block;
	}

	#additionalText {
		margin: 0 10px;
	}

	.floating-banner {
		position: relative;
		display: inline-block;
		margin: 10px;
	}

	<?php if($s->get('pageLayout', 'centeredContents') == 'yes') { ?>

		#allContainer {
			text-align: center;
		}

		#multisites {
			margin-top: 20px;
		}

		#contentContainer h1,
		.contentContainer h1 {
			clear: both;
		}

		nav {
			text-align: center;
		}

		nav ul li {
			margin-left: 5px;
			margin-right: 5px;
		}

		#menuToggle span, #menuToggle span:before, #menuToggle span:after {
			text-align: left;
		}

		.menuItem li {
			text-align: left;
		}

		#pageEntries .xEntry,
		#pageEntries .xEntry .xGalleryContainer .xGallery,
		#pageEntries .xEntry .xGalleryType-slideshow .xGallery,
		#pageEntries .xEntry .xGalleryContainer .xGallery .xGalleryItem {
			margin: 0 auto;
		}

		#pageEntries .xEntry .xGalleryContainer ul.xGalleryNav li {
			float: none;
			display: inline-block;
		}

	<?php } ?>

	/* helpers */
	.vjs-poster {
		position: absolute;
	}

	.xFixed {
		position: relative !important;
	}

	/* larger than tablet */
	@media (min-width: 768px) {
		#pageEntries .xEntry .xGalleryType-row .xGallery {
			max-width: inherit !important;
		}
	}

	/* small tablet */
	@media (max-width: 767px)  {

		#menuToggle {
			display: inline-block;
		}

		nav > ul {
			display: none;
		}

		nav ul li {
			display: block;
		}

		nav ul li ul,
		nav ul li:hover ul {
			position: relative;
			display: block;
		}

		#pageEntries.columns-3 .xEntry {
			width: 50%;
		}

		#pageEntries.columns-4 .xEntry {
			width: 50%;
		}

		#pageEntries.columns-3 .xEntry:nth-child(3n+1) {
			clear: none;
		}

		#pageEntries.columns-3 .xEntry:nth-child(2n+1),
		#pageEntries.columns-4 .xEntry:nth-child(2n+1) {
			clear: left;
		}

		#pageEntries .xEntry .xGalleryType-row .xGallery .xGalleryItem {
			padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
			padding-right: 0;
		}

		<?php if($s->get('pageLayout', 'centeredContents') == 'yes') { ?>
			.menuItem li {
				text-align: center;
			}
		<?php } ?>
	}

	@media (max-width: 480px) {
		#pageEntries.columns-2 .xEntry,
		#pageEntries.columns-3 .xEntry,
		#pageEntries.columns-4 .xEntry {
			float: none;
			width: 100%;
		}
	}

<?php } ?>

<?php if(!1) { ?></style><?php } ?>