<?php

use App\Http\Middleware\Authenticate;
use App\Http\Middleware\SetupMiddleware;
use App\Models\User;
use App\Plugins\Shop\ShopClientsDataService;
use App\Plugins\Shop\ShopOrdersDataService;
use App\Plugins\Shop\ShopProductsDataService;
use App\Plugins\Shop\ShopSettingsDataService;
use App\Plugins\Shop\ShopShippingCostsDataService;
use App\Plugins\Shop\ShopShippingRegionsDataService;
use App\Sites\Settings\SiteSettingsDataService;
use Carbon\Carbon;
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
    'order update' => ['PATCH', '/orders'],
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

    it('updates the weight and price of the shipping cost the path names', function () {
        $regions = new ShopShippingRegionsDataService('');
        $costs = new ShopShippingCostsDataService('');
        $regions->addRegion('Latvia', 21);
        $regions->addRegion('Europe', 21);
        $costs->addRegionCost(1, 500, 5);
        $costs->addRegionCost(1, 1000, 8);
        $costs->addRegionCost(2, 500, 10);
        $costs->addRegionCost(2, 1000, 15);

        patchJson('http://shop.test' . route('regional-costs', [], false), ['path' => '/3/price', 'value' => '7.5'])
            ->assertOk()
            ->assertJsonPath('data.value', '7.5');
        patchJson('http://shop.test' . route('regional-costs', [], false), ['path' => '/4/weight', 'value' => '1500'])
            ->assertOk();

        expect($costs->query()->orderBy('id')->get(['id', 'id_region', 'weight', 'price'])->map(fn ($cost) => (array) $cost)->all())->toEqual([
            ['id' => 1, 'id_region' => 1, 'weight' => 500, 'price' => 5],
            ['id' => 2, 'id_region' => 1, 'weight' => 1000, 'price' => 8],
            ['id' => 3, 'id_region' => 2, 'weight' => 500, 'price' => 7.5],
            ['id' => 4, 'id_region' => 2, 'weight' => 1500, 'price' => 15],
        ]);
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
            ->and((new SiteSettingsDataService(''))->get()['shop']['version'])->toEqual(7);
    });
});

/**
 * Checked-out orders ORD-1 to ORD-{$count}, each a minute after the previous one unless they share
 * $createdAt and each with a paid poster, plus a newer basket that isn't an order yet
 */
function placeShopOrders(int $count, ?string $createdAt = null): void
{
    $clients = new ShopClientsDataService('');
    $orders = new ShopOrdersDataService('');
    (new ShopProductsDataService(''))->query()->insert(['id' => 1, 'uniqid' => 'poster', 'name' => 'Poster']);

    foreach (range(1, $count) as $id) {
        $placedAt = $createdAt ?? Carbon::create(2026, 1, 1)->addMinutes($id)->toDateTimeString();
        $clients->query()->insert(['id' => $id, 'created_at' => $placedAt, 'session_id' => 'checkout', 'order_id' => "ORD-{$id}"]);
        $orders->query()->insert(['id' => $id, 'created_at' => $placedAt, 'id_client' => $id, 'id_product' => 1, 'paid' => 1, 'price' => 10]);
    }

    $clients->query()->insert(['id' => $count + 1, 'created_at' => '2027-01-01 00:00:00', 'session_id' => str_repeat('a', 32)]);
}

/**
 * @return array{orders: list<array<string, mixed>>, page: int, lastPage: int, total: int, statusFilter: string|null}
 */
function getShopOrdersPage(int $page, ?string $status = null): array
{
    $statusQuery = $status === null ? '' : "&status={$status}";

    return getJson('http://shop.test' . route('orders', [], false) . "?site=&page={$page}{$statusQuery}")
        ->assertOk()
        ->json('data')[''];
}

/**
 * @param  array<int, array<string, mixed>>  $columnsById
 */
function updateShopOrders(array $columnsById): void
{
    foreach ($columnsById as $id => $columns) {
        (new ShopClientsDataService(''))->query()->where('id', $id)->update($columns);
    }
}

/**
 * @return array<int, string|null>
 */
function shopOrderStatuses(): array
{
    return (new ShopClientsDataService(''))->query()->orderBy('id')->pluck('status', 'id')->all();
}

/**
 * @return array<int, string|null>
 */
function shopOrderNotes(): array
{
    return (new ShopClientsDataService(''))->query()->orderBy('id')->pluck('admin_notes', 'id')->all();
}

describe('orders', function () {
    beforeEach(function () {
        $this->bertaRoot = setUpShopTestRoot();
        actingAs(new User);
    });

    afterEach(function () {
        if (isset($this->bertaRoot)) {
            File::deleteDirectory($this->bertaRoot);
        }
    });

    it('sends the newest orders as the first page with the shop state, without baskets', function () {
        placeShopOrders(25);

        $firstPage = getJson('http://shop.test' . route('shop-state', [], false) . '?site=')
            ->assertOk()
            ->json('data.orders')[''];

        expect($firstPage)->toMatchArray(['page' => 1, 'lastPage' => 2, 'total' => 25])
            ->and(array_column($firstPage['orders'], 'order_id'))->toBe(array_map(fn (int $id) => "ORD-{$id}", range(25, 6)));
    });

    it('returns the requested page of orders with their paid products', function () {
        placeShopOrders(25);

        $secondPage = getShopOrdersPage(2);

        expect($secondPage)->toMatchArray(['page' => 2, 'lastPage' => 2, 'total' => 25])
            ->and(array_column($secondPage['orders'], 'order_id'))->toBe(['ORD-5', 'ORD-4', 'ORD-3', 'ORD-2', 'ORD-1'])
            ->and($secondPage['orders'][0]['orders'])->toEqual([['id_client' => 5, 'name' => 'Poster', 'qty' => 1, 'sum_total' => 10]]);
    });

    it('returns the last page for a page past the end', function () {
        placeShopOrders(25);

        $page = getShopOrdersPage(9);

        expect($page['page'])->toBe(2)
            ->and(array_column($page['orders'], 'order_id'))->toBe(['ORD-5', 'ORD-4', 'ORD-3', 'ORD-2', 'ORD-1']);
    });

    it('pages orders placed in the same second without repeating or skipping any', function () {
        placeShopOrders(25, '2026-01-01 12:00:00');

        $ids = [
            ...array_column(getShopOrdersPage(1)['orders'], 'id'),
            ...array_column(getShopOrdersPage(2)['orders'], 'id'),
        ];

        expect($ids)->toBe(range(25, 1));
    });

    it('pages only the orders with the filtered status', function () {
        placeShopOrders(25);
        updateShopOrders(array_fill_keys(range(1, 21), ['status' => 'shipped']) + [22 => ['status' => 'paid']]);

        $shippedPage = getShopOrdersPage(2, 'shipped');

        expect($shippedPage)->toMatchArray(['page' => 2, 'lastPage' => 2, 'total' => 21, 'statusFilter' => 'shipped'])
            ->and(array_column($shippedPage['orders'], 'order_id'))->toBe(['ORD-1'])
            ->and(array_column(getShopOrdersPage(1, 'paid')['orders'], 'order_id'))->toBe(['ORD-22']);
    });

    it('finds the orders without a status, leaving out baskets', function () {
        placeShopOrders(3);
        updateShopOrders([2 => ['status' => 'paid']]);

        $page = getShopOrdersPage(1, 'none');

        expect($page)->toMatchArray(['total' => 2, 'statusFilter' => 'none'])
            ->and(array_column($page['orders'], 'order_id'))->toBe(['ORD-3', 'ORD-1']);
    });

    it('returns 422 for an unknown status filter', function () {
        getJson('http://shop.test' . route('orders', [], false) . '?site=&status=lost')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['status' => 'The selected status is invalid.']);
    });

    it('sets the status of an order', function (string $status) {
        placeShopOrders(2);

        patchJson('http://shop.test' . route('orders', [], false), ['path' => '/2/status', 'value' => $status])
            ->assertOk()
            ->assertJsonPath('data', ['site' => '', 'path' => '2/status', 'value' => $status]);

        expect(shopOrderStatuses())->toBe([1 => null, 2 => $status, 3 => null]);
    })->with(['awaiting_payment', 'paid', 'shipped', 'cancelled', 'refunded']);

    it('keeps a PayPal order from awaiting payment', function () {
        placeShopOrders(1);
        updateShopOrders([1 => ['paypal' => 1, 'status' => 'paid']]);

        patchJson('http://shop.test' . route('orders', [], false), ['path' => '/1/status', 'value' => 'awaiting_payment'])
            ->assertStatus(400)
            ->assertJsonPath('message', 'A PayPal order is already paid!');

        expect(shopOrderStatuses()[1])->toBe('paid');
    });

    it('returns 404 for a status change of no order', function (string $path, string $message) {
        placeShopOrders(1);

        patchJson('http://shop.test' . route('orders', [], false), ['path' => $path, 'value' => 'paid'])
            ->assertNotFound()
            ->assertJsonPath('message', $message);

        expect(shopOrderStatuses())->toBe([1 => null, 2 => null]);
    })->with([
        'a basket' => ['/2/status', 'Order not found!'],
        'a missing order' => ['/9/status', 'Order not found!'],
        'an unknown site' => ['nosite/1/status', 'Site not found!'],
        'the notes of a basket' => ['/2/admin_notes', 'Order not found!'],
    ]);

    it('returns 422 for a status change of another field or to an unknown status', function () {
        placeShopOrders(1);

        patchJson('http://shop.test' . route('orders', [], false), ['path' => '/1/order_id', 'value' => 'lost'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['path', 'value']);

        expect(shopOrderStatuses())->toBe([1 => null, 2 => null]);
    });

    it('saves the private notes of an order', function () {
        placeShopOrders(2);
        $notes = "Called the customer.\nShips on Friday.";

        patchJson('http://shop.test' . route('orders', [], false), ['path' => '/2/admin_notes', 'value' => $notes])
            ->assertOk()
            ->assertJsonPath('data', ['site' => '', 'path' => '2/admin_notes', 'value' => $notes]);

        expect(shopOrderNotes())->toBe([1 => null, 2 => $notes, 3 => null])
            ->and(getShopOrdersPage(1)['orders'][0])->toMatchArray(['order_id' => 'ORD-2', 'admin_notes' => $notes]);
    });

    it('clears the private notes of an order', function () {
        placeShopOrders(1);
        updateShopOrders([1 => ['admin_notes' => 'Ships on Friday.']]);

        patchJson('http://shop.test' . route('orders', [], false), ['path' => '/1/admin_notes', 'value' => ''])
            ->assertOk()
            ->assertJsonPath('data.value', null);

        expect(shopOrderNotes())->toBe([1 => null, 2 => null]);
    });

    it('returns 422 for private notes over 5000 characters', function () {
        placeShopOrders(1);

        patchJson('http://shop.test' . route('orders', [], false), ['path' => '/1/admin_notes', 'value' => str_repeat('a', 5001)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['value']);

        expect(shopOrderNotes())->toBe([1 => null, 2 => null]);
    });

    it('adds an empty status and private notes to the orders of an older shop version', function () {
        writeShopSettings($this->bertaRoot, ['version' => '5']);
        $database = new SQLite3($this->bertaRoot . '/storage/shop-db.sqlite');
        $database->exec('CREATE TABLE "client" ("id" integer not null, "created_at" datetime not null, "session_id" varchar not null, "order_id" varchar, primary key ("id"))');
        $database->exec("INSERT INTO client (created_at, session_id, order_id) VALUES ('2026-01-01 00:00:00', 'checkout', 'ORD-1')");
        $database->close();

        $page = getShopOrdersPage(1);

        expect($page['orders'])->toHaveCount(1)
            ->and($page['orders'][0])->toHaveKey('status', null)
            ->and($page['orders'][0])->toHaveKey('admin_notes', null)
            ->and((new SiteSettingsDataService(''))->get()['shop']['version'])->toEqual(7);
    });
});
