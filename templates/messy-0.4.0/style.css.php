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


body {
	background-color: #fff;
	color: <? echo $s->get('generalFontSettings', 'color') ?>;
	font-family: <? echo $s->getFont('generalFontSettings') ?>;
	font-size: <? echo $s->get('generalFontSettings', 'fontSize') ?>;
	font-weight: <? echo $s->get('generalFontSettings', 'fontWeight') ?>;
	font-style: <? echo $s->get('generalFontSettings', 'fontStyle') ?>;
	font-variant: <? echo $s->get('generalFontSettings', 'fontVariant') ?>;
	line-height: <? echo $s->get('generalFontSettings', 'lineHeight') ?>;
	
	text-align: left;
	
	background-color: <? echo $s->get('background', 'backgroundColor') ?>;
	<? if($s->get('background', 'backgroundImageEnabled') == 'yes') { ?>
		<? if($s->get('background', 'backgroundImage')) { ?>
			background-image:url(<? echo Berta::$options['MEDIA_ABS_ROOT'] . $s->get('background', 'backgroundImage') ?>);
		<? } ?>
		background-repeat: <? echo $s->get('background', 'backgroundRepeat') ?>;
		background-position: <? echo $s->get('background', 'backgroundPosition') ?>;
		background-attachment: <? echo $s->get('background', 'backgroundAttachment') ?>;
	<? } ?>
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


.mess {
	position: absolute !important;
}



#allContainer {
	position: relative;
	margin: 0;
	padding: 0;
	/*overflow: <? if($isEngineView) echo 'visible'; else echo 'auto' ?>;*/
}

#contentContainer {
	position: relative;
	width: 100%;
}

#contentContainer h1 {
	padding: 0;
	margin: 0;
	z-index: 50000;
	color: <? echo $s->get('heading', 'color') ?>;
	font-family: <? echo $s->getFont('heading') ?>;
	font-size: <? echo $s->get('heading', 'fontSize') ?>;
	font-weight: <? echo $s->get('heading', 'fontWeight') ?>;
	font-style: <? echo $s->get('heading', 'fontStyle') ?>;
	font-variant: <? echo $s->get('heading', 'fontVariant') ?>;
	line-height: <? echo $s->get('heading', 'lineHeight') ?>;
	position: <? echo $s->get('heading', 'position') ?> !important;
}
	h1 a {
		color: <? echo $s->get('heading', 'color') ?> !important;
		text-decoration: none;
	}




.menuItem {
	z-index: 45000;
	font-family: <? echo $s->getFont('menu') ?>;
	font-size: <? echo $s->get('menu', 'fontSize') ?>;
	font-weight: <? echo $s->get('menu', 'fontWeight') ?>;
	font-style: <? echo $s->get('menu', 'fontStyle') ?>;
	font-variant: <? echo $s->get('menu', 'fontVariant') ?>;
	line-height: <? echo $s->get('menu', 'lineHeight') ?>;
	position: <? echo $s->get('menu', 'position') ?> !important;
}
	.menuItem a:link, .menuItem a:visited { 
		color: <? echo $s->get('menu', 'colorLink') ?>;
		text-decoration: <? echo $s->get('menu', 'textDecorationLink') ?>;
	}
	.menuItem a:hover, .menuItem a:active { 
		color: <? echo $s->get('menu', 'colorHover') ?>;
		text-decoration: <? echo $s->get('menu', 'textDecorationHover') ?>;
	}
	.menuItemSelected>a { 
		color: <? echo $s->get('menu', 'colorActive') ?> !important;
		text-decoration: <? echo $s->get('menu', 'textDecorationActive') ?> !important;
	}
	
	.menuItem ul {
		list-style: none;
		margin: 0;
		padding: 0;
		position: relative;
		left: <? echo $s->get('tagsMenu', 'x') ?>;
		top: <? echo $s->get('tagsMenu', 'y') ?>;		
	}
		.menuItem li {
			margin: 0;
			padding: 0;
			font-family: <? echo $s->getFont('tagsMenu') ?>;
			font-size: <? echo $s->get('tagsMenu', 'fontSize') ?>;
			font-weight: <? echo $s->get('tagsMenu', 'fontWeight') ?>;
			font-style: <? echo $s->get('tagsMenu', 'fontStyle') ?>;
			font-variant: <? echo $s->get('tagsMenu', 'fontVariant') ?>;
			line-height: <? echo $s->get('tagsMenu', 'lineHeight') ?>;
		}
			.menuItem li a:link, .menuItem li a:visited { 
				color: <? echo $s->get('tagsMenu', 'colorLink') ?>;
				text-decoration: <? echo $s->get('tagsMenu', 'textDecorationLink') ?>;
			}
			.menuItem li a:hover, .menuItem li a:active { 
				color: <? echo $s->get('tagsMenu', 'colorHover') ?>;
				text-decoration: <? echo $s->get('tagsMenu', 'textDecorationHover') ?>;
			}
			.menuItem li.selected>a { 
				color: <? echo $s->get('tagsMenu', 'colorActive') ?> !important;
				text-decoration: <? echo $s->get('tagsMenu', 'textDecorationActive') ?> !important;
			}


			

	
	


#pageEntries {
	position: relative;
	margin: 0;
	padding: 0;
	list-style: none;
}
	#pageEntries .xEntry {
		position: relative;
		max-width: <? echo $s->get('entryLayout', 'contentWidth') ?>;
		min-width: 150px;
		clear: both;
		list-style:none;
		margin-bottom: <? echo $s->get('entryLayout', 'spaceBetween') ?>;
		
		padding: 0;
	}
	
	#pageEntries .xEntry h2 {
				color: <? echo $s->get('entryHeading', 'color') ?>;
				font-family: <? echo $s->getFont('entryHeading') ?>;
				font-size: <? echo $s->get('entryHeading', 'fontSize') ?>;
				font-weight: <? echo $s->get('entryHeading', 'fontWeight') ?>;
				font-style: <? echo $s->get('entryHeading', 'fontStyle') ?>;
				font-variant: <? echo $s->get('entryHeading', 'fontVariant') ?>;
				line-height: <? echo $s->get('entryHeading', 'lineHeight') ?>;
				margin: <? echo $s->get('entryHeading', 'margin') ?>;
	}

	#pageEntries .xEntry .xGalleryContainer {
		position: relative;
		clear: both;
		padding: 0;
		margin-bottom: <? echo $s->get('entryLayout', 'galleryMargin') ?>;
	}
	#pageEntries .xEntry .xGalleryType-slideshow {}
	#pageEntries .xEntry .xGalleryType-row {}
				
		#pageEntries .xEntry .xGalleryContainer .xGallery { 
			position: relative; 
			display: block;
		}
		#pageEntries .xEntry .xGalleryType-slideshow .xGallery {
			margin-bottom: <? echo $s->get('entryLayout', 'galleryNavMargin') ?>;
		}
		
			#pageEntries .xEntry .xGalleryType-row .xGalleryItem {
				position: absolute;
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
					color: <? echo $s->get('menu', 'colorLink') ?>;
					text-decoration: <? echo $s->get('menu', 'textDecorationLink') ?>;
					outline: none;
				}
				
				.xGalleryImageCaption { display: none; }
				
			#pageEntries .xGalleryContainer ul.xGalleryNav li a:hover {
				color: <? echo $s->get('menu', 'colorHover') ?>;
				text-decoration: <? echo $s->get('menu', 'textDecorationHover') ?>;
			}
			#pageEntries .xGalleryContainer ul.xGalleryNav li.selected a {
				color: <? echo $s->get('menu', 'colorActive') ?>;
				text-decoration: <? echo $s->get('menu', 'textDecorationActive') ?>;
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
	position: fixed;
	bottom: 20px;
	font-size: 10px;
	right: 20px;
	z-index: 10000000;
	
}	
	#bottom p {
		float: left;
		margin-right: 10px;
		margin-bottom: 0;
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
	/*z-index: -1000;*/
	/*z-index: -1;*/
	width: 100%;
	height: 100%;
}
    #xBackground #xBackgroundLoader {
        width: 31px;
        height: 31px;
        position: absolute;
        left: 50%; top: 50%;
        margin-left: -15px; margin-top: -15px;
        display: none;
    }

#xBackgroundContainer #xBackgroundNext {
	position: fixed;
	width: 40px;
	z-index: 1000;
	right: 0px;
	top: 50%;
	margin-top: -14px;
	visibility: visible;
}
	#xBackgroundContainer #xBackgroundNext.bgHidden { visibility: hidden; }
	#xBackgroundNext a {
		background: url('layout/arrow_next_sprite.png');
		background-position: 0px 0px;
		width: 40px;
		height: 29px;
		display: block;
	}
	#xBackgroundContainer #xBackgroundNext a:hover { background-position: 0px -29px; }
	#xBackgroundContainer #xBackgroundNext a span { display: none; }

#xBackgroundContainer #xBackgroundPrevious {
	position: fixed;
	width: 40px;
	z-index: 1000;
	left: 0px;
	top: 50%;
	margin-top: -14px;
	visibility: visible;
}
	#xBackgroundContainer #xBackgroundPrevious.bgHidden { visibility: hidden; }
	#xBackgroundPrevious a {
		background: url('layout/arrow_prev_sprite.png');
		background-position: 0px 0px;
		width: 40px;
		height: 29px;
		display: block;
	}
	#xBackgroundContainer #xBackgroundPrevious a:hover { background-position: 0px -29px; }
	#xBackgroundContainer #xBackgroundPrevious a span { display: none; }
			
			#xBackground .visual-list {
				display: none;
			}
			#xBackground .visual-image {
				position: absolute;
				top: 0; right: 0; bottom: 0; left: 0;
				overflow: hidden;
				z-index: 0;
				/*z-index: -1;*/
			}
				#xBackground .visual-image .bg-element {
					position: absolute; display: block;
				}
			#xBackground .visual-caption {
				position: absolute;
				width: <? echo $s->get('entryLayout', 'contentWidth') ?>;
				text-align: left;
				top: 50%; left: 50%;
				margin-left: -<? echo $s->get('entryLayout', 'contentWidth')/2 ?>px;
				padding: 0 10px;
				z-index: 0;
				/*z-index: -1;*/
			}
				#xBackground .visual-caption * {
					background: inherit !important;
					color: inherit !important;
					background-color: transparent !important;
				}

#xGridView {
	top: 100px;
	left: <? echo (100 - $s->get('grid', 'contentWidth'))/2 ?>%;
	right: <? echo (100 - $s->get('grid', 'contentWidth'))/2 ?>%;
	width: <? echo $s->get('grid', 'contentWidth') ?>;
	visibility: hidden;
}
	#xGridView .box {
		float: left;
		margin: 5px;
	}
	
#xGridViewTriggerContainer {
	width: 22px;
	position: absolute;
	right: 20px;
	top: 20px;
	margin-right: 10px;
	display: block;
}
	#xGridViewTriggerContainer a {
		width: 22px;
		height: 18px;
		background: url('layout/thumbnails.png');
		background-position: 0px 0px;
		display: block;
	}
	
		#xGridViewTriggerContainer a:hover { 
			background-position: 0 -18px;
		}
	
		#xGridViewTriggerContainer a span {
			display: none;
		}

<? if(!1) { ?></style><? } ?>