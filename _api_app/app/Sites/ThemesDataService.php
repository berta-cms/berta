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
    public function __construct()
    {
        parent::__construct();
    }

    public function getThemes()
    {
        $themes = [];
        if (!is_dir($this->THEMES_ROOT)) {
            return $themes;
        }

        $files = array_diff(scandir($this->THEMES_ROOT), ['.', '..', '.git']);
        foreach ($files as $file) {
            if (is_dir("$this->THEMES_ROOT/$file")) {
                $themes[] = $file;
            }
        }

        return $themes;
    }
}
