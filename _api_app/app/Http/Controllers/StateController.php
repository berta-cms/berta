<?php

namespace App\Http\Controllers;

use App\Configuration\SiteSettingsConfigService;
use App\Configuration\SiteTemplatesConfigService;
use App\Shared\Helpers;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\Tags\SectionTagsDataService;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\SitesDataService;
use App\Sites\SocialMediaLinksRenderService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;
use App\Sites\ThemesDataService;
use App\User\UserModel;
use Illuminate\Http\Request;

class StateController extends Controller
{
    public function get($site = '')
    {
        $site = $site === '0' ? '' : $site;
        $sitesDataService = new SitesDataService;
        $siteSettingsConfigService = new SiteSettingsConfigService;
        $siteTemplatesConfigService = new SiteTemplatesConfigService;
        $allTemplates = $siteTemplatesConfigService->getAllTemplates();

        $state['urls'] = [
            'sites' => route('sites'),
            'siteSettings' => route('site_settings'),
            'siteSettingsUpload' => route('site_settings_upload'),
            'siteTemplateSettings' => route('site_template_settings'),
            'siteTemplateSettingsUpload' => route('site_template_settings_upload'),
            'siteThemePreview' => route('site_theme_preview'),
            'siteThemeApply' => route('site_theme_apply'),
            'localeSettings' => route('locale_settings'),
            'siteSections' => route('site_sections'),
            'siteSectionsReset' => route('site_sections_reset'),
            'siteSectionBackgrounds' => route('site_section_backgrounds'),
            'sectionTags' => route('section_tags'),
            'sectionEntries' => route('section_entries'),
            'sectionEntriesMove' => route('section_entries_move'),
            'entryGallery' => route('entry_gallery'),
            'entryGalleryUpload' => route('entry_gallery_upload'),
        ];
        $state['sites'] = $sitesDataService->getState();
        $state['site_settings'] = [];
        $state['site_sections'] = [];
        $state['sectionEntries'] = [];
        $state['section_tags'] = [];

        foreach ($state['sites'] as $_site) {
            $siteName = $_site['name'];

            $siteSettingsDataService = new SiteSettingsDataService($siteName);
            $siteSettings = $siteSettingsDataService->getState();
            $state['site_settings'][$siteName] = $siteSettings;
            $sectionsDataService = new SiteSectionsDataService($siteName);
            $siteSections = $sectionsDataService->getState();
            $state['site_sections'] = array_merge($state['site_sections'], $siteSections);

            foreach ($allTemplates as $template) {
                $templateSettingsDataService = new SiteTemplateSettingsDataService(
                    $siteName,
                    $template
                );
                $templateSettings = $templateSettingsDataService->getState();

                if (! ($templateSettings)) {
                    $templateSettings = (object) null;
                }

                $state['site_template_settings'][$siteName][$template] = $templateSettings;
            }

            $state['sectionEntries'][$siteName] = [];
            foreach ($siteSections as $section) {
                $sectionName = $section['name'];
                $sectionEntriesDataService = new SectionEntriesDataService($siteName, $sectionName);
                $state['sectionEntries'][$siteName] = array_merge($state['sectionEntries'][$siteName], $sectionEntriesDataService->getState());
            }

            $tagsDataService = new SectionTagsDataService($siteName);
            $state['section_tags'][$siteName] = $tagsDataService->getState();
        }

        $lang = 'en';

        if (isset($state['site_settings'][$site]['language'])) {
            $lang = $state['site_settings'][$site]['language']['language'];
        }

        $state['siteTemplates'] = $siteTemplatesConfigService->get($lang);
        $state['siteSettingsConfig'] = $siteSettingsConfigService->get($lang);

        return response()->json($state);
    }

    public function getMeta()
    {
        include realpath(config('app.old_berta_root') . '/engine/inc.version.php');
        $user = new UserModel;
        $themesDS = new ThemesDataService;
        $meta = [
            'version' => $options['version'],
            'forgotPasswordUrl' => $user->forgot_password_url,
            'loginUrl' => $user->profile_url ? $user->profile_url : route('login'),
            'authenticateUrl' => route('authenticate'),
            'isBertaHosting' => $user->profile_url != false,
            'plans' => $user->plans,
            'themes' => $themesDS->getThemes(),
            'socialMediaIcons' => SocialMediaLinksRenderService::getSocialMediaIcons(),
            'rowGalleryImageLimit' => config('app.row_gallery_image_limit'),
            'gridImagePrefix' => config('app.grid_image_prefix'),
        ];

        return Helpers::api_response('', $meta);
    }

    public function getSentryDSN()
    {
        return response(env('SENTRY_FRONTEND_DSN', ''))->header('Content-Type', 'text/plain; charset=UTF-8');
    }

    /**
     * Returns translated settings for site localization: templates and settings config
     *
     * @return json
     */
    public function getLocaleSettings(Request $request)
    {
        $lang = $request->query('language');

        $siteTemplatesConfigService = new SiteTemplatesConfigService;
        $state['siteTemplates'] = $siteTemplatesConfigService->get($lang);

        $siteSettingsConfigService = new SiteSettingsConfigService;
        $state['siteSettingsConfig'] = $siteSettingsConfigService->get($lang);

        return response()->json($state);
    }
}
