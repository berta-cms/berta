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

    public function mergeSections($currentSiteSections)
    {
        $themeSiteSections = array_reverse($this->getThemeSiteSections());

        foreach ($themeSiteSections as $themeSiteSection) {
            $sectionOrder = array_search($themeSiteSection['name'], array_column($currentSiteSections, 'name'));

            // Found existing section with same name
            if ($sectionOrder !== false) {
                $hasContent = isset($currentSiteSections[$sectionOrder]['@attributes']['entry_count']) && $currentSiteSections[$sectionOrder]['@attributes']['entry_count'] > 0;

                // Skip merge for sections with existing content
                if ($hasContent) {
                    continue;
                }
            }

            // Copy section entries
            copy($this->THEME_STORAGE_ROOT . '/blog.' . $themeSiteSection['name'] . '.xml', $this->XML_PREVIEW_ROOT . '/blog.' . $themeSiteSection['name'] . '.xml');

            // Copy section entry media files
            $sectionEntriesDS = new SectionEntriesDataService($this->SITE, $themeSiteSection['name'], null, $this->THEME_STORAGE_ROOT);
            $sectionEntriesDS->copyMediaFiles($this->XML_PREVIEW_ROOT);

            // Replace existing section with theme section
            if ($sectionOrder !== false) {
                $currentSiteSections[$sectionOrder] = $themeSiteSection;
            // Merge as new section at the beginning of section list
            } else {
                array_unshift($currentSiteSections, $themeSiteSection);
            }

            // @TODO copy section background images if exists
        }

        return $currentSiteSections;
    }

    private function getThemeSiteSections()
    {
        $siteSectionsDS = new SiteSectionsDataService($this->SITE, $this->THEME_STORAGE_ROOT);
        $themeSiteSections = $siteSectionsDS->get();

        return $themeSiteSections;
    }
}
