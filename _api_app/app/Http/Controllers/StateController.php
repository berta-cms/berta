<?php

namespace App\Http\Controllers;

use App\Sites;
use App\SiteSettings;
use App\SiteTemplateSettings;
use App\TemplateSettings;
use App\SiteSectionsDataService;
use App\Entries;
use App\Tags;

class StateController extends Controller
{
    public function get($site) {
        $sites = new Sites();
        $siteSettings = new SiteSettings();
        $templateSettings = new TemplateSettings();
        $allTemplates = $templateSettings->getAllTemplates();

        $state['urls'] = [
            'site' => route('site'),
            'site_settings' => route('site_settings'),
            'site_template_settings' => route('site_template_settings'),
            'section' => route('section'),
            'section_reset' => route('section_reset'),
            'section_background' => route('section_background')
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
                $template_settings = new SiteTemplateSettings(
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
                    $entries = new Entries($site_name, $section_name);
                    $state['entries'][$site_name][$section_name] = $entries->get();
                    unset($entries);
                }
            } else {
                $state['entries'][$site_name] = array();
            }

            $tags = new Tags($site_name);
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
