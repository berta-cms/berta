<?php

$app->group(['namespace' => 'App\Dev'], function () use ($app) {
    $app->get('test', 'TestController@get');
    $app->get('render-entry', 'TestController@renderEntry');
});
