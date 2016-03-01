<?php

namespace App\Http\Controllers;

use App\Sites;
use App\SiteSettings;
use App\SiteTemplateSettings;
use App\TemplateSettings;
use App\Sections;
use App\Entries;
use App\Tags;

class StateController extends Controller
{
    public function get($site) {
        $sites = new Sites();
        $siteSettings = new SiteSettings();
        $templateSettings = new TemplateSettings();

        $state = $sites->get();
        $state['site_settings'] = array();
        $state['sections'] = array();
        $state['entries'] = array();
        $state['tags'] = array();

        foreach($state['site'] as $_site) {
            $site_name = $_site['name'] ? $_site['name'] : 0;
            $sections = new Sections($site_name);
            $site_settings = $siteSettings->getSettingsBySite($site_name);
            $state['site_settings'][$site_name] = $site_settings;
            $state['sections'][$site_name] = $sections->get();

            if (isset($site_settings['template'])) {
                $template = $site_settings['template']['template'];
                $site_template_settings = new SiteTemplateSettings(
                    $site_name,
                    $template
                );
                $state['site_template_settings'][$site_name][$template] = $site_template_settings->get();
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
