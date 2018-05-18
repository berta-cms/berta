<?php

namespace App\Sites\TemplateSettings;

use App\Shared\Storage;

/**
 * This class is a service that handles site template settings data for Berta CMS.
 * Settings are stored in `settings.[template].xml` file for the corresponding site.
 *
 * The root site has its settings stored in `storage/settings.[template].xml`,
 * any other site has it's settings in `storage/-sites/[site name]/settings.[template].xml`
 *
 * @example: berta/sample-data/settings.[template-name].xml
 * @example an example of XML file:
 * <?xml version="1.0" encoding="utf-8"?>
 * <settings>
 *  <generalFontSettings>
 *    <fontFamily><![CDATA[Helvetica, Arial, sans-serif]]></fontFamily>
 *  </generalFontSettings>
 *  <background>
 *    <backgroundColor><![CDATA[#edcaca]]></backgroundColor>
 *  </background>
 *  <pageLayout>
 *    <centered><![CDATA[no]]></centered>
 *    <paddingTop><![CDATA[31px]]></paddingTop>
 *    <paddingLeft><![CDATA[31px]]></paddingLeft>
 *  </pageLayout>
 *  <heading>
 *    <position><![CDATA[absolute]]></position>
 *    <color><![CDATA[#ff0000]]></color>
 *    <fontFamily><![CDATA[Arial, sans-serif]]></fontFamily>
 *  </heading>
 *  <pageHeading>
 *    <color><![CDATA[#f5c9c9]]></color>
 *    <fontFamily><![CDATA[Helvetica, Arial, sans-serif]]></fontFamily>
 *  </pageHeading>
 *  <menu>
 *    <position><![CDATA[absolute]]></position>
 *    <fontVariant><![CDATA[normal]]></fontVariant>
 *  </menu>
 *  <links>
 *    <colorHover><![CDATA[#737373]]></colorHover>
 *  </links>
 *  <css>
 *    <customCSS><![CDATA[.example {<br />color: red;<br />}]]></customCSS>
 *  </css>
 * </settings>
 *
 */
class SiteTemplateSettingsDataService extends Storage
{
    public static $JSON_SCHEMA = [
        '$schema' => "http://json-schema.org/draft-06/schema#",
        'type' => 'object',
        'properties' => [
            'background' => [
                'type' => 'object',
                'properties' => [
                    'backgroundAttachment' => ['type' => 'string'],
                    'backgroundColor' => ['type' => 'string', 'format' => 'color'],
                    'backgroundImage_height' => ['type' => 'integer', 'minimum' => 0],
                    'backgroundImage_width' => ['type' => 'integer', 'minimum' => 0],
                    'backgroundImage' => ['type' => 'string'],
                    'backgroundImageEnabled' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'backgroundPosition' => ['type' => 'string'],
                    'backgroundRepeat' => ['type' => 'string']
                ]
            ],
            'css' => [
                'type' => 'object',
                'properties' => [
                    'customCSS' => ['type' => 'string']
                ]
            ],
            'entryFooter' => [
                'type' => 'object',
                'properties' => [
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['type' => 'string'],
                    'fontSize' => ['type' => 'string', 'format' => 'css-unit'],
                    'fontStyle' => ['type' => 'string', 'enum' => ['normal', 'italic', 'oblique']],
                    'fontVariant' => ['type' => 'string', 'enum' => [
                            'small-caps', 'common-ligatures small-caps', 'inherit', 'initial', 'unset'
                        ]
                    ],
                    'fontWeight' => ['type' => 'string'],  // Possibly add font-weight type definition
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['type' => 'string', 'format' => 'css-unit'],
                ]
            ],
            'entryHeading' => [
                'type' => 'object',
                'properties' => [
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['type' => 'string'],
                    'fontSize' => ['type' => 'string', 'format' => 'css-unit'],
                    'fontStyle' => ['type' => 'string', 'enum' => ['normal', 'italic', 'oblique']],
                    'fontVariant' => ['type' => 'string', 'enum' => [
                            'small-caps', 'common-ligatures small-caps', 'inherit', 'initial', 'unset'
                        ]
                    ],
                    'fontWeight' => ['type' => 'string'],  // Possibly add font-weight type definition
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['type' => 'string', 'format' => 'css-unit'],
                    'margin' => ['type' => 'string'],
                ]
            ],
            'entryLayout' => [
                'type' => 'object',
                'properties' => [
                    'contentWidth' => ['type' => 'string', 'format' => 'css-unit'],
                    'defaultGalleryType' => ['type' => 'string'],
                    'displayTags' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'galleryMargin' => ['type' => 'string'],
                    'galleryNavMargin' => ['type' => 'string'],
                    'galleryPosition' => ['type' => 'string'],
                    'margin' => ['type' => 'string'],
                    'spaceBetween' => ['type' => 'string', 'format' => 'css-unit'],
                    'spaceBetweenImages' => ['type' => 'string', 'format' => 'css-unit']
                ]
            ],
            'firstPage' => [
                'type' => 'object',
                'properties' => [
                    'hoverWiggle' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'imageHaveShadows' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'imageSizeRatio' => ['type' => 'number']
                ]
            ],
            'generalFontSettings' => [
                'type' => 'object',
                'properties' => [
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['type' => 'string'],
                    'fontSize' => ['type' => 'string', 'format' => 'css-unit-value'],
                    'fontStyle' => [
                        'type' => 'string', 'enum' => [  // https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
                            'normal', 'italic', 'oblique'
                        ]
                    ],
                    'fontVariant' => [
                        'type' => 'string', 'enum' => [  // https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant
                            'small-caps', 'common-ligatures small-caps', 'inherit', 'initial', 'unset'
                        ]
                    ],
                    'fontWeight' => [
                        'type' => 'string', 'enum' => [  // https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
                            'normal', 'bold', 'bolder', 'light', 'lighter', '100', '200', '300', '400', '500', '600',
                            '700', '800', '900', 'inherit', 'initial', 'unset'
                        ]
                    ],
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['type' => 'string', 'format' => 'css-unit']
                ]
            ],
            'grid' => [
                'type' => 'object',
                'properties' => [
                    'contentWidth' => ['type' => 'string', 'format' => 'css-unit']
                ]
            ],
            'heading' => [
                'type' => 'object',
                'properties' => [
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['type' => 'string'],
                    'fontSize' => ['type' => 'string', 'format' => 'css-unit'],
                    'fontStyle' => ['type' => 'string', 'enum' => ['normal', 'italic', 'oblique']],
                    'fontVariant' => ['type' => 'string', 'enum' => [
                            'small-caps', 'common-ligatures small-caps', 'inherit', 'initial', 'unset'
                        ]
                    ],
                    'fontWeight' => ['type' => 'string'],  // Possibly add font-weight type definition
                    'googleFont' => ['type' => 'string'],
                    'image_height' => ['type' => 'integer', 'minimum' => 0],
                    'image_width' => ['type' => 'integer', 'minimum' => 0],
                    'image' => ['type' => 'string'],
                    'lineHeight' => ['type' => 'string', 'format' => 'css-unit'],
                    'position' => [
                        'type' => 'string',
                        'enum' => ['static', 'relative', 'absolute', 'fixed', 'sticky']
                    ]
                ]
            ],
            'links' => [
                'type' => 'object',
                'properties' => [
                    'colorLink' => ['type' => 'string', 'format' => 'color'],
                    'colorVisited' => ['type' => 'string', 'format' => 'color'],
                    'colorHover' => ['type' => 'string', 'format' => 'color'],
                    'colorActive' => ['type' => 'string', 'format' => 'color'],
                    'textDecorationLink' => ['type' => 'string'],
                    'textDecorationVisited' => ['type' => 'string'],
                    'textDecorationHover' => ['type' => 'string'],
                    'textDecorationActive' => ['type' => 'string']
                ]
            ],
            'menu' => [
                'type' => 'object',
                'properties' => [
                    'colorActive' => ['type' => 'string', 'format' => 'color'],
                    'colorHover' => ['type' => 'string', 'format' => 'color'],
                    'colorLink' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['type' => 'string'],
                    'fontSize' => ['type' => 'string', 'format' => 'css-unit'],
                    'fontStyle' => ['type' => 'string', 'enum' => ['normal', 'italic', 'oblique']],
                    'fontVariant' => ['type' => 'string', 'enum' => [
                            'small-caps', 'common-ligatures small-caps', 'inherit', 'initial', 'unset'
                        ]
                    ],
                    'fontWeight' => ['type' => 'string'],  // Possibly add font-weight type definition
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['type' => 'string', 'format' => 'css-unit'],
                    'margin' => ['type' => 'string'],
                    'position' => ['type' => 'string'],
                    'separator' => ['type' => 'string'],
                    'separatorDistance' => ['type' => 'string', 'format' => 'css-unit'],
                    'textDecorationActive' => ['type' => 'string'],
                    'textDecorationHover' => ['type' => 'string'],
                    'textDecorationLink' => ['type' => 'string']
                ]
            ],
            'pageHeading' => [
                'type' => 'object',
                'properties' => [
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['type' => 'string'],
                    'fontSize' => ['type' => 'string', 'format' => 'css-unit'],
                    'fontStyle' => ['type' => 'string', 'enum' => ['normal', 'italic', 'oblique']],
                    'fontVariant' => ['type' => 'string', 'enum' => [
                            'small-caps', 'common-ligatures small-caps', 'inherit', 'initial', 'unset'
                        ]
                    ],
                    'fontWeight' => ['type' => 'string'],  // Possibly add font-weight type definition
                    'googleFont' => ['type' => 'string'],
                    'image' => ['type' => 'string'],
                    'image_height' => ['type' => 'integer'],
                    'image_width' => ['type' => 'integer'],
                    'lineHeight' => ['type' => 'string'],
                    'margin' => ['type' => 'string', 'format' => 'css-unit'],
                    'marginBottom' => ['type' => 'string'],
                    'marginTop' => ['type' => 'string']
                ]
            ],
            'pageLayout' => [
                'type' => 'object',
                'properties' => [
                    'bgButtonType' => ['type' => 'string'],
                    'bodyMargin' => ['type' => 'string'],
                    'centered' => ['type' => 'string'],
                    'centeredContents' => ['type' => 'string'],
                    'centeredWidth' => ['type' => 'string', 'format' => 'css-unit'],
                    'centeringGuidesColor' => ['type' => 'string'],
                    'contentAlign' => ['type' => 'string'],
                    'contentPosition' => ['type' => 'string'],
                    'contentWidth' => ['type' => 'string', 'format' => 'css-unit'],
                    'headingMargin' => ['type' => 'string'],
                    'leftColumnWidth' => ['type' => 'string', 'format' => 'css-unit'],
                    'mashUpColumns' => ['type' => 'integer', 'minimum' => 0],
                    'menuMargin' => ['type' => 'string'],
                    'paddingLeft' => ['type' => 'string', 'format' => 'css-unit'],
                    'paddingTop' => ['type' => 'string', 'format' => 'css-unit'],
                    'responsive' => ['type' => 'string'],
                    'siteMenuMargin' => ['type' => 'string', 'format' => 'css-unit']
                ]
            ],
            'sideBar' => [
                'type' => 'object',
                    'properties' => [
                    'backgroundColor' => ['type' => 'string', 'format' => 'color'],
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['type' => 'string'],
                    'fontSize' => ['type' => 'string', 'format' => 'css-unit'],
                    'fontStyle' => ['type' => 'string', 'enum' => ['normal', 'italic', 'oblique']],
                    'fontVariant' => ['type' => 'string', 'enum' => [
                            'small-caps', 'common-ligatures small-caps', 'inherit', 'initial', 'unset'
                        ]
                    ],
                    'fontWeight' => ['type' => 'string'],  // Possibly add font-weight type definition
                    'googleFont' => ['type' => 'string'],
                    'image' => ['type' => 'string'],
                    'image_height' => ['type' => 'integer'],
                    'image_width' => ['type' => 'integer'],
                    'lineHeight' => ['type' => 'string', 'format' => 'css-unit'],
                    'marginBottom' => ['type' => 'string', 'format' => 'css-unit'],
                    'marginLeft' => ['type' => 'string', 'format' => 'css-unit'],
                    'marginTop' => ['type' => 'string', 'format' => 'css-unit'],
                    'transparent' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'width' => ['type' => 'string', 'format' => 'css-unit']
                ]
            ],
            'subMenu' => [
                'type' => 'object',
                'properties' => [
                    'fontFamily' => ['type' => 'string'],
                    'fontSize' => ['type' => 'string', 'format' => 'css-unit'],
                    'fontStyle' => ['type' => 'string', 'enum' => ['normal', 'italic', 'oblique']],
                    'fontVariant' => ['type' => 'string', 'enum' => [
                            'small-caps', 'common-ligatures small-caps', 'inherit', 'initial', 'unset'
                        ]
                    ],
                    'fontWeight' => ['type' => 'string'],  // Possibly add font-weight type definition
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['type' => 'string', 'format' => 'css-unit'],
                    'margin' => ['type' => 'string'],
                    'separator' => ['type' => 'string'],
                    'separatorDistance' => ['type' => 'string', 'format' => 'css-unit']
                ]
            ],
            'tagsMenu' => [
                'type' => 'object',
                'properties' => [
                    'fontFamily' => ['type' => 'string'],
                    'googleFont' => ['type' => 'string'],
                    'fontSize' => ['type' => 'string', 'format' => 'css-unit'],
                    'fontWeight' => ['type' => 'string'],  // Possibly add font-weight type definition
                    'fontStyle' => ['type' => 'string', 'enum' => ['normal', 'italic', 'oblique']],
                    'lineHeight' => ['type' => 'string', 'format' => 'css-unit'],
                    'colorLink' => ['type' => 'string', 'format' => 'color'],
                    'colorHover' => ['type' => 'string', 'format' => 'color'],
                    'colorActive' => ['type' => 'string', 'format' => 'color'],
                    'textDecorationLink' => ['type' => 'string'],
                    'textDecorationHover' => ['type' => 'string'],
                    'textDecorationActive' => ['type' => 'string'],
                    'x' => ['type' => 'integer'],
                    'y' => ['type' => 'integer'],
                    'alwaysOpen' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'hidden' => ['type' => 'string', 'enum' => ['yes', 'no']]
                ]
            ]
        ]
    ];
    protected static $DEFAULT_VALUES = [];
    private $ROOT_ELEMENT = 'settings';
    private $TEMPLATE;
    private $XML_FILE;

    public function __construct($site = '', $template = '')
    {
        parent::__construct($site);
        $xml_root = $this->getSiteXmlRoot($site);
        $this->TEMPLATE = explode('-', $template)[0];
        $this->XML_FILE = $xml_root . '/settings.' . $this->TEMPLATE . '.xml';
    }

    public function get()
    {
        $template_settings = $this->xmlFile2array($this->XML_FILE);

        return $template_settings;
    }

    /**
     * Saves a value with a given path and saves the change to XML file
     *
     * @param string $path Slash delimited path to the value
     * @param mixed $value Value to be saved
     * @return array Array of changed value and/or error messages
     */
    public function saveValueByPath($path, $value)
    {
        $site_template_settings = $this->get();
        $path_arr = array_slice(explode('/', $path), 3);
        $value = trim(urldecode($value));

        $ret = array(
            'site' => $this->SITE == '0' ? '' : $this->SITE,
            'path' => $path,
            'value' => $value,
        );

        $this->setValueByPath(
            $site_template_settings,
            implode('/', $path_arr),
            $value
        );

        $this->array2xmlFile($site_template_settings, $this->XML_FILE, $this->ROOT_ELEMENT);

        return $ret;
    }
}
