<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
 */
$app->group(['namespace' => 'App\Http\Controllers'], function () use ($app) {
    $app->post('auth/login', ['uses' => 'AuthController@authenticate', 'middleware' => 'setup']);
    $app->get('auth/login', ['as'=> 'authenticate', 'uses' => 'AuthController@authenticate', 'middleware' => 'setup']);
    $app->post('v1/login', ['as' => 'login', 'uses' => 'AuthController@apiLogin', 'middleware' => 'setup']);
    $app->put('v1/logout', ['uses' => 'AuthController@apiLogout', 'middleware' => 'setup']);


    $app->get('v1/meta', ['uses' => 'StateController@getMeta', 'middleware' => 'setup']);
    $app->get('v1/sentry-dsn', ['uses' => 'StateController@getSentryDSN', 'middleware' => 'setup']);
});

$app->group(['prefix' => 'v1','namespace' => 'App\Http\Controllers', 'middleware' => ['setup', 'auth']], function () use ($app) {

    $app->patch('user/changepassword', 'AuthController@changePassword');

    $app->get('state[/{site}]', 'StateController@get');
    $app->get('locale-settings', ['as'=>'locale_settings', 'prefix'=>'locale_settings', 'uses' => 'StateController@getLocaleSettings']);

});

$app->group(['prefix' => 'v1','namespace' => 'App\Sites', 'middleware' => ['setup', 'auth']], function () use ($app) {
    $app->post('sites', ['as' => 'sites', 'uses' => 'SitesController@create']);
    $app->patch('sites', 'SitesController@update');
    $app->put('sites', 'SitesController@order');
    $app->delete('sites', 'SitesController@delete');

    $app->post('sites/theme-preview', ['as' => 'site_theme_preview', 'uses' => 'SitesController@themePreview']);
    $app->put('sites/theme-apply', ['as' => 'site_theme_apply', 'uses' => 'SitesController@themeApply']);

    $app->get('sites/render-menu[/{site}]', 'SitesController@renderMenu');
    $app->get('sites/render-header[/{site}]', 'SitesController@renderHeader');
    $app->get('sites/render-banners[/{site}]', 'SitesController@renderBanners');
    $app->get('sites/render-social-media-links[/{site}]', 'SitesController@renderSocialMediaLinks');

    $app->patch('sites/settings', ['as' => 'site_settings', 'uses' => 'Settings\SiteSettingsController@update']);
    $app->post('sites/settings/upload', ['as' => 'site_settings_upload', 'uses' => 'Settings\SiteSettingsController@upload']);
    $app->post('sites/settings', 'Settings\SiteSettingsController@createChildren');
    $app->delete('sites/settings', 'Settings\SiteSettingsController@deleteChildren');

    $app->patch('sites/template-settings', ['as' => 'site_template_settings', 'uses' => 'TemplateSettings\SiteTemplateSettingsController@update']);
    $app->post('sites/template-settings/upload', ['as' => 'site_template_settings_upload', 'uses' => 'TemplateSettings\SiteTemplateSettingsController@upload']);
});

$app->group(['prefix' => 'v1/sites', 'namespace' => 'App\Sites\Sections', 'middleware' => ['setup', 'auth']], function () use ($app) {
    $app->post('sections', ['as' => 'site_sections', 'uses' => 'SiteSectionsController@create']);
    $app->patch('sections', 'SiteSectionsController@update');
    $app->patch('sections/reset', ['as' => 'site_sections_reset', 'uses' => 'SiteSectionsController@reset']);
    $app->put('sections', 'SiteSectionsController@order');
    $app->delete('sections', 'SiteSectionsController@delete');

    $app->get('sections/render-head[/{site}]', 'SiteSectionsController@renderHead');
    $app->get('sections/render-menu[/{site}]', 'SiteSectionsController@renderMenu');
    $app->get('sections/render-sitemap[/{siteSlug}]', 'SiteSectionsController@renderSitemap');
    $app->get('sections/render-background-gallery[/{siteSlug}]', 'SiteSectionsController@renderBackgroundGallery');
    $app->get('sections/render-background-gallery-editor[/{siteSlug}]', 'SiteSectionsController@renderBackgroundGalleryEditor');
    $app->get('sections/render-grid-view[/{siteSlug}]', 'SiteSectionsController@renderGridView');
    $app->get('sections/render-additional-text[/{site}]', 'SiteSectionsController@renderAdditionalText');
    $app->get('sections/render-additional-footer-text[/{site}]', 'SiteSectionsController@renderAdditionalFooterText');
    $app->get('sections/render-footer[/{site}]', 'SiteSectionsController@renderFooter');
    $app->get('sections/render-template[/{siteSlug}]', 'SiteSectionsController@renderTemplate');

    $app->put('sections/backgrounds', ['as' => 'site_section_backgrounds', 'uses' => 'SiteSectionsController@backgroundGalleryOrder']);
    $app->post('sections/backgrounds', 'SiteSectionsController@backgroundGalleryUpload');
    $app->delete('sections/backgrounds', 'SiteSectionsController@backgroundGalleryDelete');

    $app->put('sections/tags', ['as' => 'section_tags', 'uses' => 'Tags\SectionTagsController@order']);
});

$app->group(['prefix' => 'v1/sites/sections', 'namespace' => 'App\Sites\Sections\Entries', 'middleware' => ['setup', 'auth']], function () use ($app) {
    $app->patch('entries', ['as' => 'section_entries', 'uses' => 'SectionEntriesController@update']);
    $app->post('entries', 'SectionEntriesController@create');
    $app->put('entries', 'SectionEntriesController@order');
    $app->delete('entries', 'SectionEntriesController@delete');
    $app->patch('entries/move', ['as' => 'section_entries_move', 'uses' => 'SectionEntriesController@move']);
    $app->put('entries/galleries', ['as' => 'entry_gallery', 'uses' => 'SectionEntriesController@galleryOrder']);
    $app->post('entries/galleries', 'SectionEntriesController@galleryUpload');
    $app->patch('entries/galleries', 'SectionEntriesController@galleryCrop');
    $app->delete('entries/galleries', 'SectionEntriesController@galleryDelete');
    $app->get('entries/render/{site}/{section}[/{id}]', 'SectionEntriesController@renderEntries');
    $app->get('entries/render-gallery-editor/{site}/{section}/{id}', 'SectionEntriesController@renderEntryGalleryEditor');
    $app->get('entries/render-mashup[/{site}]', 'SectionEntriesController@renderMashupEntries');
    $app->get('entries/render-portfolio-thumbnails/{site}/{section}', 'SectionEntriesController@renderPortfolioThumbnails');
});

$app->group(['prefix' => 'v1/plugin', 'namespace' => 'App\Plugins', 'middleware' => ['setup', 'auth']], function () use ($app) {
    foreach (scandir("{$app->path()}/Plugins") as $fileOrDir) {
        if (in_array($fileOrDir, ['.', '..'])) { continue; }

        $dirPath = "{$app->path()}/Plugins/{$fileOrDir}";

        if (is_dir($dirPath) && is_file("{$dirPath}/routes.php")) {
            require "{$dirPath}/routes.php";
        }
    }
});

/**
 * This includes test controller for easier development
 * @todo: replace this with automated tests
 */
if (app()->environment('local', 'stage')) {
    require __DIR__ . '/../Dev/testRoutes.php';
}
