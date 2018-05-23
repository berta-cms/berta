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
class SiteTemplatesDataService {
    private $TEMPLATE_ROOT;

    public function __construct() {
        $this->TEMPLATE_ROOT = realpath(__DIR__ . '/../../../_templates');
    }

    public function get($lang='en') {
        $ret = array();
        $sectionTypes = array();
        $templateConf = array();
        I18n::load_language($lang);

        foreach($this->getAllTemplates() as $tpl) {
            $ret[$tpl] = array();
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

    public function getAllTemplates() {
        $returnArr = array();
        $d = dir($this->TEMPLATE_ROOT);

        while(false !== ($entry = $d->read())) {
            if($entry != '.' &&
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
