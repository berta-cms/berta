<?php

header('Content-Type: text/css');

include '../../engine/inc.page.php';
$s = &$berta->template->settings;
$isResponsive = $s->get('pageLayout', 'responsive') == 'yes';

if (! 1) { ?><style type="text/css"><?php } ?>

	#xTopPanelContainer {
		position:fixed;
		left: 0; top: 0;
	}

	.xEntry .xHandle {
		position: absolute;
		display: block;
		left: 0;
		top: 0;
		z-index: 1000;
	}

	.noEntries .xCreateNewEntry {
		display: none;
	}

	#additionalText .xHandle {
		position: absolute;
		left: 0;
		top: 0;
		width: 18px;
		height: 18px;
		margin-left: -20px;
		padding-right: 5px;
		background: url('<?php echo $ENGINE_ROOT_URL ?>layout/icon-move.png') no-repeat 0% 0%;
		visibility: hidden;
	}
	#additionalText:hover .xHandle  {
		visibility: visible;
	}

	.floating-banner .xHandle {
		position: absolute;
		left: 0;
		top: 0;
		width: 18px;
		height: 18px;
		margin-left: -20px;
		padding-right: 5px;
		background: url('<?php echo $ENGINE_ROOT_URL ?>layout/icon-move.png') no-repeat 0% 0%;
		visibility: hidden;
	}
	.floating-banner:hover .xHandle  {
		visibility: visible;
	}

	<?php if ($isResponsive) { ?>
		#additionalText:hover .xHandle,
		.floating-banner:hover .xHandle {
			visibility: hidden;
		}
	<?php } ?>

<?php if (! 1) { ?></style><?php } ?>
