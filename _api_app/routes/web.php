<?php

/** @var \Laravel\Lumen\Routing\Router $router */

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

$router->group(['namespace' => 'Http\Controllers', 'middleware' => 'setup'], function () use ($router) {
    $router->post('auth/login', ['uses' => 'AuthController@authenticate']);
    $router->get('auth/login', ['as' => 'authenticate', 'uses' => 'AuthController@authenticate']);
    $router->post('v1/login', ['as' => 'login', 'uses' => 'AuthController@apiLogin']);
    $router->put('v1/logout', ['uses' => 'AuthController@apiLogout']);

    $router->get('v1/meta', ['uses' => 'StateController@getMeta']);
    $router->get('v1/sentry-dsn', ['uses' => 'StateController@getSentryDSN']);
});

$router->group(['prefix' => 'v1', 'namespace' => 'Http\Controllers', 'middleware' => ['setup', 'auth']], function () use ($router) {

    $router->patch('user/changepassword', 'AuthController@changePassword');

    $router->get('state[/{site}]', 'StateController@get');
    $router->get('locale-settings', ['as' => 'locale_settings', 'prefix' => 'locale_settings', 'uses' => 'StateController@getLocaleSettings']);
});

$router->group(['prefix' => 'v1', 'namespace' => 'Sites', 'middleware' => ['setup', 'auth']], function () use ($router) {
    $router->post('sites', ['as' => 'sites', 'uses' => 'SitesController@create']);
    $router->patch('sites', 'SitesController@update');
    $router->put('sites', 'SitesController@order');
    $router->delete('sites', 'SitesController@delete');

    $router->post('sites/theme-preview', ['as' => 'site_theme_preview', 'uses' => 'SitesController@themePreview']);
    $router->put('sites/theme-apply', ['as' => 'site_theme_apply', 'uses' => 'SitesController@themeApply']);

    $router->get('sites/render-menu[/{site}]', 'SitesController@renderMenu');
    $router->get('sites/render-header[/{site}]', 'SitesController@renderHeader');
    $router->get('sites/render-banners[/{site}]', 'SitesController@renderBanners');
    $router->get('sites/render-social-media-links[/{site}]', 'SitesController@renderSocialMediaLinks');

    $router->patch('sites/settings', ['as' => 'site_settings', 'uses' => 'Settings\SiteSettingsController@update']);
    $router->post('sites/settings/upload', ['as' => 'site_settings_upload', 'uses' => 'Settings\SiteSettingsController@upload']);
    $router->post('sites/settings', 'Settings\SiteSettingsController@createChildren');
    $router->delete('sites/settings', 'Settings\SiteSettingsController@deleteChildren');

    $router->patch('sites/template-settings', ['as' => 'site_template_settings', 'uses' => 'TemplateSettings\SiteTemplateSettingsController@update']);
    $router->post('sites/template-settings/upload', ['as' => 'site_template_settings_upload', 'uses' => 'TemplateSettings\SiteTemplateSettingsController@upload']);
});

$router->group(['prefix' => 'v1/sites', 'namespace' => 'Sites\Sections', 'middleware' => ['setup', 'auth']], function () use ($router) {
    $router->post('sections', ['as' => 'site_sections', 'uses' => 'SiteSectionsController@create']);
    $router->patch('sections', 'SiteSectionsController@update');
    $router->patch('sections/reset', ['as' => 'site_sections_reset', 'uses' => 'SiteSectionsController@reset']);
    $router->put('sections', 'SiteSectionsController@order');
    $router->delete('sections', 'SiteSectionsController@delete');

    $router->get('sections/render-head[/{site}]', 'SiteSectionsController@renderHead');
    $router->get('sections/render-menu[/{site}]', 'SiteSectionsController@renderMenu');
    $router->get('sections/render-sitemap[/{siteSlug}]', 'SiteSectionsController@renderSitemap');
    $router->get('sections/render-background-gallery[/{siteSlug}]', 'SiteSectionsController@renderBackgroundGallery');
    $router->get('sections/render-background-gallery-editor[/{siteSlug}]', 'SiteSectionsController@renderBackgroundGalleryEditor');
    $router->get('sections/render-grid-view[/{siteSlug}]', 'SiteSectionsController@renderGridView');
    $router->get('sections/render-additional-text[/{site}]', 'SiteSectionsController@renderAdditionalText');
    $router->get('sections/render-additional-footer-text[/{site}]', 'SiteSectionsController@renderAdditionalFooterText');
    $router->get('sections/render-footer[/{site}]', 'SiteSectionsController@renderFooter');
    $router->get('sections/render-template[/{siteSlug}]', 'SiteSectionsController@renderTemplate');

    $router->put('sections/backgrounds', ['as' => 'site_section_backgrounds', 'uses' => 'SiteSectionsController@backgroundGalleryOrder']);
    $router->post('sections/backgrounds', 'SiteSectionsController@backgroundGalleryUpload');
    $router->delete('sections/backgrounds', 'SiteSectionsController@backgroundGalleryDelete');

    $router->put('sections/tags', ['as' => 'section_tags', 'uses' => 'Tags\SectionTagsController@order']);
});

$router->group(['prefix' => 'v1/sites/sections', 'namespace' => 'Sites\Sections\Entries', 'middleware' => ['setup', 'auth']], function () use ($router) {
    $router->patch('entries', ['as' => 'section_entries', 'uses' => 'SectionEntriesController@update']);
    $router->post('entries', 'SectionEntriesController@create');
    $router->put('entries', 'SectionEntriesController@order');
    $router->delete('entries', 'SectionEntriesController@delete');
    $router->patch('entries/move', ['as' => 'section_entries_move', 'uses' => 'SectionEntriesController@move']);
    $router->put('entries/galleries', ['as' => 'entry_gallery', 'uses' => 'SectionEntriesController@galleryOrder']);
    $router->post('entries/galleries', 'SectionEntriesController@galleryUpload');
    $router->patch('entries/galleries', 'SectionEntriesController@galleryCrop');
    $router->delete('entries/galleries', 'SectionEntriesController@galleryDelete');
    $router->get('entries/render/{site}/{section}[/{id}]', 'SectionEntriesController@renderEntries');
    $router->get('entries/render-gallery-editor/{site}/{section}/{id}', 'SectionEntriesController@renderEntryGalleryEditor');
    $router->get('entries/render-mashup[/{site}]', 'SectionEntriesController@renderMashupEntries');
    $router->get('entries/render-portfolio-thumbnails/{site}/{section}', 'SectionEntriesController@renderPortfolioThumbnails');
});

$router->group(['prefix' => 'v1/plugin', 'namespace' => 'Plugins', 'middleware' => ['setup', 'auth']], function () use ($router) {
    foreach (scandir("{$router->app->path()}/Plugins") as $fileOrDir) {
        if (in_array($fileOrDir, ['.', '..'])) { continue; }

        $dirPath = "{$router->app->path()}/Plugins/{$fileOrDir}";

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
    require __DIR__ . '/testRoutes.php';
}
