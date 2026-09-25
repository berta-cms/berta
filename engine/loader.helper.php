<?php

/**
 * First we check if the necessary PHP libraries are available, otherwise will have fatal error.
 */

use Illuminate\Http\Request;

require_once __DIR__ . '/inc.editor_redirect.php';

// Laravel can't boot on a too old PHP or without vendor/, send visitors to the
// editor, which shows the failed requirements
$bertaFailedRequirements = require __DIR__ . '/../_api_app/bootstrap/requirements_check.php';
if ($bertaFailedRequirements) {
    http_response_code(503);
    bertaRenderEditorRedirect((! empty($ENGINE_ROOT_URL) ? $ENGINE_ROOT_URL : (! empty($SITE_ROOT_URL) ? $SITE_ROOT_URL : '/') . 'engine/') . 'login');
    exit;
}
unset($bertaFailedRequirements);

require_once __DIR__ . '/../_api_app/bootstrap/load_app.php';
(require_once __DIR__ . '/../_api_app/bootstrap/app.php')->handle(Request::capture());

use Monolog\Formatter\LineFormatter;
use Monolog\Handler\FirePHPHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Monolog\Processor\IntrospectionProcessor;

// Create the logger
$logger = new Logger('old_berta');

// Create formatter to handle how logs will be output
$formatter = new LineFormatter(null, null, true, true);

// Now add line numbers, classNames to output
$logger->pushProcessor(new IntrospectionProcessor);

// Now add some handlers
$stream = new StreamHandler(__DIR__ . '/../_api_app/storage/logs/old_berta.log', Logger::DEBUG);
$stream->setFormatter($formatter);
$logger->pushHandler($stream);
$logger->pushHandler(new FirePHPHandler);
