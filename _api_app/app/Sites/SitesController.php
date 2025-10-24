<?php

namespace App\Sites;

use App\Configuration\SiteTemplatesConfigService;
use App\Http\Controllers\Controller;
use App\Shared\Storage;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\Tags\SectionTagsDataService;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;
use App\User\UserModel;
use Illuminate\Http\Request;

class SitesController extends Controller
{
    public function create(Request $request)
    {
        $sites = new SitesDataService;
        $json = $request->json()->all();
        $cloneFrom = $json['site'] == -1 ? null : $json['site'];
        $isClone = $cloneFrom !== null;
        $site = $sites->create($request, $cloneFrom);
        $siteTemplatesConfigService = new SiteTemplatesConfigService;
        $allTemplates = $siteTemplatesConfigService->getAllTemplates();

        /**
         * @todo refactor code
         * @todo think about improving Storage classes
         * @todo review this controller, sections
         */
        $siteSettingsDataService = new SiteSettingsDataService($site['name']);
        $settings = $isClone ? $siteSettingsDataService->getState() : $siteSettingsDataService->getDefaultSettings();
        $sections = $isClone ? new SiteSectionsDataService($site['name']) : null;
        $entries = [];
        if ($sections) {
            foreach ($sections->get() as $section) {
                $sectionEntriesDataService = new SectionEntriesDataService($site['name'], $section['name']);
                $entries = array_merge($entries, $sectionEntriesDataService->getState());
            }
        }

        $tags = $isClone ? new SectionTagsDataService($site['name']) : null;

        $siteTemplateSettings = [];
        foreach ($allTemplates as $template) {
            $siteTemplateSettingsDataService = new SiteTemplateSettingsDataService(
                $site['name'],
                $template
            );
            $siteTemplateSettings[$template] = $siteTemplateSettingsDataService->getState();
        }

        $resp = [
            'site' => $site,
            'settings' => $settings,
            'sections' => $sections ? $sections->getState() : [],
            'entries' => $entries,
            'tags' => $tags ? $tags->get() : [],
            'siteTemplateSettings' => $siteTemplateSettings,
        ];

        return response()->json($resp);
    }

    public function update(Request $request)
    {
        $sites = new SitesDataService;
        $json = $request->json()->all();

        $res = $sites->saveValueByPath($json['path'], $json['value']);
        // @@@:TODO: Replace this with something sensible, when migration to redux is done
        $res['update'] = $res['value'];
        $res['real'] = $res['value'];
        // @@@:TODO:END

        return response()->json($res, $res['status_code']);
    }

    public function themePreview(Request $request)
    {
        $json = $request->json()->all();
        $siteName = $json['site'];
        $themeName = $json['theme'];

        $sitesDS = new SitesDataService($siteName);
        $sitesDS->createPrieview($themeName);

        return response()->json($json);
    }

    public function themeApply(Request $request)
    {
        $json = $request->json()->all();
        $siteName = $json['site'];
        $themeName = $json['theme'];

        $sitesDS = new SitesDataService($siteName);
        $sitesDS->themeApply($themeName);

        // @TODO return new site state here to update frontend, currently frontend window is reloaded to get correct site state
        return response()->json($json);
    }

    public function swapContentsBetweenSites(Request $request)
    {
        $json = $request->json()->all();

        $siteSlugFrom = $json['siteSlugFrom'];
        $siteSlugTo = $json['siteSlugTo'];

        $siteFromStorage = new Storage($siteSlugFrom);
        $siteToStorage = new Storage($siteSlugTo);

        $tmpDir = $siteFromStorage->XML_SITES_ROOT . '/' . bin2hex(random_bytes(8));

        // move siteFrom to tmp folder
        $siteFromStorage->moveFolderContents(
            $siteFromStorage->XML_STORAGE_ROOT,
            $tmpDir,
            $siteFromStorage->XML_STORAGE_ROOT == $siteFromStorage->XML_MAIN_ROOT ? ['-sites'] : []
        );

        // move to siteFrom folder from siteTo
        $siteFromStorage->moveFolderContents(
            $siteToStorage->XML_STORAGE_ROOT,
            $siteFromStorage->XML_STORAGE_ROOT,
            $siteToStorage->XML_STORAGE_ROOT == $siteFromStorage->XML_MAIN_ROOT ? ['-sites'] : []
        );

        // move from tmp to siteTo folder
        $siteFromStorage->moveFolderContents(
            $tmpDir,
            $siteToStorage->XML_STORAGE_ROOT,
        );

        // delete tmp folder
        $siteFromStorage->delFolder($tmpDir);

        return response()->json($json);
    }

    public function delete(Request $request)
    {
        $sites = new SitesDataService;
        $json = $request->json()->all();
        $res = $sites->delete($json['site']);

        return response()->json($res);
    }

    public function order(Request $request)
    {
        $sites = new SitesDataService;
        $json = $request->json()->all();
        $sites->order($json);

        return response()->json($json);
    }

    public function renderMenu(Request $request, $site = '')
    {
        $sitesDS = new SitesDataService;
        $sitesMenuRenderService = new SitesMenuRenderService;
        $user = new UserModel;

        return $sitesMenuRenderService->render(
            $site,
            $user,
            true,
            [],
            [],
            $sitesDS->get()
        );
    }

    public function renderHeader(Request $request, $site = '')
    {
        $siteSettingsDS = new SiteSettingsDataService($site);
        $siteSettings = $siteSettingsDS->getState();

        $sectionsDS = new SiteSectionsDataService($site);
        $sections = $sectionsDS->getState();
        $sectionSlug = $request->get('section');

        $siteTemplateSettingsDS = new SiteTemplateSettingsDataService($site, $siteSettings['template']['template']);
        $siteTemplateSettings = $siteTemplateSettingsDS->getState();

        $sitesHeaderRS = new SitesHeaderRenderService;

        return $sitesHeaderRS->render(
            $site,
            $siteSettings,
            $siteTemplateSettings,
            $sections,
            $sectionSlug,
            (new Storage($site)),
            false,
            true
        );
    }

    public function renderSocialMediaLinks(Request $request, $site = '')
    {
        $siteSettingsDS = new SiteSettingsDataService($site);
        $siteSettings = $siteSettingsDS->getState();

        $socialMediaLinksRS = new SocialMediaLinksRenderService;

        return $socialMediaLinksRS->render($siteSettings);
    }

    public function renderBanners(Request $request, $site = '')
    {
        $siteSettingsDS = new SiteSettingsDataService($site);
        $siteSettings = $siteSettingsDS->getState();

        $siteTemplateSettingsDS = new SiteTemplateSettingsDataService($site, $siteSettings['template']['template']);
        $siteTemplateSettings = $siteTemplateSettingsDS->getState();

        $sectionsDS = new SiteSectionsDataService($site);
        $sections = $sectionsDS->getState();
        $sectionSlug = $request->get('section');

        $sitesBannersRS = new SitesBannersRenderService;

        return $sitesBannersRS->render(
            $site,
            $siteSettings,
            $siteTemplateSettings,
            $sections,
            $sectionSlug,
            (new Storage($site)),
            true
        );
    }
}
