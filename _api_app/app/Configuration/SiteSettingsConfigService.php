<?php

namespace App\Configuration;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Shared\I18n;
use App\Shared\Helpers;
use App\User\UserAuthServiceProvider;

class SiteSettingsConfigService
{
    private $settings;

    // Currently default template is set in old Berta if it's not already set in XML
    // We need a default template here in case old Berta has not set this value yet
    // @TODO Create settings XML file with default template in api
    private $defaultTemplate = 'messy-0.4.2';
    private $request;

    public function __construct()
    {
        $this->request = Request::capture();
    }

    public function get($lang = 'en')
    {
        if ($this->settings) {
            return $this->settings;
        }

        /* Setup for the @@@HACK: */
        I18n::load_language($lang);
        if (!isset($options)) {
            $options = [];
        }

        // Can't cal Auth::check() here, because old berta calls this class out of application context
        // So we are checking the token from request manually here
        $token = UserAuthServiceProvider::getBearerToken($this->request);
        $userLoggedIn = $token && Helpers::validate_token($token);

        $berta = (object)['security' => (object)['userLoggedIn' => $userLoggedIn]];
        $ENGINE_ROOT_PATH = config('app.old_berta_root') . '/engine/';
        $SITE_ROOT_PATH = config('app.old_berta_root') . '/';
        $options['XML_ROOT'] = "{$SITE_ROOT_PATH}storage/";
        $conf = file_get_contents(
            realpath(config('app.old_berta_root') . '/engine/inc.settings.php')
        );

        /**
         * @todo Fix this HACK, also read settings definitions from shop plugin
         */
        // @@@:HACK: read in settings config and set up namespace
        //           so that I18n would be visible there
        $conf = str_replace('<?php', 'namespace App\Shared;', $conf);
        eval($conf);

        $this->settings = $settingsDefinition;
        $this->settings['template']['template']['values'] = $this->getTemplates();
        $this->settings['template']['template']['default'] = $this->defaultTemplate;

        // Make sure `shop` settings don't mix with the page settings.
        // @TODO remove this once we clean up the settings
        if (isset($this->settings['shop'])) {
            unset($this->settings['shop']);
        }

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

    public function getTemplates()
    {
        $returnArr = [];
        $templatesRoot = config('app.old_berta_root') . '/_templates/';
        $d = dir($templatesRoot);
        while (false !== ($entry = $d->read())) {
            if ($entry != '.' && $entry != '..' && substr($entry, 0, 1) != '_' && is_dir($templatesRoot . $entry)) {
                $returnArr[] = $entry;
            }
        }
        $d->close();
        return $returnArr;
    }
}
