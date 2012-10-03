<?php




$settingsFontSelectGeneral = array(
	'"Helvetica Neue", Helvetica, Arial, sans-serif' => 'Helvetica Neue, Helvetica, Arial, sans-serif',
	'Helvetica, Arial, sans-serif' => 'Helvetica, Arial, sans-serif',
	'"Arial Black", Gadget, sans-serif' => 'Arial Black, Gadget',
	'"Comic Sans MS", cursive' => 'Comic Sans MS',
	'"Courier New", Courier, monospace' => 'Courier New, Courier',
	'Georgia, "Times New Roman", Times, serif' => 'Georgia, Times New Roman, Times',
	'Impact, Charcoal, sans-serif' => 'Impact, Charcoal',
	'"Lucida Console", Monaco, monospace' => 'Lucida Console, Monaco',
	'"Lucida Sans Unicode", "Lucida Grande", sans-serif' => 'Lucida Sans Unicode, Lucida Grande',
	'"Palatino Linotype", "Book Antiqua", Palatino, serif' => 'Palatino Linotype, Book Antiqua, Palatino',
	'Tahoma, Geneva, sans-serif' => 'Tahoma, Geneva',
	'"Times New Roman", Times, serif' => 'Times New Roman, Times',
	'"Trebuchet MS", Helvetica, sans-serif' => 'Trebuchet MS, Helvetica',
	'Verdana, Geneva, sans-serif' => 'Verdana, Geneva'
);

$settingsFontSelect = array_merge(array('inherit' => '(inherit from general-font-settings)'), $settingsFontSelectGeneral);



$settingsDefinition = array(


	// siteTexts block is NOT editable in the settings page. It is reserved for texts appearing only on the page
	'siteTexts' => array(
		'_' =>                      array('title' => I18n::_('Texts in the website'), 'invisible' => true),
		'siteHeading' => 			array('format' => 'text',	'allow_blank' => true,	'default' => null, 				'title' => I18n::_('Main heading'), 'description' => ''),
	),


	'template' => array(
		'_' =>                      array('title' => I18n::_('Template')),
		'template' =>				array('format' => 'select',	'values' => 'templates', 'allow_blank' => false,	'default' => false, 				'title' => I18n::_('Template'), 'description' => I18n::_('Templates are like skins or themes for your site. You can choose one template from the ones installed in your templates folder. To add a new template to this list, upload it to the templates folder via FTP.')),
	),
	
	'texts' => array(
		'_' =>                      array('title' => I18n::_('Texts')),
		'ownerName' => 				array('format' => 'text',	'allow_blank' => true,	'default' => null, 				'title' => I18n::_('Your name'), 'description' => I18n::_('Your name will be put in a meta-tag in the code of your site. You can choose any name ;)')),
		'pageTitle' => 				array('format' => 'text',	'allow_blank' => true,	'default' => 'berta', 			'title' => I18n::_('Page title (title bar)'), 'description' => I18n::_('Text that appears in the bowser title bar')),
		'metaDescription' => 		array('format' => 'text',	'allow_blank' => true,	'default' => 'Personal portfolio built with Berta', 			'title' => I18n::_('<META> description'), 'description' => I18n::_('Short site description. It should not be longer than one or two sentences.')),
		'metaKeywords' => 			array('format' => 'text',	'allow_blank' => true,	'default' => 'berta', 			'title' => I18n::_('<META> keywords'), 'description' => I18n::_('Keywords visible only to search engines. Keywords along with the description can improve your site ranking in search results.'))
	),
	
	'navigation' => array(
		'_' =>                          array('title' => I18n::_('Navigation')),
		'landingSectionVisible' => 	    array('format' => 'select',	'default' => 'yes',	'values' => array('yes', 'no'),		'title' => I18n::_('Is first section visible in menu?'),    'description' => I18n::_('Choose "no" to hide the first section in the main menu. Link from the page title (or header image) will lead to it. NOTE: This setting has no effect, if the section has a submenu; then it is visible at all times.')),
		'landingSectionMenuVisible' =>  array('format' => 'select',	'default' => 'yes',	'values' => array('yes', 'no'),		'title' => I18n::_('Show menu in first section?'),    'description' => I18n::_('Choose "no" to hide the menu in first section.')),
        'alwaysSelectTag' => 		    array('format' => 'select',	'default' => 'yes', 'values' => array('yes', 'no'),		'title' => I18n::_('Always auto-select a submenu item?'),   'description' => I18n::_('Choose "yes" to automatically select the first submenu item when clicking on a menu item. This works only when there is a submenu.'))
	),

	'pageLayout' => array(
		'_' =>                      array('title' => I18n::_('Page layout')),
		'favicon' => 				array('format' => 'icon',	'default' => '',  	    'title' => I18n::_('Favicon'),      'description' => I18n::_('Small picture to display in the address bar of the browser. The file must be in .ICO format and 16x16 pixels big.')),
		'gridStep' =>          		array('format' => 'text',	'default' => 10,         'title' => I18n::_('Grid step'),    'description' => I18n::_('Distance in pixels for snap-to-grid dragging.'))
	),
	'media' => array(
		'_' =>                      array('title' => I18n::_('Media')),
		'imagesSmallWidth' => 		array('format' => 'text',	'default' => $options['images']['small_width'], 		'css_units' => false, 'title' => I18n::_('Small image width'),  'description' => I18n::_('Maximum size of a small image (visible if \'Small images\' are switched on in the gallery editor). These settings don\'t affect original image.')),
		'imagesSmallHeight' => 		array('format' => 'text',	'default' => $options['images']['small_height'], 		'css_units' => false, 'title' => I18n::_('Small image height'), 'description' => ''),
		'imagesLargeWidth' => 		array('format' => 'text',	'default' => $options['images']['large_width'], 		'css_units' => false, 'title' => I18n::_('Large image width'),  'description' => I18n::_('Maximum size of a large image (visible if \'Large images\' are switched on in the gallery editor). These settings don\'t affect original image.')),
		'imagesLargeHeight' => 		array('format' => 'text',	'default' => $options['images']['large_height'], 		'css_units' => false, 'title' => I18n::_('Large image height'), 'description' => '')
	),
	
	'entryLayout' => array(
		'_' =>                      array(                                      'title' => I18n::_('Entry layout')),
	    'group_lightbox' => array('format' => false, 'default' => false, 'title' => I18n::_('Lightbox settings:')),
        'galleryFullScreenDefault' => array('format' => 'select',	'default' => 'yes', 'values' => array('yes', 'no'),	                        'title' => I18n::_('Is enabled by default'),     'description' => I18n::_('Enables Lightbox mode for new entries.')),
        'galleryFullScreenBackground' => array('format' => 'select',	'default' => 'black', 'values' => array('black', 'white', 'none'),	    'title' => I18n::_('Background color'),     'description' => I18n::_('Color of the Lightbox background layer.')),
        'galleryFullScreenFrame' => array('format' => 'select',	'default' => 'no', 'values' => array('yes', 'no'),	                            'title' => I18n::_('Image frame'),          'description' => I18n::_('Enables/Disables a frame around image.')),
		'galleryFullScreenCloseText' =>	array('format' => 'text',	'allow_blank' => true, 	'default' => 'x',	                                'title' => I18n::_('Close button'), 	    'description' => I18n::_('&quot;Close&quot; symbol. You can enter your own.')),
        'galleryFullScreenImageNumbers' => array('format' => 'select',	'default' => 'yes', 'values' => array('yes', 'no'),	                    'title' => I18n::_('Image numbers'),        'description' => I18n::_('Enables/disables numbers below the image.')),
        'galleryFullScreenCaptionAlign' => array('format' => 'select',	'default' => 'left', 'values' => array('left', 'right', 'center'),	    'title' => I18n::_('Caption alignment'),    'description' => I18n::_('Positioning of the image caption text.')),

	    'space' => array('format' => false, 'default' => false,                 'title' => '&nbsp;'),
	    'group_gallery' => array('format' => false, 'default' => false,         'title' => I18n::_('Image gallery appearance:')),
        'gallerySlideshowAutoRewind' => array('format' => 'select',	'default' => 'no', 'values' => array('yes', 'no'),	                                                    'title' => I18n::_('Auto-rewind gallery slideshow'),    'description' => I18n::_('Display the first image after clicking on the last image in galleries that are in slideshow mode.')),
        'gallerySlideNumberVisibilityDefault' => array('format' => 'select', 'default' => 'yes', 'values' => array('yes', 'no'), 'title' => I18n::_('Show slideshow image numbers'),		'description' => I18n::_('Set the default state of image number visibility in slideshow galleries.')),
		'galleryVideoPlayer' => 	array('format' => 'select',	'default' => 'JWPlayer',  'values' => array('JWPlayer', /*'JWPlayer_Overlay',*/ 'NonverBlaster'),			'title' => I18n::_('Video player'),                     'description' => I18n::_('Choose between the two visually different players for your video files.'))
        //'galleryFullScreenImgOpacity' => array('format' => 'text',	'default' => '70%', 'css_units' => false, 'title' => 'Gallery image transparency', 'description' => 'Transparency of image, works only if gallery fullscreen is enabled. 100% means no transparency.')
	),
	
	'banners' => array(
		'_' =>                      array('title' => I18n::_('Banners')),
		'banner1_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => I18n::_('Banner image').' (1)',  'description' => I18n::_('description_banner')),
		'banner1_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => I18n::_('Banner link').' (1)', 'description' => I18n::_('description_banner_link')),
		'banner2_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => I18n::_('Banner image').' (2)', 'description' => ''),
		'banner2_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => I18n::_('Banner link').' (2)', 'description' => ''),
		'banner3_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => I18n::_('Banner image').' (3)', 'description' => ''),
		'banner3_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => I18n::_('Banner link').' (3)', 'description' => ''),
		'banner4_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => I18n::_('Banner image').' (4)', 'description' => ''),
		'banner4_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => I18n::_('Banner link').' (4)', 'description' => ''),
		'banner5_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => I18n::_('Banner image').' (5)', 'description' => ''),
		'banner5_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => I18n::_('Banner link').' (5)', 'description' => ''),
		'banner6_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => I18n::_('Banner image').' (6)', 'description' => ''),
		'banner6_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => I18n::_('Banner link').' (6)', 'description' => ''),
		'banner7_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => I18n::_('Banner image').' (7)', 'description' => ''),
		'banner7_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => I18n::_('Banner link').' (7)', 'description' => ''),
	),

	'language' => array(
		'_' =>                      array('title' => I18n::_('Language')),
		'language' => 	array('format' => 'select',	'allow_blank' => false, 'default' => $options['default_language'], 		'values' => $options['languages'], 	'title' => I18n::_('Interface language'),   'description' => I18n::_('description_language'))
 	),
	
	'settings' => array(
		'_' =>                      array('title' => I18n::_('Other settings')),
		'googleAnalyticsId' => 		array('format' => 'text',	'allow_blank' => true, 	'default' => '', 			'html_entities'	=> true,			'title' => I18n::_('Google Analytics ID'), 'validator' => 'GoogleAnalytics', 		'description' => I18n::_('The ID of the <a href="http://google.com/analytics" target="_blank">Google Analytics</a> site profile. To obtain an ID, register in <a href="http://google.com/analytics" target="_blank">Google Analytics</a> and create a profile for your site.')),
		'googleSiteVerification' => 		array('format' => 'text',	'allow_blank' => true, 	'default' => '', 			'html_entities'	=> true,			'title' => I18n::_('Google site verification tag'), 'description' => I18n::_('Google ownership verification <meta> tag. <a href="http://support.google.com/a/bin/answer.py?hl=en&answer=186017" target="_blank">More info</a>.')),		
		'flashUploadEnabled' => 	array('format' => 'select',	'allow_blank' => false, 'default' => 'yes', 		'values' => array('yes', 'no'), 	'title' => I18n::_('Advanced file uploading enabled'), 								'description' => I18n::_('Set if the advanced uploading features (selecting multiple files at once, asynchronous uploading) are enabled. You should not disable them UNLESS you are experiencing problems with file uploads.')),
		'showTutorialVideos' =>		array('format' => 'select', 'default' => 'yes', 'values' => array('yes', 'no'), 'title' => I18n::_('Show videos on startup'), 'description' => I18n::_('Show or hide Berta\'s tutorial videos on startup. To view the videos, set this to \'Yes\' and they will appear next time you log in.')),
		'jsInclude' => 		array('format' => 'longtext',	'allow_blank' => true, 	'default' => '', 			'html_entities'	=> true,			'title' => I18n::_('Javascript include'), 'description' => I18n::_('javascript_include'))

 	)
);

if(@file_exists($SITE_ROOT .'_plugin_shop/inc.settings.php')) {	
	include($SITE_ROOT .'_plugin_shop/inc.settings.php');
}

//special settings for hosted sites (nothing special)
if(@file_exists($ENGINE_ROOT .'plan')) {
	$hostingPlan = file_get_contents($ENGINE_ROOT . 'plan');

	//settings for PRO and SHOP hosting plans
	if ($hostingPlan>1){
		$settingsDefinition['settings']['hideBertaCopyright'] =	array('format' => 'select', 'default' => 'no', 'values' => array('yes', 'no'), 'title' => I18n::_('Hide copyrights'), 'description' => I18n::_('Hides Berta\'s copyrights'));
	}

	
	
}


?>