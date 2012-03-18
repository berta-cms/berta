<?

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


if(!1) { ?><style type="text/css"><? } ?>

html, body {
	width: 100%;
	height: 100%;
}
.ie6 html {
	overflow-y: hidden;
}


body {
	background-color: #fff;
	color: <? echo $s->get('generalFontSettings', 'color') ?>;
	font-family: <? echo $s->getFont('generalFontSettings') ?>;
	font-size: <? echo $s->get('generalFontSettings', 'fontSize') ?>;
	font-weight: <? echo $s->get('generalFontSettings', 'fontWeight') ?>;
	font-style: <? echo $s->get('generalFontSettings', 'fontStyle') ?>;
	font-variant: <? echo $s->get('generalFontSettings', 'fontVariant') ?>;
	line-height: <? echo $s->get('generalFontSettings', 'lineHeight') ?>;
	
	background-color: <? echo $s->get('background', 'backgroundColor') ?>;
	<? if($s->get('background', 'backgroundImageEnabled') == 'yes') { ?>
		<? if($s->get('background', 'backgroundImage')) { ?>
			background-image:url(<? echo Berta::$options['MEDIA_ABS_ROOT'] . $s->get('background', 'backgroundImage') ?>);
		<? } ?>
		background-repeat: <? echo $s->get('background', 'backgroundRepeat') ?>;
		background-position: <? echo $s->get('background', 'backgroundPosition') ?>;
		background-attachment: <? echo $s->get('background', 'backgroundAttachment') ?>;
	<? } ?>
	
	text-align: left;
}
.ie6 body {
	overflow-y: hidden;
}


a:link { 
	color: <? echo $s->get('links', 'colorLink') ?>;
	text-decoration: <? echo $s->get('links', 'textDecorationLink') ?>;
	/*border: <? echo $s->get('links', 'border:link') ?>;*/
}
a:visited { 
	color: <? echo $s->get('links', 'colorVisited') ?>;
	text-decoration: <? echo $s->get('links', 'textDecorationVisited') ?>;
	/*border: <? echo $s->get('links', 'border:visited') ?>;*/
}
a:hover { 
	color: <? echo $s->get('links', 'colorHover') ?>;
	text-decoration: <? echo $s->get('links', 'textDecorationHover') ?>;
	/*border: <? echo $s->get('links', 'border:hover') ?>;*/
}
a:active { 
	color: <? echo $s->get('links', 'colorActive') ?>;
	text-decoration: <? echo $s->get('links', 'textDecorationActive') ?>;
	/*border: <? echo $s->get('links', 'border:active') ?>;*/
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
.ie6 #allContainer {
	width: 100%;
	height: 100%;
	overflow-x: auto;
}

	#sideColumn {
		position: fixed;
		z-index: 2000;
		left: <? echo $s->get('sideBar', 'marginLeft') ?>;
		width: <? echo $s->get('sideBar', 'width') ?>;
		top: 0; bottom: 0;
		<? if($s->get('sideBar', 'transparent') == 'no') { ?>
		background-color: <? echo $s->get('sideBar', 'backgroundColor') ?>;
		<? } ?>
	}
	.ie6 #sideColumn {
		position: absolute;
		height: 100%;
	}
	
		#sideColumnTop {
			padding-left: 20px;
			padding-right: 20px;
			padding-top: <? echo $s->get('sideBar', 'marginTop') ?>;
			padding-bottom: 20px;
			/*width: 140px;*/
		}
	
			#sideColumnTop h1 { 
				min-height: 40px;
				float: none;
				padding: 0;
				margin: 0;
				color: <? echo $s->get('sideBar', 'color') ?>;
				font-family: <? echo $s->getFont('sideBar') ?>;
				font-size: <? echo $s->get('sideBar', 'fontSize') ?>;
				font-weight: <? echo $s->get('sideBar', 'fontWeight') ?>;
				font-style: <? echo $s->get('sideBar', 'fontStyle') ?>;
				font-variant: <? echo $s->get('sideBar', 'fontVariant') ?>;
				line-height: <? echo $s->get('sideBar', 'lineHeight') ?>;
				
				margin-bottom: <? echo $s->get('sideBar', 'marginBottom') ?>;
			}
				#sideColumnTop h1 a {
					color: <? echo $s->get('sideBar', 'color') ?> !important;
					text-decoration: none;
				}
		
			#sideColumnTop li a:link, #sideColumnTop li a:visited { 
				color: <? echo $s->get('menu', 'colorLink') ?>;
				text-decoration: <? echo $s->get('menu', 'textDecorationLink') ?>;
			}
			#sideColumnTop li a:hover { 
				color: <? echo $s->get('menu', 'colorHover') ?>;
				text-decoration: <? echo $s->get('menu', 'textDecorationHover') ?>;
				/*border: <? echo $s->get('links', 'border:hover') ?>;*/
			}
			#sideColumnTop li a:active, #sideColumnTop li.selected>a { 
				color: <? echo $s->get('menu', 'colorActive') ?>;
				text-decoration: <? echo $s->get('menu', 'textDecorationActive') ?>;
				/*border: <? echo $s->get('links', 'border:active') ?>;*/
			}
			
			#sideColumnTop li li a:link, #sideColumnTop li li a:visited { 
				color: <? echo $s->get('tagsMenu', 'colorLink') ?>;
				text-decoration: <? echo $s->get('tagsMenu', 'textDecorationLink') ?>;
			}
			#sideColumnTop li li a:hover { 
				color: <? echo $s->get('tagsMenu', 'colorHover') ?>;
				text-decoration: <? echo $s->get('tagsMenu', 'textDecorationHover') ?>;
				/*border: <? echo $s->get('links', 'border:hover') ?>;*/
			}
			#sideColumnTop li li a:active, #sideColumnTop li li.selected>a { 
				color: <? echo $s->get('tagsMenu', 'colorActive') ?>;
				text-decoration: <? echo $s->get('tagsMenu', 'textDecorationActive') ?>;
				/*border: <? echo $s->get('links', 'border:active') ?>;*/
			}
			

			#sideColumnTop ul {
				list-style: none;
				margin: 0 0 20px;
				padding: 0;
			}
				#sideColumnTop ul li {
					padding-bottom: 6px;
					font-family: <? echo $s->getFont('menu') ?>;
					font-size: <? echo $s->get('menu', 'fontSize') ?>;
					font-weight: <? echo $s->get('menu', 'fontWeight') ?>;
					font-style: <? echo $s->get('menu', 'fontStyle') ?>;
					font-variant: <? echo $s->get('menu', 'fontVariant') ?>;
					line-height: <? echo $s->get('menu', 'lineHeight') ?>;
					
				}
					#sideColumnTop ul li.selected>a {
						/*font-weight: bold;
						color: #000;*/
					}
				#sideColumnTop ul ul {
					margin: 0 0 0 0px;
				}
					#sideColumnTop ul ul li {
						padding-bottom: 0;
						text-transform: none;
						font-family: <? echo $s->getFont('tagsMenu') ?>;
						font-size: <? echo $s->get('tagsMenu', 'fontSize') ?>;
						font-weight: <? echo $s->get('tagsMenu', 'fontWeight') ?>;
						font-style: <? echo $s->get('tagsMenu', 'fontStyle') ?>;
						font-variant: <? echo $s->get('tagsMenu', 'fontVariant') ?>;
						line-height: <? echo $s->get('tagsMenu', 'lineHeight') ?>;
					}
			
			#sideColumnTop ul select { 
				width: 100%;
			}
			
			
		#additionalText {
			position: absolute;
			min-width: 140px;
		}
			#additionalText p { margin: 0; padding: 0; }
		
				
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
				width: <? echo $s->get('pageLayout', 'contentWidth') ?>;
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
					<? if($s->get('firstPage', 'imageHaveShadows') == 'yes') { ?>
					background: url('layout/shadow.png') right bottom;
					<? } ?>
				}
					.firstPagePic .xGalleryItem {
						position: absolute;
						<? if($s->get('firstPage', 'imageHaveShadows') == 'yes') { ?>
						left: -5px;
						top: -5px;
						<? } ?>
					}
				.firstPagePicLink {
					display: block;
					position: absolute;
					left: 0;
					top: 0;
					z-index: 1000;
					outline: none;
				}
	
	
	
	
		#mainColumnContainer {
			position: relative;
			padding-left: <? echo $s->get('sideBar', 'marginLeft') ?>;;
		}
	
		#mainColumn {
			position: relative;
			margin-top: <? echo $s->get('pageLayout', 'paddingTop') ?>;
			margin-left: <? echo $s->get('sideBar', 'width') ?>;
			padding-bottom: 20px;
			padding-left: <? echo $s->get('pageLayout', 'paddingLeft') ?>;
			/*width: 800px;*/
			width: <? echo $s->get('pageLayout', 'contentWidth') ?>;
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
				margin-bottom: <? echo $s->get('entryLayout', 'spaceBetween') ?>;
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
					margin-bottom: <? echo $s->get('entryLayout', 'galleryMargin') ?>;
				}
				ol#pageEntries li.xEntry .xGalleryType-slideshow {

				}
				ol#pageEntries li.xEntry .xGalleryType-row {
				
				}
				
					ol#pageEntries li.xEntry .xGalleryContainer .xGallery { 
						position: relative; 
					}
					ol#pageEntries li.xEntry .xGalleryType-slideshow .xGallery {
						margin-bottom: <? echo $s->get('entryLayout', 'galleryNavMargin') ?>;
					}
					
						.xGalleryContainer .xGallery div.xGalleryItem { display: block; }
						.xGalleryType-row div.xGalleryItem {
							padding-bottom: <? echo $s->get('entryLayout', 'spaceBetweenRowImages') ?>;
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
							color: <? echo $s->get('menu', 'colorLink') ?>;
							text-decoration: <? echo $s->get('menu', 'textDecorationLink') ?>;
							outline: none;
						}
						ol#pageEntries .xGalleryContainer ul.xGalleryNav li a:hover {
							color: <? echo $s->get('menu', 'colorHover') ?>;
							text-decoration: <? echo $s->get('menu', 'textDecorationHover') ?>;
						}
						ol#pageEntries .xGalleryContainer ul.xGalleryNav li.selected a {
							color: <? echo $s->get('menu', 'colorActive') ?>;
							text-decoration: <? echo $s->get('menu', 'textDecorationActive') ?>;
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
				
				
				
				
	.floating-banner {
		position: absolute;
		z-index: 3000;
	}
				
				
		

	



<? if(!1) { ?></style><? } ?>