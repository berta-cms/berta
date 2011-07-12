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
	'mash_up' => array('title' => 'Mash-up', 'params' => array(
		'marked_items_imageselect' => array('format' => 'select', 'values' => array('random' => 'random image', 'first' => 'first image'), 'default' => 'first', 'html_before' => '<div>show </div>'),
		'marked_items_count' => array('format' => 'text', 'html_before' => '<br class="clear" /><div>from each of </div>', 'html_after' => '<div> marked entries</div><br class="clear" /><div>from all sections except this one</div>', 'default' => '5')
	)),
);

$templateConf = array(
	
	'generalFontSettings' => array(
		'color' => 				array('format' => 'color',		'default' => '#1a1a1a', 							'title' => 'Color', 'description' => ''),
		'fontFamily' => 		array('format' => 'fontselect',	'values' => $fontOptions, 'default' => '"Times New Roman", Times, serif', 			'title' => 'Font face', 'description' => ''), 
		'fontSize' => 			array('format' => 'text',		'default' => '11px', 								'title' => 'Font size', 'description' => ''),
		'fontWeight' => 		array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 		'title' => 'Font weight', 'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 		'title' => 'Font style', 'description' => ''),
		'fontVariant' => 		array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 	'title' => 'Font variant', 'description' => ''),
		'lineHeight' => 		array('format' => 'text',		'default' => 'normal', 								'title' => 'Line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"')
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
		'contentWidth' => 		array('format' => 'text',	'default' => '380px',	'css_units' => true, 	'title' => 'Widh of content area', 'description' => 'Width of texts in the entries. This does not apply to the width of images.'),
		'paddingTop' => 		array('format' => 'text',	'default' => '30px',	'css_units' => true, 	'title' => 'How far content is from page top?', 'description' => 'The vertical distance between the top of the page and the content area.'),
		'paddingLeft' => 		array('format' => 'text',	'default' => '30px',	'css_units' => true, 	'title' => 'How far content is from sidebar?', 'description' => 'The horizontal distance between the menu and the content area.')		
	),
	
	'entryLayout' => array(
		'spaceBetween' => 		 array('format' => 'text',	'default' => '20px', 'css_units' => true,		'title' => 'Space between entries', 	'description' => 'Distance from entry to entry. In pixels.'),
		'defaultGalleryType' =>  array('format' => 'select',		'values' => array('slideshow', 'row'), 'default' => 'slideshow', 					'title' => 'Default gallery type', 'description' => ''),
		'spaceBetweenRowImages'=>array('format' => 'text',		'default' => '5px', 'css_units' => true,				'title' => 'Space between images in row', 'description' => 'Horizontal space bween images when gallery is in "row" mode'),
		'galleryNavMargin' => 	 array('format' => 'text',		'default' => '5px', 'css_units' => true,					'title' => 'Space between images and image navigation', 	'description' => 'Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode'),
		'galleryMargin' => 		 array('format' => 'text',		'default' => '5px', 'css_units' => true,				'title' => 'Empty space below gallery', 	'description' => 'Distance between the gallery and the content below'),
		'displayTags' =>  		 array('format' => 'select',	'values' => array('yes', 'no'), 'default' => 'no', 	'title' => 'Display tags by each entry', 'description' => 'This determines whether people will see tags you set for each entry. Regardless of this settting, tags still will make up the main menu.')
	),
	
	'sideBar' => array(
		'width' => 				array('format' => 'text',	'default' => '200px',	'css_units' => true, 'title' => 'Width', 'description' => ''),
		'marginLeft' => 		array('format' => 'text',	'default' => '0px', 	'css_units' => true, 'title' => 'Left margin', 'description' => 'How far the sidebar is from the left side of the screen.'),
		'marginTop' => 			array('format' => 'text',	'default' => '30px', 	'css_units' => true, 'title' => 'Top padding', 'description' => 'How far the header is from the top of the screen?'),
		'marginBottom' => 		array('format' => 'text',	'default' => '20px', 	'css_units' => true, 'title' => 'Space between header and menu', 'description' => 'How far the menu is from the header text or header image.'),
		
		'transparent'=>			array('format' => 'select',	'values' => array('yes', 'no'), 'default' => 'no','title' => 'Is transparent?', 'description' => ''),
		'backgroundColor' =>	array('format' => 'color',	'default' => '#ffffff',				'title' => 'Background color', 'description' => ''),
		
		'image' => 				array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 'setting:template:sideBar:width', 'max_height' => 1600, 	 	'title' => 'Logo image', 'description' => 'Picture to use instead of header text. Max size: 140 x 400 pixels. If the image is larger, it will be reduced.'),		
		'color' => 				array('format' => 'color',		'default' => '#1a1a1a', 					'title' => 'Heading text color', 'description' => ''),
		'fontFamily' => 		array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => 'Georgia, "Times New Roman", Times, serif', 			'title' => 'Heading font', 'description' => ''), 
		'fontSize' => 			array('format' => 'text',		'default' => '10px', 					'title' => 'Heading font size', 'description' => ''),
		'fontWeight' => 		array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 				'title' => 'Heading font weight', 'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 			'title' => 'Heading font style', 'description' => ''),
		'fontVariant' => 		array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 		'title' => 'Heading font variant', 'description' => ''),
		'lineHeight' => 		array('format' => 'text',		'default' => '1em', 					'title' => 'Heading line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"')
		
		
	),
	
	'firstPage' => array(
		'imageSizeRatio' => 	array('format' => 'text',		'default' => '0.4', 'css_units' => false,	'title' => 'Image size ratio', 	'description' => 'Images in the first page layout will be resized by this ratio. Think of it as percentage, e.g., 0.7 = 70% of the original image size.'),
		'imageHaveShadows'=>	array('format' => 'select',		'values' => array('yes', 'no'), 'default' => 'no', 	'title' => 'Images have shadows?', 'description' => ''),
		'hoverWiggle'=>			array('format' => 'select',		'values' => array('yes', 'no'), 'default' => 'yes', 	'title' => 'Images wiggle on mouse-over?', 'description' => '')
	
	),
	
	'menu' => array(
		'fontFamily' => 			array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			'title' => 'Font face', 'description' => ''), 
		'fontSize' => 				array('format' => 'text',		'default' => '10px', 								'title' => 'Font size', 'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 		'title' => 'Font weight', 'description' => ''),
		'fontStyle' => 				array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 		'title' => 'Font style', 'description' => ''),
		'lineHeight' => 			array('format' => 'text',		'default' => '16px', 								'title' => 'Line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"'),
		'colorLink' => 				array('format' => 'color',		'default' => '#1a1a1a', 	'title' => 'Color', 'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#0000ff', 	'title' => 'Color when hovered', 'description' => ''),
		'colorActive' => 			array('format' => 'color',		'default' => '#1a1a1a', 	'title' => 'Color when opened', 'description' => ''),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		'title' => 'Decoration', 'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'none', 		'title' => 'Decoration when hovered', 'description' => ''),
		'textDecorationActive' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => 'Decoration when opened', 'description' => '')
	),
	
	'tagsMenu' => array(
		'fontFamily' => 			array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			'title' => 'Font face', 'description' => ''), 
		'fontSize' => 				array('format' => 'text',		'default' => '11px', 								'title' => 'Font size', 'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 		'title' => 'Font weight', 'description' => ''),
		'fontStyle' => 				array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 		'title' => 'Font style', 'description' => ''),
		'lineHeight' => 			array('format' => 'text',		'default' => '16px', 								'title' => 'Line height', 'description' => 'Height of text line. Use em, px or % values or the default value "normal"'),
		'colorLink' => 				array('format' => 'color',			'default' => '#1a1a1a', 	'title' => 'Color', 'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#0000ff', 	'title' => 'Color when hovered', 'description' => ''),
		'colorActive' => 			array('format' => 'color',		'default' => '#1a1a1a', 	'title' => 'Color when selected', 'description' => ''),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		'title' => 'Decoration', 'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'none', 		'title' => 'Decoration when hovered', 'description' => ''),
		'textDecorationActive' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'line-through', 		'title' => 'Decoration when opened', 'description' => '')
	),
	
	'links' => array(
		'colorLink' => 			array('format' => 'color',		'default' => '#0000ff', 	'title' => 'Link color', 'description' => ''),
		'colorVisited' => 			array('format' => 'color',		'default' => '#666666', 	'title' => 'Visited link color', 'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#0000ff', 	'title' => 'Link color when hovered', 'description' => ''),
		'colorActive' => 			array('format' => 'color',		'default' => '#0000ff', 	'title' => 'Link color when clicked', 'description' => ''),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		'title' => 'Link decoration', 'description' => ''),
		'textDecorationVisited' =>array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'none', 		'title' => 'Visited link decoration', 'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => 'Link decoration when hovered', 'description' => ''),
		'textDecorationActive' => array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => 'Link decoration when clicked', 'description' => '')
	)
);

return array($sectionTypes, $templateConf);

?>