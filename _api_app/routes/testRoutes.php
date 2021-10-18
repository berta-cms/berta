<?php

$router->group(['prefix' => 'v1', 'namespace' => 'Dev'], function () use ($router) {
    $router->get('test', 'TestController@get');
    $router->get('render-entry', 'TestController@renderEntry');
});
