<?php

namespace App\Dev;

use App\Http\Controllers\Controller;
use App\Shared\Storage;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\Sections\Entries\SectionEntryRenderService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;

/**
 * @class TestController
 *
 * This class is created for the purpose of easy testing of data services while developing.
 * @todo: Replace this with automated testing
 */
class TestController extends Controller
{
    public function get()
    {
        return "THIS IS TEST!!!";
    }

    public function renderEntry()
    {
        $entriesDataService = new SectionEntriesDataService('', 'section-one');
        $entry = current($entriesDataService->get()['entry']);

        $sectionsDataService = new SiteSectionsDataService('');
        $sections = $sectionsDataService->getState();
        $section = current($sectionsDataService->get());

        $siteSettingsDataService = new SiteSettingsDataService('');
        $siteSettings = $siteSettingsDataService->getState();

        $siteTemplateSettingsDataService = new SiteTemplateSettingsDataService('', 'messy-0.4.2');
        $siteTemplateSettings = $siteTemplateSettingsDataService->getState();

        $storageService = new Storage('');

        $entryRenderService = new SectionEntryRenderService(
            '',
            $sections,
            $entry,
            $section,
            $siteSettings,
            $siteTemplateSettings,
            $storageService,
            true,
            true
        );

        return $entryRenderService->render();
    }
}
