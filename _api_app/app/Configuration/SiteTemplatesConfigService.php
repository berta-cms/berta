<?php

namespace App\Configuration;

use Swaggest\JsonSchema\Schema;

use App\Shared\Helpers;
use App\Shared\I18n;

/**
 * @class SiteTemplatesConfigService
 *
 * This class provides templates from which Berta sites are built. Templates are readonly data structures
 * representing \App\Site\SiteTemplateSettings. SiteTemplateSettings for any specific site are generated according
 * to it's template.
 *
 * @example This example is shown in JSON form. The actual definitions are in PHP at this time.
 *  "default": {
 *      "templateConf": {
 *          "generalFontSettings": {
 *              "_": {
 *                  "title": "General font settings"
 *              },
 *              "color": {
 *                  "format": "color",
 *                  "default": "#333333",
 *                  "title": "Color",
 *                  "description": ""
 *              },
 *              "fontFamily": {
 *                  "format": "fontselect",
 *                  "values": [
 *                      "Helvetica, Arial, sans-serif",
 *                      "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
 *                      "\"Arial Black\", Gadget, sans-serif",
 *                      "\"Comic Sans MS\", cursive",
 *                      "\"Courier New\", Courier, monospace",
 *                      "Georgia, \"Times New Roman\", Times, serif",
 *                      "Impact, Charcoal, sans-serif",
 *                      "\"Lucida Console\", Monaco, monospace",
 *                      "\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif",
 *                      "\"Palatino Linotype\", \"Book Antiqua\", Palatino, serif",
 *                      "Tahoma, Geneva, sans-serif",
 *                      "\"Times New Roman\", Times, serif",
 *                      "\"Trebuchet MS\", Helvetica, sans-serif",
 *                      "Verdana, Geneva, sans-serif"
 *                  ],
 *                  "default": "Helvetica, Arial, sans-serif",
 *                  "title": "Font face",
 *                  "description": ""
 *              },
 *              ...
 *          },
 *          "background": {
 *              "_": {
 *                  "title": "Background"
 *              },
 *              ...,
 *              "backgroundRepeat": {
 *                  "format": "select",
 *                  "values": {
 *                      "repeat": "tile vertically and horizontally",
 *                      "repeat-x": "tile horizontally",
 *                      "repeat-y": "tile vertically",
 *                      "no-repeat": "no tiling"
 *                  },
 *                  "default": "repeat",
 *                  "title": "Background tiling",
 *                  "description": "How the background fills the screen?"
 *              }
 *              ...
 *          },
 *          ...
 *      },
 *      "sectionTypes": {
 *          "default": {
 *              "title": "Default",
 *              "params": {
 *                  "columns": {
 *                      "format": "select",
 *                      "default": "1",
 *                      "values": [
 *                          "1",
 *                          "2",
 *                          "3",
 *                          "4"
 *                      ],
 *                      "html_before": "<div class=\"label\">Columns:<\/div>"
 *                  },
 *                  ...,
 *                  "backgroundVideoRatio": {
 *                      "format": "select",
 *                      "default": "fillWindow",
 *                      "values": {
 *                          "fillWindow": "Fill window",
 *                          "keepRatio": "Keep ratio"
 *                      },
 *                      "html_before": "<div class=\"label\">Background video ratio:<\/div>"
 *                  }
 *              }
 *          },
 *          "external_link": {
 *              "title": "External link",
 *              "params": {
 *                  "link": {
 *                      "format": "text",
 *                      "default": "",
 *                      "link": true,
 *                      "html_before": "<div class=\"label\">Link address:<\/div>"
 *                  },
 *                  "target": {
 *                      "format": "select",
 *                      "values": {
 *                          "_self": "Same window",
 *                          "_blank": "New window"
 *                      },
 *                      "default": "_blank",
 *                      "html_before": "<div class=\"label\">Opens in:<\/div>"
 *                  }
 *              }
 *          },
 *          ...
 *      }
 *  }
 *
 * Template configurations can be found at `berta/_templates/[template name]/template.conf.php`.
 * @todo: Templates should be moved to this folder.
 * @todo: Template settings should be moved to XML so we have everything in a standardized way.
 */
class SiteTemplatesConfigService
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
                        'additionalProperties' => [ // generalFontSettings, links, background, ...
                            'type' => 'object',
                            'properties' => [
                                "_" => [
                                    'type' => 'object',
                                    'properties' => [
                                        'title' => ['type' => 'string'],
                                    ],
                                ],
                            ],
                            'additionalProperties' => [ // _, color, fontFamily, backgroundRepeat, ...
                                'type' => 'object',
                                'properties' => [
                                    'default' => ['type' => ['string', 'number', 'boolean']],
                                    'description' => ['type' => 'string'],
                                    'title' => ['type' => 'string'],
                                    'format' => ['type' => ['string', 'boolean']],
                                    'values' => [
                                        'oneOf' => [
                                            ['type' => 'array', 'items' => ['type' => ['string', 'number']]],
                                            ['type' => 'object', 'additionalProperties' => ['type' => ['string', 'number']]],
                                        ],
                                    ],
                                    'html_entities' => ['type' => 'boolean'],
                                    'css_units' => ['type' => 'boolean'],
                                    'min_width' => ['type' => ['number', 'string']],
                                    'min_height' => ['type' => ['number', 'string']],
                                    'max_width' => ['type' => ['number', 'string']],
                                    'max_height' => ['type' => ['number', 'string']],
                                    'allow_blank' => ['type' => 'boolean'],
                                ],
                            ],
                        ],
                    ],
                    'sectionTypes' => [
                        'type' => 'object',
                        'required' => ['default'],
                        'additionalProperties' => [ // default, external_links, portfolio, ...
                            'type' => 'object',
                            'properties' => [
                                'title' => ['type' => 'string'],
                                'params' => [
                                    'type' => 'object',
                                    'additionalProperties' => [ // columns, backgroundVideoRatio, link, target, ...
                                        'type' => 'object',
                                        'properties' => [
                                            'default' => ['type' => ['string', 'number']],
                                            'format' => ['type' => 'string'],
                                            'values' => [
                                                'oneOf' => [
                                                    ['type' => 'array', 'items' => ['type' => ['string', 'number']]],
                                                    ['type' => 'object', 'additionalProperties' => ['type' => ['string', 'number']]],
                                                ],
                                            ],
                                            'html_entities' => ['type' => 'boolean'],
                                            'css_units' => ['type' => 'boolean'],
                                            'allow_blank' => ['type' => 'boolean'],
                                            'html_before' => ['type' => 'string'],
                                            'html_after' => ['type' => 'string'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ];

    private $TEMPLATE_ROOT;

    public function __construct()
    {
        $this->TEMPLATE_ROOT = realpath(config('app.old_berta_root'). '/_templates');
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

            /**
             * @todo Fix this HACK
             */
            // @@@:HACK: read in template config and set up namespace
            //           so that I18n would be visible there
            $conf = str_replace('<?php', 'namespace App\Shared;', $conf);
            list(
                $ret[$tpl]['sectionTypes'],
                $ret[$tpl]['templateConf']
                ) = eval($conf);
        }

        return $ret;
    }

    /**
     * Returns template default values for each template
     */
    public function getDefaults()
    {
        $defaults = [];
        $data = $this->get();

        foreach ($data as $templateName => $config) {
            foreach ($config['templateConf'] as $group => $groupSettings) {
                foreach ($groupSettings as $key => $settings) {
                    if ($key == '_') {
                        continue;
                    }

                    $defaults[$templateName]['templateConf'][$group][$key] = $settings['default'];
                }
            }
            foreach ($config['sectionTypes'] as $group => $groupSettings) {
                if (!isset($groupSettings['params'])) {
                    continue;
                }

                foreach ($groupSettings['params'] as $key => $settings) {
                    $defaults[$templateName]['sectionTypes'][$group][$key] = $settings['default'];
                }
            }
        }

        return $defaults;
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

    public function validationTest()
    {
        $json_object = Helpers::arrayToJsonObject(self::$JSON_SCHEMA);
        $schema = Schema::import($json_object);
        $templates = $this->get();
        $result = $schema->in(Helpers::arrayToJsonObject($templates));
        return true;
    }
}
