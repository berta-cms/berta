<?php

namespace Valet\Drivers;

/**
 * Stand-in for the Valet driver base class that LocalValetDriver.php extends. Herd brings the real
 * one, which isn't in vendor. Only the methods the driver uses, as Valet implements them.
 */
class BasicValetDriver
{
    public function isActualFile(?string $path): bool
    {
        return ! empty($path) && is_file($path);
    }

    public function serveStaticFile(string $staticFilePath, string $sitePath, string $siteName, string $uri): void {}
}
