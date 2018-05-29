<?php

$app->group(['prefix' => 'v1', 'namespace' => 'App\Dev'], function () use ($app) {
    $app->get('test', 'TestController@get');

    $app->get('render-entry', function () {
        $entriesDataService = new App\Sites\Sections\Entries\SectionEntriesDataService('', 'section-one');
        $entry = current($entriesDataService->get()['entry']);

        $sectionsDataService = new App\Sites\Sections\SiteSectionsDataService('');
        $section = current($sectionsDataService->get());

        $siteSettingsDataService = new App\Sites\Settings\SiteSettingsDataService('');

        $siteTemplateSettingsDataService = new App\Sites\TemplateSettings\SiteTemplateSettingsDataService('', 'messy-0.4.2');

        $storageService = new App\Shared\Storage('');

        $entryRenderService = new App\Sites\Sections\Entries\SectionEntryRenderService([
            'entry' => $entry,
            'section' => $section,
            'siteSettings' => $siteSettingsDataService->getState(),
            'siteTemplateSettings' => $siteTemplateSettingsDataService->getState(),
            'storageService' => $storageService,
            'isEditMode' => true,
            'isShopAvailable' => true,
        ]);

        return $entryRenderService->render();
    });
});
