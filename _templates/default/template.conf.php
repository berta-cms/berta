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
            'css' => [
                [
                    'selector' => 'body',
                    'property' => 'color'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'body',
                    'property' => 'font-size'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'body',
                    'property' => 'font-weight'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'body',
                    'property' => 'font-style'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'body',
                    'property' => 'font-variant'
                ]
            ]
        ],
        'lineHeight' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'normal',
            'allow_blank' => true,
            'title' => I18n::_('Line height'),
            'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'),
            'css' => [
                [
                    'selector' => 'body',
                    'property' => 'line-height'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'a:link',
                    'property' => 'color'
                ]
            ]
        ],
        'colorVisited' => [
            'format' => 'color',
            'default' => '#888888',
            'title' => I18n::_('Visited link color'),
            'description' => '',
            'css' => [
                [
                    'selector' => 'a:visited',
                    'property' => 'color'
                ]
            ]
        ],
        'colorHover' => [
            'format' => 'color',
            'default' => '#888888',
            'title' => I18n::_('Link color when hovered'),
            'description' => '',
            'css' => [
                [
                    'selector' => 'a:hover',
                    'property' => 'color'
                ]
            ]
        ],
        'colorActive' => [
            'format' => 'color',
            'default' => '#888888',
            'title' => I18n::_('Link color when clicked'),
            'description' => '',
            'css' => [
                [
                    'selector' => 'a:active',
                    'property' => 'color'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'a:link',
                    'property' => 'text-decoration'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'a:visited',
                    'property' => 'text-decoration'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'a:hover',
                    'property' => 'text-decoration'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'a:active',
                    'property' => 'text-decoration'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'body',
                    'property' => 'background-color'
                ]
            ]
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
            'affectsStyle' => true,
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
            'css' => [
                [
                    'selector' => '#contentContainer',
                    'property' => 'width'
                ],
                [
                    'selector' => '.bt-responsive #contentContainer',
                    'property' => 'max-width'
                ]
            ]
        ],
        'bodyMargin' => [
            'format' => 'text',
            'default' => '20px 40px 40px',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('Page margins'),
            'description' => I18n::_('How far the content is from browser edges. Please see the short CSS guide at the bottom of this page.'),
            'css' => [
                [
                    'selector' => '#contentContainer',
                    'property' => 'padding'
                ]
            ]
        ],
        'siteMenuMargin' => [
            'format' => 'text',
            'default' => '0',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('Top menu margins'),
            'description' => I18n::_('How big is the distance from the top menu to the other page elements'),
            'css' => [
                [
                    'selector' => '.bt-sections-menu',
                    'property' => 'padding'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'h1',
                    'property' => 'color'
                ],
                [
                    'selector' => '#contentContainer h1 a',
                    'property' => 'color'
                ],
                [
                    'selector' => '#contentContainer h1 a:link',
                    'property' => 'color'
                ],
                [
                    'selector' => '#contentContainer h1 a:visited',
                    'property' => 'color'
                ],
                [
                    'selector' => '#contentContainer h1 a:hover',
                    'property' => 'color'
                ],
                [
                    'selector' => '#contentContainer h1 a:active',
                    'property' => 'color'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'h1',
                    'property' => 'font-size'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'h1',
                    'property' => 'font-weight'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'h1',
                    'property' => 'font-style'
                ]
            ]
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
            'css' => [
                [
                    'selector' => 'h1',
                    'property' => 'font-variant'
                ]
            ]
        ],
        'lineHeight' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0.8em',
            'allow_blank' => true,
            'title' => I18n::_('Line height'),
            'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'),
            'css' => [
                [
                    'selector' => 'h1',
                    'property' => 'line-height'
                ]
            ]
        ],
        'margin' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '10px 0 15px',
            'allow_blank' => true,
            'title' => I18n::_('Margins'),
            'description' => I18n::_('How far the heading is from other elements in page. Please see the short CSS guide at the bottom of this page.'),
            'css' => [
                [
                    'selector' => 'h1',
                    'property' => 'margin'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '.bt-sections-menu > ul:not(.subMenu) li:not(:first-child)::before',
                    'property' => 'content',
                    'template' => '`"${value}"`'
                ]
            ]
        ],
        'separatorDistance' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0.5em',
            'allow_blank' => true,
            'title' => I18n::_('Space width around separator'),
            'description' => I18n::_('The distance from the separator to the menu item on both sides'),
            'css' => [
                [
                    'selector' => '.bt-sections-menu > ul:not(.subMenu) li:not(:first-child)::before',
                    'property' => 'padding-left'
                ],
                [
                    'selector' => '.bt-sections-menu > ul:not(.subMenu) li:not(:first-child)::before',
                    'property' => 'padding-right'
                ],
            ]
        ],
        'fontSize' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'inherit',
            'allow_blank' => true,
            'title' => I18n::_('Font size'),
            'description' => '',
            'css' => [
                [
                    'selector' => '.bt-sections-menu > ul:not(.subMenu) li',
                    'property' => 'font-size'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '.bt-sections-menu ul li a:link',
                    'property' => 'color'
                ],
                [
                    'selector' => '.bt-sections-menu ul li a:visited',
                    'property' => 'color'
                ]
            ]
        ],
        'colorHover' => [
            'format' => 'color',
            'default' => '#888888',
            'title' => I18n::_('Color when hovered'),
            'description' => I18n::_('Color of the element under mouse cursor'),
            'css' => [
                [
                    'selector' => '.bt-sections-menu ul li a:hover',
                    'property' => 'color'
                ]
            ]
        ],
        'colorActive' => [
            'format' => 'color',
            'default' => '#888888',
            'title' => I18n::_('Color when selected'),
            'description' => I18n::_('Color of the element of the currently opened section'),
            'css' => [
                [
                    'selector' => '.bt-sections-menu ul li a:active',
                    'property' => 'color'
                ],
                [
                    'selector' => '.bt-sections-menu ul li.selected > a',
                    'property' => 'color'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '.bt-sections-menu > ul:not(.subMenu) li',
                    'property' => 'font-weight'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '.bt-sections-menu > ul:not(.subMenu) li',
                    'property' => 'font-style'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '.bt-sections-menu > ul:not(.subMenu) li',
                    'property' => 'font-variant'
                ]
            ]
        ],
        'lineHeight' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'inherit',
            'allow_blank' => true,
            'title' => I18n::_('Line height'),
            'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'),
            'css' => [
                [
                    'selector' => '.bt-sections-menu > ul:not(.subMenu) li',
                    'property' => 'line-height'
                ]
            ]
        ],
        'margin' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0',
            'allow_blank' => true,
            'title' => I18n::_('Margins'),
            'description' => I18n::_('How far the menu is form other elements in page. Please see the short CSS guide at the bottom of this page.'),
            'css' => [
                [
                    'selector' => '.bt-sections-menu > ul:not(.subMenu)',
                    'property' => 'padding'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '.bt-sections-menu > .subMenu li:not(:first-child)::before',
                    'property' => 'content',
                    'template' => '`"${value}"`'
                ]
            ]
        ],
        'separatorDistance' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0.5em',
            'allow_blank' => true,
            'title' => I18n::_('Space width around separator'),
            'description' => I18n::_('The distance from the separator to the menu item on both sides'),
            'css' => [
                [
                    'selector' => '.bt-sections-menu > .subMenu li:not(:first-child)::before',
                    'property' => 'padding-left'
                ],
                [
                    'selector' => '.bt-sections-menu > .subMenu li:not(:first-child)::before',
                    'property' => 'padding-right'
                ]
            ]
        ],
        'fontSize' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'inherit',
            'allow_blank' => true,
            'title' => I18n::_('Font size'),
            'description' => '',
            'css' => [
                [
                    'selector' => '.bt-sections-menu > .subMenu li',
                    'property' => 'font-size'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '.bt-sections-menu > .subMenu li',
                    'property' => 'font-weight'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '.bt-sections-menu > .subMenu li',
                    'property' => 'font-style'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '.bt-sections-menu > .subMenu li',
                    'property' => 'font-variant'
                ]
            ]
        ],
        'lineHeight' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'inherit',
            'allow_blank' => true,
            'title' => I18n::_('Line height'),
            'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'),
            'css' => [
                [
                    'selector' => '.bt-sections-menu > .subMenu li',
                    'property' => 'line-height'
                ]
            ]
        ],
        'margin' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0 0 10px',
            'allow_blank' => true,
            'title' => I18n::_('Margins'),
            'description' => I18n::_('How far the menu is form other elements in page. Please see the short CSS guide at the bottom of this page.'),
            'css' => [
                [
                    'selector' => '.bt-sections-menu > .subMenu',
                    'property' => 'padding'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry',
                    'property' => 'margin'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry .xGalleryType-column .xGalleryItem',
                    'property' => 'padding-bottom'
                ],
                [
                    'selector' => '#pageEntries li.xEntry .xGalleryType-row:not(.bt-gallery-has-one-item) .xGalleryItem',
                    'property' => 'margin-right'
                ],
                [
                    'selector' => '.bt-responsive #pageEntries li.xEntry .xGalleryType-row:not(.bt-gallery-has-one-item) .xGallery .xGalleryItem',
                    'property' => 'padding-bottom',
                    'breakpoint' => '(max-width: 767px)'
                ]
            ]
        ],
        'galleryMargin' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0',
            'allow_blank' => true,
            'title' => I18n::_('Gallery margins'),
            'description' => I18n::_('Margin around gallery block'),
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry .xGalleryContainer .xGallery',
                    'property' => 'margin'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry h2',
                    'property' => 'color'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry h2',
                    'property' => 'font-size'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry h2',
                    'property' => 'font-weight'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry h2',
                    'property' => 'font-style'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry h2',
                    'property' => 'font-variant'
                ]
            ]
        ],
        'lineHeight' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'normal',
            'allow_blank' => true,
            'title' => I18n::_('Line height'),
            'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'),
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry h2',
                    'property' => 'line-height'
                ]
            ]
        ],
        'margin' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '0',
            'allow_blank' => true,
            'title' => I18n::_('Margins'),
            'description' => I18n::_('How far the entry heading is form other elements in page. Please see the short CSS guide at the bottom of this page.'),
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry h2',
                    'property' => 'margin'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry .entryContent',
                    'property' => 'color'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry .entryContent',
                    'property' => 'font-size'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry .entryContent',
                    'property' => 'font-weight'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry .entryContent',
                    'property' => 'font-style'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry .entryContent',
                    'property' => 'font-variant'
                ]
            ]
        ],
        'lineHeight' => [
            'format' => 'text',
            'css_units' => true,
            'default' => 'inherit',
            'allow_blank' => true,
            'title' => I18n::_('Line height'),
            'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'),
            'css' => [
                [
                    'selector' => '#pageEntries li.xEntry .entryContent',
                    'property' => 'line-height'
                ]
            ]
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
            'css' => [
                [
                    'selector' => '.social-icon path',
                    'property' => 'fill'
                ]
            ]
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
