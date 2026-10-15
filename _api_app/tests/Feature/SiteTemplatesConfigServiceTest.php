<?php

use App\Configuration\SiteTemplatesConfigService;
use Illuminate\Http\Request;

beforeEach(function () {
    config(['plugin-Shop.key' => 'shop.test']);
});

it('translates the template settings into the editor\'s language', function () {
    $templates = (new SiteTemplatesConfigService)->get('lv');

    expect($templates['messy-0.4.2']['templateConf']['settings']['_']['title'])->toBe('Dažādi');
});

it('adds the shop\'s section types to a template on a domain with the shop', function (string $host, bool $hasShop) {
    app()->instance('request', Request::create("http://{$host}/"));

    $sectionTypes = (new SiteTemplatesConfigService)->get()['messy-0.4.2']['sectionTypes'];

    expect(array_key_exists('shop', $sectionTypes))->toBe($hasShop)
        ->and(array_key_exists('shopping_cart', $sectionTypes))->toBe($hasShop);
})->with([
    'with the shop' => ['shop.test', true],
    'without it' => ['other.test', false],
]);
