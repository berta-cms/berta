<?php

function renderGridGallery(array $items, bool $loadFirstImageEagerly = false): string
{
    return view('Sites/Sections/Entries/Galleries/galleryGrid', [
        'galleryClassList' => 'xGalleryContainer xGalleryHasImages xGalleryType-grid',
        'isFullscreen' => false,
        'gridColumnsMobile' => 1,
        'gridColumnsDesktop' => 2,
        'gridColumnsLargeDesktop' => 3,
        'gridGap' => null,
        'isEditMode' => false,
        'items' => $items,
        'navigationItems' => [],
        'loadFirstImageEagerly' => $loadFirstImageEagerly,
    ])->render();
}

it('lazy loads every image', function () {
    $image = fn (string $name) => [
        'type' => 'image',
        'src' => "/storage/media/{$name}.jpg",
        'width' => 400,
        'height' => 300,
        'srcset' => '',
        'alt' => $name,
        'caption' => '',
    ];

    $html = renderGridGallery([$image('first'), $image('second'), $image('third')]);

    expect(substr_count($html, '<img '))->toBe(3)
        ->and(substr_count($html, 'loading="lazy"'))->toBe(3);
});

it('loads the first image eagerly when it is the page\'s first image', function () {
    $image = fn (string $name) => [
        'type' => 'image',
        'src' => "/storage/media/{$name}.jpg",
        'width' => 400,
        'height' => 300,
        'srcset' => '',
        'alt' => $name,
        'caption' => '',
    ];

    $html = renderGridGallery([$image('first'), $image('second')], loadFirstImageEagerly: true);

    expect($html)->toContain('alt="first" fetchpriority="high">')
        ->and($html)->toContain('alt="second" loading="lazy">');
});

it('preloads only the metadata of a video', function () {
    $html = renderGridGallery([[
        'type' => 'video',
        'original' => '/storage/media/clip.mp4',
        'width' => 400,
        'poster' => '',
        'autoplay' => 0,
        'caption' => '',
    ]]);

    expect($html)->toContain('<video width="400" controls controlsList="nodownload" preload="metadata">');
});
