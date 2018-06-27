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
Use Monolog\Formatter\LineFormatter;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\FirePHPHandler;
use Monolog\Processor\IntrospectionProcessor;


// Create the logger
$logger = new Logger('old_berta');

// Create formatter to handle how logs will be output
$formatter = new LineFormatter(null, null, true, true);

// Now add line numbers, classNames to output
$logger->pushProcessor(new IntrospectionProcessor());

// Now add some handlers
$stream = new StreamHandler(__DIR__.'/../_api_app/storage/logs/old_berta.log', Logger::DEBUG);
$stream->setFormatter($formatter);
$logger->pushHandler($stream);
$logger->pushHandler(new FirePHPHandler());
