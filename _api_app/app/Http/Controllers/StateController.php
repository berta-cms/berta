<?php

namespace App\Http\Controllers;

use App\Sites\SitesDataService;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\Tags\SectionTagsDataService;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\SiteTemplates\SiteTemplatesDataService;

class StateController extends Controller
{
    public function get($site) {
        $site = $site === '0' ? '' : $site;
        $sitesDataService = new SitesDataService();
        $siteSettingsDataService = new SiteSettingsDataService();
        $siteTemplatesDataService = new SiteTemplatesDataService();
        $allTemplates = $siteTemplatesDataService->getAllTemplates();

        $state['urls'] = [
            'sites' => route('sites'),
            'siteSettings' => route('site_settings'),
            'siteTemplateSettings' => route('site_template_settings'),
            'siteSections' => route('site_sections'),
            'siteSectionsReset' => route('site_sections_reset'),
            'siteSectionBackgrounds' => route('site_section_backgrounds')
        ];
        $state['sites'] = $sitesDataService->state();
        $state['site_settings'] = [];
        $state['site_sections'] = [];
        $state['section_entries'] = [];
        $state['section_tags'] = [];

        foreach ($state['sites'] as $_site) {
            $siteName = $_site['name'];
            $sectionsDataService = new SiteSectionsDataService($siteName);
            $siteSettings = $siteSettingsDataService->getSettingsBySite($siteName);
            $state['site_settings'][$siteName] = $siteSettings;
            $state['site_sections'] = array_merge($state['site_sections'], $sectionsDataService->state());

            foreach ($allTemplates as $template) {
                $templateSettingsDataService = new SiteTemplateSettingsDataService(
                    $siteName,
                    $template
                );
                $templateSettings = $templateSettingsDataService->get();

                if (!($templateSettings)) {
                    $templateSettings = (object) null;
                }

                $state['site_template_settings'][$siteName][$template] = $templateSettings;
            }

            if (!empty($state['site_sections'][$siteName]['section'])) {
                foreach ($state['site_sections'][$siteName]['section'] as $section) {
                    $templateSettings = $section['name'];
                    $entriesDataService = new SectionEntriesDataService($siteName, $templateSettings);
                    $state['section_entries'][$siteName][$templateSettings] = $entriesDataService->get();
                    unset($entriesDataService);
                }
            } else {
                $state['section_entries'][$siteName] = [];
            }

            $tagsDataService = new SectionTagsDataService($siteName);
            $state['section_tags'][$siteName] = $tagsDataService->get();
            unset($tagsDataService, $templateSettingsDataService);
        }

        $lang = 'en';

        if (isset($state['site_settings'][$site]['language'])) {
            $lang = $state['site_settings'][$site]['language']['language'];
        }

        $state['site_templates'] = $siteTemplatesDataService->get($lang);
        unset($sitesDataService);

        return response()->json($state);
    }
}
