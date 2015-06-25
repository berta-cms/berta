<?php
header("Content-Type: text/css");

$SITE_ROOT = '../../';
define('SETTINGS_INSTALLREQUIRED', false);
define('SETTINGS_INSTALLCHECKREQUIRED', false);
include('../inc.page.php');

if(!1) { ?><style type="text/css"><?php } ?>

body {
	margin: 5px;
	padding: 0;
	color: <?php echo Settings::get('general-font-settings', 'color', $settings, $settingsDefinition) ?>;
	font-family: <?php echo Settings::get('general-font-settings', 'font-family', $settings, $settingsDefinition) ?>;
	font-size: <?php echo Settings::get('general-font-settings', 'font-size', $settings, $settingsDefinition) ?>;
	font-weight: <?php echo Settings::get('general-font-settings', 'font-weight', $settings, $settingsDefinition) ?>;
	font-style: <?php echo Settings::get('general-font-settings', 'font-style', $settings, $settingsDefinition) ?>;
	font-variant: <?php echo Settings::get('general-font-settings', 'font-variant', $settings, $settingsDefinition) ?>;
	line-height: <?php echo Settings::get('general-font-settings', 'line-height', $settings, $settingsDefinition) ?>;
	background-color: <?php echo Settings::get('background', 'background-color', $settings, $settingsDefinition) ?>;
	text-align: <?php echo Settings::get('page-layout', 'content-align', $settings, $settingsDefinition) ?>;
}

a:link {
	color: <?php echo Settings::get('links', 'color:link', $settings, $settingsDefinition) ?>;
	text-decoration: <?php echo Settings::get('links', 'text-decoration:link', $settings, $settingsDefinition) ?>;
	border: <?php echo Settings::get('links', 'border:link', $settings, $settingsDefinition) ?>;
}
a:visited {
	color: <?php echo Settings::get('links', 'color:visited', $settings, $settingsDefinition) ?>;
	text-decoration: <?php echo Settings::get('links', 'text-decoration:visited', $settings, $settingsDefinition) ?>;
	border: <?php echo Settings::get('links', 'border:visited', $settings, $settingsDefinition) ?>;
}
a:hover {
	color: <?php echo Settings::get('links', 'color:hover', $settings, $settingsDefinition) ?>;
	text-decoration: <?php echo Settings::get('links', 'text-decoration:hover', $settings, $settingsDefinition) ?>;
	border: <?php echo Settings::get('links', 'border:hover', $settings, $settingsDefinition) ?>;
}
a:active {
	color: <?php echo Settings::get('links', 'color:active', $settings, $settingsDefinition) ?>;
	text-decoration: <?php echo Settings::get('links', 'text-decoration:active', $settings, $settingsDefinition) ?>;
	border: <?php echo Settings::get('links', 'border:active', $settings, $settingsDefinition) ?>;
}

h1 {
	color: <?php echo Settings::get('heading-1', 'color', $settings, $settingsDefinition) ?>;
	font-family: <?php echo Settings::get('heading-1', 'font-family', $settings, $settingsDefinition) ?>;
	font-size: <?php echo Settings::get('heading-1', 'font-size', $settings, $settingsDefinition) ?>;
	font-weight: <?php echo Settings::get('heading-1', 'font-weight', $settings, $settingsDefinition) ?>;
	font-style: <?php echo Settings::get('heading-1', 'font-style', $settings, $settingsDefinition) ?>;
	font-variant: <?php echo Settings::get('heading-1', 'font-variant', $settings, $settingsDefinition) ?>;
	line-height: <?php echo Settings::get('heading-1', 'line-height', $settings, $settingsDefinition) ?>;
	margin: <?php echo Settings::get('heading-1', 'margin', $settings, $settingsDefinition) ?>;
	padding: 0;
}

p {
	margin: 0 0 6px;
}

<?php if(!1) { ?></style><?php } ?>