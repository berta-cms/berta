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
        'mash_up' => [
            'title' => 'Mash-up',
            'params' => [
                'marked_items_imageselect' => [
                    'format' => 'select',
                    'values' => [
                        'random' => $translate('select_on'),
                        'first' => $translate('select_off'),
                    ],
                    'default' => 'first',
                    'html_before' => $translate('shuffle_marked'),
                ],
                'marked_items_count' => [
                    'format' => 'text',
                    'html_before' => $translate('entries_limit'),
                    'default' => '5',
                    'validation' => 'positive_integer',
                    'tip' => $translate('entries_limit_tip'),
                ],
            ],
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
                'default' => '#1a1a1a',
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
                'default' => '"Times New Roman", Times, serif',
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
                'title' => $translate('Google web fonts'),
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
                'default' => '11px',
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
                'default' => '#0000ff',
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
                'default' => '#666666',
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
                'default' => '#0000ff',
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
                'default' => '#0000ff',
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
            'contentWidth' => [
                'format' => 'text',
                'default' => '380px',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Entry text max width'),
                'description' => $translate('Width of texts in the entries. This does not apply to the width of images.'),
                'css' => [
                    [
                        'selector' => '#firstPageMarkedEntries .xEntry',
                        'property' => 'max-width',
                    ],
                    [
                        'selector' => '#mainColumn',
                        'property' => 'max-width',
                    ],
                ],
            ],
            'paddingTop' => [
                'format' => 'text',
                'default' => '30px',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('How far content is from page top?'),
                'description' => $translate('The vertical distance between the top of the page and the content area.'),
                'css' => [
                    [
                        'selector' => '#mainColumn',
                        'property' => 'padding-top',
                    ],
                ],
            ],
            'paddingLeft' => [
                'format' => 'text',
                'default' => '30px',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('How far content is from sidebar?'),
                'description' => $translate('The horizontal distance between the menu and the content area.'),
                'css' => [
                    [
                        'selector' => '#mainColumn',
                        'property' => 'padding-left',
                    ],
                    [
                        'selector' => '#mainColumn',
                        'property' => 'padding-right',
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
            'mashUpColumns' => [
                'format' => 'select',
                'default' => '1',
                'values' => [
                    '1',
                    '2',
                    '3',
                    '4',
                ],
                'title' => $translate('Mash-up columns'),
                'description' => $translate('Column count for Mash-up section.'),
            ],
        ],

        'firstPage' => [
            '_' => [
                'title' => $translate('First page'),
            ],
            'imageSizeRatio' => [
                'format' => 'text',
                'default' => '0.4',
                'allow_blank' => true,
                'validation' => 'positive_number',
                'title' => $translate('Image size ratio'),
                'description' => $translate('Images in the first page layout will be resized by this ratio. Think of it as percentage, e.g., 0.7 = 70% of the original image size.'),
                'css' => [
                    [
                        'selector' => '.bt-responsive #firstPageMarkedEntries .xEntry',
                        'property' => 'max-width',
                        'template' => '`${value * 100}%`',
                    ],
                ],
            ],
            'imageHaveShadows' => [
                'format' => 'select',
                'values' => [
                    'yes',
                    'no',
                ],
                'default' => 'no',
                'title' => $translate('Images have shadows?'),
                'description' => '',
            ],
            'hoverWiggle' => [
                'format' => 'select',
                'values' => [
                    'yes',
                    'no',
                ],
                'default' => 'yes',
                'title' => $translate('Images wiggle on mouse-over?'),
                'description' => '',
            ],
        ],

        'sideBar' => [
            '_' => [
                'title' => $translate('Sidebar'),
            ],
            'width' => [
                'format' => 'text',
                'default' => '200px',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Width'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumn',
                        'property' => 'width',
                    ],
                    [
                        'selector' => '#mainColumn',
                        'property' => 'margin-left',
                    ],
                    [
                        'selector' => '.xNarrow #mainColumn.xCentered',
                        'property' => 'margin-left',
                    ],
                    [
                        'selector' => '.floating-banners',
                        'property' => 'margin-left',
                    ],
                ],
            ],
            'marginLeft' => [
                'format' => 'text',
                'default' => '0px',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Left margin'),
                'description' => $translate('How far the sidebar is from the left side of the screen. This gets ignored, if centered layout is enabled.'),
                'css' => [
                    [
                        'selector' => '#mainColumnContainer',
                        'property' => 'padding-left',
                    ],
                    [
                        'selector' => '#sideColumn',
                        'property' => 'left',
                    ],
                ],
            ],
            'marginTop' => [
                'format' => 'text',
                'default' => '30px',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Top padding'),
                'description' => $translate('How far the header is from the top of the screen?'),
                'css' => [
                    [
                        'selector' => '#sideColumnTop',
                        'property' => 'padding-top',
                    ],
                ],
            ],
            'marginBottom' => [
                'format' => 'text',
                'default' => '20px',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Space between header and menu'),
                'description' => $translate('How far the menu is from the header text or header image.'),
                'css' => [
                    [
                        'selector' => '#sideColumnTop h1',
                        'property' => 'margin-bottom',
                    ],
                ],
            ],
            'transparent' => [
                'format' => 'select',
                'values' => [
                    'yes',
                    'no',
                ],
                'default' => 'no',
                'title' => $translate('Is transparent?'),
                'description' => '',
            ],
            'backgroundColor' => [
                'format' => 'color',
                'default' => '#ffffff',
                'title' => $translate('Background color'),
                'description' => '',
            ],

            'image' => [
                'format' => 'image',
                'default' => '',
                'min_width' => 1,
                'min_height' => 1,
                'max_width' => 'setting:template:sideBar:width',
                'max_height' => 1600,
                'title' => $translate('Logo image'),
                'description' => '<span class="warning">' . $translate('Displayed image will be half of the original size, full size will be used for hi-res displays.') . '</span>',
            ],
            'color' => [
                'format' => 'color',
                'default' => '#1a1a1a',
                'title' => $translate('Heading text color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop h1',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#sideColumnTop h1 a',
                        'property' => 'color',
                        'important' => true,
                    ],
                ],
            ],
            'fontFamily' => [
                'format' => 'fontselect',
                'values' => $fontOptionsWithInherit,
                'default' => 'Georgia, "Times New Roman", Times, serif',
                'title' => $translate('Heading font'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop h1',
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
                        'selector' => '#sideColumnTop h1',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'fontSize' => [
                'format' => 'text',
                'default' => '10px',
                'allow_blank' => true,
                'title' => $translate('Heading font size'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop h1',
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
                'title' => $translate('Heading font weight'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop h1',
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
                'title' => $translate('Heading font style'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop h1',
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
                'title' => $translate('Heading font variant'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop h1',
                        'property' => 'font-variant',
                    ],
                ],
            ],
            'lineHeight' => [
                'format' => 'text',
                'default' => '1em',
                'allow_blank' => true,
                'title' => $translate('Heading line height'),
                'description' => $translate('Height of text line. Use em, px or % values or the default value "normal"'),
                'css' => [
                    [
                        'selector' => '#sideColumnTop h1',
                        'property' => 'line-height',
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
            'fontFamily' => [
                'format' => 'fontselect',
                'values' => $fontOptionsWithInherit,
                'default' => 'inherit',
                'title' => $translate('Font face'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop ul li',
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
                        'selector' => '#sideColumnTop ul li',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'fontSize' => [
                'format' => 'text',
                'default' => '10px',
                'allow_blank' => true,
                'title' => $translate('Font size'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop ul li',
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
                        'selector' => '#sideColumnTop ul li',
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
                        'selector' => '#sideColumnTop ul li',
                        'property' => 'font-style',
                    ],
                ],
            ],
            'lineHeight' => [
                'format' => 'text',
                'default' => '16px',
                'allow_blank' => true,
                'title' => $translate('Line height'),
                'description' => $translate('Height of text line. Use em, px or % values or the default value "normal"'),
                'css' => [
                    [
                        'selector' => '#sideColumnTop ul li',
                        'property' => 'line-height',
                    ],
                ],
            ],
            'colorLink' => [
                'format' => 'color',
                'default' => '#1a1a1a',
                'title' => $translate('Color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop li a:link',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#sideColumnTop li a:visited',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#pageEntries .xGalleryContainer ul.xGalleryNav li a',
                        'property' => 'color',
                    ],
                ],
            ],
            'colorHover' => [
                'format' => 'color',
                'default' => '#0000ff',
                'title' => $translate('Color when hovered'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop li a:hover',
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
                'default' => '#1a1a1a',
                'title' => $translate('Color when opened'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop li a:active',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#sideColumnTop li.selected > a',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#sideColumnTop li.selected > span',
                        'property' => 'color',
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
                        'selector' => '#sideColumnTop li a:link',
                        'property' => 'text-decoration',
                    ],
                    [
                        'selector' => '#sideColumnTop li a:visited',
                        'property' => 'text-decoration',
                    ],
                    [
                        'selector' => '#pageEntries .xGalleryContainer ul.xGalleryNav li a',
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
                'default' => 'none',
                'title' => $translate('Decoration when hovered'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop li a:hover',
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
                'default' => 'underline',
                'title' => $translate('Decoration when opened'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop li a:active',
                        'property' => 'text-decoration',
                    ],
                    [
                        'selector' => '#sideColumnTop li.selected > a',
                        'property' => 'text-decoration',
                    ],
                    [
                        'selector' => '#sideColumnTop li.selected > span',
                        'property' => 'text-decoration',
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
                'default' => 'inherit',
                'title' => $translate('Font face'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li',
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
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li',
                        'property' => 'font-family',
                    ],
                ],
            ],
            'fontSize' => [
                'format' => 'text',
                'default' => '11px',
                'allow_blank' => true,
                'title' => $translate('Font size'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li',
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
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li',
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
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li',
                        'property' => 'font-style',
                    ],
                ],
            ],
            'lineHeight' => [
                'format' => 'text',
                'default' => '16px',
                'allow_blank' => true,
                'title' => $translate('Line height'),
                'description' => $translate('Height of text line. Use em, px or % values or the default value "normal"'),
                'css' => [
                    [
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li',
                        'property' => 'line-height',
                    ],
                ],
            ],
            'colorLink' => [
                'format' => 'color',
                'default' => '#1a1a1a',
                'title' => $translate('Color'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li a:link',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li a:visited',
                        'property' => 'color',
                    ],
                ],
            ],
            'colorHover' => [
                'format' => 'color',
                'default' => '#0000ff',
                'title' => $translate('Color when hovered'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li a:hover',
                        'property' => 'color',
                    ],
                ],
            ],
            'colorActive' => [
                'format' => 'color',
                'default' => '#1a1a1a',
                'title' => $translate('Color when selected'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li a:active',
                        'property' => 'color',
                    ],
                    [
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li.selected > a',
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
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li a:link',
                        'property' => 'text-decoration',
                    ],
                    [
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li a:visited',
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
                'default' => 'none',
                'title' => $translate('Decoration when hovered'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li a:hover',
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
                'title' => $translate('Decoration when opened'),
                'description' => '',
                'css' => [
                    [
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li a:active',
                        'property' => 'text-decoration',
                    ],
                    [
                        'selector' => '#sideColumnTop .bt-sections-menu .subMenu li.selected > a',
                        'property' => 'text-decoration',
                    ],
                ],
            ],
        ],

        'entryLayout' => [
            '_' => [
                'title' => $translate('Entry layout'),
            ],
            'spaceBetween' => [
                'format' => 'text',
                'default' => '20px',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Space between entries'),
                'description' => $translate('Distance from entry to entry. In pixels.'),
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry',
                        'property' => 'margin-bottom',
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
                'description' => '',
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
                        'selector' => '.xGalleryType-column div.xGalleryItem',
                        'property' => 'padding-bottom',
                    ],
                    [
                        'selector' => '.xGalleryType-row:not(.bt-gallery-has-one-item) .xGalleryItem',
                        'property' => 'margin-right',
                    ],
                    [
                        'selector' => '.xSectionType-portfolio #pageEntries li.xEntry .xGalleryType-row:not(.bt-gallery-has-one-item) .xGallery .xGalleryItem',
                        'property' => 'padding-bottom',
                    ],
                    [
                        'selector' => '.bt-responsive #pageEntries li.xEntry .xGalleryType-row:not(.bt-gallery-has-one-item) .xGallery .xGalleryItem',
                        'property' => 'padding-bottom',
                        'breakpoint' => '(max-width: 767px)',
                    ],
                ],
            ],
            'galleryNavMargin' => [
                'format' => 'text',
                'default' => '5px',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Space between images and image navigation'),
                'description' => $translate('Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode'),
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry .xGalleryType-slideshow .xGallery',
                        'property' => 'margin-bottom',
                    ],
                ],
            ],
            'galleryMargin' => [
                'format' => 'text',
                'default' => '5px',
                'allow_blank' => true,
                'css_units' => true,
                'title' => $translate('Empty space below gallery'),
                'description' => $translate('Distance between the gallery and the content below'),
                'css' => [
                    [
                        'selector' => '#pageEntries li.xEntry .xGalleryContainer',
                        'property' => 'margin-bottom',
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
