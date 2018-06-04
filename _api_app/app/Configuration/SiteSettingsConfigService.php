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

        $conf = file_get_contents(
            realpath(__DIR__ . '/../../../engine/inc.settings.php')
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
