<?php

use App\Sites\Sections\AdditionalFooterTextRenderService;
use App\Sites\SocialMediaLinksRenderService;

function renderAdditionalFooterText(bool $isEditMode): string
{
    $service = new AdditionalFooterTextRenderService(new SocialMediaLinksRenderService);
    $user = (object) ['features' => []];
    $siteSettings = [
        'template' => ['template' => 'default'],
        'socialMediaButtons' => ['socialMediaLocation' => 'footer', 'socialMediaHTML' => ''],
        'socialMediaLinks' => ['location' => 'footer', 'links' => []],
        'siteTexts' => ['additionalFooterText' => ''],
    ];

    return (string) $service->render('site-slug', $siteSettings, $user, $isEditMode);
}

it('does not leak the empty-state placeholder onto the public site', function () {
    $html = renderAdditionalFooterText(isEditMode: false);

    expect($html)->not->toContain('additional footer text');
});

it('shows the empty-state placeholder while editing', function () {
    $html = renderAdditionalFooterText(isEditMode: true);

    expect($html)->toContain('additional footer text');
});
