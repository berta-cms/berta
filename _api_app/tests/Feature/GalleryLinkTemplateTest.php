<?php

function renderLinkGallery(array $items): string
{
    return view('Sites/Sections/Entries/Galleries/galleryLink', [
        'galleryClassList' => 'xGalleryContainer xGalleryHasImages xGalleryType-link bt-has-hover',
        'galleryStyles' => 'width: 400px;height: 300px',
        'linkAddress' => 'https://example.com',
        'linkTarget' => '_self',
        'isEditMode' => false,
        'items' => $items,
    ])->render();
}

function linkGalleryImage(string $name): array
{
    return [
        'type' => 'image',
        'src' => "/storage/media/{$name}.jpg",
        'width' => 400,
        'height' => 300,
        'srcset' => '',
        'alt' => $name,
        'caption' => '',
    ];
}

it('lazy loads the image and the hover image', function () {
    $html = renderLinkGallery([linkGalleryImage('first'), linkGalleryImage('hover')]);

    expect(substr_count($html, '<img '))->toBe(2)
        ->and(substr_count($html, 'loading="lazy"'))->toBe(2);
});

it('preloads only the metadata of a video', function () {
    $html = renderLinkGallery([[
        'type' => 'video',
        'original' => '/storage/media/clip.mp4',
        'width' => 400,
        'poster' => '',
        'autoplay' => 0,
        'caption' => '',
    ]]);

    expect($html)->toContain('<video width="400" controls controlsList="nodownload" preload="metadata">');
});
