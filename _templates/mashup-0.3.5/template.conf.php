<?php

$fontOptions = [
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
];
$fontOptionsWithInherit = array_merge(['inherit' => '(inherit from general-font-settings)'], $fontOptions);

$sectionTypes = [
    'default' => ['title' => 'Default'],
    'external_link' => ['title' => 'External link', 'params' => [
        'link' => ['format' => 'text',	'default' => '', 'link' => true],
        'target' => ['format' => 'select', 'values' => ['_self' => 'Same window', '_blank' => 'New window'], 'default' => '_blank']
    ]],
    'mash_up' => ['title' => 'Mash-up', 'params' => [
        'marked_items_imageselect' => ['format' => 'select', 'values' => ['random' => 'random image', 'first' => 'first image'], 'default' => 'first', 'html_before' => '<div>show </div>'],
        'marked_items_count' => ['format' => 'text', 'html_before' => '<br class="clear" /><div>from each of </div>', 'html_after' => '<div> marked entries</div><br class="clear" /><div>from all sections except this one</div>', 'default' => '5']
    ]],
    'portfolio' => ['title' => 'Portfolio']
];

$templateConf = [
    'generalFontSettings' => [
        '_' => ['title' => I18n::_('General font settings')],
        'color' => ['format' => 'color',		'default' => '#1a1a1a', 							'title' => I18n::_('Color'), 'description' => ''],
        'fontFamily' => ['format' => 'fontselect',	'values' => $fontOptions, 'default' => '"Times New Roman", Times, serif', 			'title' => I18n::_('Font face'), 'description' => ''],
        'googleFont' => ['format' => 'text',		'default' => '', 'html_entities' => true,			'title' => I18n::_('Google web fonts'),         'description' => I18n::_('googleFont_description')],
        'fontSize' => ['format' => 'text', 'css_units' => true, 'default' => '11px', 								'title' => I18n::_('Font size'), 'description' => ''],
        'fontWeight' => ['format' => 'select',		'values' => ['normal', 'bold'], 'default' => 'normal', 		'title' => I18n::_('Font weight'), 'description' => ''],
        'fontStyle' => ['format' => 'select',		'values' => ['normal', 'italic'], 'default' => 'normal', 		'title' => I18n::_('Font style'), 'description' => ''],
        'fontVariant' => ['format' => 'select',		'values' => ['normal', 'small-caps'], 'default' => 'normal', 	'title' => I18n::_('Font variant'), 'description' => ''],
        'lineHeight' => ['format' => 'text', 'css_units' => true, 'default' => 'normal', 								'title' => I18n::_('Line height'), 'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')]
    ],

    'links' => [
        '_' => ['title' => I18n::_('Hyperlinks')],
        'colorLink' => ['format' => 'color',		'default' => '#0000ff', 	'title' => I18n::_('Link color'), 'description' => ''],
        'colorVisited' => ['format' => 'color',		'default' => '#666666', 	'title' => I18n::_('Visited link color'), 'description' => ''],
        'colorHover' => ['format' => 'color',		'default' => '#0000ff', 	'title' => I18n::_('Link color when hovered'), 'description' => ''],
        'colorActive' => ['format' => 'color',		'default' => '#0000ff', 	'title' => I18n::_('Link color when clicked'), 'description' => ''],
        'textDecorationLink' => ['format' => 'select',		'values' => ['none', 'underline', 'overline', 'line-through'], 	'default' => 'none', 		'title' => I18n::_('Link decoration'), 'description' => ''],
        'textDecorationVisited' => ['format' => 'select',		'values' => ['none', 'underline', 'overline', 'line-through'],		'default' => 'none', 		'title' => I18n::_('Visited link decoration'), 'description' => ''],
        'textDecorationHover' => ['format' => 'select',		'values' => ['none', 'underline', 'overline', 'line-through'],		'default' => 'underline', 		'title' => I18n::_('Link decoration when hovered'), 'description' => ''],
        'textDecorationActive' => ['format' => 'select',		'values' => ['none', 'underline', 'overline', 'line-through'],		'default' => 'underline', 		'title' => I18n::_('Link decoration when clicked'), 'description' => '']
    ],

    'background' => [
        '_' => ['title' => I18n::_('Background')],
        'backgroundColor' => ['format' => 'color',		'default' => '#FFFFFF',									'title' => I18n::_('Background color'), 'description' => ''],
        'backgroundImageEnabled' => ['format' => 'select',		'values' => ['yes', 'no'], 'default' => 'no', 					'title' => I18n::_('Is background image enabled?'), 'description' => ''],
        'backgroundImage' => ['format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 	 	'title' => I18n::_('Background image'), 'description' => I18n::_('Picture to use for page background.')],
        'backgroundRepeat' => ['format' => 'select',		'values' => ['repeat' => 'tile vertically and horizontally', 'repeat-x' => 'tile horizontally', 'repeat-y' => 'tile vertically', 'no-repeat' => 'no tiling'], 'default' => 'repeat', 		'title' => I18n::_('Background tiling'), 'description' => I18n::_('How the background fills the screen?')],
        'backgroundPosition' => ['format' => 'select',		'values' => ['top left', 'top center', 'top right', 'center left', 'center', 'center right', 'bottom left', 'bottom center', 'bottom right'], 'default' => 'top left', 	'title' => I18n::_('Background alignment'), 'description' => I18n::_('Where the background image is positioned?')],
        'backgroundAttachment' => ['format' => 'select',		'values' => ['fixed' => 'Fixed to browser window', 'fill' => 'Filled in browser window', 'scroll' => 'No stretch, scroll along with content'], 'default' => 'scroll', 		'title' => I18n::_('Background position'), 'description' => I18n::_('Sets how background behaves in relation with the browser window.')]
    ],

    'pageLayout' => [
        '_' => ['title' => I18n::_('Page layout')],
        'centered' => ['format' => 'select', 'default' => 'no', 'values' => ['yes', 'no'], 'title' => I18n::_('Centered layout'), 'description' => I18n::_('Sets whether layout should be centered or not.')],
        'contentWidth' => ['format' => 'text',	'default' => '380px',	'css_units' => true, 	'title' => I18n::_('Entry text max width'), 'description' => I18n::_('Width of texts in the entries. This does not apply to the width of images.')],
        'paddingTop' => ['format' => 'text',	'default' => '30px',	'css_units' => true, 	'title' => I18n::_('How far content is from page top?'), 'description' => I18n::_('The vertical distance between the top of the page and the content area.')],
        'paddingLeft' => ['format' => 'text',	'default' => '30px',	'css_units' => true, 	'title' => I18n::_('How far content is from sidebar?'), 'description' => I18n::_('The horizontal distance between the menu and the content area.')],
        'group_responsive' => ['format' => false, 'default' => false, 'title' => I18n::_('Responsive design')],
        'responsive' => ['format' => 'select', 'default' => 'yes', 'values' => ['no', 'yes'], 'title' => I18n::_('Enabled'), 'description' => I18n::_('Sets whether layout should be responsive or not.')],
        'mashUpColumns' => ['format' => 'select', 'default' => '1', 'values' => ['1', '2', '3', '4'], 'title' => I18n::_('Mash-up columns'), 'description' => I18n::_('Column count for Mash-up section.')],
    ],

    'firstPage' => [
        '_' => ['title' => I18n::_('First page')],
        'imageSizeRatio' => ['format' => 'text',		'default' => '0.4', 'css_units' => false,	'title' => I18n::_('Image size ratio'), 	'description' => I18n::_('Images in the first page layout will be resized by this ratio. Think of it as percentage, e.g., 0.7 = 70% of the original image size.')],
        'imageHaveShadows' => ['format' => 'select',		'values' => ['yes', 'no'], 'default' => 'no', 	'title' => I18n::_('Images have shadows?'), 'description' => ''],
        'hoverWiggle' => ['format' => 'select',		'values' => ['yes', 'no'], 'default' => 'yes', 	'title' => I18n::_('Images wiggle on mouse-over?'), 'description' => '']
    ],

    'sideBar' => [
        '_' => ['title' => I18n::_('Sidebar')],
        'width' => ['format' => 'text',	'default' => '200px',	'css_units' => true, 'title' => I18n::_('Width'), 'description' => ''],
        'marginLeft' => ['format' => 'text',	'default' => '0px', 	'css_units' => true, 'title' => I18n::_('Left margin'), 'description' => I18n::_('How far the sidebar is from the left side of the screen. This gets ignored, if centered layout is enabled.')],
        'marginTop' => ['format' => 'text',	'default' => '30px', 	'css_units' => true, 'title' => I18n::_('Top padding'), 'description' => I18n::_('How far the header is from the top of the screen?')],
        'marginBottom' => ['format' => 'text',	'default' => '20px', 	'css_units' => true, 'title' => I18n::_('Space between header and menu'), 'description' => I18n::_('How far the menu is from the header text or header image.')],

        'transparent' => ['format' => 'select',	'values' => ['yes', 'no'], 'default' => 'no', 'title' => I18n::_('Is transparent?'), 'description' => ''],
        'backgroundColor' => ['format' => 'color',	'default' => '#ffffff',				'title' => I18n::_('Background color'), 'description' => ''],

        'image' => ['format' => 'image',		'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 'setting:template:sideBar:width', 'max_height' => 1600, 	 	'title' => I18n::_('Logo image'), 'description' => '<span class="warning">' . I18n::_('Displayed image will be half of the original size, full size will be used for hi-res displays.') . '</span>'],
        'color' => ['format' => 'color',		'default' => '#1a1a1a', 					'title' => I18n::_('Heading text color'), 'description' => ''],
        'fontFamily' => ['format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => 'Georgia, "Times New Roman", Times, serif', 			'title' => I18n::_('Heading font'), 'description' => ''],
        'googleFont' => ['format' => 'text',		'default' => '', 'html_entities' => true, 'title' => I18n::_('Google web fonts'),         'description' => I18n::_('googleFont_description')],
        'fontSize' => ['format' => 'text', 'css_units' => true, 'default' => '10px', 					'title' => I18n::_('Heading font size'), 'description' => ''],
        'fontWeight' => ['format' => 'select',		'values' => ['normal', 'bold'], 'default' => 'normal', 				'title' => I18n::_('Heading font weight'), 'description' => ''],
        'fontStyle' => ['format' => 'select',		'values' => ['normal', 'italic'], 'default' => 'normal', 			'title' => I18n::_('Heading font style'), 'description' => ''],
        'fontVariant' => ['format' => 'select',		'values' => ['normal', 'small-caps'], 'default' => 'normal', 		'title' => I18n::_('Heading font variant'), 'description' => ''],
        'lineHeight' => ['format' => 'text', 'css_units' => true, 'default' => '1em', 					'title' => I18n::_('Heading line height'), 'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')]
    ],

    'menu' => [
        '_' => ['title' => I18n::_('Main menu')],
        'fontFamily' => ['format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			'title' => I18n::_('Font face'), 'description' => ''],
        'googleFont' => ['format' => 'text',		'default' => '', 'html_entities' => true,								'title' => I18n::_('Google web fonts'),         'description' => I18n::_('googleFont_description')],
        'fontSize' => ['format' => 'text', 'css_units' => true, 'default' => '10px', 								'title' => I18n::_('Font size'), 'description' => ''],
        'fontWeight' => ['format' => 'select',		'values' => ['normal', 'bold'], 'default' => 'normal', 		'title' => I18n::_('Font weight'), 'description' => ''],
        'fontStyle' => ['format' => 'select',		'values' => ['normal', 'italic'], 'default' => 'normal', 		'title' => I18n::_('Font style'), 'description' => ''],
        'lineHeight' => ['format' => 'text', 'css_units' => true, 'default' => '16px', 								'title' => I18n::_('Line height'), 'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')],
        'colorLink' => ['format' => 'color',		'default' => '#1a1a1a', 	'title' => I18n::_('Color'), 'description' => ''],
        'colorHover' => ['format' => 'color',		'default' => '#0000ff', 	'title' => I18n::_('Color when hovered'), 'description' => ''],
        'colorActive' => ['format' => 'color',		'default' => '#1a1a1a', 	'title' => I18n::_('Color when opened'), 'description' => ''],
        'textDecorationLink' => ['format' => 'select',		'values' => ['none', 'underline', 'overline', 'line-through'], 	'default' => 'none', 		'title' => I18n::_('Decoration'), 'description' => ''],
        'textDecorationHover' => ['format' => 'select',		'values' => ['none', 'underline', 'overline', 'line-through'],		'default' => 'none', 		'title' => I18n::_('Decoration when hovered'), 'description' => ''],
        'textDecorationActive' => ['format' => 'select',		'values' => ['none', 'underline', 'overline', 'line-through'],		'default' => 'underline', 		'title' => I18n::_('Decoration when opened'), 'description' => '']
    ],

    'tagsMenu' => [
        '_' => ['title' => I18n::_('Submenu')],
        'fontFamily' => ['format' => 'fontselect',	'values' => $fontOptionsWithInherit, 'default' => 'inherit', 			'title' => I18n::_('Font face'), 'description' => ''],
        'googleFont' => ['format' => 'text',		'default' => '', 'html_entities' => true,								'title' => I18n::_('Google web fonts'),         'description' => I18n::_('googleFont_description')],
        'fontSize' => ['format' => 'text', 'css_units' => true, 'default' => '11px', 								'title' => I18n::_('Font size'), 'description' => ''],
        'fontWeight' => ['format' => 'select',		'values' => ['normal', 'bold'], 'default' => 'normal', 		'title' => I18n::_('Font weight'), 'description' => ''],
        'fontStyle' => ['format' => 'select',		'values' => ['normal', 'italic'], 'default' => 'normal', 		'title' => I18n::_('Font style'), 'description' => ''],
        'lineHeight' => ['format' => 'text', 'css_units' => true, 'default' => '16px', 								'title' => I18n::_('Line height'), 'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"')],
        'colorLink' => ['format' => 'color',			'default' => '#1a1a1a', 	'title' => I18n::_('Color'), 'description' => ''],
        'colorHover' => ['format' => 'color',		'default' => '#0000ff', 	'title' => I18n::_('Color when hovered'), 'description' => ''],
        'colorActive' => ['format' => 'color',		'default' => '#1a1a1a', 	'title' => I18n::_('Color when selected'), 'description' => ''],
        'textDecorationLink' => ['format' => 'select',		'values' => ['none', 'underline', 'overline', 'line-through'], 	'default' => 'none', 		'title' => I18n::_('Decoration'), 'description' => ''],
        'textDecorationHover' => ['format' => 'select',		'values' => ['none', 'underline', 'overline', 'line-through'],		'default' => 'none', 		'title' => I18n::_('Decoration when hovered'), 'description' => ''],
        'textDecorationActive' => ['format' => 'select',		'values' => ['none', 'underline', 'overline', 'line-through'],		'default' => 'line-through', 		'title' => I18n::_('Decoration when opened'), 'description' => '']
    ],

    'entryLayout' => [
        '_' => ['title' => I18n::_('Entry layout')],
        'spaceBetween' => ['format' => 'text',	'default' => '20px', 'css_units' => true,		'title' => I18n::_('Space between entries'), 	'description' => I18n::_('Distance from entry to entry. In pixels.')],
        'defaultGalleryType' => ['format' => 'select',		'values' => ['slideshow', 'row'], 'default' => 'slideshow', 					'title' => I18n::_('Default gallery type'), 'description' => ''],
        'spaceBetweenImages' => ['format' => 'text',		'default' => '1em', 'css_units' => true,    'title' => I18n::_('Space between images in row and column'),       'description' => I18n::_('Horizontal/vertical space between images when gallery is in "row"/"column" mode')],
        'galleryNavMargin' => ['format' => 'text',		'default' => '5px', 'css_units' => true,	'title' => I18n::_('Space between images and image navigation'), 	'description' => I18n::_('Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode')],
        'galleryMargin' => ['format' => 'text',		'default' => '5px', 'css_units' => true,	'title' => I18n::_('Empty space below gallery'), 	'description' => I18n::_('Distance between the gallery and the content below')],
        'displayTags' => ['format' => 'select',	'values' => ['yes', 'no'], 'default' => 'no', 	'title' => I18n::_('Display tags by each entry'), 'description' => I18n::_('This determines whether people will see tags you set for each entry. Regardless of this settting, tags still will make up the main menu.')]
    ],

    'socialMediaLinks' => [
        '_' => ['title' => I18n::_('Social media buttons')],
        'color' => [
            'format' => 'color',
            'default' => '#000000',
            'title' => I18n::_('Button color'),
            'description' => ''
        ]
    ],

    'css' => [
        '_' => ['title' => I18n::_('Custom CSS')],
        'customCSS' => ['format' => 'longtext',	'allow_blank' => true,	'default' => '',	'html_entities' => true,	'title' => I18n::_('Custom CSS'), 'description' => I18n::_('description_custom_css')]
    ]
];

return [$sectionTypes, $templateConf];
