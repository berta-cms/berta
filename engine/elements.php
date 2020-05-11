<?php
use App\Shared\Storage;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\SectionBackgroundGalleryEditorRenderService;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\Sections\Entries\SectionEntryRenderService;
use App\Sites\Sections\Entries\Galleries\EntryGalleryEditorRenderService;

define('AUTH_AUTHREQUIRED', true);
define('BERTA_ENVIRONMENT', 'engine');
include 'inc.page.php';
include_once '_classes/Zend/Json.php';
include_once '_classes/class.array_xml.php';
include_once '_classes/class.bertaeditor.php';

header('Content-Type: text/plain; charset=utf8');

$jsonRequest = !empty($_REQUEST['json']) ? stripslashes($_REQUEST['json']) : false;

if ($jsonRequest) {
    $decoded = $result = Zend_Json::decode(str_replace(["\n", "\r"], ['\n', ''], $jsonRequest));
    $site = !empty($_REQUEST['site']) ? $_REQUEST['site'] : '';
    $isMessyTemplate = strpos($berta->settings->get('template', 'template'), 'messy') === 0;

    $siteSettingsDS = new SiteSettingsDataService($site);
    $siteSettings = $siteSettingsDS->getState();
    $siteSectionsDS = new SiteSectionsDataService($site);
    $sections = $siteSectionsDS->getState();
    $section = $siteSectionsDS->get($decoded['section']);
    $storageService = new Storage($site);

    if (!empty($decoded['entry'])) {
        $sectionEntriesDS = new SectionEntriesDataService($site, $decoded['section']);
        $entries = $sectionEntriesDS->get();
        $entryIndex = array_search($decoded['entry'], array_column($entries['entry'], 'id'));
        $entry = $entries['entry'][$entryIndex];
    }

    switch ($decoded['property']) {
        case 'gallery':
            if ($decoded['section'] && $decoded['entry']) {
                $siteTemplateSettingsDS = new SiteTemplateSettingsDataService($site);
                $sectionEntriesRS = new SectionEntryRenderService();

                echo $sectionEntriesRS->getViewData(
                    $site,
                    $sections,
                    $entry,
                    $section,
                    $siteSettings,
                    $siteTemplateSettingsDS->getState(),
                    $storageService,
                    true,
                    isset($shopEnabled) && $shopEnabled
                )['gallery'];
            }

            break;

        case 'galleryEditor':
            if ($decoded['section'] && $decoded['entry']) {
                $entryGalleryEditorRS = new EntryGalleryEditorRenderService();

                echo $entryGalleryEditorRS->render(
                    $site,
                    $siteSettings,
                    $section,
                    $storageService,
                    $entry
                );
            }

            break;

        case 'bgEditor':
            if ($decoded['section']) {
                $backgroundGalleryEditorRS = new SectionBackgroundGalleryEditorRenderService();

                echo $backgroundGalleryEditorRS->render(
                    $site,
                    $decoded['section'],
                    $sections,
                    $storageService
                );
            }
            break;
    }
}
