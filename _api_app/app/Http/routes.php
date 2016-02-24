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
	$app->get('state/{site}','StateController@get');

    $app->patch('update-site','SiteController@update');
    $app->post('create-site','SiteController@create');
    $app->delete('delete-site/{site}','SiteController@delete');
    $app->put('order-sites','SiteController@order');

    $app->patch('update-section','SectionController@update');
    $app->post('create-section','SectionController@create');
    $app->delete('delete-section/{site}/{section}','SectionController@delete');
    $app->put('order-sections','SectionController@order');
    $app->put('section-bg-order','SectionController@galleryOrder');
});
