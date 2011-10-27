<?

header("Content-Type: text/css");

$SITE_ROOT = '../../';
include('../../engine/inc.page.php');
$s =& $berta->template->settings;
$templatePath = Berta::$options['TEMPLATES_ABS_ROOT'] . $berta->template->name . '/';

if(!1) { ?><style type="text/css"><? } ?>

	
	#xTopPanelContainer {
		position:fixed;
		left: 0; top: 0;
	}
	
	.xEntry.xEditableDragXY { cursor: default; }
	.xEntry.xSaving * {
		opacity: 0.7;
		-moz-opacity: 0.7;
	}
	
	.xEntryGalleryEditor {
		width: 430px;
	}
	
	
	.xEntryEditWrap {
		padding: 0;
		margin: 0;
	}
	.xEntryHover .xEntryEditWrap {
		border: none !important;
		padding: 0;
	}
	.xEntryCheck {
		/*float: right !important;*/
	}
	.xEntryEditWrapButtons { 
		border-bottom: none;
		/*visibility: visible !important;*/
		margin-bottom: 0;
		margin-top: -23px;
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
		}
		.xEntryEditWrapButtons a:hover {
			border: 1px solid #ccc;
			background-color: #fff;
			padding: 0px;
		}
		
		.xEntryEditWrapButtons a.xEntryMove{ 
			display: block;
			background-image: url('<? echo $templatePath ?>layout/icon-move.png'); 
			cursor: move; 
			text-decoration:none !important;
	  	}
			.xEntryEditWrapButtons a.xEntryMove span { display: none; }
		
			.xEntryEditWrapButtons a.xEntryToBack { 
				display: block;
				background-image: url('<? echo $templatePath ?>layout/icon-send-to-back.png'); 
				text-decoration:none !important;
		  	}
				.xEntryEditWrapButtons a.xEntryToBack span { display: none; }
		.xEntryEditWrapButtons a.xEntryDelete { background-image: url('<? echo $templatePath ?>layout/icon-delete.png'); }
		.xEntryEditWrapButtons a.xEntryDelete:hover { background-color: none; }
			.xEntryEditWrapButtons a.xEntryDelete span { display: none; }
	
		.xEntryCheck span { /*display: inline-block; float: right; margin-left: 3px;*/ }
	
			.xEntrySetGalType>span { display: none !important; }
	
	
	#contentContainer>.xCreateNewEntry {
		position: absolute;
		width: 200px;
		right: 8px;
		top: 30px;
	}
	.xEntry .xCreateNewEntry {
		display: none;
	}
	
	
	.mess>.xHandle {
		position: absolute;
		left: 0;
		top: 0;
		width: 18px;
		height: 18px;
		margin-left: -20px;
		padding-right: 5px;
		background: url('<? echo $templatePath ?>layout/icon-move.png') no-repeat 0% 0%;
		visibility: hidden;
	}
	.mess:hover>.xHandle {
		visibility: visible;
	}
	
	
	#xCoords {
		z-index: 1;
		background-color: #FFFFB7;
		font-weight: normal;
		font-size: 12px;
		position: absolute;
		white-space: nowrap;
		line-height: 1em;
	}
	
	/*.menuItem.mess {
		background: url('<? echo $templatePath ?>layout/icon-move.png') no-repeat 100% 0%;
		padding-right: 20px;
	}*/
	
	
	
	
	
	.noEntries .xCreateNewEntry {
		display: none;
	}
	
	
	
	
	.floating-banner .xHandle {
		position: absolute;
		left: 0;
		top: 0;
		width: 18px;
		height: 18px;
		margin-left: -20px;
		padding-right: 5px;
		background: url('<? echo $ENGINE_ROOT ?>layout/icon-move.png') no-repeat 0% 0%;
		visibility: hidden;
	}
	.floating-banner:hover .xHandle  {
		visibility: visible;
	}


<? if(!1) { ?></style><? } ?>