<?php

use Illuminate\Filesystem\Filesystem;
use Symfony\Component\Process\Process;

/*
 * The legacy engine's error handling (engine/inc.error_handling.php) sets global error handlers and an output
 * buffer, so each test runs it in a PHP process of its own.
 */

beforeEach(function () {
    $this->scriptPath = sys_get_temp_dir() . '/berta_error_handling_' . uniqid();
    mkdir($this->scriptPath);
});

afterEach(function () {
    (new Filesystem)->deleteDirectory($this->scriptPath);
});

/**
 * Runs a PHP script that includes the engine's error handling between the given pieces of code, with APP_DEBUG
 * set to $debug. The engine's logger writes "logger <level>: <message>" to the error output. As Laravel's shutdown
 * handler does on a web request, a shutdown function flushes the page buffer while the engine's globals still exist.
 */
function runWithEngineErrorHandling(string $scriptPath, bool $debug, string $before, string $after): Process
{
    $root = dirname(__DIR__, 3);
    $script = $scriptPath . '/script.php';
    file_put_contents($script, implode(PHP_EOL, [
        '<?php',
        '$_SERVER["DOCUMENT_ROOT"] = ' . var_export($root, true) . ';',
        'function config($key) { return ["app.debug" => ' . var_export($debug, true) . '][$key]; }',
        '$logger = new class { public function __call($level, $arguments) { fwrite(STDERR, "logger $level: $arguments[0]"); } };',
        'register_shutdown_function(fn () => ob_end_flush());',
        $before,
        'include ' . var_export($root . '/engine/inc.error_handling.php', true) . ';',
        $after,
    ]));

    $process = new Process([PHP_BINARY, '-d', 'log_errors=0', $script]);
    $process->run();

    return $process;
}

it('renders the page when an error was suppressed before the engine took over error handling', function () {
    // Laravel's .env loader reads a missing file, then Laravel sets an error handler that handles every error
    $before = '@file_get_contents(__DIR__ . "/.env"); set_error_handler(fn () => null);';

    $process = runWithEngineErrorHandling($this->scriptPath, true, $before, 'echo "site content";');

    expect($process->getOutput())->toBe('site content');
});

it('replaces the page with the error report on a fatal error with APP_DEBUG', function () {
    $process = runWithEngineErrorHandling($this->scriptPath, true, '', 'echo "site content"; undefined_function();');

    expect($process->getOutput())
        ->toContain('<b>Error:</b> <i>Uncaught Error: Call to undefined function undefined_function()')
        ->not->toContain('site content');
});

it('replaces the page with a generic message and logs the fatal error without APP_DEBUG', function () {
    $process = runWithEngineErrorHandling($this->scriptPath, false, '', 'echo "site content"; undefined_function();');

    expect($process->getOutput())->toBe('Server error');
    expect($process->getErrorOutput())->toContain('logger error: Error - Uncaught Error: Call to undefined function undefined_function()');
});

it('shows a warning in the page with APP_DEBUG', function () {
    $process = runWithEngineErrorHandling($this->scriptPath, true, '', 'echo $undefined; echo "site content";');

    expect($process->getOutput())
        ->toContain('<b>Warning:</b> <i>Undefined variable $undefined</i>')
        ->toEndWith('site content');
});

it('logs a warning without showing it without APP_DEBUG', function () {
    $process = runWithEngineErrorHandling($this->scriptPath, false, '', 'echo $undefined; echo "site content";');

    expect($process->getOutput())->toBe('site content');
    expect($process->getErrorOutput())->toContain('logger warning: Warning - Undefined variable $undefined');
});
