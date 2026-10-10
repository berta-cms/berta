<?php

use App\Plugins\Shop\ShopCartRenderService;
use App\Plugins\Shop\ShopSettingsDataService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

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
        'cartManualTransfer', 'cartTextAddress', 'cartTextBillAddr', 'cartTextCPM', 'cartTextCheckoutButton',
        'cartTextCheckoutDescription', 'cartTextComments', 'cartTextCompany', 'cartTextCompanyRegNo',
        'cartTextDeliverBilling', 'cartTextDiscount', 'cartTextEmail', 'cartTextEmpty', 'cartTextExpired',
        'cartTextFillRequiredFields', 'cartTextInclVat', 'cartTextLegalAddress', 'cartTextLegalPerson',
        'cartTextNameSurname', 'cartTextPaymentDescription', 'cartTextPhoneNumber', 'cartTextPrice',
        'cartTextPromoBtn', 'cartTextPromoCode', 'cartTextQuantity', 'cartTextReceiveNews', 'cartTextReturnStore',
        'cartTextShipAddr', 'cartTextShippingTo', 'cartTextSum', 'cartTextTerms', 'cartTextTitle', 'cartTextTotal',
        'shippingTotalText',
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
