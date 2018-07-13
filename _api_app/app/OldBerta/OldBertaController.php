<?php

namespace App\OldBerta;

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
class OldBertaController extends Controller
{
    public function root($siteOrSection = '', $sectionOrTag = '', $tag = '')
    {
        global $berta;
        // , $options;

        // dd($options);
        // global $INDEX_INCLUDED, $berta;
        // return "TEST!!";

        // $logFile = fopen('/home/vagrant/berta/_api_app/storage/logs/lumen.log', 'a');
        // fwrite($logFile, "\ntest\n");
        // fclose($logFile);
        // ob_start();
        // echo '<pre>';
        // echo nl2br(fread($logFile, filesize($logFile)));
        // echo '</pre>';
        // return ob_get_clean();

        \Log::info(print_r([$siteOrSection, $sectionOrTag, $tag], true));
        // return 1;


        $INDEX_INCLUDED = true;
        ob_start();
        include 'engine/index.php';
        $response = ob_get_clean();
        return $response;
    }

    public function id($id, $idd = '') {
        return 'This is id: '. $id . PHP_EOL. 'IDD: '. $idd;
    }

    public function sections_php() {
        return 'This is sections!';
    }

    public function engine() {
        ob_start();
        include 'engine/index.php';
        $response = ob_get_clean();
        return $response;
    }

    public function engine_login() {
        ob_start();
        include 'engine/login.php';
        $response = ob_get_clean();
        return $response;
    }

    public function renderEntry()
    {
        $entriesDataService = new SectionEntriesDataService('', 'section-one');
        $entry = current($entriesDataService->get()['entry']);

        $sectionsDataService = new SiteSectionsDataService('');
        $section = current($sectionsDataService->get());

        $siteSettingsDataService = new SiteSettingsDataService('');
        $siteSettings = $siteSettingsDataService->getState();

        $siteTemplateSettingsDataService = new SiteTemplateSettingsDataService('', 'messy-0.4.2');
        $siteTemplateSettings = $siteTemplateSettingsDataService->getState();

        $storageService = new Storage('');

        $entryRenderService = new SectionEntryRenderService(
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
