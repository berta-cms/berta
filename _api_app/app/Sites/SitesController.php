<?php

namespace App\Sites;

use App\Http\Controllers\Controller;
use App\Sites\SitesDataService;
use App\Sites\SiteSettings\SiteSettingsDataService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\Tags\SectionTagsDataService;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\SiteTemplateSettings\SiteTemplateSettingsDataService;

use Illuminate\Http\Request;


class SitesController extends Controller
{
    public function create(Request $request) {
        $sites = new SitesDataService();
        $json = $request->json()->all();
        $cloneFrom = $json['site'] == -1 ? null : $json['site'];
        $isClone = $cloneFrom !== null;
        $site = $sites->create($cloneFrom);

        /**
         * @todo refactor code
         * @todo think about improving Storage classes
         * @todo review this controller, sections
         */
        $settings = new SiteSettingsDataService($site['name']);
        $settings = $isClone ? $settings->get() : $settings->getDefaultSettings();
        $sections = $isClone ? new SiteSectionsDataService($site['name']) : null;
        $entries = [];
        if ($sections) {
            foreach ($sections->get() as $section) {
                $sectionEntries = new SectionEntriesDataService($site['name'], $section['name']);
                $entries = array_merge($entries, $sectionEntries->get());
            }
        }

        $tags = $isClone ? new SectionTagsDataService($site['name']) : null;

        $templateSettings = null;
        if ($isClone && isset($settings['template']['template'])) {
            $templateSettings = new SiteTemplateSettingsDataService($site['name'], $settings['template']['template']);
        }

        $resp = [
            'site' => $site,
            'settings' => $settings,
            'sections' => $sections ? $sections->state() : [],
            'entries' => $entries ? ['entry' => $entries] : [],  // See if we need that wrap
            'tags' => $tags ? $tags->get() : [],
            'siteTemplateSettings' => $templateSettings ? $templateSettings->get() : new \stdClass
        ];

        return response()->json($resp);
    }

    public function update(Request $request) {
        $sites = new SitesDataService();
        $json = $request->json()->all();

        $res = $sites->saveValueByPath($json['path'], $json['value']);
        // @@@:TODO: Replace this with something sensible, when migration to redux is done
        $res['update'] = $res['value'];
        $res['real'] = $res['value'];
        // @@@:TODO:END

        return response()->json($res, $res['status_code']);
    }

    public function delete(Request $request) {
        $sites = new SitesDataService();
        $json = $request->json()->all();
        $res = $sites->delete($json['site']);

        return response()->json($res);
    }

    public function order(Request $request) {
        $sites = new SitesDataService();
        $json = $request->json()->all();
        $sites->order($json);
        return response()->json($json);
    }
}
