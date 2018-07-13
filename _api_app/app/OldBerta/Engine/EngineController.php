<?php

namespace App\OldBerta\Engine;

use App\Http\Controllers\Controller;
use App\Shared\Storage;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\Sections\Entries\SectionEntryRenderService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;

/**
 * @class EngineController
 *
 * This is Old Bertas editor - all the urls under /engine
 *
 * @todo: User must be logged in
 */
class EngineController extends Controller
{
    public function root()
    {
        global $INDEX_INCLUDED, $berta;

        $INDEX_INCLUDED = false;
        ob_start();
        include 'engine/index.php';
        $response = ob_get_clean();
        return $response;
    }
}
