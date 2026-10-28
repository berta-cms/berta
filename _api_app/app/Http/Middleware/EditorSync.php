<?php

namespace App\Http\Middleware;

use App\Shared\ChangeMarker;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Keeps open editors in sync with changes made elsewhere (ChangeMarker). Every response tells the editor the latest
 * change. A write from an editor window that hasn't seen a change someone else made since is refused with 409, so it
 * can't overwrite that change; the editor then asks the user to reload. Successful writes of an editor window mark a
 * new change. Requests without the editor window header (other clients, older editors) pass unchecked, and so do
 * writes of a window that hasn't seen a change yet (no change header), e.g. a save retried right after login.
 * Routes that change no site data opt out with withoutMiddleware(), so other windows aren't asked to reload for them.
 */
class EditorSync
{
    /**
     * The editor window's id, random per window: hex characters, as the editor makes it. Other values are ignored,
     * since the id is sent back in a response header.
     */
    public const EDITOR_HEADER = 'X-Berta-Editor';

    /**
     * Sent by the editor: the change token it has seen last. Sent back: the latest change token.
     */
    public const CHANGE_HEADER = 'X-Berta-Change';

    public const CHANGE_WRITER_HEADER = 'X-Berta-Change-Writer';

    public const CHANGE_SOURCE_HEADER = 'X-Berta-Change-Source';

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $markers = new ChangeMarker;
        $editor = (string) $request->header(self::EDITOR_HEADER, '');
        $isEditorWrite = preg_match('/^[0-9a-f]{16,64}$/', $editor) === 1 && ! $request->isMethodSafe();
        // Read before the controller reads any data, so an answer never carries a newer change than its data.
        $latest = $markers->current();

        if ($isEditorWrite && $request->headers->has(self::CHANGE_HEADER) && $this->missedChange($latest, $editor, (string) $request->header(self::CHANGE_HEADER))) {
            $message = $latest['source'] === ChangeMarker::SOURCE_AGENT
                ? 'This website was changed by an AI agent. Reload to see the changes.'
                : 'This website was changed in another editor window. Reload to see the changes.';

            return $this->withMarker(response()->json(['error_message' => $message, 'change_source' => $latest['source']], 409), $latest);
        }

        $response = $next($request);

        if ($isEditorWrite && $this->saved($response)) {
            $latest = $this->markSaved($markers, $latest, $editor);
        }

        return $this->withMarker($response, $latest);
    }

    /**
     * Marks this window's save, so other windows learn about it. When someone else marked a change while the save ran,
     * the window is told about that change instead of its own, so it reloads rather than missing it. When the cache
     * can't store the mark, the latest known marker stands.
     *
     * @param  array{token: string, writer: string, source: string}  $before  the marker when the request came in
     * @return array{token: string, writer: string, source: string}
     */
    private function markSaved(ChangeMarker $markers, array $before, string $editor): array
    {
        $now = $markers->current();
        $changedMeanwhile = $now['token'] !== $before['token'] && $now['writer'] !== $editor;
        $mine = $markers->touch(ChangeMarker::SOURCE_EDITOR, $editor);

        return $changedMeanwhile ? $now : ($mine ?? $now);
    }

    /**
     * Whether the write changed data: Berta's data services also report refused writes as 200 with an error_message.
     */
    private function saved(Response $response): bool
    {
        return $response->isSuccessful()
            && ! ($response instanceof JsonResponse && is_array($response->getData(true)) && isset($response->getData(true)['error_message']));
    }

    /**
     * Whether someone other than this editor window changed the website since the window saw the given token.
     * The window's own changes don't count, so its quick saves in a row pass.
     *
     * @param  array{token: string, writer: string, source: string}  $latest
     */
    private function missedChange(array $latest, string $editor, string $seenToken): bool
    {
        return $latest['token'] !== '' && $latest['token'] !== $seenToken && $latest['writer'] !== $editor;
    }

    /**
     * @param  array{token: string, writer: string, source: string}  $latest
     */
    private function withMarker(Response $response, array $latest): Response
    {
        $response->headers->set(self::CHANGE_HEADER, $latest['token']);
        $response->headers->set(self::CHANGE_WRITER_HEADER, $latest['writer']);
        $response->headers->set(self::CHANGE_SOURCE_HEADER, $latest['source']);

        return $response;
    }
}
