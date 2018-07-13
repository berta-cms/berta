<?php

namespace App\Configuration;

use App\Shared\I18n;

class SiteSettingsConfigService
{
    private $settings;

    public function __construct()
    {

    }

    public function get($lang = 'en')
    {
        if ($this->settings) {
            return $this->settings;
        }

        I18n::load_language($lang);

        require_once(realpath(config('app.old_berta_root'). '/engine/_classes/class.bertabase.php'));
        require_once(realpath(config('app.old_berta_root'). '/engine/_classes/class.bertautils.php'));
        /** @var {\Berta} \Berta - Old berta app class */
        require_once(realpath(config('app.old_berta_root'). '/engine/_classes/class.berta.php'));

        $ENGINE_ROOT_PATH = realpath(config('app.old_berta_root') . '/engine') . '/';
        $SITE_ROOT_PATH = realpath(config('app.old_berta_root')) . '/';

        \Berta::$options['default_language'] = $lang;
        $options['XML_ROOT'] = realpath(config('app.old_berta_root') . '/storage') . '/';
        \Berta::$options['XML_ROOT'] = $options['XML_ROOT'];
        $berta = new \Berta();

        $conf = file_get_contents(
            realpath(config('app.old_berta_root'). '/engine/inc.settings.php')
        );

        /**
         * @todo Fix this HACK, also read settings definitions from shop plugin
         */
        // @@@:HACK: read in settings config and set up namespace
        //           so that I18n would be visible there
        $conf = str_replace('<?php', 'namespace App\Shared;', $conf);
        eval($conf);

        $this->settings = $settingsDefinition;

        return $this->settings;
    }

    /**
     * Returns site settings default values
     */
    public function getDefaults()
    {
        $defaults = [];
        $data = $this->get();

        foreach ($data as $group => $groupSettings) {
            foreach ($groupSettings as $key => $settings) {
                if ($key == '_') {
                    continue;
                }

                $defaults[$group][$key] = $settings['default'];
            }
        }

        return $defaults;
    }
}
