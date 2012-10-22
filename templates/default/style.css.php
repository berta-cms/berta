<?php

$SITE_ROOT = '../../';
$IS_CSS_FILE = true;
include('../../engine/inc.page.php');
$s =& $berta->template->settings;

$expires= 60 * 60 * 24 * 1;	// 1 day
header('Pragma: public');
header('Cache-Control: max-age=' . $expires);
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $expires) . ' GMT');
if($lastMod = $berta->settings->get('berta', 'lastUpdated')) {
	header('Last-Modified: ' . $lastMod);
}
header("Content-Type: text/css");



$contentFloat = substr($s->get('pageLayout', 'contentAlign'), -4) == 'left' ? 'left' : 'right';
$contentFloatOpposite = $contentFloat == 'left' ? 'right' : 'left';

$contentTextAlign = strpos($s->get('pageLayout', 'contentAlign'), 'justify') === 0 ? 'justify' : $s->get('pageLayout', 'contentAlign');
$contentTextAlignOpposite = $contentTextAlign == 'justify' ? 'justify' : ($contentTextAlign == 'left' ? 'right' : 'left');

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

	min-height: 100%;
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
a:active,
div#siteTopMenu ul li.selected span {
	color: <?php echo $s->get('links', 'colorActive') ?>;
	text-decoration: <?php echo $s->get('links', 'textDecorationActive') ?>;
	/*border: <?php echo $s->get('links', 'border:active') ?>;*/
}

a img { border: none; }



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
	padding: 0;
}

	#contentContainer h1 a {
		color: <?php echo $s->get('pageHeading', 'color') ?>;
	}

#allContainer {
	position: relative;
	z-index: 100;
	padding: 0; margin: 0;
}


#contentContainer {
	width: <?php echo $s->get('pageLayout', 'contentWidth') ?>;
	padding: <?php echo $s->get('pageLayout', 'bodyMargin') ?>;
	margin-top: 0;
	margin-bottom: 0;
	margin-left: <?php echo $s->get('pageLayout', 'contentPosition') == 'left' ? 0 : 'auto' ?>;
	margin-right: <?php echo $s->get('pageLayout', 'contentPosition') == 'right' ? 0 : 'auto' ?>;
}



	div#siteTopMenu {
		clear: both;
		padding: <?php echo $s->get('pageLayout', 'siteMenuMargin') ?>;
	}

		div#siteTopMenu ul {
			margin: 0 0 0;
			padding: 0;
			display: block;
			clear: both;
			float: <?php echo $contentFloat ?>;
			list-style: none;
		}
			div#siteTopMenu ul li {
				display: block;
				float: left;
				margin: 0;
			}
				div#siteTopMenu ul li .separator {
					display: block;
					float: left;
					padding: 0;
				}
				div#siteTopMenu ul li:first-child .separator { display: none; }
				div#siteTopMenu ul li a {
					display: block;
					float: left;
				}
				div#siteTopMenu ul li.selected a,
				div#siteTopMenu ul li.selected span {
					font-weight: bold;
				}


		div#siteTopMenu ul#mainMenu {
			padding: <?php echo $s->get('menu', 'margin') ?>;
		}

			div#siteTopMenu ul#mainMenu li {
				font-family: <?php echo $s->getFont('menu') ?>;
				font-size: <?php echo $s->get('menu', 'fontSize') ?>;
				font-weight: <?php echo $s->get('menu', 'fontWeight') ?>;
				font-style: <?php echo $s->get('menu', 'fontStyle') ?>;
				font-variant: <?php echo $s->get('menu', 'fontVariant') ?>;
				line-height: <?php echo $s->get('menu', 'lineHeight') ?>;
				white-space: nowrap;
			}
				div#siteTopMenu ul#mainMenu li .separator {
					padding-left: <?php echo $s->get('menu', 'separatorDistance') ?>;
				 	padding-right: <?php echo $s->get('menu', 'separatorDistance') ?>;
				}

		div#siteTopMenu ul#subMenu {
			clear: <?php echo $contentFloat ?>;
			padding: <?php echo $s->get('subMenu', 'margin') ?>;
		}

			div#siteTopMenu ul#subMenu li {
				font-family: <?php echo $s->getFont('subMenu') ?>;
				font-size: <?php echo $s->get('subMenu', 'fontSize') ?>;
				font-weight: <?php echo $s->get('subMenu', 'fontWeight') ?>;
				font-style: <?php echo $s->get('subMenu', 'fontStyle') ?>;
				font-variant: <?php echo $s->get('subMenu', 'fontVariant') ?>;
				line-height: <?php echo $s->get('subMenu', 'lineHeight') ?>;
			}
				div#siteTopMenu ul#subMenu li .separator {
					padding-left: <?php echo $s->get('subMenu', 'separatorDistance') ?>;
				 	padding-right: <?php echo $s->get('subMenu', 'separatorDistance') ?>;
				}

		#additionalText {
			position: absolute;
			max-width: 500px;
			z-index: 49000;
		}
		.ie #additionalText {
			width: 500px;
		}
			#additionalText p {
				margin: 0; padding: 0;
			}







	ol#pageEntries {
		list-style: none;
		margin: <?php echo $contentFloat == 'left' ? '0' : '0 0 0 auto' ?>;
		padding: 2em 0 0;
		clear: both;
		width: 100%;
	}
		ol#pageEntries li.xEntry {
			list-style:none;
			margin: <?php echo $s->get('entryLayout', 'margin') ?>;
			padding: 0;
		}

			ol#pageEntries li.xEntry .entryTitleContainer {
				width: 480px;
				margin: <?php echo $contentFloat ? '0' : '0 0 0 auto' ?>;
			}
			ol#pageEntries li.xEntry h2 {
				display: block;
				width: 100%;
				float: <?php echo $contentFloat ?>;
				color: <?php echo $s->get('entryHeading', 'color') ?>;
				font-family: <?php echo $s->getFont('entryHeading') ?>;
				font-size: <?php echo $s->get('entryHeading', 'fontSize') ?>;
				font-weight: <?php echo $s->get('entryHeading', 'fontWeight') ?>;
				font-style: <?php echo $s->get('entryHeading', 'fontStyle') ?>;
				font-variant: <?php echo $s->get('entryHeading', 'fontVariant') ?>;
				line-height: <?php echo $s->get('entryHeading', 'lineHeight') ?>;
				margin: <?php echo $s->get('entryHeading', 'margin') ?>;
				padding: 0;
			}
				/*ol#pageEntries li.xEntry h2 span { display: block; float: left; }*/
			ol#pageEntries li.xEntry p.shortDesc {
				clear: <?php echo $contentFloat ?>;
				margin: 0 0 5px;
				padding: 0;
			}





			ol#pageEntries li.xEntry .xGalleryContainer {
				position: relative;
				clear: <?php echo $contentFloat ?>;
				margin: <?php echo $contentFloat ? '0' : '0 0 0 auto' ?>;
				padding: 0;
				/*border: 2px solid #fff;*/
				margin: 0 0 2px;
			}
			ol#pageEntries li.xEntry .xGalleryType-slideshow {
				float: <?php echo $contentFloat ?>;
			}
			ol#pageEntries li.xEntry .xGalleryType-row {

			}
            ol#pageEntries li.xEntry .xGalleryType-pile {

            }
            ol#pageEntries li.xEntry .xGalleryType-column {

            }

				ol#pageEntries li.xEntry .xGalleryContainer .xGallery {
					position: relative;
					margin: <?php echo $s->get('entryLayout', 'galleryMargin') ?>;
				}
					ol#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem { display: block; }
                    ol#pageEntries li.xEntry .xGalleryType-column div.xGalleryItem {
                        padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
                    }
					ol#pageEntries li.xEntry .xGalleryType-row div.xGalleryItem {
						float: left;
						padding-right: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
						padding-bottom: 5px;
					}
					ol#pageEntries li.xEntry .xGalleryType-slideshow .xGalleryImageCaption { display: none; }
					ol#pageEntries li.xEntry .xGalleryType-row .xGalleryImageCaption p {
						margin: 5px 0 0;
					}

				ol#pageEntries .xGalleryContainer ul.xGalleryNav {
					display: block;
					position: relative;
					clear: both;
					/*float: right;*/
					margin: 0 0 2px;
					padding: 0;
					list-style: none;
					height: 18px;
					/*width: 150px;*/
				}
					ol#pageEntries .xGalleryContainer ul.xGalleryNav li {
						display: block;
						float: <?php echo $contentFloat ?>;
						list-style: none;
						line-height: 96%;
						margin: 0;
						padding: <?php echo $contentFloat ? '0 5px 0 0' : '0 0 0 5px' ?>;
					}
					ol#pageEntries .xGalleryContainer ul.xGalleryNav li .xGalleryImageCaption { display: none; }
					ol#pageEntries .xGalleryContainer ul.xGalleryNav li a {
						display: block;
						float: left;
						padding: 1px 2px 1px;
					}
					ol#pageEntries .xGalleryContainer ul.xGalleryNav li.selected a {
						background-color: #535353;
						color: #FFFFFF;
					}


			ol#pageEntries li.xEntry .entryText {
				width: 100%;
				position: relative;
				clear: both;
				float: <?php echo $contentFloat ?>;
				text-align: <?php echo $contentTextAlign ?>;
				margin: 4px 0 8px;
			}
				ol#pageEntries li.xEntry .entryText p {
					margin: 0 0 6px;
				}

				/* disqus fix */
				ol#pageEntries #dsq-content ul, ol#pageEntries #dsq-content li {
				    list-style-position: outside;
				    list-style-type: none;
				    margin: 0;
				    padding: 0;
				}

				ol#pageEntries li.xEntry .entryText ul {
					margin: 0 0 6px;
					padding: 0 0 0 15px;
				}
					ol#pageEntries li.xEntry .entryText ul li {
						list-style-type: circle;
						margin: 0 0 3px 0;
						padding: 0;
					}
				ol#pageEntries li.xEntry .entryText ol {
					margin: 0 0 6px;
					padding: 0 0 0 15px;
					/*counter-reset: term;*/
				}
					ol#pageEntries li.xEntry .entryText ol li {
						margin: 0 0 3px 0;
						padding: 0;
						list-style-type: decimal;
						/*text-indent: -2em;*/
					}
					ol#pageEntries li.xEntry .entryText ol li:before {
						/*counter-increment: term;
						content: counter(term) ") ";*/
					}



			ol#pageEntries li.xEntry .entryContent {
				clear: both;
				padding: 0;
				color: <?php echo $s->get('entryFooter', 'color') ?>;
				font-family: <?php echo $s->getFont('entryFooter') ?>;
				font-size: <?php echo $s->get('entryFooter', 'fontSize') ?>;
				font-weight: <?php echo $s->get('entryFooter', 'fontWeight') ?>;
				font-style: <?php echo $s->get('entryFooter', 'fontStyle') ?>;
				font-variant: <?php echo $s->get('entryFooter', 'fontVariant') ?>;
				line-height: <?php echo $s->get('entryFooter', 'lineHeight') ?>;
			}
				ol#pageEntries li.xEntry .entryContent table {
					float: <?php echo $contentFloat ?>;
				}
				ol#pageEntries li.xEntry .entryContent .items {
					float: <?php echo $contentFloat ?>;
				}
				ol#pageEntries li.xEntry .entryContent p.itm {
					float: <?php echo $contentFloat ?>;
					clear: both; /*<?php echo $s->get('pageLayout', 'contentAlign') ?>;*/
					margin: 0 0 2px;
					padding: 0;
				}
				ol#pageEntries li.xEntry .entryContent div.tagsList {
					clear: both;
				}
					ol#pageEntries li.xEntry .entryContent div.tagsList div {
						float: <?php echo $contentFloat ?> !important;
						clear: none;
					}

	#additionalFooterText {
		margin: 50px 0 0;
	}

	#additionalFooterText p {
		margin: 0;
	}

	.footer {
		margin: 10px 0 0;
		font-size: 80%;
	}

	.footerMenu {
		margin: 20px 0 0;
	}


	.bottomCopy {
		position: relative;
		bottom: 0;
	}
	.bottomCopy {
		/*fontFamily: Verdana, Arial, sans-serif !important;
			fontSize: 10px !important;
			fontWeight: normal !important;
			fontStyle: normal !important;
			fontVariant: normal !important;
			lineHeight: normal !important;*/
		clear: left;
		font-size: 80%;
		color: <?php echo $s->get('generalFontSettings', 'color') ?> !important;
	}


	.floating-banner {
		position: absolute;
		z-index: 3000;
	}



<?php if(!1) { ?></style><?php } ?>