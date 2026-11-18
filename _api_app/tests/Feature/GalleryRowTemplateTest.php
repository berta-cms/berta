<?php

function renderRowGallery(array $items): string
{
    return view('Sites/Sections/Entries/Galleries/galleryRow', [
        'galleryClassList' => 'xGalleryContainer xGalleryHasImages xGalleryType-row',
        'isFullscreen' => false,
        'galleryStyles' => 'min-width: 1200px',
        'rowGalleryPadding' => null,
        'loader' => false,
        'isEditMode' => false,
        'items' => $items,
        'navigationItems' => [],
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

    $html = renderRowGallery([$image('first'), $image('second'), $image('third')]);

    expect(substr_count($html, '<img '))->toBe(3)
        ->and(substr_count($html, 'loading="lazy"'))->toBe(3);
});

it('preloads only the metadata of a video', function () {
    $html = renderRowGallery([[
        'type' => 'video',
        'original' => '/storage/media/clip.mp4',
        'width' => 400,
        'poster' => '',
        'autoplay' => 0,
        'caption' => '',
    ]]);

    expect($html)->toContain('<video width="400" controls controlsList="nodownload" preload="metadata">');
});
