<?php

use App\Shared\UndoFiles;
use Illuminate\Support\Facades\File;

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_undo_files_' . uniqid();
    $this->undoFiles = $this->bertaRoot . '/storage/' . UndoFiles::FOLDER;
    File::ensureDirectoryExists($this->bertaRoot . '/storage');
    config(['app.old_berta_root' => $this->bertaRoot]);
});

afterEach(function () {
    File::deleteDirectory($this->bertaRoot);
});

/**
 * A change's kept files, with its kept.json written the given number of days ago.
 */
function keepUndoFiles(string $undoFiles, string $changeId, int $daysAgo): void
{
    File::ensureDirectoryExists("{$undoFiles}/{$changeId}/media/news3");
    file_put_contents("{$undoFiles}/{$changeId}/media/news3/sky.jpg", 'image');
    file_put_contents("{$undoFiles}/{$changeId}/" . UndoFiles::DATA_FILE, '{}');
    touch("{$undoFiles}/{$changeId}/" . UndoFiles::DATA_FILE, time() - $daysAgo * 86400);
}

it('does nothing without kept files', function () {
    (new UndoFiles)->cleanUpIfDue();

    expect($this->undoFiles)->not->toBeDirectory();
});

it('removes kept files older than the days they are kept for, and keeps newer ones', function () {
    keepUndoFiles($this->undoFiles, '3', UndoFiles::KEEP_DAYS + 1);
    keepUndoFiles($this->undoFiles, '8', UndoFiles::KEEP_DAYS - 1);

    (new UndoFiles)->cleanUpIfDue();

    expect("{$this->undoFiles}/3")->not->toBeDirectory()
        ->and("{$this->undoFiles}/8/media/news3/sky.jpg")->toBeFile();
});

it('cleans up at most once a day', function () {
    keepUndoFiles($this->undoFiles, '3', 1);
    (new UndoFiles)->cleanUpIfDue();
    keepUndoFiles($this->undoFiles, '3', UndoFiles::KEEP_DAYS + 1);

    (new UndoFiles)->cleanUpIfDue();

    expect("{$this->undoFiles}/3")->toBeDirectory();

    touch("{$this->undoFiles}/.cleaned-up", time() - 86401);
    (new UndoFiles)->cleanUpIfDue();

    expect("{$this->undoFiles}/3")->not->toBeDirectory();
});
