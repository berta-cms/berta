<?php

use App\Http\Middleware\EditorSync;
use App\Http\Middleware\SetupMiddleware;
use App\Models\User;
use App\Shared\ChangeMarker;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Testing\TestResponse;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\patchJson;
use function Pest\Laravel\withoutMiddleware;

// Window ids as the editor makes them: random hex.
const EDITOR_WINDOW_A = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const EDITOR_WINDOW_B = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_editor_sync_' . uniqid();
    File::ensureDirectoryExists($this->bertaRoot . '/storage');
    config(['app.old_berta_root' => $this->bertaRoot]);
    linkBertaEngine($this->bertaRoot);
    writeTemplate($this->bertaRoot, 'messy-0.4.2');

    // SetupMiddleware reconciles the real .env file on every request.
    withoutMiddleware(SetupMiddleware::class);
    actingAs(new User);
});

afterEach(function () {
    File::deleteDirectory($this->bertaRoot);
});

/**
 * Saves the font weight as an editor window that has seen the given change token.
 */
function saveFontWeight(string $value, string $editor, string $seenToken): TestResponse
{
    return patchJson(
        route('site_template_settings'),
        ['path' => '/template-settings/messy-0.4.2/generalFontSettings/fontWeight', 'value' => $value],
        ['X-Berta-Editor' => $editor, 'X-Berta-Change' => $seenToken],
    );
}

function savedFontWeight(): string
{
    return (new SiteTemplateSettingsDataService('', 'messy-0.4.2'))->getState()['generalFontSettings']['fontWeight'];
}

it('tells the editor the latest change', function () {
    $marker = (new ChangeMarker)->touch(ChangeMarker::SOURCE_AGENT);

    getJson(route('change_marker'))
        ->assertOk()
        ->assertExactJson($marker)
        ->assertHeader('X-Berta-Change', $marker['token'])
        ->assertHeader('X-Berta-Change-Source', 'agent');
});

it('marks a change for each save of an editor window', function () {
    $response = saveFontWeight('bold', EDITOR_WINDOW_A, '')->assertOk();
    $marker = (new ChangeMarker)->current();

    expect($marker)->toMatchArray(['writer' => EDITOR_WINDOW_A, 'source' => 'editor'])
        ->and($marker['token'])->not->toBe('')
        ->and($response->headers->get('X-Berta-Change'))->toBe($marker['token']);
});

it('lets a window save again over its own changes', function () {
    saveFontWeight('normal', EDITOR_WINDOW_A, '')->assertOk();

    // The editor sends quick saves before the previous response is back.
    saveFontWeight('bold', EDITOR_WINDOW_A, '')->assertOk();

    expect(savedFontWeight())->toBe('bold');
});

it('refuses a save from a window that missed a change in another window', function () {
    saveFontWeight('normal', EDITOR_WINDOW_A, '')->assertOk();

    saveFontWeight('bold', EDITOR_WINDOW_B, '')
        ->assertStatus(409)
        ->assertJsonPath('error_message', 'This website was changed in another editor window. Reload to see the changes.')
        ->assertJsonPath('change_source', 'editor');

    expect(savedFontWeight())->toBe('normal');
});

it('refuses saves from every window that missed an agent change', function () {
    $seen = saveFontWeight('normal', EDITOR_WINDOW_A, '')->headers->get('X-Berta-Change');
    (new ChangeMarker)->touch(ChangeMarker::SOURCE_AGENT);

    saveFontWeight('bold', EDITOR_WINDOW_A, $seen)
        ->assertStatus(409)
        ->assertJsonPath('error_message', 'This website was changed by an AI agent. Reload to see the changes.')
        ->assertHeader('X-Berta-Change-Source', 'agent');

    expect(savedFontWeight())->toBe('normal');
});

it('saves from a window that has seen the latest change', function () {
    $marker = (new ChangeMarker)->touch(ChangeMarker::SOURCE_AGENT);

    saveFontWeight('bold', EDITOR_WINDOW_A, $marker['token'])->assertOk();

    expect(savedFontWeight())->toBe('bold');
});

it('saves unchecked from a window that has not seen a change yet', function () {
    (new ChangeMarker)->touch(ChangeMarker::SOURCE_AGENT);

    // E.g. a save retried right after login, before the fresh data has arrived.
    patchJson(
        route('site_template_settings'),
        ['path' => '/template-settings/messy-0.4.2/generalFontSettings/fontWeight', 'value' => 'bold'],
        ['X-Berta-Editor' => EDITOR_WINDOW_A],
    )->assertOk();

    expect(savedFontWeight())->toBe('bold')
        ->and((new ChangeMarker)->current())->toMatchArray(['writer' => EDITOR_WINDOW_A, 'source' => 'editor']);
});

it('leaves requests without an editor window as before', function () {
    (new ChangeMarker)->touch(ChangeMarker::SOURCE_AGENT);
    $before = (new ChangeMarker)->current();

    patchJson(route('site_template_settings'), ['path' => '/template-settings/messy-0.4.2/generalFontSettings/fontWeight', 'value' => 'bold'])
        ->assertOk();

    expect(savedFontWeight())->toBe('bold')
        ->and((new ChangeMarker)->current())->toBe($before);
});

it('lets saves through while no change is marked yet, e.g. right after an update', function () {
    getJson(route('change_marker'))->assertHeader('X-Berta-Change', '');

    saveFontWeight('bold', EDITOR_WINDOW_A, '')->assertOk();

    expect(savedFontWeight())->toBe('bold');
});

it('works as before when the cache fails, e.g. on the first request after updating an old install', function () {
    Cache::shouldReceive('get')->andThrow(new RuntimeException('No cache table.'));
    Cache::shouldReceive('forever')->andThrow(new RuntimeException('No cache table.'));

    saveFontWeight('bold', EDITOR_WINDOW_A, 'some-token')
        ->assertOk()
        ->assertHeader('X-Berta-Change', '');

    expect(savedFontWeight())->toBe('bold');
});

it('ignores window ids the editor does not make', function () {
    (new ChangeMarker)->touch(ChangeMarker::SOURCE_AGENT);
    $before = (new ChangeMarker)->current();

    saveFontWeight('bold', 'window-a', 'stale')
        ->assertOk()
        ->assertHeader('X-Berta-Change-Writer', '');

    expect((new ChangeMarker)->current())->toBe($before);
});

it('marks nothing when a save is refused with an error message', function () {
    // A subsite without a settings file: the data service answers 200 with error_message.
    patchJson(
        route('site_settings'),
        ['path' => 'missing-site/settings/texts/pageTitle', 'value' => 'Studio'],
        ['X-Berta-Editor' => EDITOR_WINDOW_A, 'X-Berta-Change' => ''],
    )->assertOk()->assertJsonPath('error_message', 'Settings file not found in storage!');

    expect((new ChangeMarker)->current()['token'])->toBe('');
});

it('leaves out requests that change no site data', function (string $route) {
    expect(Route::getRoutes()->getByName($route)->excludedMiddleware())->toContain(EditorSync::class);
})->with(['site_theme_preview', 'user_change_password']);

it('lets the setup wizard of a new site save every step', function () {
    $seen = '';
    $steps = [
        ['siteTexts/siteHeading', 'Studio'],
        ['texts/ownerName', 'Ann'],
        ['texts/metaDescription', 'Portfolio'],
        ['siteTexts/siteFooter', 'Ann &copy; '],
        ['texts/pageTitle', 'Studio'],
        ['berta/installed', '1'],
    ];

    foreach ($steps as [$path, $value]) {
        $seen = patchJson(route('site_settings'), ['path' => "/settings/{$path}", 'value' => $value], ['X-Berta-Editor' => EDITOR_WINDOW_A, 'X-Berta-Change' => $seen])
            ->assertOk()
            ->assertJsonMissingPath('error_message')
            ->headers->get('X-Berta-Change');
    }

    $settings = (new SiteSettingsDataService)->getState();

    expect($settings['siteTexts']['siteFooter'])->toBe('Ann &copy;')
        ->and($settings['berta']['installed'])->toBe('1')
        ->and(array_column((new SiteSectionsDataService)->get(), 'name'))->toContain('home')
        ->and((new ChangeMarker)->current())->toMatchArray(['token' => $seen, 'writer' => EDITOR_WINDOW_A]);
});

it('tells a window about a change someone else made while its save ran', function () {
    $request = Request::create('/_api/v1/sites/settings', 'PATCH', server: ['HTTP_X_BERTA_EDITOR' => EDITOR_WINDOW_A, 'HTTP_X_BERTA_CHANGE' => '']);
    $agentChange = null;

    $response = (new EditorSync)->handle($request, function () use (&$agentChange) {
        $agentChange = (new ChangeMarker)->touch(ChangeMarker::SOURCE_AGENT);

        return response()->json([]);
    });

    // The window reloads to see the agent's change; other windows learn about this save.
    expect($response->headers->get('X-Berta-Change'))->toBe($agentChange['token'])
        ->and($response->headers->get('X-Berta-Change-Source'))->toBe('agent')
        ->and((new ChangeMarker)->current())->toMatchArray(['writer' => EDITOR_WINDOW_A, 'source' => 'editor']);
});

it('keeps the earlier change when the cache cannot store the save', function () {
    Cache::shouldReceive('get')->andReturn(['token' => 'earlier', 'writer' => EDITOR_WINDOW_B, 'source' => 'editor']);
    Cache::shouldReceive('forever')->andThrow(new RuntimeException('Read-only cache.'));

    saveFontWeight('bold', EDITOR_WINDOW_A, 'earlier')
        ->assertOk()
        ->assertHeader('X-Berta-Change', 'earlier');
});

it('treats anything else in the cache as no marker', function (mixed $cached) {
    Cache::shouldReceive('get')->andReturn($cached);

    expect((new ChangeMarker)->current())->toBe(['token' => '', 'writer' => '', 'source' => '']);
})->with([
    'text' => ['garbage'],
    'missing keys' => [['token' => 'x']],
    'not text' => [['token' => 1, 'writer' => '', 'source' => '']],
]);
