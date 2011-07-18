<?

header("Content-Type: text/css");

$SITE_ROOT = '../../';
include('../../engine/inc.page.php');
$s =& $berta->template->settings;

if(!1) { ?><style type="text/css"><? } ?>

#additionalText { 
	width: auto;
	max-width: 500px;
}


#additionalText .xHandle {
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
	background: url('<? echo $ENGINE_ROOT ?>layout/icon-move.png') no-repeat 0% 0%;
	visibility: hidden;
}
.floating-banner:hover .xHandle  {
	visibility: visible;
}


<? if(!1) { ?></style><? } ?>