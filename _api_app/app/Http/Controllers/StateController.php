<?php

namespace App\Http\Controllers;

use App\Sites;
use App\Settings;
use App\Sections;
use App\Tags;

class StateController extends Controller
{
    public function getState() {
        $sites = new Sites();
        $settings = new Settings();
        $sections = new Sections();
        $tags = new Tags();

        $state = $sites->getSites();
        $state['settings'] = array();
        $state['sections'] = array();
        $state['entries'] = array();
        $state['tags'] = array();

        foreach($state['site'] as $site) {
            $site_name = $site['name'] ? $site['name'] : 0;
            $state['settings'][$site_name] = $settings->getSettingsBySite($site['name']);
            $state['sections'][$site_name] = $sections->getSectionsBySite($site['name']);

            foreach($state['sections'][$site_name]['section'] as $section) {
                $section_name = $section['name'];
                $state['entries'][$site_name][$section_name] = $sections->getSiteSectionEntries(
                    $site['name'],
                    $section_name
                );
            }

            $state['tags'][$site_name] = $tags->getTagsBySite($site['name']);
        }

        return response()->json($state);
    }
}
