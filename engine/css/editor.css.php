<?

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

if(!1) { ?><style type="text/css"><? } ?>


#allContainer {
	/*width: 900px !important;*/
}
body.xEditorEnabled { }




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
	background-image: url(<? echo $ENGINE_ABS_ROOT ?>layout/saving.gif) !important;
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
}

.xEmpty {	/* class of the span that is placed inside empty editable elements */
	display: inline-block;
	background: url('<? echo $ENGINE_ABS_ROOT ?>layout/editable-back.png') repeat;
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


a.xEditorLink, a.xEditorLink * {
	text-decoration: underline;
}

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
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-size: 12px;
		line-height: 15px;
		text-transform: none;
		text-decoration: none;
		font-weight: normal;
		font-style: normal;
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
.xMoveImNavLink { background: url(<? echo $ENGINE_ROOT ?>layout/grab-small.png) no-repeat; cursor: move; }
.xMoveTopLink { background: url(<? echo $ENGINE_ROOT ?>layout/grab-small.png) no-repeat; cursor: move; }
.xDeleteTopLink { background: url(<? echo $ENGINE_ROOT ?>layout/delete-small.png) no-repeat; cursor: pointer; }
.xAddTopLink { background: url(<? echo $ENGINE_ROOT ?>layout/add-small.png) no-repeat; cursor: pointer; margin-left: 20px; }
.xSelectTopLinkOn { background: url(<? echo $ENGINE_ROOT ?>layout/select-small-on.gif) no-repeat; cursor: default; }
.xSelectTopLinkOff { background: url(<? echo $ENGINE_ROOT ?>layout/select-small-off.gif) no-repeat; cursor: default; }




















/* top panel ----------------------------------------------------------------------------------------------- */

#xTopPanelContainer {
	/*padding: 0 10px;*/
 	margin-top: 0;
	margin-bottom: 0;
	z-index: 11000;
	position: fixed;
	left: 0; top: 0; right: 0;
	margin-bottom: -20px;
	background-color: transparent !important;
}
.xSettingsPageBody #xTopPanelContainer {
	position: relative;
}
	#xTopPanel {
		width: 100%; /*<? echo $berta->settings->get('page-layout', 'content-width') ?>;*/
		border-bottom: 1px solid #ccc;
		text-align: left !important;
	}
	
		#xNewsTickerContainer {
			position: relative;
			padding: 5px 15px 1px;
		}
		.xNewsTickerRed {
			background-color: #FFA9C6;
		}
		.xNewsTickerGrey {
			background-color: #cccccc;
		}
		
			#xNewsTickerContainer * {
				color: #333;
			}
			#xNewsTickerContainer>* { z-index: 10; position: relative; }
			#xNewsTickerContainer .news-ticker-background {
				z-index: 1;
				position: absolute;
				left: 0; top: 0; bottom: 0; right: 0;
				-moz-opacity: 0.7;
				-webkit-opacity: 0.7;
				-o-opacity: 0.7;
				opacity: 0.7;
			}
			#xNewsTickerContainer .news-ticker-content {
				float: left;
				width: 80%;
				color: #333;
			}
				#xNewsTickerContainer .news-ticker-content .run-in {
					font-weight: bold;
				}
			#xNewsTickerContainer a.close {
				float: right;
				color: #666666;
				font-size: 100%;
			}
	
		ul#xEditorMenu {
			position: relative;
			display: block;
			margin: 0;
			padding: 2px 15px;
			height: 15px;
			list-style: none;
		}
			ul#xEditorMenu li {
				position: relative;
				float: left;
				margin-right: 10px;
				z-index: 10;
			}
				ul#xEditorMenu li a { text-decoration: none !important;  }
			ul#xEditorMenu li.selected, ul#xEditorMenu li.selected a {
				font-weight: bold;
			}
			ul#xEditorMenu li.last {
				float: right;
				margin-right: 0;
			}
			
			#xEditorMenuBg {
				float: none !important;
				position: absolute !important;
				z-index: 1 !important;
				left: 0; top: 0; right: 0; bottom: 0;
				-moz-opacity: 0.8;
				-webkit-opacity: 0.8;
				-o-opacity: 0.8;
				opacity: 0.8;
				background: #fff;
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
			margin: -26px 0 2px;
			background: transparent url('../layout/bg-entry-header.png') repeat;
			padding: 2px 5px 2px;
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
					background: url('<? echo $ENGINE_ABS_ROOT ?>layout/editable-back.png') repeat;
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
	backgrou1nd-color: #fff;
	margin: 5px 0 5px -3px;
	min-width: 580px;
}
.xEntryGalleryEditor {
	padding: 0 0 0;
	background-color: #fff;
	border: 1px solid #666;
	color: #333;
	width: 700px;
}

	.xEntryGalleryEditor .xEntryGalleryToolbar {
		min-height: 22px;
		padding: 4px;
		background-color: #666666;
	}
		.xEntryAddImagesFallback {
			height: 27px;
			float: left;
			padding: 1px 15px 0px 0;
			border-right: 1px solid #fff;
		}
			.xEntryAddImagesFallback .xUploadFile {
				
			}
			.xEntryAddImagesFallback .xUploadButton {
				
			}
			.xEntryUploadFrame {
				display: none;
			}
		.xEntryGalleryToolbar a.xEntryAddImagesLink {
			float: left;
			display: block;
			height: 21px;
            width: 70px;
            background: url('../layout/sprite.png') no-repeat;
			background-position: 0px 0px;
		}
		.xEntryGalleryToolbar a.xEntryAddImagesLink:hover,
		.xEntryGalleryToolbar a.xEntryAddImagesLink.hover {
			background-position: 0px -42px;
		}
			.xEntryGalleryToolbar a.xEntryAddImagesLink span {
				display: none;
			}
		.xEntryGalleryToolbar .xEntrySetGalType,
		.xEntryGalleryToolbar .xEntrySetImageSize,
        .xEntryGalleryToolbar .xEntryFullScreen	{
			float: left;
			display: block;
			height: 21px;
			margin-left: 4px;
		}
			.xEntryGalleryToolbar .xEntrySetGalType span,
			.xEntryGalleryToolbar .xEntrySetImageSize span,
            .xEntryGalleryToolbar .xEntryFullScreen span {
				display: block;
				float: left;
				height: 21px;
			}
			.xEntryGalleryToolbar .xEntrySetGalType a,
			.xEntryGalleryToolbar .xEntrySetImageSize a,
            .xEntryGalleryToolbar .xEntryFullScreen a {
				display: block;
				float: left;
				width: 21px;
				height: 21px;
				background-repeat: no-repeat
			}

            .xEntryGalleryToolbar .xEntrySetGalType a.o1.selected {
			    background-position: -70px -21px;
			}
			.xEntryGalleryToolbar .xEntrySetGalType a.o1 {
                background: url('../layout/sprite.png') no-repeat;
                background-position: -70px 0px;
                margin-right: 1px;
            }
			.xEntryGalleryToolbar .xEntrySetGalType a.o1:hover {
			    background-position: -70px -42px;
			}
			
            .xEntryGalleryToolbar .xEntrySetGalType a.o2.selected {
			    background-position: -91px -21px;
			}
			.xEntryGalleryToolbar .xEntrySetGalType a.o2 {
                background: url('../layout/sprite.png') no-repeat;
                background-position: -91px 0px;
                margin-right: 1px;
            }
			.xEntryGalleryToolbar .xEntrySetGalType a.o2:hover {
			    background-position: -91px -42px;
			}

            .xEntryGalleryToolbar .xEntrySetImageSize a.o1.selected {
			    background-position: -112px -21px;
			}
			.xEntryGalleryToolbar .xEntrySetImageSize a.o1 {
                background: url('../layout/sprite.png') no-repeat;
                background-position: -112px 0px;
                margin-right: 1px;
            }
			.xEntryGalleryToolbar .xEntrySetImageSize a.o1:hover {
			    background-position: -112px -42px;
			}

            .xEntryGalleryToolbar .xEntrySetImageSize a.o2.selected {
			    background-position: -133px -21px;
			}
			.xEntryGalleryToolbar .xEntrySetImageSize a.o2 {
                background: url('../layout/sprite.png') no-repeat;
                background-position: -133px 0px;
                margin-right: 1px;
            }
			.xEntryGalleryToolbar .xEntrySetImageSize a.o2:hover {
			    background-position: -133px -42px;
			}

            .xEntryGalleryToolbar .xEntryFullScreen a.selected {
			    background-position: -154px -21px;
			}
			.xEntryGalleryToolbar .xEntryFullScreen a {
                background: url('../layout/sprite.png') no-repeat;
                background-position: -154px 0px;
                margin-right: 1px;
            }
			.xEntryGalleryToolbar .xEntryFullScreen a:hover {
			    background-position: -154px -42px;
			}
			
				.xEntryGalleryToolbar .xEntrySetGalType a span,
				.xEntryGalleryToolbar .xEntrySetImageSize a span,
                .xEntryGalleryToolbar .xEntryFullScreen a span {
                    display: none;
                }

		.xEntryGalleryToolbar a.xEntryGalCloseLink {
			float: right;
			display: block;
			width: 21px;
			height: 21px;
			background: url('../layout/sprite.png') no-repeat;
			background-position: -175px 0px;
		}
		.xEntryGalleryToolbar a.xEntryGalCloseLink:hover {
			background-position: -175px -21px;
		}
			.xEntryGalleryToolbar a.xEntryGalCloseLink span { display: none; }


	.xEntryGalleryEditor .images {
		clear: both;
		padding: 5px 0 0;
		margin: 0 5px 3px;
		overflow-x:scroll;
		overflow-y:hidden;
		height: <? echo BertaBase::$options['images']['small_thumb_height'] ? ((BertaBase::$options['images']['small_thumb_height'] + 160) . 'px') : 'auto' ?>;
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
				height: <? echo ((int) BertaBase::$options['images']['small_thumb_height'] + 160) . 'px' ?>;
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
					height: <? echo BertaBase::$options['images']['small_thumb_height'] . 'px' ?>;
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
					height: <? echo BertaBase::$options['images']['small_thumb_height'] . 'px' ?>;
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
					top: <? echo ((int) BertaBase::$options['images']['small_thumb_height'] - 27) . 'px' ?>;
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
	float: <? echo ($berta->settings->get('page-layout', 'content-align')) ?>;
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
						
			body.xLoginPageBody .xLogout {
				display: block;
				width: 220px;
				margin: 0 auto 0;
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
	.xFirstTimeField { 
		padding: 5px !important; 
		margin-bottom: 20px !important; 
	}
	.xFirstTimeField:before {
		content: "› ";
	}
	.xFirstTimeField, .xFirstTimeField * { font-size: 16px !important;	}







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
		/*float: <? echo ($berta->settings->get('page-layout', 'content-align')) ?>;*/
		margin: <? echo $berta->settings->get('page-layout', 'content-align') == 'left' ? '10px 0 0' : '10px 0 0 auto' ?>;
		padding-bottom: 0;
	}
	
		body.xSettingsPageBody #editorInfo #diffSlider {
			background: url(<? echo $ENGINE_ROOT ?>layout/slider-back.gif) no-repeat;
			height: 8px;
			width: 300px;
		}
			body.xSettingsPageBody #editorInfo #diffKnob {
				background: url(<? echo $ENGINE_ROOT ?>layout/slider-knob.gif) no-repeat;
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
		#xSectionsEditor .csBehaviour { width: 100px; }
		#xSectionsEditor .csDetails { width: 410px; }
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
		
<? if(!1) { ?></style><? } ?>