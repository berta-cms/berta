<?php

namespace App\Http\Controllers;

use App\Sites\SitesDataService;
use App\Sites\SiteSettings\SiteSettingsDataService;
use App\Sites\SiteTemplateSettings\SiteTemplateSettingsDataService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\Tags\SectionTagsDataService;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\TemplateSettings;

class StateController extends Controller
{
    public function get($site) {
        $sites = new SitesDataService();
        $siteSettings = new SiteSettingsDataService();
        $templateSettings = new TemplateSettings();
        $allTemplates = $templateSettings->getAllTemplates();

        $state['urls'] = [
            'sites' => route('sites'),
            'site_settings' => route('site_settings'),
            'site_template_settings' => route('site_template_settings'),
            'sections' => route('sections'),
            'sections_reset' => route('sections_reset'),
            'section_backgrounds' => route('section_backgrounds')
        ];
        $state['sites'] = $sites->state();
        $state['site_settings'] = array();
        $state['sections'] = array();
        $state['entries'] = array();
        $state['tags'] = array();

        foreach($state['sites'] as $_site) {
            $site_name = $_site['name'];
            $sectionsDataService = new SiteSectionsDataService($site_name);
            $site_settings = $siteSettings->getSettingsBySite($site_name);
            $state['site_settings'][$site_name] = $site_settings;
            $state['sections'] = array_merge($state['sections'], $sectionsDataService->state());

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

            if (!empty($state['sections'][$site_name]['section'])) {
                foreach($state['sections'][$site_name]['section'] as $section) {
                    $section_name = $section['name'];
                    $entries = new SectionEntriesDataService($site_name, $section_name);
                    $state['entries'][$site_name][$section_name] = $entries->get();
                    unset($entries);
                }
            } else {
                $state['entries'][$site_name] = array();
            }

            $tags = new SectionTagsDataService($site_name);
            $state['tags'][$site_name] = $tags->get();
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

        $state['template_settings'] = $templateSettings->get($lang);
        unset($sites);

        return response()->json($state);
    }
}
