<?

header("Content-Type: text/css");

$SITE_ROOT = '../../';
define('SETTINGS_INSTALLREQUIRED', false);
define('SETTINGS_INSTALLCHECKREQUIRED', false);
include('../inc.page.php');



if(!1) { ?><style type="text/css"><? } ?>

body {
	margin: 5px;
	padding: 0;
	color: <? echo Settings::get('general-font-settings', 'color', $settings, $settingsDefinition) ?>;
	font-family: <? echo Settings::get('general-font-settings', 'font-family', $settings, $settingsDefinition) ?>;
	font-size: <? echo Settings::get('general-font-settings', 'font-size', $settings, $settingsDefinition) ?>;
	font-weight: <? echo Settings::get('general-font-settings', 'font-weight', $settings, $settingsDefinition) ?>;
	font-style: <? echo Settings::get('general-font-settings', 'font-style', $settings, $settingsDefinition) ?>;
	font-variant: <? echo Settings::get('general-font-settings', 'font-variant', $settings, $settingsDefinition) ?>;
	line-height: <? echo Settings::get('general-font-settings', 'line-height', $settings, $settingsDefinition) ?>;
	
	/*<? if(Settings::get('background', 'background-image-enabled', $settings, $settingsDefinition) == 'yes') { ?>
	background-image: url(<? echo Settings::get('background', 'background-image', $settings, $settingsDefinition) ?>);
	background-repeat: <? echo Settings::get('background', 'background-repeat', $settings, $settingsDefinition) ?>;
	background-position: <? echo Settings::get('background', 'background-position', $settings, $settingsDefinition) ?>;
	background-attachment: <? echo Settings::get('background', 'background-attachment', $settings, $settingsDefinition) ?>;
	<? } ?>*/
	background-color: <? echo Settings::get('background', 'background-color', $settings, $settingsDefinition) ?>;
	
	text-align: <? echo Settings::get('page-layout', 'content-align', $settings, $settingsDefinition) ?>;
}


a:link { 
	color: <? echo Settings::get('links', 'color:link', $settings, $settingsDefinition) ?>;
	text-decoration: <? echo Settings::get('links', 'text-decoration:link', $settings, $settingsDefinition) ?>;
	border: <? echo Settings::get('links', 'border:link', $settings, $settingsDefinition) ?>;
}
a:visited { 
	color: <? echo Settings::get('links', 'color:visited', $settings, $settingsDefinition) ?>;
	text-decoration: <? echo Settings::get('links', 'text-decoration:visited', $settings, $settingsDefinition) ?>;
	border: <? echo Settings::get('links', 'border:visited', $settings, $settingsDefinition) ?>;
}
a:hover { 
	color: <? echo Settings::get('links', 'color:hover', $settings, $settingsDefinition) ?>;
	text-decoration: <? echo Settings::get('links', 'text-decoration:hover', $settings, $settingsDefinition) ?>;
	border: <? echo Settings::get('links', 'border:hover', $settings, $settingsDefinition) ?>;
}
a:active { 
	color: <? echo Settings::get('links', 'color:active', $settings, $settingsDefinition) ?>;
	text-decoration: <? echo Settings::get('links', 'text-decoration:active', $settings, $settingsDefinition) ?>;
	border: <? echo Settings::get('links', 'border:active', $settings, $settingsDefinition) ?>;
}



h1 { 
	color: <? echo Settings::get('heading-1', 'color', $settings, $settingsDefinition) ?>;
	font-family: <? echo Settings::get('heading-1', 'font-family', $settings, $settingsDefinition) ?>;
	font-size: <? echo Settings::get('heading-1', 'font-size', $settings, $settingsDefinition) ?>;
	font-weight: <? echo Settings::get('heading-1', 'font-weight', $settings, $settingsDefinition) ?>;
	font-style: <? echo Settings::get('heading-1', 'font-style', $settings, $settingsDefinition) ?>;
	font-variant: <? echo Settings::get('heading-1', 'font-variant', $settings, $settingsDefinition) ?>;
	line-height: <? echo Settings::get('heading-1', 'line-height', $settings, $settingsDefinition) ?>;
	
	margin: <? echo Settings::get('heading-1', 'margin', $settings, $settingsDefinition) ?>;
	padding: 0;
}


p {
	margin: 0 0 6px;
}


<? if(!1) { ?></style><? } ?>