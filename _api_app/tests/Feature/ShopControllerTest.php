<?php

use App\Http\Middleware\Authenticate;
use App\Http\Middleware\SetupMiddleware;
use App\Models\User;
use App\Plugins\Shop\ShopSettingsDataService;
use App\Plugins\Shop\ShopShippingRegionsDataService;
use App\Sites\Settings\SiteSettingsDataService;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\patchJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\withoutMiddleware;

beforeEach(function () {
    skipWithoutShopPlugin();
    // SetupMiddleware reconciles the real .env file on every request.
    withoutMiddleware(SetupMiddleware::class);
    config(['plugin-Shop.key' => 'shop.test']);
});

// A real unauthenticated request can't run here: the guard's failure path
// logs out through the legacy engine.
it('requires authentication for the settings config', function () {
    $middleware = Route::getRoutes()->getByName('settings-config')->gatherMiddleware();

    expect($middleware)->toContain(Authenticate::class);
});

it('returns 403 for the settings config on a domain without a shop key', function () {
    actingAs(new User);

    getJson('http://other.test' . route('settings-config', [], false))
        ->assertForbidden()
        ->assertJsonPath('message', 'Shop not available!');
});

it('returns 403 from every shop admin endpoint on a domain without a shop key', function (string $method, string $path) {
    actingAs(new User);

    $this->json($method, 'http://other.test' . route('shop-state', [], false) . $path)
        ->assertForbidden()
        ->assertJsonPath('message', 'Shop not available!');
})->with([
    'state' => ['GET', ''],
    'products' => ['GET', '/products'],
    'product update' => ['PATCH', '/products'],
    'orders' => ['GET', '/orders'],
    'regional costs' => ['GET', '/regional-costs'],
    'region add' => ['POST', '/region'],
    'region update' => ['PATCH', '/region'],
    'region delete' => ['DELETE', '/region/0/1'],
    'regional cost add' => ['POST', '/regional-costs'],
    'regional cost update' => ['PATCH', '/regional-costs'],
    'regional cost delete' => ['DELETE', '/regional-costs/0/1'],
    'settings' => ['GET', '/settings'],
    'settings update' => ['PATCH', '/settings'],
    'settings upload' => ['POST', '/settings/upload'],
    'settings config' => ['GET', '/settings-config'],
]);

it('returns the shop settings config grouped by section', function () {
    actingAs(new User);

    getJson('http://shop.test' . route('settings-config', [], false))
        ->assertOk()
        ->assertJsonPath('data.group_config._.title', 'Configuration values')
        ->assertJsonPath('data.group_config.currency.default', 'EUR');
});

it('translates the shop settings config', function () {
    $bertaRoot = setUpShopTestRoot();
    actingAs(new User);

    try {
        expect((new ShopSettingsDataService(''))->getConfig('lv'))
            ->group_config->_->title->toBe('Konfigurācijas vērtības')
            ->group_config->currency->default->toBe('EUR');
    } finally {
        File::deleteDirectory($bertaRoot);
    }
});

it('returns the explanation of each PayPal credentials group', function () {
    actingAs(new User);

    getJson('http://shop.test' . route('settings-config', [], false))
        ->assertOk()
        ->assertJsonPath('data.group_paypal_rest._.title', 'PayPal REST app credentials (recommended)')
        ->assertJsonPath('data.group_paypal_rest._.description', fn ($description) => str_contains($description, 'https://developer.paypal.com/dashboard/applications/live'))
        ->assertJsonPath('data.group_paypal_classic._.description', fn ($description) => str_contains($description, 'https://developer.paypal.com/api/nvp-soap/apiCredentials/'))
        ->assertJsonMissingPath('data.group_config._.description');
});

describe('regions', function () {
    beforeEach(function () {
        $this->bertaRoot = setUpShopTestRoot();
        actingAs(new User);
    });

    afterEach(function () {
        if (isset($this->bertaRoot)) {
            File::deleteDirectory($this->bertaRoot);
        }
    });

    it('stores a decimal VAT rate typed with a comma', function () {
        postJson('http://shop.test' . route('regions', [], false), ['site' => '', 'data' => ['name' => 'Finland', 'vat' => '25,5']])
            ->assertOk()
            ->assertJsonPath('data.data.vat', 25.5);

        expect((new ShopShippingRegionsDataService(''))->query()->value('vat'))->toEqual(25.5);
    });

    it('updates the VAT rate of a region', function () {
        (new ShopShippingRegionsDataService(''))->addRegion('Finland', 24);

        patchJson('http://shop.test' . route('regions', [], false), ['path' => '/1/vat', 'value' => '13.5'])
            ->assertOk()
            ->assertJsonPath('data.value', 13.5);

        expect((new ShopShippingRegionsDataService(''))->query()->value('vat'))->toEqual(13.5);
    });

    it('returns 400 for a VAT rate that is not a number from 0 to 100', function (string $vat) {
        (new ShopShippingRegionsDataService(''))->addRegion('Finland', 24);

        patchJson('http://shop.test' . route('regions', [], false), ['path' => '/1/vat', 'value' => $vat])
            ->assertStatus(400)
            ->assertJsonPath('message', 'VAT must be a number from 0 to 100');

        expect((new ShopShippingRegionsDataService(''))->query()->value('vat'))->toEqual(24);
    })->with(['abc', '101', '-1']);

    it('stores a renamed region as typed', function () {
        (new ShopShippingRegionsDataService(''))->addRegion('Finland', 24);

        patchJson('http://shop.test' . route('regions', [], false), ['path' => '/1/name', 'value' => 'Rock & "Roll"'])
            ->assertOk()
            ->assertJsonPath('data.value', 'Rock & "Roll"');

        expect((new ShopShippingRegionsDataService(''))->query()->value('name'))->toBe('Rock & "Roll"');
    });

    it('numbers new regions and their costs after the existing ones', function () {
        (new ShopShippingRegionsDataService(''))->addRegion('Finland', 24);
        (new ShopShippingRegionsDataService(''))->query()->where('id', 1)->update(['id' => 7]);

        postJson('http://shop.test' . route('regions', [], false), ['site' => '', 'data' => ['name' => 'Estonia', 'vat' => '22']])
            ->assertOk()
            ->assertJsonPath('data.data.id', 8);

        postJson('http://shop.test' . route('regional-costs', [], false), ['site' => '', 'data' => ['id_region' => 8, 'weight' => '500', 'price' => '4.5']])
            ->assertOk()
            ->assertJsonPath('data.data.id', 1);
        postJson('http://shop.test' . route('regional-costs', [], false), ['site' => '', 'data' => ['id_region' => 8, 'weight' => '1000', 'price' => '6']])
            ->assertOk()
            ->assertJsonPath('data.data.id', 2);
    });

    it('unescapes the region names an older shop version stored HTML-escaped', function () {
        writeShopSettings($this->bertaRoot, ['version' => '4']);
        $database = new SQLite3($this->bertaRoot . '/storage/shop-db.sqlite');
        $database->exec('CREATE TABLE "shipping_region" ("id" integer not null, "name" varchar not null, "vat" integer not null, primary key ("id"))');
        $database->exec("INSERT INTO shipping_region (name, vat) VALUES ('Rock &amp; &quot;Roll&quot;', 0), ('Plain', 0)");
        $database->close();

        $regions = new ShopShippingRegionsDataService('');

        expect($regions->query()->orderBy('id')->pluck('name')->all())->toBe(['Rock & "Roll"', 'Plain'])
            ->and((new SiteSettingsDataService(''))->get()['shop']['version'])->toEqual(5);
    });
});
