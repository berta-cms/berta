<?php

use App\Plugins\Shop\ShopCartRenderService;
use App\Plugins\Shop\ShopSettingsDataService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    skipWithoutShopPlugin();

    $this->bertaRoot = setUpShopTestRoot();
});

afterEach(function () {
    if (isset($this->bertaRoot)) {
        File::deleteDirectory($this->bertaRoot);
    }
});

/**
 * The shopping cart section as the site shows it to visitors
 *
 * @param  array<string, string>  $shop
 */
function renderSiteCart(string $bertaRoot, array $shop = []): string
{
    writeShopSettings($bertaRoot, $shop);

    return (string) (new ShopCartRenderService)->render(
        '',
        ['template' => ['template' => 'messy-0.4.2']],
        (new ShopSettingsDataService(''))->get(),
        [],
        Request::create('http://shop.test/cart'),
        [['name' => 'cart', 'title' => 'Cart', '@attributes' => ['type' => 'shopping_cart']]],
        'cart',
        false,
    );
}

it('gives the site script the cart page to open after PayPal, on the site only', function (bool $isEditMode, string $link, ?string $cartUrl) {
    $html = (string) (new ShopCartRenderService)->renderCartLink(
        Request::create('http://shop.test/'),
        'blog',
        [],
        [],
        [['name' => 'cart', 'title' => 'Cart', '@attributes' => ['type' => 'shopping_cart', 'published' => 1]]],
        null,
        true,
        false,
        $isEditMode,
    );

    expect($html)->toContain("href=\"{$link}\"");
    $cartUrl === null
        ? expect($html)->not->toContain('data-cart-url')
        : expect($html)->toContain("data-cart-url=\"{$cartUrl}\"");
})->with([
    'on the site' => [false, "javascript:openShoppingCart('/blog/cart/');", '/blog/cart/'],
    'in the editor' => [true, '?site=blog&section=cart', null],
]);

describe('PayPal buttons', function () {
    $restSettings = ['paypalClientId' => 'client-id', 'paypalClientSecret' => 'client-secret', 'paypalCurrencyCode' => 'EUR'];

    it('start with the client ID, script and currency of a shop with REST credentials', function () use ($restSettings) {
        Http::fake();

        expect(renderSiteCart($this->bertaRoot, [...$restSettings, 'paypalSandbox' => 'yes']))->toContain(
            '<div id="shoppingCartOuter" class="cart" data-paypal-client-id="client-id"'
            . ' data-paypal-sdk-url="https://www.sandbox.paypal.com/web-sdk/v6/core" data-paypal-currency="EUR">'
        );
        Http::assertNothingSent();
    });

    it('are left out, so the cart keeps the redirect to PayPal', function (array $shop) {
        expect(renderSiteCart($this->bertaRoot, $shop))->toContain('<div id="shoppingCartOuter" class="cart">');
    })->with([
        'Classic credentials' => [['paypalUserName' => 'seller_api1.berta.test', 'paypalUserPassword' => 'secret', 'paypalSignature' => 'signature']],
        'no PayPal credentials' => [[]],
        'bank transfer only' => [[...$restSettings, 'paymentMethod' => 'bank']],
    ]);

    it('are left out in the editor', function () use ($restSettings) {
        writeShopSettings($this->bertaRoot, $restSettings);

        $html = (string) (new ShopCartRenderService)->render(
            '',
            ['template' => ['template' => 'messy-0.4.2']],
            (new ShopSettingsDataService(''))->get(),
            [],
            Request::create('http://shop.test/cart'),
            [['name' => 'cart', 'title' => 'Cart', '@attributes' => ['type' => 'shopping_cart']]],
            'cart',
            true,
        );

        expect($html)->toContain('<div id="shoppingCartOuter" class="cart">');
    });
});

it('preselects bank transfer when PayPal is not set up', function () {
    $html = renderSiteCart($this->bertaRoot);

    expect($html)
        ->not->toContain('id="pm_paypal"')
        ->not->toContain('id="pm_creditcard"')
        ->toMatch('/id="pm_bank_transfer" checked="checked"/');
});

it('preselects card payment when PayPal is set up', function () {
    $html = renderSiteCart($this->bertaRoot, [
        'paypalUserName' => 'seller_api1.berta.test',
        'paypalUserPassword' => 'secret',
        'paypalSignature' => 'signature',
    ]);

    expect($html)
        ->toContain('id="pm_paypal"')
        ->toMatch('/id="pm_creditcard" checked="checked"/')
        ->not->toMatch('/id="pm_bank_transfer"[^>]*checked/');
});

it('shows the promo code entry only for a promo code with a discount', function (array $shop, bool $isShown) {
    $html = renderSiteCart($this->bertaRoot, $shop);

    expect(str_contains($html, 'id="promo_code"'))->toBe($isShown);
})->with([
    'a code and a discount' => [['promoCode' => 'SAVE10', 'promoCodeDiscount' => '10'], true],
    'no code' => [['promoCode' => '', 'promoCodeDiscount' => '10'], false],
    'no discount' => [['promoCode' => 'SAVE10', 'promoCodeDiscount' => ''], false],
]);

it('escapes shipping region names once', function () {
    writeShopSettings($this->bertaRoot);

    $html = (string) (new ShopCartRenderService)->render(
        '',
        ['template' => ['template' => 'messy-0.4.2']],
        (new ShopSettingsDataService(''))->get(),
        [['id' => 1, 'name' => 'Rock & Roll', 'vat' => 0]],
        Request::create('http://shop.test/cart'),
        [['name' => 'cart', 'title' => 'Cart', '@attributes' => ['type' => 'shopping_cart']]],
        'cart',
        false,
    );

    expect($html)->toContain('<option value="1">Rock &amp; Roll</option>');
});

describe('editable texts', function () {
    $customTexts = collect([
        'cartManualTransfer', 'cartTextAddress', 'cartTextBillAddr', 'cartTextCPM', 'cartTextCardPayment',
        'cartTextCheckoutButton', 'cartTextCheckoutDescription', 'cartTextComments', 'cartTextCompany',
        'cartTextCompanyRegNo', 'cartTextDeliverBilling', 'cartTextDiscount', 'cartTextEmail', 'cartTextEmpty',
        'cartTextExpired', 'cartTextFillRequiredFields', 'cartTextInclVat', 'cartTextLegalAddress',
        'cartTextLegalPerson', 'cartTextNameSurname', 'cartTextPaymentDescription', 'cartTextPaypalPayment',
        'cartTextPhoneNumber', 'cartTextPrice', 'cartTextPromoBtn', 'cartTextPromoCode', 'cartTextQuantity',
        'cartTextReceiveNews', 'cartTextReturnStore', 'cartTextShipAddr', 'cartTextShippingTo', 'cartTextSum',
        'cartTextTerms', 'cartTextTitle', 'cartTextTotal', 'cartTextVatNo', 'shippingTotalText',
    ])->mapWithKeys(fn ($setting) => [$setting => "Custom {$setting}"])->all();

    it('renders the cart texts', function (bool $isEditMode, array $siteTexts) {
        $html = (string) (new ShopCartRenderService)->render(
            'blog',
            ['template' => ['template' => 'messy-0.4.2'], 'siteTexts' => $siteTexts],
            (new ShopSettingsDataService(''))->get(),
            [['id' => 1, 'name' => 'Europe', 'vat' => 21]],
            Request::create('http://shop.test/cart'),
            [['name' => 'cart', 'title' => 'Cart', '@attributes' => ['type' => 'shopping_cart']]],
            'cart',
            $isEditMode,
        );

        expect($html)->toMatchSnapshot();
    })->with([
        'on the site, by default' => [false, []],
        'on the site, customised' => [false, $customTexts],
        'in the editor, by default' => [true, []],
        'in the editor, customised' => [true, $customTexts],
    ]);
});
