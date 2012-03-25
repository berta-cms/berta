<?

$fontOptions = array(
	'Helvetica, Arial, sans-serif' => 'Helvetica, Arial, sans-serif',
	'"Helvetica Neue", Helvetica, Arial, sans-serif' => 'Helvetica Neue, Helvetica, Arial, sans-serif',
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
$fontOptionsWithInherit = array_merge(array('inherit' => '(inherit from general-font-settings)'), $fontOptions);

$sectionTypes = array(
	'default' => array('title' => 'Default'),
	'external_link' => array('title' => 'External link', 'params' => array(
		'link' => array('format' => 'text',	'default' => ''), 
		'target' => array('format' => 'select', 'values' => array('_self' => 'Same window', '_blank' => 'New window'), 'default' => '_blank')
	))
);


$templateConf = array(
	
	'generalFontSettings' => array(
		'_' => array('title' => I18n::_('General font settings')),
		'color' => 					array('format' => 'color',		'default' => '#333333', 							                            'title' => I18n::_('Color'),             'description' => ''),
		'fontFamily' => 			array('format' => 'fontselect',	'values' => $fontOptions, 'default' => reset(array_keys($fontOptions)), 	'title' => I18n::_('Font face'),         'description' => ''),
		'googleFont' => 			array('format' => 'text',		'default' => '', 															'title' => 'Google web fonts',         'description' => I18n::_('googleFont_description')),
		'fontSize' => 				array('format' => 'text',		'default' => '9pt', 								                            'title' => I18n::_('Font size'),         'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 		            'title' => I18n::_('Font weight'),       'description' => ''),
		'fontStyle' => 				array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 		                'title' => I18n::_('Font style'),        'description' => ''),
		'fontVariant' => 			array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 	            'title' => I18n::_('Font variant'),      'description' => ''),
		'lineHeight' => 			array('format' => 'text',		'default' => 'normal', 								                            'title' => I18n::_('Line height'),       'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'))
	),
	
	'links' => array(
		'_' => array('title' => I18n::_('Hyperlinks')),
		'colorLink' => 			array('format' => 'color',		'default' => '#888888', 	    'title' => I18n::_('Link color'),                'description' => ''),
		'colorVisited' => 			array('format' => 'color',		'default' => '#888888', 	'title' => I18n::_('Visited link color'),        'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#888888', 	'title' => I18n::_('Link color when hovered'),   'description' => ''),
		'colorActive' => 			array('format' => 'color',		'default' => '#888888', 	'title' => I18n::_('Link color when clicked'),   'description' => ''),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		'title' => I18n::_('Link decoration'),                  'description' => ''),
		'textDecorationVisited' =>array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'none', 		'title' => I18n::_('Visited link decoration'),          'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 	'title' => I18n::_('Link decoration when hovered'),     'description' => ''),
		'textDecorationActive' => array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 	'title' => I18n::_('Link decoration when clicked'),     'description' => '')
	),
	
	'background' => array(
		'_' => array('title' => I18n::_('Background')),
		'backgroundColor' =>		array('format' => 'color',		'default' => '#FFFFFF',									                                                'title' => I18n::_('Background color'),                  'description' => ''),
		'backgroundImageEnabled'=>  array('format' => 'select',		'values' => array('yes', 'no'), 'default' => 'no', 					                                    'title' => I18n::_('Is background image enabled?'),      'description' => ''),
		'backgroundImage' => 		array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => I18n::_('Background image'),                  'description' => I18n::_('Picture to use for page background.')),
		'backgroundRepeat' => 		array('format' => 'select',		'values' => array('repeat'=>'tile vertically and horizontally', 'repeat-x' => 'tile horizontally', 'repeat-y' => 'tile vertically', 'no-repeat'=>'no tiling'), 'default' => 'repeat', 		'title' => I18n::_('Background tiling'),         'description' => I18n::_('How the background fills the screen?')),
		'backgroundPosition' => 	array('format' => 'select',		'values' => array('top left', 'top center', 'top right', 'center left', 'center', 'center right', 'bottom left', 'bottom center', 'bottom right'), 'default' => 'top left', 	            'title' => I18n::_('Background alignment'),      'description' => I18n::_('Where the background image is positioned?')),
		'backgroundAttachment' => 	array('format' => 'select',		'values' => array('fixed' => 'Fixed to browser window', 'fill' => 'Filled in browser window', 'scroll' => 'No stretch, scroll along with content'), 'default' => 'scroll', 		            'title' => I18n::_('Background position'),       'description' => I18n::_('Sets how background behaves in relation with the browser window.'))
	),
	
	'pageLayout' => array(
		'_' => array('title' => I18n::_('Page layout')),
		'contentPosition' => 		array('format' => 'select',		'values' => array('left', 'center', 'right'), 		'default' => 'left', 				            'title' => I18n::_('Content position'),         'description' => ''),
		'contentAlign' => 			array('format' => 'select',		'values' => array('left', 'right', 'justify-left', 'justify-right'), 	'default' => 'left',        'title' => I18n::_('Text alignment'),           'description' => ''),
		'contentWidth' => 			array('format' => 'text',		'default' => '500px', 'css_units' => true,			                                                'title' => I18n::_('Width of content area'),    'description' => ''),
		'bodyMargin' => 			array('format' => 'text',		'default' => '20px 40px 40px', 'css_units' => true,	                                                'title' => I18n::_('Page margins'),             'description' => I18n::_('How far the content is from browser edges. Please see the short CSS guide at the bottom of this page.')),
		'siteMenuMargin' => 		array('format' => 'text',		'default' => '0px', 'css_units' => true,			                                                'title' => I18n::_('Top menu margins'),         'description' => I18n::_('How big is the distance from the top menu to the other page elements'))
	),
	
	'pageHeading' => array(
		'_' => array('title' => I18n::_('Page heading')),
		'image' => 					array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 1000, 'max_height' => 1000, 	'title' => I18n::_('Header image'),  'description' => I18n::_('Picture to use instead of text.')),
		'color' => 					array('format' => 'color',		'default' => '#333333', 					                                                        'title' => I18n::_('Color'),         'description' => ''),
		'fontFamily' => 			array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			                        'title' => I18n::_('Font face'),     'description' => ''),
		'googleFont' => 			array('format' => 'text',		'default' => '', 															'title' => 'Google web fonts',         'description' => I18n::_('googleFont_description')),		
		'fontSize' => 				array('format' => 'text',		'default' => '1.2em', 					                                                            'title' => I18n::_('Font size'),     'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'bold', 				                            'title' => I18n::_('Font weight'),   'description' => ''),
		'fontStyle' => 				array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 			                            'title' => I18n::_('Font style'),    'description' => ''),
		'fontVariant' => 			array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 		                            'title' => I18n::_('Font variant'),  'description' => ''),
		'lineHeight' => 			array('format' => 'text',		'default' => '0.8em', 					                                                            'title' => I18n::_('Line height'),   'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')),
		'margin' => 				array('format' => 'text',		'default' => '10px 0 15px', 			                                                            'title' => I18n::_('Margins'),       'description' => I18n::_('How far the heading is form other elements in page. Please see the short CSS guide at the bottom of this page.')),
	),
	
	'menu' => array(
		'_' => array('title' => I18n::_('Main menu')),
		'separator' => 				array('format' => 'text',		'default' => '|', 						                                    'title' => I18n::_('Menu items separator'),              'description' => ''),
		'separatorDistance' => 	array('format' => 'text',		'default' => '0.5em', 					                                        'title' => I18n::_('Space width around separator'),      'description' => I18n::_('The distance from the separator to the menu item on both sides')),
		'fontSize' => 				array('format' => 'text',		'default' => 'inherit', 				                                    'title' => I18n::_('Font size'),                         'description' => ''),
		'fontFamily' => 			array('format' => 'fontselect',		'values' => $fontOptionsWithInherit, 'default' => 'inherit', 	        'title' => I18n::_('Font face'),                         'description' => ''),
		'googleFont' => 			array('format' => 'text',		'default' => '', 															'title' => 'Google web fonts',         'description' => I18n::_('googleFont_description')),
		'fontWeight' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'bold'), 'default' => 'inherit',     'title' => I18n::_('Font weight'),                       'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'italic'), 'default' => 'inherit', 	    'title' => I18n::_('Font style'),                        'description' => ''),
		'fontVariant' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'small-caps'), 'default' => 'inherit','title' => I18n::_('Font variant'),                     'description' => ''),
		'lineHeight' =>			array('format' => 'text',		'default' => 'inherit', 				                                        'title' => I18n::_('Line height'),                       'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')),
		'margin' => 				array('format' => 'text',		'default' => '0', 				                                            'title' => I18n::_('Margins'),                           'description' => I18n::_('How far the menu is form other elements in page. Please see the short CSS guide at the bottom of this page.'))
	),
	
	'subMenu' => array(
		'_' => array('title' => I18n::_('Submenu')),
		'separator' => 				array('format' => 'text',		'default' => '|', 						                                    'title' => I18n::_('Menu items separator'),                      'description' => ''),
		'separatorDistance' => 	array('format' => 'text',		'default' => '0.5em', 					                                        'title' => I18n::_('Space width around separator'),              'description' => I18n::_('The distance from the separator to the menu item on both sides')),
		'fontSize' => 				array('format' => 'text',		'default' => 'inherit', 				                                    'title' => I18n::_('Font size'),                                 'description' => ''),
		'fontFamily' => 			array('format' => 'fontselect',		'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			'title' => I18n::_('Font face'),                                 'description' => ''),
		'googleFont' => 			array('format' => 'text',		'default' => '', 															'title' => 'Google web fonts',         'description' => I18n::_('googleFont_description')),
		'fontWeight' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'bold'), 'default' => 'inherit', 	'title' => I18n::_('Font weight'),                               'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'italic'), 'default' => 'inherit', 		'title' => I18n::_('Font style'),                                'description' => ''),
		'fontVariant' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'small-caps'), 'default' => 'inherit','title' => I18n::_('Font variant'),                             'description' => ''),
		'lineHeight' =>			array('format' => 'text',		'default' => 'inherit', 				                                        'title' => I18n::_('Line height'),                               'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')),
		'margin' => 				array('format' => 'text',		'default' => '0 0 10px', 				                                    'title' => I18n::_('Margins'),                                   'description' => I18n::_('How far the menu is form other elements in page. Please see the short CSS guide at the bottom of this page.'))
	),
	

	'entryLayout' => array(
		'_' => array('title' => I18n::_('Entry layout')),
		'margin' => 			 array('format' => 'text',		'default' => '0 0 4em', 							                                                                                'title' => I18n::_('Entry margins'), 	            'description' => I18n::_('Margins around entries. Please see the short CSS guide at the bottom of this page.')),
		'galleryPosition' => 	 array('format' => 'select',	'values' => array('between title/description', 'above title', 'below description'), 'default' => 'between title/description',       'title' => I18n::_('Gallery position'),             'description' => ''),
		'defaultGalleryType' =>  array('format' => 'select',	'values' => array('slideshow', 'row'), 'default' => 'slideshow',                                                                    'title' => I18n::_('Default gallery type'),         'description' => I18n::_('Slideshow means that an image menu plus only one image is visible at a time. Row means that all images are visible.')),
        'spaceBetweenImages' =>  array('format' => 'text',		'default' => '1em', 'css_units' => true,                                                                                            'title' => I18n::_('Space between images in row and column'),       'description' => I18n::_('Horizontal/vertical space between images when gallery is in "row"/"column" mode')),
		'galleryMargin' => 		 array('format' => 'text',		'default' => '0',                                                                                                                   'title' => I18n::_('Gallery margins'), 	            'description' => I18n::_('Margin around gallery block')),
		'displayTags' =>  		 array('format' => 'select',	'values' => array('yes', 'no'), 'default' => 'yes',                                                                                 'title' => I18n::_('Display tags by each entry'),   'description' => I18n::_('This determines whether people will see tags you set for each entry. Regardless of this settting, tags still will make up the main menu.')),
		'dateFormat' => 		 array('format' => 'select',	'values' => array('year', 'month and year', 'day, month and year', 'full', 'hidden'), 'default' => 'hidden',                        'title' => I18n::_('Date format in entries'),       'description' => ''),
		'dateSeparator1' => 	 array('format' => 'text',		'allow_blank' => false,	'default' => '/',                                                                                           'title' => I18n::_('Date separator'),               'description' => I18n::_('Separator symbol that divides year, month and day')),
		'dateSeparator2' => 	 array('format' => 'text',		'allow_blank' => false,	'default' => ':',                                                                                           'title' => I18n::_('Time separator'),               'description' => '')
	),

	'entryHeading' => array(
		'_' => array('title' => I18n::_('Entry heading')),
		'color' => 				array('format' => 'color',		'default' => '#333333', 					                                    'title' => I18n::_('Color'),             'description' => ''),
		'fontFamily' => 		array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			        'title' => I18n::_('Font face'),         'description' => ''),
		'googleFont' => 			array('format' => 'text',		'default' => '', 															'title' => 'Google web fonts',         'description' => I18n::_('googleFont_description')),
		'fontSize' => 			array('format' => 'text',		'default' => '1.8em', 					                                        'title' => I18n::_('Font size'),         'description' => ''),
		'fontWeight' => 		array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 			        'title' => I18n::_('Font weight'),       'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 			        'title' => I18n::_('Font style'),        'description' => ''),
		'fontVariant' => 		array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 		        'title' => I18n::_('Font variant'),      'description' => ''),
		'lineHeight' => 		array('format' => 'text',		'default' => 'normal', 					                                        'title' => I18n::_('Line height'),       'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')),
		'margin' => 			array('format' => 'text',		'default' => '0', 						                                        'title' => I18n::_('Margins'),           'description' => I18n::_('How far the entry heading is form other elements in page. Please see the short CSS guide at the bottom of this page.')),
	),
	
	'entryFooter' => array(
		'_' => array('title' => I18n::_('Entry footer')),
		'color' => 					array('format' => 'color',		'default' => '#333333', 					                                'title' => I18n::_('Color'),             'description' => ''),
		'fontFamily' => 			array('format' => 'fontselect',		'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			'title' => I18n::_('Font face'),         'description' => ''),
		'googleFont' => 			array('format' => 'text',		'default' => '', 															'title' => 'Google web fonts',         'description' => I18n::_('googleFont_description')),
		'fontSize' => 				array('format' => 'text',		'default' => 'inherit', 					                                'title' => I18n::_('Font size'),         'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'bold'), 'default' => 'inherit', 	'title' => I18n::_('Font weight'),       'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'italic'), 'default' => 'inherit', 		'title' => I18n::_('Font style'),        'description' => ''),
		'fontVariant' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'small-caps'), 'default' => 'inherit','title' =>I18n::_('Font variant'),      'description' => ''),
		'lineHeight' => 			array('format' => 'text',		'default' => 'inherit', 					                                'title' => I18n::_('Line height'),       'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')),
	),
	'css' => array(
		'_' => array('title' => I18n::_('Custom CSS')),
		'customCSS' =>	array('format' => 'longtext',	'allow_blank' => true,	'default' => '',	'html_entities'	=> true,	'title' => I18n::_('Custom CSS'), 'description' => I18n::_('description_custom_css'))
	)	
	

);

return array($sectionTypes, $templateConf);

?>