<?php

/**
 * The site's settings: their default values for the site engine, and their titles and descriptions for the
 * editor. `$translate` translates a title or description into the editor's language.
 *
 * @return Closure(callable(string): string, bool, int|null): array<string, array<string, mixed>>
 */
return static function (callable $translate, bool $isShopEnabled, ?int $hostingPlan): array {
    $languages = [
        'en' => 'English',
        'lv' => 'Latviešu',
        'fr' => 'Français',
        'ru' => 'Русский',
        'nl' => 'Nederlands',
        'pl' => 'Polski',
        'es' => 'Spanish',
    ];
    $images = [
        'small_width' => 200,
        'small_height' => 200,
        'medium_width' => 400,
        'medium_height' => 400,
        'large_width' => 600,
        'large_height' => 600,
    ];

    $settingsDefinition = [
        'berta' => [
            '_' => ['invisible' => true],
            'installed' => [
                'format' => 'text',
                'allow_blank' => true,
                'default' => null,
                'title' => '',
                'description' => '',
            ],
        ],

        // siteTexts block is NOT editable in the settings page. It is reserved for texts appearing only on the page
        'siteTexts' => [
            '_' => [
                'title' => $translate('Texts in the website'),
                'invisible' => true,
            ],
            'siteHeading' => [
                'format' => 'text',
                'allow_blank' => true,
                'default' => null,
                'title' => $translate('Site heading'),
                'description' => $translate('Name of your site. Visible in all sections.'),
            ],
        ],

        'template' => [
            '_' => [
                'title' => $translate('Template'),
            ],
            'template' => [
                'format' => 'select',
                'values' => 'templates',
                'allow_blank' => false,
                'default' => false,
                'affectsStyle' => true,
                'title' => $translate('Template'),
                'description' => $translate('Templates are like skins or themes for your site. You can choose one template from the ones installed in your templates folder. To add a new template to this list, upload it to the templates folder via FTP.'),
            ],
        ],

        'theme' => [
            '_' => [
                'title' => $translate('Theme'),
            ],
            'theme' => [
                'format' => 'route',
                'default' => '/themes',
                'title' => $translate('Choose theme'),
                'description' => $translate('Themes are ready made sites with predefined design settings.'),
            ],
        ],

        'texts' => [
            '_' => [
                'title' => $translate('Texts'),
            ],
            'ownerName' => [
                'format' => 'text',
                'allow_blank' => true,
                'default' => null,
                'title' => $translate('Your name'),
                'description' => $translate('Your name will be put in a meta-tag in the code of your site. You can choose any name ;)'),
            ],
            'pageTitle' => [
                'format' => 'text',
                'allow_blank' => true,
                'default' => 'berta',
                'title' => $translate('Page title (title bar)'),
                'description' => $translate('Text that appears in the bowser title bar'),
            ],
            'metaDescription' => [
                'format' => 'text',
                'allow_blank' => true,
                'default' => 'Personal portfolio built with Berta',
                'title' => $translate('<META> description'),
                'description' => $translate('Short site description. It should not be longer than one or two sentences.'),
            ],
        ],

        'pageLayout' => [
            '_' => [
                'title' => $translate('Page layout'),
            ],
            'favicon' => [
                'format' => 'icon',
                'default' => '',
                'allow_blank' => true,
                'title' => $translate('Favicon'),
                'description' => $translate('Small picture to display in the address bar of the browser. The file must be in PNG format and 180x180 pixels big.'),
            ],
            'gridStep' => [
                'format' => 'text',
                'default' => 10,
                'allow_blank' => true,
                'validation' => 'positive_integer',
                'title' => $translate('Grid step'),
                'description' => $translate('Distance in pixels for snap-to-grid dragging.'),
            ],
            'showGrid' => [
                'format' => 'select',
                'default' => 'no',
                'values' => [
                    'yes',
                    'no',
                ],
                'title' => $translate('Show gridlines'),
                'description' => $translate('Choose "yes" to show gridlines in background. Available only in Messy template.'),
            ],
            'gridColor' => [
                'format' => 'select',
                'default' => 'black',
                'allow_blank' => true,
                'values' => [
                    'black',
                    'white',
                ],
                'title' => $translate('Gridlines color'),
                'description' => '',
            ],
        ],

        'navigation' => [
            '_' => [
                'title' => $translate('Navigation'),
            ],
            'landingSectionVisible' => [
                'format' => 'select',
                'default' => 'yes',
                'values' => [
                    'yes',
                    'no',
                ],
                'affectsStyle' => true,
                'title' => $translate('Is first section visible in menu?'),
                'description' => $translate('Choose "no" to hide the first section in the main menu. Link from the page title (or header image) will lead to it. NOTE: This setting has no effect, if the section has a submenu; then it is visible at all times.'),
            ],
            'landingSectionPageHeadingVisible' => [
                'format' => 'select',
                'default' => 'yes',
                'values' => [
                    'yes',
                    'no',
                ],
                'affectsStyle' => true,
                'title' => $translate('Show page heading in first section?'),
                'description' => $translate('Choose "no" to hide page heading in first section.'),
            ],
            'landingSectionMenuVisible' => [
                'format' => 'select',
                'default' => 'yes',
                'values' => [
                    'yes',
                    'no',
                ],
                'affectsStyle' => true,
                'title' => $translate('Show menu in first section?'),
                'description' => $translate('Choose "no" to hide the menu in first section.'),
            ],
            'alwaysSelectTag' => [
                'format' => 'select',
                'default' => 'yes',
                'values' => [
                    'yes',
                    'no',
                ],
                'affectsStyle' => true,
                'title' => $translate('Always auto-select a submenu item?'),
                'description' => $translate('Choose "yes" to automatically select the first submenu item when clicking on a menu item. This works only when there is a submenu.'),
            ],
            'backToTopEnabled' => [
                'format' => 'select',
                'default' => 'no',
                'values' => [
                    'yes',
                    'no',
                ],
                'affectsStyle' => true,
                'title' => $translate('Enable navigation to page top'),
                'description' => $translate('Shows navigation button at the bottom when page is scrolled.'),
            ],
        ],

        'entryLayout' => [
            '_' => [
                'title' => $translate('Entry layout'),
            ],
            'galleryFullScreenSettings' => [
                'format' => false,
                'default' => false,
                'title' => $translate('Gallery fullscreen settings:'),
            ],
            'galleryFullScreenDefault' => [
                'format' => 'select',
                'default' => 'yes',
                'values' => ['yes', 'no'],
                'affectsStyle' => true,
                'title' => $translate('Is enabled by default'),
                'description' => $translate('Enables gallery fullscreen mode for new entries.'),
            ],
            'galleryFullScreenBackground' => [
                'format' => 'select',
                'default' => 'black',
                'values' => [
                    'black',
                    'white',
                ],
                'affectsStyle' => true,
                'title' => $translate('Background color'),
                'description' => $translate('Color of the fullscreen gallery background.'),
            ],
            'galleryFullScreenImageNumbers' => [
                'format' => 'select',
                'default' => 'yes',
                'values' => [
                    'yes',
                    'no',
                ],
                'affectsStyle' => true,
                'title' => $translate('Image numbers'),
                'description' => $translate('Enables fullscreen gallery slide numbers.'),
            ],
            'galleryFullScreenCaptionAlign' => [
                'format' => 'select',
                'default' => 'left',
                'values' => [
                    'left',
                    'right',
                    'center',
                ],
                'affectsStyle' => true,
                'title' => $translate('Caption alignment'),
                'description' => $translate('Positioning of the image caption text.'),
            ],
            'group_gallery' => [
                'format' => false,
                'default' => false,
                'title' => $translate('Image gallery appearance:'),
            ],
            'gallerySlideshowAutoRewind' => [
                'format' => 'select',
                'default' => 'no',
                'values' => [
                    'yes',
                    'no',
                ],
                'affectsStyle' => true,
                'title' => $translate('Slideshow loop mode'),
            ],
            'gallerySlideNumberVisibilityDefault' => [
                'format' => 'select',
                'default' => 'yes',
                'values' => [
                    'yes',
                    'no',
                ],
                'affectsStyle' => true,
                'title' => $translate('Show slideshow image numbers'),
                'description' => $translate('Set the default state of image number visibility in slideshow galleries.'),
            ],
        ],

        'media' => [
            '_' => [
                'title' => $translate('Media'),
            ],
            'imagesSmallWidth' => [
                'format' => 'text',
                'default' => $images['small_width'],
                'allow_blank' => true,
                'validation' => 'positive_integer',
                'affectsStyle' => true,
                'title' => $translate('Small image width'),
                'description' => $translate('Maximum size of a small image (visible if \'Small images\' are switched on in the gallery editor). These settings don\'t affect original image.'),
            ],
            'imagesSmallHeight' => [
                'format' => 'text',
                'default' => $images['small_height'],
                'allow_blank' => true,
                'validation' => 'positive_integer',
                'affectsStyle' => true,
                'title' => $translate('Small image height'),
                'description' => '',
            ],
            'imagesMediumWidth' => [
                'format' => 'text',
                'default' => $images['medium_width'],
                'allow_blank' => true,
                'validation' => 'positive_integer',
                'affectsStyle' => true,
                'title' => $translate('Medium image width'),
                'description' => $translate('Maximum size of a medium image (visible if \'Medium images\' are switched on in the gallery editor). These settings don\'t affect original image.'),
            ],
            'imagesMediumHeight' => [
                'format' => 'text',
                'default' => $images['medium_height'],
                'validation' => 'positive_integer',
                'allow_blank' => true,
                'affectsStyle' => true,
                'title' => $translate('Medium image height'),
                'description' => '',
            ],
            'imagesLargeWidth' => [
                'format' => 'text',
                'default' => $images['large_width'],
                'allow_blank' => true,
                'css_units' => false,
                'validation' => 'positive_integer',
                'title' => $translate('Large image width'),
                'description' => $translate('Maximum size of a large image (visible if \'Large images\' are switched on in the gallery editor). These settings don\'t affect original image.'),
            ],
            'imagesLargeHeight' => [
                'format' => 'text',
                'default' => $images['large_height'],
                'allow_blank' => true,
                'css_units' => false,
                'affectsStyle' => true,
                'title' => $translate('Large image height'),
                'description' => '',
            ],
        ],

        'socialMediaLinks' => [
            '_' => ['title' => $translate('Social media buttons')],
            'links' => [
                'children' => [
                    'icon' => [
                        'format' => 'icon-readonly',
                        'default' => 'link',
                        'title' => $translate('Icon'),
                        'placeholder' => $translate('Icon'),
                        'description' => '',
                    ],
                    'url' => [
                        'format' => 'url',
                        'default' => '',
                        'title' => $translate('Link'),
                        'placeholder' => ('https://example.com'),
                        'description' => '',
                    ],
                ],
                'default' => [],
                'title' => $translate('Social media links'),
                'description' => '',
            ],
            'location' => [
                'format' => 'select',
                'allow_blank' => false,
                'default' => 'footer',
                'values' => [
                    'footer',
                    'additionalText',
                ],
                'affectsStyle' => true,
                'title' => $translate('Location'),
                'description' => $translate('Location of social media buttons. Content of additional text or additional footer will be replaced.'),
            ],
        ],

        'socialMediaButtons' => [
            '_' => [
                'title' => $translate('Custom social media buttons'),
            ],
            'socialMediaHTML' => [
                'format' => 'longtext',
                'allow_blank' => true,
                'default' => '',
                'html_entities' => true,
                'title' => $translate('HTML code'),
                'description' => $translate('Paste or write your HTML code here.'),
                'requires_feature' => 'custom_javascript',
            ],
            'socialMediaJS' => [
                'format' => 'longtext',
                'allow_blank' => true,
                'default' => '',
                'html_entities' => true,
                'title' => $translate('Javascript code'),
                'description' => $translate('Paste or write your Javascript code here.'),
                'requires_feature' => 'custom_javascript',
            ],
            'socialMediaLocation' => [
                'format' => 'select',
                'allow_blank' => false,
                'default' => 'footer',
                'values' => [
                    'footer',
                    'additionalText',
                ],
                'affectsStyle' => true,
                'title' => $translate('Location'),
                'description' => $translate('Location of social media buttons. Content of additional text or additional footer will be replaced.'),
            ],
        ],

        'banners' => [
            '_' => [
                'title' => $translate('Banners'),
            ],
            'banner1_image' => [
                'format' => 'image',
                'default' => '',
                'min_width' => 1,
                'min_height' => 1,
                'max_width' => 3000,
                'max_height' => 3000,
                'title' => $translate('Banner image') . ' (1)',
                'description' => '<span class="warning">' . $translate('banner_image_description') . '</span>',
            ],
            'banner1_link' => [
                'format' => 'url',
                'allow_blank' => true,
                'default' => null,
                'link' => true,
                'title' => $translate('Banner link') . ' (1)',
                'description' => $translate('banner_link_description'),
            ],
            'banner2_image' => [
                'format' => 'image',
                'default' => '',
                'min_width' => 1,
                'min_height' => 1,
                'max_width' => 3000,
                'max_height' => 3000,
                'title' => $translate('Banner image') . ' (2)',
                'description' => '',
            ],
            'banner2_link' => [
                'format' => 'url',
                'allow_blank' => true,
                'default' => null,
                'link' => true,
                'title' => $translate('Banner link') . ' (2)',
                'description' => '',
            ],
            'banner3_image' => [
                'format' => 'image',
                'default' => '',
                'min_width' => 1,
                'min_height' => 1,
                'max_width' => 3000,
                'max_height' => 3000,
                'title' => $translate('Banner image') . ' (3)',
                'description' => '',
            ],
            'banner3_link' => [
                'format' => 'url',
                'allow_blank' => true,
                'default' => null,
                'link' => true,
                'title' => $translate('Banner link') . ' (3)',
                'description' => '',
            ],
            'banner4_image' => [
                'format' => 'image',
                'default' => '',
                'min_width' => 1,
                'min_height' => 1,
                'max_width' => 3000,
                'max_height' => 3000,
                'title' => $translate('Banner image') . ' (4)',
                'description' => '',
            ],
            'banner4_link' => [
                'format' => 'url',
                'allow_blank' => true,
                'default' => null,
                'link' => true,
                'title' => $translate('Banner link') . ' (4)',
                'description' => '',
            ],
            'banner5_image' => [
                'format' => 'image',
                'default' => '',
                'min_width' => 1,
                'min_height' => 1,
                'max_width' => 3000,
                'max_height' => 3000,
                'title' => $translate('Banner image') . ' (5)',
                'description' => '',
            ],
            'banner5_link' => [
                'format' => 'url',
                'allow_blank' => true,
                'default' => null,
                'link' => true,
                'title' => $translate('Banner link') . ' (5)',
                'description' => '',
            ],
            'banner6_image' => [
                'format' => 'image',
                'default' => '',
                'min_width' => 1,
                'min_height' => 1,
                'max_width' => 3000,
                'max_height' => 3000,
                'title' => $translate('Banner image') . ' (6)',
                'description' => '',
            ],
            'banner6_link' => [
                'format' => 'url',
                'allow_blank' => true,
                'default' => null,
                'link' => true,
                'title' => $translate('Banner link') . ' (6)',
                'description' => '',
            ],
            'banner7_image' => [
                'format' => 'image',
                'default' => '',
                'min_width' => 1,
                'min_height' => 1,
                'max_width' => 3000,
                'max_height' => 3000,
                'title' => $translate('Banner image') . ' (7)',
                'description' => '',
            ],
            'banner7_link' => [
                'format' => 'url',
                'allow_blank' => true,
                'default' => null,
                'link' => true,
                'title' => $translate('Banner link') . ' (7)',
                'description' => '',
            ],
            'banner8_image' => [
                'format' => 'image',
                'default' => '',
                'min_width' => 1,
                'min_height' => 1,
                'max_width' => 3000,
                'max_height' => 3000,
                'title' => $translate('Banner image') . ' (8)',
                'description' => '',
            ],
            'banner8_link' => [
                'format' => 'url',
                'allow_blank' => true,
                'default' => null,
                'link' => true,
                'title' => $translate('Banner link') . ' (8)',
                'description' => '',
            ],
            'banner9_image' => [
                'format' => 'image',
                'default' => '',
                'min_width' => 1,
                'min_height' => 1,
                'max_width' => 3000,
                'max_height' => 3000,
                'title' => $translate('Banner image') . ' (9)',
                'description' => '',
            ],
            'banner9_link' => [
                'format' => 'url',
                'allow_blank' => true,
                'default' => null,
                'link' => true,
                'title' => $translate('Banner link') . ' (9)',
                'description' => '',
            ],
            'banner10_image' => [
                'format' => 'image',
                'default' => '',
                'min_width' => 1,
                'min_height' => 1,
                'max_width' => 3000,
                'max_height' => 3000,
                'title' => $translate('Banner image') . ' (10)',
                'description' => '',
            ],
            'banner10_link' => [
                'format' => 'url',
                'allow_blank' => true,
                'default' => null,
                'link' => true,
                'title' => $translate('Banner link') . ' (10)',
                'description' => '',
            ],
        ],

        'language' => [
            '_' => [
                'title' => $translate('Language'),
            ],
            'language' => [
                'format' => 'select',
                'allow_blank' => false,
                'default' => 'en',
                'values' => $languages,
                'title' => $translate('Interface language'),
                'description' => $translate('language_description'),
            ],
        ],

        'settings' => [
            '_' => [
                'title' => $translate('Other settings'),
            ],
            'googleAnalyticsId' => [
                'format' => 'text',
                'allow_blank' => true,
                'default' => '',
                'html_entities' => true,
                'title' => $translate('Google Analytics measurement ID'),
                'placeholder' => 'G-XXXXXXXXXX',
                'validator' => 'GoogleAnalytics',
                'description' => $translate('How to get the <a href="https://support.google.com/analytics/answer/12270356?hl=en" target="_blank">measurement ID</a>. Leave blank if Google Tag Manager container ID is filled.'),
            ],
            'googleTagManagerContainerId' => [
                'format' => 'text',
                'allow_blank' => true,
                'default' => '',
                'html_entities' => true,
                'title' => $translate('Google Tag Manager container ID'),
                'placeholder' => 'GTM-XXXXXX',
                'description' => $translate('How to get the <a href="https://support.google.com/tagmanager/answer/14847097?hl=en" target="_blank">container ID</a>. Leave blank if Google Analytics measurement ID is filled.'),
            ],
            'googleSiteVerification' => [
                'format' => 'text',
                'allow_blank' => true,
                'default' => '',
                'html_entities' => true,
                'title' => $translate('Google site verification tag'),
                'description' => $translate('Google ownership verification <meta> tag. <a href="http://support.google.com/a/bin/answer.py?hl=en&answer=186017" target="_blank">More info</a>.'),
                'requires_feature' => 'custom_javascript',
            ],
            'jsInclude' => [
                'format' => 'longtext',
                'allow_blank' => true,
                'default' => '',
                'html_entities' => true,
                'title' => $translate('Javascript include'),
                'description' => $translate('js_include_description'),
                'requires_feature' => 'custom_javascript',
            ],
        ],
    ];

    $shopSettingsPath = dirname(__DIR__) . '/_plugin_shop/inc.setting-definition.php';
    if ($isShopEnabled && is_file($shopSettingsPath)) {
        $settingsDefinition['shop'] = (require $shopSettingsPath)($translate);
    }

    // Berta hosting plans above the basic one can hide Berta's copyright
    if ($hostingPlan > 1) {
        $settingsDefinition['settings']['hideBertaCopyright'] = [
            'format' => 'select',
            'default' => 'no',
            'values' => ['yes', 'no'],
            'title' => $translate('Hide copyrights'),
            'description' => $translate('Hides Berta\'s copyrights'),
        ];
    }

    return $settingsDefinition;
};
