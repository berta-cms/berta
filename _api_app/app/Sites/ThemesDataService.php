<?php

namespace App\Sites;

use App\Shared\Storage;
use App\Configuration\SiteSettingsConfigService;

/**
 * Service for ready made berta themes
 */
class ThemesDataService extends Storage
{
    private $THEME = null;
    public $THEME_STORAGE_ROOT = null;

    public function __construct($theme = null)
    {
        parent::__construct();

        if ($theme) {
            $this->THEME = $theme;
            $this->THEME_STORAGE_ROOT = $this->THEMES_ROOT . '/' . $this->THEME;
        }
    }

    public function mergeSettings($currentSiteSettings)
    {
        $themeSiteSettings = $this->getThemeSiteSettings();
        $siteSettingsCS = new SiteSettingsConfigService();
        $siteSettingsConfig = $siteSettingsCS->get();

        // Merge only those settings that affects site style
        foreach ($siteSettingsConfig as $groupKey => $group) {
            foreach ($group as $settingKey => $setting) {
                if (!(isset($setting['affectsStyle']) && $setting['affectsStyle'])) {
                    continue;
                }

                // overwrite with defined value from theme
                if (isset($themeSiteSettings[$groupKey][$settingKey])) {
                    $currentSiteSettings[$groupKey][$settingKey] = $themeSiteSettings[$groupKey][$settingKey];
                // remove existing one and keep the themes default value from template settings definitions
                } else {
                    unset($currentSiteSettings[$groupKey][$settingKey]);
                }
            }

            if (empty($currentSiteSettings[$groupKey])) {
                unset($currentSiteSettings[$groupKey]);
            }
        }
        return $currentSiteSettings;
    }

    private function getThemeSiteSettings()
    {
        return $this->xmlFile2array($this->THEME_STORAGE_ROOT . '/settings.xml');
    }
}
