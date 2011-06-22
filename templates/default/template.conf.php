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
		'color' => 					array('format' => 'color',		'default' => '#333333', 							'title' => 'Color', 'description' => ''),
		'fontFamily' => 			array('format' => 'fontselect',		'values' => $fontOptions, 'default' => reset(array_keys($fontOptions)), 			'title' => 'Font face', 'description' => ''), 
		'fontSize' => 				array('format' => 'text',		'default' => '9pt', 								'title' => 'Font size', 'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 		'title' => 'Font weight', 'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 		'title' => 'Font style', 'description' => ''),
		'fontVariant' => 			array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 	'title' => 'Font variant', 'description' => ''),
		'lineHeight' => 			array('format' => 'text',		'default' => 'normal', 								'title' => 'Line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"')
	),
	
	'links' => array(
		'colorLink' => 			array('format' => 'color',		'default' => '#888888', 	'title' => 'Link color', 'description' => ''),
		'colorVisited' => 			array('format' => 'color',		'default' => '#888888', 	'title' => 'Visited link color', 'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#888888', 	'title' => 'Link color when hovered', 'description' => ''),
		'colorActive' => 			array('format' => 'color',		'default' => '#888888', 	'title' => 'Link color when clicked', 'description' => ''),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		'title' => 'Link decoration', 'description' => ''),
		'textDecorationVisited' =>array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'none', 		'title' => 'Visited link decoration', 'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => 'Link decoration when hovered', 'description' => ''),
		'textDecorationActive' => array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => 'Link decoration when clicked', 'description' => '')
	),
	
	'background' => array(
		'backgroundColor' =>		array('format' => 'color',		'default' => '#FFFFFF',									'title' => 'Background color', 'description' => ''),
		'backgroundImageEnabled'=>  array('format' => 'select',		'values' => array('yes', 'no'), 'default' => 'no', 					'title' => 'Is background image enabled?', 'description' => ''),
		'backgroundImage' => 		array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => 'Background image', 'description' => 'Picture to use for page background.'),		
		'backgroundRepeat' => 		array('format' => 'select',		'values' => array('repeat'=>'tile vertically and horizontally', 'repeat-x' => 'tile horizontally', 'repeat-y' => 'tile vertically', 'no-repeat'=>'no tiling'), 'default' => 'repeat', 		'title' => 'Background tiling', 'description' => 'How the background fills the screen'), 
		'backgroundPosition' => 	array('format' => 'select',		'values' => array('top left', 'top center', 'top right', 'center left', 'center', 'center right', 'bottom left', 'bottom center', 'bottom right'), 'default' => 'top left', 	'title' => 'Background alignment', 'description' => 'Where the background image is positioned'),
		'backgroundAttachment' => 	array('format' => 'select',		'values' => array('fixed' => 'Fixed to browser window', 'fill' => 'Filled in browser window', 'scroll' => 'No stretch, scroll along with content'), 'default' => 'scroll', 		'title' => 'Background position', 'description' => 'Sets how background behaves in relation with the browser window.')
	),
	
	'pageLayout' => array(
		'contentPosition' => 		array('format' => 'select',		'values' => array('left', 'center', 'right'), 		'default' => 'left', 				'title' => 'Content position', 'description' => ''),
		'contentAlign' => 			array('format' => 'select',		'values' => array('left', 'right', 'justify-left', 'justify-right'), 	'default' => 'left', 'title' => 'Text alignment', 'description' => ''),
		'contentWidth' => 			array('format' => 'text',		'default' => '500px', 'css_units' => true,			'title' => 'Width of content area', 'description' => ''),
		'bodyMargin' => 			array('format' => 'text',		'default' => '20px 40px 40px', 'css_units' => true,	'title' => 'Page margins', 'description' => 'How far the content is from browser edges. Please see the short CSS guide at the bottom of this page.'),
		'siteMenuMargin' => 		array('format' => 'text',		'default' => '0px', 'css_units' => true,			'title' => 'Top menu margins', 'description' => 'How big is the distance from the top menu to the other page elements')
	),
	
	'pageHeading' => array(
		'image' => 					array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 1000, 'max_height' => 1000, 	 	'title' => 'Header image', 'description' => 'Picture to use instead of text.'),		
		'color' => 					array('format' => 'color',		'default' => '#333333', 					'title' => 'Color', 'description' => ''),
		'fontFamily' => 			array('format' => 'fontselect',		'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			'title' => 'Font face', 'description' => ''), 
		'fontSize' => 				array('format' => 'text',		'default' => '1.2em', 					'title' => 'Font size', 'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'bold', 				'title' => 'Font weight', 'description' => ''),
		'fontStyle' => 				array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 			'title' => 'Font style', 'description' => ''),
		'fontVariant' => 			array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 		'title' => 'Font variant', 'description' => ''),
		'lineHeight' => 			array('format' => 'text',		'default' => '0.8em', 					'title' => 'Line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"'),
		'margin' => 				array('format' => 'text',		'default' => '10px 0 15px', 			'title' => 'Margins', 'description' => 'How far the heading is form other elements in page. Please see the short CSS guide at the bottom of this page.'),
	),
	
	'menu' => array(
		'separator' => 				array('format' => 'text',		'default' => '|', 						'title' => 'Menu items separator', 'description' => ''),
		'separatorDistance' => 	array('format' => 'text',		'default' => '0.5em', 					'title' => 'Space width around separator', 'description' => 'The distance from the separator to the menu item on both sides'),
		'fontSize' => 				array('format' => 'text',		'default' => 'inherit', 				'title' => 'Font size', 'description' => ''),
		'fontFamily' => 			array('format' => 'fontselect',		'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			'title' => 'Font face', 'description' => ''), 
		'fontWeight' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'bold'), 'default' => 'inherit', 				'title' => 'Font weight', 'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'italic'), 'default' => 'inherit', 				'title' => 'Font style', 'description' => ''),
		'fontVariant' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'small-caps'), 'default' => 'inherit', 			'title' => 'Font variant', 'description' => ''),
		'lineHeight' =>			array('format' => 'text',		'default' => 'inherit', 				'title' => 'Line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"'),
		'margin' => 				array('format' => 'text',		'default' => '0', 				'title' => 'Margins', 'description' => 'How far the menu is form other elements in page. Please see the short CSS guide at the bottom of this page.')
	),
	
	'subMenu' => array(
		'separator' => 				array('format' => 'text',		'default' => '|', 						'title' => 'Menu items separator', 'description' => ''),
		'separatorDistance' => 	array('format' => 'text',		'default' => '0.5em', 					'title' => 'Space width around separator', 'description' => 'The distance from the separator to the menu item on both sides'),
		'fontSize' => 				array('format' => 'text',		'default' => 'inherit', 				'title' => 'Font size', 'description' => ''),
		'fontFamily' => 			array('format' => 'fontselect',		'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			'title' => 'Font face', 'description' => ''), 
		'fontWeight' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'bold'), 'default' => 'inherit', 				'title' => 'Font weight', 'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'italic'), 'default' => 'inherit', 				'title' => 'Font style', 'description' => ''),
		'fontVariant' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'small-caps'), 'default' => 'inherit', 			'title' => 'Font variant', 'description' => ''),
		'lineHeight' =>			array('format' => 'text',		'default' => 'inherit', 				'title' => 'Line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"'),
		'margin' => 				array('format' => 'text',		'default' => '0 0 10px', 				'title' => 'Margins', 'description' => 'How far the menu is form other elements in page. Please see the short CSS guide at the bottom of this page.')
	),
	
	
	
	'entryHeading' => array(
		'color' => 				array('format' => 'color',		'default' => '#333333', 					'title' => 'Color', 'description' => ''),
		'fontFamily' => 		array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			'title' => 'Font face', 'description' => ''), 
		'fontSize' => 			array('format' => 'text',		'default' => '1.8em', 					'title' => 'Font size', 'description' => ''),
		'fontWeight' => 		array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 			'title' => 'Font weight', 'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 			'title' => 'Font style', 'description' => ''),
		'fontVariant' => 		array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 		'title' => 'Font variant', 'description' => ''),
		'lineHeight' => 		array('format' => 'text',		'default' => 'normal', 					'title' => 'Line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"'),
		'margin' => 			array('format' => 'text',		'default' => '0', 						'title' => 'Margins', 'description' => 'How far the entry heading is form other elements in page. Please see the short CSS guide at the bottom of this page.'),
	),
	
	'entryLayout' => array(
		'margin' => 			 array('format' => 'text',		'default' => '0 0 4em', 							'title' => 'Entry margins', 	'description' => 'Margins around entries. Please see the short CSS guide at the bottom of this page.'),
		'galleryPosition' => 	 array('format' => 'select',	'values' => array('between title/description', 'above title', 'below description'), 'default' => 'between title/description', 					'title' => 'Gallery position', 'description' => ''),
		'defaultGalleryType' =>  array('format' => 'select',	'values' => array('slideshow', 'row'), 'default' => 'slideshow', 					'title' => 'Default gallery type', 'description' => 'Slideshow means that an image menu plus only one image is visible at a time. Row means that all images are visible.'),
		'spaceBetweenRowImages'=>array('format' => 'text',		'default' => '1em', 								'title' => 'Space between images in row', 'description' => ''),
		'galleryMargin' => 		 array('format' => 'text',		'default' => '0', 									'title' => 'Gallery margins', 	'description' => 'Margin around gallery block'),
		'displayTags' =>  		 array('format' => 'select',	'values' => array('yes', 'no'), 'default' => 'yes', 'title' => 'Display tags by each entry', 'description' => 'This determines whether people will see tags you set for each entry. Regardless of this settting, tags still will make up the main menu.'),
		'dateFormat' => 		 array('format' => 'select',	'values' => array('year', 'month and year', 'day, month and year', 'full', 'hidden'), 'default' => 'hidden', 'title' => 'Date format in entries', 'description' => ''),
		'dateSeparator1' => 	 array('format' => 'text',		'allow_blank' => false,	'default' => '/', 			'title' => 'Date deparator', 'description' => 'Separator symbol that divides year, month and day'),
		'dateSeparator2' => 	 array('format' => 'text',		'allow_blank' => false,	'default' => ':', 			'title' => 'Time separator', 'description' => '')
	),
	
	'entryFooter' => array(
		'color' => 					array('format' => 'color',		'default' => '#333333', 					'title' => 'Color', 'description' => ''),
		'fontFamily' => 			array('format' => 'fontselect',		'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			'title' => 'Font face', 'description' => ''), 
		'fontSize' => 				array('format' => 'text',		'default' => 'inherit', 					'title' => 'Font size', 'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'bold'), 'default' => 'inherit', 			'title' => 'Font weight', 'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'italic'), 'default' => 'inherit', 			'title' => 'Font style', 'description' => ''),
		'fontVariant' => 			array('format' => 'select',		'values' => array('inherit', 'normal', 'small-caps'), 'default' => 'inherit', 		'title' => 'Font variant', 'description' => ''),
		'lineHeight' => 			array('format' => 'text',		'default' => 'inherit', 					'title' => 'Line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"'),
	)
	
	

);

return array($sectionTypes, $templateConf);

?>