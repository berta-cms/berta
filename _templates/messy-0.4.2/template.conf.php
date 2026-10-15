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
            'params' => [
                'columns' => [
                    'format' => 'select',
                    'default' => '1',
                    'values' => [
                        '1',
                        '2',
                        '3',
                        '4',
                    ],
                    'html_before' => '<div class="label">' . $translate('Columns') . ':</div>',
                ],
                'entryMaxWidth' => [
                    'format' => 'text',
                    'css_units' => true,
                    'default' => '',
                    'allow_blank' => true,
                    'html_before' => '<div class="label">' . $translate('Entry max width') . ':</div>',
                ],
                'entryPadding' => [
                    'format' => 'text',
                    'default' => '0 10px 20px 10px',
                    'html_before' => '<div class="label">' . $translate('Entry padding') . ':</div>',
                ],
                'backgroundVideoEmbed' => [
                    'format' => 'text',
                    'default' => '',
                    'allow_blank' => true,
                    'html_entities' => true,
                    'html_before' => '<div class="label">' . $translate('Background video (embed)') . ':</div>',
                ],
                'backgroundVideoRatio' => [
                    'format' => 'select',
                    'default' => 'fillWindow',
                    'values' => [
                        'fillWindow' => $translate('Fill window'),
                        'keepRatio' => $translate('Keep ratio'),
                    ],
                    'html_before' => '<div class="label">' . $translate('Background video ratio') . ':</div>',
                ],
            ],
        ],

        'external_link' => [
            'title' => 'External link',
            'params' => [
                'link' => [
                    'format' => 'url',
                    'default' => '',
                    'allow_blank' => true,
                    'link' => true,
                    'html_before' => '<div class="label">' . $translate('Link address') . ':</div>',
                ],
                'target' => [
                    'format' => 'select',
                    'values' => [
                        '_self' => 'Same window',
                        '_blank' => 'New window',
                    ],
                    'default' => '_blank',
                    'html_before' => '<div class="label">' . $translate('Opens in') . ':</div>',
                ],
            ],
        ],
        'grid' => [
            'title' => 'Thumbnails enabled',
        ],
        'portfolio' => [
            'title' => 'Portfolio',
        ],
    ];

    $templateConf = [
        'generalFontSettings' => [
            '_' => [
                'title' => $translate('General font settings'),
            ],
            'color' => [
                'format' => 'color',
                'default' => '#363636',
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
                'default' => 'Arial, sans-serif',
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
                'default' => '12px',
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
                'default' => '18px',
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
                'default' => '#000000',
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
                'default' => '#000000',
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
                'default' => '#000000',
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
                'default' => '#000000',
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
                'description' => $translate('IMPORTANT! These settings will be overwritten, if you are using background gallery feature. You access it by clicking "edit background gallery" button in each section.'),
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

        'grid' => [
            '_' => [
                'title' => $translate('Thumbnails'),
            ],
            'whatAreThumbnails' => [
                'format' => '',
                'default' => '',
                'title' => $translate('Thumbnails can be turned on by setting the section type to "Thumbnails enabled" & adding more than 1 images to background gallery.'),
            ],
            'contentWidth' => [
                'format' => 'text',
                'default' => '60%',
                'allow_blank' => true,
                'title' => $translate('Thumbnail container width'),
                'description' => $translate('IMPORTANT! This must be set as percentage. i.e. 60%'),
            ],
        ],

        'pageLayout' => [
            '_' => [
                'title' => $translate('Page layout'),
            ],
            'bgButtonType' => [
                'format' => 'select',
                'default' => 'dark',
                'values' => [
                    'dark',
                    'bright',
                ],
                'title' => $translate('Background button type'),
                'description' => $translate('Select type for background gallery buttons.'),
            ],
            'centered' => [
                'format' => 'select',
                'default' => 'no',
                'values' => [
                    'yes',
                    'no',
                ],
                'title' => $translate('Centered layout'),
                'description' => $translate('Sets whether layout should be centered or not.'),
            ],
            'centeredWidth' => [
                'format' => 'text',
                'default' => '960px',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Centered content width'),
                'description' => $translate('Content width if layout is centered.'),
                'css' => [
                    [
                        'selector' => 'body:not(.bt-responsive):not(.bt-auto-responsive) #contentContainer.xCentered',
                        'property' => 'width',
                    ],
                    [
                        'selector' => '.xCenteringGuide',
                        'property' => 'width',
                    ],
                    [
                        'selector' => '.bt-responsive #contentContainer',
                        'property' => 'max-width',
                    ],
                    [
                        'selector' => '.bt-auto-responsive #contentContainer.xCentered',
                        'property' => 'max-width',
                    ],
                    [
                        'selector' => '.bt-auto-responsive #contentContainer',
                        'property' => 'max-width',
                        'breakpoint' => '(max-width: 767px)',
                    ],
                ],
            ],
            'centeringGuidesColor' => [
                'format' => 'select',
                'default' => 'dark',
                'values' => [
                    'dark',
                    'bright',
                ],
                'title' => $translate('Centering guides color tone'),
                'description' => $translate('Color tone for centering guides (dark for bright background colors, bright for dark background colors).'),
            ],

            'group_responsive' => [
                'format' => false,
                'default' => false,
                'title' => $translate('Responsive design'),
            ],
            'autoResponsive' => [
                'format' => 'select',
                'default' => 'yes',
                'values' => [
                    'yes',
                    'no',
                ],
                'title' => $translate('Responsive layout'),
                'description' => $translate('Enables responsive layout for mobile devices.'),
            ],
            'responsive' => [
                'format' => 'select',
                'default' => 'no',
                'values' => [
                    'no',
                    'yes',
                ],
                'title' => $translate('Grid layout'),
                'description' => $translate('Entries are organised in columns. Column count can be changed under section settings.'),
            ],
            'centeredContents' => [
                'format' => 'select',
                'default' => 'no',
                'values' => [
                    'no',
                    'yes',
                ],
                'title' => $translate('Centered contents'),
                'description' => $translate('Page heading, menu items and section entries is horizontally centered to window.'),
            ],
            'headingMargin' => [
                'format' => 'text',
                'default' => '20px 10px',
                'allow_blank' => true,
                'title' => $translate('Heading margin'),
                'description' => $translate('Margin around page heading or logo.'),
                'css' => [
                    [
                        'selector' => '.bt-responsive #contentContainer h1',
                        'property' => 'margin',
                    ],
                    [
                        'selector' => '.bt-auto-responsive #contentContainer h1',
                        'property' => 'margin',
                        'breakpoint' => '(max-width: 767px)',
                    ],
                ],
            ],
            'menuMargin' => [
                'format' => 'text',
                'default' => '20px 10px',
                'allow_blank' => true,
                'title' => $translate('Menu margin'),
                'description' => $translate('Margin around menu.'),
                'css' => [
                    [
                        'selector' => '.portfolioThumbnailsWrap',
                        'property' => 'margin',
                    ],
                    [
                        'selector' => '.bt-responsive .bt-sections-menu',
                        'property' => 'margin',
                    ],
                    [
                        'selector' => '.bt-auto-responsive .bt-sections-menu',
                        'property' => 'margin',
                        'breakpoint' => '(max-width: 767px)',
                    ],
                ],
            ],
        ],

        'heading' => [
            '_' => [
                'title' => $translate('Page heading'),
            ],
            'position' => [
                'format' => 'select',
                'values' => [
                    'fixed',
                    'absolute',
                ],
                'default' => 'absolute',
                'title' => $translate('Heading position'),
                'description' => $translate('heading_position_description'),
                // @todo Fix the positing calculation in js. For now reload is required.
                // 'css' => [
                //     [
                //         'selector' => '#contentContainer h1',
                //         'property' => 'position',
                //         'important' => true
                //     ]
                // ]
            ],
            'image' => [
                'format' => 'image',
                'default' => '',
                'allow_blank' => true,
                'min_width' => 1,
                'min_height' => 1,
                'max_width' => 140,
                'max_height' => 400,
                'title' => $translate('Logo image'),
                'description' => '<span class="warning">' . $translate('Displayed image will be half of the original size, full size will be used for hi-res displays.') . '</span>',
            ],
            'color' => [
                'format' => 'color',
                'default' => '#000000',
                'allow_blank' => true,
                'title' => $translate('Color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#contentContainer h1',
                        'property' => 'color',
                    ],
                    [
                        'selector' => 'h1 a',
                        'property' => 'color',
                        'important' => true,
                    ],
                    [
                        'selector' => 'h1 a:link',
                        'property' => 'color',
                        'important' => true,
                    ],
                    [
                        'selector' => 'h1 a:visited',
                        'property' => 'color',
                        'important' => true,
                    ],
                    [
                        'selector' => 'h1 a:hover',
                        'property' => 'color',
                        'important' => true,
                    ],
                    [
                        'selector' => 'h1 a:active',
                        'property' => 'color',
                        'important' => true,
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundRightCounter',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundLeftCounter',
                        'property' => 'color',
                    ],
                ],
            ],
            'fontFamily' => [
                'format' => 'fontselect',
                'values' => $fontOptionsWithInherit,
                'default' => '"Arial black", Gadget',
                'title' => $translate('Font face'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#contentContainer h1',
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
                        'selector' => '#contentContainer h1',
                        'property' => 'font-family',
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundRightCounter',
                        'property' => 'font-family',
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundLeftCounter',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'fontSize' => [
                'format' => 'text',
                'default' => '30px',
                'allow_blank' => true,
                'title' => $translate('Font size'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#contentContainer h1',
                        'property' => 'font-size',
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundRightCounter',
                        'property' => 'font-size',
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundLeftCounter',
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
                        'selector' => '#contentContainer h1',
                        'property' => 'font-weight',
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundRightCounter',
                        'property' => 'font-weight',
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundLeftCounter',
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
                        'selector' => '#contentContainer h1',
                        'property' => 'font-style',
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundRightCounter',
                        'property' => 'font-style',
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundLeftCounter',
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
                        'selector' => '#contentContainer h1',
                        'property' => 'font-variant',
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundRightCounter',
                        'property' => 'font-variant',
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundLeftCounter',
                        'property' => 'font-variant',
                    ],
                ],
            ],
            'lineHeight' => [
                'format' => 'text',
                'default' => '1em',
                'allow_blank' => true,
                'title' => $translate('Line height'),
                'description' => $translate('Height of text line. Use em, px or % values or the default value "normal"'),
                'css' => [
                    [
                        'selector' => '#contentContainer h1',
                        'property' => 'line-height',
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundRightCounter',
                        'property' => 'line-height',
                    ],
                    [
                        'selector' => '#xBackground #xBackgroundLeftCounter',
                        'property' => 'line-height',
                    ],
                ],
            ],
        ],

        'menu' => [
            '_' => [
                'title' => $translate('Main menu'),
            ],
            'position' => [
                'format' => 'select',
                'values' => [
                    'fixed',
                    'absolute',
                ],
                'default' => 'absolute',
                'title' => $translate('Menu position'),
                'description' => $translate('menu_position_description'),
                // @todo Fix the positing calculation in js. For now reload is required.
                // 'css' => [
                //     [
                //         'selector' => '.bt-sections-menu > ul > li',
                //         'property' => 'position',
                //         'important' => true
                //     ]
                // ]
            ],
            'fontFamily' => [
                'format' => 'fontselect',
                'values' => $fontOptionsWithInherit,
                'default' => '"Arial black", Gadget',
                'title' => $translate('Font face'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul > li',
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
                        'selector' => '.bt-sections-menu > ul > li',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'fontSize' => [
                'format' => 'text',
                'default' => '20px',
                'allow_blank' => true,
                'title' => $translate('Font size'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul > li',
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
                        'selector' => '.bt-sections-menu > ul > li',
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
                        'selector' => '.bt-sections-menu > ul > li',
                        'property' => 'font-style',
                    ],
                ],
            ],
            'lineHeight' => [
                'format' => 'text',
                'default' => '1em',
                'allow_blank' => true,
                'title' => $translate('Line height'),
                'description' => $translate('Height of text line. Use em, px or % values or the default value "normal"'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul > li',
                        'property' => 'line-height',
                    ],
                ],
            ],
            'colorLink' => [
                'format' => 'color',
                'default' => '#000000',
                'title' => $translate('Color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul > li a:link',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '.bt-sections-menu > ul > li a:visited',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#pageEntries .xEntry .xGalleryContainer ul.xGalleryNav a',
                        'property' => 'color',
                    ],
                ],
            ],
            'colorHover' => [
                'format' => 'color',
                'default' => '#000000',
                'title' => $translate('Color when hovered'),
                'description' => $translate('Color of the element under mouse cursor'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul > li a:hover',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '.bt-sections-menu > ul > li a:active',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#pageEntries .xGalleryContainer ul.xGalleryNav li a:hover',
                        'property' => 'color',
                    ],
                ],
            ],
            'colorActive' => [
                'format' => 'color',
                'default' => '#000000',
                'title' => $translate('Color when selected'),
                'description' => $translate('Color of the element of the currently opened section'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul > li.selected > a',
                        'property' => 'color',
                        'important' => true,
                    ],
                    [
                        'selector' => '#pageEntries .xGalleryContainer ul.xGalleryNav li.selected a',
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
                'title' => $translate('Decoration'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul > li a:link',
                        'property' => 'text-decoration',
                    ],
                    [
                        'selector' => '.bt-sections-menu > ul > li a:visited',
                        'property' => 'text-decoration',
                    ],
                    [
                        'selector' => '#pageEntries .xEntry .xGalleryContainer ul.xGalleryNav a',
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
                'title' => $translate('Decoration when hovered'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul > li a:hover',
                        'property' => 'text-decoration',
                    ],
                    [
                        'selector' => '.bt-sections-menu > ul > li a:active',
                        'property' => 'text-decoration',
                    ],
                    [
                        'selector' => '#pageEntries .xGalleryContainer ul.xGalleryNav li a:hover',
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
                'default' => 'line-through',
                'title' => $translate('Decoration when selected'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu > ul > li.selected > a',
                        'property' => 'text-decoration',
                        'important' => true,
                    ],
                    [
                        'selector' => '#pageEntries .xGalleryContainer ul.xGalleryNav li.selected a',
                        'property' => 'text-decoration',
                    ],
                ],
            ],
        ],

        'tagsMenu' => [
            '_' => [
                'title' => $translate('Submenu'),
            ],
            'fontFamily' => [
                'format' => 'fontselect',
                'values' => $fontOptionsWithInherit,
                'default' => '"Arial black", Gadget',
                'title' => $translate('Font face'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu .subMenu li',
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
                        'selector' => '.bt-sections-menu .subMenu li',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'fontSize' => [
                'format' => 'text',
                'default' => '16px',
                'allow_blank' => true,
                'title' => $translate('Font size'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu .subMenu li',
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
                        'selector' => '.bt-sections-menu .subMenu li',
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
                        'selector' => '.bt-sections-menu .subMenu li',
                        'property' => 'font-style',
                    ],
                ],
            ],
            'lineHeight' => [
                'format' => 'text',
                'default' => '1.5em',
                'allow_blank' => true,
                'title' => $translate('Line height'),
                'description' => $translate('Height of text line. Use em, px or % values or the default value "normal"'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu .subMenu li',
                        'property' => 'line-height',
                    ],
                ],
            ],
            'colorLink' => [
                'format' => 'color',
                'default' => '#000000',
                'title' => $translate('Color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu .subMenu li a:link',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '.bt-sections-menu .subMenu li a:visited',
                        'property' => 'color',
                    ],
                ],
            ],
            'colorHover' => [
                'format' => 'color',
                'default' => '#000000',
                'title' => $translate('Color when hovered'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu .subMenu li a:hover',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '.bt-sections-menu .subMenu li a:active',
                        'property' => 'color',
                    ],
                ],
            ],
            'colorActive' => [
                'format' => 'color',
                'default' => '#000000',
                'title' => $translate('Color when selected'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu .subMenu li.selected > a',
                        'property' => 'color',
                        'important' => true,
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
                'title' => $translate('Decoration'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu .subMenu li a:link',
                        'property' => 'text-decoration',
                    ],
                    [
                        'selector' => '.bt-sections-menu .subMenu li a:visited',
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
                'title' => $translate('Decoration when hovered'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu .subMenu li a:hover',
                        'property' => 'text-decoration',
                    ],
                    [
                        'selector' => '.bt-sections-menu .subMenu li a:active',
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
                'title' => $translate('Decoration when selected'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '.bt-sections-menu .subMenu li.selected > a',
                        'property' => 'text-decoration',
                        'important' => true,
                    ],
                ],
            ],
            'x' => [
                'format' => 'text',
                'css_units' => true,
                'default' => '0',
                'allow_blank' => true,
                'title' => $translate('Positon X'),
                'description' => $translate('tags_menu_x_description'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu .subMenu',
                        'property' => 'left',
                    ],
                ],
            ],
            'y' => [
                'format' => 'text',
                'css_units' => true,
                'default' => '0',
                'allow_blank' => true,
                'title' => $translate('Positon Y'),
                'description' => $translate('tags_menu_y_description'),
                'css' => [
                    [
                        'selector' => '.bt-sections-menu .subMenu',
                        'property' => 'top',
                    ],
                ],
            ],
            'alwaysOpen' => [
                'format' => 'select',
                'values' => [
                    'yes',
                    'no',
                ],
                'default' => 'yes',
                'title' => $translate('Submenu is allways open'),
                'description' => $translate('tags_menu_always_open_description'),
            ],
            'hidden' => [
                'format' => 'select',
                'values' => [
                    'yes',
                    'no',
                ],
                'default' => 'no',
                'title' => $translate('Submenu is hidden'),
                'description' => '',
            ],
        ],

        'entryHeading' => [
            '_' => [
                'title' => $translate('Entry heading'),
            ],
            'color' => [
                'format' => 'color',
                'default' => '#363636',
                'title' => $translate('Color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries .xEntry h2',
                        'property' => 'color',
                    ],
                ],
            ],
            'fontFamily' => [
                'format' => 'fontselect',
                'values' => $fontOptions,
                'default' => 'Arial, sans-serif',
                'title' => $translate('Font face'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries .xEntry h2',
                        'property' => 'font-family',
                    ],
                    [
                        'selector' => '#shoppingCartTitle',
                        'property' => 'font-family',
                    ],
                    [
                        'selector' => '#shoppingCartEmpty',
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
                        'selector' => '#pageEntries .xEntry h2',
                        'property' => 'font-family',
                    ],
                    [
                        'selector' => '#shoppingCartTitle',
                        'property' => 'font-family',
                    ],
                    [
                        'selector' => '#shoppingCartEmpty',
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
                        'selector' => '#pageEntries .xEntry h2',
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
                        'selector' => '#pageEntries .xEntry h2',
                        'property' => 'font-weight',
                    ],
                    [
                        'selector' => '#shoppingCartTitle',
                        'property' => 'font-weight',
                    ],
                    [
                        'selector' => '#shoppingCartEmpty',
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
                        'selector' => '#pageEntries .xEntry h2',
                        'property' => 'font-style',
                    ],
                    [
                        'selector' => '#shoppingCartTitle',
                        'property' => 'font-style',
                    ],
                    [
                        'selector' => '#shoppingCartEmpty',
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
                        'selector' => '#pageEntries .xEntry h2',
                        'property' => 'font-variant',
                    ],
                    [
                        'selector' => '#shoppingCartTitle',
                        'property' => 'font-variant',
                    ],
                    [
                        'selector' => '#shoppingCartEmpty',
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
                        'selector' => '#pageEntries .xEntry h2',
                        'property' => 'line-height',
                    ],
                ],
            ],
            'margin' => [
                'format' => 'text',
                'default' => '15px 0 15px 0',
                'title' => $translate('Margins'),
                'description' => $translate('How far the entry heading is form other elements in page.'),
                'css' => [
                    [
                        'selector' => '#pageEntries .xEntry h2',
                        'property' => 'margin',
                    ],
                ],
            ],
        ],

        'entryLayout' => [
            '_' => [
                'title' => $translate('Entry layout'),
            ],
            'contentWidth' => [
                'format' => 'text',
                'default' => '400px',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Entry text max width'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#pageEntries .xEntry',
                        'property' => 'max-width',
                    ],
                    [
                        'selector' => '#xBackground .visual-caption',
                        'property' => 'width',
                    ],
                ],
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
                        'selector' => '#pageEntries .xEntry .xGalleryType-column .xGalleryItem',
                        'property' => 'padding-bottom',
                    ],
                    [
                        'selector' => '#pageEntries .xEntry .xGalleryType-row:not(.bt-gallery-has-one-item) .xGalleryItem',
                        'property' => 'margin-right',
                    ],
                    [
                        'selector' => '.bt-responsive #pageEntries .xEntry .xGalleryType-row:not(.bt-gallery-has-one-item) .xGallery .xGalleryItem',
                        'property' => 'padding-bottom',
                        'breakpoint' => '(max-width: 767px)',
                    ],
                    [
                        'selector' => '.bt-auto-responsive #pageEntries .xEntry .xGalleryType-row:not(.bt-gallery-has-one-item) .xGallery .xGalleryItem',
                        'property' => 'padding-bottom',
                        'breakpoint' => '(max-width: 767px)',
                    ],
                ],
            ],
            'galleryNavMargin' => [
                'format' => 'text',
                'default' => '0',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Space between images and image navigation'),
                'description' => $translate('Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode'),
                'css' => [
                    [
                        'selector' => '#pageEntries .xEntry .xGalleryType-slideshow .xGallery',
                        'property' => 'margin-bottom',
                    ],
                ],
            ],
            'galleryMargin' => [
                'format' => 'text',
                'default' => '0',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Empty space below gallery'),
                'description' => $translate('Distance between the gallery and the content below'),
                'css' => [
                    [
                        'selector' => '#pageEntries .xEntry .xGalleryContainer',
                        'property' => 'margin-bottom',
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

    $shopTemplateConfPath = dirname(__DIR__, 2) . '/_plugin_shop/template.conf.php';
    if ($isShopEnabled && is_file($shopTemplateConfPath)) {
        $sectionTypes += (require $shopTemplateConfPath)($translate);
    }

    $translations = [
        'sectionTypes' => [
            'type' => $translate('section_type'),
            'type_tip' => $translate('section_type_tip'),
        ],
    ];

    return [$sectionTypes, $templateConf, $translations];
};
