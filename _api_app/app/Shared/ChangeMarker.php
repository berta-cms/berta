<?php

namespace App\Shared;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Throwable;

/**
 * Marks the latest change to a website's data, so an open editor can tell that someone else changed it since it
 * loaded: another editor window (tab, browser or device) or an AI agent. One marker for the website, main site and
 * subsites. It's app state rather than site content, so it lives in Laravel's cache, not in the site's storage folder
 * that backups and transfers copy; it never expires, so a tab left open for days is still checked. EditorSync checks
 * it on editor requests. A cache that doesn't work (e.g. the first request after updating an old install, before
 * SetupMiddleware has added CACHE_STORE to .env) turns the checks off instead of breaking the editor.
 */
class ChangeMarker
{
    public const SOURCE_EDITOR = 'editor';

    public const SOURCE_AGENT = 'agent';

    private const NONE = ['token' => '', 'writer' => '', 'source' => ''];

    /**
     * The latest change: a token that is new with every change, the editor window that made it (empty for agents)
     * and its source. All empty before the first marked change.
     *
     * @return array{token: string, writer: string, source: string}
     */
    public function current(): array
    {
        try {
            $marker = Cache::get(self::key());
        } catch (Throwable) {
            return self::NONE;
        }

        // Anything else in the cache counts as no marker.
        $isMarker = is_array($marker) && array_keys($marker) === array_keys(self::NONE) && array_filter($marker, is_string(...)) === $marker;

        return $isMarker ? $marker : self::NONE;
    }

    /**
     * Marks a new change. Returns the marker, or null when the cache can't store it.
     *
     * @param  string  $writer  the editor window's id; empty for changes made outside the editor
     * @return array{token: string, writer: string, source: string}|null
     */
    public function touch(string $source, string $writer = ''): ?array
    {
        $marker = ['token' => (string) Str::ulid(), 'writer' => $writer, 'source' => $source];

        try {
            Cache::forever(self::key(), $marker);
        } catch (Throwable $exception) {
            report($exception);

            return null;
        }

        return $marker;
    }

    private static function key(): string
    {
        return 'editor-sync:change-marker:' . md5(config('app.old_berta_root'));
    }
}
