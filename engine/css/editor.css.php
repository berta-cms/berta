<?php

$IS_CSS_FILE = true;
$SITE_ROOT = '../../';
define('SETTINGS_INSTALLREQUIRED', false);
define('SETTINGS_INSTALLCHECKREQUIRED', false);
define('BERTA_ENVIRONMENT', 'engine');
include('../inc.page.php');

$expires= 60 * 60 * 24 * 14; // 14 days
header('Pragma: public');
header('Cache-Control: max-age=' . $expires);
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $expires) . ' GMT');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', time() - $expires * 2) . ' GMT');
header("Content-Type: text/css");

$settings =& $berta->template->settings;

if(!1) { ?><style type="text/css"><?php } ?>


#allContainer {
	/*width: 900px !important;*/
}
body.xEditorEnabled { }

#bertaVideosBackground {
	background-color: #fff;
	-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)";
	filter: alpha(opacity=60);
	-webkit-opacity: 0.6;
	-moz-opacity: 0.6;
	opacity: 0.6;
	position: fixed;
	height: 100%;
	width: 100%;
	z-index: 60000;
}

#bertaVideosWrapper {
	background-color: #eee;
	-moz-box-shadow: 0 0 10px 5px #bdbdbd;
	-webkit-box-shadow: 0 0 10px 5px #bdbdbd;
	box-shadow: 0 0 10px 5px #bdbdbd;
	margin: -232px 0 0 -279px;
	padding: 15px;
	position: fixed;
	top: 50%; left: 50%;
	height: 435px;
	width: 528px;
	z-index: 60000;
}

#bertaVideos {
	position: relative;
	height: 100%;
	width: 100%;
}

	#bertaVideos #videoFrameWrapper {
		background: url('../layout/loader.gif') no-repeat center;
		margin-bottom: 12px;
	}

		#bertaVideos #videoFrameWrapper iframe#videoFrame {
			border: none;
			height: 300px;
			width: 528px;
		}


	#bertaVideos #videoLinks .title {
		font-weight: bold;
		margin-bottom: 3px;
	}

	#bertaVideos #videoLinks .links a {
		background: url('../layout/berta_video_button_normal.png') no-repeat 0 4px;
		color: #212121;
		display: block;
		float: left;
		padding-left: 22px;
		margin-right: 15px;
		height: 22px;
		width: 144px;
	}
		#bertaVideos #videoLinks .links a.selected {
			background-image: url('../layout/berta_video_button_active.png');
			color: #999;
			text-decoration: underline;
		}
		#bertaVideos #videoLinks .links a.row-last {
			margin-right: 0;
		}

	#bertaVideos #frameSettings .closeFrameWrapper {
		position: absolute;
		right: 0; bottom: 0;
	}
		#bertaVideos #frameSettings .closeFrameWrapper a.closeFrame {
			background-color: #000;
			color: #fff;
			display: block;
			-webkit-border-radius: 4px;
			-moz-border-radius: 4px;
			border-radius: 4px;
			font-size: 14px;
			font-weight: bold;
			padding: 2px 0;
			text-align: center;
			/*height: 16px;*/
			width: 100px;
		}
			#bertaVideos #frameSettings a.closeFrame:hover {
				text-decoration: none;
				-moz-box-shadow: 0 0 8px #000;
	  			-webkit-box-shadow: 0 0 8px #000;
	  			box-shadow: 0 0 8px #000;
			}

	#bertaVideos #frameSettings .togglePopupWrapper {
		color: #999;
		position: absolute;
		left: 0; bottom: 0;
	}
		#bertaVideos #frameSettings .togglePopupWrapper input,
		#bertaVideos #frameSettings .togglePopupWrapper label {
			cursor: pointer;
		}

	#bertaVideos #videosError {
		text-align: center;
	}


/* middle-align containers ------------------------------------------------------------------------------------------- */

.xMAlign-container {
	display: table;
}
	.xMAlign-outer {
		display: table-cell;
		vertical-align: middle;
		text-align: center;
		top: 50%;
	}
		.xMAlign-inner {
			display: block;
			top: -50%;
			text-align: center;
		}

.ie6 .xMAlign-container {
	display: block !important;
	top: 0 !important;
}
	.ie6 .xMAlign-outer {
		display: block !important;
		top: 0 !important;
		position: static;
	}




/* visuals ---------------------------------------------------------------------------------------------- */

.xSaving, .xSavingAtLarge {	/* classs is added to the element, when the contents are being saved */
	background-image: url(<?php echo $ENGINE_ABS_ROOT ?>layout/saving.gif) !important;
	background-repeat: repeat !important;
}
	.xSavingAtLarge * {
		opacity: 0.5;
		-moz-opacity: 0.5;
	}

.xEditing {	/* class is added to the element when it is being edited by user */
	/*background-color:#FFFFFF !important;
	color: #000000 !important;*/
	background-image: none !important;
	z-index: 1;
}

.xEmpty {	/* class of the span that is placed inside empty editable elements */
	display: inline-block;
	background: url('<?php echo $ENGINE_ABS_ROOT ?>layout/editable-back.png') repeat;
	font-style: italic;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	border-radius: 5px;
	cursor: default !important;
	color: #333 !important;
	/*padding: 2px 2px;
	margin: -2px 0 0;*/
	/*cursor: cell;*/
}

.xHidden {
	display: none !important;
}

.xSysCaption {
	/* anu caption that has to produce system-like feeling  */
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-size: 13px;
	font-weight: bold;
}

.xVisualStatusOK { color: #00cc00; }
.xVisualStatusWarning { color: #cccc00; }
.xVisualStatusFail { color: #ee0000; font-weight: bold; }




/* editables ---------------------------------------------------------------------------------------------- */

.xEditable,
.xEditableColor
.xEditableSelect,
.xEditableSelectRC,
.xEditableFontSelect,
.xEditableTA,
.xEditableMCE,
.xEditableRC {
	cursor: default;
}

.xEditableSelect:before,
.xEditableSelectRC:before,
.xEditableFontSelect:before {
	content: url('../layout/drop-down.gif');
}
.xEditing.xEditableSelect:before,
.xEditing.xEditableSelectRC:before,
.xEditing.xEditableFontSelect:before {
	content: "";
}

.xAction {
	cursor:pointer;
}

.xEditable:hover,
.xEditableColor:hover,
.xEditableSelect:hover,
.xEditableSelectRC:hover,
.xEditableFontSelect:hover,
.xEditableTA:hover,
.xEditableMCE:hover,
.xEditableRC:hover,
.xEditableYesNo:hover,
.xAction:hover {
	background: url('../layout/editable-back.png') repeat;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	border-radius: 5px;
	/*outline: 1px solid #FFFF99;*/
}
.xEditableDragXY {
	cursor: move;
}

.xEditableRealCheck {

}
	.xEditableRealCheck input {
		width: 18px;
		height: 18px;
		border: none;
		padding: 0; margin: 0;
		background: url('../layout/icon-checkbox.png') no-repeat 50% 50%;
		outline: none;
	}
	.xEditableRealCheck input.checked {
		background-image: url('../layout/icon-checkbox-checked.png');
	}


/*a.xEditorLink, a.xEditorLink * {
	text-decoration: underline;
}*/
.xEditableImage {}
.xEditableICO {}
	.xEditableImage span.file, .xEditableICO span.file, .xEditableImage span.name, .xEditableICO span.name {
		display: block;
		float: left;
		margin-right: 10px;
	}
	.xEditableImage a, .xEditableICO a {
		display: block;
		float: left;
		margin-right: 10px;
	}

.xEditableYesNo {}
	.xEditableYesNo a {
		font-weight: normal;
		outline: none;
	}
	.xEditableYesNo a.active {
		font-weight: bold !important;
		text-transform: uppercase;
		text-decoration: none !important;
	}



/* panel csss ------------------------------------------------------------------------------------------- */

.xPanel {
	/* any block element that is an editor for something */
	background-color: #fff;
	color: #333;
}
	.xPanel * {
		font-family: Arial, sans-serif;
		font-size: 12px;
		line-height: 15px;
		text-transform: none;
		text-decoration: none;
		font-weight: normal;
	}
	.xPanel p { margin: 0 0 10px; padding: 0; }
	.xPanel a { color: #666; text-decoration: underline !important; }
	.xPanel a:hover { color: #999; }
	.xPanel b, .xPanel strong, .xPanel b *, .xPanel strong * { font-weight: bold; }
	.xPanel i, .xPanel em, .xPanel i *, .xPanel em * { font-style: italic; }

	.xPanel .xGreyBack a { color: #333; }
	.xPanel .xGreyBack a:hover { color: #666; }









.xMoveImNavLink, .xMoveTopLink, .xDeleteTopLink, .xAddTopLink, .xShowTopLink, .xHideTopLink, .xSelectTopLinkOn, .xSelectTopLinkOff {
	display: block;
	float: left;
	width: 9px;
	height: 9px;
	margin: 2px 4px 0 0;
	font-size: 1px; line-height: 1px;
}
.xMoveImNavLink { background: url(<?php echo $ENGINE_ROOT ?>layout/grab-small.png) no-repeat; cursor: move; }
.xMoveTopLink { background: url(<?php echo $ENGINE_ROOT ?>layout/grab-small.png) no-repeat; cursor: move; }
.xDeleteTopLink { background: url(<?php echo $ENGINE_ROOT ?>layout/delete-small.png) no-repeat; cursor: pointer; }
.xAddTopLink { background: url(<?php echo $ENGINE_ROOT ?>layout/add-small.png) no-repeat; cursor: pointer; margin-left: 20px; }
.xSelectTopLinkOn { background: url(<?php echo $ENGINE_ROOT ?>layout/select-small-on.gif) no-repeat; cursor: default; }
.xSelectTopLinkOff { background: url(<?php echo $ENGINE_ROOT ?>layout/select-small-off.gif) no-repeat; cursor: default; }




















/* top panel ----------------------------------------------------------------------------------------------- */

#xTopPanelContainer {
 	margin-top: 0;
	margin-bottom: 0;
	position: fixed;
	left: 0; top: 0;
	background-color: transparent !important;
	z-index: 2001;
}
.xSettingsPageBody #xTopPanelContainer {
	position: absolute;
}
	#xTopPanel {
		max-width: 600px;
		z-index: 60000;
		position: relative;
		text-align: left !important;
		top: 0;
		background: rgb(54, 54, 54);
		background: rgba(54, 54, 54, 0.8);
	}

		#xNewsTickerContainer {
			position: relative;
			padding: 16px 8px;
			border-right: 1px solid #4a4a4a;
			border-bottom: 1px solid #4a4a4a;
			background: rgb(255, 255, 255);
			background: rgba(255, 255, 255, 0.8);
		}

			#xNewsTickerContainer * {
				color: #333;
			}
			#xNewsTickerContainer>* { z-index: 10; position: relative; }

			#xNewsTickerContainer .news-ticker-content {
				float: left;
				color: #333;
			}
				#xNewsTickerContainer .news-ticker-content .run-in {
					font-weight: bold;
				}

			#xNewsTickerContainer a.close {
				color: #666666;
				font-size: 100%;
				position: absolute; top: 0; right: 3px;
				text-decoration: none !important;
				font-weight: bold;
			}

		ul#xEditorMenu {
			position: relative;
			display: block;
			margin: 0;
			padding: 2px 6px;
			height: 15px;
			list-style: none;
		}
			ul#xEditorMenu li {
				position: relative;
				float: left;
				padding-right: 10px;
				z-index: 10;
				color: #E9E9E9;
			}
				ul#xEditorMenu li a {
					text-decoration: none !important;
					color: #E9E9E9;
				}

				ul#xEditorMenu li a:hover { color: #000; }

			ul#xEditorMenu li.selected, ul#xEditorMenu li.selected a {
				font-weight: bold;
			}


	#xTopPanelSlideIn {
		position: relative;
		z-index: 2;
		padding: 2px 0 2px 4px;
		padding-left: 4px;
		width: 20px;
		top: -19px;
		margin-bottom: -19px;
		background-color: #4A4A4A;
		z-index: 60000;
		background: rgb(074, 074, 074);
		background: rgba(074, 074, 074, 0.9);
	}

		#xTopPanelSlideIn span,
		#xTopPanelSlideOut span {
			color: #E9E9E9;
			cursor: pointer;
		}

		#xTopPanelSlideIn span:hover,
		#xTopPanelSlideOut span:hover {
			color: #000;
		}








/* background editor ----------------------------------------------------------------------------------------------- */

#xBgEditorPanelTrigContainer {
	margin: 0;
 	padding: 0;
	position: fixed;
	right: 0; top: 0;
	background-color: transparent !important;
    display: block;
    height: 40px;
}
    #xBgEditorPanelTrigContainer a {
    	background: url('../layout/gallery_icons_sprite.png') no-repeat;
    	background-position: -280px 0px;
    	width: 40px;
    	height: 40px;
    	display: block;
    }
    	#xBgEditorPanelTrigContainer a:hover {
    		background-position: -280px -80px;
    	}

		#xBgEditorPanelTrigContainer a span {
			display: block;
			height: 40px;
		}
			#xBgEditorPanelTrigContainer a span { display: none; }

#xBgEditorPanelContainer {
 	margin: 0;
 	padding: 0;
	clear: both;
}

#xBgEditorPanelContainer #xBgEditorPanel {
    position: fixed;
    display: block;
    right: 0;
    top: 0;
    padding: 0;
    margin: 0;
    width: 430px;
    height: 327px;
    z-index: 55000;
	background-color: #e9e9e9;
	color: #333;
}

	/* containers */
	#xBgEditorPanel .xBgSettings,
	#xBgEditorPanel .xBgAddMedia,
	#xBgEditorPanel .xBgSlideshowSettings,
	#xBgEditorPanel .xBgImgSizeSettings {
		padding: 6px;
	}

		.xBgAddMedia .xBgAddImagesFallback {
		    display: block;
		}
		    .xBgUploadFrame {
		    	display: none;
		    }

		.xBgAddMedia a.xBgAddImagesLink {
		    padding-top: 6px;
		    display: block;
    	    width: 70px;
    	    text-decoration: none !important;
		}

		    .xBgAddMedia a.xBgAddImagesLink span {
		    	color: #000;
		    }

		    .xBgAddMedia a.xBgAddImagesLink.hover span {
    	        text-decoration: underline !important;
    	    }

		.xBgSettings {
			margin: 6px 0;
		}

			.xBgFadingSettings .caption {
				width: 200px;
				float: left;
			}

				.xBgFadingSettings .xBgFading,
				.xBgColorSettings .xBgFading select,
				.xBgButtonTypeSettings .xBgButtonType,
				.xBgButtonTypeSettings .xBgButtonType select {
					float: left;
					width: 100px;
				}

				.xBgButtonTypeSettings .xBgButtonType,
				.xBgButtonTypeSettings .xBgButtonType select {
					margin-top: 6px;
				}

			.xBgButtonTypeSettings .caption,
			.xBgColorSettings .caption {
				width: 200px;
				float: left;
				margin-top: 6px;
			}

				.xBgColorSettings .xBgColor {
					float: left;
					margin-top: 6px;
					width: 100px;
				}

				.xBgColor span.colorPreview {
					display: block;
					float: left;
					width: 1.2em;
					height: 1.2em;
					margin-right: 5px;
					cursor: pointer;
					border: 1px solid #000;
				}

				.xBgColorReset {
					float: left;
					margin-top: 6px;
					cursor: pointer;
				}
					.xBgColorReset a {
						color: #333;
						text-decoration: none !important;
					}
					.xBgColorReset a span:hover {
						text-decoration: underline;
					}

		.xBgImgSizeSettings,
		.xBgSlideshowSettings {
			margin: 6px 0;
		}

			.xBgImgSizeSettings .caption,
			.xBgSlideshowSettings .caption {
				width: 200px;
				float: left;
			}

			.xBgImgSizeSettings .xBgImgSize,
			.xBgImgSizeSettings .xBgImgSize select {
				width: 100px;
			}

			.xBgSlideshowSettings .xBgAutoPlay,
			.xBgSlideshowSettings .xBgAutoPlay input {
				width: 50px;
			}

			.xBgImgSizeSettings .xBgImgSize,
			.xBgImgSizeSettings .xBgImgSize select,
			.xBgSlideshowSettings .xBgAutoPlay,
			.xBgSlideshowSettings .xBgAutoPlay input {
				float: left;
			}

	/* tabs */
	#xBgEditorPanel .xBgEditorTabs {
		padding: 6px 6px 0;
		min-height: 40px;
		background-color: #4a4a4a;
	}

		.xBgEditorTabs .xBgMediaTab,
		.xBgEditorTabs .xBgSettingsTab,
		.xBgEditorTabs .xBgImgSizeSettingsTab,
		.xBgEditorTabs .xBgSlideshowSettingsTab {
			float: left;
			display: block;
			height: 40px;
		}

		.xBgEditorTabs .xBgMediaTab a,
		.xBgEditorTabs .xBgSettingsTab a,
		.xBgEditorTabs .xBgImgSizeSettingsTab a,
		.xBgEditorTabs .xBgSlideshowSettingsTab  a {
			float: left;
			display: block;
			margin-right: 4px;
			height: 40px;
			width: 40px;
			background-repeat: no-repeat;
		}

		.xBgEditorTabs .xBgMedia a span,
		.xBgEditorTabs .xBgMediaSettings a span,
		.xBgEditorTabs .xBgImgSizeSettings a span,
		.xBgEditorTabs .xBgSlideshowSettingsTab  a span {
			display: block;
			float: left;
			height: 40px;
		}

		.xBgEditorTabs a.xBgEditorCloseLink {
			float: right;
		    display: block;
		    text-decoration: none !important;
		}
		    .xBgEditorTabs a.xBgEditorCloseLink span {
		    	color: #e9e9e9;
		    	font-weight: bold;
		    }

		    .xBgEditorTabs a.xBgEditorCloseLink span:hover {
		    	color: #000;
		    }

		.xBgEditorTabs .xBgMediaTab a {
			background: url('../layout/gallery_icons_sprite.png') no-repeat;
			background-position: 0px -40px;

		}

			.xBgEditorTabs .xBgMediaTab a:hover {
				background-position: 0px -80px;
			}

			.xBgEditorTabs .xBgMediaTab a.selected {
				background-position: 0px 0px;
			}

		.xBgEditorTabs .xBgSettingsTab a {
			background: url('../layout/gallery_icons_sprite.png') no-repeat;
			background-position: -160px -40px;

		}

			.xBgEditorTabs .xBgSettingsTab a:hover {
				background-position: -160px -80px;
			}

			.xBgEditorTabs .xBgSettingsTab a.selected {
				background-position: -160px 0px;
			}

		.xBgEditorTabs .xBgImgSizeSettingsTab a {
			background: url('../layout/gallery_icons_sprite.png') no-repeat;
			background-position: -120px -40px;

		}

			.xBgEditorTabs .xBgImgSizeSettingsTab a:hover {
				background-position: -120px -80px;
			}

			.xBgEditorTabs .xBgImgSizeSettingsTab a.selected {
				background-position: -120px 0px;
			}

		.xBgEditorTabs .xBgSlideshowSettingsTab a {
			background: url('../layout/gallery_icons_sprite.png') no-repeat;
			background-position: -40px -40px;

		}

			.xBgEditorTabs .xBgSlideshowSettingsTab a:hover {
				background-position: -40px -80px;
			}

			.xBgEditorTabs .xBgSlideshowSettingsTab a.selected {
				background-position: -40px 0px;
			}

		.xBgEditorTabs .xBgMediaTab a span,
		.xBgEditorTabs .xBgSettingsTab a span,
		.xBgEditorTabs .xBgImgSizeSettingsTab a span,
		.xBgEditorTabs .xBgSlideshowSettingsTab a span {
			display: none;
		}

	/* images / videos */
	#xBgEditorPanel .images {
		clear: both;
		padding: 8px 6px 0;
		margin: 0;
		overflow-x:scroll;
		overflow-y:hidden;
		height: <?php echo BertaBase::$options['images']['small_thumb_height'] ? ((BertaBase::$options['images']['small_thumb_height'] + 160) . 'px') : 'auto' ?>;
	}
		#xBgEditorPanel .images ul {
			position: relative;
			width: auto;
			list-style: none;
			margin: 0;
			padding: 0;
		}
		#xBgEditorPanel .images ul.processing { }
		#xBgEditorPanel .images ul.sorting,
		#xBgEditorPanel .images ul.sorting * { cursor: -moz-grabbing !important; }

			#xBgEditorPanel .images ul li {
				display: block;
				position: relative;
				float: left;
				margin: 0 5px 0 0;
				/*margin: 0;*/
				min-width: 140px;
				height: <?php echo ((int) BertaBase::$options['images']['small_thumb_height'] + 140) . 'px' ?>;
				background: #efefef;
			}
			#xBgEditorPanel .images ul li.video {

			}
				#xBgEditorPanel .images ul li img {
					margin: 0 auto 0;
					display: block;
				}

			#xBgEditorPanel .images ul li.selected { }
				#xBgEditorPanel .images ul li.selected img {
					opacity: 0.7;
					-moz-opacity: 0.7;
				}

				/* delete button - trashcan */
				#xBgEditorPanel .images ul li .delete {
					display: block;
					position: absolute;
					visibility: hidden;
					top: 0;
					right: 0; /*5px;*/
					width: 15px;
					height: 15px;
					background: #fff url('../layout/trashbin.gif') no-repeat center center;
					border: 1px solid #333;
				}
				#xBgEditorPanel .images ul li .delete:hover {
					background-color: #9A0303;
				}
				#xBgEditorPanel .images ul li.hover .delete { visibility: visible; }
				#xBgEditorPanel .images ul.processing li .delete { visibility: hidden !important; }

				/* grab handle */
				#xBgEditorPanel .images ul li .grabHandle {
					visibility: hidden;
					position: absolute;
					top: 0; left: 0;
					width: 100%;
					height: <?php echo BertaBase::$options['images']['small_thumb_height'] . 'px' ?>;
					margin: 0; padding: 0;
				}
					#xBgEditorPanel .images ul li .grabHandle .xMAlign-inner {
						width: 25px; height: 25px;
						margin: 0 auto 0;
						cursor: move;
						border-radius: 5px;
						-moz-border-radius: 5px;
					}
					#xBgEditorPanel .images ul li.video .grabHandle .xMAlign-inner { margin-bottom: 20px; }
						#xBgEditorPanel .images ul li .grabHandle .xMAlign-inner span {
							display: block;
							width: 100%; height: 100%;
							background: transparent url('../layout/grab.gif') no-repeat center center;
						}
					#xBgEditorPanel .images ul li .grabHandle .xMAlign-inner:hover,
					#xBgEditorPanel .images ul li.grabbing .grabHandle .xMAlign-inner {
						background-image: url('../layout/semi-transparent.png');
						border: 1px solid #666;
					}
				#xBgEditorPanel .images ul li.hover .grabHandle { visibility: visible; }
				#xBgEditorPanel .images ul.processing li .grabHandle { visibility: hidden; }
				#xBgEditorPanel .images ul.processing li.grabbing .grabHandle { visibility: visible !important; }

				/* video placeholder and dimensions form */
				#xBgEditorPanel .images li .placeholderContainer {
					min-width: 100px;
					height: <?php echo BertaBase::$options['images']['small_thumb_height'] . 'px' ?>;
					background-position: center center;
					background-repeat: no-repeat;
					background-color: #000;
				}
					#xBgEditorPanel .images li .placeholder {
						min-width: 100px;
						height: 100%;
						background: url('../layout/movie.gif') center center repeat-x;
					}
				#xBgEditorPanel .images li .dimsForm {
					position: absolute;
					top: <?php echo ((int) BertaBase::$options['images']['small_thumb_height'] - 27) . 'px' ?>;
					/*bottom: 7px;*/
					width: 100%;
					padding: 2px 0;
					background-image: url('../layout/semi-transparent-white.png');
					text-align: center;
				}
					#xBgEditorPanel .images li .dimsForm .posterContainer {
						position: relative;
					}
					#xBgEditorPanel .images li .dimsForm a.poster {
						display: block;
						width: 100%;
						height: 16px;
						margin: 0 0 2px;
						text-align:center;
						font-size: 10px;
						color: #333;
					}
					#xBgEditorPanel .images li .dimsForm a.poster:hover { color: #666; }
					#xBgEditorPanel .images li .dimsForm span.dim {
						display: inline-block;
						min-width: 25px;
						margin: 0 2px;
						font-size: 10px;
					}
						#xBgEditorPanel .images li .dimsForm span.dim * { font-size: 10px; }
						#xBgEditorPanel .images li .dimsForm span.dim input { width: 30px !important; padding: 0 !important; border: 1px solid #666; }

				#xBgEditorPanel .images li .xEGEImageCaption {
					width: 150px;
					height: 135px;
					overflow-y: hidden;
					margin-top: 3px;
					font-size: 90%;
				}
					#xBgEditorPanel .images li .xEGEImageCaption * {
						font-size: 90%;
					}

			#xBgEditorPanel .images ul li.file {
				width: 160px;
				height: 80px;
				padding: 0;
				margin: 0 5px 0 0;
				background-color: #666;
				background-image: url('../layout/gallery-loader.gif');
				background-position: 100% 0%;
				background-repeat: no-repeat;
				overflow: hidden;
			}
				#xBgEditorPanel .images ul li.file .file-remove { display: none; }
				#xBgEditorPanel .images ul li.file .file-name { display: block; margin: 5px; }
				#xBgEditorPanel .images ul li.file .file-info { display: none; }
			#xBgEditorPanel .images ul li.file-complete {
				background-position: 0% 0%;
			}
			#xBgEditorPanel .images ul li.file-failed {
				background-image: none;
				background-color: #A00;
				color: #fff;
			}
				#xBgEditorPanel .images ul li.file-failed .file-info { display: block; margin: 5px; }
			#xBgEditorPanel .images ul li.file-uploading {

			}









/* entries --------------------------------------------------------------------------------------------------- */

ul#pageEntries {

}
	.xEntry {	}
	.xEntryHover { }

		.xEntryEditWrap {

		}
		.xEntryHover .xEntryEditWrap {

		}

		.xEntryEditWrapButtons {
			visibility: hidden;
			height: 20px;
			margin: -26px 0 0 0;
			background: transparent url('../layout/bg-entry-header.png') repeat;
			padding: 2px 0 2px 5px;
			-moz-border-radius: 8px;
			-webkit-border-radius: 8px;
			border-radius: 8px;
		}
		.xEntryHover .xEntryEditWrapButtons {
			visibility: visible;
		}

			.xEntryEditWrapButtons a {
				float: left;
				width: 18px;
				height: 18px;
				padding: 1px;
				margin-right: 5px;
				border: none;
				background-color: transparent !important;
				background-position: center center;
				background-repeat: no-repeat;
			}
				.xEntryEditWrapButtons a span { display: none; }
			.xEntryEditWrapButtons a:hover {
				border: 1px solid #ccc;
				background-color: #fff;
				padding: 0px;
			}

			.xEntryEditWrapButtons a.xEntryDelete { background-image: url('../layout/icon-delete.png'); }

			.xEntryEditWrapButtons a.xEntryMove { background-image: url('../layout/icon-move-vertical.png'); cursor: grab; }
			.xEntryEditWrapButtons a.xEntryMoveForbidden { background-image: url('../layout/icon-move-vertical.png'); cursor: default; opacity: 0.4; -moz-opacity: 0.4; }
			.xNoEntryOrdering a.xEntryMove { display: none; }
			.xNoEntryOrdering a.xEntryMoveForbidden { display: none; }

			.xEntryEditWrapButtons .xEntryCheck {
				float: right;
				margin-top: 1px;
			}

			.xEntryEditWrapButtons .xEntryDropdown {
				float: right;
				background: url('../layout/dropdown_sprite.png') no-repeat center 0;
				width: 28px;
				height: 100%;
				cursor: pointer;
			}

			.xEntryEditWrapButtons .xEntryDropdowHover {
				background-position: center -20px;
			}

			.xEntryDropdownBox {
				position: absolute;
				border: 1px solid #666666;
				background-color: #fff;
				z-index: 56000;
				display: none;
				background: rgba(255, 255, 255, 0.96);
			}

			.xEntryDropdownBox ul {
				padding:0;
				margin:0;
				list-style: none;
				white-space: nowrap;
			}

			.xEntryDropdownBox ul li .customWidth,
			.xEntryDropdownBox ul li a {
				color: #000;
				text-decoration: none;
				display: block;
				padding: 0 18px;
				line-height: 22px;
			}

			.xEntryDropdownBox .customWidth {
				height: 22px;

			}

			.xEntryDropdownBox .customWidth input {
				display: block;
				width: 100%;
			}

			.xEntryDropdownBox ul li:hover {
				background-color: #666666;
				color: #fff;
			}

			.xEntryDropdownBox ul li:hover div,
			.xEntryDropdownBox ul li:hover a {
				color: #fff;
			}

			.xEntryDropdownBox ul li .xEntryCheck {
				position: relative;
				left: -18px;
			}

			.xEntryDropdownBox ul li .xEntryCheck label {
				vertical-align: top;
			}

			.xEntryDropdownBox .xEditableRealCheck input {
				background: none;
				width: 18px;
			}

			.xEntryDropdownBox .xEditableRealCheck input.checked {
				background: url('../layout/check.png') no-repeat center 0;
			}

			.xEntryDropdownBox ul li:hover input.checked {
				background: url('../layout/check.png') no-repeat center -22px;
			}

			.tagsList {
			    float: left;
			    padding-top: 3px;
			    width: 50%;
			    height: 18px;
				overflow: hidden;
				white-space: nowrap;

			}

			.tagsList .xEmpty{
				background: none;
			}

			.xPanel .tagsList {
				font-style: italic;
			}


		.xGalleryContainer  {
			/*width: 100%;*/
			clear: left;
			min-height: 20px;
		}
			.xGalleryContainer .entryGallery {
				position: relative;
			}
			.xGalleryContainer .imageEmpty {
				position: relative;
				width: 100%;
				height: 20px;
			}
				.xGalleryContainer a.xGalleryEditButton {

				}
				.xGalleryHasImages a.xGalleryEditButton {
					position: absolute;
					width: 100%; height: 100%;
					left: 0; top: 0;
					/*z-index: 100;*/
					background: url('<?php echo $ENGINE_ABS_ROOT ?>layout/editable-back.png') repeat;
					-moz-opacity: 0; opacity: 0;
				}
				.xGalleryHasImages a.xGalleryEditButton:hover {
					-moz-opacity: 1; opacity: 1;
				}

				.xGalleryContainer .entryGallery div.item {
					display: block;
					z-index: 1;
				}
				.xGalleryContainer.xSavingAtLarge div.item {
					visibility: hidden;
				}







a.xCreateNewEntry {
	display: block;
	height: 24px;
	background: transparent;
	margin: 0 0 28px;
	-moz-border-radius: 8px;
	-webkit-border-radius: 8px;
	border-radius: 8px;
}
	a.xCreateNewEntry span {
		display: block;
		width: 100%;
		height: 20px;
		padding: 3px 0 1px;

		background: transparent url('../layout/clickable-back.png') repeat;
		-moz-border-radius: 8px;
		-webkit-border-radius: 8px;
		border-radius: 8px;

		text-align: center;
		color: #333 !important;
		text-decoration: none !important;
	}
a.xCreateNewEntry:hover {
	background: transparent url('../layout/clickable-back.png') repeat;
}
a.xCreateNewEntry.xSaving {
	background-color: #B7FFCA;
}
	a.xCreateNewEntry.xSaving span {
		background-image: none;
		background-color: transparent;
	}






/* gallery --------------------------------------------------------------------------------------------------- */

.xEntryGalleryEditor-wrap {
	clear: both;
	margin: 5px 0 5px -3px;
	min-width: 580px;
}
.xEntryGalleryEditor {
	padding: 0;
	background-color: #e9e9e9;
	color: #333;
	width: 700px;
	height: 327px;
    position: relative;
    z-index: 55000;
}

	.xEntryGalleryEditor .xEntryGallerySettings,
	.xEntryGalleryEditor .xEntryGalleryFullScreen,
	.xEntryGalleryEditor .xEntryGalleryImageSize {
		padding: 6px;
	}

		.xEntryGalleryEditor .xEntryGalleryAddMedia {
			padding: 6px;
		}

		.xEntryGalleryAddMedia .xEntryAddImagesFallback {
			display: block;
		}
			.xEntryGalleryAddMedia .xEntryAddImagesFallback .xUploadFile {}
			.xEntryGalleryAddMedia .xEntryAddImagesFallback .xUploadButton {}
			.xEntryUploadFrame {
				display: none;
			}

		.xEntryGalleryAddMedia a.xEntryAddImagesLink {
			padding-top: 6px;
			display: block;
            width: 70px;
            text-decoration: none !important;
		}

			.xEntryGalleryAddMedia a.xEntryAddImagesLink span {
				color: #000;
			}

			.xEntryGalleryAddMedia a.xEntryAddImagesLink.hover span {
                text-decoration: underline !important;
            }

		.xEntryGalleryEditor .xEntryGalleryMenu {
			padding: 6px 6px 0;
			min-height: 40px;
			background-color: #4a4a4a;
		}

		.xEntryGalleryMenu .xEntryMedia,
		.xEntryGalleryMenu .xEntryMediaSettings,
		.xEntryGalleryMenu .xEntryFullScreenSettings,
		.xEntryGalleryMenu .xEntryImageSizeSettings {
			float: left;
			display: block;
			height: 40px;
		}

		.xEntryGalleryMenu .xEntryMedia a,
		.xEntryGalleryMenu .xEntryMediaSettings a,
		.xEntryGalleryMenu .xEntryFullScreenSettings a,
		.xEntryGalleryMenu .xEntryImageSizeSettings a {
			float: left;
			display: block;
			margin-right: 4px;
			height: 40px;
			width: 40px;
			background-repeat: no-repeat;
		}

		.xEntryGalleryMenu .xEntryMedia a span,
		.xEntryGalleryMenu .xEntryMediaSettings a span,
		.xEntryGalleryMenu .xEntryFullScreenSettings a span,
		.xEntryGalleryMenu .xEntryImageSizeSettings a span {
			display: block;
			float: left;
			height: 40px;
		}

		.xEntryGalleryMenu .xEntryMedia a {
			background: url('../layout/gallery_icons_sprite.png') no-repeat;
			background-position: 0px -40px;

		}

			.xEntryGalleryMenu .xEntryMedia a:hover {
				background-position: 0px -80px;
			}

			.xEntryGalleryMenu .xEntryMedia a.selected {
				background-position: 0px 0px;
			}

		.xEntryGalleryMenu .xEntryMediaSettings a {
			background: url('../layout/gallery_icons_sprite.png') no-repeat;
			background-position: -40px -40px;

		}

			.xEntryGalleryMenu .xEntryMediaSettings a:hover {
				background-position: -40px -80px;
			}

			.xEntryGalleryMenu .xEntryMediaSettings a.selected {
				background-position: -40px 0px;
			}

		.xEntryGalleryMenu .xEntryFullScreenSettings a {
			background: url('../layout/gallery_icons_sprite.png') no-repeat;
			background-position: -80px -40px;
		}

			.xEntryGalleryMenu .xEntryFullScreenSettings a:hover {
				background-position: -80px -80px;
			}

			.xEntryGalleryMenu .xEntryFullScreenSettings a.selected {
				background-position: -80px 0px;
			}

		.xEntryGalleryMenu .xEntryImageSizeSettings a {
			background: url('../layout/gallery_icons_sprite.png') no-repeat;
			background-position: -120px -40px;
		}

			.xEntryGalleryMenu .xEntryImageSizeSettings a:hover {
				background-position: -120px -80px;
			}

			.xEntryGalleryMenu .xEntryImageSizeSettings a.selected {
				background-position: -120px 0px;
			}


		.xEntryGalleryMenu .xEntryMedia a span,
		.xEntryGalleryMenu .xEntryMediaSettings a span,
		.xEntryGalleryMenu .xEntryFullScreenSettings a span,
		.xEntryGalleryMenu .xEntryImageSizeSettings a span {
				display: none;
		}

		.xEntryGallerySettings .xEntrySlideshowSettings,
		.xEntryGallerySettings .xEntryLinkSettings {
			margin: 16px 0;
		}

			.xEntryGalleryEditor .caption {
				width: 200px;
				float: left;
			}

			.xEntryGalleryEditor .xFloatLeft,
			.xEntryGalleryEditor .xFloatLeft input {
				float: left;
			}

			.xEntryGallerySettings>.caption,
			.xEntryGalleryFullScreen>.caption,
			.xEntryGalleryImageSize>.caption {
				padding: 6px 0;
			}

			.xEntryGallerySettings .xEntrySetGalType,
			.xEntryGallerySettings .xEntrySetGalType input,
			.xEntryGalleryFullScreen .xEntrySetFullScreen,
			.xEntryGalleryFullScreen .xEntrySetFullScreen input,
			.xEntryGalleryImageSize .xEntrySetImageSize,
			.xEntryGalleryImageSize .xEntrySetImageSize input {
				margin: 6px 0;
			}

			.xEntrySlideshowSettings .xEntryAutoPlay {
				width: 50px;
			}

			.xEntryLinkSettings .xEntryLinkAddress {
				width: 200px;
			}

			.xEntryGalleryFullScreen .xEntrySetFullScreen,
			.xEntryGalleryImageSize .xEntrySetImageSize,
			.xEntrySlideshowSettings .xEntrySlideNumberVisibility {
				width: 80px;
			}
			.xEntryGallerySettings .xEntrySetGalType,
			.xEntryGallerySettings .xEntryLinkTarget {
				width: 140px;
			}

		.xEntryGalleryMenu a.xEntryGalCloseLink {
			float: right;
			display: block;
			text-decoration: none !important;
		}
			.xEntryGalleryMenu a.xEntryGalCloseLink span {
				color: #e9e9e9;
				font-weight: bold;
			}

			.xEntryGalleryMenu a.xEntryGalCloseLink span:hover {
				color: #000;
			}


	.xEntryGalleryEditor .images {
		clear: both;
		padding: 8px 6px 0;
		margin: 0;
		overflow-x:scroll;
		overflow-y:hidden;
		height: <?php echo BertaBase::$options['images']['small_thumb_height'] ? ((BertaBase::$options['images']['small_thumb_height'] + 160) . 'px') : 'auto' ?>;
	}
		.xEntryGalleryEditor .images ul {
			position: relative;
			width: auto;
			list-style: none;
			margin: 0;
			padding: 0;
		}
		.xEntryGalleryEditor .images ul.processing { }
		.xEntryGalleryEditor .images ul.sorting,
		.xEntryGalleryEditor .images ul.sorting * { cursor: -moz-grabbing !important; }

			.xEntryGalleryEditor .images ul li {
				display: block;
				position: relative;
				float: left;
				margin: 0 5px 0 0;
				/*margin: 0;*/
				min-width: 140px;
				height: <?php echo ((int) BertaBase::$options['images']['small_thumb_height'] + 140) . 'px' ?>;
				background: #efefef;
			}
			.xEntryGalleryEditor .images ul li.video {

			}
				.xEntryGalleryEditor .images ul li img {
					margin: 0 auto 0;
					display: block;
				}

			.xEntryGalleryEditor .images ul li.selected { }
				.xEntryGalleryEditor .images ul li.selected img {
					opacity: 0.7;
					-moz-opacity: 0.7;
				}

				/* delete button - trashcan */
				.xEntryGalleryEditor .images ul li .delete {
					display: block;
					position: absolute;
					visibility: hidden;
					top: 0;
					right: 0; /*5px;*/
					width: 15px;
					height: 15px;
					background: #fff url('../layout/trashbin.gif') no-repeat center center;
					border: 1px solid #333;
				}
				.xEntryGalleryEditor .images ul li .delete:hover {
					background-color: #9A0303;
				}
				.xEntryGalleryEditor .images ul li.hover .delete { visibility: visible; }
				.xEntryGalleryEditor .images ul.processing li .delete { visibility: hidden !important; }

				/* grab handle */
				.xEntryGalleryEditor .images ul li .grabHandle {
					visibility: hidden;
					position: absolute;
					top: 0; left: 0;
					width: 100%;
					height: <?php echo BertaBase::$options['images']['small_thumb_height'] . 'px' ?>;
					margin: 0; padding: 0;
				}
					.xEntryGalleryEditor .images ul li .grabHandle .xMAlign-inner {
						width: 25px; height: 25px;
						margin: 0 auto 0;
						cursor: move;
						border-radius: 5px;
						-moz-border-radius: 5px;
					}
					.xEntryGalleryEditor .images ul li.video .grabHandle .xMAlign-inner { margin-bottom: 20px; }
						.xEntryGalleryEditor .images ul li .grabHandle .xMAlign-inner span {
							display: block;
							width: 100%; height: 100%;
							background: transparent url('../layout/grab.gif') no-repeat center center;
						}
					.xEntryGalleryEditor .images ul li .grabHandle .xMAlign-inner:hover,
					.xEntryGalleryEditor .images ul li.grabbing .grabHandle .xMAlign-inner {
						background-image: url('../layout/semi-transparent.png');
						border: 1px solid #666;
					}
				.xEntryGalleryEditor .images ul li.hover .grabHandle { visibility: visible; }
				.xEntryGalleryEditor .images ul.processing li .grabHandle { visibility: hidden; }
				.xEntryGalleryEditor .images ul.processing li.grabbing .grabHandle { visibility: visible !important; }

				/* video placeholder and dimensions form */
				.xEntryGalleryEditor .images li .placeholderContainer {
					min-width: 100px;
					height: <?php echo BertaBase::$options['images']['small_thumb_height'] . 'px' ?>;
					background-position: center center;
					background-repeat: no-repeat;
					background-color: #000;
				}
					.xEntryGalleryEditor .images li .placeholder {
						min-width: 100px;
						height: 100%;
						background: url('../layout/movie.gif') center center repeat-x;
					}
				.xEntryGalleryEditor .images li .dimsForm {
					position: absolute;
					top: <?php echo ((int) BertaBase::$options['images']['small_thumb_height'] - 27) . 'px' ?>;
					/*bottom: 7px;*/
					width: 100%;
					padding: 2px 0;
					background-image: url('../layout/semi-transparent-white.png');
					text-align: center;
				}
					.xEntryGalleryEditor .images li .dimsForm .posterContainer {
						position: relative;
					}
					.xEntryGalleryEditor .images li .dimsForm a.poster {
						display: block;
						width: 100%;
						height: 16px;
						margin: 0 0 2px;
						text-align:center;
						font-size: 10px;
						color: #333;
					}
					.xEntryGalleryEditor .images li .dimsForm a.poster:hover { color: #666; }
					.xEntryGalleryEditor .images li .dimsForm span.dim {
						display: inline-block;
						min-width: 25px;
						margin: 0 2px;
						font-size: 10px;
					}
						.xEntryGalleryEditor .images li .dimsForm span.dim * { font-size: 10px; }
						.xEntryGalleryEditor .images li .dimsForm span.dim input { width: 30px !important; padding: 0 !important; border: 1px solid #666; }

				.xEntryGalleryEditor .images li .xEGEImageCaption {
					width: 150px;
					height: 135px;
					overflow-y: hidden;
					margin-top: 3px;
					font-size: 90%;
				}
					.xEntryGalleryEditor .images li .xEGEImageCaption * {
						font-size: 90%;
					}

			.xEntryGalleryEditor .images ul li.file {
				width: 160px;
				height: 80px;
				padding: 0;
				margin: 0 5px 0 0;
				background-color: #666;
				background-image: url('../layout/gallery-loader.gif');
				background-position: 100% 0%;
				background-repeat: no-repeat;
				overflow: hidden;
			}
				.xEntryGalleryEditor .images ul li.file .file-remove { display: none; }
				.xEntryGalleryEditor .images ul li.file .file-name { display: block; margin: 5px; }
				.xEntryGalleryEditor .images ul li.file .file-info { display: none; }
			.xEntryGalleryEditor .images ul li.file-complete {
				background-position: 0% 0%;
			}
			.xEntryGalleryEditor .images ul li.file-failed {
				background-image: none;
				background-color: #A00;
				color: #fff;
			}
				.xEntryGalleryEditor .images ul li.file-failed .file-info { display: block; margin: 5px; }
			.xEntryGalleryEditor .images ul li.file-uploading {

			}

	.xEntryGalleryProps {
		clear: both;
		padding: 0;
		margin: 5px 0 0;
		display: none;
		/*min-height: 47px;*/
		border-top: 1px solid #ccc;
		overflow: hidden;
	}
			.xEntryGalleryProps .info-container {
				float: left;
				width: 230px;
				height: 37px;
				padding: 5px 5px;
				margin-right: 10px;
				background: #ccc;
				overflow: hidden;
			}
				.xEntryGalleryProps .info-container .fsize { color: #999999; }

			.xEntryGalleryProps .caption-container {
				float: left;
				width: auto;
				padding: 7px 5px;
			}
				.xEntryGalleryProps .caption-container .xEmpty {
					margin-top: 3px;
				}








.xImageContainer {
	float: <?php echo ($berta->settings->get('page-layout', 'content-align')) ?>;
	margin-right: 20px;
}

.xImageContainerEmpty {
	width: 1px;
	height: 100px;
}








/* login page ------------------------------------------------------------------------------------------------------- */

body.xLoginPageBody {
	width: 100%;
	height: 100%;
}
	body.xLoginPageBody .xMAlign-container {
		width: 100%;
		height: 100%;
	}
		body.xLoginPageBody .xMAlign-inner {
			width: 400px;
			margin-left: auto;
			margin-right: auto;
			padding: 30px;
		}
			body.xLoginPageBody h2, body.xLoginPageBody h3 {
				margin: 0 0 20px;
			}
			body.xLoginPageBody h2, body.xLoginPageBody h2 * {
				font-size: 42px;
				line-height: 100%;
			}
			body.xLoginPageBody h3, body.xLoginPageBody h3 * {
				font-size: 24px;
				line-height: 120%;
			}

			body.xLoginPageBody .emphasis {
				font-weight: bold;
			}

			body.xLoginPageBody .justify { text-align: justify; }
			body.xLoginPageBody form {
				display: block;
				width: 220px;
				margin: 0 auto 0;
			}

			body.xLoginPageBody form p {
                clear: both;
                color: #000000;
                padding-top: 30px;
            }

			body.xLoginPageBody .xLogout {
				display: block;
				width: 220px;
				margin: 0 auto 0;
			}

            body.xLoginPageBody .xLoginLogo {
                float: right;
                text-align: left;
                width: 205px;
                margin-bottom: 30px;
            }

			body.xLoginPageBody .xLoginError {
				display: block;
				float: right;
				clear: both;
				width: 200px;
				margin: 0 0 20px;
				text-align: right;
			}
			body.xLoginPageBody .error { }
			body.xLoginPageBody input.xLoginField {
				display: block;
				float: right;
				clear: both;
				width: 200px;
				margin: 0 0 5px;
			}
			body.xLoginPageBody input.xLoginSubmit {
				display: block;
				float: right;
				clear: both;
				width: 110px;
				margin: 0 0 5px;
			}

			body.xLoginPageBody .xBottomNote {
				clear: both;
				padding-top: 20px;
				font-size: 90%;
				color: #999;
			}
				body.xLoginPageBody .xBottomNote code {
					font-family: "Courier New", Courier, Monaco, mono;
					font-size: 10px;
				}





/* all that is needed for first time infos ------------------------------------------------------------------------------------ */

#xFirstTimeCheckList {
	text-align: left;
	list-style: none;
	margin: 0 -10px 10px; padding: 10px;

	border: 1px solid #999;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	border-radius: 5px;
}
	#xFirstTimeCheckList li {
		padding: 0;
		margin: 0 0 10px;
		clear: both;
	}
	#xFirstTimeCheckList li.indented {
		padding-left: 20px;
	}
		#xFirstTimeCheckList li .status {
			float: right;
			width: 50px;
			text-align: right;
		}

		#xFirstTimeCheckList li .infoFail {
			clear: both;
			color: #999;
			padding: 5px 50px 0 10px;
		}

#xFirstTimeCheckResult {
	padding: 40px 0 20px;
}

input#xFirstTimeCheckContinue {
	display: block;
	float: right;
	clear: both;
	width: 210px;
	margin: 10px 0 25px;
}

#xFirstTimeWizzard {

}
	#xFirstTimeWizzard p.subInfo { color: #999; margin-top: -6px; font-size: 90%; }
	#xFirstTimeWizzard p.xEditable {
		padding: 5px !important;
		margin-bottom: 20px !important;
	}
	#xFirstTimeWizzard p.xEditable:before {
		content: "› ";
	}
	#xFirstTimeWizzard p.xEditable, #xFirstTimeWizzard p.xEditable * { font-size: 16px !important;	}



/*  setttings pages  --------------------------------------------------------------------------------------- */

body.xSettingsPageBody {
	background: #fff !important;
	color: #333 !important;
	text-align: left;
}
	body.xSettingsPageBody #contentContainer {
		margin-left: 0;
		margin-right: auto;
		width: 980px;
	}

	body.xSettingsPageBody a { color: #666; text-decoration: underline !important; }
	body.xSettingsPageBody a:hover, body.xSettingsPageBody a.hover { color: #999; }

	body.xSettingsPageBody h1 { float: left; }

	body.xSettingsPageBody .settingsContentContainer {
		position: relative;
		clear: both;
		height: 500px;
		margin: 25px 0 10px;
	}

		body.xSettingsPageBody .settingsTabs {
			position: absolute;
			top: 0; left: 0;
			padding: 0;
			margin: 0;
			list-style: none;
		}
			body.xSettingsPageBody .settingsTabs li {
				float: left;
				padding: 0;
				margin: 0 5px 0 0;

			}
				body.xSettingsPageBody .settingsTabs li a {
					display: block;
					padding: 5px;
					height: 14px;
					border: 1px dotted #aaa;
					border-width: 1px 1px 0 1px;
					font-size: 12px;
					font-weight: normal;
					text-decoration: none !important;
					outline: none;
				}
				body.xSettingsPageBody .settingsTabs li a.active {
					border-bottom: 1px solid #fff;
				}

		body.xSettingsPageBody .settingsContent {
			position: absolute;
			left: 0; top: 0;
			border: 1px dotted #aaa;
			background: #fff;
			padding: 20px;
			-moz-opacity: 0;
			opacity: 0;
		}

	body.xSettingsPageBody div.entry {
		clear: both;
		width: 900px;
		padding-top: 5px;
		padding-bottom: 5px;
	}

		body.xSettingsPageBody div.entry div.caption {
			float: left;
			width: 200px;
			height: auto;
		}
		body.xSettingsPageBody div.entry div.value {
			float: left;
			width: 250px;
			height: auto;
			min-height: 1px;
			word-wrap: break-word;
		}
		body.xSettingsPageBody div.entry div.value-long {
			width: 430px;
		}
			body.xSettingsPageBody div.entry div.value span.colorPreview {
				display: block;
				float: left;
				width: 1.2em;
				height: 1.2em;
				margin-right: 5px;
				cursor: pointer;
				border: 1px solid #000;
			}
		body.xSettingsPageBody div.entry div.description {
			float: left;
			padding-left: 20px;
			width: 300px;
			color: #999;
		}


	body.xSettingsPageBody #editorInfo {
		/*margin: 10px 0 0;*/
		clear: both;
		/*float: <?php echo ($berta->settings->get('page-layout', 'content-align')) ?>;*/
		margin: <?php echo $berta->settings->get('page-layout', 'content-align') == 'left' ? '10px 0 0' : '10px 0 0 auto' ?>;
		padding-bottom: 0;
	}

		body.xSettingsPageBody #editorInfo #diffSlider {
			background: url(<?php echo $ENGINE_ROOT ?>layout/slider-back.gif) no-repeat;
			height: 8px;
			width: 300px;
		}
			body.xSettingsPageBody #editorInfo #diffKnob {
				background: url(<?php echo $ENGINE_ROOT ?>layout/slider-knob.gif) no-repeat;
				height: 8px;
				width: 90px;
				cursor: col-resize;
			}
		body.xSettingsPageBody #diffCaptions { clear: both; width: 300px; margin-top: 2px; }
			body.xSettingsPageBody #diffCaptions .c1 { float: left; width: 50%; text-align:left; }
			body.xSettingsPageBody #diffCaptions .c2 { float: left; width: 50%; text-align:right; }




	#xSectionsEditor {
		width: 960px;
		clear: both;
	}

		#xSectionsEditor ul {
			list-style: none;
			margin: 0;
			padding: 0;
		}
			#xSectionsEditor ul li {
				clear: both;
				padding: 10px 0 0;
			}
				#xSectionsEditor ul li > div {
					min-height: 1px;
				}

		#xSectionsEditor .listHead {
			font-weight: bold;
			padding: 0 0 3px;
			margin: 0 0 0px;
			border-bottom: 1px solid #ccc;
		}

		#xSectionsEditor ul, #xSectionsEditor .listHead {
			width: 100%;
		}
			#xSectionsEditor li div, #xSectionsEditor .listHead div {
				float: left;
				margin-right: 10px;
			}

		#xSectionsEditor ul>li:first-child { font-weight: bold; }

		#xSectionsEditor .csHandle { width: 30px; }
			#xSectionsEditor .csHandle .handle {
				display: block;
				width: 18px;
				height: 18px;
				background: url('../layout/grab.gif') no-repeat;
				cursor: move;
			}
			#xSectionsEditor ul.xSaving .csHandle .handle { visibility: hidden !important; }
		#xSectionsEditor .csTitle { width: 200px; }
		#xSectionsEditor .csBehaviour { width: 130px; }
		#xSectionsEditor .csDetails { width: 380px; }
		#xSectionsEditor .csPub { width: 100px; }
		#xSectionsEditor .csDelete { width: 50px; text-align: right; }
			#xSectionsEditor .csDelete a { color: #f00; }
			#xSectionsEditor ul.xSaving .csDelete a { visibility: hidden !important; }





		a#xCreateNewSection {
			display: block;
			clear: both;
			height: 18px;
			margin: 15px 0 0;
			padding: 3px 3px 3px 0;
			background: url('../layout/dashed-line.gif') repeat-x 50% 55%;
			-moz-border-radius: 5px;
			-webkit-border-radius: 5px;
			border-radius: 5px;
			-moz-opacity: 0.4;
		}
			a#xCreateNewSection span {
				display: block;
				/*float: left;*/
				width: 120px;
				padding: 0 3px 0;
				margin: 0 auto 0;
				background-color: #fff;
				text-align: center;
			}
		a#xCreateNewSection:hover {
			-moz-opacity: 1;
		}

.xGuideLine {
	position: absolute;
	background-color: #4affff;
	z-index: 10000000;
}

#xGuideLineX {
	height: 1px;
}

#xGuideLineY {
	width: 1px;
	top: 0px;
}


/*------------------------- inventory page --------------------------------*/

table.inventory {
	border-collapse: collapse;
}

table.inventory tr {
	border-bottom: 1px dotted black;
}

table.inventory tr.heading {
	border-bottom: 0;
}

table.inventory tr.outOfStock {
	background-color: #FFA9C5;
}

table.inventory tr td {
	padding: 5px;
}

table.inventory tr:first-child td h2 {
	margin-top: 0;
}

table.inventory tr td .add,
table.inventory tr td .remove {
	text-decoration: none !important;
}

#shoppingCartOuter {
	width: 655px;
}

#shoppingCartOuter .fr {
	float: none;
}





/* some helpers */

.xVisible {
	display: block;
}


<?php if(!1) { ?></style><?php } ?>