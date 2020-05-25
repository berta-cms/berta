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
                'link' => true
            ],
            'target' => [
                'format' => 'select',
                'values' => [
                    '_self' => 'Same window',
                    '_blank' => 'New window',
                ],
                'default' => '_blank',
            ],
        ]
    ],
    'portfolio' => [
        'title' => 'Portfolio',
    ],
];

$templateConf = [
    'generalFontSettings' => [
        '_' => [
            'title' => I18n::_('General font settings')
        ],
        'color' => [
            'format' => 'color',
            'default' => '#000000',
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
            'default' => 'Arial, sans-serif',
            'title' => I18n::_('Font face'),
            'description' => '',
        ],
        'googleFont' => [
            'format' => 'text',
            'default' => '',
            'allow_blank' => true,
            'html_entities' => true,
            'title' => 'Google web fonts',
            'description' => I18n::_('googleFont_description')
        ],
        'fontSize' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '11px',
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
            'title' => I18n::_('Hyperlinks')
        ],
        'colorLink' => [
            'format' => 'color',
            'default' => '#666666',
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
            'default' => '#666666',
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
            'default' => '#666666',
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
            'default' => '#666666',
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
            'title' => I18n::_('Background')
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
            'description' => I18n::_('Picture to use for page background.')
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
            'description' => I18n::_('How the background fills the screen?')
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
            'description' => I18n::_('Where the background image is positioned?')
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
            'description' => I18n::_('Sets how background behaves in relation with the browser window.')
        ],
    ],

    'pageLayout' => [
        '_' => [
            'title' => I18n::_('Page layout')
        ],
        'centered' => [
            'format' => 'select',
            'default' => 'no',
            'values' => [
                'yes',
                'no',
            ],
            'title' => I18n::_('Centered layout'),
            'description' => I18n::_('Sets whether layout should be centered or not.')
        ],
        'contentWidth' => [
            'format' => 'text',
            'default' => '600px',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('Entry text max width'),
            'description' => I18n::_('Width of texts in the entries. This does not apply to the width of images.')
        ],
        'paddingTop' => [
            'format' => 'text',
            'default' => '90px',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('How far content is from page top?'),
            'description' => I18n::_('The vertical distance between the top of the page and the content area.')
        ],
        'paddingLeft' => [
            'format' => 'text',
            'default' => '30px',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('How far content is from menu?'),
            'description' => I18n::_('The horizontal distance between the menu and the content area.')
        ],
        'leftColumnWidth' => [
            'format' => 'text',
            'default' => '170px',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('Width of the left column'),
            'description' => '',
        ],
        'group_responsive' => [
            'format' => false,
            'default' => false,
            'title' => I18n::_('Responsive design')
        ],
        'responsive' => [
            'format' => 'select',
            'default' => 'yes',
            'values' => [
                'no',
                'yes',
            ],
            'title' => I18n::_('Enabled'),
            'description' => I18n::_('Sets whether layout should be responsive or not.')
        ],
    ],

    'pageHeading' => [
        '_' => [
            'title' => I18n::_('Page heading')
        ],
        'image' => [
            'format' => 'image',
            'default' => '',
            'min_width' => 1,
            'min_height' => 1,
            'max_width' => 140,
            'max_height' => 400,
            'title' => I18n::_('Header image'),
            'description' => '<span class="warning">' . I18n::_('Displayed image will be half of the original size, full size will be used for hi-res displays.') . '</span>',
        ],
        'color' => [
            'format' => 'color',
            'default' => '#000000',
            'title' => I18n::_('Color'),
            'description' => '',
            'css' => [
                [
                    'selector' => '#sideColumnTop h1',
                    'property' => 'color'
                ],
                [
                    'selector' => '#sideColumnTop h1 a',
                    'property' => 'color'
                ],
                [
                    'selector' => '#sideColumnTop h1 a:link',
                    'property' => 'color'
                ],
                [
                    'selector' => '#sideColumnTop h1 a:visited',
                    'property' => 'color'
                ],
                [
                    'selector' => '#sideColumnTop h1 a:hover',
                    'property' => 'color'
                ],
                [
                    'selector' => '#sideColumnTop h1 a:active',
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
            'description' => I18n::_('googleFont_description')
        ],
        'fontSize' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '20px',
            'allow_blank' => true,
            'title' => I18n::_('Font size'),
            'description' => '',
            'css' => [
                [
                    'selector' => '#sideColumnTop h1',
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
                    'selector' => '#sideColumnTop h1',
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
                    'selector' => '#sideColumnTop h1',
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
                    'selector' => '#sideColumnTop h1',
                    'property' => 'font-variant'
                ]
            ]
        ],
        'lineHeight' => [
            'format' => 'text',
            'css_units' => true,
            'default' => '1em',
            'allow_blank' => true,
            'title' => I18n::_('Line height'),
            'description' => I18n::_('Height of text line. Use em, px or % values or the default value "normal"'),
            'css' => [
                [
                    'selector' => '#sideColumnTop h1',
                    'property' => 'line-height'
                ]
            ]
        ],
        'marginTop' => [
            'format' => 'text',
            'default' => '0',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('Empty space on top'),
            'description' => '',
            'css' => [
                [
                    'selector' => '#sideColumnTop h1',
                    'property' => 'margin-top'
                ]
            ]
        ],
        'marginBottom' => [
            'format' => 'text',
            'default' => '20px',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('Empty space on bottom'),
            'description' => '',
            'css' => [
                [
                    'selector' => '#sideColumnTop h1',
                    'property' => 'margin-bottom'
                ]
            ]

        ],
    ],

    'menu' => [
        '_' => [
            'title' => I18n::_('Main menu')
        ],
        'colorLink' => [
            'format' => 'color',
            'default' => '#666666',
            'title' => I18n::_('Color'),
            'description' => '',
            'css' => [
                [
                    'selector' => '#sideColumnTop a:link',
                    'property' => 'color'
                ],
                [
                    'selector' => '#sideColumnTop a:visited',
                    'property' => 'color'
                ],
                [
                    'selector' => 'ol#pageEntries .xGalleryContainer ul.xGalleryNav li a',
                    'property' => 'color'
                ]
            ]
        ],
        'colorHover' => [
            'format' => 'color',
            'default' => '#666666',
            'title' => I18n::_('Color when hovered'),
            'description' => I18n::_('Color of the element under mouse cursor'),
            'css' => [
                [
                    'selector' => '#sideColumnTop a:hover',
                    'property' => 'color'
                ],
                [
                    'selector' => 'ol#pageEntries .xGalleryContainer ul.xGalleryNav li a:hover',
                    'property' => 'color'
                ]
            ]
        ],
        'colorActive' => [
            'format' => 'color',
            'default' => '#666666',
            'title' => I18n::_('Color when selected'),
            'description' => I18n::_('Color of the element of the currently opened section'),
            'css' => [
                [
                    'selector' => '#sideColumnTop a:active',
                    'property' => 'color'
                ],
                [
                    'selector' => '#sideColumnTop li.selected > a',
                    'property' => 'color'
                ],
                [
                    'selector' => '#sideColumnTop li.selected > span',
                    'property' => 'color'
                ],

                [
                    'selector' => 'ol#pageEntries .xGalleryContainer ul.xGalleryNav li.selected a',
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
            'title' => I18n::_('Decoration'),
            'description' => '',
            'css' => [
                [
                    'selector' => '#sideColumnTop a:link',
                    'property' => 'text-decoration'
                ],
                [
                    'selector' => '#sideColumnTop a:visited',
                    'property' => 'text-decoration'
                ],
                [
                    'selector' => 'ol#pageEntries .xGalleryContainer ul.xGalleryNav li a',
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
            'title' => I18n::_('Decoration when hovered'),
            'description' => '',
            'css' => [
                [
                    'selector' => '#sideColumnTop a:hover',
                    'property' => 'text-decoration'
                ],
                [
                    'selector' => 'ol#pageEntries .xGalleryContainer ul.xGalleryNav li a:hover',
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
            'title' => I18n::_('Decoration when selected'),
            'description' => '',
            'css' => [
                [
                    'selector' => '#sideColumnTop a:active',
                    'property' => 'text-decoration'
                ],
                [
                    'selector' => '#sideColumnTop li.selected > a',
                    'property' => 'text-decoration'
                ],
                [
                    'selector' => '#sideColumnTop li.selected > span',
                    'property' => 'text-decoration'
                ],
                [
                    'selector' => 'ol#pageEntries .xGalleryContainer ul.xGalleryNav li.selected a',
                    'property' => 'text-decoration'
                ]
            ]
        ],
    ],

    'entryLayout' => [
        '_' => [
            'title' => I18n::_('Entry layout')
        ],
        'spaceBetween' => [
            'format' => 'text',
            'default' => '20px',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('Space between entries'),
            'description' => I18n::_('Distance from entry to entry. In pixels.'),
            'css' => [
                [
                    'selector' => 'ol#pageEntries li.xEntry',
                    'property' => 'margin-bottom'
                ]
            ]
        ],
        'defaultGalleryType' => [
            'format' => 'select',
            'values' => [
                'slideshow',
                'row',
            ],
            'default' => 'slideshow',
            'title' => I18n::_('Default gallery type'),
            'description' => '',
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
                    'selector' => 'ol#pageEntries li.xEntry .xGalleryType-column .xGalleryItem',
                    'property' => 'padding-bottom'
                ],
                [
                    'selector' => 'ol#pageEntries li.xEntry .xGalleryType-row:not(.bt-gallery-has-one-item) .xGalleryItem',
                    'property' => 'margin-right'
                ],
                [
                    'selector' => '.bt-responsive ol#pageEntries li.xEntry .xGalleryType-row:not(.bt-gallery-has-one-item) .xGallery .xGalleryItem',
                    'property' => 'padding-bottom'
                ]
            ]
        ],
        'galleryNavMargin' => [
            'format' => 'text',
            'default' => '0',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('Space between images and image navigation'),
            'description' => I18n::_('Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode'),
            'css' => [
                [
                    'selector' => 'ol#pageEntries li.xEntry .xGalleryType-slideshow .xGallery',
                    'property' => 'margin-bottom'
                ]
            ]
        ],
        'galleryMargin' => [
            'format' => 'text',
            'default' => '1em',
            'allow_blank' => true,
            'css_units' => true,
            'title' => I18n::_('Empty space below gallery'),
            'description' => I18n::_('Distance between the gallery and the content below'),
            'css' => [
                [
                    'selector' => 'ol#pageEntries li.xEntry .xGalleryContainer',
                    'property' => 'margin-bottom'
                ]
            ]
        ],
    ],

    'socialMediaLinks' => [
        '_' => [
            'title' => I18n::_('Social media buttons')
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
            'title' => I18n::_('Custom CSS')
        ],
        'customCSS' => [
            'format' => 'longtext',
            'allow_blank' => true,
            'default' => '',
            'html_entities' => true,
            'title' => I18n::_('Custom CSS'),
            'description' => I18n::_('description_custom_css')
        ],
    ],
];

return [$sectionTypes, $templateConf];
