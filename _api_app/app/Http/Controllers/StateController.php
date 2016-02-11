<?php

namespace App\Http\Controllers;

use App\Sites;
use App\SiteSettings;
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
        $entries = new Entries();
        $tags = new Tags();

        $state = $sites->get();
        $state['site_settings'] = array();
        $state['sections'] = array();
        $state['entries'] = array();
        $state['tags'] = array();

        foreach($state['site'] as $_site) {
            $site_name = $_site['name'] ? $_site['name'] : 0;
            $sections = new Sections($site_name);
            $state['site_settings'][$site_name] = $siteSettings->getSettingsBySite($site_name);
            $state['sections'][$site_name] = $sections->getSectionsBySite();

            if (!empty($state['sections'][$site_name])) {
                foreach($state['sections'][$site_name]['section'] as $section) {
                    $section_name = $section['name'];
                    $state['entries'][$site_name][$section_name] = $entries->getSiteSectionEntries(
                        $site_name,
                        $section_name
                    );
                }
            }

            $state['tags'][$site_name] = $tags->getTagsBySite($site_name);
            unset($sections);
        }

        $lang = $state['site_settings'][$site]['language'][0]['language'];
        $state['template_settings'] = $templateSettings->get($lang);

        return response()->json($state);
    }
}
