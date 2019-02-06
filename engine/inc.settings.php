<?php

$options['default_language'] = 'en';
$options['languages'] = [
    'en' => 'English',
    'lv' => 'Latviešu',
    'fr' => 'Français',
    'ru' => 'Русский',
    'nl' => 'Nederlands',
    'pl' => 'Polski',
    'es' => 'Spanish',
];
$options['images'] = isset($options['images']) ? $options['images'] : [];
$options['images'] = array_merge($options['images'], [
    'small_width' => 200,
    'small_height' => 200,
    'medium_width' => 400,
    'medium_height' => 400,
    'large_width' => 600,
    'large_height' => 600,
]);

$settingsFontSelectGeneral = [
    '"Helvetica Neue", Helvetica, Arial, sans-serif' => 'Helvetica Neue, Helvetica, Arial, sans-serif',
    'Helvetica, Arial, sans-serif' => 'Helvetica, Arial, sans-serif',
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

$settingsFontSelect = array_merge(['inherit' => '(inherit from general-font-settings)'], $settingsFontSelectGeneral);

$settingsDefinition = [
    'berta' => [
        '_' => ['invisible' => true],
        'installed' => ['format' => 'text', 'allow_blank' => true, 'default' => null, 'title' => '', 'description' => ''],
    ],

    // siteTexts block is NOT editable in the settings page. It is reserved for texts appearing only on the page
    'siteTexts' => [
        '_' => ['title' => I18n::_('Texts in the website'), 'invisible' => true],
        'siteHeading' => ['format' => 'text', 'allow_blank' => true, 'default' => null, 'title' => I18n::_('Site heading'), 'description' => ''],
    ],

    'template' => [
        '_' => ['title' => I18n::_('Template')],
        'template' => ['format' => 'select', 'values' => 'templates', 'allow_blank' => false, 'default' => false, 'title' => I18n::_('Template'), 'description' => I18n::_('Templates are like skins or themes for your site. You can choose one template from the ones installed in your templates folder. To add a new template to this list, upload it to the templates folder via FTP.')],
    ],

    'texts' => [
        '_' => ['title' => I18n::_('Texts')],
        'ownerName' => ['format' => 'text', 'allow_blank' => true, 'default' => null, 'title' => I18n::_('Your name'), 'description' => I18n::_('Your name will be put in a meta-tag in the code of your site. You can choose any name ;)')],
        'pageTitle' => ['format' => 'text', 'allow_blank' => true, 'default' => 'berta', 'title' => I18n::_('Page title (title bar)'), 'description' => I18n::_('Text that appears in the bowser title bar')],
        'metaDescription' => ['format' => 'text', 'allow_blank' => true, 'default' => 'Personal portfolio built with Berta', 'title' => I18n::_('<META> description'), 'description' => I18n::_('Short site description. It should not be longer than one or two sentences.')],
        'metaKeywords' => ['format' => 'text', 'allow_blank' => true, 'default' => 'berta', 'title' => I18n::_('<META> keywords'), 'description' => I18n::_('Keywords visible only to search engines. Keywords along with the description can improve your site ranking in search results.')],
    ],

    'navigation' => [
        '_' => ['title' => I18n::_('Navigation')],
        'landingSectionVisible' => ['format' => 'select', 'default' => 'yes', 'values' => ['yes', 'no'], 'title' => I18n::_('Is first section visible in menu?'), 'description' => I18n::_('Choose "no" to hide the first section in the main menu. Link from the page title (or header image) will lead to it. NOTE: This setting has no effect, if the section has a submenu; then it is visible at all times.')],
        'landingSectionPageHeadingVisible' => ['format' => 'select', 'default' => 'yes', 'values' => ['yes', 'no'], 'title' => I18n::_('Show page heading in first section?'), 'description' => I18n::_('Choose "no" to hide page heading in first section.')],
        'landingSectionMenuVisible' => ['format' => 'select', 'default' => 'yes', 'values' => ['yes', 'no'], 'title' => I18n::_('Show menu in first section?'), 'description' => I18n::_('Choose "no" to hide the menu in first section.')],
        'alwaysSelectTag' => ['format' => 'select', 'default' => 'yes', 'values' => ['yes', 'no'], 'title' => I18n::_('Always auto-select a submenu item?'), 'description' => I18n::_('Choose "yes" to automatically select the first submenu item when clicking on a menu item. This works only when there is a submenu.')],
    ],

    'pageLayout' => [
        '_' => ['title' => I18n::_('Page layout')],
        'favicon' => ['format' => 'icon', 'default' => '', 'title' => I18n::_('Favicon'), 'description' => I18n::_('Small picture to display in the address bar of the browser. The file must be in .ICO format and 16x16 pixels big.')],
        'gridStep' => ['format' => 'text', 'default' => 10, 'title' => I18n::_('Grid step'), 'description' => I18n::_('Distance in pixels for snap-to-grid dragging.')],
        'showGrid' => ['format' => 'select', 'default' => 'no', 'values' => ['yes', 'no'], 'title' => I18n::_('Show gridlines'), 'description' => I18n::_('Choose "yes" to show gridlines in background. Available only in Messy template.')],
        'gridColor' => ['format' => 'select', 'default' => 'black', 'values' => ['black', 'white'], 'title' => I18n::_('Gridlines color'), 'description' => ''],
    ],

    'media' => [
        '_' => ['title' => I18n::_('Media')],
        'imagesSmallWidth' => ['format' => 'text', 'default' => $options['images']['small_width'], 'css_units' => false, 'title' => I18n::_('Small image width'), 'description' => I18n::_('Maximum size of a small image (visible if \'Small images\' are switched on in the gallery editor). These settings don\'t affect original image.')],
        'imagesSmallHeight' => ['format' => 'text', 'default' => $options['images']['small_height'], 'css_units' => false, 'title' => I18n::_('Small image height'), 'description' => ''],
        'imagesMediumWidth' => ['format' => 'text', 'default' => $options['images']['medium_width'], 'css_units' => false, 'title' => I18n::_('Medium image width'), 'description' => I18n::_('Maximum size of a medium image (visible if \'Medium images\' are switched on in the gallery editor). These settings don\'t affect original image.')],
        'imagesMediumHeight' => ['format' => 'text', 'default' => $options['images']['medium_height'], 'css_units' => false, 'title' => I18n::_('Medium image height'), 'description' => ''],
        'imagesLargeWidth' => ['format' => 'text', 'default' => $options['images']['large_width'], 'css_units' => false, 'title' => I18n::_('Large image width'), 'description' => I18n::_('Maximum size of a large image (visible if \'Large images\' are switched on in the gallery editor). These settings don\'t affect original image.')],
        'imagesLargeHeight' => ['format' => 'text', 'default' => $options['images']['large_height'], 'css_units' => false, 'title' => I18n::_('Large image height'), 'description' => ''],
    ],

    'entryLayout' => [
        '_' => ['title' => I18n::_('Entry layout')],
        'group_lightbox' => ['format' => false, 'default' => false, 'title' => I18n::_('Lightbox settings:')],
        'galleryFullScreenDefault' => ['format' => 'select', 'default' => 'yes', 'values' => ['yes', 'no'], 'title' => I18n::_('Is enabled by default'), 'description' => I18n::_('Enables Lightbox mode for new entries.')],
        'galleryFullScreenBackground' => ['format' => 'select', 'default' => 'black', 'values' => ['black', 'white', 'none'], 'title' => I18n::_('Background color'), 'description' => I18n::_('Color of the Lightbox background layer.')],
        'galleryFullScreenFrame' => ['format' => 'select', 'default' => 'no', 'values' => ['yes', 'no'], 'title' => I18n::_('Image frame'), 'description' => I18n::_('Enables/Disables a frame around image.')],
        'galleryFullScreenCloseText' => ['format' => 'text', 'allow_blank' => true, 'default' => 'x', 'title' => I18n::_('Close button'), 'description' => I18n::_('&quot;Close&quot; symbol. You can enter your own.')],
        'galleryFullScreenImageNumbers' => ['format' => 'select', 'default' => 'yes', 'values' => ['yes', 'no'], 'title' => I18n::_('Image numbers'), 'description' => I18n::_('Enables/disables numbers below the image.')],
        'galleryFullScreenCaptionAlign' => ['format' => 'select', 'default' => 'left', 'values' => ['left', 'right', 'center'], 'title' => I18n::_('Caption alignment'), 'description' => I18n::_('Positioning of the image caption text.')],
        'group_gallery' => ['format' => false, 'default' => false, 'title' => I18n::_('Image gallery appearance:')],
        'gallerySlideshowAutoRewind' => ['format' => 'select', 'default' => 'no', 'values' => ['yes', 'no'], 'title' => I18n::_('Auto-rewind gallery slideshow'), 'description' => I18n::_('Display the first image after clicking on the last image in galleries that are in slideshow mode.')],
        'gallerySlideNumberVisibilityDefault' => ['format' => 'select', 'default' => 'yes', 'values' => ['yes', 'no'], 'title' => I18n::_('Show slideshow image numbers'), 'description' => I18n::_('Set the default state of image number visibility in slideshow galleries.')],
    ],

    'banners' => [
        '_' => ['title' => I18n::_('Banners')],
        'banner1_image' => ['format' => 'image', 'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 'title' => I18n::_('Banner image') . ' (1)', 'description' => '<span class="warning">' . I18n::_('description_banner') . '</span>'],
        'banner1_link' => ['format' => 'text', 'allow_blank' => true, 'default' => null, 'link' => true, 'title' => I18n::_('Banner link') . ' (1)', 'description' => I18n::_('description_banner_link')],
        'banner2_image' => ['format' => 'image', 'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 'title' => I18n::_('Banner image') . ' (2)', 'description' => ''],
        'banner2_link' => ['format' => 'text', 'allow_blank' => true, 'default' => null, 'link' => true, 'title' => I18n::_('Banner link') . ' (2)', 'description' => ''],
        'banner3_image' => ['format' => 'image', 'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 'title' => I18n::_('Banner image') . ' (3)', 'description' => ''],
        'banner3_link' => ['format' => 'text', 'allow_blank' => true, 'default' => null, 'link' => true, 'title' => I18n::_('Banner link') . ' (3)', 'description' => ''],
        'banner4_image' => ['format' => 'image', 'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 'title' => I18n::_('Banner image') . ' (4)', 'description' => ''],
        'banner4_link' => ['format' => 'text', 'allow_blank' => true, 'default' => null, 'link' => true, 'title' => I18n::_('Banner link') . ' (4)', 'description' => ''],
        'banner5_image' => ['format' => 'image', 'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 'title' => I18n::_('Banner image') . ' (5)', 'description' => ''],
        'banner5_link' => ['format' => 'text', 'allow_blank' => true, 'default' => null, 'link' => true, 'title' => I18n::_('Banner link') . ' (5)', 'description' => ''],
        'banner6_image' => ['format' => 'image', 'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 'title' => I18n::_('Banner image') . ' (6)', 'description' => ''],
        'banner6_link' => ['format' => 'text', 'allow_blank' => true, 'default' => null, 'link' => true, 'title' => I18n::_('Banner link') . ' (6)', 'description' => ''],
        'banner7_image' => ['format' => 'image', 'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 'title' => I18n::_('Banner image') . ' (7)', 'description' => ''],
        'banner7_link' => ['format' => 'text', 'allow_blank' => true, 'default' => null, 'link' => true, 'title' => I18n::_('Banner link') . ' (7)', 'description' => ''],
        'banner8_image' => ['format' => 'image', 'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 'title' => I18n::_('Banner image') . ' (8)', 'description' => ''],
        'banner8_link' => ['format' => 'text', 'allow_blank' => true, 'default' => null, 'link' => true, 'title' => I18n::_('Banner link') . ' (8)', 'description' => ''],
        'banner9_image' => ['format' => 'image', 'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 'title' => I18n::_('Banner image') . ' (9)', 'description' => ''],
        'banner9_link' => ['format' => 'text', 'allow_blank' => true, 'default' => null, 'link' => true, 'title' => I18n::_('Banner link') . ' (9)', 'description' => ''],
        'banner10_image' => ['format' => 'image', 'default' => '', 'min_width' => 1, 'min_height' => 1, 'max_width' => 3000, 'max_height' => 3000, 'title' => I18n::_('Banner image') . ' (10)', 'description' => ''],
        'banner10_link' => ['format' => 'text', 'allow_blank' => true, 'default' => null, 'link' => true, 'title' => I18n::_('Banner link') . ' (10)', 'description' => ''],
    ],

    'socialMediaLinks' => [
        '_' => ['title' => I18n::_('Social media buttons')],
        'links' => [
            'children' => [
                'url' => [
                    'format' => 'text',
                    'default' => '',
                    'title' => I18n::_('Link'),
                    'placeholder' => I18n::_('Link'),
                    'description' => ''
                ],
                'icon' => [
                    'format' => 'icon-readonly',
                    'default' => 'link',
                    'title' => I18n::_('Icon'),
                    'placeholder' => I18n::_('Icon'),
                    'description' => ''
                ]
            ],
            'default' => [],
            'title' => I18n::_('Social media links'),
            'description' => ''
        ],
        'location' => [
            'format' => 'select',
            'allow_blank' => false,
            'default' => 'footer',
            'values' => [
                'footer',
                'additionalText'
            ],
            'title' => I18n::_('Location'),
            'description' => I18n::_('Location of social media buttons. Content of additional text or additional footer will be replaced.')
        ],
    ],

    'socialMediaButtons' => [
        '_' => ['title' => I18n::_('Custom social media buttons')],
        'socialMediaHTML' => ['format' => 'longtext', 'allow_blank' => true, 'default' => '', 'html_entities' => true, 'title' => I18n::_('HTML code'), 'description' => I18n::_('Paste or write your HTML code here.')],
        'socialMediaJS' => ['format' => 'longtext', 'allow_blank' => true, 'default' => '', 'html_entities' => true, 'title' => I18n::_('Javascript code'), 'description' => I18n::_('Paste or write your Javascript code here.')],
        'socialMediaLocation' => ['format' => 'select', 'allow_blank' => false, 'default' => 'footer', 'values' => ['footer', 'additionalText'], 'title' => I18n::_('Location'), 'description' => I18n::_('Location of social media buttons. Content of additional text or additional footer will be replaced.')],
    ],

    'language' => [
        '_' => ['title' => I18n::_('Language')],
        'language' => ['format' => 'select', 'allow_blank' => false, 'default' => $options['default_language'], 'values' => $options['languages'], 'title' => I18n::_('Interface language'), 'description' => I18n::_('description_language')],
    ],

    'settings' => [
        '_' => ['title' => I18n::_('Other settings')],
        'googleAnalyticsId' => ['format' => 'text', 'allow_blank' => true, 'default' => '', 'html_entities' => true, 'title' => I18n::_('Google Analytics ID'), 'validator' => 'GoogleAnalytics', 'description' => I18n::_('The ID of the <a href="http://google.com/analytics" target="_blank">Google Analytics</a> site profile. To obtain an ID, register in <a href="http://google.com/analytics" target="_blank">Google Analytics</a> and create a profile for your site.')],
        'googleSiteVerification' => ['format' => 'text', 'allow_blank' => true, 'default' => '', 'html_entities' => true, 'title' => I18n::_('Google site verification tag'), 'description' => I18n::_('Google ownership verification <meta> tag. <a href="http://support.google.com/a/bin/answer.py?hl=en&answer=186017" target="_blank">More info</a>.')],
        'flashUploadEnabled' => ['format' => 'select', 'allow_blank' => false, 'default' => 'yes', 'values' => ['yes', 'no'], 'title' => I18n::_('Advanced file uploading enabled'), 'description' => I18n::_('Set if the advanced uploading features (selecting multiple files at once, asynchronous uploading) are enabled. You should not disable them UNLESS you are experiencing problems with file uploads.')],
        'showTutorialVideos' => ['format' => 'select', 'default' => 'yes', 'values' => ['yes', 'no'], 'title' => I18n::_('Show videos on startup'), 'description' => I18n::_('Show or hide Berta\'s tutorial videos on startup. To view the videos, set this to \'Yes\' and they will appear next time you log in.')],
        'jsInclude' => ['format' => 'longtext', 'allow_blank' => true, 'default' => '', 'html_entities' => true, 'title' => I18n::_('Javascript include'), 'description' => I18n::_('javascript_include')],
    ],
];

if (@file_exists($SITE_ROOT_PATH . '_plugin_shop/inc.settings.php')) {
    include $SITE_ROOT_PATH . '_plugin_shop/inc.settings.php';
}

//special settings for hosted sites (nothing special)
if (@file_exists($ENGINE_ROOT_PATH . 'plan')) {
    $hostingPlan = file_get_contents($ENGINE_ROOT_PATH . 'plan');

    //settings for PRO and SHOP hosting plans
    if ($hostingPlan > 1) {
        $settingsDefinition['settings']['hideBertaCopyright'] = ['format' => 'select', 'default' => 'no', 'values' => ['yes', 'no'], 'title' => I18n::_('Hide copyrights'), 'description' => I18n::_('Hides Berta\'s copyrights')];
    }
    $options['HOSTING_PLAN'] = $hostingPlan;
} else {
    $options['HOSTING_PLAN'] = null;
}

//disable multisites for basic plan
if ((isset($hostingPlan) && $hostingPlan == 1) || (isset($options['HOSTING_PROFILE']) && !$options['HOSTING_PROFILE'])) {
    $options['MULTISITES'] = [];
    $options['MULTISITE'] = '';
    $options['MULTISITE_DISABLED'] = true;
} else {
    $options['MULTISITE_DISABLED'] = false;
}
