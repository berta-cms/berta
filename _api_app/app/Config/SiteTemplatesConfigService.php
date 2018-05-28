<?php

namespace App\Config;

use App\Shared\I18n;

class SiteTemplatesConfigService
{
    private $TEMPLATE_ROOT;

    public function __construct()
    {
        $this->TEMPLATE_ROOT = realpath(__DIR__ . '/../../../_templates');
    }

    public function get($lang = 'en')
    {
        $ret = array();
        $sectionTypes = array();
        $templateConf = array();
        I18n::load_language($lang);

        foreach ($this->getAllTemplates() as $tpl) {
            $ret[$tpl] = array();
            $conf = file_get_contents(
                $this->TEMPLATE_ROOT . '/' . $tpl . '/template.conf.php'
            );

            /**
             * @todo Fix this HACK, also read template definitions from shop plugin
             */
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
        $returnArr = array();
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
