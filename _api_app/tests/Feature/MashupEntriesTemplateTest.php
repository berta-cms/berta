<?php

function renderMashupEntry(array $galleryItem, bool $loadEagerly = false): string
{
    return view('Sites/Sections/Entries/mashupEntries', [
        'wrapperAttributes' => '',
        'isEditMode' => false,
        'entries' => [[
            'attributes' => ' class="firstPagePic"',
            'item' => ['galleryItem' => $galleryItem, 'url' => null, 'loadEagerly' => $loadEagerly],
        ]],
    ])->render();
}

it('lazy loads the image', function () {
    $html = renderMashupEntry([
        'type' => 'image',
        'src' => '/storage/media/first.jpg',
        'width' => 400,
        'height' => 300,
        'srcset' => '',
        'alt' => 'first',
    ]);

    expect($html)->toContain('alt="first" loading="lazy">');
});

it('loads the first picture eagerly', function () {
    $html = renderMashupEntry([
        'type' => 'image',
        'src' => '/storage/media/first.jpg',
        'width' => 400,
        'height' => 300,
        'srcset' => '',
        'alt' => 'first',
    ], loadEagerly: true);

    expect($html)->toContain('alt="first" fetchpriority="high">')
        ->and($html)->not->toContain('loading="lazy"');
});

it('preloads only the metadata of a video', function () {
    $html = renderMashupEntry([
        'type' => 'video',
        'original' => '/storage/media/clip.mp4',
        'width' => 400,
        'poster' => '',
        'autoplay' => 0,
    ]);

    expect($html)->toContain('<video width="400" controls controlsList="nodownload" preload="metadata">');
});
