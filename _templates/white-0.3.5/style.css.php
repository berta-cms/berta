<?php

header("Content-Type: text/css");

$SITE_ROOT = '../../';
$IS_CSS_FILE = true;
include('../../engine/inc.page.php');
$s =& $berta->template->settings;
$isEngineView = $berta->security->userLoggedIn;
$isResponsive = $s->get('pageLayout', 'responsive')=='yes';


if(!1) { ?><style type="text/css"><?php } ?>


html, body {
	width: 100%;
	height: 100%;
}
.ie6 html {
	overflow-y: hidden;
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

	background-color: <?php echo $s->get('background', 'backgroundColor') ?>;
	<?php if($s->get('background', 'backgroundImageEnabled') == 'yes') { ?>
		<?php if($s->get('background', 'backgroundImage')) { ?>
			background-image:url(<?php echo Berta::$options['MEDIA_ABS_ROOT'] . $s->get('background', 'backgroundImage') ?>);
		<?php } ?>
		background-repeat: <?php echo $s->get('background', 'backgroundRepeat') ?>;
		background-position: <?php echo $s->get('background', 'backgroundPosition') ?>;
		background-attachment: <?php echo $s->get('background', 'backgroundAttachment') ?>;
	<?php } ?>

	text-align: left;

}
.ie6 {
	overflow-y: hidden;
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

a img { border: none; }



#allContainer {
	position: relative;
	margin: 0;
	padding: 0;
}
	#allContainer.xCentered {
		margin: 0 auto;
		max-width: <?php echo $s->get('pageLayout', 'leftColumnWidth') + $s->get('pageLayout', 'contentWidth') + $s->get('pageLayout', 'paddingLeft') ?>px;
	}

.ie6 #allContainer {
	width: 100%;
	height: 100%;
	overflow-x: auto;
}


	#sideColumn {
		position: fixed;
		z-index: 2000;
		width: <?php echo $s->get('pageLayout', 'leftColumnWidth') ?>;
		top: 0; bottom: 0;
		left: 25px;
		background-color: #fff;
	}
		#sideColumn.xCentered {
			left: 50%;
			margin-left: -<?php echo ($s->get('pageLayout', 'leftColumnWidth') + $s->get('pageLayout', 'contentWidth') + $s->get('pageLayout', 'paddingLeft')) / 2 ?>px;
		}
		#allContainer.xNarrow #sideColumn {
			left: 0;
			margin-left: 0;
		}
	.ie6 #sideColumn {
		position: absolute;
		height: 100%;
	}

		#sideColumnTop {
			padding: 30px 20px 20px;
		}


			#sideColumnTop #multisites {
				list-style: none;
				padding: 0;
				margin: 0;
			}

			#sideColumnTop #multisites li {
				display: inline-block;
				margin: 0 10px 10px 0;
				padding: 0;
			}


			#sideColumnTop h1 {
				min-height: 40px;
				float: none;
				padding: 0;
				margin: 0;
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
				#sideColumnTop h1 a {
					color: <?php echo $s->get('pageHeading', 'color') ?> !important;
					text-decoration: none;
				}

			#sideColumnTop a:link, #sideColumnTop a:visited {
				color: <?php echo $s->get('menu', 'colorLink') ?>;
				text-decoration: <?php echo $s->get('menu', 'textDecorationLink') ?>;
			}
			#sideColumnTop a:hover {
				color: <?php echo $s->get('menu', 'colorHover') ?>;
				text-decoration: <?php echo $s->get('menu', 'textDecorationHover') ?>;
			}
			#sideColumnTop a:active, #sideColumnTop li.selected>a, #sideColumnTop li.selected>span {
				color: <?php echo $s->get('menu', 'colorActive') ?>;
				text-decoration: <?php echo $s->get('menu', 'textDecorationActive') ?>;
			}


			#sideColumnTop ul {
				list-style: none;
				margin: 0 0 20px;
				padding: 0;
			}
				#sideColumnTop ul li {
					padding-bottom: 6px;
					font-weight: bold;
				}
					#sideColumnTop ul li.selected>a {

					}
				#sideColumnTop ul ul {
					margin: 0 0 0 10px;
				}
					#sideColumnTop ul ul li {
						padding-bottom: 0;
						font-weight: normal;
						text-transform: none;
					}

		#additionalText {
			position: absolute;
			min-width: 140px;
		}


		#sideColumnBottom {
			position: absolute;
			bottom: 0;
			width: 140px;
			padding: 20px 20px 30px;
		}
			#sideColumnBottom p {
				width: 100%;
				font-size: 10px;
				margin: 0;
				padding: 0;
			}
			#sideColumnBottom #userCopyright {

			}
			#sideColumnBottom #bertaCopyright {

			}

	#contentContainer {
		position: relative;
		z-index: 1000;
		width: 100%;
	}

	.ie6 #contentContainer {
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto !important;
	}

		#mainColumn {
			position: relative;
			padding-top: <?php echo $s->get('pageLayout', 'paddingTop') ?>;
			margin-left: <?php echo $s->get('pageLayout', 'leftColumnWidth') ?>;
			padding-bottom: 20px;
			padding-left: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
			padding-right: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;

			width: auto;
			max-width: <?php echo $s->get('pageLayout', 'contentWidth') ?>;
		}
			#mainColumn.xCentered {
				left: 50%;
				margin-left: -<?php echo ($s->get('pageLayout', 'leftColumnWidth') + $s->get('pageLayout', 'contentWidth') + $s->get('pageLayout', 'paddingLeft')) / 2 - $s->get('pageLayout', 'leftColumnWidth') ?>px;
			}
			.xNarrow #mainColumn.xCentered {
				left: 0;
				margin-left: <?php echo $s->get('pageLayout', 'leftColumnWidth') ?>;
			}

		ol#pageEntries {
			position: relative;
			margin: 0;
			padding: 0;
			list-style: none;
		}
			ol#pageEntries li.xEntry {
				position: relative;
				clear: both;
				list-style:none;
				margin-bottom: <?php echo $s->get('entryLayout', 'spaceBetween') ?>;
				padding: 0;
			}

				ol#pageEntries li.xEntry h2 {
					padding: 0;
					margin: 0;
					font-size: 16px;
					font-weight: bold;
				}
				ol#pageEntries li.xEntry .xGalleryContainer {
					position: relative;
					clear: both;
					padding: 0;
					margin-bottom: <?php echo $s->get('entryLayout', 'galleryMargin') ?>;
				}
				ol#pageEntries li.xEntry .xGalleryType-slideshow {

				}
				ol#pageEntries li.xEntry .xGalleryType-row {

				}
                ol#pageEntries li.xEntry .xGalleryType-pile {

                }
                ol#pageEntries li.xEntry .xGalleryType-column {

                }

					ol#pageEntries li.xEntry .xGalleryContainer .xGallery {
						position: relative;
					}
					ol#pageEntries li.xEntry .xGalleryType-slideshow .xGallery {
						margin-bottom: <?php echo $s->get('entryLayout', 'galleryNavMargin') ?>;
					}

						ol#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem { display: block; }
						ol#pageEntries li.xEntry .xGalleryType-column div.xGalleryItem {
							padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
						}
                        ol#pageEntries li.xEntry .xGalleryType-row div.xGalleryItem {
                            position: relative;
                            float: left;
                            padding-right: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
                        }
						ol#pageEntries li.xEntry .xGalleryType-slideshow .xGalleryImageCaption { display: none; }

					ol#pageEntries .xGalleryContainer ul.xGalleryNav {
						display: block;
						position: relative;
						clear: both;
						margin: 0 0 2px;
						padding: 0;
						list-style: none;
						height: 18px;
					}
						ol#pageEntries .xGalleryContainer ul.xGalleryNav li {
							display: block;
							float: left;
							list-style: none;
							line-height: 96%;
							margin: 0;
						}
						ol#pageEntries .xGalleryContainer ul.xGalleryNav li .xGalleryImageCaption { display: none; }
						ol#pageEntries .xGalleryContainer ul.xGalleryNav li a {
							display: block;
							float: left;
							padding: 1px 5px 1px;
							color: <?php echo $s->get('menu', 'colorLink') ?>;
							text-decoration: <?php echo $s->get('menu', 'textDecorationLink') ?>;
							outline: none;
						}
						ol#pageEntries .xGalleryContainer ul.xGalleryNav li a:hover {
							color: <?php echo $s->get('menu', 'colorHover') ?>;
							text-decoration: <?php echo $s->get('menu', 'textDecorationHover') ?>;
						}
						ol#pageEntries .xGalleryContainer ul.xGalleryNav li.selected a {
							color: <?php echo $s->get('menu', 'colorActive') ?>;
							text-decoration: <?php echo $s->get('menu', 'textDecorationActive') ?>;
						}


				ol#pageEntries li.xEntry .entryText {
					position: relative;
					clear: both;
					margin: 0 0 6px;
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
					}
						ol#pageEntries li.xEntry .entryText ol li {
							margin: 0 0 3px 0;
							padding: 0;
							list-style-type: decimal;
						}


				ol#pageEntries li.xEntry .entryTags {
					position: relative;
					clear: both;
				}

				.floating-banners {
					margin-left: <?php echo $s->get('pageLayout', 'leftColumnWidth') ?>;
					padding-left: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
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

    .xSectionType-portfolio img,
    .xSectionType-portfolio ol#pageEntries li.xEntry .xGalleryContainer .xGallery,
    .xSectionType-portfolio ol#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem,
    .xSectionType-portfolio ol#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem .image {
        max-width: 100% !important;
        height: auto !important;
    }

    .xSectionType-portfolio ol#pageEntries li.xEntry .xGalleryType-row .xGallery {
        max-width: inherit !important;
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