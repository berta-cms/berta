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
.ie6 body {
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

.noHorizScroll {
	overflow-x: hidden !important;
}


#allContainer {
	position: relative;
	margin: 0;
	padding: 0;
}
	#allContainer.xCentered {
		margin: 0 auto;
		max-width: <?php echo $s->get('pageLayout', 'contentWidth') + $s->get('pageLayout', 'paddingLeft') + $s->get('sideBar', 'width') ?>px;
	}
.ie6 #allContainer {
	width: 100%;
	height: 100%;
	overflow-x: auto;
}

	#sideColumn {
		position: fixed;
		z-index: 2000;
		left: <?php echo $s->get('sideBar', 'marginLeft') ?>;
		width: <?php echo $s->get('sideBar', 'width') ?>;
		top: 0; bottom: 0;
		<?php if($s->get('sideBar', 'transparent') == 'no') { ?>
		background-color: <?php echo $s->get('sideBar', 'backgroundColor') ?>;
		<?php } ?>
	}
		#sideColumn.xCentered {
			left: 50%;
			margin-left: -<?php echo ($s->get('pageLayout', 'contentWidth') + $s->get('pageLayout', 'paddingLeft') + $s->get('sideBar', 'width')) / 2 ?>px;
		}
		.xNarrow #sideColumn {
			left: 0;
			margin-left: 0;
		}

	.ie6 #sideColumn {
		position: absolute;
		height: 100%;
	}

		#sideColumnTop {
			padding-left: 20px;
			padding-right: 20px;
			padding-top: <?php echo $s->get('sideBar', 'marginTop') ?>;
			padding-bottom: 20px;
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
					text-decoration: none;
				}

			#sideColumnTop li a:link, #sideColumnTop li a:visited {
				color: <?php echo $s->get('menu', 'colorLink') ?>;
				text-decoration: <?php echo $s->get('menu', 'textDecorationLink') ?>;
			}
			#sideColumnTop li a:hover {
				color: <?php echo $s->get('menu', 'colorHover') ?>;
				text-decoration: <?php echo $s->get('menu', 'textDecorationHover') ?>;
			}
			#sideColumnTop li a:active, #sideColumnTop li.selected>a, #sideColumnTop li.selected>span {
				color: <?php echo $s->get('menu', 'colorActive') ?>;
				text-decoration: <?php echo $s->get('menu', 'textDecorationActive') ?>;
			}

			#sideColumnTop li li a:link, #sideColumnTop li li a:visited {
				color: <?php echo $s->get('tagsMenu', 'colorLink') ?>;
				text-decoration: <?php echo $s->get('tagsMenu', 'textDecorationLink') ?>;
			}
			#sideColumnTop li li a:hover {
				color: <?php echo $s->get('tagsMenu', 'colorHover') ?>;
				text-decoration: <?php echo $s->get('tagsMenu', 'textDecorationHover') ?>;
			}
			#sideColumnTop li li a:active, #sideColumnTop li li.selected>a {
				color: <?php echo $s->get('tagsMenu', 'colorActive') ?>;
				text-decoration: <?php echo $s->get('tagsMenu', 'textDecorationActive') ?>;
			}


			#sideColumnTop ul {
				list-style: none;
				margin: 0 0 20px;
				padding: 0;
			}
				#sideColumnTop ul li {
					padding-bottom: 6px;
					font-family: <?php echo $s->getFont('menu') ?>;
					font-size: <?php echo $s->get('menu', 'fontSize') ?>;
					font-weight: <?php echo $s->get('menu', 'fontWeight') ?>;
					font-style: <?php echo $s->get('menu', 'fontStyle') ?>;
					font-variant: <?php echo $s->get('menu', 'fontVariant') ?>;
					line-height: <?php echo $s->get('menu', 'lineHeight') ?>;

				}
					#sideColumnTop ul li.selected>a {

					}
				#sideColumnTop ul ul {
					margin: 0 0 0 0px;
				}
					#sideColumnTop ul ul li {
						padding-bottom: 0;
						text-transform: none;
						font-family: <?php echo $s->getFont('tagsMenu') ?>;
						font-size: <?php echo $s->get('tagsMenu', 'fontSize') ?>;
						font-weight: <?php echo $s->get('tagsMenu', 'fontWeight') ?>;
						font-style: <?php echo $s->get('tagsMenu', 'fontStyle') ?>;
						font-variant: <?php echo $s->get('tagsMenu', 'fontVariant') ?>;
						line-height: <?php echo $s->get('tagsMenu', 'lineHeight') ?>;
					}

			#sideColumnTop ul select {
				width: 100%;
			}


		#additionalText {
			position: absolute;
			min-width: 140px;
		}
			#additionalText p { margin-top: 0; padding: 0; }


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
		#allContainer.xCentered #contentContainer {
			width: 100%;
		}
	.ie6 #contentContainer {
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto !important;
	}

		#firstPageMarkedEntries {
			position: relative;
		}
			#firstPageMarkedEntries .xEntry {
				max-width: <?php echo $s->get('pageLayout', 'contentWidth') ?>;
			}
			.firstPagePic {
				position: absolute;
			}
				.firstPagePic .xGalleryEditButton {
					display: none;
				}
					.firstPagePic .xGalleryEditButton span {
						display: none;
					}
				.firstPagePic .xGallery {
					<?php if($s->get('firstPage', 'imageHaveShadows') == 'yes') { ?>
					-webkit-box-shadow: 5px 5px 2px #ccc;
					-moz-box-shadow: 5px 5px 2px #ccc;
					box-shadow: 5px 5px 2px #ccc;
					<?php } ?>
				}
					.firstPagePic .xGalleryItem {

					}
				.firstPagePicLink {
					display: block;
					position: absolute;
					left: 0;
					top: 0;
					z-index: 1000;
					outline: none;
					width: 100%;
					height: 100%;
				}




		#mainColumnContainer {
			position: relative;
			padding-left: <?php echo $s->get('sideBar', 'marginLeft') ?>;
		}

		#mainColumn {
			position: relative;
			margin-left: <?php echo $s->get('sideBar', 'width') ?>;
			padding-top: <?php echo $s->get('pageLayout', 'paddingTop') ?>;
			padding-left: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
			padding-bottom: 20px;
			padding-right: <?php echo $s->get('pageLayout', 'paddingLeft') ?>;
			width: auto;
			max-width: <?php echo $s->get('pageLayout', 'contentWidth') ?>;
		}
			#mainColumn.xCentered {
				left: 50%;
				margin-left: -<?php echo ($s->get('pageLayout', 'contentWidth') + $s->get('pageLayout', 'paddingLeft') + $s->get('sideBar', 'width')) / 2 - $s->get('sideBar', 'width') ?>px;
			}

			.xNarrow #mainColumn.xCentered {
				left: 0;
				margin-left: <?php echo $s->get('sideBar', 'width') ?>;
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

						.xGalleryContainer .xGallery div.xGalleryItem { display: block; }
						.xGalleryType-column div.xGalleryItem {
							padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
						}
                        .xGalleryType-row .xGalleryItem {
                            position: relative;
                            float: left;
                            margin-right: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
                        }
						.xGalleryImageCaption { position: relative; }
						.xGalleryType-slideshow .xGalleryImageCaption { display: none; }

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
					margin-left: <?php echo $s->get('sideBar', 'width') ?>;
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

    .xSectionType-portfolio ol#pageEntries li.xEntry .xGalleryType-row .xGallery .xGalleryItem {
        padding-bottom: <?php echo $s->get('entryLayout', 'spaceBetweenImages') ?>;
        padding-right: 0;
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
	ol#pageEntries li.xEntry .xGalleryContainer .xGallery,
	ol#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem,
	ol#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem .image,
	#firstPageMarkedEntries .xEntry .xGalleryContainer .xGallery,
	#firstPageMarkedEntries .xEntry .xGalleryContainer .xGallery div.xGalleryItem,
	#firstPageMarkedEntries .xEntry .xGalleryContainer .xGallery div.xGalleryItem .image
	{
		max-width: 100% !important;
		height: auto !important;
	}

	ol#pageEntries li.xEntry,
	ol#pageEntries li.xEntry .xGalleryContainer .xGallery div.xGalleryItem,
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

		ol#pageEntries li.xEntry .xGalleryType-row .xGallery .xGalleryItem {
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