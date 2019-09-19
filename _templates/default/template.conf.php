<?php

$fontOptions = [
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
    'Verdana, Geneva, sans-serif' => 'Verdana, Geneva',
];
$fontOptionsWithInherit = array_merge([
    'inherit' => '(inherit from general-font-settings)',
], $fontOptions);

$sectionTypes = [
    'default' => [
        'title' => 'Default',
    ],
    'external_link' => [
        'title' => 'External link',
        'params' => [
            'link' => [
                'format' => 'url',
                'default' => '',
                'allow_blank' => true,
                'link' => true,
            ],
            'target' => [
                'format' => 'select',
                'values' => [
                    '_self' => 'Same window',
                    '_blank' => 'New window',
                ],
                'default' => '_blank',
            ],
        ],
    ],
    'portfolio' => [
        'title' => 'Portfolio',
    ],
];

$fontOptions = array_keys($fontOptions);

$templateConf = [
    'generalFontSettings' => [
        '_' => [
            'title' => I18n::_('General font settings'),
        ],
        'color' => [
            'format' => 'color',
            'default' => '#333333',
            'title' => I18n::_('Color'),
            'description' => '',
        ],
        'fontFamily' => [
            'format' => 'fontselect',
            'values' => $fontOptions,
            'default' => reset($fontOptions),
            'title' => I18n::_('Font face'),
            'description' => '',
        ],
        'googleFont' => [
            'format' => 'text',
            'default' => '',
            'allow_blank' => true,
            'html_entities' => true,
            'title' => 'Google web fonts',
            'description' => I18n::_('googleFont_description'),
        ],
        'fontSize' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '9pt',
            'allow_blank' => true,
            'title' => I18n::_('Font size'),
            'description' => '',
        ],
        'fontWeight' => [
            'format' => 'select',
            'values' => [
                'normal',
                'bold',
            ],
            'default' => 'normal',
            'title' => I18n::_('Font weight'),
            'description' => '',
        ],
        'fontStyle' => [
            'format' => 'select',
            'values' => [
                'normal',
                'italic',
            ],
            'default' => 'normal',
            'title' => I18n::_('Font style'),
            'description' => '',
        ],
        'fontVariant' => [
            'format' => 'select',
            'values' => [
                'normal',
                'small-caps',
            ],
            'default' => 'normal',
            'title' => I18n::_('Font variant'),
            'description' => '',
        ],
        'lineHeight' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'normal',
            'allow_blank' => true,
            'title' => I18n::_('Line height'),
            'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'),
        ],
    ],

    'links' => [
        '_' => [
            'title' => I18n::_('Hyperlinks'),
        ],
        'colorLink' => [
            'format' => 'color',
            'default' => '#888888',
            'title' => I18n::_('Link color'),
            'description' => '',
        ],
        'colorVisited' => [
            'format' => 'color',
            'default' => '#888888',
            'title' => I18n::_('Visited link color'),
            'description' => '',
        ],
        'colorHover' => [
            'format' => 'color',
            'default' => '#888888',
            'title' => I18n::_('Link color when hovered'),
            'description' => '',
        ],
        'colorActive' => [
            'format' => 'color',
            'default' => '#888888',
            'title' => I18n::_('Link color when clicked'),
            'description' => '',
        ],
        'textDecorationLink' => [
            'format' => 'select',
            'values' => [
                'none',
                'underline',
                'overline',
                'line-through',
            ],
            'default' => 'none',
            'title' => I18n::_('Link decoration'),
            'description' => '',
        ],
        'textDecorationVisited' => [
            'format' => 'select',
            'values' => [
                'none',
                'underline',
                'overline',
                'line-through',
            ],
            'default' => 'none',
            'title' => I18n::_('Visited link decoration'),
            'description' => '',
        ],
        'textDecorationHover' => [
            'format' => 'select',
            'values' => [
                'none',
                'underline',
                'overline',
                'line-through',
            ],
            'default' => 'underline',
            'title' => I18n::_('Link decoration when hovered'),
            'description' => '',
        ],
        'textDecorationActive' => [
            'format' => 'select',
            'values' => [
                'none',
                'underline',
                'overline',
                'line-through',
            ],
            'default' => 'underline',
            'title' => I18n::_('Link decoration when clicked'),
            'description' => '',
        ],
    ],

    'background' => [
        '_' => [
            'title' => I18n::_('Background'),
        ],
        'backgroundColor' => [
            'format' => 'color',
            'default' => '#FFFFFF',
            'title' => I18n::_('Background color'),
            'description' => '',
        ],
        'backgroundImageEnabled' => [
            'format' => 'select',
            'values' => [
                'yes',
                'no',
            ],
            'default' => 'no',
            'title' => I18n::_('Is background image enabled?'),
            'description' => '',
        ],
        'backgroundImage' => [
            'format' => 'image',
            'default' => '',
            'min_width' => 1,
            'min_height' => 1,
            'max_width' => 3000,
            'max_height' => 3000,
            'title' => I18n::_('Background image'),
            'description' => I18n::_('Picture to use for page background.'),
        ],
        'backgroundRepeat' => [
            'format' => 'select',
            'values' => [
                'repeat' => 'tile vertically and horizontally',
                'repeat-x' => 'tile horizontally',
                'repeat-y' => 'tile vertically',
                'no-repeat' => 'no tiling',
            ],
            'default' => 'repeat',
            'title' => I18n::_('Background tiling'),
            'description' => I18n::_('How the background fills the screen?'),
        ],
        'backgroundPosition' => [
            'format' => 'select',
            'values' => [
                'top left',
                'top center',
                'top right',
                'center left',
                'center',
                'center right',
                'bottom left',
                'bottom center',
                'bottom right',
            ],
            'default' => 'top left',
            'title' => I18n::_('Background alignment'),
            'description' => I18n::_('Where the background image is positioned?'),
        ],
        'backgroundAttachment' => [
            'format' => 'select',
            'values' => [
                'fixed' => 'Fixed to browser window',
                'fill' => 'Filled in browser window',
                'scroll' => 'No stretch, scroll along with content',
            ],
            'default' => 'scroll',
            'title' => I18n::_('Background position'),
            'description' => I18n::_('Sets how background behaves in relation with the browser window.'),
        ],
    ],

    'pageLayout' => [
        '_' => [
            'title' => I18n::_('Page layout'),
        ],
        'contentPosition' => [
            'format' => 'select',
            'values' => [
                'left',
                'center',
                'right',
            ],
            'default' => 'left',
            'title' => I18n::_('Content position'),
            'description' => '',
        ],
        'contentAlign' => [
            'format' => 'select',
            'values' => [
                'left',
                'right',
                'justify-left',
                'justify-right',
            ],
            'default' => 'left',
            'title' => I18n::_('Text alignment'),
            'description' => '',
        ],
        'contentWidth' => [
            'format' => 'text',
            'default' => '500px',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('Width of content area'),
            'description' => '',
        ],
        'bodyMargin' => [
            'format' => 'text',
            'default' => '20px 40px 40px',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('Page margins'),
            'description' => I18n::_('How far the content is from browser edges. Please see the short CSS guide at the bottom of this page.'),
        ],
        'siteMenuMargin' => [
            'format' => 'text',
            'default' => '0',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('Top menu margins'),
            'description' => I18n::_('How big is the distance from the top menu to the other page elements'),
        ],
        'group_responsive' => [
            'format' => false,
            'default' => false,
            'title' => I18n::_('Responsive design'),
        ],
        'responsive' => [
            'format' => 'select',
            'default' => 'yes',
            'values' => [
                'no',
                'yes',
            ],
            'title' => I18n::_('Enabled'),
            'description' => I18n::_('Sets whether layout should be responsive or not.'),
        ],
    ],

    'pageHeading' => [
        '_' => [
            'title' => I18n::_('Page heading'),
        ],
        'image' => [
            'format' => 'image',
            'default' => '',
            'min_width' => 1,
            'min_height' => 1,
            'max_width' => 1000,
            'max_height' => 1000,
            'title' => I18n::_('Header image'),
            'description' => '<span class="warning">' . I18n::_('Displayed image will be half of the original size, full size will be used for hi-res displays.') . '</span>',
        ],
        'color' => [
            'format' => 'color',
            'default' => '#333333',
            'title' => I18n::_('Color'),
            'description' => '',
        ],
        'fontFamily' => [
            'format' => 'fontselect',
            'values' => $fontOptionsWithInherit,
            'default' => 'inherit',
            'title' => I18n::_('Font face'),
            'description' => '',
        ],
        'googleFont' => [
            'format' => 'text',
            'default' => '',
            'allow_blank' => true,
            'html_entities' => true,
            'title' => 'Google web fonts',
            'description' => I18n::_('googleFont_description'),
        ],
        'fontSize' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '1.2em',
            'allow_blank' => true,
            'title' => I18n::_('Font size'),
            'description' => '',
        ],
        'fontWeight' => [
            'format' => 'select',
            'values' => [
                'normal',
                'bold',
            ],
            'default' => 'bold',
            'title' => I18n::_('Font weight'),
            'description' => '',
        ],
        'fontStyle' => [
            'format' => 'select',
            'values' => [
                'normal',
                'italic',
            ],
            'default' => 'normal',
            'title' => I18n::_('Font style'),
            'description' => '',
        ],
        'fontVariant' => [
            'format' => 'select',
            'values' => [
                'normal',
                'small-caps',
            ],
            'default' => 'normal',
            'title' => I18n::_('Font variant'),
            'description' => '',
        ],
        'lineHeight' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0.8em',
            'allow_blank' => true,
            'title' => I18n::_('Line height'),
            'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'),
        ],
        'margin' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '10px 0 15px',
            'allow_blank' => true,
            'title' => I18n::_('Margins'),
            'description' => I18n::_('How far the heading is from other elements in page. Please see the short CSS guide at the bottom of this page.'),
        ],
    ],

    'menu' => [
        '_' => [
            'title' => I18n::_('Main menu'),
        ],
        'separator' => [
            'format' => 'text',
            'default' => '|',
            'allow_blank' => true,
            'title' => I18n::_('Menu items separator'),
            'description' => '',
        ],
        'separatorDistance' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0.5em',
            'allow_blank' => true,
            'title' => I18n::_('Space width around separator'),
            'description' => I18n::_('The distance from the separator to the menu item on both sides'),
        ],
        'fontSize' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'inherit',
            'allow_blank' => true,
            'title' => I18n::_('Font size'),
            'description' => '',
        ],
        'fontFamily' => [
            'format' => 'fontselect',
            'values' => $fontOptionsWithInherit,
            'default' => 'inherit',
            'title' => I18n::_('Font face'),
            'description' => '',
        ],
        'googleFont' => [
            'format' => 'text',
            'default' => '',
            'allow_blank' => true,
            'html_entities' => true,
            'title' => 'Google web fonts',
            'description' => I18n::_('googleFont_description'),
        ],
        'colorLink' => [
            'format' => 'color',
            'default' => '#888888',
            'title' => I18n::_('Color'),
            'description' => '',
        ],
        'colorHover' => [
            'format' => 'color',
            'default' => '#888888',
            'title' => I18n::_('Color when hovered'),
            'description' => I18n::_('Color of the element under mouse cursor'),
        ],
        'colorActive' => [
            'format' => 'color',
            'default' => '#888888',
            'title' => I18n::_('Color when selected'),
            'description' => I18n::_('Color of the element of the currently opened section'),
        ],
        'fontWeight' => [
            'format' => 'select',
            'values' => [
                'inherit',
                'normal',
                'bold',
            ],
            'default' => 'inherit',
            'title' => I18n::_('Font weight'),
            'description' => '',
        ],
        'fontStyle' => [
            'format' => 'select',
            'values' => [
                'inherit',
                'normal',
                'italic',
            ],
            'default' => 'inherit',
            'title' => I18n::_('Font style'),
            'description' => '',
        ],
        'fontVariant' => [
            'format' => 'select',
            'values' => [
                'inherit',
                'normal',
                'small-caps',
            ],
            'default' => 'inherit',
            'title' => I18n::_('Font variant'),
            'description' => '',
        ],
        'lineHeight' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'inherit',
            'allow_blank' => true,
            'title' => I18n::_('Line height'),
            'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'),
        ],
        'margin' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0',
            'allow_blank' => true,
            'title' => I18n::_('Margins'),
            'description' => I18n::_('How far the menu is form other elements in page. Please see the short CSS guide at the bottom of this page.'),
        ],
    ],

    'subMenu' => [
        '_' => [
            'title' => I18n::_('Submenu'),
        ],
        'separator' => [
            'format' => 'text',
            'default' => '|',
            'allow_blank' => true,
            'title' => I18n::_('Menu items separator'),
            'description' => '',
        ],
        'separatorDistance' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0.5em',
            'allow_blank' => true,
            'title' => I18n::_('Space width around separator'),
            'description' => I18n::_('The distance from the separator to the menu item on both sides'),
        ],
        'fontSize' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'inherit',
            'allow_blank' => true,
            'title' => I18n::_('Font size'),
            'description' => '',
        ],
        'fontFamily' => [
            'format' => 'fontselect',
            'values' => $fontOptionsWithInherit,
            'default' => 'inherit',
            'title' => I18n::_('Font face'),
            'description' => '',
        ],
        'googleFont' => [
            'format' => 'text',
            'default' => '',
            'allow_blank' => true,
            'html_entities' => true,
            'title' => 'Google web fonts',
            'description' => I18n::_('googleFont_description'),
        ],
        'fontWeight' => [
            'format' => 'select',
            'values' => [
                'inherit',
                'normal',
                'bold',
            ],
            'default' => 'inherit',
            'title' => I18n::_('Font weight'),
            'description' => '',
        ],
        'fontStyle' => [
            'format' => 'select',
            'values' => [
                'inherit',
                'normal',
                'italic',
            ],
            'default' => 'inherit',
            'title' => I18n::_('Font style'),
            'description' => '',
        ],
        'fontVariant' => [
            'format' => 'select',
            'values' => [
                'inherit',
                'normal',
                'small-caps',
            ],
            'default' => 'inherit',
            'title' => I18n::_('Font variant'),
            'description' => '',
        ],
        'lineHeight' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'inherit',
            'allow_blank' => true,
            'title' => I18n::_('Line height'),
            'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'),
        ],
        'margin' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0 0 10px',
            'allow_blank' => true,
            'title' => I18n::_('Margins'),
            'description' => I18n::_('How far the menu is form other elements in page. Please see the short CSS guide at the bottom of this page.'),
        ],
    ],

    'entryLayout' => [
        '_' => [
            'title' => I18n::_('Entry layout'),
        ],
        'margin' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0 0 4em',
            'allow_blank' => true,
            'title' => I18n::_('Entry margins'),
            'description' => I18n::_('Margins around entries. Please see the short CSS guide at the bottom of this page.'),
        ],
        'galleryPosition' => [
            'format' => 'select',
            'values' => [
                'between title/description',
                'above title',
                'below description',
            ],
            'default' => 'between title/description',
            'title' => I18n::_('Gallery position'),
            'description' => '',
        ],
        'defaultGalleryType' => [
            'format' => 'select',
            'values' => [
                'slideshow',
                'row',
            ],
            'default' => 'slideshow',
            'title' => I18n::_('Default gallery type'),
            'description' => I18n::_('Slideshow means that an image menu plus only one image is visible at a time. Row means that all images are visible.'),
        ],
        'spaceBetweenImages' => [
            'format' => 'text',
            'default' => '1em',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('Space between images in row and column'),
            'description' => I18n::_('Horizontal/vertical space between images when gallery is in "row"/"column" mode'),
        ],
        'galleryMargin' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0',
            'allow_blank' => true,
            'title' => I18n::_('Gallery margins'),
            'description' => I18n::_('Margin around gallery block'),
        ],
    ],

    'entryHeading' => [
        '_' => [
            'title' => I18n::_('Entry heading'),
        ],
        'color' => [
            'format' => 'color',
            'default' => '#333333',
            'title' => I18n::_('Color'),
            'description' => '',
        ],
        'fontFamily' => [
            'format' => 'fontselect',
            'values' => $fontOptionsWithInherit,
            'default' => 'inherit',
            'title' => I18n::_('Font face'),
            'description' => '',
        ],
        'googleFont' => [
            'format' => 'text',
            'default' => '',
            'allow_blank' => true,
            'html_entities' => true,
            'title' => 'Google web fonts',
            'description' => I18n::_('googleFont_description'),
        ],
        'fontSize' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '1.8em',
            'allow_blank' => true,
            'title' => I18n::_('Font size'),
            'description' => '',
        ],
        'fontWeight' => [
            'format' => 'select',
            'values' => [
                'normal',
                'bold',
            ],
            'default' => 'normal',
            'title' => I18n::_('Font weight'),
            'description' => '',
        ],
        'fontStyle' => [
            'format' => 'select',
            'values' => [
                'normal',
                'italic',
            ],
            'default' => 'normal',
            'title' => I18n::_('Font style'),
            'description' => '',
        ],
        'fontVariant' => [
            'format' => 'select',
            'values' => [
                'normal',
                'small-caps',
            ],
            'default' => 'normal',
            'title' => I18n::_('Font variant'),
            'description' => '',
        ],
        'lineHeight' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'normal',
            'allow_blank' => true,
            'title' => I18n::_('Line height'),
            'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'),
        ],
        'margin' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0',
            'allow_blank' => true,
            'title' => I18n::_('Margins'),
            'description' => I18n::_('How far the entry heading is form other elements in page. Please see the short CSS guide at the bottom of this page.'),
        ],
    ],

    'entryFooter' => [
        '_' => [
            'title' => I18n::_('Entry footer'),
        ],
        'color' => [
            'format' => 'color',
            'default' => '#333333',
            'title' => I18n::_('Color'),
            'description' => '',
        ],
        'fontFamily' => [
            'format' => 'fontselect',
            'values' => $fontOptionsWithInherit,
            'default' => 'inherit',
            'title' => I18n::_('Font face'),
            'description' => '',
        ],
        'googleFont' => [
            'format' => 'text',
            'default' => '',
            'allow_blank' => true,
            'html_entities' => true,
            'title' => 'Google web fonts',
            'description' => I18n::_('googleFont_description'),
        ],
        'fontSize' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'inherit',
            'allow_blank' => true,
            'title' => I18n::_('Font size'),
            'description' => '',
        ],
        'fontWeight' => [
            'format' => 'select',
            'values' => [
                'inherit',
                'normal',
                'bold',
            ],
            'default' => 'inherit',
            'title' => I18n::_('Font weight'),
            'description' => '',
        ],
        'fontStyle' => [
            'format' => 'select',
            'values' => [
                'inherit',
                'normal',
                'italic',
            ],
            'default' => 'inherit',
            'title' => I18n::_('Font style'),
            'description' => '',
        ],
        'fontVariant' => [
            'format' => 'select',
            'values' => [
                'inherit',
                'normal',
                'small-caps',
            ],
            'default' => 'inherit',
            'title' => I18n::_('Font variant'),
            'description' => '',
        ],
        'lineHeight' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'inherit',
            'allow_blank' => true,
            'title' => I18n::_('Line height'),
            'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'),
        ],
    ],

    'socialMediaLinks' => [
        '_' => [
            'title' => I18n::_('Social media buttons'),
        ],
        'color' => [
            'format' => 'color',
            'default' => '#000000',
            'title' => I18n::_('Button color'),
            'description' => '',
        ],
    ],

    'css' => [
        '_' => [
            'title' => I18n::_('Custom CSS'),
        ],
        'customCSS' => [
            'format' => 'longtext',
            'allow_blank' => true,
            'default' => '',
            'html_entities' => true,
            'title' => I18n::_('Custom CSS'),
            'description' => I18n::_('description_custom_css'),
        ],
    ],
];

return [$sectionTypes, $templateConf];
