<?

$fontOptions = array(
	'Arial, sans-serif' => 'Arial, sans-serif',
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
	)),
	'grid' => array('title' => 'Thumbnails enabled'),
	
);

$templateConf = array(
	
	'generalFontSettings' => array(
		'_' => array('title' => I18n::_('General font settings')),
		'color' => 				array('format' => 'color',		'default' => '#363636', 							                'title' => I18n::_('Color'),         'description' => ''),
		'fontFamily' => 		array('format' => 'fontselect',	'values' => $fontOptions, 'default' => 'Arial, sans-serif', 		'title' => I18n::_('Font face'),     'description' => ''),
		'googleFont' => 			array('format' => 'text',		'default' => '', 															'title' => 'Google web fonts',         'description' => I18n::_('googleFont_description')),
		'fontSize' => 			array('format' => 'text',		'default' => '12px', 								                'title' => I18n::_('Font size'),     'description' => ''),
		'fontWeight' => 		array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 		'title' => I18n::_('Font weight'),   'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 		'title' => I18n::_('Font style'),    'description' => ''),
		'fontVariant' => 		array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 	'title' => I18n::_('Font variant'),  'description' => ''),
		'lineHeight' => 		array('format' => 'text',		'default' => '18px', 								                'title' => I18n::_('Line height'),   'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'))
	),
	
	'background' => array(
		'_' => array('title' => I18n::_('Background')),
		'backgroundColor' =>		array('format' => 'color',		'default' => '#FFFFFF',									                                                                                                                                    'title' => I18n::_('Background color'),                      'description' => I18n::_('IMPORTANT! These settings will be overwritten, if you are using background gallery feature. You access it by clicking \'edit background gallery\' button in each section.')),
		'backgroundImageEnabled'=>  array('format' => 'select',		'values' => array('yes', 'no'), 'default' => 'no', 				                                                                                                                            'title' => I18n::_('Is background image enabled?'),          'description' => ''),
		'backgroundImage' => 		array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	                                                                                    'title' => I18n::_('Background image'),                      'description' => I18n::_('Picture to use for page background.')),
		'backgroundRepeat' => 		array('format' => 'select',		'values' => array('repeat'=>'tile vertically and horizontally', 'repeat-x' => 'tile horizontally', 'repeat-y' => 'tile vertically', 'no-repeat'=>'no tiling'), 'default' => 'repeat', 		'title' => I18n::_('Background tiling'),                     'description' => I18n::_('How the background fills the screen?')),
		'backgroundPosition' => 	array('format' => 'select',		'values' => array('top left', 'top center', 'top right', 'center left', 'center', 'center right', 'bottom left', 'bottom center', 'bottom right'), 'default' => 'top left', 	            'title' => I18n::_('Background alignment'),                  'description' => I18n::_('Where the background image is positioned?')),
		'backgroundAttachment' => 	array('format' => 'select',		'values' => array('fixed' => 'Fixed to browser window', 'fill' => 'Filled in browser window', 'scroll' => 'No stretch, scroll along with content'), 'default' => 'scroll', 		            'title' => I18n::_('Background position'),                   'description' => I18n::_('Sets how background behaves in relation with the browser window.'))
	),
	
	'entryHeading' => array(
		'_' => array('title' => I18n::_('Entry heading')),
		'color' => 				array('format' => 'color',		'default' => '#363636', 					                                    'title' => I18n::_('Color'),             'description' => ''),
		'fontFamily' => 		array('format' => 'fontselect',	'values' => $fontOptions, 'default' => 'Arial, sans-serif', 			        'title' => I18n::_('Font face'),         'description' => ''),
		'googleFont' => 			array('format' => 'text',		'default' => '', 															'title' => 'Google web fonts',         'description' => I18n::_('googleFont_description')),
		'fontSize' => 			array('format' => 'text',		'default' => '1.8em', 					                                        'title' => I18n::_('Font size'),         'description' => ''),
		'fontWeight' => 		array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 			        'title' => I18n::_('Font weight'),       'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 			        'title' => I18n::_('Font style'),        'description' => ''),
		'fontVariant' => 		array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 		        'title' => I18n::_('Font variant'),      'description' => ''),
		'lineHeight' => 		array('format' => 'text',		'default' => 'normal', 					                                        'title' => I18n::_('Line height'),       'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')),
		'margin' => 			array('format' => 'text',		'default' => '0', 						                                        'title' => I18n::_('Margins'),           'description' => I18n::_('How far the entry heading is form other elements in page. Please see the short CSS guide at the bottom of this page.')),
	),
		
	'entryLayout' => array(
		'_' => array('title' => I18n::_('Entry layout')),
		'contentWidth' => 		array('format' => 'text',	'default' => '400px',	'css_units' => true,                                'title' => I18n::_('Entry text max width'),                             'description' => ''),
		'defaultGalleryType' =>  array('format' => 'select',		'values' => array('slideshow', 'row'), 'default' => 'slideshow',    'title' => I18n::_('Default gallery type'),                         'description' => I18n::_('Slideshow means that an image menu plus only one image is visible at a time. Row means that all images are visible.')),
		'galleryNavMargin' => 	 array('format' => 'text',		'default' => '0', 'css_units' => true,					                'title' => I18n::_('Space between images and image navigation'), 	'description' => I18n::_('Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode')),
		'galleryMargin' => 		 array('format' => 'text',		'default' => '0', 'css_units' => true,				                    'title' => I18n::_('Empty space below gallery'), 	                'description' => I18n::_('Distance between the gallery and the content below')),
		'displayTags' =>  		 array('format' => 'select',	'values' => array('yes', 'no'), 'default' => 'no', 	                    'title' => I18n::_('Display tags by each entry'),                   'description' => I18n::_('This determines whether people will see tags you set for each entry. Regardless of this settting, tags still will make up the main menu.'))
	),
	
	'heading' => array(
		'_' => array('title' => I18n::_('Page heading')),
		'position' => 				array('format' => 'select',		'values' => array('fixed', 'absolute'), 'default' => 'absolute', 		                        'title' => I18n::_('Heading position'),           'description' => I18n::_('description_heading_position')),
		'image' => 				array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 140, 'max_height' => 400, 	 	'title' => I18n::_('Logo image'),    'description' => I18n::_('Picture to use instead of header text. Max size: 140 x 400 pixels. If the image is larger, it will be reduced.')),
		'color' => 				array('format' => 'color',		'default' => '#000000',                                                                             'title' => I18n::_('Color'),         'description' => ''),
		'fontFamily' => 		array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => '"Arial black", Gadget', 			    'title' => I18n::_('Font face'),     'description' => ''),
		'googleFont' => 			array('format' => 'text',		'default' => '', 															'title' => 'Google web fonts',         'description' => I18n::_('googleFont_description')),
		'fontSize' => 			array('format' => 'text',		'default' => '30px',                                                                                'title' => I18n::_('Font size'),     'description' => ''),
		'fontWeight' => 		array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'bold',                                           'title' => I18n::_('Font weight'),   'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal',                                       'title' => I18n::_('Font style'),    'description' => ''),
		'fontVariant' => 		array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal',                                   'title' => I18n::_('Font variant'),  'description' => ''),
		'lineHeight' => 		array('format' => 'text',		'default' => '1em',                                                                                 'title' => I18n::_('Line height'),   'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'))
	),
	
	'menu' => array(
		'_' => array('title' => I18n::_('Main menu')),
		'position' => 				array('format' => 'select',		'values' => array('fixed', 'absolute'), 'default' => 'absolute', 		                        'title' => I18n::_('Menu position'),           'description' => I18n::_('description_menu_position')),
		'fontFamily' => 			array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => '"Arial black", Gadget',  'title' => I18n::_('Font face'),             'description' => ''),
		'googleFont' => 			array('format' => 'text',		'default' => '', 															'title' => 'Google web fonts',         'description' => I18n::_('googleFont_description')),
		'fontSize' => 				array('format' => 'text',		'default' => '20px', 								                                    'title' => I18n::_('Font size'),             'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'bold', 		                        'title' => I18n::_('Font weight'),           'description' => ''),
		'fontStyle' => 				array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 		                    'title' => I18n::_('Font style'),            'description' => ''),
		'lineHeight' => 			array('format' => 'text',		'default' => '16px', 								                                    'title' => I18n::_('Line height'),           'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')),
		'colorLink' => 				array('format' => 'color',		'default' => '#000000', 	                                                            'title' => I18n::_('Color'),                 'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#000000', 	                                                            'title' => I18n::_('Color when hovered'),    'description' => I18n::_('Color of the element under mouse cursor')),
		'colorActive' => 			array('format' => 'color',		'default' => '#000000', 	                                                            'title' =>I18n::_( 'Color when selected'),   'description' => I18n::_('Color of the element of the currently opened section')),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		    'title' => I18n::_('Decoration'),                'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => I18n::_('Decoration when hovered'),   'description' => ''),
		'textDecorationActive' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'line-through',    'title' => I18n::_('Decoration when selected'),    'description' => '')
	),
	
	'tagsMenu' => array(
		'_' => array('title' => I18n::_('Submenu')),
		'fontFamily' => 			array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => '"Arial black", Gadget',  'title' => I18n::_('Font face'),             'description' => ''),
		'googleFont' => 			array('format' => 'text',		'default' => '', 															'title' => 'Google web fonts',         'description' => I18n::_('googleFont_description')),
		'fontSize' => 				array('format' => 'text',		'default' => '16px', 								                                    'title' => I18n::_('Font size'),             'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal',                             'title' => I18n::_('Font weight'),           'description' => ''),
		'fontStyle' => 				array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal',                           'title' => I18n::_('Font style'),            'description' => ''),
		'lineHeight' => 			array('format' => 'text',		'default' => '16px',                                                                    'title' => I18n::_('Line height'),           'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')),
		'colorLink' => 				array('format' => 'color',			'default' => '#000000',                                                             'title' => I18n::_('Color'),                 'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#000000',                                                                 'title' => I18n::_('Color when hovered'),    'description' => ''),
		'colorActive' => 			array('format' => 'color',		'default' => '#000000',                                                                 'title' => I18n::_('Color when selected'),   'description' => ''),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		'title' => I18n::_('Decoration'),                'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 	'title' => I18n::_('Decoration when hovered'),   'description' => ''),
		'textDecorationActive' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 	'title' => I18n::_('Decoration when selected'),    'description' => ''),
		'x' => 				array('format' => 'text',		'default' => '0', 								                                    'title' => I18n::_('Positon X'),             'description' => I18n::_('description_tagsMenu_x')),		
		'y' => 				array('format' => 'text',		'default' => '0', 								                                    'title' => I18n::_('Positon Y'),             'description' => I18n::_('description_tagsMenu_y')),
		'alwaysOpen' =>  		 array('format' => 'select',	'values' => array('yes', 'no'), 'default' => 'yes', 	                    'title' => I18n::_('Submenu is allways open'),                   'description' => I18n::_('description_submenu_alwaysopen')),				
		'hidden' =>                 array('format' => 'select',     'values' => array('yes', 'no'), 'default' => 'no',                         'title' => I18n::_('Submenu is hidden'),        'description' => ''),
	),
	
	'links' => array(
		'_' => array('title' => I18n::_('Hyperlinks')),
		'colorLink' => 			array('format' => 'color',		'default' => '#000000', 	    'title' => I18n::_('Link color'),                'description' => ''),
		'colorVisited' => 			array('format' => 'color',		'default' => '#000000', 	'title' => I18n::_('Visited link color'),        'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#000000', 	'title' => I18n::_('Link color when hovered'),   'description' => ''),
		'colorActive' => 			array('format' => 'color',		'default' => '#000000', 	'title' => I18n::_('Link color when clicked'),   'description' => ''),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		'title' => I18n::_('Link decoration'),               'description' => ''),
		'textDecorationVisited' =>array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'none', 		'title' => I18n::_('Visited link decoration'),       'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 	'title' => I18n::_('Link decoration when hovered'),  'description' => ''),
		'textDecorationActive' => array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 	'title' => I18n::_('Link decoration when clicked'),  'description' => '')
	),
	
	'grid' => array(
		'_' => array('title' => I18n::_('Thumbnails')),
		'contentWidth' => 		array('format' => 'text', 		'default' => '60%',			'title' => I18n::_('Thumbnail container width'),
'description' => 'IMPORTANT! This must be set as percentage. i.e. 60% '),
	)
);

if(@file_exists('../_plugin_shop/template.conf.php')) {
	include('../_plugin_shop/template.conf.php');
}

return array($sectionTypes, $templateConf);

?>