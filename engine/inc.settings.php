<?


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

	// there is also "site-texts" block, but it is editable directly from blog, not from settings page
	
	'template' => array(
		'template' =>				array('format' => 'select',	'values' => 'templates', 'allow_blank' => false,	'default' => 'default', 				'title' => 'Template', 'description' => 'Templates are like skins or themes for your site. You can choose one template from the ones installed in your templates folder. To add a new template to this list, upload it to the templates folder via FTP.'),
	),
	
	'texts' => array( 
		'ownerName' => 				array('format' => 'text',	'allow_blank' => true,	'default' => null, 				'title' => 'Your name', 'description' => 'Your name will be put in a meta-tag in the code of your site. You can choose any name ;)'),
		'pageTitle' => 				array('format' => 'text',	'allow_blank' => true,	'default' => 'berta', 			'title' => 'Page title (title bar)', 'description' => 'Text that appears in the bowser title bar'),
		'metaDescription' => 		array('format' => 'text',	'allow_blank' => true,	'default' => 'Personal portfolio built with Berta', 			'title' => '<META> description', 'description' => 'Site description is visible only to search engines. It should not be longer than one or two sentences.'),
		'metaKeywords' => 			array('format' => 'text',	'allow_blank' => true,	'default' => 'berta', 			'title' => '<NETA> keywords', 'description' => 'Keywords visible only to search engines. Keywords along with the description can improve your site ranking in search results.')
	),
	
	'navigation' => array(
		'landingSectionVisible' => 	array('format' => 'select',	'default' => 'yes',	'values' => array('yes', 'no'),		'title' => 'Is first section visible in menu?', 'description' => 'Choose "no" to hide the first section in the main menu. Link from the page title (or header image) will lead to it. NOTE: This setting has no effect, if the section has a submenu; then it is visible at all times.'),
		'alwaysSelectTag' => 		array('format' => 'select',	'default' => 'yes', 'values' => array('yes', 'no'),		'title' => 'Always auto-select a submenu item?', 'description' => 'Choose "yes" to automatically select the first submenu item when clicking on a menu item. This works only when there is a submenu.')
	),

	'pageLayout' => array(
		'favicon' => 				array('format' => 'icon',	'default' => '',  	'title' => 'Favicon', 'description' => 'Small picture to display in the address bar of the browser. The file must be in .ICO format and 16x16 pixels big.'),
	),
	'media' => array(
		'imagesSmallWidth' => 		array('format' => 'text',	'default' => $options['images']['small_width'], 		'css_units' => false, 'title' => 'Small image width', 'description' => ''),
		'imagesSmallHeight' => 		array('format' => 'text',	'default' => $options['images']['small_height'], 		'css_units' => false, 'title' => 'Small image height', 'description' => ''),
		'imagesLargeWidth' => 		array('format' => 'text',	'default' => $options['images']['large_width'], 		'css_units' => false, 'title' => 'Large image width', 'description' => ''),
		'imagesLargeHeight' => 		array('format' => 'text',	'default' => $options['images']['large_height'], 		'css_units' => false, 'title' => 'Large image height', 'description' => '')
	),
	
	'entryLayout' => array(
        'galleryFullScreenDefault' => array('format' => 'select',	'default' => 'no', 'values' => array('yes', 'no'),	'title' => 'Lightbox by default is ON', 'description' => 'Enables Lightbox mode for new entries by default.'),
        'galleryFullScreenBackground' => array('format' => 'select',	'default' => 'black', 'values' => array('black', 'white'),	'title' => 'Lightbox background color', 'description' => ''),
        'galleryFullScreenFrame' => array('format' => 'select',	'default' => 'yes', 'values' => array('yes', 'no'),	'title' => 'Lightbox image frame', 'description' => 'Enables/Disables Lightbox frame.'),        
		'galleryFullScreenCloseText' =>	array('format' => 'text',	'allow_blank' => true, 	'default' => 'x',	'title' => 'Lightbox close button', 	'description' => ''),
        'galleryFullScreenImageNumbers' => array('format' => 'select',	'default' => 'yes', 'values' => array('yes', 'no'),	'title' => 'Lightbox image numbers', 'description' => ''),
        'galleryFullScreenCaptionAlign' => array('format' => 'select',	'default' => 'left', 'values' => array('left', 'right', 'center'),	'title' => 'Lightbox caption alignment', 'description' => ''),
        'gallerySlideshowAutoRewind' => array('format' => 'select',	'default' => 'no', 'values' => array('yes', 'no'),	'title' => 'Auto-rewind gallery slideshow', 'description' => 'Display the first image after clicking on the last image in galleries that are in slideshow mode.'),
		'galleryVideoPlayer' => 	array('format' => 'select',	'default' => 'JWPlayer',  							'values' => array('JWPlayer', /*'JWPlayer_Overlay',*/ 'NonverBlaster'),			'title' => 'Video player', 'description' => 'Choose between the two visually different players for your video files.')
        //'galleryFullScreenImgOpacity' => array('format' => 'text',	'default' => '70%', 'css_units' => false, 'title' => 'Gallery image transparency', 'description' => 'Transparency of image, works only if gallery fullscreen is enabled. 100% means no transparency.')
	),
	
	'banners' => array(
		'banner1_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => 'Banner (1) image', 'description' => ''),
		'banner1_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => 'Banner (1) link', 'description' => ''),
		'banner2_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => 'Banner (2) image', 'description' => ''),
		'banner2_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => 'Banner (2) link', 'description' => ''),
		'banner3_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => 'Banner (3) image', 'description' => ''),
		'banner3_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => 'Banner (3) link', 'description' => ''),
		'banner4_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => 'Banner (4) image', 'description' => ''),
		'banner4_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => 'Banner (4) link', 'description' => ''),
		'banner5_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => 'Banner (5) image', 'description' => ''),
		'banner5_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => 'Banner (5) link', 'description' => ''),
		'banner6_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => 'Banner (6) image', 'description' => ''),
		'banner6_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => 'Banner (6) link', 'description' => ''),
		'banner7_image' => 			array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => 'Banner (7) image', 'description' => ''),
		'banner7_link'  => 			array('format' => 'text',		'allow_blank' => true,	'default' => null, 	'title' => 'Banner (7) link', 'description' => ''),
	),
	
	'settings' => array( 
		'googleAnalyticsId' => 		array('format' => 'text',	'allow_blank' => true, 	'default' => '', 			'html_entities'	=> true,			'title' => 'Google Analytics ID', 'validator' => 'GoogleAnalytics', 		'description' => 'The ID of the <a href="http://google.com/analytics" target="_blank">Google Analytics</a> site profile. To obtain an ID, register in <a href="http://google.com/analytics" target="_blank">Google Analytics</a> and create a profile for your site.'),
		'flashUploadEnabled' => 	array('format' => 'select',	'allow_blank' => false, 'default' => 'yes', 		'values' => array('yes', 'no'), 	'title' => 'Advanced file uploading enabled', 								'description' => 'Set if the advanced uploading features (selecting multiple files at once, asynchronous uploading) are enabled. You should not disable them UNLESS you are experiencing problems with file uploads.')
 	)
);

?>