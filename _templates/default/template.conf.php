<?php

/**
 * The template's section types and settings: their default values for the site engine, and their titles and
 * descriptions for the editor. `$translate` translates a title or description into the editor's language.
 *
 * @return Closure(callable(string): string, bool): array{0: array<string, mixed>, 1: array<string, mixed>, 2: array<string, mixed>}
 */
return static function (callable $translate, bool $isShopEnabled): array {
    ['fonts' => $fontOptions, 'withInherit' => $fontOptionsWithInherit] = require dirname(__DIR__, 2) . '/engine/inc.font-options.php';

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
                'title' => $translate('General font settings'),
            ],
            'color' => [
                'format' => 'color',
                'default' => '#333333',
                'title' => $translate('Color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'body',
                        'property' => 'color',
                    ],
                ],
            ],
            'fontFamily' => [
                'format' => 'fontselect',
                'values' => $fontOptions,
                'default' => 'Helvetica, Arial, sans-serif',
                'title' => $translate('Font face'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'body',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'googleFont' => [
                'format' => 'text',
                'default' => '',
                'allow_blank' => true,
                'html_entities' => true,
                'title' => 'Google web fonts',
                'description' => $translate('google_font_description'),
                'css' => [
                    [
                        'selector' => 'body',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'fontSize' => [
                'format' => 'text',
                'default' => '9pt',
                'allow_blank' => true,
                'title' => $translate('Font size'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'body',
                        'property' => 'font-size',
                    ],
                ],
            ],
            'fontWeight' => [
                'format' => 'select',
                'values' => [
                    'normal',
                    'bold',
                ],
                'default' => 'normal',
                'title' => $translate('Font weight'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'body',
                        'property' => 'font-weight',
                    ],
                ],
            ],
            'fontStyle' => [
                'format' => 'select',
                'values' => [
                    'normal',
                    'italic',
                ],
                'default' => 'normal',
                'title' => $translate('Font style'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'body',
                        'property' => 'font-style',
                    ],
                ],
            ],
            'fontVariant' => [
                'format' => 'select',
                'values' => [
                    'normal',
                    'small-caps',
                ],
                'default' => 'normal',
                'title' => $translate('Font variant'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'body',
                        'property' => 'font-variant',
                    ],
                ],
            ],
            'lineHeight' => [
                'format' => 'text',
                'default' => 'normal',
                'allow_blank' => true,
                'title' => $translate('Line height'),
                'description' => $translate('Height of text line. Use em, px or % values or the default value "normal"'),
                'css' => [
                    [
                        'selector' => 'body',
                        'property' => 'line-height',
                    ],
                ],
            ],
        ],

        'links' => [
            '_' => [
                'title' => $translate('Hyperlinks'),
            ],
            'colorLink' => [
                'format' => 'color',
                'default' => '#888888',
                'title' => $translate('Link color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'a:link',
                        'property' => 'color',
                    ],
                ],
            ],
            'colorVisited' => [
                'format' => 'color',
                'default' => '#888888',
                'title' => $translate('Visited link color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'a:visited',
                        'property' => 'color',
                    ],
                ],
            ],
            'colorHover' => [
                'format' => 'color',
                'default' => '#888888',
                'title' => $translate('Link color when hovered'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'a:hover',
                        'property' => 'color',
                    ],
                ],
            ],
            'colorActive' => [
                'format' => 'color',
                'default' => '#888888',
                'title' => $translate('Link color when clicked'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'a:active',
                        'property' => 'color',
                    ],
                ],
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
                'title' => $translate('Link decoration'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'a:link',
                        'property' => 'text-decoration',
                    ],
                ],
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
                'title' => $translate('Visited link decoration'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'a:visited',
                        'property' => 'text-decoration',
                    ],
                ],
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
                'title' => $translate('Link decoration when hovered'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'a:hover',
                        'property' => 'text-decoration',
                    ],
                ],
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
                'title' => $translate('Link decoration when clicked'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'a:active',
                        'property' => 'text-decoration',
                    ],
                ],
            ],
        ],

        'background' => [
            '_' => [
                'title' => $translate('Background'),
            ],
            'backgroundColor' => [
                'format' => 'color',
                'default' => '#FFFFFF',
                'title' => $translate('Background color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'body',
                        'property' => 'background-color',
                    ],
                ],
            ],
            'backgroundImageEnabled' => [
                'format' => 'select',
                'values' => [
                    'yes',
                    'no',
                ],
                'default' => 'no',
                'title' => $translate('Is background image enabled?'),
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
                'title' => $translate('Background image'),
                'description' => $translate('Picture to use for page background.'),
                'css' => [
                    [
                        'selector' => 'body',
                        'property' => 'background-image',
                    ],
                ],
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
                'title' => $translate('Background tiling'),
                'description' => $translate('How the background fills the screen?'),
                'css' => [
                    [
                        'selector' => 'body',
                        'property' => 'background-repeat',
                    ],
                ],
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
                'title' => $translate('Background alignment'),
                'description' => $translate('Where the background image is positioned?'),
                'css' => [
                    [
                        'selector' => 'body',
                        'property' => 'background-position',
                    ],
                ],
            ],
            'backgroundAttachment' => [
                'format' => 'select',
                'values' => [
                    'fixed' => 'Fixed to browser window',
                    'fill' => 'Filled in browser window',
                    'scroll' => 'No stretch, scroll along with content',
                ],
                'default' => 'scroll',
                'title' => $translate('Background position'),
                'description' => $translate('Sets how background behaves in relation with the browser window.'),
            ],
        ],

        'pageLayout' => [
            '_' => [
                'title' => $translate('Page layout'),
            ],
            'contentPosition' => [
                'format' => 'select',
                'values' => [
                    'left',
                    'center',
                    'right',
                ],
                'default' => 'left',
                'title' => $translate('Content position'),
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
                'title' => $translate('Text alignment'),
                'description' => '',
            ],
            'contentWidth' => [
                'format' => 'text',
                'default' => '500px',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Width of content area'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#contentContainer',
                        'property' => 'width',
                    ],
                    [
                        'selector' => '.bt-responsive #contentContainer',
                        'property' => 'max-width',
                    ],
                ],
            ],
            'bodyMargin' => [
                'format' => 'text',
                'default' => '20px 40px 40px',
                'allow_blank' => true,
                'title' => $translate('Page margins'),
                'description' => $translate('How far the content is from browser edges.'),
                'css' => [
                    [
                        'selector' => '#contentContainer',
                        'property' => 'padding',
                    ],
                ],
            ],
            'siteMenuMargin' => [
                'format' => 'text',
                'default' => '0',
                'allow_blank' => true,
                'title' => $translate('Top menu margins'),
                'description' => $translate('How big is the distance from the top menu to the other page elements'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu',
                        'property' => 'padding',
                    ],
                ],
            ],
            'group_responsive' => [
                'format' => false,
                'default' => false,
                'title' => $translate('Responsive design'),
            ],
            'responsive' => [
                'format' => 'select',
                'default' => 'yes',
                'values' => [
                    'no',
                    'yes',
                ],
                'title' => $translate('Enabled'),
                'description' => $translate('Sets whether layout should be responsive or not.'),
            ],
        ],

        'pageHeading' => [
            '_' => [
                'title' => $translate('Page heading'),
            ],
            'image' => [
                'format' => 'image',
                'default' => '',
                'min_width' => 1,
                'min_height' => 1,
                'max_width' => 1000,
                'max_height' => 1000,
                'title' => $translate('Header image'),
                'description' => '<span class="warning">' . $translate('Displayed image will be half of the original size, full size will be used for hi-res displays.') . '</span>',
            ],
            'color' => [
                'format' => 'color',
                'default' => '#333333',
                'title' => $translate('Color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'h1',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#contentContainer h1 a',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#contentContainer h1 a:link',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#contentContainer h1 a:visited',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#contentContainer h1 a:hover',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#contentContainer h1 a:active',
                        'property' => 'color',
                    ],
                ],
            ],
            'fontFamily' => [
                'format' => 'fontselect',
                'values' => $fontOptionsWithInherit,
                'default' => 'inherit',
                'title' => $translate('Font face'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'h1',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'googleFont' => [
                'format' => 'text',
                'default' => '',
                'allow_blank' => true,
                'html_entities' => true,
                'title' => 'Google web fonts',
                'description' => $translate('google_font_description'),
                'css' => [
                    [
                        'selector' => 'h1',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'fontSize' => [
                'format' => 'text',
                'default' => '1.2em',
                'allow_blank' => true,
                'title' => $translate('Font size'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'h1',
                        'property' => 'font-size',
                    ],
                ],
            ],
            'fontWeight' => [
                'format' => 'select',
                'values' => [
                    'normal',
                    'bold',
                ],
                'default' => 'bold',
                'title' => $translate('Font weight'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'h1',
                        'property' => 'font-weight',
                    ],
                ],
            ],
            'fontStyle' => [
                'format' => 'select',
                'values' => [
                    'normal',
                    'italic',
                ],
                'default' => 'normal',
                'title' => $translate('Font style'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'h1',
                        'property' => 'font-style',
                    ],
                ],
            ],
            'fontVariant' => [
                'format' => 'select',
                'values' => [
                    'normal',
                    'small-caps',
                ],
                'default' => 'normal',
                'title' => $translate('Font variant'),
                'description' => '',
                'css' => [
                    [
                        'selector' => 'h1',
                        'property' => 'font-variant',
                    ],
                ],
            ],
            'lineHeight' => [
                'format' => 'text',
                'default' => '0.8em',
                'allow_blank' => true,
                'title' => $translate('Line height'),
                'description' => $translate('Height of text line. Use em, px or % values or the default value "normal"'),
                'css' => [
                    [
                        'selector' => 'h1',
                        'property' => 'line-height',
                    ],
                ],
            ],
            'margin' => [
                'format' => 'text',
                'default' => '10px 0 15px',
                'allow_blank' => true,
                'title' => $translate('Margins'),
                'description' => $translate('How far the heading is from other elements in page.'),
                'css' => [
                    [
                        'selector' => 'h1',
                        'property' => 'margin',
                    ],
                ],
            ],
        ],

        'additionalText' => [
            '_' => [
                'title' => $translate('Additional text'),
            ],
            'color' => [
                'format' => 'color',
                'default' => 'inherit',
                'title' => $translate('Color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#additionalText',
                        'property' => 'color',
                    ],
                ],
            ],
            'fontFamily' => [
                'format' => 'fontselect',
                'values' => $fontOptionsWithInherit,
                'default' => 'inherit',
                'title' => $translate('Font face'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#additionalText',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'googleFont' => [
                'format' => 'text',
                'default' => '',
                'allow_blank' => true,
                'html_entities' => true,
                'title' => $translate('Google web fonts'),
                'description' => $translate('google_font_description'),
                'css' => [
                    [
                        'selector' => '#additionalText',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'fontSize' => [
                'format' => 'text',
                'default' => 'inherit',
                'allow_blank' => true,
                'title' => $translate('Font size'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#additionalText',
                        'property' => 'font-size',
                    ],
                ],
            ],
        ],

        'menu' => [
            '_' => [
                'title' => $translate('Main menu'),
            ],
            'separator' => [
                'format' => 'text',
                'default' => '|',
                'allow_blank' => true,
                'title' => $translate('Menu items separator'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul:not(.subMenu) li:not(:first-child)::before',
                        'property' => 'content',
                        'template' => '`"${value}"`',
                    ],
                ],
            ],
            'separatorDistance' => [
                'format' => 'text',
                'css_units' => true,
                'default' => '0.5em',
                'allow_blank' => true,
                'title' => $translate('Space width around separator'),
                'description' => $translate('The distance from the separator to the menu item on both sides'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul:not(.subMenu) li:not(:first-child)::before',
                        'property' => 'padding-left',
                    ],
                    [
                        'selector' => '.bt-sections-menu > ul:not(.subMenu) li:not(:first-child)::before',
                        'property' => 'padding-right',
                    ],
                ],
            ],
            'fontSize' => [
                'format' => 'text',
                'default' => 'inherit',
                'allow_blank' => true,
                'title' => $translate('Font size'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul:not(.subMenu) li',
                        'property' => 'font-size',
                    ],
                ],
            ],
            'fontFamily' => [
                'format' => 'fontselect',
                'values' => $fontOptionsWithInherit,
                'default' => 'inherit',
                'title' => $translate('Font face'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul:not(.subMenu) li',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'googleFont' => [
                'format' => 'text',
                'default' => '',
                'allow_blank' => true,
                'html_entities' => true,
                'title' => 'Google web fonts',
                'description' => $translate('google_font_description'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul:not(.subMenu) li',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'colorLink' => [
                'format' => 'color',
                'default' => '#888888',
                'title' => $translate('Color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu ul li a:link',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '.bt-sections-menu ul li a:visited',
                        'property' => 'color',
                    ],
                ],
            ],
            'colorHover' => [
                'format' => 'color',
                'default' => '#888888',
                'title' => $translate('Color when hovered'),
                'description' => $translate('Color of the element under mouse cursor'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu ul li a:hover',
                        'property' => 'color',
                    ],
                ],
            ],
            'colorActive' => [
                'format' => 'color',
                'default' => '#888888',
                'title' => $translate('Color when selected'),
                'description' => $translate('Color of the element of the currently opened section'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu ul li a:active',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '.bt-sections-menu ul li.selected > a',
                        'property' => 'color',
                    ],
                ],
            ],
            'fontWeight' => [
                'format' => 'select',
                'values' => [
                    'inherit',
                    'normal',
                    'bold',
                ],
                'default' => 'inherit',
                'title' => $translate('Font weight'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul:not(.subMenu) li',
                        'property' => 'font-weight',
                    ],
                ],
            ],
            'fontStyle' => [
                'format' => 'select',
                'values' => [
                    'inherit',
                    'normal',
                    'italic',
                ],
                'default' => 'inherit',
                'title' => $translate('Font style'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul:not(.subMenu) li',
                        'property' => 'font-style',
                    ],
                ],
            ],
            'fontVariant' => [
                'format' => 'select',
                'values' => [
                    'inherit',
                    'normal',
                    'small-caps',
                ],
                'default' => 'inherit',
                'title' => $translate('Font variant'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul:not(.subMenu) li',
                        'property' => 'font-variant',
                    ],
                ],
            ],
            'lineHeight' => [
                'format' => 'text',
                'default' => 'inherit',
                'allow_blank' => true,
                'title' => $translate('Line height'),
                'description' => $translate('Height of text line. Use em, px or % values or the default value "normal"'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul:not(.subMenu) li',
                        'property' => 'line-height',
                    ],
                ],
            ],
            'margin' => [
                'format' => 'text',
                'default' => '0',
                'allow_blank' => true,
                'title' => $translate('Margins'),
                'description' => $translate('How far the menu is form other elements in page.'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul:not(.subMenu)',
                        'property' => 'padding',
                    ],
                ],
            ],
        ],

        'subMenu' => [
            '_' => [
                'title' => $translate('Submenu'),
            ],
            'separator' => [
                'format' => 'text',
                'default' => '|',
                'allow_blank' => true,
                'title' => $translate('Menu items separator'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > .subMenu li:not(:first-child)::before',
                        'property' => 'content',
                        'template' => '`"${value}"`',
                    ],
                ],
            ],
            'separatorDistance' => [
                'format' => 'text',
                'css_units' => true,
                'default' => '0.5em',
                'allow_blank' => true,
                'title' => $translate('Space width around separator'),
                'description' => $translate('The distance from the separator to the menu item on both sides'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > .subMenu li:not(:first-child)::before',
                        'property' => 'padding-left',
                    ],
                    [
                        'selector' => '.bt-sections-menu > .subMenu li:not(:first-child)::before',
                        'property' => 'padding-right',
                    ],
                ],
            ],
            'fontSize' => [
                'format' => 'text',
                'default' => 'inherit',
                'allow_blank' => true,
                'title' => $translate('Font size'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > .subMenu li',
                        'property' => 'font-size',
                    ],
                ],
            ],
            'fontFamily' => [
                'format' => 'fontselect',
                'values' => $fontOptionsWithInherit,
                'default' => 'inherit',
                'title' => $translate('Font face'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > .subMenu li',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'googleFont' => [
                'format' => 'text',
                'default' => '',
                'allow_blank' => true,
                'html_entities' => true,
                'title' => 'Google web fonts',
                'description' => $translate('google_font_description'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > .subMenu li',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'fontWeight' => [
                'format' => 'select',
                'values' => [
                    'inherit',
                    'normal',
                    'bold',
                ],
                'default' => 'inherit',
                'title' => $translate('Font weight'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > .subMenu li',
                        'property' => 'font-weight',
                    ],
                ],
            ],
            'fontStyle' => [
                'format' => 'select',
                'values' => [
                    'inherit',
                    'normal',
                    'italic',
                ],
                'default' => 'inherit',
                'title' => $translate('Font style'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > .subMenu li',
                        'property' => 'font-style',
                    ],
                ],
            ],
            'fontVariant' => [
                'format' => 'select',
                'values' => [
                    'inherit',
                    'normal',
                    'small-caps',
                ],
                'default' => 'inherit',
                'title' => $translate('Font variant'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > .subMenu li',
                        'property' => 'font-variant',
                    ],
                ],
            ],
            'lineHeight' => [
                'format' => 'text',
                'default' => 'inherit',
                'allow_blank' => true,
                'title' => $translate('Line height'),
                'description' => $translate('Height of text line. Use em, px or % values or the default value "normal"'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > .subMenu li',
                        'property' => 'line-height',
                    ],
                ],
            ],
            'margin' => [
                'format' => 'text',
                'default' => '0 0 10px',
                'allow_blank' => true,
                'title' => $translate('Margins'),
                'description' => $translate('How far the menu is form other elements in page.'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > .subMenu',
                        'property' => 'padding',
                    ],
                ],
            ],
        ],

        'entryLayout' => [
            '_' => [
                'title' => $translate('Entry layout'),
            ],
            'margin' => [
                'format' => 'text',
                'default' => '0 0 4em',
                'allow_blank' => true,
                'title' => $translate('Entry margins'),
                'description' => $translate('Margins around entries.'),
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry',
                        'property' => 'margin',
                    ],
                ],
            ],
            'galleryPosition' => [
                'format' => 'select',
                'values' => [
                    'between title/description',
                    'above title',
                    'below description',
                ],
                'default' => 'between title/description',
                'title' => $translate('Gallery position'),
                'description' => '',
            ],
            'defaultGalleryType' => [
                'format' => 'select',
                'values' => [
                    'slideshow',
                    'row',
                    'grid',
                ],
                'default' => 'slideshow',
                'title' => $translate('Default gallery type'),
                'description' => $translate('Slideshow means that an image menu plus only one image is visible at a time. Row means that all images are visible.'),
            ],
            'spaceBetweenImages' => [
                'format' => 'text',
                'default' => '1em',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Space between images in row and column'),
                'description' => $translate('Horizontal/vertical space between images when gallery is in "row"/"column" mode'),
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry .xGalleryType-column .xGalleryItem',
                        'property' => 'padding-bottom',
                    ],
                    [
                        'selector' => '#pageEntries li.xEntry .xGalleryType-row:not(.bt-gallery-has-one-item) .xGalleryItem',
                        'property' => 'margin-right',
                    ],
                    [
                        'selector' => '.bt-responsive #pageEntries li.xEntry .xGalleryType-row:not(.bt-gallery-has-one-item) .xGallery .xGalleryItem',
                        'property' => 'padding-bottom',
                        'breakpoint' => '(max-width: 767px)',
                    ],
                ],
            ],
            'galleryMargin' => [
                'format' => 'text',
                'default' => '0',
                'allow_blank' => true,
                'title' => $translate('Gallery margins'),
                'description' => $translate('Margin around gallery block'),
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry .xGalleryContainer .xGallery',
                        'property' => 'margin',
                    ],
                ],
            ],
        ],

        'entryHeading' => [
            '_' => [
                'title' => $translate('Entry heading'),
            ],
            'color' => [
                'format' => 'color',
                'default' => '#333333',
                'title' => $translate('Color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry h2',
                        'property' => 'color',
                    ],
                ],
            ],
            'fontFamily' => [
                'format' => 'fontselect',
                'values' => $fontOptionsWithInherit,
                'default' => 'inherit',
                'title' => $translate('Font face'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry h2',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'googleFont' => [
                'format' => 'text',
                'default' => '',
                'allow_blank' => true,
                'html_entities' => true,
                'title' => 'Google web fonts',
                'description' => $translate('google_font_description'),
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry h2',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'fontSize' => [
                'format' => 'text',
                'default' => '1.8em',
                'allow_blank' => true,
                'title' => $translate('Font size'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry h2',
                        'property' => 'font-size',
                    ],
                ],
            ],
            'fontWeight' => [
                'format' => 'select',
                'values' => [
                    'normal',
                    'bold',
                ],
                'default' => 'normal',
                'title' => $translate('Font weight'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry h2',
                        'property' => 'font-weight',
                    ],
                ],
            ],
            'fontStyle' => [
                'format' => 'select',
                'values' => [
                    'normal',
                    'italic',
                ],
                'default' => 'normal',
                'title' => $translate('Font style'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry h2',
                        'property' => 'font-style',
                    ],
                ],
            ],
            'fontVariant' => [
                'format' => 'select',
                'values' => [
                    'normal',
                    'small-caps',
                ],
                'default' => 'normal',
                'title' => $translate('Font variant'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry h2',
                        'property' => 'font-variant',
                    ],
                ],
            ],
            'lineHeight' => [
                'format' => 'text',
                'default' => 'normal',
                'allow_blank' => true,
                'title' => $translate('Line height'),
                'description' => $translate('Height of text line. Use em, px or % values or the default value "normal"'),
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry h2',
                        'property' => 'line-height',
                    ],
                ],
            ],
            'margin' => [
                'format' => 'text',
                'default' => '0',
                'allow_blank' => true,
                'title' => $translate('Margins'),
                'description' => $translate('How far the entry heading is form other elements in page.'),
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry h2',
                        'property' => 'margin',
                    ],
                ],
            ],
        ],

        'entryFooter' => [
            '_' => [
                'title' => $translate('Entry footer'),
            ],
            'color' => [
                'format' => 'color',
                'default' => '#333333',
                'title' => $translate('Color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry .entryContent',
                        'property' => 'color',
                    ],
                ],
            ],
            'fontFamily' => [
                'format' => 'fontselect',
                'values' => $fontOptionsWithInherit,
                'default' => 'inherit',
                'title' => $translate('Font face'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry .entryContent',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'googleFont' => [
                'format' => 'text',
                'default' => '',
                'allow_blank' => true,
                'html_entities' => true,
                'title' => 'Google web fonts',
                'description' => $translate('google_font_description'),
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry .entryContent',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'fontSize' => [
                'format' => 'text',
                'default' => 'inherit',
                'allow_blank' => true,
                'title' => $translate('Font size'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry .entryContent',
                        'property' => 'font-size',
                    ],
                ],
            ],
            'fontWeight' => [
                'format' => 'select',
                'values' => [
                    'inherit',
                    'normal',
                    'bold',
                ],
                'default' => 'inherit',
                'title' => $translate('Font weight'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry .entryContent',
                        'property' => 'font-weight',
                    ],
                ],
            ],
            'fontStyle' => [
                'format' => 'select',
                'values' => [
                    'inherit',
                    'normal',
                    'italic',
                ],
                'default' => 'inherit',
                'title' => $translate('Font style'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry .entryContent',
                        'property' => 'font-style',
                    ],
                ],
            ],
            'fontVariant' => [
                'format' => 'select',
                'values' => [
                    'inherit',
                    'normal',
                    'small-caps',
                ],
                'default' => 'inherit',
                'title' => $translate('Font variant'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry .entryContent',
                        'property' => 'font-variant',
                    ],
                ],
            ],
            'lineHeight' => [
                'format' => 'text',
                'default' => 'inherit',
                'allow_blank' => true,
                'title' => $translate('Line height'),
                'description' => $translate('Height of text line. Use em, px or % values or the default value "normal"'),
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry .entryContent',
                        'property' => 'line-height',
                    ],
                ],
            ],
        ],

        'socialMediaLinks' => [
            '_' => [
                'title' => $translate('Social media buttons'),
            ],
            'color' => [
                'format' => 'color',
                'default' => '#000000',
                'title' => $translate('Button color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.social-icon path',
                        'property' => 'fill',
                    ],
                ],
            ],
        ],

        'css' => [
            '_' => [
                'title' => $translate('Custom CSS'),
            ],
            'customCSS' => [
                'format' => 'longtext',
                'allow_blank' => true,
                'default' => '',
                'html_entities' => true,
                'title' => $translate('Custom CSS'),
                'description' => $translate('custom_css_description'),
            ],
        ],

        'settings' => [
            '_' => [
                'title' => $translate('Other settings'),
            ],
            'resetTemplate' => [
                'format' => 'action',
                'default' => 'resetTemplate',
                'title' => $translate('Reset design'),
                'description' => $translate('Reset design to default values.'),
            ],
        ],
    ];

    $translations = [
        'sectionTypes' => [
            'type' => $translate('section_type'),
            'type_tip' => $translate('section_type_tip'),
        ],
    ];

    return [$sectionTypes, $templateConf, $translations];
};
