<?php
/**
 * First we check if the necessary PHP libraries are available, otherwise will have fatal error.
 */
$autoLoaderPath = dirname(__dir__) . '/_api_app/vendor/composer/ClassLoader.php';
$psrLogPath = dirname(__dir__) . '/_api_app/vendor/psr/log';
$monologPath = dirname(__dir__) . '/_api_app/vendor/monolog/monolog/src';

if (!is_file($autoLoaderPath)) {
    throw new Exception('Autoloader not available!');
}
if (!is_dir($psrLogPath)) {
    throw new Exception('Psr log interface not avialable!');
}
if (!is_dir($monologPath)) {
    throw new Exception('Monolog logging library not available!');
}
// Initialize the auto-loader if we have everything we need
require_once $autoLoaderPath;

$loader = new \Composer\Autoload\ClassLoader();

$loader->add('Psr', $psrLogPath);
$loader->add('Monolog', $monologPath);

// activate the autoloader
$loader->register();

// to enable searching the include path (eg. for PEAR packages)
$loader->setUseIncludePath(true);

use Monolog\Logger;
use Monolog\Formatter\LineFormatter;
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
$stream = new StreamHandler(__DIR__ . '/../_api_app/storage/logs/old_berta.log', Logger::DEBUG);
$stream->setFormatter($formatter);
$logger->pushHandler($stream);
$logger->pushHandler(new FirePHPHandler());
