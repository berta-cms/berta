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

$router->group(['middleware' => 'setup'], function () use ($router) {
    $router->post('auth/login', ['uses' => 'AuthController@authenticate']);
    $router->get('auth/login', ['as'=> 'authenticate', 'uses' => 'AuthController@authenticate']);
    $router->post('v1/login', ['as' => 'login', 'uses' => 'AuthController@apiLogin']);
    $router->put('v1/logout', ['uses' => 'AuthController@apiLogout']);

    $router->get('v1/meta', ['uses' => 'StateController@getMeta']);
    $router->get('v1/sentry-dsn', ['uses' => 'StateController@getSentryDSN']);
});

$router->group(['prefix' => 'v1','namespace' => 'App\Http\Controllers', 'middleware' => ['setup', 'auth']], function () use ($router) {

    $router->patch('user/changepassword', 'AuthController@changePassword');

    $router->get('state[/{site}]', 'StateController@get');
    $router->get('locale-settings', ['as'=>'locale_settings', 'prefix'=>'locale_settings', 'uses' => 'StateController@getLocaleSettings']);
});
