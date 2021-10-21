<?php

namespace App\Sites\Sections\Entries;

use Validator;
use Illuminate\Http\Request;
use App\Shared\Storage;
use App\Shared\Helpers;
use App\Http\Controllers\Controller;

use App\Configuration\SiteTemplatesConfigService;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\Sections\Entries\SectionEntryRenderService;
use App\Sites\Sections\Entries\SectionMashupEntriesRenderService;
use App\Sites\Sections\Entries\PortfolioThumbnailsRenderService;
use App\Sites\Sections\Entries\Galleries\EntryGalleryEditorRenderService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;

class SectionEntriesController extends Controller
{

    public function create(Request $request)
    {
        $json = $request->json()->all();
        $sectionEntriesDataService = new SectionEntriesDataService($json['site'], $json['section']);
        $res = $sectionEntriesDataService->createEntry(null, $json['before_entry'], $json['tag']);

        return response()->json($res);
    }

    public function update(Request $request)
    {
        $json = $request->json()->all();
        $path_arr = explode('/', $json['path']);
        $site = $path_arr[0];
        $sectionName = $path_arr[2];
        $sectionEntriesDataService = new SectionEntriesDataService($site, $sectionName);
        $res = $sectionEntriesDataService->saveValueByPath($json['path'], $json['value']);

        // @@@:TODO: Replace this with something sensible, when migration to redux is done
        $res['update'] = $res['value'];
        // @@@:TODO:END

        return response()->json($res);
    }

    public function order(Request $request)
    {
        $json = $request->json()->all();
        $sectionEntriesDataService = new SectionEntriesDataService($json['site'], $json['section']);
        $res = $sectionEntriesDataService->order($json['entryId'], $json['value']);
        return response()->json($res);
    }

    /**
     * Move entry to other section
     */
    public function move(Request $request)
    {
        $json = $request->json()->all();
        $sectionEntriesDataService = new SectionEntriesDataService($json['site'], $json['currentSection']);
        $res = $sectionEntriesDataService->moveEntry($json['entryId'], $json['toSection']);
        return response()->json($res);
    }

    public function delete(Request $request)
    {
        $json = $request->json()->all();
        $sectionEntriesDataService = new SectionEntriesDataService($json['site'], $json['section']);
        $res = $sectionEntriesDataService->deleteEntry($json['entryId']);
        return response()->json($res);
    }

    public function galleryOrder(Request $request)
    {
        $json = $request->json()->all();
        $sectionEntriesDataService = new SectionEntriesDataService($json['site'], $json['section']);
        $ret = $sectionEntriesDataService->galleryOrder($json['section'], $json['entryId'], $json['files']);
        return response()->json($ret);
    }

    public function galleryDelete(Request $request)
    {
        $json = $request->json()->all();
        $sectionEntriesDataService = new SectionEntriesDataService($json['site'], $json['section']);
        $ret = $sectionEntriesDataService->galleryDelete($json['section'], $json['entryId'], $json['file']);
        return response()->json($ret);
    }

    public function galleryUpload(Request $request)
    {
        $file = $request->file('value');
        $path = $request->get('path');
        $isVideoPosterImage = count(explode('/', $path)) == 5;

        if (!$file->isValid()) {
            return response()->json([
                'status' => 0,
                'error' => 'Upload failed.'
            ]);
        }

        $isImage = in_array($file->guessExtension(), config('app.image_mimes')) || $isVideoPosterImage;
        $validator = Validator::make(['file' => $file], [
            'file' => $isImage ?
                'max:' .  config('app.image_max_file_size') . '|mimes:' . implode(',', config('app.image_mimes')) . '|not_corrupted_image'
                :
                'max:' .  config('app.video_max_file_size') . '|mimes:' . implode(',', config('app.video_mimes'))
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 0,
                'error' => implode(' ', $validator->messages()->all())
            ]);
        }

        $path_arr = explode('/', $path);
        $site = $path_arr[0];
        $section = $path_arr[2];
        $sectionEntriesDataService = new SectionEntriesDataService($site, $section);
        $mediaDir = $sectionEntriesDataService->getOrCreateMediaDir();

        if (!is_writable($mediaDir)) {
            return response()->json([
                'status' => 0,
                'error' => 'Media folder not writable.'
            ]);
        }

        $ret = $sectionEntriesDataService->galleryUpload($path, $file);

        return response()->json($ret);
    }

    public function galleryCrop(Request $request)
    {
        $data = $request->all();
        $sectionEntriesDataService = new SectionEntriesDataService($data['site'], $data['section']);
        $ret = $sectionEntriesDataService->galleryCrop($data);
        return response()->json($ret);
    }

    /**
     * This method is entry rendering example
     */
    public function renderEntries($site, $section, Request $request, $id=null) {
        $sectionEntriesDS = new SectionEntriesDataService($site, $section);
        $siteSectionsDS = new SiteSectionsDataService($site);
        $siteSettingsDS = new SiteSettingsDataService($site);
        $siteTemplateSettingsDS = new SiteTemplateSettingsDataService($site);

        $sections = $siteSectionsDS->getState();
        $sectionData = $siteSectionsDS->get($section);
        if (!$sectionData) {
            return abort(404, "Section with name {$section} not found!");
        }

        $res = '';
        $sectionEntriesRS = new SectionEntryRenderService();
        foreach ($sectionEntriesDS->get()['entry'] as $entry) {
            if ($id !== null && $entry['id'] !== $id) {
                continue;
            }

            $res .= $sectionEntriesRS->render(
                $site,
                $sections,
                $entry,
                $sectionData,
                $siteSettingsDS->getState(),
                $siteTemplateSettingsDS->getState(),
                (new Storage($site)),
                false,
                Helpers::isValidDomain($request->getHost(), config('plugin-Shop.key'))
            );
        }

        if ($res === '' && $id !== null) {
            return abort(404, "Entry with id {$id} not found!");
        }

        return response($res);
    }

    public function renderEntryGalleryEditor($section, $id, $site = '')
    {
        $siteSettingsDS = new SiteSettingsDataService($site);
        $siteSettings = $siteSettingsDS->getState();
        $siteSectionsDS = new SiteSectionsDataService($site);
        $siteSection = $siteSectionsDS->get($section);

        if (empty($section)) {
            return abort(404, "Section with name {$section} not found!");
        }

        $sectionEntriesDS = new SectionEntriesDataService($site, $section);
        $entries = $sectionEntriesDS->get()['entry'];
        $index = array_search($id, array_column($entries, 'id'));

        if ($index === false) {
            return abort(404, "Entry with id {$id} not found!");
        }

        $entry = $entries[$index];
        $storageService = new Storage($site);
        $entryGalleryEditorRS = new EntryGalleryEditorRenderService();

        return $entryGalleryEditorRS->render(
            $site,
            $siteSettings,
            $siteSection,
            $storageService,
            $entry
        );
    }

    public function renderMashupEntries(Request $request, $site = '')
    {
        $siteSettingsDS = new SiteSettingsDataService($site);
        $siteSettings = $siteSettingsDS->getState();
        $siteTemplateSettingsDS = new SiteTemplateSettingsDataService($site, $siteSettings['template']['template']);
        $siteTemplateSettings = $siteTemplateSettingsDS->getState();
        $sectionsDS = new SiteSectionsDataService($site);
        $sections = $sectionsDS->getState();
        $sectionSlug = $request->get('section');
        $tagSlug = $request->get('tag');
        $isPreviewMode = false;
        $isEditMode = false;

        $storageService = new Storage($site, $isPreviewMode);
        $siteTemplatesConfigService = new SiteTemplatesConfigService();
        $mashupEntriesRS = new SectionMashupEntriesRenderService($siteTemplatesConfigService);

        return $mashupEntriesRS->render(
            $storageService,
            $site,
            $siteSettings,
            $siteTemplateSettings,
            $sections,
            $sectionSlug,
            $tagSlug,
            $isPreviewMode,
            $isEditMode
        );
    }

    public function renderPortfolioThumbnails($site, $sectionName)
    {
        $siteSettingsDS = new SiteSettingsDataService($site);
        $siteSettings = $siteSettingsDS->getState();

        $siteSectionsDS = new SiteSectionsDataService($site);
        $section = $siteSectionsDS->get($sectionName);

        $sectionEntriesDS = new SectionEntriesDataService($site, $sectionName);
        $entries = $sectionEntriesDS->get()['entry'];

        $storageService = new Storage($site);

        $isEditMode = true;

        $portfolioThumbnailsRS = new PortfolioThumbnailsRenderService();

        return $portfolioThumbnailsRS->render($siteSettings, $storageService, $section, $entries, $isEditMode);
    }
}
