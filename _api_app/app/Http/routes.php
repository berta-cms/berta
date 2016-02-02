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

$app->group(['prefix' => 'v1','namespace' => 'App\Http\Controllers'], function($app) {
	$app->get('state','StateController@getState');
    $app->patch('update-site','SiteController@updateSite');
    $app->post('create-site','SiteController@createSite');
    $app->put('order-sites','SiteController@orderSites');
});
