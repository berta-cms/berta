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
            'default' => ['$ref' => '#/definitions/template.df'],
            'mashup-0.3.5' => ['$ref' => '#/definitions/template.df'],
            'messy-0.4.2' => ['$ref' => '#/definitions/template.df'],
            'white-0.3.5' => ['$ref' => '#/definitions/template.df'],
        ],
        'definitions' => [
            'template.df' => [
                'type' => 'object',
                'properties' => [
                    'templateConf' => [
                        'type' => 'object',
                        'additionalProperties' => [  // generalFontSettings, links, background...
                            'type' => 'object',
                            'properties' => [
                                "_" => [
                                    'title' => ['type' => 'string']
                                ]
                            ],
                            'additionalProperties' => [  // _, color, fontFamily, googleFont...
                                'type' => 'object',
                                'properties' => [
                                    'default' => ['type' => ['string', 'number']],
                                    'description' => ['type' => 'string'],
                                    'title' => ['type' => 'string'],
                                    'format' => ['type' => 'string'],
                                    'values' => [
                                        'anyOf' => [
                                            ['type' => 'array', 'items' => ['string', 'number']],
                                            ['type' => 'object', 'additionalProperties' => ['type' => 'string', 'number']]
                                        ]
                                    ],
                                    'html_entities' => ['type' => 'boolean'],
                                    'css_units' => ['type' => 'boolean'],
                                    'min_width' => ['type' => ['number', 'string']],
                                    'min_height' => ['type' => ['number', 'string']],
                                    'max_width' => ['type' => ['number', 'string']],
                                    'max_height' => ['type' => ['number', 'string']],
                                    'allow_blank' => ['type' => 'boolean'],
                                    'params' => [
                                        'type' => 'object',
                                        '$comment' => 'any kind of parameters required for this field',
                                        'additionalProperties' => [  // link, target, marked_items_count...
                                            'type' => 'object',
                                            'properties' => [
                                                'default' => ['type' => ['string', 'number']],
                                                'description' => ['type' => 'string'],
                                                'title' => ['type' => 'string'],
                                                'format' => ['type' => 'string'],
                                                'values' => [
                                                    'anyOf' => [
                                                        ['type' => 'array', 'items' => ['string', 'number']],
                                                        ['type' => 'object', 'additionalProperties' => ['type' => 'string', 'number']]
                                                    ]
                                                ],
                                                'html_entities' => ['type' => 'boolean'],
                                                'css_units' => ['type' => 'boolean'],
                                                'min_width' => ['type' => ['number', 'string']],
                                                'min_height' => ['type' => ['number', 'string']],
                                                'max_width' => ['type' => ['number', 'string']],
                                                'max_height' => ['type' => ['number', 'string']],
                                                'allow_blank' => ['type' => 'boolean'],
                                                'html_before' => ['type' => 'string'],
                                                'html_after' => ['type' => 'string']
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ];

    private $SETTINGS = [

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
