<?php
require_once __dir__. '/../class-loader/ClassLoader.php';
use Symfony\Component\ClassLoader\ClassLoader;

$loader = new ClassLoader();

// to enable searching the include path (eg. for PEAR packages)
$loader->setUseIncludePath(true);

$loader->addPrefix('Psr', __DIR__.'/../_api_app/vendor/psr/log');
$loader->addPrefix('Monolog', __DIR__.'/../_api_app/vendor/monolog/monolog/src');

$loader->register();


use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\FirePHPHandler;

// Create the logger
$logger = new Logger('old_berta');
// Now add some handlers
$logger->pushHandler(new StreamHandler(__DIR__.'/../_api_app/storage/logs/old_berta.log', Logger::DEBUG));
$logger->pushHandler(new FirePHPHandler());
