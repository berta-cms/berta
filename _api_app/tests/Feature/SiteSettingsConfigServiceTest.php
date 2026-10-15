<?php

use App\Configuration\SiteSettingsConfigService;

it('translates the site settings into the editor\'s language and keeps their defaults', function () {
    $settings = (new SiteSettingsConfigService)->get('lv');

    expect($settings['language']['language']['title'])->toBe('Valoda')
        ->and($settings['language']['language']['default'])->toBe('en')
        ->and($settings['media']['imagesSmallWidth']['default'])->toBe(200)
        ->and($settings)->not->toHaveKey('shop');
});
