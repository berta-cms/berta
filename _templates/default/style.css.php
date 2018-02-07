<?php

$SITE_ROOT = '../../';
$IS_CSS_FILE = true;
include('../../engine/inc.page.php');
$s =& $berta->template->settings;
$isResponsive = $s->get('pageLayout', 'responsive')=='yes';

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

	#contentContainer h1 a,
  #contentContainer h1 a:link,
  #contentContainer h1 a:visited,
  #contentContainer h1 a:hover,
  #contentContainer h1 a:active {
		color: <?php echo $s->get('pageHeading', 'color') ?>;
    text-decoration: none;
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

	#multisites {
		list-style: none;
		padding: 0;
		margin: 0;
		float: right;
	}

	#multisites li {
		display: inline-block;
		margin: 0 10px 10px 10px;
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

				div#siteTopMenu ul li a:link,
				div#siteTopMenu ul li a:visited {
					display: block;
					float: left;
					color: <?php echo $s->get('menu', 'colorLink') ?>;
				}

				div#siteTopMenu ul li a:active,
				div#siteTopMenu ul li.selected>span,
				div#siteTopMenu ul li.selected>a {
					color: <?php echo $s->get('menu', 'colorActive') ?>;
				}

				div#siteTopMenu ul li a:hover {
					color: <?php echo $s->get('menu', 'colorHover') ?>;
				}

				div#siteTopMenu ul li.selected a,
				div#siteTopMenu ul li.selected span {
					font-weight: bold;
				}

				div#siteTopMenu ul li.selected span.separator {
					font-weight: normal;
					text-decoration: none;
					color: <?php echo $s->get('generalFontSettings', 'color') ?>;
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

		div#siteTopMenu ul li ul.subMenu {
			display: none;
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
				/*float: <?php echo $contentFloat ?>;*/
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
						margin-right: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
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
		clear: left;
		font-size: 80%;
		color: <?php echo $s->get('generalFontSettings', 'color') ?> !important;
	}

	.floating-banner {
		position: absolute;
		z-index: 3000;
	}

	.iframeWrapper  {
		position: relative;
		padding-bottom: 56.25%;
	}

	.iframeWrapper iframe {
		position: absolute;
		width: 100%;
		height: 100% !important;
	}

    .xSectionType-portfolio .xGalleryContainer {
        width: 100%;
        float: none;
    }

<?php if( $isResponsive ){ ?>

	img,
	ol#pageEntries li.xEntry .xGalleryContainer .xGallery,
	ol#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem,
	ol#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem .image {
		max-width: 100% !important;
		height: auto !important;
	}

	#xFilledBackground img {
	    max-width: none !important;
	}

	#contentContainer {
		width: auto;
		max-width: <?php echo $s->get('pageLayout', 'contentWidth') ?>;
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

	h1 {
		float: none;
	}

	#additionalText {
		position: static;
		margin-bottom: 1em;
	}

	.floating-banner {
		position: static;
		display: inline-block;
		margin: 10px;
	}

	.vjs-poster {
		position: absolute;
		top: 0;
		left: 0;
	}

	ol#pageEntries li.xEntry,
	ol#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem,
	.row .column {
		-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;
	}

	/* larger than tablet */
	@media (min-width: 768px) {
		ol#pageEntries li.xEntry .xGalleryType-row .xGallery {
			max-width: inherit !important;
		}
	}

	/* small tablet */
	@media (max-width: 767px)  {
		#menuToggle {
			display: inline-block;
		}


		div#siteTopMenu > ul {
			display: none;
		}

		div#siteTopMenu,
		div#siteTopMenu ul,
		div#siteTopMenu ul li,
		div#siteTopMenu ul li a,
		div#siteTopMenu ul li a:link,
		div#siteTopMenu ul li a:visited {
			float: none;
		}

		div#siteTopMenu > ul > li {
			margin-bottom: 0.5em;
		}

		div#siteTopMenu ul#mainMenu li {
			line-height: 2em;
		}

		div#siteTopMenu ul li ul.subMenu {
			display: block;
			margin-left: 1em;
		}

		div#siteTopMenu ul li.selected ul.subMenu li a {
			font-weight: normal;
		}

		div#siteTopMenu ul li ul.subMenu li.selected a {
			font-weight: bold;
		}

		div#siteTopMenu ul#mainMenu li .separator {
			display: none;
		}

		div#siteTopMenu ul#subMenu {
			display: none;
		}

		ol#pageEntries li.xEntry .xGalleryType-row .xGallery .xGalleryItem {
			padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
			padding-right: 0;
		}
	}
}

<?php } ?>

<?php if(!1) { ?></style><?php } ?>
