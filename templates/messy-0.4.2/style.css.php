<?php

$SITE_ROOT = '../../';
$IS_CSS_FILE = true;
include('../../engine/inc.page.php');
$s =& $berta->template->settings;
$isEngineView = $berta->security->userLoggedIn;

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
	position: absolute !important;
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
	/*overflow: <?php if($isEngineView) echo 'visible'; else echo 'auto' ?>;*/
}



#contentContainer {
	position: relative;
	width: 100%;
}
	#contentContainer.xCentered {
		margin: 0 auto;
		width: <?php echo $s->get('pageLayout', 'centeredWidth') ?>;
	}

#contentContainer h1 {
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
	position: <?php echo $s->get('heading', 'position') ?> !important;
}
	h1 a {
		color: <?php echo $s->get('heading', 'color') ?> !important;
		text-decoration: none;
	}




.menuItem {
	z-index: 45000;
	font-family: <?php echo $s->getFont('menu') ?>;
	font-size: <?php echo $s->get('menu', 'fontSize') ?>;
	font-weight: <?php echo $s->get('menu', 'fontWeight') ?>;
	font-style: <?php echo $s->get('menu', 'fontStyle') ?>;
	font-variant: <?php echo $s->get('menu', 'fontVariant') ?>;
	line-height: <?php echo $s->get('menu', 'lineHeight') ?>;
	position: <?php echo $s->get('menu', 'position') ?> !important;
	white-space: nowrap;
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








#pageEntries {
	position: relative;
	margin: 0;
	padding: 0;
	list-style: none;
}
	#pageEntries .xEntry {
		position: relative;
		max-width: <?php echo $s->get('entryLayout', 'contentWidth') ?>;
		min-width: 150px;
		clear: both;
		list-style:none;
		margin-bottom: <?php echo $s->get('entryLayout', 'spaceBetween') ?>;

		padding: 0;
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
	z-index: 10000000;
}

	#additionalFooterText {
		float: left;
		margin-left: 10px;
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
            cursor: url(templates/messy-0.4.2/layout/arrow_right_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.cur), pointer;
        <?php } else { ?>
            cursor: url(layout/arrow_right_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.gif), pointer;
        <?php } ?>
    }
    #xBackground #xBackgroundLeft {
        left: 0;
        <?php if (preg_match('/msie/i',$DEVICE_USER_AGENT)) { ?>
            cursor: url(templates/messy-0.4.2/layout/arrow_left_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.cur), pointer;
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
                cursor: url(templates/messy-0.4.2/layout/arrow_right_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.cur), pointer;
            <?php } else { ?>
                cursor: url(layout/arrow_right_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.gif), pointer;
            <?php } ?>
        }
        #xBackground #xBackgroundLeftCounter .counterContent {
            position: absolute;
            left: 26px;
            <?php if (preg_match('/msie/i',$DEVICE_USER_AGENT)) { ?>
                cursor: url(templates/messy-0.4.2/layout/arrow_left_<?php echo $s->get('pageLayout', 'bgButtonType') ?>.cur), pointer;
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

<?php if(!1) { ?></style><?php } ?>