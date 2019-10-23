<?php
/**
 * First we check if the necessary PHP libraries are available, otherwise will have fatal error.
 */

require_once dirname(__dir__) . '/_api_app/bootstrap/app.php';

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
