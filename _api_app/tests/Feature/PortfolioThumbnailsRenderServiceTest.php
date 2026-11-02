<?php

use App\Shared\Storage;
use App\Sites\Sections\Entries\PortfolioThumbnailsRenderService;

it('gives thumbnails their size and lazy loads all but the first', function () {
    $siteSettings = [
        'media' => [
            'imagesMediumWidth' => 600,
            'imagesMediumHeight' => 600,
            'imagesLargeWidth' => 1200,
            'imagesLargeHeight' => 1200,
        ],
    ];
    $entry = fn (int $id) => [
        'id' => $id,
        'mediafolder' => 'portfolio1',
        'content' => ['title' => "Work {$id}"],
        'mediaCacheData' => [
            'file' => [
                ['@attributes' => ['type' => 'image', 'src' => "work{$id}.jpg", 'width' => 300, 'height' => 200]],
            ],
        ],
    ];

    $html = (string) (new PortfolioThumbnailsRenderService)->render(
        $siteSettings,
        new Storage,
        ['@attributes' => ['type' => 'portfolio']],
        [$entry(1), $entry(2)],
        false
    );

    expect($html)->toContain('work1.jpg" width="300" height="200" fetchpriority="high"')
        ->and($html)->toContain('work2.jpg" width="300" height="200" loading="lazy"');
});
