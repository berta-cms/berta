<?php

header("Content-Type: text/css");

$SITE_ROOT = '../../';
include('../../engine/inc.page.php');
$s =& $berta->template->settings;
$templatePath = Berta::$options['TEMPLATES_ABS_ROOT'] . $berta->template->name . '/';

if(!1) { ?><style type="text/css"><?php } ?>


	#xTopPanelContainer {
		position:fixed;
		left: 0; top: 0;
	}

	.xEntry.xEditableDragXY { cursor: default; }
	.xEntry.xSaving * {
		opacity: 0.7;
		-moz-opacity: 0.7;
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

		.xEntryDropdownBox div.xEntrySeperator {
			border-bottom: 1px dotted #000;
			padding-top: 4px;
			margin: 0px 18px 0px 18px;
		}

		.xEntryDropdownBox div.xEntryBoxParams {
			margin: 0px 18px 0px 18px;
			font-size: 12px;
		}

		.xEntryEditWrapButtons a.xEntryMove{
			display: block;
			background-image: url('<?php echo $templatePath ?>layout/icon-move.png');
			cursor: move;
			text-decoration:none !important;
	  	}
			.xEntryEditWrapButtons a.xEntryMove span { display: none; }

			.xEntryEditWrapButtons a.xEntryToBack {
				display: block;
				background-image: url('<?php echo $templatePath ?>layout/icon-send-to-back.png');
				text-decoration:none !important;
		  	}
				.xEntryEditWrapButtons a.xEntryToBack span { display: none; }
		.xEntryEditWrapButtons a.xEntryDelete { background-image: url('<?php echo $templatePath ?>layout/icon-delete.png'); }
		.xEntryEditWrapButtons a.xEntryDelete:hover { background-color: none; }
			.xEntryEditWrapButtons a.xEntryDelete span { display: none; }

		.xEntryCheck span { /*display: inline-block; float: right; margin-left: 3px;*/ }

			.xEntrySetGalType>span { display: none !important; }


	#contentContainer>.xCreateNewEntry {
		position: absolute;
		width: 200px;
		right: 50%;
		margin-right: -100px;
		top: 30px;
		z-index: 60000;
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
		background: url('<?php echo $templatePath ?>layout/icon-move.png') no-repeat 0% 0%;
		visibility: hidden;
	}
	.mess:hover>.xHandle {
		visibility: visible;
	}

	#xCoords {
		z-index: 1;
		background-color: #FFFFB7;
		color: #000;
		font-weight: normal;
		font-size: 12px;
		position: absolute;
		white-space: nowrap;
		line-height: 1em;
		font-family: Arial, Helvetica, sans-serif;
	}


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
		background: url('<?php echo $ENGINE_ROOT ?>layout/icon-move.png') no-repeat 0% 0%;
		visibility: hidden;
	}
	.floating-banner:hover .xHandle  {
		visibility: visible;
	}


<?php if(!1) { ?></style><?php } ?>