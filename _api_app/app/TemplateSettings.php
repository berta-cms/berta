<?php

namespace App;

class I18n
{
    static $translations;
    public static $default_lang = 'en';

    public static function load_language($lang = null)
    {
        $ENGINE_ROOT = realpath(__DIR__ . '/../../engine');

        if($lang && file_exists($ENGINE_ROOT.'/lang/'.$lang.'.php'))
        {
            self::$translations = include($ENGINE_ROOT.'/lang/'.$lang.'.php');
        }
        elseif(file_exists($ENGINE_ROOT.'/lang/'. self::$default_lang.'.php'))
        {
            self::$translations = include($ENGINE_ROOT.'/lang/'.self::$default_lang.'.php');
        }
    }

    /**
     * @param   string  $key
     * @return  string
     *
     *
     */
    public static function _($key)
    {
        if(!empty(self::$translations) && isset(self::$translations[$key]))
        {
            return self::$translations[$key];
        }

        return $key;
    }
}

class TemplateSettings {
    private $TEMPLATE_ROOT;

    public function __construct() {
        $this->TEMPLATE_ROOT = realpath(__DIR__ . '/../../_templates');
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

            // @@@:HACK: read in template config ans set up namespace
            //           so that I18n would be visible there
            $conf = str_replace('<?php', 'namespace App;', $conf);
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
