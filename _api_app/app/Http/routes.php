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
$app->group(['prefix' => 'v1','namespace' => 'App\Http\Controllers'], function($app) {
    $app->get('state/{site}', 'StateController@get');

    $app->post('site', ['as' => 'site', 'uses' => 'SiteController@create']);
    $app->patch('site', 'SiteController@update');
    $app->put('site', 'SiteController@order');
    $app->delete('site', 'SiteController@delete');

    $app->patch('site-settings', ['as' => 'site_settings', 'uses' => 'SettingsController@update']);

    $app->patch('site-template-settings', ['as' => 'site_template_settings', 'uses' => 'SiteTemplateSettingsController@update']);

    $app->patch('update-section','SectionController@update');
    $app->patch('reset-section','SectionController@reset');
    $app->post('create-section','SectionController@create');
    $app->delete('delete-section/{site}/{section}','SectionController@delete');
    $app->put('order-sections','SectionController@order');

    $app->delete('section-bg-delete/{site}/{section}/{file}','SectionController@galleryDelete');
    $app->put('section-bg-order','SectionController@galleryOrder');
});
