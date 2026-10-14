<?php

use App\Http\Middleware\SetupMiddleware;
use App\Models\User;
use App\Plugins\Shop\ShopBasketService;
use App\Plugins\Shop\ShopClientsDataService;
use App\Plugins\Shop\ShopOrderMail;
use App\Plugins\Shop\ShopProductsDataService;
use App\Plugins\Shop\ShopShippingCostsDataService;
use App\Plugins\Shop\ShopShippingRegionsDataService;
use App\Sites\Settings\SiteSettingsDataService;
use Illuminate\Database\Connection;
use Illuminate\Database\QueryException;
use Illuminate\Http\Client\Request as HttpRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Sleep;
use Illuminate\Testing\TestResponse;
use Symfony\Component\Mailer\Exception\TransportException;
use Tests\TestCase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\travel;
use function Pest\Laravel\travelTo;
use function Pest\Laravel\withCredentials;
use function Pest\Laravel\withoutMiddleware;

const SHOP_CHAIR = 'chair0000001';
const SHOP_TSHIRT = 'tshirt000001';
const SHOP_NVP_TOKEN = 'EC-1AB23456CD789012E';
const SHOP_REST_TOKEN = '5O190127TN364715T';

beforeEach(function () {
    skipWithoutShopPlugin();

    $this->bertaRoot = setUpShopTestRoot();

    File::put($this->bertaRoot . '/storage/sections.xml', '<?xml version="1.0" encoding="utf-8"?><sections>'
        . '<section published="1" type="shop"><name><![CDATA[shop]]></name><title><![CDATA[Shop]]></title></section>'
        . '<section published="1" type="shopping_cart"><name><![CDATA[cart]]></name><title><![CDATA[Cart]]></title></section>'
        . '</sections>');
    File::put($this->bertaRoot . '/storage/blog.shop.xml', '<?xml version="1.0" encoding="utf-8"?><blog section="shop">'
        . '<entry><id><![CDATA[1]]></id><uniqid><![CDATA[' . SHOP_CHAIR . ']]></uniqid><content>'
        . '<cartTitle><![CDATA[Chair]]></cartTitle><cartPrice><![CDATA[100]]></cartPrice><weight><![CDATA[400]]></weight>'
        . '</content></entry>'
        . '<entry><id><![CDATA[2]]></id><uniqid><![CDATA[' . SHOP_TSHIRT . ']]></uniqid><content>'
        . '<cartTitle><![CDATA[T-shirt]]></cartTitle><cartPrice><![CDATA[25]]></cartPrice><cartAttributes><![CDATA[S, M]]></cartAttributes><weight><![CDATA[200]]></weight>'
        . '</content></entry>'
        . '<entry><id><![CDATA[3]]></id><uniqid><![CDATA[draft0000001]]></uniqid><content>'
        . '<cartTitle><![CDATA[Not for sale]]></cartTitle>'
        . '</content></entry>'
        . '</blog>');

    (new ShopShippingRegionsDataService(''))->addRegion('Europe', 21);
    (new ShopShippingCostsDataService(''))->addRegionCost(1, 500, 5);
    (new ShopShippingCostsDataService(''))->addRegionCost(1, 2000, 10);

    // SetupMiddleware reconciles the real .env file on every request.
    withoutMiddleware(SetupMiddleware::class);
    Http::preventStrayRequests();
    Storage::fake('local');
});

afterEach(function () {
    if (isset($this->bertaRoot)) {
        File::deleteDirectory($this->bertaRoot);
    }
});

function nvpSettings(): array
{
    return ['paypalUserName' => 'seller_api1.berta.test', 'paypalUserPassword' => 'secret', 'paypalSignature' => 'signature', 'paypalCurrencyCode' => 'EUR'];
}

function restSettings(): array
{
    return ['paypalClientId' => 'client-id', 'paypalClientSecret' => 'client-secret', 'paypalCurrencyCode' => 'EUR'];
}

function storefrontUrl(string $path, array $query = []): string
{
    return 'http://shop.test/v1/plugin/shop/storefront/' . $path . ($query ? '?' . http_build_query($query) : '');
}

function shopDb(): Connection
{
    return (new ShopClientsDataService(''))->getConnection();
}

/**
 * A site visitor whose shop_client cookie holds the basket token
 */
function asShopCustomer(?string $token, string $site = ''): TestCase
{
    return withCredentials()->withUnencryptedCookie(ShopBasketService::clientCookie($site), (string) $token);
}

function addToShopBasket(string $uniqid, ?string $attribute = null, ?string $token = null): TestResponse
{
    return asShopCustomer($token)
        ->postJson(storefrontUrl('basket'), ['uniqid' => $uniqid, 'attribute' => $attribute]);
}

/**
 * Fills a new basket and returns its cookie token
 *
 * @param  list<array{0: string, 1?: string}>  $items
 */
function fillShopBasket(array $items): string
{
    $token = null;
    foreach ($items as $item) {
        $token = addToShopBasket($item[0], $item[1] ?? null, $token)
            ->assertOk()
            ->getCookie(ShopBasketService::clientCookie(''), false)
            ->getValue();
    }

    return $token;
}

function shopCheckout(string $token, array $form = [], string $site = ''): TestResponse
{
    return asShopCustomer($token, $site)
        ->postJson(storefrontUrl('checkout', array_filter(['site' => $site])), array_merge([
            'name' => 'Ann Buyer',
            'phone' => '+371 20000000',
            'address' => 'Brivibas 1, Riga',
            'email' => 'ann@buyer.test',
            'notes' => '',
            'legal_person' => false,
            'deliver_to_billing' => true,
            'send_news' => false,
            'promo_code' => '',
            'region' => 1,
            'payment_method' => 'bank_transfer',
        ], $form));
}

/**
 * The order email's text as its reader sees it, without the markup
 */
function shopMailText(ShopOrderMail $mail): string
{
    return preg_replace('/\s+/', ' ', html_entity_decode(strip_tags($mail->render()), ENT_QUOTES));
}

/**
 * Where the order email's html and text parts match SpamAssassin's HEXHASH_WORD pattern: a word, a hash-like run
 * of digits and hyphens (as an order number is), then a word. Two matches in an email add spam points.
 *
 * @return list<string>
 */
function shopMailHexHashWords(ShopOrderMail $mail): array
{
    // Spam filters read the html with whitespace at block tags, as a reader sees it
    $html = html_entity_decode(strip_tags(preg_replace('/<(br|p|div|td|tr|h1|title)\b/i', ' $0', $mail->render())), ENT_QUOTES);
    $text = view('Plugins/Shop/orderMailText', $mail->buildViewData())->render();
    preg_match_all(
        '/\s[A-Z]?[a-z]{1,15}\s(?![a-z]{10,20}\s)[a-z]{0,10}(?!-?\d{1,5}-)(?!\d{10}\s)(?:(?!--)[-0-9a-f]){10,64}(?:[g-z][a-z]{0,10})?\s[A-Z]?[a-z]{1,15}\b/',
        preg_replace('/\s+/', ' ', "{$html} {$text}"),
        $matches,
    );

    return $matches[0];
}

function fakeNvp(string $captureAck = 'Success'): void
{
    Http::fake(['api-3t.paypal.com/nvp' => fn (HttpRequest $request) => match ($request['METHOD']) {
        'SetExpressCheckout' => Http::response('ACK=Success&TOKEN=' . SHOP_NVP_TOKEN),
        'DoExpressCheckoutPayment' => Http::response("ACK={$captureAck}&PAYMENTINFO_0_TRANSACTIONID=8AB12345CD678901E"),
    }]);
}

/**
 * @param  array<string, mixed>|null  $order  PayPal's answer to creating an order, by default a redirect order's
 */
function fakeRest(?Closure $capture = null, ?array $order = null): void
{
    Http::fake([
        'api-m.paypal.com/v1/oauth2/token' => Http::response(['access_token' => 'A21AA', 'expires_in' => 32400]),
        'api-m.paypal.com/v2/checkout/orders' => Http::response($order ?? [
            'id' => SHOP_REST_TOKEN,
            'status' => 'PAYER_ACTION_REQUIRED',
            'links' => [['rel' => 'payer-action', 'href' => 'https://www.paypal.com/checkoutnow?token=' . SHOP_REST_TOKEN]],
        ]),
        'api-m.paypal.com/v2/checkout/orders/*/capture' => $capture ?? Http::response(paidRestOrder()),
    ]);
}

function paidRestOrder(): array
{
    return [
        'id' => SHOP_REST_TOKEN,
        'status' => 'COMPLETED',
        'purchase_units' => [['payments' => ['captures' => [['id' => '3C679366HH908993F', 'status' => 'COMPLETED']]]]],
    ];
}

function returnFromPaypal(string $token): TestResponse
{
    return get(storefrontUrl('paypal/return', ['token' => $token, 'PayerID' => 'PAYER1']));
}

function capturesSent(): int
{
    return Http::recorded(fn (HttpRequest $request) => str_ends_with($request->url(), '/capture')
        || ($request->data()['METHOD'] ?? null) === 'DoExpressCheckoutPayment')->count();
}

it('returns 403 on a domain without the shop key', function () {
    postJson('http://other.test/v1/plugin/shop/storefront/stock', ['uniqids' => [SHOP_CHAIR]])
        ->assertForbidden()
        ->assertJsonPath('message', 'Shop not available!');
});

it('returns 404 for a site that does not exist', function () {
    postJson(storefrontUrl('stock', ['site' => '../../elsewhere']), ['uniqids' => [SHOP_CHAIR]])
        ->assertNotFound();

    expect(File::exists($this->bertaRoot . '/elsewhere'))->toBeFalse();
});

describe('stock', function () {
    it('returns the stock of each entry with all its variants together', function () {
        (new ShopProductsDataService(''))->addProduct('T-shirt S', SHOP_TSHIRT, 3);

        postJson(storefrontUrl('stock'), ['uniqids' => [SHOP_CHAIR, SHOP_TSHIRT, 'draft0000001']])
            ->assertOk()
            ->assertExactJson(['message' => '', 'data' => [
                ['uniqid' => SHOP_CHAIR, 'instock' => 1],
                ['uniqid' => SHOP_TSHIRT, 'instock' => 4],
            ]]);
    });

    it('puts the reservations of abandoned baskets back in stock', function () {
        fillShopBasket([[SHOP_CHAIR]]);
        travel(31)->minutes();

        postJson(storefrontUrl('stock'), ['uniqids' => [SHOP_CHAIR]])
            ->assertJsonPath('data.0.instock', 1);

        expect(shopDb()->table('orders')->count())->toBe(0);
    });
});

describe('basket', function () {
    it('reserves a product at the price of its entry, not the posted one', function () {
        $response = asShopCustomer(null)
            ->postJson(storefrontUrl('basket'), ['uniqid' => SHOP_CHAIR, 'price' => 0.01, 'weight' => 0])
            ->assertOk()
            ->assertJsonPath('data.added', true);

        expect($response->getCookie(ShopBasketService::clientCookie(''), false)->isHttpOnly())->toBeTrue();
        expect(shopDb()->table('orders')->first())->price->toEqual(100)->weight->toEqual(400);
        expect(shopDb()->table('product')->where('name', 'Chair')->first())->instock->toEqual(0)->reservation->toEqual(1);
    });

    it('reserves the variant of the chosen cart attribute', function () {
        fillShopBasket([[SHOP_TSHIRT, 'M']]);

        expect(shopDb()->table('product')->where('uniqid', SHOP_TSHIRT)->pluck('name')->all())->toBe(['T-shirt M']);
    });

    it('returns 404 for a cart attribute the entry does not have', function () {
        addToShopBasket(SHOP_TSHIRT, 'XL')->assertNotFound();
        addToShopBasket(SHOP_CHAIR, 'XL')->assertNotFound();
    });

    it('returns 404 for an entry without a price', function () {
        addToShopBasket('draft0000001')->assertNotFound();
    });

    it('returns 409 when the variant is out of stock', function () {
        $token = fillShopBasket([[SHOP_CHAIR]]);

        addToShopBasket(SHOP_CHAIR, null, $token)
            ->assertConflict()
            ->assertJsonPath('data.added', false);

        expect(shopDb()->table('orders')->count())->toBe(1);
    });

    it('puts a removed unit back in stock', function () {
        $token = fillShopBasket([[SHOP_CHAIR]]);

        asShopCustomer($token)
            ->deleteJson(storefrontUrl('basket'), ['uniqid' => SHOP_CHAIR])
            ->assertOk();

        expect(shopDb()->table('orders')->count())->toBe(0);
        expect(shopDb()->table('product')->where('name', 'Chair')->first())->instock->toEqual(1)->reservation->toEqual(0);
    });

    it('keeps the basket for its lifetime from the last product added', function () {
        $token = fillShopBasket([[SHOP_CHAIR]]);
        travel(25)->minutes();
        addToShopBasket(SHOP_TSHIRT, 'S', $token)->assertOk();
        travel(25)->minutes();

        shopCheckout($token)->assertOk();
    });

    it('keeps the basket for its lifetime from the last product removed', function () {
        $token = fillShopBasket([[SHOP_CHAIR], [SHOP_TSHIRT, 'S']]);
        travel(25)->minutes();
        asShopCustomer($token)->deleteJson(storefrontUrl('basket'), ['uniqid' => SHOP_TSHIRT, 'attribute' => 'S'])->assertOk();
        travel(25)->minutes();

        shopCheckout($token)->assertOk();
    });

    it('returns 410 for a product added to an expired basket, then starts a new basket', function () {
        $token = fillShopBasket([[SHOP_CHAIR]]);
        travel(31)->minutes();

        addToShopBasket(SHOP_TSHIRT, 'S', $token)
            ->assertGone()
            ->assertJsonPath('data.expired', true);

        expect(shopDb()->table('client')->value('session_id'))->toBe('timeout')
            ->and(shopDb()->table('orders')->count())->toBe(0)
            ->and(shopDb()->table('product')->where('name', 'Chair')->value('instock'))->toEqual(1);

        $newToken = addToShopBasket(SHOP_TSHIRT, 'S', $token)
            ->assertOk()
            ->getCookie(ShopBasketService::clientCookie(''), false)
            ->getValue();

        expect($newToken)->not->toBe($token);
        shopCheckout($newToken)->assertOk();
    });

    it('returns 410 for a product removed from an expired basket', function () {
        $token = fillShopBasket([[SHOP_CHAIR]]);
        travel(31)->minutes();

        asShopCustomer($token)
            ->deleteJson(storefrontUrl('basket'), ['uniqid' => SHOP_CHAIR])
            ->assertGone();

        expect(shopDb()->table('client')->value('session_id'))->toBe('timeout');
    });
});

describe('basket renewal', function () {
    it('keeps the basket for its lifetime from the renewal', function () {
        $token = fillShopBasket([[SHOP_CHAIR]]);
        travel(25)->minutes();

        asShopCustomer($token)
            ->postJson(storefrontUrl('basket/renew'))
            ->assertOk()
            ->assertJsonPath('data.expires_in', 1800);

        travel(25)->minutes();
        postJson(storefrontUrl('stock'), ['uniqids' => [SHOP_CHAIR]]);

        expect(shopDb()->table('orders')->count())->toBe(1);
        shopCheckout($token)->assertOk();
    });

    it('lasts the minutes of the shop setting', function () {
        writeShopSettings($this->bertaRoot, ['basketExpiresMinutes' => '10']);
        $token = fillShopBasket([[SHOP_CHAIR]]);

        asShopCustomer($token)
            ->postJson(storefrontUrl('basket/renew'))
            ->assertJsonPath('data.expires_in', 600);

        travel(11)->minutes();

        asShopCustomer($token)->postJson(storefrontUrl('basket/renew'))->assertGone();
    });

    it('returns 410 and releases the stock of an expired basket', function () {
        $token = fillShopBasket([[SHOP_CHAIR]]);
        travel(31)->minutes();

        asShopCustomer($token)
            ->postJson(storefrontUrl('basket/renew'))
            ->assertGone()
            ->assertJsonPath('data.expired', true);

        expect(shopDb()->table('client')->value('session_id'))->toBe('timeout')
            ->and(shopDb()->table('product')->where('name', 'Chair')->value('instock'))->toEqual(1);
    });

    it('returns 410 without a basket', function () {
        asShopCustomer('unknown-token')->postJson(storefrontUrl('basket/renew'))->assertGone();
    });

    it('returns 410 for an empty basket', function () {
        $token = fillShopBasket([[SHOP_CHAIR]]);
        asShopCustomer($token)->deleteJson(storefrontUrl('basket'), ['uniqid' => SHOP_CHAIR])->assertOk();

        asShopCustomer($token)->postJson(storefrontUrl('basket/renew'))->assertGone();
    });
});

it('keeps a separate basket on each site of a multisite', function () {
    writeShopSettings($this->bertaRoot, [], 'second');
    File::put($this->bertaRoot . '/storage/-sites/sites.xml', '<?xml version="1.0" encoding="utf-8"?><sites>'
        . '<site published="1"><title><![CDATA[Main]]></title></site>'
        . '<site published="1"><name><![CDATA[second]]></name><title><![CDATA[Second]]></title></site>'
        . '</sites>');
    File::copy($this->bertaRoot . '/storage/sections.xml', $this->bertaRoot . '/storage/-sites/second/sections.xml');
    File::copy($this->bertaRoot . '/storage/blog.shop.xml', $this->bertaRoot . '/storage/-sites/second/blog.shop.xml');
    (new ShopShippingRegionsDataService('second'))->addRegion('Europe', 21);

    // The cookies a browser keeps for the domain, both sites' baskets among them
    $cookies = [];
    $remember = function (TestResponse $response) use (&$cookies) {
        foreach ($response->headers->getCookies() as $cookie) {
            $cookies[$cookie->getName()] = $cookie->getValue();
        }
    };
    $remember(withCredentials()->withUnencryptedCookies($cookies)->postJson(storefrontUrl('basket'), ['uniqid' => SHOP_CHAIR])->assertOk());
    $remember(withCredentials()->withUnencryptedCookies($cookies)->postJson(storefrontUrl('basket', ['site' => 'second']), ['uniqid' => SHOP_TSHIRT, 'attribute' => 'S'])->assertOk());

    shopCheckout($cookies[ShopBasketService::clientCookie('')] ?? '')->assertOk();
    shopCheckout($cookies[ShopBasketService::clientCookie('second')] ?? '', [], 'second')->assertOk();
});

it('takes a product that is no longer for sale out of the basket', function (string $blog) {
    $token = fillShopBasket([[SHOP_CHAIR], [SHOP_TSHIRT, 'M']]);
    File::put($this->bertaRoot . '/storage/blog.shop.xml', $blog);

    asShopCustomer($token)
        ->deleteJson(storefrontUrl('basket'), ['uniqid' => SHOP_CHAIR])
        ->assertOk();

    expect(shopDb()->table('orders')->join('product', 'product.id', '=', 'orders.id_product')->pluck('product.name')->all())->toBe(['T-shirt M'])
        ->and(shopDb()->table('product')->where('name', 'Chair')->value('instock'))->toEqual(1);
})->with([
    'without a price' => '<?xml version="1.0" encoding="utf-8"?><blog section="shop"><entry><id><![CDATA[1]]></id><uniqid><![CDATA[' . SHOP_CHAIR . ']]></uniqid><content><cartTitle><![CDATA[Chair]]></cartTitle></content></entry></blog>',
    'deleted' => '<?xml version="1.0" encoding="utf-8"?><blog section="shop"></blog>',
]);

describe('regional costs', function () {
    it('returns the shipping price of the price tier above the basket weight', function () {
        $token = fillShopBasket([[SHOP_CHAIR]]);

        asShopCustomer($token)
            ->getJson(storefrontUrl('regional-costs', ['region' => 1]))
            ->assertOk()
            ->assertJson(['data' => ['shipping' => 5, 'vat' => 21]]);
    });

    it('returns the heaviest tier price for a basket heavier than all tiers', function () {
        (new ShopProductsDataService(''))->addProduct('Chair', SHOP_CHAIR, 10);
        $token = fillShopBasket(array_fill(0, 6, [SHOP_CHAIR]));

        asShopCustomer($token)
            ->getJson(storefrontUrl('regional-costs', ['region' => 1]))
            ->assertJson(['data' => ['shipping' => 10]]);
    });

    it('returns a decimal VAT rate', function () {
        (new ShopShippingRegionsDataService(''))->saveValueByPath('1/vat', '25,5');

        getJson(storefrontUrl('regional-costs', ['region' => 1]))->assertJsonPath('data.vat', 25.5);
    });

    it('returns 404 for an unknown region', function () {
        getJson(storefrontUrl('regional-costs', ['region' => 99]))->assertNotFound();
    });
});

describe('promo code', function () {
    it('returns the discount of the shop promo code', function () {
        getJson(storefrontUrl('promo-code', ['code' => 'SAVE10']))->assertJsonPath('data.discount', 10);
    });

    it('returns no discount for a wrong code', function () {
        getJson(storefrontUrl('promo-code', ['code' => 'SAVE20']))->assertJsonPath('data.discount', null);
    });
});

describe('bank transfer checkout', function () {
    it('saves the order, then emails it to the seller and the customer', function () {
        Mail::fake();
        $token = fillShopBasket([[SHOP_CHAIR], [SHOP_TSHIRT, 'M']]);

        $response = shopCheckout($token, ['promo_code' => 'SAVE10'])
            ->assertOk()
            ->assertJsonPath('data.status', 'placed');

        // 125 - 10% + 10 shipping for 600 g
        expect(shopDb()->table('client')->where('session_id', 'checkout')->first())
            ->name->toBe('Ann Buyer')
            ->order_id->toBe($response->json('data.order_id'))
            ->price_total->toEqual(122.5)
            ->shipping->toEqual(10)
            ->vat->toEqual(21)
            ->paypal->toEqual(0)
            ->status->toBe('awaiting_payment');
        expect(shopDb()->table('orders')->where('paid', 1)->count())->toBe(2)
            ->and(shopDb()->table('product')->sum('reservation'))->toEqual(0)
            ->and($response->getCookie(ShopBasketService::clientCookie(''), false)->isCleared())->toBeTrue();

        Mail::assertSent(ShopOrderMail::class, fn (ShopOrderMail $mail) => $mail->forSeller
            && $mail->hasTo('seller@berta.test')
            && $mail->totals['vat'] === 21.26
            && $mail->totals['net'] === 101.24);
        Mail::assertSent(ShopOrderMail::class, fn (ShopOrderMail $mail) => ! $mail->forSeller && $mail->hasTo('ann@buyer.test'));
    });

    it('numbers each order by its date and basket, also for orders placed in the same second', function () {
        Mail::fake();
        travelTo(Carbon::parse('2026-10-12 10:00:00'));
        $firstToken = fillShopBasket([[SHOP_CHAIR]]);
        $secondToken = fillShopBasket([[SHOP_TSHIRT, 'S']]);

        $numbers = [
            shopCheckout($firstToken)->assertOk()->json('data.order_id'),
            shopCheckout($secondToken)->assertOk()->json('data.order_id'),
        ];

        expect($numbers)->toBe(['20261012-1', '20261012-2'])
            ->and(shopDb()->table('client')->orderBy('id')->pluck('order_id')->all())->toBe($numbers);
    });

    it('thanks the customer for shopping with the site the page title names', function (array $texts, string $thanks) {
        Mail::fake();
        writeShopSettings($this->bertaRoot, [], '', $texts);
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token)->assertOk();

        Mail::assertSent(ShopOrderMail::class, fn (ShopOrderMail $mail) => ! $mail->forSeller
            && str_contains(shopMailText($mail), $thanks));
    })->with([
        'with a page title' => [['pageTitle' => 'Riga Prints'], 'Thanks for shopping with Riga Prints!'],
        'without one' => [[], 'Thanks for shopping with us!'],
    ]);

    it('asks the customer to pay to the seller details and tells the seller the order is not paid yet', function () {
        Mail::fake();
        writeShopSettings($this->bertaRoot, ['sellerDetails' => "Riga Prints SIA\nIBAN LV80BANK0000435195001"]);
        $token = fillShopBasket([[SHOP_CHAIR]]);

        $orderId = shopCheckout($token)->assertOk()->json('data.order_id');

        // 100 + 5 shipping
        Mail::assertSent(ShopOrderMail::class, function (ShopOrderMail $mail) use ($orderId) {
            $html = $mail->render();
            $text = shopMailText($mail);

            return ! $mail->forSeller
                && $mail->hasSubject('Your order')
                && str_contains($text, 'To complete it, please pay by bank transfer.')
                && str_contains($html, "Transfer <strong>105.00 EUR</strong> to the account below, with the payment reference <strong>{$orderId}</strong>, so we can match your payment.")
                && str_contains($text, "Amount 105.00 EUR Reference {$orderId}")
                && substr_count($html, 'IBAN LV80BANK0000435195001') === 1
                && str_contains($html, 'Riga Prints SIA<br />')
                && str_contains($text, 'PAYMENT Bank transfer, awaiting payment')
                && ! str_contains($html, 'being processed');
        });
        Mail::assertSent(ShopOrderMail::class, function (ShopOrderMail $mail) use ($orderId) {
            $html = $mail->render();

            return $mail->forSeller
                && $mail->hasSubject("New order {$orderId}: awaiting bank transfer")
                && str_contains($html, 'No payment has been received yet.')
                && str_contains($html, "Wait for 105.00 EUR to arrive in your bank account, with the payment reference {$orderId}.")
                && str_contains($html, 'IBAN LV80BANK0000435195001')
                && ! str_contains($html, 'did not get bank details');
        });
    });

    it('tells the customer the bank details follow and the seller to send them when the shop has none', function () {
        Mail::fake();
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token)->assertOk();

        Mail::assertSent(ShopOrderMail::class, fn (ShopOrderMail $mail) => ! $mail->forSeller
            && str_contains($mail->render(), "We'll send you the bank details for the transfer shortly"));
        Mail::assertSent(ShopOrderMail::class, fn (ShopOrderMail $mail) => $mail->forSeller
            && str_contains($mail->render(), 'the customer did not get bank details. Send them yours.'));
    });

    it('sends a plain text part with the same words as the html one', function () {
        Mail::fake();
        writeShopSettings($this->bertaRoot, ['sellerDetails' => 'Riga Prints SIA, IBAN LV80BANK0000435195001']);
        $token = fillShopBasket([[SHOP_CHAIR]]);

        $orderId = shopCheckout($token, ['name' => "Ann & O'Brien"])->assertOk()->json('data.order_id');

        Mail::assertSent(ShopOrderMail::class, function (ShopOrderMail $mail) use ($orderId) {
            if ($mail->forSeller) {
                $mail->assertSeeInText("Ann & O'Brien placed an order of 105.00 EUR and chose to pay by bank transfer.")
                    ->assertSeeInText('Total: 105.00 EUR');
            } else {
                $mail->assertSeeInText("Transfer 105.00 EUR to the account below, with the payment reference {$orderId}, so we can match your payment.")
                    ->assertSeeInText('IBAN LV80BANK0000435195001');
            }
            $mail->assertDontSeeInText('<strong>');

            return true;
        });
    });

    it('words the order number so spam filters do not take it for a hash', function (array $shop) {
        Mail::fake();
        writeShopSettings($this->bertaRoot, $shop);
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token)->assertOk();

        Mail::assertSent(ShopOrderMail::class, function (ShopOrderMail $mail) {
            expect(shopMailHexHashWords($mail))->toBe([]);

            return true;
        });
    })->with([
        'with seller details' => [['sellerDetails' => "Riga Prints SIA\nIBAN LV80BANK0000435195001"]],
        'without seller details' => [[]],
    ]);

    it('takes off at most the price of the products for a promo discount over 100%', function () {
        writeShopSettings($this->bertaRoot, ['promoCodeDiscount' => '150']);
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token, ['promo_code' => 'SAVE10'])->assertOk();

        expect(shopDb()->table('client')->where('session_id', 'checkout')->value('price_total'))->toEqual(5);
    });

    it('emails the VAT and the total excluding it at a decimal VAT rate', function () {
        Mail::fake();
        (new ShopShippingRegionsDataService(''))->saveValueByPath('1/vat', '25.5');
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token)->assertOk();

        // 100 + 5 shipping, of which 25.5% VAT
        expect(shopDb()->table('client')->where('session_id', 'checkout')->value('vat'))->toEqual(25.5);
        Mail::assertSent(ShopOrderMail::class, function (ShopOrderMail $mail) {
            $text = shopMailText($mail);

            return $mail->totals['vat_percent'] === 25.5
                && str_contains($text, 'Total excl. VAT 83.67')
                && str_contains($text, 'VAT (25.5%) 21.33');
        });
    });

    it('returns 500 and neither saves nor emails an order that fails to save', function () {
        Mail::fake();
        Exceptions::fake();
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopDb()->statement("CREATE TRIGGER fail_checkout BEFORE UPDATE OF session_id ON client WHEN NEW.session_id = 'checkout' BEGIN SELECT RAISE(ABORT, 'disk I/O error'); END");

        shopCheckout($token)->assertInternalServerError();

        expect(shopDb()->table('client')->where('session_id', $token)->exists())->toBeTrue()
            ->and(shopDb()->table('orders')->where('paid', 1)->count())->toBe(0);
        Mail::assertNothingSent();
    });

    it('places the order when sending its emails fails', function () {
        Exceptions::fake();
        config(['plugin-Shop.mailer.host' => '127.0.0.1', 'plugin-Shop.mailer.port' => 1]);
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token)
            ->assertOk()
            ->assertJsonPath('data.status', 'placed');

        expect(shopDb()->table('client')->where('session_id', 'checkout')->exists())->toBeTrue();
        Exceptions::assertReported(TransportException::class);
    });

    it('returns 410 and releases the stock of an expired basket', function () {
        $token = fillShopBasket([[SHOP_CHAIR]]);
        travel(31)->minutes();

        shopCheckout($token)->assertGone()->assertJsonPath('data.expired', true);

        expect(shopDb()->table('client')->value('session_id'))->toBe('timeout')
            ->and(shopDb()->table('product')->where('name', 'Chair')->value('instock'))->toEqual(1);
    });

    it('returns 410 without a basket', function () {
        shopCheckout('unknown-token')->assertGone();
    });

    it('starts a new basket for a cookie holding the placed order marker, leaving the orders as they were', function (int $minutes) {
        Mail::fake();
        shopCheckout(fillShopBasket([[SHOP_CHAIR]]))->assertOk();
        $order = shopDb()->table('client')->where('session_id', 'checkout')->first();
        travel($minutes)->minutes();

        $token = addToShopBasket(SHOP_TSHIRT, 'S', 'checkout')
            ->assertOk()
            ->getCookie(ShopBasketService::clientCookie(''), false)
            ->getValue();

        expect($token)->not->toBe('checkout')->toHaveLength(32);
        expect(shopDb()->table('client')->find($order->id))
            ->session_id->toBe('checkout')
            ->name->toBe('Ann Buyer');
        expect(shopDb()->table('orders')->where('id_client', $order->id)->count())->toBe(1);
    })->with([
        'within the basket lifetime' => 0,
        'after it' => 31,
    ]);

    it('rejects a payment method the shop does not accept', function () {
        writeShopSettings($this->bertaRoot, ['paymentMethod' => 'paypal', ...nvpSettings()]);
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['payment_method' => 'The shop does not accept this payment method.']);
    });

    it('requires the shipping address unless delivering to the billing address', function () {
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token, ['deliver_to_billing' => false])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['ship_name', 'ship_phone', 'ship_address']);
    });

    it('requires the company details of a legal person', function () {
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token, ['legal_person' => true])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['company', 'company_reg_no', 'legal_address']);
    });
});

describe('PayPal checkout', function () {
    it('rejects PayPal when the shop has no PayPal credentials', function () {
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token, ['payment_method' => 'paypal'])->assertUnprocessable();
    });

    it('starts an NVP payment for the server-side total without saving or emailing the order', function () {
        Mail::fake();
        writeShopSettings($this->bertaRoot, nvpSettings());
        fakeNvp();
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token, ['payment_method' => 'paypal', 'promo_code' => 'SAVE10'])
            ->assertOk()
            ->assertJsonPath('data.status', 'redirect')
            ->assertJsonPath('data.redirect_url', 'https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&useraction=commit&token=' . SHOP_NVP_TOKEN);

        Http::assertSent(fn (HttpRequest $request) => $request['METHOD'] === 'SetExpressCheckout'
            && $request['PAYMENTREQUEST_0_AMT'] === '95.00'
            && $request['PAYMENTREQUEST_0_ITEMAMT'] === '90.00'
            && $request['L_PAYMENTREQUEST_0_AMT1'] === '-10.00'
            && (string) $request['NOSHIPPING'] === '1'
            && $request['EMAIL'] === 'ann@buyer.test'
            && ! isset($request['SOLUTIONTYPE']));
        expect(shopDb()->table('client')->where('session_id', $token)->exists())->toBeTrue()
            ->and(shopDb()->table('orders')->where('paid', 1)->count())->toBe(0);
        Mail::assertNothingSent();
    });

    it('starts a REST payment on the guest checkout page for card payments', function () {
        writeShopSettings($this->bertaRoot, restSettings());
        fakeRest();
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token, ['payment_method' => 'creditcard'])
            ->assertOk()
            ->assertJsonPath('data.redirect_url', 'https://www.paypal.com/checkoutnow?token=' . SHOP_REST_TOKEN)
            ->assertJsonPath('data.token', SHOP_REST_TOKEN);

        Http::assertSent(fn (HttpRequest $request) => str_ends_with($request->url(), '/v2/checkout/orders')
            && $request['purchase_units'][0]['amount']['value'] === '105.00'
            && $request['payment_source']['paypal']['experience_context']['landing_page'] === 'GUEST_CHECKOUT'
            && $request['payment_source']['paypal']['experience_context']['shipping_preference'] === 'NO_SHIPPING'
            && $request['payment_source']['paypal']['email_address'] === 'ann@buyer.test'
            && $request['payment_source']['paypal']['name'] === ['given_name' => 'Ann', 'surname' => 'Buyer']);
    });

    it('starts a PayPal order for the buttons without a redirect to PayPal', function () {
        writeShopSettings($this->bertaRoot, restSettings());
        // An order without a payment source waits for approval in PayPal's buttons
        fakeRest(order: [
            'id' => SHOP_REST_TOKEN,
            'status' => 'CREATED',
            'links' => [
                ['rel' => 'self', 'href' => 'https://api-m.paypal.com/v2/checkout/orders/' . SHOP_REST_TOKEN],
                ['rel' => 'approve', 'href' => 'https://www.paypal.com/checkoutnow?token=' . SHOP_REST_TOKEN],
                ['rel' => 'update', 'href' => 'https://api-m.paypal.com/v2/checkout/orders/' . SHOP_REST_TOKEN],
                ['rel' => 'capture', 'href' => 'https://api-m.paypal.com/v2/checkout/orders/' . SHOP_REST_TOKEN . '/capture'],
            ],
        ]);
        $token = fillShopBasket([[SHOP_CHAIR]]);

        $orderId = shopCheckout($token, ['payment_method' => 'creditcard', 'paypal_buttons' => true])
            ->assertOk()
            ->assertJsonPath('data.token', SHOP_REST_TOKEN)
            ->json('data.order_id');

        // The buttons choose the PayPal login or the card form, PayPal only skips the shipping address
        Http::assertSent(fn (HttpRequest $request) => str_ends_with($request->url(), '/v2/checkout/orders')
            && $request['purchase_units'][0]['custom_id'] === $orderId
            && $request['payment_source']['paypal']['experience_context']['shipping_preference'] === 'NO_SHIPPING'
            && ! isset($request['payment_source']['paypal']['experience_context']['landing_page'])
            && $request['payment_source']['paypal']['email_address'] === 'ann@buyer.test'
            && $request['payment_source']['paypal']['name'] === ['given_name' => 'Ann', 'surname' => 'Buyer']);
    });

    it('fills in the name and email PayPal accepts', function (string $name, string $email, ?array $paypalName, ?string $paypalEmail) {
        writeShopSettings($this->bertaRoot, restSettings());
        fakeRest();
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token, ['payment_method' => 'paypal', 'paypal_buttons' => true, 'name' => $name, 'email' => $email])->assertOk();

        Http::assertSent(fn (HttpRequest $request) => str_ends_with($request->url(), '/v2/checkout/orders')
            && ($request['payment_source']['paypal']['name'] ?? null) === $paypalName
            && ($request['payment_source']['paypal']['email_address'] ?? null) === $paypalEmail);
    })->with([
        'a first name and surname' => ['Ann Marie  Buyer', 'ann@buyer.test', ['given_name' => 'Ann Marie', 'surname' => 'Buyer'], 'ann@buyer.test'],
        'a name and surname split by a comma' => ['Ann, Buyer', 'ann@buyer.test', ['given_name' => 'Ann', 'surname' => 'Buyer'], 'ann@buyer.test'],
        'a single name' => ['Ann', 'ann@buyer.test', null, 'ann@buyer.test'],
        'an email without a domain name' => ['Ann Buyer', 'ann@localhost', ['given_name' => 'Ann', 'surname' => 'Buyer'], null],
    ]);

    it('returns 500 and saves nothing when PayPal gives a redirect no approval page', function () {
        Exceptions::fake();
        writeShopSettings($this->bertaRoot, restSettings());
        fakeRest(order: ['id' => SHOP_REST_TOKEN, 'status' => 'CREATED', 'links' => []]);
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token, ['payment_method' => 'paypal'])->assertInternalServerError();

        expect(shopDb()->table('client')->where('session_id', $token)->exists())->toBeTrue();
        Exceptions::assertReported(fn (RuntimeException $e) => $e->getMessage() === 'PayPal order has no approval link');
    });

    it('uses REST when the shop has both REST and NVP credentials', function () {
        writeShopSettings($this->bertaRoot, [...nvpSettings(), ...restSettings()]);
        fakeRest();
        $token = fillShopBasket([[SHOP_CHAIR]]);

        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();

        Http::assertNotSent(fn (HttpRequest $request) => str_contains($request->url(), 'api-3t.paypal.com'));
    });

    it('keeps the reservations for the basket lifetime from the start of the payment', function () {
        writeShopSettings($this->bertaRoot, nvpSettings());
        fakeNvp();
        $token = fillShopBasket([[SHOP_CHAIR]]);
        travel(25)->minutes();

        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();
        travel(25)->minutes();
        postJson(storefrontUrl('stock'), ['uniqids' => [SHOP_CHAIR]]);

        expect(shopDb()->table('orders')->count())->toBe(1);
    });
});

describe('PayPal return', function () {
    it('saves and emails an order once PayPal takes the payment', function (string $api) {
        Mail::fake();
        writeShopSettings($this->bertaRoot, $api === 'nvp' ? nvpSettings() : restSettings());
        $api === 'nvp' ? fakeNvp() : fakeRest();
        $paypalToken = $api === 'nvp' ? SHOP_NVP_TOKEN : SHOP_REST_TOKEN;
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();

        $response = returnFromPaypal($paypalToken)->assertRedirect('http://shop.test/?shop_payment=paid');

        $order = shopDb()->table('client')->where('session_id', 'checkout')->first();
        expect($order)->paypal->toEqual(1)->status->toBe('paid')->price_total->toEqual(105);
        Storage::disk('local')->assertExists("shop/paypal/{$paypalToken}.json");
        expect(Storage::disk('local')->json("shop/paypal/{$paypalToken}.json"))->order_id->toBe($order->order_id);
        expect(shopDb()->table('orders')->where('paid', 1)->count())->toBe(1)
            ->and($response->getCookie(ShopBasketService::clientCookie(''), false)->isCleared())->toBeTrue()
            ->and($response->getCookie('shopping_cart', false)->isCleared())->toBeTrue();
        Mail::assertSent(ShopOrderMail::class, 2);
    })->with(['nvp', 'rest']);

    it('tells the customer the order is paid and the seller to ship it', function (string $method, string $title, string $paidWith) {
        Mail::fake();
        writeShopSettings($this->bertaRoot, restSettings());
        fakeRest();
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => $method])->assertOk();

        returnFromPaypal(SHOP_REST_TOKEN)->assertRedirect('http://shop.test/?shop_payment=paid');

        Mail::assertSent(ShopOrderMail::class, function (ShopOrderMail $mail) use ($title, $paidWith) {
            $html = $mail->render();

            return ! $mail->forSeller
                && $mail->hasSubject('Your order')
                && str_contains($html, "We've received your payment of <strong>105.00 EUR</strong> {$paidWith} and confirmed your order {$mail->order['order_id']}.")
                && str_contains(shopMailText($mail), "PAYMENT {$title}, paid")
                && ! str_contains($html, 'bank transfer')
                && shopMailHexHashWords($mail) === [];
        });
        Mail::assertSent(ShopOrderMail::class, function (ShopOrderMail $mail) use ($paidWith) {
            $html = $mail->render();

            return $mail->forSeller
                && $mail->hasSubject("New order {$mail->order['order_id']}: paid {$paidWith}")
                && str_contains($html, "Ann Buyer paid <strong>105.00 EUR</strong> {$paidWith}.")
                && str_contains($html, 'ship the order to the address below')
                && ! str_contains($html, '(paypal)')
                && shopMailHexHashWords($mail) === [];
        });
    })->with([
        'PayPal' => ['paypal', 'PayPal', 'with PayPal'],
        'card' => ['creditcard', 'Card (via PayPal)', 'by card via PayPal'],
    ]);

    it('saves nothing when PayPal declines the payment', function (string $api) {
        Mail::fake();
        writeShopSettings($this->bertaRoot, $api === 'nvp' ? nvpSettings() : restSettings());
        $api === 'nvp'
            ? fakeNvp('Failure')
            : fakeRest(fn () => Http::response(['name' => 'UNPROCESSABLE_ENTITY', 'details' => [['issue' => 'INSTRUMENT_DECLINED']]], 422));
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();

        returnFromPaypal($api === 'nvp' ? SHOP_NVP_TOKEN : SHOP_REST_TOKEN)
            ->assertRedirect('http://shop.test/?shop_payment=failed');

        expect(shopDb()->table('client')->where('session_id', $token)->exists())->toBeTrue();
        Storage::disk('local')->assertMissing('shop/paypal/' . ($api === 'nvp' ? SHOP_NVP_TOKEN : SHOP_REST_TOKEN) . '.json');
        Mail::assertNothingSent();
    })->with(['nvp', 'rest']);

    it('leaves products added after the payment started unpaid', function () {
        Mail::fake();
        writeShopSettings($this->bertaRoot, restSettings());
        fakeRest();
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();
        addToShopBasket(SHOP_TSHIRT, 'S', $token)->assertOk();

        returnFromPaypal(SHOP_REST_TOKEN)->assertRedirect('http://shop.test/?shop_payment=paid');

        expect(shopDb()->table('orders')->join('product', 'product.id', '=', 'orders.id_product')->pluck('orders.paid', 'product.name')->all())
            ->toEqual(['Chair' => 1, 'T-shirt S' => 0]);
    });

    it('reserves the products again when their reservation expired while the customer was at PayPal', function () {
        Mail::fake();
        writeShopSettings($this->bertaRoot, nvpSettings());
        fakeNvp();
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();
        travel(31)->minutes();
        postJson(storefrontUrl('stock'), ['uniqids' => [SHOP_CHAIR]])->assertJsonPath('data.0.instock', 1);

        returnFromPaypal(SHOP_NVP_TOKEN)->assertRedirect('http://shop.test/?shop_payment=paid');

        expect(shopDb()->table('orders')->where('paid', 1)->count())->toBe(1)
            ->and(shopDb()->table('product')->where('uniqid', SHOP_CHAIR)->value('instock'))->toEqual(0);
    });

    it('takes no payment for products sold while the customer was at PayPal', function () {
        Mail::fake();
        writeShopSettings($this->bertaRoot, nvpSettings());
        fakeNvp();
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();
        travel(31)->minutes();
        addToShopBasket(SHOP_CHAIR)->assertOk();

        returnFromPaypal(SHOP_NVP_TOKEN)->assertRedirect('http://shop.test/?shop_payment=failed');

        expect(capturesSent())->toBe(0)
            ->and(shopDb()->table('client')->where('session_id', 'checkout')->exists())->toBeFalse()
            ->and(shopDb()->table('orders')->count())->toBe(1);
        Mail::assertNothingSent();
    });

    it('captures nothing for a payment it did not start', function () {
        writeShopSettings($this->bertaRoot, nvpSettings());
        fakeNvp();

        returnFromPaypal('EC-UNKNOWN')->assertRedirect('http://shop.test/?shop_payment=failed');

        expect(capturesSent())->toBe(0);
    });

    it('answers a repeated return with the first outcome without capturing again', function () {
        Mail::fake();
        writeShopSettings($this->bertaRoot, nvpSettings());
        fakeNvp();
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();
        returnFromPaypal(SHOP_NVP_TOKEN)->assertRedirect('http://shop.test/?shop_payment=paid');

        returnFromPaypal(SHOP_NVP_TOKEN)->assertRedirect('http://shop.test/?shop_payment=paid');

        expect(capturesSent())->toBe(1);
        Mail::assertSent(ShopOrderMail::class, 2);
    });

    it('reports an unconfirmed payment when PayPal does not answer, and asks again on the next return', function () {
        Mail::fake();
        Exceptions::fake();
        writeShopSettings($this->bertaRoot, restSettings());
        $attempts = 0;
        fakeRest(function () use (&$attempts) {
            return $attempts++ === 0 ? Http::failedConnection() : Http::response(paidRestOrder());
        });
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();

        returnFromPaypal(SHOP_REST_TOKEN)->assertRedirect('http://shop.test/?shop_payment=unconfirmed');
        expect(shopDb()->table('client')->where('session_id', 'checkout')->exists())->toBeFalse();

        returnFromPaypal(SHOP_REST_TOKEN)->assertRedirect('http://shop.test/?shop_payment=paid');
        expect(shopDb()->table('client')->where('session_id', 'checkout')->exists())->toBeTrue();
        Http::assertSent(fn (HttpRequest $request) => str_ends_with($request->url(), '/capture')
            && $request->header('PayPal-Request-Id') === ['capture-' . SHOP_REST_TOKEN]);
    });

    it('emails a paid order that fails to save', function () {
        Mail::fake();
        Exceptions::fake();
        writeShopSettings($this->bertaRoot, nvpSettings());
        fakeNvp();
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();
        shopDb()->statement("CREATE TRIGGER fail_checkout BEFORE UPDATE OF session_id ON client WHEN NEW.session_id = 'checkout' BEGIN SELECT RAISE(ABORT, 'disk I/O error'); END");

        returnFromPaypal(SHOP_NVP_TOKEN)->assertRedirect('http://shop.test/?shop_payment=paid');

        Mail::assertSent(ShopOrderMail::class, fn (ShopOrderMail $mail) => $mail->hasTo('seller@berta.test'));
        Exceptions::assertReported(fn (QueryException $e) => str_contains($e->getMessage(), 'disk I/O error'));
    });

    it('tells the customer the payment went through when the email fails', function () {
        Exceptions::fake();
        config(['plugin-Shop.mailer.host' => '127.0.0.1', 'plugin-Shop.mailer.port' => 1]);
        writeShopSettings($this->bertaRoot, nvpSettings());
        fakeNvp();
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();

        returnFromPaypal(SHOP_NVP_TOKEN)->assertRedirect('http://shop.test/?shop_payment=paid');

        expect(shopDb()->table('client')->where('session_id', 'checkout')->exists())->toBeTrue();
        Exceptions::assertReported(TransportException::class);
    });

    it('keeps the basket when the customer cancels at PayPal', function () {
        writeShopSettings($this->bertaRoot, nvpSettings());
        fakeNvp();
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();

        get(storefrontUrl('paypal/cancel', ['token' => SHOP_NVP_TOKEN]))
            ->assertRedirect('http://shop.test/?shop_payment=cancelled');

        expect(shopDb()->table('client')->where('session_id', $token)->exists())->toBeTrue()
            ->and(capturesSent())->toBe(0);
    });
});

describe('PayPal buttons', function () {
    it('returns the client ID, script and currency the buttons start with', function () {
        writeShopSettings($this->bertaRoot, [...restSettings(), 'paypalSandbox' => 'yes']);

        getJson(storefrontUrl('paypal/buttons'))
            ->assertOk()
            ->assertExactJson(['message' => '', 'data' => [
                'client_id' => 'client-id',
                'sdk_url' => 'https://www.sandbox.paypal.com/web-sdk/v6/core',
                'currency' => 'EUR',
            ]]);
    });

    it('returns 404 so the cart keeps the redirect to PayPal', function (Closure $settings) {
        writeShopSettings($this->bertaRoot, $settings());

        getJson(storefrontUrl('paypal/buttons'))->assertNotFound();

        Http::assertNothingSent();
    })->with([
        'Classic credentials' => fn () => nvpSettings(),
        'no PayPal credentials' => fn () => [],
        'bank transfer only' => fn () => [...restSettings(), 'paymentMethod' => 'bank'],
    ]);

    it('saves and emails an order paid with the buttons', function () {
        Mail::fake();
        writeShopSettings($this->bertaRoot, restSettings());
        fakeRest();
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();

        $response = asShopCustomer($token)
            ->postJson(storefrontUrl('paypal/capture'), ['token' => SHOP_REST_TOKEN])
            ->assertOk()
            ->assertJsonPath('data.status', 'paid');

        expect(shopDb()->table('client')->where('session_id', 'checkout')->exists())->toBeTrue()
            ->and($response->getCookie(ShopBasketService::clientCookie(''), false)->isCleared())->toBeTrue()
            ->and($response->getCookie('shopping_cart', false)->isCleared())->toBeTrue();
        Mail::assertSent(ShopOrderMail::class, 2);
    });

    it('saves nothing when PayPal declines a payment from the buttons', function () {
        Mail::fake();
        writeShopSettings($this->bertaRoot, restSettings());
        fakeRest(fn () => Http::response(['name' => 'UNPROCESSABLE_ENTITY', 'details' => [['issue' => 'INSTRUMENT_DECLINED']]], 422));
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'creditcard'])->assertOk();

        asShopCustomer($token)
            ->postJson(storefrontUrl('paypal/capture'), ['token' => SHOP_REST_TOKEN])
            ->assertOk()
            ->assertJsonPath('data.status', 'failed');

        expect(shopDb()->table('client')->where('session_id', $token)->exists())->toBeTrue();
        Mail::assertNothingSent();
    });

    it('answers a repeated capture with the first outcome without capturing again', function () {
        Mail::fake();
        writeShopSettings($this->bertaRoot, restSettings());
        fakeRest();
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();
        postJson(storefrontUrl('paypal/capture'), ['token' => SHOP_REST_TOKEN])->assertJsonPath('data.status', 'paid');

        postJson(storefrontUrl('paypal/capture'), ['token' => SHOP_REST_TOKEN])->assertJsonPath('data.status', 'paid');

        expect(capturesSent())->toBe(1);
    });

    it('takes no second payment for a basket already paid', function () {
        Mail::fake();
        writeShopSettings($this->bertaRoot, restSettings());
        $order = fn (string $id) => ['id' => $id, 'status' => 'CREATED', 'links' => [['rel' => 'approve', 'href' => "https://www.paypal.com/checkoutnow?token={$id}"]]];
        Http::fake([
            'api-m.paypal.com/v1/oauth2/token' => Http::response(['access_token' => 'A21AA', 'expires_in' => 32400]),
            'api-m.paypal.com/v2/checkout/orders' => Http::sequence()->push($order('CARDORDER1'))->push($order('PAYPALORDER1')),
            'api-m.paypal.com/v2/checkout/orders/*/capture' => Http::response(paidRestOrder()),
        ]);
        $token = fillShopBasket([[SHOP_CHAIR]]);
        // The card form opened, then the customer switched to PayPal's popup
        shopCheckout($token, ['payment_method' => 'creditcard', 'paypal_buttons' => true])->assertJsonPath('data.token', 'CARDORDER1');
        shopCheckout($token, ['payment_method' => 'paypal', 'paypal_buttons' => true])->assertJsonPath('data.token', 'PAYPALORDER1');
        postJson(storefrontUrl('paypal/capture'), ['token' => 'PAYPALORDER1'])->assertJsonPath('data.status', 'paid');

        postJson(storefrontUrl('paypal/capture'), ['token' => 'CARDORDER1'])->assertJsonPath('data.status', 'failed');

        expect(capturesSent())->toBe(1)
            ->and(shopDb()->table('client')->where('session_id', 'checkout')->count())->toBe(1);
        Mail::assertSent(ShopOrderMail::class, 2);
    });

    it('takes no second payment for a basket approved twice at once', function () {
        Mail::fake();
        Sleep::fake(syncWithCarbon: true);
        writeShopSettings($this->bertaRoot, restSettings());
        $order = fn (string $id) => ['id' => $id, 'status' => 'CREATED', 'links' => [['rel' => 'approve', 'href' => "https://www.paypal.com/checkoutnow?token={$id}"]]];
        $cardCapture = null;
        Http::fake([
            'api-m.paypal.com/v1/oauth2/token' => Http::response(['access_token' => 'A21AA', 'expires_in' => 32400]),
            'api-m.paypal.com/v2/checkout/orders' => Http::sequence()->push($order('CARDORDER1'))->push($order('PAYPALORDER1')),
            'api-m.paypal.com/v2/checkout/orders/*/capture' => function (HttpRequest $request) use (&$cardCapture) {
                if (str_contains($request->url(), 'PAYPALORDER1')) {
                    // The customer approves the card form's payment while PayPal takes the popup's
                    $cardCapture = postJson(storefrontUrl('paypal/capture'), ['token' => 'CARDORDER1']);
                }

                return Http::response(paidRestOrder());
            },
        ]);
        $token = fillShopBasket([[SHOP_CHAIR]]);
        shopCheckout($token, ['payment_method' => 'creditcard', 'paypal_buttons' => true])->assertJsonPath('data.token', 'CARDORDER1');
        shopCheckout($token, ['payment_method' => 'paypal', 'paypal_buttons' => true])->assertJsonPath('data.token', 'PAYPALORDER1');

        postJson(storefrontUrl('paypal/capture'), ['token' => 'PAYPALORDER1'])->assertJsonPath('data.status', 'paid');

        $cardCapture->assertJsonPath('data.status', 'unconfirmed');
        // Approved again, the card payment finds the basket paid
        postJson(storefrontUrl('paypal/capture'), ['token' => 'CARDORDER1'])->assertJsonPath('data.status', 'failed');
        expect(capturesSent())->toBe(1);
    });

    it('captures nothing for a malformed token', function () {
        writeShopSettings($this->bertaRoot, restSettings());
        fakeRest();

        postJson(storefrontUrl('paypal/capture'), ['token' => '../' . SHOP_REST_TOKEN])
            ->assertOk()
            ->assertJsonPath('data.status', 'failed');

        expect(capturesSent())->toBe(0);
    });
});

it('lists the products of priced entries for the shop admin', function () {
    actingAs(new User);

    getJson('http://shop.test' . route('products', [], false))->assertOk();

    expect(shopDb()->table('product')->pluck('name')->sort()->values()->all())->toBe(['Chair', 'T-shirt M', 'T-shirt S']);
});

it('lists only the paid products of an order for the shop admin', function () {
    Mail::fake();
    writeShopSettings($this->bertaRoot, restSettings());
    fakeRest();
    $token = fillShopBasket([[SHOP_CHAIR]]);
    shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();
    addToShopBasket(SHOP_TSHIRT, 'S', $token)->assertOk();
    returnFromPaypal(SHOP_REST_TOKEN)->assertRedirect('http://shop.test/?shop_payment=paid');
    actingAs(new User);

    $orders = getJson('http://shop.test' . route('orders', [], false))->assertOk()->json('data')['']['orders'];

    expect($orders)->toHaveCount(1)
        ->and(array_column($orders[0]['orders'], 'name'))->toBe(['Chair']);
});

it('prices products in whole cents, as the site shows them, so PayPal takes the order', function () {
    $blog = $this->bertaRoot . '/storage/blog.shop.xml';
    File::put($blog, str_replace('<cartPrice><![CDATA[100]]>', '<cartPrice><![CDATA[33.333]]>', File::get($blog)));
    postJson(storefrontUrl('stock'), ['uniqids' => [SHOP_CHAIR]]);
    shopDb()->table('product')->where('uniqid', SHOP_CHAIR)->update(['instock' => 3]);
    writeShopSettings($this->bertaRoot, restSettings());
    fakeRest();
    $token = fillShopBasket([[SHOP_CHAIR], [SHOP_CHAIR], [SHOP_CHAIR]]);

    shopCheckout($token, ['payment_method' => 'paypal'])->assertOk();

    Http::assertSent(function (HttpRequest $request) {
        $purchase = $request['purchase_units'][0] ?? null;

        return $purchase
            && $purchase['items'][0]['unit_amount']['value'] === '33.33'
            && $purchase['amount']['breakdown']['item_total']['value'] === '99.99'
            && $purchase['amount']['value'] === '109.99';
    });
});

it('adds the columns of newer shop versions to an older shop database', function () {
    $database = $this->bertaRoot . '/storage/old-shop-db.sqlite';
    $db = new SQLite3($database);
    $db->exec('CREATE TABLE client (id INTEGER PRIMARY KEY, created_at datetime NOT NULL, session_id varchar(32) NOT NULL)');
    $db->exec('CREATE TABLE orders (id INTEGER PRIMARY KEY, created_at datetime NOT NULL, id_client int NOT NULL, id_product int NOT NULL, paid tinyint DEFAULT 0, price decimal(10,2))');
    $db->close();
    config(['plugin-Shop.database-connections.sqlite.database' => $database]);
    writeShopSettings($this->bertaRoot, ['version' => '3']);

    $schema = (new ShopClientsDataService(''))->getConnection()->getSchemaBuilder();

    expect($schema->hasColumns('client', ['company', 'company_reg_no', 'legal_address', 'status', 'admin_notes']))->toBeTrue()
        ->and($schema->hasColumn('orders', 'weight'))->toBeTrue()
        ->and((new SiteSettingsDataService(''))->get()['shop']['version'])->toEqual(7);
});
