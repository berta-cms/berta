<?php

namespace App\Http\Controllers;

use App\Configuration\SiteSettingsConfigService;
use App\Configuration\SiteTemplatesConfigService;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\Tags\SectionTagsDataService;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\SitesDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;

class StateController extends Controller
{
    public function get($site)
    {
        $site = $site === '0' ? '' : $site;
        $sitesDataService = new SitesDataService();
        $siteSettingsConfigService = new SiteSettingsConfigService();
        $siteTemplatesConfigService = new SiteTemplatesConfigService();
        $allTemplates = $siteTemplatesConfigService->getAllTemplates();

        $state['urls'] = [
            'sites' => route('sites'),
            'siteSettings' => route('site_settings'),
            'siteTemplateSettings' => route('site_template_settings'),
            'siteSections' => route('site_sections'),
            'siteSectionsReset' => route('site_sections_reset'),
            'siteSectionBackgrounds' => route('site_section_backgrounds'),
        ];
        $state['sites'] = $sitesDataService->getState();
        $state['site_settings'] = [];
        $state['site_sections'] = [];
        $state['section_entries'] = [];
        $state['section_tags'] = [];

        foreach ($state['sites'] as $_site) {
            $siteName = $_site['name'];

            $siteSettingsDataService = new SiteSettingsDataService($siteName);
            $siteSettings = $siteSettingsDataService->getState();
            $state['site_settings'][$siteName] = $siteSettings;
            $sectionsDataService = new SiteSectionsDataService($siteName);
            $state['site_sections'] = array_merge($state['site_sections'], $sectionsDataService->getState());

            foreach ($allTemplates as $template) {
                $templateSettingsDataService = new SiteTemplateSettingsDataService(
                    $siteName,
                    $template
                );
                $templateSettings = $templateSettingsDataService->getState();

                if (!($templateSettings)) {
                    $templateSettings = (object) null;
                }

                $state['site_template_settings'][$siteName][$template] = $templateSettings;
            }

            if (!empty($state['site_sections'][$siteName]['section'])) {
                foreach ($state['site_sections'][$siteName]['section'] as $section) {
                    $sectionName = $section['name'];
                    $entriesDataService = new SectionEntriesDataService($siteName, $sectionName);
                    $state['section_entries'][$siteName][$sectionName] = $entriesDataService->get();
                }
            } else {
                $state['section_entries'][$siteName] = [];
            }

            $tagsDataService = new SectionTagsDataService($siteName);
            $state['section_tags'][$siteName] = $tagsDataService->get();
        }

        $lang = 'en';

        if (isset($state['site_settings'][$site]['language'])) {
            $lang = $state['site_settings'][$site]['language']['language'];
        }

        $state['siteTemplates'] = $siteTemplatesConfigService->get($lang);

        /**
         * @todo Add siteSettingsConfig in redux store
         */
        $state['siteSettingsConfig'] = $siteSettingsConfigService->get($lang);

        return response()->json($state);
    }
}
