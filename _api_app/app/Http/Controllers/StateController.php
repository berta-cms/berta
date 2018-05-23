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
        $state['site_settings'] = array();
        $state['site_sections'] = array();
        $state['section_entries'] = array();
        $state['section_tags'] = array();

        foreach($state['sites'] as $_site) {
            $site_name = $_site['name'];
            $sectionsDataService = new SiteSectionsDataService($site_name);
            $site_settings = $siteSettingsDataService->getSettingsBySite($site_name);
            $state['site_settings'][$site_name] = $site_settings;
            $state['site_sections'] = array_merge($state['site_sections'], $sectionsDataService->state());

            foreach ($allTemplates as $template) {
                $template_settings = new SiteTemplateSettingsDataService(
                    $site_name,
                    $template
                );
                $template_settings = $template_settings->get();

                if (!($template_settings)) {
                    $template_settings = (object) null;
                }

                $state['site_template_settings'][$site_name][$template] = $template_settings;
            }

            if (!empty($state['site_sections'][$site_name]['section'])) {
                foreach($state['site_sections'][$site_name]['section'] as $section) {
                    $section_name = $section['name'];
                    $entries = new SectionEntriesDataService($site_name, $section_name);
                    $state['section_entries'][$site_name][$section_name] = $entries->get();
                    unset($entries);
                }
            } else {
                $state['section_entries'][$site_name] = array();
            }

            $tags = new SectionTagsDataService($site_name);
            $state['section_tags'][$site_name] = $tags->get();
            unset($sections);
            unset($tags);

            if (isset($site_template_settings)){
                unset($site_template_settings);
            }
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
