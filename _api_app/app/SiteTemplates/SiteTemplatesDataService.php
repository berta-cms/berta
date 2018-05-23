<?php

namespace App\SiteTemplates;

use App\Shared\I18n;

/**
 * @class SiteTemplatesDataService
 *
 * This class provides templates from which Berta sites are built. Templates are readonly data structures
 * representing \App\Site\SiteTemplateSettings. SiteTemplateSettings for any specific site are generated according
 * to it's template.
 *
 * Template configurations can be found at `berta/_templates/[template name]/template.conf.php`.
 * @todo: Templates should be moved to this folder.
 * @todo: Template settings should be moved to XML so we have everything in a standardized way.
 */
class SiteTemplatesDataService
{
    /** @todo update schema to reflect input types etc. */
    public static $JSON_SCHEMA = [
        '$schema' => 'http://json-schema.org/draft-06/schema#',
        'type' => 'object',
        'properties' => [
            'background' => [
                'type' => 'object',
                'properties' => [
                    '_' => [
                        'type' => 'object',
                        'properties' => [
                            'title' => ['type' => 'string']
                        ]
                    ],
                    'backgroundAttachment' => [
                        'type' => 'object',
                        'properties' => [
                            'format' => ['type' => 'string'],
                            'value' => [
                                'type' => 'object',
                                'additionalProperties' => ['type' => 'string']
                            ],  /** @todo maybe add the properties */
                            'default' => ['type' => 'string'],
                            'title' => ['type' => 'string'],
                            'description' => ['type' => 'string']
                        ],
                    ],
                    'backgroundColor' => [
                        'type' => 'object',
                        'properties' => [
                            'format' => ['type' => 'string'],
                            'default' => ['type' => 'string', 'format' => 'color'],
                            'title' => ['type' => 'string'],
                            'description' => ''
                        ]
                    ],
                    'backgroundImage' => [
                        'type' => 'object',
                        'properties' => [
                            'format' => ['type' => 'string'],
                            'default' => ['type' => 'string'],
                            'min_width' => ['type' => 'number'],
                            'min_height' => ['type' => 'number'],
                            'max_width' => ['type' => 'number'],
                            'max_height' => ['type' => 'number'],
                            'title' => ['type' => 'string'],
                            'description' => ['type' => 'string']
                        ]
                    ],
                    'backgroundImageEnabled' => [
                        'type' => 'object',
                        'properties' => [
                            'format' => ['type' => 'string'],
                            'values' => [
                                'type' => 'array',
                                'items' => ['type' => 'string']
                            ],
                            'default' => ['type' => 'string'],
                            'title' => ['type' => 'string'],
                            'description' => ['type' => 'string']
                        ]
                    ],
                    'backgroundPosition' => [
                        'type' => 'object',
                        'properties' => [
                            'format' => ['type' => 'string'],
                            'values' => [
                                'type' => 'array',
                                'items' => ['type' => 'string']
                            ],
                            'default' => ['type' => 'string'],
                            'title' => ['type' => 'string'],
                            'description' => ['type' => 'string']
                        ]
                    ],
                    'backgroundRepeat' => [
                        'type' => 'object',
                        'properties' => [
                            'format' => ['type' => 'string'],
                            'values' => [
                                'type' => 'object',
                                'additionalProperties' => ['type' => 'string']
                            ],
                            'default' => ['type' => 'string'],
                            'title' => ['type' => 'string'],
                            'description' => ['type' => 'string']
                        ]
                    ]
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
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                ]
            ],
            'entryHeading' => [
                'type' => 'object',
                'properties' => [
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                    'margin' => ['$ref' => '#/definitions/cssUnit.df'],
                ]
            ],
            'entryLayout' => [
                'type' => 'object',
                'properties' => [
                    'contentWidth' => ['$ref' => '#/definitions/cssUnit.df'],
                    'defaultGalleryType' => ['type' => 'string', 'enum' => ['slideshow', 'row']],
                    'displayTags' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'galleryMargin' => ['type' => ['string', 'integer']],
                    'galleryNavMargin' => ['type' => ['string', 'integer']],
                    'galleryPosition' => [
                        'type' => 'string', 'enum' => ['between title/description', 'above title', 'below description']
                    ],
                    'margin' => ['$ref' => '#/definitions/cssUnit.df'],
                    'spaceBetween' => ['$ref' => '#/definitions/cssUnit.df'],
                    'spaceBetweenImages' => ['$ref' => '#/definitions/cssUnit.df']
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
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df']
                ]
            ],
            'grid' => [
                'type' => 'object',
                'properties' => [
                    'contentWidth' => ['$ref' => '#/definitions/cssUnit.df']
                ]
            ],
            'heading' => [
                'type' => 'object',
                'properties' => [
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'image_height' => ['type' => 'integer', 'minimum' => 0],
                    'image_width' => ['type' => 'integer', 'minimum' => 0],
                    'image' => ['type' => 'string'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
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
                    'textDecorationLink' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationVisited' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationHover' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationActive' => ['$ref' => '#/definitions/textDecoration.df']
                ]
            ],
            'menu' => [
                'type' => 'object',
                'properties' => [
                    'colorActive' => ['type' => 'string', 'format' => 'color'],
                    'colorHover' => ['type' => 'string', 'format' => 'color'],
                    'colorLink' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                    'margin' => ['$ref' => '#/definitions/cssUnit.df'],
                    'position' => ['$ref' => '#/definitions/cssUnit.df'],
                    'separator' => ['type' => 'string'],
                    'separatorDistance' => ['$ref' => '#/definitions/cssUnit.df'],
                    'textDecorationActive' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationHover' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationLink' => ['$ref' => '#/definitions/textDecoration.df']
                ]
            ],
            'pageHeading' => [
                'type' => 'object',
                'properties' => [
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'image' => ['type' => 'string'],
                    'image_height' => ['type' => 'integer'],
                    'image_width' => ['type' => 'integer'],
                    'lineHeight' => ['type' => 'string'],
                    'margin' => ['$ref' => '#/definitions/cssUnit.df'],
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
                    'centeredWidth' => ['$ref' => '#/definitions/cssUnit.df'],
                    'centeringGuidesColor' => ['type' => 'string'],
                    'contentAlign' => ['type' => 'string', 'enum' => ['left', 'right', 'justify-left', 'justify-right']],
                    'contentPosition' => ['type' => 'string', 'enum' => ['left', 'center', 'right']],
                    'contentWidth' => ['$ref' => '#/definitions/cssUnit.df'],
                    'headingMargin' => ['type' => 'string'],
                    'leftColumnWidth' => ['$ref' => '#/definitions/cssUnit.df'],
                    'mashUpColumns' => ['type' => 'integer', 'minimum' => 0],
                    'menuMargin' => ['type' => 'string'],
                    'paddingLeft' => ['$ref' => '#/definitions/cssUnit.df'],
                    'paddingTop' => ['$ref' => '#/definitions/cssUnit.df'],
                    'responsive' => ['type' => 'string', 'enum' => ['no', 'yes']],
                    'siteMenuMargin' => ['$ref' => '#/definitions/cssUnit.df']
                ]
            ],
            'sideBar' => [
                'type' => 'object',
                    'properties' => [
                    'backgroundColor' => ['type' => 'string', 'format' => 'color'],
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'image' => ['type' => 'string'],
                    'image_height' => ['type' => 'integer'],
                    'image_width' => ['type' => 'integer'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                    'marginBottom' => ['$ref' => '#/definitions/cssUnit.df'],
                    'marginLeft' => ['$ref' => '#/definitions/cssUnit.df'],
                    'marginTop' => ['$ref' => '#/definitions/cssUnit.df'],
                    'transparent' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'width' => ['$ref' => '#/definitions/cssUnit.df']
                ]
            ],
            'subMenu' => [
                'type' => 'object',
                'properties' => [
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                    'margin' => ['$ref' => '#/definitions/cssUnit.df'],
                    'separator' => ['type' => 'string'],
                    'separatorDistance' => ['$ref' => '#/definitions/cssUnit.df']
                ]
            ],
            'tagsMenu' => [
                'type' => 'object',
                'properties' => [
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'googleFont' => ['type' => 'string'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                    'colorLink' => ['type' => 'string', 'format' => 'color'],
                    'colorHover' => ['type' => 'string', 'format' => 'color'],
                    'colorActive' => ['type' => 'string', 'format' => 'color'],
                    'textDecorationLink' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationHover' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationActive' => ['$ref' => '#/definitions/textDecoration.df'],
                    'x' => ['type' => 'integer'],
                    'y' => ['type' => 'integer'],
                    'alwaysOpen' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'hidden' => ['type' => 'string', 'enum' => ['yes', 'no']]
                ]
            ]
        ],
        'definitions' => [
            /**
             * Define these types only once, and reuse them, because they are used many times.
             * - The ".df" suffix is for easier searching, it is not required by the json schema.
             * - Enum values are extracted from "template.conf.php"
             */
            'fontWeight.df' => [
                'type' => 'string',
                'enum' => ['normal', 'bold', 'bolder', 'light', 'lighter', 'inherit']
            ],
            'fontFamily.df' => [
                'type' => 'string',
                'enum' => [
                    'Arial, sans-serif',
                    'Helvetica, Arial, sans-serif',
                    '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    '"Arial Black", Gadget, sans-serif',
                    '"Comic Sans MS", cursive',
                    '"Courier New", Courier, monospace',
                    'Georgia, "Times New Roman", Times, serif',
                    'Impact, Charcoal, sans-serif',
                    '"Lucida Console", Monaco, monospace',
                    '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
                    '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                    'Tahoma, Geneva, sans-serif',
                    '"Times New Roman", Times, serif',
                    '"Trebuchet MS", Helvetica, sans-serif',
                    'Verdana, Geneva, sans-serif'
                ]
            ],
            'fontStyle.df' => [  // https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
                'type' => 'string', 'enum' => ['normal', 'italic', 'oblique', 'inherit']
            ],
            'fontVariant.df' => [
                'type' => 'string', 'enum' => ['small-caps', 'inherit', 'normal']
            ],
            'textDecoration.df' => [
                'type' => 'string',
                'enum' => ['none', 'underline', 'overline', 'line-through']
            ],
            'cssUnit.df' => [
                'type' => ['string', 'integer'],
                'format' => 'css-unit'
            ]
        ]
    ];

    private $TEMPLATE_ROOT;

    public function __construct()
    {
        $this->TEMPLATE_ROOT = realpath(__DIR__ . '/../../../_templates');
    }

    public function get($lang = 'en')
    {
        $ret = [];
        $sectionTypes = [];
        $templateConf = [];
        I18n::load_language($lang);

        foreach ($this->getAllTemplates() as $tpl) {
            $ret[$tpl] = [];
            $conf = file_get_contents(
                $this->TEMPLATE_ROOT . '/' . $tpl . '/template.conf.php'
            );

            // @@@:HACK: read in template config and set up namespace
            //           so that I18n would be visible there
            $conf = str_replace('<?php', 'namespace App\Shared;', $conf);
            $conf = str_replace(
                '../_plugin_shop/template.conf.php',
                '../_plugin_shop/ng.template.conf.php',
                $conf
            );
            list(
                $ret[$tpl]['sectionTypes'],
                $ret[$tpl]['templateConf']
            ) = eval($conf);
        }

        return $ret;
    }

    public function getAllTemplates()
    {
        $returnArr = [];
        $d = dir($this->TEMPLATE_ROOT);

        while (false !== ($entry = $d->read())) {
            if ($entry != '.' &&
               $entry != '..' &&
               substr($entry, 0, 1) != '_'
               && is_dir($this->TEMPLATE_ROOT . '/' . $entry)) {
                $returnArr[] = $entry;
            }
        }

        $d->close();

        return $returnArr;
    }
}
