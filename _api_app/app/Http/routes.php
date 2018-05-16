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

// @@@:TODO: Require login for API endpoints
$app->group(['prefix' => 'v1', 'namespace' => 'App'], function() use ($app) {
    $app->get('state/{site}', 'Http\Controllers\StateController@get');

    $app->group(['prefix' => 'v1', 'namespace' => 'App\Site'], function() use ($app) {
        $app->post('site', ['as' => 'site', 'uses' => 'SiteController@create']);
        $app->patch('site', 'SiteController@update');
        $app->put('site', 'SiteController@order');
        $app->delete('site', 'SiteController@delete');
    });

    $app->patch('site-settings', ['as' => 'site_settings', 'uses' => 'SettingsController@update']);

    $app->patch('site-template-settings', ['as' => 'site_template_settings', 'uses' => 'SiteTemplateSettingsController@update']);

    $app->post('section', ['as' => 'section', 'uses' => 'SectionController@create']);
    $app->patch('section', 'SectionController@update');
    $app->patch('section-reset', ['as' => 'section_reset', 'uses' => 'SectionController@reset']);
    $app->put('section', 'SectionController@order');
    $app->delete('section', 'SectionController@delete');

    $app->put('section-background', ['as' => 'section_background', 'uses' => 'SectionController@galleryOrder']);
    $app->delete('section-background', 'SectionController@galleryDelete');
});
