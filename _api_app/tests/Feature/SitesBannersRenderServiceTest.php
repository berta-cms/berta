<?php

use App\Shared\Storage;
use App\Sites\SitesBannersRenderService;

it('lazy loads banner images', function () {
    $siteSettings = [
        'template' => ['template' => 'default'],
        'siteTexts' => [],
        'banners' => [
            'banner1_image' => 'first.png',
            'banner1_image_width' => '200',
            'banner1_image_height' => '100',
            'banner2_image' => 'second.png',
            'banner2_image_width' => '300',
            'banner2_image_height' => '150',
            'banner2_link' => 'https://example.com',
        ],
    ];

    $html = (string) (new SitesBannersRenderService)->render(
        '',
        $siteSettings,
        ['pageLayout' => ['responsive' => 'yes']],
        [],
        '',
        new Storage,
        false
    );

    expect(substr_count($html, '<img '))->toBe(2)
        ->and(substr_count($html, 'loading="lazy"'))->toBe(2);
});
