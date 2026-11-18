<?php

use App\Shared\Storage;
use App\Sites\Sections\GridViewRenderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

beforeEach(function () {
    $this->mediaRoot = sys_get_temp_dir() . '/berta-grid-view-' . uniqid();
    File::ensureDirectoryExists($this->mediaRoot . '/grid1');

    $image = imagecreatetruecolor(140, 93);
    imagepng($image, $this->mediaRoot . '/grid1/' . config('app.grid_image_prefix') . 'tall.png');
});

afterEach(function () {
    File::deleteDirectory($this->mediaRoot);
});

it('lazy loads grid images whose size is known', function () {
    $storage = new Storage;
    $storage->MEDIA_ROOT = $this->mediaRoot;
    $section = [
        'name' => 'works',
        'mediafolder' => 'grid1',
        '@attributes' => ['type' => 'grid'],
        'mediaCacheData' => [
            'file' => [
                ['@attributes' => ['src' => 'tall.png']],
                // Its grid image was never made, so the masonry has to wait for it to load
                ['@attributes' => ['src' => 'missing.png']],
            ],
        ],
    ];

    $html = (string) (new GridViewRenderService)->render(
        '',
        $storage,
        ['template' => ['template' => 'messy-0.4.2']],
        'works',
        [$section],
        null,
        Request::create('/works/', 'GET', [], ['_berta_grid_view' => '1']),
        false,
        false
    );

    expect($html)->toContain('_grid_tall.png" width="140" height="93" loading="lazy" />')
        ->and($html)->toContain('_grid_missing.png" />');
});
