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

// With the shop plugin, its tests cover the domain with the shop.
it('leaves the shop\'s section types out on a domain without the shop', function () {
    app()->instance('request', Request::create('http://other.test/'));

    $sectionTypes = (new SiteTemplatesConfigService)->get()['messy-0.4.2']['sectionTypes'];

    expect($sectionTypes)->not->toHaveKey('shop')
        ->and($sectionTypes)->not->toHaveKey('shopping_cart');
});
