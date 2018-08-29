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

// $app->get('/', function () use ($app) {
//     return 'Nothing here. Go away!';
// });

$app->post('auth/login', ['uses' => 'AuthController@authenticate', 'middleware' => 'setup']);
$app->get('auth/login', ['uses' => 'AuthController@authenticate', 'middleware' => 'setup']);
$app->post('v1/login', ['uses' => 'AuthController@apiLogin', 'middleware' => 'setup']);
$app->put('v1/logout', ['uses' => 'AuthController@apiLogout', 'middleware' => 'setup']);

$app->group(['prefix' => 'v1', 'namespace' => 'App', 'middleware' => ['setup', 'auth']], function () use ($app) {

    $app->patch('user/changepassword', 'Http\Controllers\AuthController@changePassword');

    $app->get('state[/{site}]', 'Http\Controllers\StateController@get');

    $app->group(['prefix' => 'v1', 'namespace' => 'App\Sites', 'middleware' => ['setup', 'auth']], function () use ($app) {
        $app->post('sites', ['as' => 'sites', 'uses' => 'SitesController@create']);
        $app->patch('sites', 'SitesController@update');
        $app->put('sites', 'SitesController@order');
        $app->delete('sites', 'SitesController@delete');

        $app->patch('sites/settings', ['as' => 'site_settings', 'uses' => 'Settings\SiteSettingsController@update']);

        $app->patch('sites/template-settings', ['as' => 'site_template_settings', 'uses' => 'TemplateSettings\SiteTemplateSettingsController@update']);

        $app->group(['prefix' => 'v1/sites', 'namespace' => 'App\Sites\Sections', 'middleware' => ['setup', 'auth']], function () use ($app) {
            $app->post('sections', ['as' => 'site_sections', 'uses' => 'SiteSectionsController@create']);
            $app->patch('sections', 'SiteSectionsController@update');
            $app->patch('sections/reset', ['as' => 'site_sections_reset', 'uses' => 'SiteSectionsController@reset']);
            $app->put('sections', 'SiteSectionsController@order');
            $app->delete('sections', 'SiteSectionsController@delete');

            $app->put('sections/backgrounds', ['as' => 'site_section_backgrounds', 'uses' => 'SiteSectionsController@galleryOrder']);
            $app->delete('sections/backgrounds', 'SiteSectionsController@galleryDelete');

            $app->put('sections/tags', ['as' => 'section_tags', 'uses' => 'Tags\SectionTagsController@order']);

            $app->group(['prefix' => 'v1/sites/sections', 'namespace' => 'App\Sites\Sections\Entries', 'middleware' => ['setup', 'auth']], function () use ($app) {
                $app->patch('entries', ['as' => 'section_entries', 'uses' => 'SectionEntriesController@update']);
                $app->put('entries', 'SectionEntriesController@order');
                $app->delete('entries', 'SectionEntriesController@delete');
                $app->put('entries/galleries', ['as' => 'entry_gallery', 'uses' => 'SectionEntriesController@galleryOrder']);
                $app->delete('entries/galleries', 'SectionEntriesController@galleryDelete');
            });
        });
    });

    $app->group(['prefix' => 'v1/plugin', 'namespace' => 'App\Plugins', 'middleware' => ['setup']], function () use ($app) {
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
});
