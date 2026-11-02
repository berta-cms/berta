<?php

function renderSlideshowGallery(array $items, bool $loadFirstImageEagerly = false): string
{
    return view('Sites/Sections/Entries/Galleries/gallerySlideshow', [
        'galleryClassList' => 'xGalleryContainer xGalleryHasImages xGalleryType-slideshow',
        'attributes' => ['gallery' => ''],
        'galleryStyles' => 'width: 400px',
        'rowGalleryPadding' => null,
        'showNavigation' => true,
        'isEditMode' => false,
        'items' => $items,
        'navigationItems' => [],
        'loadFirstImageEagerly' => $loadFirstImageEagerly,
    ])->render();
}

it('lazy loads every slide image', function () {
    $slide = fn (string $name) => [
        'type' => 'image',
        'src' => "/storage/media/{$name}.jpg",
        'width' => 400,
        'height' => 300,
        'srcset' => '',
        'alt' => $name,
        'caption' => '',
    ];

    $html = renderSlideshowGallery([$slide('first'), $slide('second'), $slide('third')]);

    expect(substr_count($html, '<img '))->toBe(3)
        ->and(substr_count($html, 'loading="lazy"'))->toBe(3);
});

it('loads the first slide eagerly when it is the page\'s first image', function () {
    $slide = fn (string $name) => [
        'type' => 'image',
        'src' => "/storage/media/{$name}.jpg",
        'width' => 400,
        'height' => 300,
        'srcset' => '',
        'alt' => $name,
        'caption' => '',
    ];

    $html = renderSlideshowGallery([$slide('first'), $slide('second'), $slide('third')], loadFirstImageEagerly: true);

    expect($html)->toContain('alt="first" fetchpriority="high">')
        ->and(substr_count($html, 'loading="lazy"'))->toBe(2);
});

it('preloads only the metadata of a video', function () {
    $html = renderSlideshowGallery([[
        'type' => 'video',
        'original' => '/storage/media/clip.mp4',
        'width' => 400,
        'poster' => '',
        'autoplay' => 1,
        'caption' => '',
    ]]);

    expect($html)->toContain('<video width="400" controls controlsList="nodownload" preload="metadata" data-autoplay="1">');
});
