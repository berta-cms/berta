<?php

use Valet\Drivers\BasicValetDriver;

/**
 * Laravel Herd / Valet driver for local development.
 *
 * nginx ignores `.htaccess`, so this mirrors the rewrite rules of `.htaccess`
 * and `_api/.htaccess`. Keep them in sync when the rules change. Apache never
 * runs this file, the root `.htaccess` sends every such request to index.php.
 *
 * Herd runs the driver with the site's PHP version, also versions too old for
 * Berta (to show the requirements check), so no PHP 8+ only functions or syntax.
 *
 * Setup: run `herd link berta` in the repository root, then open http://berta.test
 */
class LocalValetDriver extends BasicValetDriver
{
    private const STATIC = 'static';

    private const PHP = 'php';

    private const REDIRECT = 'redirect';

    private const FORBIDDEN = 'forbidden';

    private const NOT_FOUND = 'not_found';

    /**
     * Paths served as they are, see the passthrough rule in `.htaccess`
     */
    private const PASSTHROUGH_PATTERN = '#^/(\.well-known|_plugin_shop|engine|storage|_templates|_themes|index\.php|sitemap\.xml\.php|robots\.txt|crossdomain\.xml|favicon\.ico)#';

    public function serves(string $sitePath, string $siteName, string $uri): bool
    {
        return file_exists($sitePath . '/engine/inc.page.php');
    }

    public function isStaticFile(string $sitePath, string $siteName, string $uri)
    {
        [$type, $target] = $this->resolve($sitePath, $uri);

        return $type === self::STATIC ? $target : false;
    }

    public function frontControllerPath(string $sitePath, string $siteName, string $uri): ?string
    {
        [$type, $target] = $this->resolve($sitePath, $uri);

        switch ($type) {
            case self::PHP:
                $scriptName = substr($target, strlen($sitePath));
                $_SERVER['SCRIPT_FILENAME'] = $target;
                $_SERVER['SCRIPT_NAME'] = $scriptName;
                $_SERVER['PHP_SELF'] = $scriptName;
                $_SERVER['DOCUMENT_ROOT'] = $sitePath;

                return $target;

            case self::STATIC:
                // `.php` URIs skip isStaticFile(), e.g. /engine/index.php
                $this->serveStaticFile($target, $sitePath, $siteName, $uri);
                exit;

            case self::REDIRECT:
                $query = $_SERVER['QUERY_STRING'] ?? '';
                header('Location: ' . $target . ($query !== '' ? '?' . $query : ''), true, 301);
                exit;

            case self::FORBIDDEN:
                http_response_code(403);
                exit('Forbidden');

            default:
                http_response_code(404);
                exit('Not Found');
        }
    }

    /**
     * @return array{0: string, 1: ?string} Route type and its target (file path or redirect URL)
     */
    private function resolve(string $sitePath, string $uri): array
    {
        $path = $sitePath . $uri;

        // _api/.htaccess
        if ($uri === '/_api' || $this->startsWith($uri, '/_api/')) {
            if ($this->endsWith($uri, '/') && ! is_dir($path)) {
                return [self::REDIRECT, rtrim($uri, '/')];
            }

            if ($this->isActualFile($path)) {
                return $this->fileRoute($path);
            }

            return [self::PHP, $sitePath . '/_api/index.php'];
        }

        // Root .htaccess, in the same order
        if ($this->endsWith($uri, 'engine/hosting')) {
            return [self::FORBIDDEN, null];
        }

        if ($uri === '/engine/index.php') {
            return [self::STATIC, $sitePath . '/engine/dist/index.html'];
        }

        if ($this->startsWith($uri, '/engine') && ! $this->startsWith($uri, '/engine/editor') && ! $this->isActualFile($path)) {
            return [self::STATIC, $sitePath . '/engine/dist/index.html'];
        }

        if (preg_match('#^/storage.*\.(xml|sqlite|db|log|php)$#', $uri) || $uri === '/storage/' || $uri === '/_templates/') {
            return [self::NOT_FOUND, null];
        }

        if (preg_match(self::PASSTHROUGH_PATTERN, $uri)) {
            return $this->passthroughRoute($path, $uri);
        }

        if (! $this->isActualFile($path) && ! $this->endsWith($uri, 'index.php') && ! $this->endsWith($uri, '/')) {
            return [self::REDIRECT, $uri . '/'];
        }

        $this->addRewriteFlag();

        return [self::PHP, $sitePath . '/index.php'];
    }

    /**
     * Served as is, with Apache's DirectoryIndex and `Options -Indexes` behaviour for folders
     */
    private function passthroughRoute(string $path, string $uri): array
    {
        if ($this->isActualFile($path)) {
            return $this->fileRoute($path);
        }

        if (is_dir($path)) {
            if (! $this->endsWith($uri, '/')) {
                return [self::REDIRECT, $uri . '/'];
            }

            foreach (['index.php', 'index.html'] as $index) {
                if ($this->isActualFile($path . $index)) {
                    return $this->fileRoute($path . $index);
                }
            }
        }

        return [self::NOT_FOUND, null];
    }

    private function fileRoute(string $path): array
    {
        return [$this->endsWith($path, '.php') ? self::PHP : self::STATIC, $path];
    }

    /**
     * `index.php?__rewrite=1 [QSA]`, the engine enables clean URLs with this flag
     */
    private function addRewriteFlag(): void
    {
        $_GET['__rewrite'] = '1';
        $_REQUEST['__rewrite'] = '1';
        $query = $_SERVER['QUERY_STRING'] ?? '';
        $_SERVER['QUERY_STRING'] = ($query !== '' ? $query . '&' : '') . '__rewrite=1';
    }

    private function startsWith(string $haystack, string $needle): bool
    {
        return strncmp($haystack, $needle, strlen($needle)) === 0;
    }

    private function endsWith(string $haystack, string $needle): bool
    {
        return $needle === '' || substr($haystack, -strlen($needle)) === $needle;
    }
}
