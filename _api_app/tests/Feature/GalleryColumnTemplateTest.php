<?php

function renderColumnGallery(array $items): string
{
    return view('Sites/Sections/Entries/Galleries/galleryColumn', [
        'galleryClassList' => 'xGalleryContainer xGalleryHasImages xGalleryType-column',
        'isFullscreen' => false,
        'galleryStyles' => 'width: 400px;height: 300px',
        'rowGalleryPadding' => null,
        'isEditMode' => false,
        'items' => $items,
        'navigationItems' => [],
    ])->render();
}

it('lazy loads the image', function () {
    $html = renderColumnGallery([[
        'type' => 'image',
        'src' => '/storage/media/first.jpg',
        'width' => 400,
        'height' => 300,
        'srcset' => '',
        'alt' => 'first',
        'caption' => '',
    ]]);

    expect($html)->toContain('alt="first" loading="lazy">');
});

it('preloads only the metadata of a video', function () {
    $html = renderColumnGallery([[
        'type' => 'video',
        'original' => '/storage/media/clip.mp4',
        'width' => 400,
        'poster' => '',
        'autoplay' => 0,
        'caption' => '',
    ]]);

    expect($html)->toContain('<video width="400" controls controlsList="nodownload" preload="metadata">');
});
