<?php

namespace App\Sites\Sections;

use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User\UserModel;
use App\Shared\Storage;
use App\Shared\Helpers;
use App\Configuration\SiteTemplatesConfigService;
use App\Sites\SitesDataService;
use App\Sites\SocialMediaLinksRenderService;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\SectionsMenuRenderService;
use App\Sites\Sections\SitemapRenderService;
use App\Sites\Sections\SectionBackgroundGalleryRenderService;
use App\Sites\Sections\SectionBackgroundGalleryEditorRenderService;
use App\Sites\Sections\GridViewRenderService;
use App\Sites\Sections\SectionFooterRenderService;
use App\Sites\Sections\SectionHeadRenderService;
use App\Sites\Sections\AdditionalTextRenderService;
use App\Sites\Sections\AdditionalFooterTextRenderService;
use App\Sites\Sections\WhiteTemplateRenderService;
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

    public function renderMenu(Request $request, $site = '')
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

        $sectionsMenuRS = new SectionsMenuRenderService();

        return $sectionsMenuRS->render(
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
    }

    public function renderSitemap(Request $request, $siteSlug = '')
    {
        $sectionsDS = new SiteSectionsDataService($siteSlug);
        $sections = $sectionsDS->getState();

        $sectionTagsDS = new SectionTagsDataService($siteSlug);
        $sectionTags = $sectionTagsDS->get();

        $sitemapRS = new SitemapRenderService();

        return $sitemapRS->render(
            $request,
            $siteSlug,
            $sections,
            $sectionTags
        );
    }

    public function renderAdditionalText(Request $request, $site = '')
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
        $user = new UserModel();
        $additionalTextRS = new AdditionalFooterTextRenderService($socialMediaLinksRS);

        return $additionalTextRS->render($siteSlug, $siteSettings, $user, $isEditMode);
    }

    public function renderHead(Request $request, $site = '')
    {
        $sectionsDS = new SiteSectionsDataService($site);
        $sections = $sectionsDS->getState();
        $sectionSlug = $request->get('section');
        $tagSlug = $request->get('tag');
        $sectionTagsDS = new SectionTagsDataService($site);
        $sectionTags = $sectionTagsDS->get();
        $siteSettingsDS = new SiteSettingsDataService($site);
        $siteSettings = $siteSettingsDS->getState();
        $siteTemplateSettingsDS = new SiteTemplateSettingsDataService($site, $siteSettings['template']['template']);
        $siteTemplateSettings = $siteTemplateSettingsDS->getState();
        $siteTemplatesConfigService = new SiteTemplatesConfigService();
        $siteTemplatesConfig = $siteTemplatesConfigService->getDefaults();
        $user = new UserModel();

        $isShopAvailable = Helpers::isValidDomain($request->getHost(), config('plugin-Shop.key'));
        $isEditMode = true;
        $isPreviewMode = false;
        $storageService = new Storage($site, $isPreviewMode);

        $sectionHeadRS = new SectionHeadRenderService();

        return $sectionHeadRS->render(
            $site,
            $sections,
            $sectionSlug,
            $tagSlug,
            $sectionTags,
            $siteSettings,
            $siteTemplateSettings,
            $siteTemplatesConfig,
            $user,
            $storageService,
            $isShopAvailable,
            $isPreviewMode,
            $isEditMode
        );
    }

    public function renderFooter(Request $request, $site = '')
    {
        $sectionsDS = new SiteSectionsDataService($site);
        $sections = $sectionsDS->getState();
        $siteSettingsDS = new SiteSettingsDataService($site);
        $siteSettings = $siteSettingsDS->getState();
        $isEditMode = false;
        $user = new UserModel();

        $sectionFooterRS = new SectionFooterRenderService();

        return $sectionFooterRS->render(
            $siteSettings,
            $sections,
            $user,
            $request,
            $isEditMode
        );
    }

    public function renderBackgroundGallery(Request $request, $siteSlug = '')
    {
        $siteSettingsDS = new SiteSettingsDataService($siteSlug);
        $siteSettings = $siteSettingsDS->getState();
        $siteTemplateSettingsDS = new SiteTemplateSettingsDataService($siteSlug, $siteSettings['template']['template']);
        $siteTemplateSettings = $siteTemplateSettingsDS->getState();
        $sectionSlug = $request->get('section');
        $sectionsDS = new SiteSectionsDataService($siteSlug);
        $sections = $sectionsDS->getState();
        $isEditMode = true;
        $isPreviewMode = false;
        $storageService = new Storage($siteSlug, $isPreviewMode);

        $sectionBackgroundGalleryRS = new SectionBackgroundGalleryRenderService();

        return $sectionBackgroundGalleryRS->render(
            $storageService,
            $siteSettings,
            $siteTemplateSettings,
            $sectionSlug,
            $sections,
            $request,
            $isEditMode
        );
    }

    public function renderBackgroundGalleryEditor(Request $request, $siteSlug = '')
    {
        $sectionsDS = new SiteSectionsDataService($siteSlug);
        $sections = $sectionsDS->getState();
        $sectionSlug = $request->get('section');
        $storageService = new Storage($siteSlug);

        $backgroundGalleryEditorRS = new SectionBackgroundGalleryEditorRenderService();

        return $backgroundGalleryEditorRS->render(
            $siteSlug,
            $sectionSlug,
            $sections,
            $storageService
        );
    }

    public function renderGridView(Request $request, $siteSlug = '')
    {
        $siteSettingsDS = new SiteSettingsDataService($siteSlug);
        $siteSettings = $siteSettingsDS->getState();
        $sectionSlug = $request->get('section');
        $sectionsDS = new SiteSectionsDataService($siteSlug);
        $sections = $sectionsDS->getState();
        $tagSlug = $request->get('tag');
        $isEditMode = false;
        $isPreviewMode = false;
        $storageService = new Storage($siteSlug, $isPreviewMode);

        $gridViewRS = new GridViewRenderService();

        return $gridViewRS->render(
            $siteSlug,
            $storageService,
            $siteSettings,
            $sectionSlug,
            $sections,
            $tagSlug,
            $request,
            $isPreviewMode,
            $isEditMode
        );
    }

    public function renderTemplate(Request $request, $siteSlug = '')
    {
        $sitesDataService = new SitesDataService();
        $sites = $sitesDataService->get();

        $siteSettingsDS = new SiteSettingsDataService($siteSlug);
        $siteSettings = $siteSettingsDS->getState();

        $sectionsDS = new SiteSectionsDataService($siteSlug);
        $sections = $sectionsDS->getState();

        $sectionSlug = $request->get('section');
        $tagSlug = $request->get('tag');

        $sectionTagsDS = new SectionTagsDataService($siteSlug);
        $tags = $sectionTagsDS->get();

        $siteTemplateSettingsDS = new SiteTemplateSettingsDataService($siteSlug, $siteSettings['template']['template']);
        $siteTemplateSettings = $siteTemplateSettingsDS->getState();

        $siteTemplatesConfigService = new SiteTemplatesConfigService();
        $siteTemplatesConfig = $siteTemplatesConfigService->getDefaults();

        $user = new UserModel();

        $isShopAvailable = Helpers::isValidDomain($request->getHost(), config('plugin-Shop.key'));
        $isEditMode = false;
        $isPreviewMode = false;
        $storageService = new Storage($siteSlug, $isPreviewMode);

        $sectionEntriesDS = new SectionEntriesDataService($siteSlug, $sectionSlug);
        $entries = $sectionEntriesDS->getByTag($tagSlug, $isEditMode);

        $templateName = explode('-', $siteSettings['template']['template'])[0];

        switch ($templateName) {
            case 'white':
                $templateRenderService = new WhiteTemplateRenderService();
                break;

            case 'default':
                $templateRenderService = new DefaultTemplateRenderService();
                break;

            case 'mashup':
                $templateRenderService = new MashupTemplateRenderService();
                break;

            default:
                // Messy
                $templateRenderService = new MessyTemplateRenderService();
                break;
        }

        return $templateRenderService->render(
            $request,
            $sites,
            $siteSlug,
            $sections,
            $sectionSlug,
            $tagSlug,
            $tags,
            $entries,
            $siteSettings,
            $siteTemplateSettings,
            $siteTemplatesConfig,
            $user,
            $storageService,
            $isShopAvailable,
            $isPreviewMode,
            $isEditMode
        );
    }
}
