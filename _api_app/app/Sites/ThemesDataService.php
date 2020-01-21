<?php

namespace App\Sites;

use App\Shared\Storage;
use App\Configuration\SiteSettingsConfigService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\Entries\SectionEntriesDataService;

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
}
