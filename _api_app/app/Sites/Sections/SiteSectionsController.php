<?php

namespace App\Sites\Sections;

use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Sites\SocialMediaLinksRenderService;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\SectionsMenuRenderService;
use App\Sites\Sections\AdditionalTextRenderService;
use App\Sites\Sections\AdditionalFooterTextRenderService;
use App\Sites\Sections\Tags\SectionTagsDataService;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;

class SiteSectionsController extends Controller
{
    public function create(Request $request)
    {
        $json = $request->json()->all();
        $cloneFrom = $json['name'];
        $sectionsDataService = new SiteSectionsDataService($json['site']);

        if ($cloneFrom) {
            $section = $sectionsDataService->cloneSection(
                $json['name'],
                $json['title']
            );
        } else {
            $section = $sectionsDataService->create(
                $json['name'],
                $json['title']
            );
        }

        $tags = $cloneFrom ? new SectionTagsDataService($json['site'], $section['name']) : null;
        $entries = $cloneFrom ? new SectionEntriesDataService($json['site'], $section['name']) : null;

        $resp = [
            'section' => $section,
            'tags' => $tags ? $tags->getSectionTagsState() : null,
            'entries' => $entries ? $entries->getState() : null,
        ];

        return response()->json($resp);
    }

    public function update(Request $request)
    {
        $json = $request->json()->all();
        $path_arr = explode('/', $json['path']);
        $site = $path_arr[0];
        $sectionsDataService = new SiteSectionsDataService($site);
        $path_arr = array_slice($path_arr, 1);

        $res = $sectionsDataService->saveValueByPath($json['path'], $json['value']);
        // @@@:TODO: Replace this with something sensible, when migration to redux is done
        $res['update'] = $res['value'];
        // @@@:TODO:END

        return response()->json($res);
    }

    public function delete(Request $request)
    {
        $json = $request->json()->all();
        $sectionsDataService = new SiteSectionsDataService($json['site']);
        $res = $sectionsDataService->delete($json['section']);

        return response()->json($res);
    }

    public function reset(Request $request)
    {
        $json = $request->json()->all();
        $path_arr = explode('/', $json['path']);
        $site = $path_arr[0];
        $sectionsDataService = new SiteSectionsDataService($site);
        $res = $sectionsDataService->deleteValueByPath($json['path']);

        return response()->json($res);
    }

    public function order(Request $request)
    {
        $json = $request->json()->all();
        $sectionsDataService = new SiteSectionsDataService($json['site']);
        $sectionsDataService->order($json['sections']);
        return response()->json($json);
    }

    public function backgroundGalleryDelete(Request $request)
    {
        $json = $request->json()->all();
        $sectionsDataService = new SiteSectionsDataService($json['site']);
        $res = $sectionsDataService->backgroundGalleryDelete($json['section'], $json['file']);
        return response()->json($res);
    }

    public function backgroundGalleryOrder(Request $request)
    {
        $json = $request->json()->all();
        $sectionsDataService = new SiteSectionsDataService($json['site']);
        $ret = $sectionsDataService->backgroundGalleryOrder($json['section'], $json['files']);
        return response()->json($ret);
    }

    public function backgroundGalleryUpload(Request $request)
    {
        $file = $request->file('value');
        $path = $request->get('path');

        if (!$file->isValid()) {
            return response()->json([
                'status' => 0,
                'error' => 'Upload failed.'
            ]);
        }

        $validator = Validator::make(['file' => $file], [
            'file' => 'max:' . config('app.image_max_file_size') . '|mimes:' . implode(',', config('app.image_mimes')) . '|not_corrupted_image'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 0,
                'error' => implode(' ', $validator->messages()->all())
            ]);
        }

        $path_arr = explode('/', $path);
        $site = $path_arr[0];
        $sectionsDataService = new SiteSectionsDataService($site);
        $mediaRootDir = $sectionsDataService->getOrCreateMediaDir();

        if (!is_writable($mediaRootDir)) {
            return response()->json([
                'status' => 0,
                'error' => 'Media folder not writable.'
            ]);
        }
        $ret = $sectionsDataService->backgroundGalleryUpload($path, $file);

        return response()->json($ret);
    }

    public function renderMenu($site = '', Request $request)
    {
        $sectionsDS = new SiteSectionsDataService($site);
        $sections = $sectionsDS->getState();
        $sectionSlug = $request->get('section');
        $tagSlug = $request->get('tag');
        $siteSettingsDS = new SiteSettingsDataService($site);
        $siteSettings = $siteSettingsDS->getState();
        $siteTemplateSettingsDS = new SiteTemplateSettingsDataService($site, $siteSettings['template']['template']);
        $siteTemplateSettings = $siteTemplateSettingsDS->getState();
        $sectionTagsDS = new SectionTagsDataService($site);
        $sectionTags = $sectionTagsDS->get();

        $sectionsMenuRS = new SectionsMenuRenderService(
            $site,
            $sections,
            $sectionSlug,
            $siteSettings,
            $siteTemplateSettings,
            $sectionTags,
            $tagSlug,
            false,
            true
        );

        return $sectionsMenuRS->render();
    }

    public function renderAdditionalText($site = '', Request $request)
    {
        $siteSettingsDS = new SiteSettingsDataService($site);
        $siteSettings = $siteSettingsDS->getState();

        $siteTemplateSettingsDS = new SiteTemplateSettingsDataService($site, $siteSettings['template']['template']);
        $siteTemplateSettings = $siteTemplateSettingsDS->getState();

        $sectionsDS = new SiteSectionsDataService($site);
        $sections = $sectionsDS->getState();

        $sectionSlug = $request->get('section');
        $isEditMode = true;

        $socialMediaLinksRS = new SocialMediaLinksRenderService();
        $additionalTextRS = new AdditionalTextRenderService($socialMediaLinksRS);

        return $additionalTextRS->render(
            $site,
            $siteSettings,
            $siteTemplateSettings,
            $sections,
            $sectionSlug,
            $isEditMode
        );
    }

    public function renderAdditionalFooterText($siteSlug = '')
    {
        $siteSettingsDS = new SiteSettingsDataService($siteSlug);
        $siteSettings = $siteSettingsDS->getState();
        $isEditMode = true;

        $socialMediaLinksRS = new SocialMediaLinksRenderService();
        $additionalTextRS = new AdditionalFooterTextRenderService($socialMediaLinksRS);

        return $additionalTextRS->render($siteSlug, $siteSettings, $isEditMode);
    }
}
