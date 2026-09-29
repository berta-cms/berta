<?php

use App\Setup\ServerRequirementsService;
use Illuminate\Support\Facades\File;

use function Pest\Laravel\get;

beforeEach(function () {
    $this->bertaRoot = sys_get_temp_dir() . '/berta_requirements_' . uniqid();
    File::ensureDirectoryExists($this->bertaRoot . '/storage');
    config(['app.old_berta_root' => $this->bertaRoot]);
});

afterEach(function () {
    @chmod($this->bertaRoot . '/storage', 0777);
    File::deleteDirectory($this->bertaRoot);
});

function writeInstalledFlag(string $bertaRoot, int $installed): void
{
    file_put_contents(
        $bertaRoot . '/storage/settings.xml',
        '<?xml version="1.0" encoding="utf-8"?><settings><berta><installed><![CDATA[' . $installed . ']]></installed></berta></settings>',
    );
}

function requirementRow(array $requirements, string $key): ?array
{
    return collect($requirements)->firstWhere('key', $key);
}

it('does not expose requirements once Berta is installed', function () {
    writeInstalledFlag($this->bertaRoot, 1);

    get(route('requirements'))
        ->assertOk()
        ->assertExactJson([
            'installed' => true,
            'requirements' => [],
        ]);
});

it('returns requirements while Berta is not installed', function () {
    writeInstalledFlag($this->bertaRoot, 0);

    $response = get(route('requirements'))
        ->assertOk()
        ->assertJsonPath('installed', false)
        ->assertJsonStructure([
            'requirements' => [
                '*' => ['key', 'group', 'label', 'ok', 'fatal', 'message'],
            ],
        ]);

    $requirements = $response->json('requirements');
    $keys = collect($requirements)->pluck('key');

    expect($keys)->toContain('php', 'ext_mbstring', 'ext_gd', 'ext_dom', 'gd_jpeg', 'upload_size', 'storage', 'api_storage', 'app_key');
    expect(requirementRow($requirements, 'php')['ok'])->toBeTrue();
    expect(requirementRow($requirements, 'storage')['ok'])->toBeTrue();
    expect(requirementRow($requirements, 'upload_size')['fatal'])->toBeFalse();
});

it('treats a missing settings file as not installed', function () {
    get(route('requirements'))
        ->assertOk()
        ->assertJsonPath('installed', false);
});

it('reports a missing storage folder as a fatal failure', function () {
    File::deleteDirectory($this->bertaRoot . '/storage');

    $requirements = get(route('requirements'))
        ->assertOk()
        ->assertJsonPath('installed', false)
        ->json('requirements');

    $storage = requirementRow($requirements, 'storage');
    expect($storage['ok'])->toBeFalse();
    expect($storage['fatal'])->toBeTrue();
    expect($storage['message'])->not->toBeEmpty();
    expect($storage['message'])->not->toContain($this->bertaRoot);
    expect(requirementRow($requirements, 'storage_media')['ok'])->toBeFalse();
});

it('reports a read only storage folder as a fatal failure', function () {
    chmod($this->bertaRoot . '/storage', 0555);

    if (is_writable($this->bertaRoot . '/storage')) {
        $this->markTestSkipped('Running as a user that can write to read only folders.');
    }

    $requirements = (new ServerRequirementsService)->check();

    expect(requirementRow($requirements, 'storage')['ok'])->toBeFalse();
});

it('parses php.ini byte values', function (string $value, ?int $expected) {
    expect(ServerRequirementsService::parseIniBytes($value))->toBe($expected);
})->with([
    ['2G', 2 * 1024 * 1024 * 1024],
    ['300M', 300 * 1024 * 1024],
    ['512K', 512 * 1024],
    ['1048576', 1048576],
    ['-1', null],
]);
