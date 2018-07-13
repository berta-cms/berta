<?php
/**
 * Routing fallback is done from top to bottom - if the first url doesn't match we look for the next.
 * So for similar URLs to work correctly, define the static route first and then the one with parameter
 */
$app->group(['namespace' => 'App\OldBerta'], function () use ($app) {
    $app->group(['prefix' => '/engine/', 'namespace' => 'App\OldBerta'], function () use ($app) {
        $app->get('/', 'OldBertaController@engine');
        $app->get('/login.php', 'OldBertaController@engine_login');
    });
    // $app->get('/engine', 'OldBertaController@engine');
    $app->get('/sections.php', 'OldBertaController@sections_php');  // Static first
    // $app->get('/{site}', 'OldBertaController@id');  // Then parameter
    // $app->get('/{id}/{idd}', 'OldBertaController@id');  // Then parameter
    $app->get('/', 'OldBertaController@root');
    $app->get('/{siteOrSection}', 'OldBertaController@root');
    $app->get('/{siteOrSection}/{sectionOrTag}', 'OldBertaController@root');
    $app->get('/{siteOrSection}/{sectionOrTag}/{tag}', 'OldBertaController@root');
});
