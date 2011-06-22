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
	))
);

$templateConf = array(
	
	'generalFontSettings' => array(
		'color' => 				array('format' => 'color',		'default' => '#363636', 							'title' => 'Color', 'description' => ''),
		'fontFamily' => 		array('format' => 'fontselect',	'values' => $fontOptions, 'default' => 'Arial, sans-serif', 			'title' => 'Font face', 'description' => ''), 
		'fontSize' => 			array('format' => 'text',		'default' => '12px', 								'title' => 'Font size', 'description' => ''),
		'fontWeight' => 		array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 		'title' => 'Font weight', 'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 		'title' => 'Font style', 'description' => ''),
		'fontVariant' => 		array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 	'title' => 'Font variant', 'description' => ''),
		'lineHeight' => 		array('format' => 'text',		'default' => '18px', 								'title' => 'Line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"')
	),
	
	'background' => array(
		'backgroundColor' =>		array('format' => 'color',		'default' => '#FFFFFF',									'title' => 'Background color', 'description' => ''),
		'backgroundImageEnabled'=>  array('format' => 'select',		'values' => array('yes', 'no'), 'default' => 'no', 					'title' => 'Is background image enabled?', 'description' => ''),
		'backgroundImage' => 		array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => 'Background image', 'description' => 'Picture to use for page background.'),		
		'backgroundRepeat' => 		array('format' => 'select',		'values' => array('repeat'=>'tile vertically and horizontally', 'repeat-x' => 'tile horizontally', 'repeat-y' => 'tile vertically', 'no-repeat'=>'no tiling'), 'default' => 'repeat', 		'title' => 'Background tiling', 'description' => 'How the background fills the screen'), 
		'backgroundPosition' => 	array('format' => 'select',		'values' => array('top left', 'top center', 'top right', 'center left', 'center', 'center right', 'bottom left', 'bottom center', 'bottom right'), 'default' => 'top left', 	'title' => 'Background alignment', 'description' => 'Where the background image is positioned'),
		'backgroundAttachment' => 	array('format' => 'select',		'values' => array('fixed' => 'Fixed to browser window', 'fill' => 'Filled in browser window', 'scroll' => 'No stretch, scroll along with content'), 'default' => 'scroll', 		'title' => 'Background position', 'description' => 'Sets how background behaves in relation with the browser window.')
	),
	
	'entryLayout' => array(
		'contentWidth' => 		array('format' => 'text',	'default' => '400px',	'css_units' => true, 	'title' => 'Entry text width', 'description' => ''),
		'defaultGalleryType' =>  array('format' => 'select',		'values' => array('slideshow', 'row'), 'default' => 'slideshow', 					'title' => 'Default gallery type', 'description' => ''),
		'galleryNavMargin' => 	 array('format' => 'text',		'default' => '0', 'css_units' => true,					'title' => 'Space between images and image navigation', 	'description' => 'Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode'),
		'galleryMargin' => 		 array('format' => 'text',		'default' => '0', 'css_units' => true,				'title' => 'Empty space below gallery', 	'description' => 'Distance between the gallery and the content below'),
		'displayTags' =>  		 array('format' => 'select',	'values' => array('yes', 'no'), 'default' => 'no', 	'title' => 'Display tags by each entry', 'description' => 'This determines whether people will see tags you set for each entry. Regardless of this settting, tags still will make up the main menu.')
	),
	
	'heading' => array(
		'image' => 				array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 140, 'max_height' => 400, 	 	'title' => 'Logo image', 'description' => 'Picture to use instead of header text. Max size: 140 x 400 pixels. If the image is larger, it will be reduced.'),		
		'color' => 				array('format' => 'color',		'default' => '#000000', 					'title' => 'Heading text color', 'description' => ''),
		'fontFamily' => 		array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => '"Courier New", Courier, monospace', 			'title' => 'Heading font', 'description' => ''), 
		'fontSize' => 			array('format' => 'text',		'default' => '30px', 					'title' => 'Heading font size', 'description' => ''),
		'fontWeight' => 		array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'bold', 				'title' => 'Heading font weight', 'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 			'title' => 'Heading font style', 'description' => ''),
		'fontVariant' => 		array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 		'title' => 'Heading font variant', 'description' => ''),
		'lineHeight' => 		array('format' => 'text',		'default' => '1em', 					'title' => 'Heading line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"')
	),
	
	'menu' => array(
		'fontFamily' => 			array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => '"Courier New", Courier, monospace', 			'title' => 'Font face', 'description' => ''), 
		'fontSize' => 				array('format' => 'text',		'default' => '20px', 								'title' => 'Font size', 'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'bold', 		'title' => 'Font weight', 'description' => ''),
		'fontStyle' => 				array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 		'title' => 'Font style', 'description' => ''),
		'lineHeight' => 			array('format' => 'text',		'default' => '16px', 								'title' => 'Line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"'),
		'colorLink' => 				array('format' => 'color',		'default' => '#000000', 	'title' => 'Color', 'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#000000', 	'title' => 'Color when hovered', 'description' => ''),
		'colorActive' => 			array('format' => 'color',		'default' => '#000000', 	'title' => 'Color when selected', 'description' => ''),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		'title' => 'Decoration', 'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => 'Decoration when hovered', 'description' => ''),
		'textDecorationActive' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'line-through', 		'title' => 'Decoration when opened', 'description' => '')
	),
	
	'tagsMenu' => array(
		'fontFamily' => 			array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => '"Courier New", Courier, monospace', 			'title' => 'Font face', 'description' => ''), 
		'fontSize' => 				array('format' => 'text',		'default' => '16px', 								'title' => 'Font size', 'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 		'title' => 'Font weight', 'description' => ''),
		'fontStyle' => 				array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 		'title' => 'Font style', 'description' => ''),
		'lineHeight' => 			array('format' => 'text',		'default' => '16px', 								'title' => 'Line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"'),
		'colorLink' => 				array('format' => 'color',			'default' => '#000000', 	'title' => 'Color', 'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#000000', 	'title' => 'Color when hovered', 'description' => ''),
		'colorActive' => 			array('format' => 'color',		'default' => '#000000', 	'title' => 'Color when selected', 'description' => ''),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		'title' => 'Decoration', 'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => 'Decoration when hovered', 'description' => ''),
		'textDecorationActive' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => 'Decoration when opened', 'description' => '')
	),
	
	'links' => array(
		'colorLink' => 			array('format' => 'color',		'default' => '#000000', 	'title' => 'Link color', 'description' => ''),
		'colorVisited' => 			array('format' => 'color',		'default' => '#000000', 	'title' => 'Visited link color', 'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#000000', 	'title' => 'Link color when hovered', 'description' => ''),
		'colorActive' => 			array('format' => 'color',		'default' => '#000000', 	'title' => 'Link color when clicked', 'description' => ''),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		'title' => 'Link decoration', 'description' => ''),
		'textDecorationVisited' =>array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'none', 		'title' => 'Visited link decoration', 'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => 'Link decoration when hovered', 'description' => ''),
		'textDecorationActive' => array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => 'Link decoration when clicked', 'description' => '')
	)
);

return array($sectionTypes, $templateConf);

?>