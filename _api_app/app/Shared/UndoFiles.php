<?php

namespace App\Shared;

/**
 * Files kept so a delete can be undone: one folder per change in the main site's storage, with the deleted data in
 * kept.json and the deleted media folders moved next to it. A delete can be undone for KEEP_DAYS. The web server
 * denies the folder (.htaccess, LocalValetDriver.php), so deleted images are gone from the site.
 * Hosted sites run no scheduler, so every web request removes expired folders, at most once a day. Without kept
 * files that check is a single stat call.
 */
class UndoFiles extends Storage
{
    public const FOLDER = '_undo_files';

    public const KEEP_DAYS = 30;

    public const DATA_FILE = 'kept.json';

    /**
     * Touched on every clean-up, so the next one waits CLEAN_UP_INTERVAL seconds.
     */
    private const CLEANED_UP_MARKER = '.cleaned-up';

    private const CLEAN_UP_INTERVAL = 86400;

    /**
     * The folder of the given change's kept files, or the folder of all of them.
     */
    public function path(string $changeId = ''): string
    {
        return $this->XML_MAIN_ROOT . '/' . self::FOLDER . ($changeId !== '' ? '/' . $changeId : '');
    }

    /**
     * Removes the kept files older than KEEP_DAYS, unless that was done in the last CLEAN_UP_INTERVAL seconds.
     * Only the time of each change's kept.json is read; the files themselves are never walked.
     */
    public function cleanUpIfDue(): void
    {
        $folder = $this->path();

        if (! is_dir($folder)) {
            return;
        }

        $marker = $folder . '/' . self::CLEANED_UP_MARKER;

        if (is_file($marker) && filemtime($marker) > time() - self::CLEAN_UP_INTERVAL) {
            return;
        }

        // Touched first, so requests arriving meanwhile skip the clean-up.
        touch($marker);
        $oldest = time() - self::KEEP_DAYS * 86400;

        foreach (glob($folder . '/*', GLOB_ONLYDIR) ?: [] as $changeFolder) {
            $dataFile = $changeFolder . '/' . self::DATA_FILE;

            if ((is_file($dataFile) ? filemtime($dataFile) : filemtime($changeFolder)) < $oldest) {
                $this->delFolder($changeFolder);
            }
        }
    }
}
