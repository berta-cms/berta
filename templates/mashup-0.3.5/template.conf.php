<?php

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
        '_' => array('title' => I18n::_('General font settings')),
		'color' => 				array('format' => 'color',		'default' => '#1a1a1a', 							'title' => I18n::_('Color'), 'description' => ''),
		'fontFamily' => 		array('format' => 'fontselect',	'values' => $fontOptions, 'default' => '"Times New Roman", Times, serif', 			'title' => I18n::_('Font face'), 'description' => ''),
		'googleFont' => 		array('format' => 'text',		'default' => '', 'html_entities' => true,			'title' => I18n::_('Google web fonts'),         'description' => I18n::_('googleFont_description')),
		'fontSize' => 			array('format' => 'text', 'css_units' => true, 'default' => '11px', 								'title' => I18n::_('Font size'), 'description' => ''),
		'fontWeight' => 		array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 		'title' => I18n::_('Font weight'), 'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 		'title' => I18n::_('Font style'), 'description' => ''),
		'fontVariant' => 		array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 	'title' => I18n::_('Font variant'), 'description' => ''),
		'lineHeight' => 		array('format' => 'text', 'css_units' => true, 'default' => 'normal', 								'title' => I18n::_('Line height'), 'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'))
	),

	'background' => array(
        '_' => array('title' => I18n::_('Background')),
		'backgroundColor' =>		array('format' => 'color',		'default' => '#FFFFFF',									'title' => I18n::_('Background color'), 'description' => ''),
		'backgroundImageEnabled'=>  array('format' => 'select',		'values' => array('yes', 'no'), 'default' => 'no', 					'title' => I18n::_('Is background image enabled?'), 'description' => ''),
		'backgroundImage' => 		array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => I18n::_('Background image'), 'description' => I18n::_('Picture to use for page background.')),
		'backgroundRepeat' => 		array('format' => 'select',		'values' => array('repeat'=>'tile vertically and horizontally', 'repeat-x' => 'tile horizontally', 'repeat-y' => 'tile vertically', 'no-repeat'=>'no tiling'), 'default' => 'repeat', 		'title' => I18n::_('Background tiling'), 'description' => I18n::_('How the background fills the screen?')),
		'backgroundPosition' => 	array('format' => 'select',		'values' => array('top left', 'top center', 'top right', 'center left', 'center', 'center right', 'bottom left', 'bottom center', 'bottom right'), 'default' => 'top left', 	'title' => I18n::_('Background alignment'), 'description' => I18n::_('Where the background image is positioned?')),
		'backgroundAttachment' => 	array('format' => 'select',		'values' => array('fixed' => 'Fixed to browser window', 'fill' => 'Filled in browser window', 'scroll' => 'No stretch, scroll along with content'), 'default' => 'scroll', 		'title' => I18n::_('Background position'), 'description' => I18n::_('Sets how background behaves in relation with the browser window.'))
	),

	'pageLayout' => array(
        '_' => array('title' => I18n::_('Page layout')),
        'centered' =>	array('format' => 'select', 'default' => 'no', 'values' => array('yes', 'no'), 'title' => I18n::_('Centered layout'), 'description' => I18n::_('Sets whether layout should be centered or not.')),
		'contentWidth' => 		array('format' => 'text',	'default' => '380px',	'css_units' => true, 	'title' => I18n::_('Entry text max width'), 'description' => I18n::_('Width of texts in the entries. This does not apply to the width of images.')),
		'paddingTop' => 		array('format' => 'text',	'default' => '30px',	'css_units' => true, 	'title' => I18n::_('How far content is from page top?'), 'description' => I18n::_('The vertical distance between the top of the page and the content area.')),
		'paddingLeft' => 		array('format' => 'text',	'default' => '30px',	'css_units' => true, 	'title' => I18n::_('How far content is from sidebar?'), 'description' => I18n::_('The horizontal distance between the menu and the content area.')),
		'group_responsive' => array('format' => false, 'default' => false, 'title' => '<h3>'.I18n::_('Resposive design').'</h3>'),
		'responsive' =>	array('format' => 'select', 'default' => 'no', 'values' => array('no', 'yes'), 'title' => I18n::_('Enabled'), 'description' => I18n::_('Sets whether layout should be responsive or not.')),
		'mashUpColumns' => array('format' => 'select', 'default' => '1', 'values' => array('1','2','3','4'), 'title' => I18n::_('Mash-up columns'), 'description' => I18n::_('Column count for Mash-up section.')),
	),

	'entryLayout' => array(
        '_' => array('title' => I18n::_('Entry layout')),
		'spaceBetween' => 		 array('format' => 'text',	'default' => '20px', 'css_units' => true,		'title' => I18n::_('Space between entries'), 	'description' => I18n::_('Distance from entry to entry. In pixels.')),
		'defaultGalleryType' =>  array('format' => 'select',		'values' => array('slideshow', 'row'), 'default' => 'slideshow', 					'title' => I18n::_('Default gallery type'), 'description' => ''),
        'spaceBetweenImages' =>  array('format' => 'text',		'default' => '1em', 'css_units' => true,    'title' => I18n::_('Space between images in row and column'),       'description' => I18n::_('Horizontal/vertical space between images when gallery is in "row"/"column" mode')),
		'galleryNavMargin' => 	 array('format' => 'text',		'default' => '5px', 'css_units' => true,	'title' => I18n::_('Space between images and image navigation'), 	'description' => I18n::_('Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode')),
		'galleryMargin' => 		 array('format' => 'text',		'default' => '5px', 'css_units' => true,	'title' => I18n::_('Empty space below gallery'), 	'description' => I18n::_('Distance between the gallery and the content below')),
		'displayTags' =>  		 array('format' => 'select',	'values' => array('yes', 'no'), 'default' => 'no', 	'title' => I18n::_('Display tags by each entry'), 'description' => I18n::_('This determines whether people will see tags you set for each entry. Regardless of this settting, tags still will make up the main menu.'))
	),

	'sideBar' => array(
        '_' => array('title' => I18n::_('Sidebar')),
		'width' => 				array('format' => 'text',	'default' => '200px',	'css_units' => true, 'title' => I18n::_('Width'), 'description' => ''),
		'marginLeft' => 		array('format' => 'text',	'default' => '0px', 	'css_units' => true, 'title' => I18n::_('Left margin'), 'description' => I18n::_('How far the sidebar is from the left side of the screen. This gets ignored, if centered layout is enabled.')),
		'marginTop' => 			array('format' => 'text',	'default' => '30px', 	'css_units' => true, 'title' => I18n::_('Top padding'), 'description' => I18n::_('How far the header is from the top of the screen?')),
		'marginBottom' => 		array('format' => 'text',	'default' => '20px', 	'css_units' => true, 'title' => I18n::_('Space between header and menu'), 'description' => I18n::_('How far the menu is from the header text or header image.')),

		'transparent'=>			array('format' => 'select',	'values' => array('yes', 'no'), 'default' => 'no','title' => I18n::_('Is transparent?'), 'description' => ''),
		'backgroundColor' =>	array('format' => 'color',	'default' => '#ffffff',				'title' => I18n::_('Background color'), 'description' => ''),

		'image' => 				array('format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 'setting:template:sideBar:width', 'max_height' => 1600, 	 	'title' => I18n::_('Logo image'), 'description' => I18n::_('Picture to use instead of header text. Max size: 140 x 400 pixels. If the image is larger, it will be reduced.')),
		'color' => 				array('format' => 'color',		'default' => '#1a1a1a', 					'title' => I18n::_('Heading text color'), 'description' => ''),
		'fontFamily' => 		array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => 'Georgia, "Times New Roman", Times, serif', 			'title' => I18n::_('Heading font'), 'description' => ''),
		'googleFont' => 		array('format' => 'text',		'default' => '', 'html_entities' => true, 'title' => I18n::_('Google web fonts'),         'description' => I18n::_('googleFont_description')),
		'fontSize' => 			array('format' => 'text', 'css_units' => true, 'default' => '10px', 					'title' => I18n::_('Heading font size'), 'description' => ''),
		'fontWeight' => 		array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 				'title' => I18n::_('Heading font weight'), 'description' => ''),
		'fontStyle' => 			array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 			'title' => I18n::_('Heading font style'), 'description' => ''),
		'fontVariant' => 		array('format' => 'select',		'values' => array('normal', 'small-caps'), 'default' => 'normal', 		'title' => I18n::_('Heading font variant'), 'description' => ''),
		'lineHeight' => 		array('format' => 'text', 'css_units' => true, 'default' => '1em', 					'title' => I18n::_('Heading line height'), 'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'))
	),

	'firstPage' => array(
        '_' => array('title' => I18n::_('First page')),
		'imageSizeRatio' => 	array('format' => 'text',		'default' => '0.4', 'css_units' => false,	'title' => I18n::_('Image size ratio'), 	'description' => I18n::_('Images in the first page layout will be resized by this ratio. Think of it as percentage, e.g., 0.7 = 70% of the original image size.')),
		'imageHaveShadows'=>	array('format' => 'select',		'values' => array('yes', 'no'), 'default' => 'no', 	'title' => I18n::_('Images have shadows?'), 'description' => ''),
		'hoverWiggle'=>			array('format' => 'select',		'values' => array('yes', 'no'), 'default' => 'yes', 	'title' => I18n::_('Images wiggle on mouse-over?'), 'description' => '')

	),

	'menu' => array(
        '_' => array('title' => I18n::_('Main menu')),
		'fontFamily' => 			array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			'title' => I18n::_('Font face'), 'description' => ''),
		'googleFont' => 			array('format' => 'text',		'default' => '', 'html_entities' => true,								'title' => I18n::_('Google web fonts'),         'description' => I18n::_('googleFont_description')),
		'fontSize' => 				array('format' => 'text', 'css_units' => true, 'default' => '10px', 								'title' => I18n::_('Font size'), 'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 		'title' => I18n::_('Font weight'), 'description' => ''),
		'fontStyle' => 				array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 		'title' => I18n::_('Font style'), 'description' => ''),
		'lineHeight' => 			array('format' => 'text', 'css_units' => true, 'default' => '16px', 								'title' => I18n::_('Line height'), 'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')),
		'colorLink' => 				array('format' => 'color',		'default' => '#1a1a1a', 	'title' => I18n::_('Color'), 'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#0000ff', 	'title' => I18n::_('Color when hovered'), 'description' => ''),
		'colorActive' => 			array('format' => 'color',		'default' => '#1a1a1a', 	'title' => I18n::_('Color when opened'), 'description' => ''),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		'title' => I18n::_('Decoration'), 'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'none', 		'title' => I18n::_('Decoration when hovered'), 'description' => ''),
		'textDecorationActive' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => I18n::_('Decoration when opened'), 'description' => '')
	),

	'tagsMenu' => array(
        '_' => array('title' => I18n::_('Submenu')),
		'fontFamily' => 			array('format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			'title' => I18n::_('Font face'), 'description' => ''),
		'googleFont' => 			array('format' => 'text',		'default' => '', 'html_entities' => true,								'title' => I18n::_('Google web fonts'),         'description' => I18n::_('googleFont_description')),
		'fontSize' => 				array('format' => 'text', 'css_units' => true, 'default' => '11px', 								'title' => I18n::_('Font size'), 'description' => ''),
		'fontWeight' => 			array('format' => 'select',		'values' => array('normal', 'bold'), 'default' => 'normal', 		'title' => I18n::_('Font weight'), 'description' => ''),
		'fontStyle' => 				array('format' => 'select',		'values' => array('normal', 'italic'), 'default' => 'normal', 		'title' => I18n::_('Font style'), 'description' => ''),
		'lineHeight' => 			array('format' => 'text', 'css_units' => true, 'default' => '16px', 								'title' => I18n::_('Line height'), 'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')),
		'colorLink' => 				array('format' => 'color',			'default' => '#1a1a1a', 	'title' => I18n::_('Color'), 'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#0000ff', 	'title' => I18n::_('Color when hovered'), 'description' => ''),
		'colorActive' => 			array('format' => 'color',		'default' => '#1a1a1a', 	'title' => I18n::_('Color when selected'), 'description' => ''),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		'title' => I18n::_('Decoration'), 'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'none', 		'title' => I18n::_('Decoration when hovered'), 'description' => ''),
		'textDecorationActive' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'line-through', 		'title' => I18n::_('Decoration when opened'), 'description' => '')
	),

	'links' => array(
        '_' => array('title' => I18n::_('Hyperlinks')),
		'colorLink' => 			array('format' => 'color',		'default' => '#0000ff', 	'title' => I18n::_('Link color'), 'description' => ''),
		'colorVisited' => 			array('format' => 'color',		'default' => '#666666', 	'title' => I18n::_('Visited link color'), 'description' => ''),
		'colorHover' => 			array('format' => 'color',		'default' => '#0000ff', 	'title' => I18n::_('Link color when hovered'), 'description' => ''),
		'colorActive' => 			array('format' => 'color',		'default' => '#0000ff', 	'title' => I18n::_('Link color when clicked'), 'description' => ''),
		'textDecorationLink' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'), 	'default' => 'none', 		'title' => I18n::_('Link decoration'), 'description' => ''),
		'textDecorationVisited' =>array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'none', 		'title' => I18n::_('Visited link decoration'), 'description' => ''),
		'textDecorationHover' => 	array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => I18n::_('Link decoration when hovered'), 'description' => ''),
		'textDecorationActive' => array('format' => 'select',		'values' => array('none', 'underline', 'overline', 'line-through'),		'default' => 'underline', 		'title' => I18n::_('Link decoration when clicked'), 'description' => '')
	),

	'css' => array(
		'_' => array('title' => I18n::_('Custom CSS')),
		'customCSS' =>	array('format' => 'longtext',	'allow_blank' => true,	'default' => '',	'html_entities'	=> true,	'title' => I18n::_('Custom CSS'), 'description' => I18n::_('description_custom_css'))
	)
);

return array($sectionTypes, $templateConf);

?>