<?php

namespace App\Setup;

use DOMDocument;
use DOMXPath;
use Dotenv\Dotenv;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Checks if the server and the installation meet Berta's requirements.
 *
 * Checks that must work before Laravel can boot (PHP version, vendor folder) live
 * in bootstrap/requirements_check.php, both share bootstrap/requirements.php.
 */
class ServerRequirementsService
{
    public const MIN_UPLOAD_SIZE = 256 * 1024 * 1024;

    public const MIN_MEMORY_LIMIT = 128 * 1024 * 1024;

    private const ENV_PLACEHOLDERS = ['', '[YOUR_APP_KEY]'];

    private array $requirements;

    public function __construct()
    {
        $this->requirements = require base_path('bootstrap/requirements.php');
    }

    /**
     * Reads only the `berta/installed` flag of the main site settings. SiteSettingsDataService
     * is not used on purpose, it depends on auth, engine settings and templates which may not
     * work on a server that fails the requirements.
     */
    public function isInstalled(): bool
    {
        $settingsFile = $this->bertaStoragePath() . '/settings.xml';

        if (! File::isReadable($settingsFile)) {
            return false;
        }

        $document = new DOMDocument;

        if (! @$document->loadXML(File::get($settingsFile))) {
            return false;
        }

        $installed = (new DOMXPath($document))->evaluate('string(/settings/berta/installed)');

        return (bool) (int) trim($installed);
    }

    /**
     * @return array<int, array{key: string, group: string, label: string, ok: bool, fatal: bool, message: string}>
     */
    public function check(): array
    {
        return [
            ...$this->serverChecks(),
            ...$this->installationChecks(),
        ];
    }

    /**
     * Parse php.ini byte values like `128M` or `2G`.
     *
     * @return int|null Bytes, null for an unlimited value (-1)
     */
    public static function parseIniBytes(string $value): ?int
    {
        $bytes = @ini_parse_quantity($value);

        return $bytes < 0 ? null : $bytes;
    }

    private function serverChecks(): array
    {
        $checks = [];

        $checks[] = $this->row(
            'php',
            'server',
            'Supported PHP version (' . $this->requirements['php'] . ' or newer)',
            version_compare(PHP_VERSION, $this->requirements['php'], '>='),
            'Berta needs PHP ' . $this->requirements['php'] . ' or newer. Ask your server administrator to enable a supported PHP version.',
        );

        foreach ($this->requirements['extensions'] as $extension => $label) {
            $isOk = extension_loaded($extension);

            if ($extension === 'mbstring') {
                $isOk = $isOk && function_exists('mb_ereg_replace');
            }

            $checks[] = $this->row(
                'ext_' . $extension,
                'server',
                'PHP extension: ' . $label,
                $isOk,
                'Berta can not work without the PHP "' . $extension . '" extension. Ask your server administrator to enable it.',
            );
        }

        if (extension_loaded('gd')) {
            $gdInfo = gd_info();

            $checks[] = $this->row(
                'gd_jpeg',
                'server',
                'JPEG image support',
                ! empty($gdInfo['JPEG Support']),
                'You won\'t be able to upload JPEG images and Berta won\'t be able to make thumbnails. Ask your server administrator for GD JPEG support.',
            );
            $checks[] = $this->row(
                'gd_png',
                'server',
                'PNG image support',
                ! empty($gdInfo['PNG Support']),
                'You won\'t be able to upload PNG images.',
                false,
            );
            $checks[] = $this->row(
                'gd_gif',
                'server',
                'GIF image support',
                ! empty($gdInfo['GIF Read Support']) && ! empty($gdInfo['GIF Create Support']),
                'You won\'t be able to upload GIF images.',
                false,
            );
        }

        // Takes both `upload_max_filesize` and `post_max_size` into account
        $checks[] = $this->row(
            'upload_size',
            'server',
            'Large file uploads (videos) allowed',
            UploadedFile::getMaxFilesize() >= self::MIN_UPLOAD_SIZE,
            'Uploads are limited to ' . $this->formatBytes(UploadedFile::getMaxFilesize()) . '. Ask your server administrator to set PHP "upload_max_filesize" and "post_max_size" to at least 256M for larger videos.',
            false,
        );

        $memoryLimit = self::parseIniBytes((string) ini_get('memory_limit'));
        $checks[] = $this->row(
            'memory_limit',
            'server',
            'Enough memory for image processing',
            $memoryLimit === null || $memoryLimit >= self::MIN_MEMORY_LIMIT,
            'PHP "memory_limit" is ' . ini_get('memory_limit') . ', resizing large images may fail. Ask your server administrator to set it to at least 128M.',
            false,
        );

        return $checks;
    }

    private function installationChecks(): array
    {
        $storagePath = $this->bertaStoragePath();
        $isStorageWritable = File::isDirectory($storagePath) && File::isWritable($storagePath);

        $checks = [];

        $checks[] = $this->row(
            'storage',
            'installation',
            'Folder "storage" exists and is writable',
            $isStorageWritable,
            'Make sure the folder "storage" in your Berta installation exists and is writable by the web server. Use your FTP client to set the permissions.',
        );

        $mediaFolders = array_map(fn ($folder) => $storagePath . '/' . $folder, ['media', 'cache']);
        $checks[] = $this->row(
            'storage_media',
            'installation',
            'Folders "storage/media" and "storage/cache" are writable',
            collect($mediaFolders)->every(
                fn ($path) => File::isDirectory($path) ? File::isWritable($path) : $isStorageWritable,
            ),
            'Make sure the folders "storage/media" and "storage/cache" are writable by the web server, or delete them so Berta can create them.',
        );

        $apiStoragePaths = [
            storage_path(),
            storage_path('framework/cache'),
            storage_path('framework/sessions'),
            storage_path('framework/views'),
            storage_path('logs'),
        ];
        $checks[] = $this->row(
            'api_storage',
            'installation',
            'Folder "_api_app/storage" is writable',
            collect($apiStoragePaths)->every(fn ($path) => File::isDirectory($path) && File::isWritable($path)),
            'Make sure the folder "_api_app/storage" and all its subfolders exist and are writable by the web server.',
        );

        $bootstrapCachePath = base_path('bootstrap/cache');
        $checks[] = $this->row(
            'api_bootstrap_cache',
            'installation',
            'Folder "_api_app/bootstrap/cache" is writable',
            File::isDirectory($bootstrapCachePath) && File::isWritable($bootstrapCachePath),
            'Make sure the folder "_api_app/bootstrap/cache" exists and is writable by the web server.',
        );

        $checks[] = $this->row(
            'app_key',
            'installation',
            'Application key is set',
            $this->hasAppKey(),
            'Berta could not create the "_api_app/.env" file. Make sure the "_api_app" folder is writable by the web server, or copy "_api_app/.env.example" to "_api_app/.env".',
        );

        return $checks;
    }

    /**
     * Reads the .env file directly: SetupMiddleware generates APP_KEY during this
     * same request, after the config was already loaded.
     */
    private function hasAppKey(): bool
    {
        $envPath = base_path('.env');

        if (! File::exists($envPath)) {
            return false;
        }

        $env = Dotenv::parse(File::get($envPath));

        return ! in_array($env['APP_KEY'] ?? '', self::ENV_PLACEHOLDERS, true);
    }

    private function bertaStoragePath(): string
    {
        return config('app.old_berta_root') . '/storage';
    }

    private function formatBytes(int|float $bytes): string
    {
        return round($bytes / 1024 / 1024) . 'M';
    }

    private function row(string $key, string $group, string $label, bool $isOk, string $message, bool $isFatal = true): array
    {
        return [
            'key' => $key,
            'group' => $group,
            'label' => $label,
            'ok' => $isOk,
            'fatal' => $isFatal,
            'message' => $isOk ? '' : $message,
        ];
    }
}
