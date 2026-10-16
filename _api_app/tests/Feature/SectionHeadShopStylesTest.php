<?php

use App\Http\Middleware\SetupMiddleware;
use App\Models\User;
use Illuminate\Support\Facades\File;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\withoutMiddleware;

beforeEach(function () {
    skipWithoutShopPlugin();

    $realRoot = config('app.old_berta_root');
    $this->bertaRoot = setUpShopTestRoot();
    // The section renderers read the site owner's account
    File::ensureDirectoryExists($this->bertaRoot . '/engine/config');
    File::put($this->bertaRoot . '/engine/config/inc.conf.php', "<?php\n\$options['AUTH_user'] = 'owner';\n\$options['AUTH_password'] = 'password';\n");
    symlink("{$realRoot}/engine/inc.hosting.php", "{$this->bertaRoot}/engine/inc.hosting.php");
    // SetupMiddleware reconciles the real .env file on every request.
    withoutMiddleware(SetupMiddleware::class);
    actingAs(new User);
});

afterEach(function () {
    if (isset($this->bertaRoot)) {
        File::deleteDirectory($this->bertaRoot);
    }
});

/**
 * @param  array<string, array<string, string>>  $settings
 */
function writeMessySettings(string $bertaRoot, array $settings): void
{
    $groups = '';
    foreach ($settings as $group => $values) {
        $groups .= "<{$group}>" . implode('', array_map(
            fn ($name, $value) => "<{$name}><![CDATA[{$value}]]></{$name}>",
            array_keys($values),
            $values,
        )) . "</{$group}>";
    }

    File::put($bertaRoot . '/storage/settings.messy.xml', "<?xml version=\"1.0\" encoding=\"utf-8\"?><settings>{$groups}</settings>");
}

it('links the static shop styles and writes the price and cart heading fonts', function () {
    writeShopSettings($this->bertaRoot, ['priceItemFontcolor' => '#ff0000', 'priceItemgoogleFont' => 'Roboto:400,700', 'priceItemfontSize' => '']);
    writeMessySettings($this->bertaRoot, ['entryHeading' => ['fontWeight' => 'bold', 'fontStyle' => '']]);

    get('http://shop.test/v1/sites/sections/render-head')
        ->assertOk()
        ->assertSee('/_plugin_shop/css/shop.css?', false)
        ->assertDontSee('shop.css.php', false)
        // An empty setting shows its default, as the site's settings files read it
        ->assertSee('#pageEntries .cartPrice { color: #ff0000; font-family: Roboto; font-size: 12px; font-weight: bold; font-style: normal; font-variant: normal; line-height: 14px; }', false)
        ->assertSee('#shoppingCartTitle, #shoppingCartEmpty { font-family: Arial, sans-serif; font-weight: bold; font-style: normal; font-variant: normal; }', false)
        ->assertDontSee('#shoppingCart { position: relative;', false);
});

it('writes the cart link and price layout of a responsive, centered page', function () {
    writeMessySettings($this->bertaRoot, ['pageLayout' => ['responsive' => 'yes', 'centeredContents' => 'yes']]);

    get('http://shop.test/v1/sites/sections/render-head')
        ->assertOk()
        ->assertSee('#shoppingCart { position: relative; float: right; right: inherit; margin: 0 10px 10px 10px; }#shoppingCart { margin-top: 20px; }', false)
        ->assertSee('@media (max-width: 767px) {.bt-auto-responsive #shoppingCart { margin-top: 20px; }', false);
});

it('leaves the shop styles out on a domain without a shop key', function () {
    get('http://other.test/v1/sites/sections/render-head')
        ->assertOk()
        ->assertDontSee('/_plugin_shop/css/', false)
        ->assertDontSee('.cartPrice', false);
});
