<?php

use App\Plugins\Shop\ShopClientsDataService;
use App\Plugins\Shop\ShopInvoice;
use App\Plugins\Shop\ShopOrdersDataService;
use App\Plugins\Shop\ShopProductsDataService;
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
 * A checked-out order of a chair for 100 and a T-shirt for 25, with a 10% promo discount and 10 shipping, 21% VAT
 * included, as the shop admin finds it
 *
 * @param  array<string, mixed>  $columns  The order's `client` columns besides the amounts
 */
function savedShopOrder(array $columns = []): object
{
    (new ShopClientsDataService(''))->query()->insert([
        'id' => 1,
        'created_at' => '2026-10-12 10:20:00',
        'session_id' => 'checkout',
        'order_id' => '2026-7',
        'name' => 'Ann Buyer',
        'phone' => '+371 20000000',
        'address' => 'Brivibas 1, Riga',
        'email' => 'ann@buyer.test',
        'vat' => 21,
        'shipping' => 10,
        'price_total' => 122.5,
        'promo_code' => 'SAVE10',
        'paypal' => 0,
        'payment_method' => 'bank_transfer',
        ...$columns,
    ]);
    (new ShopProductsDataService(''))->query()->insert([
        ['id' => 1, 'uniqid' => 'chair', 'name' => 'Chair'],
        ['id' => 2, 'uniqid' => 'tshirt', 'name' => 'T-shirt M'],
    ]);
    (new ShopOrdersDataService(''))->query()->insert([
        ['id' => 1, 'created_at' => '2026-10-12 10:00:00', 'id_client' => 1, 'id_product' => 1, 'paid' => 1, 'price' => 100],
        ['id' => 2, 'created_at' => '2026-10-12 10:00:00', 'id_client' => 1, 'id_product' => 2, 'paid' => 1, 'price' => 25],
    ]);

    return (new ShopClientsDataService(''))->findOrder(1);
}

function savedShopOrderInvoice(object $order): string
{
    $shop = ['currency' => 'EUR', 'email' => 'seller@berta.test', 'sellerDetails' => "Riga Prints SIA\nIBAN LV80BANK0000435195001"];

    return ShopInvoice::fromSavedOrder($order, $shop, 'Riga Prints')->html();
}

/**
 * The invoice's text as its reader sees it, without the markup
 */
function shopInvoiceText(string $html): string
{
    return preg_replace('/\s+/', ' ', html_entity_decode(strip_tags($html), ENT_QUOTES));
}

it('shows the seller, the amounts and the bank transfer of a saved order', function () {
    $order = savedShopOrder();

    $html = savedShopOrderInvoice($order);

    expect(shopInvoiceText($html))
        ->toContain('Invoice 2026-7 12.10.2026 Riga Prints')
        ->toContain('Chair 1 100.00 100.00')
        ->toContain('T-shirt M 1 25.00 25.00')
        ->toContain('Subtotal 125.00 Discount (10%) -12.50 Shipping 10.00 Total excl. VAT 101.24 VAT (21%) 21.26 Total 122.50 EUR')
        ->toContain('Please pay 122.50 EUR by bank transfer to the account in the seller details, with the payment reference 2026-7.')
        ->not->toContain('seller@berta.test')
        ->not->toContain('Paid ');
    expect($html)
        ->toContain('Riga Prints SIA<br />' . "\n" . 'IBAN LV80BANK0000435195001')
        ->toContain('Ann Buyer<br>Brivibas 1, Riga<br>+371 20000000<br>ann@buyer.test');
});

it('shows the company details of a legal person, and the shipping address of an order shipped elsewhere', function () {
    $order = savedShopOrder([
        'company' => 'Buyer SIA',
        'company_reg_no' => '40003000000',
        'vat_no' => 'LV40003000000',
        'legal_address' => 'Brivibas 2, Riga',
        'ship_name' => 'Juris Buyer',
        'ship_address' => 'Lacplesa 5, Riga',
    ]);

    $html = savedShopOrderInvoice($order);

    expect($html)
        ->toContain('Buyer SIA<br>Reg. no. 40003000000<br>VAT no. LV40003000000<br>Legal address: Brivibas 2, Riga<br>Ann Buyer')
        ->toContain('SHIPPING ADDRESS</p>')
        ->toContain('Juris Buyer<br>Lacplesa 5, Riga')
        ->not->toContain('Same as billing address');
});

it('shows how and when a paid order was paid', function (array $payment, array $paid) {
    $order = savedShopOrder($payment);

    $text = shopInvoiceText(savedShopOrderInvoice($order));

    expect($text)
        ->toContain(...$paid)
        ->not->toContain('Please pay');
})->with([
    'with PayPal' => [
        ['payment_method' => 'paypal', 'paypal' => 1, 'payment_reference' => '3C679366HH908993F'],
        ['PAYMENT Paid with PayPal on 12.10.2026.', 'PayPal transaction 3C679366HH908993F'],
    ],
    'by card' => [
        ['payment_method' => 'creditcard', 'paypal' => 1, 'payment_reference' => '3C679366HH908993F'],
        ['PAYMENT Paid by debit or credit card on 12.10.2026.'],
    ],
    'an order placed before the payment method was saved' => [
        ['payment_method' => null, 'paypal' => 1],
        ['PAYMENT Paid with PayPal on 12.10.2026.'],
    ],
]);

it('escapes the customer details', function () {
    $order = savedShopOrder(['name' => '<b>Ann</b>', 'company' => 'Buyer & <i>Co</i>', 'company_reg_no' => '1', 'legal_address' => 'Riga']);

    $html = savedShopOrderInvoice($order);

    expect($html)
        ->toContain('&lt;b&gt;Ann&lt;/b&gt;')
        ->toContain('Buyer &amp; &lt;i&gt;Co&lt;/i&gt;')
        ->not->toContain('<b>Ann</b>');
});
