<?php

namespace App\Sites\Sections\Entries;

use Validator;
use Illuminate\Http\Request;
use App\Shared\Storage;
use App\Http\Controllers\Controller;

use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\Sections\Entries\SectionEntryRenderService;
use App\Sites\Sections\Entries\PortfolioThumbnailsRenderService;
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
        $posterVideo = explode('/', $path)[4];

        if (!$file->isValid()) {
            return response()->json([
                'status' => 0,
                'error' => 'Upload failed.'
            ]);
        }

        $isImage = in_array($file->guessExtension(), config('app.image_mimes')) || $posterVideo;
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
    public function renderEntries($site, $section, $id=null, Request $request) {
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
        foreach ($sectionEntriesDS->get()['entry'] as $entry) {
            if ($id !== null && $entry['id'] !== $id) {
                continue;
            }

            $sectionEntriesRS = new SectionEntryRenderService(
                $site,
                $sections,
                $entry,
                $sectionData,
                $siteSettingsDS->getState(),
                $siteTemplateSettingsDS->getState(),
                (new Storage($site)),
                false,
                config('plugin-Shop.key') === $request->getHost()
            );
            $res .= $sectionEntriesRS->render();
        }

        if ($res === '' && $id !== null) {
            return abort(404, "Entry with id {$id} not found!");
        }

        return response($res);
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
