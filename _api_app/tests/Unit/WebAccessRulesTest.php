<?php

use Illuminate\Filesystem\Filesystem;
use Valet\Drivers\BasicValetDriver;

/*
 * The web server rules that keep each site's private shop files (`_shop_files`) out of reach: the root
 * .htaccess on Apache, and its copy in LocalValetDriver.php for Herd's nginx. Every request goes through
 * both, so the two can't drift apart. This checks the rules, not a running Apache server.
 */

beforeEach(function () {
    $this->sitePath = sys_get_temp_dir() . '/berta_web_rules_' . uniqid();
});

afterEach(function () {
    (new Filesystem)->deleteDirectory($this->sitePath);
});

function bertaRepositoryRoot(): string
{
    return dirname(__DIR__, 3);
}

/**
 * Whether the root .htaccess answers a request with its 404 rule, the first rule a /storage request meets
 */
function htaccessRefuses(string $uri): bool
{
    $lines = array_map('trim', file(bertaRepositoryRoot() . '/.htaccess', FILE_IGNORE_NEW_LINES));
    $ruleLine = array_search('RewriteRule ^ - [R=404,L]', $lines, true);

    // The rule's conditions are the RewriteCond lines right above it, any of them refuses the request
    $patterns = [];
    for ($i = $ruleLine - 1; $i >= 0 && preg_match('/^RewriteCond %\{REQUEST_URI\} (\S+)/', $lines[$i], $match); $i--) {
        $patterns[] = $match[1];
    }

    if ($ruleLine === false || $patterns === []) {
        throw new RuntimeException('The 404 rule of .htaccess was not found');
    }

    foreach ($patterns as $pattern) {
        if (preg_match('#' . str_replace('#', '\#', $pattern) . '#', $uri)) {
            return true;
        }
    }

    return false;
}

/**
 * Whether the root .htaccess redirects a request for no file to its address with a trailing slash
 */
function htaccessAddsSlash(string $uri): bool
{
    $lines = array_map('trim', file(bertaRepositoryRoot() . '/.htaccess', FILE_IGNORE_NEW_LINES));
    $ruleLine = array_search('RewriteRule ^(.*)$ /$1/ [R=301,L]', $lines, true);

    // The rule's address conditions are the negated RewriteCond lines right above it, each of them must pass
    $patterns = [];
    for ($i = $ruleLine - 1; $i >= 0 && preg_match('/^RewriteCond %\{REQUEST_URI\} !(\S+)/', $lines[$i], $match); $i--) {
        $patterns[] = $match[1];
    }

    if ($ruleLine === false || $patterns === []) {
        throw new RuntimeException('The trailing slash rule of .htaccess was not found');
    }

    foreach ($patterns as $pattern) {
        if (preg_match('#' . str_replace('#', '\#', $pattern) . '#', $uri)) {
            return false;
        }
    }

    return true;
}

/**
 * How LocalValetDriver routes a request: "not_found", "static" or another of its route types
 */
function valetDriverRoute(string $sitePath, string $uri): string
{
    if (! class_exists(BasicValetDriver::class)) {
        require __DIR__ . '/../Fixtures/BasicValetDriver.php';
    }
    require_once bertaRepositoryRoot() . '/LocalValetDriver.php';

    $resolve = Closure::bind(fn (string $uri) => $this->resolve($sitePath, $uri), new LocalValetDriver, LocalValetDriver::class);

    return $resolve($uri)[0];
}

/**
 * A file at the request's path, as the driver only serves files that exist
 */
function putWebFile(string $sitePath, string $uri): void
{
    (new Filesystem)->ensureDirectoryExists(dirname($sitePath . $uri));
    file_put_contents($sitePath . $uri, 'contents');
}

it('refuses the shop files of the root site and of a multisite site', function (string $uri) {
    putWebFile($this->sitePath, $uri);

    expect(htaccessRefuses($uri))->toBeTrue()
        ->and(valetDriverRoute($this->sitePath, $uri))->toBe('not_found');
})->with([
    'the root site invoice' => '/storage/_shop_files/invoices/invoice-2026-1.pdf',
    'the root site payment record' => '/storage/_shop_files/paypal/5O190127TN364715T.json',
    'a multisite site invoice' => '/storage/-sites/second/_shop_files/invoices/invoice-2026-1.pdf',
    'a multisite site payment record' => '/storage/-sites/second/_shop_files/paypal/5O190127TN364715T.json',
]);

it('serves media, also in folders named like the shop files folder', function (string $uri) {
    putWebFile($this->sitePath, $uri);

    expect(htaccessRefuses($uri))->toBeFalse()
        ->and(valetDriverRoute($this->sitePath, $uri))->toBe('static');
})->with([
    'root site media' => '/storage/media/photo.jpg',
    'multisite site media' => '/storage/-sites/second/media/photo.jpg',
    'a media folder sharing the name' => '/storage/media/_shop_files/photo.jpg',
    'a site named like the folder' => '/storage/-sites/_shop_files/media/photo.jpg',
]);

it('redirects a page to its address with the trailing slash', function (string $uri) {
    expect(htaccessAddsSlash($uri))->toBeTrue()
        ->and(valetDriverRoute($this->sitePath, $uri))->toBe('redirect');
})->with([
    'a section' => '/shop',
    'a multisite section' => '/second/shop',
]);

it('serves the sitemap at its own address', function (string $uri) {
    expect(htaccessAddsSlash($uri))->toBeFalse()
        ->and(valetDriverRoute($this->sitePath, $uri))->toBe('php');
})->with([
    'the root site' => '/sitemap.xml',
    'a multisite site' => '/second/sitemap.xml',
]);
