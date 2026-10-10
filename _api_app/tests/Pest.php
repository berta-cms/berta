<?php

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use PHPUnit\Framework\Assert;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->extend(TestCase::class)->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function something()
{
    // ..
}

/**
 * Whether this Berta has the shop plugin. Its Laravel part (`app/Plugins/Shop`) and the site
 * engine's part (`_plugin_shop`) are separate repositories, installed together. Checks the
 * files rather than the classes: Composer's class map may still list a removed plugin's classes.
 */
function isShopPluginInstalled(): bool
{
    return is_file(__DIR__ . '/../app/Plugins/Shop/ShopController.php')
        && is_file(__DIR__ . '/../../_plugin_shop/inc.setting-definition.php');
}

/**
 * Skips the test without the shop plugin. A shop test file calls it first in its `beforeEach`,
 * before any setup that needs the plugin: Pest's `->skip()` only applies after the hooks ran.
 */
function skipWithoutShopPlugin(): void
{
    if (! isShopPluginInstalled()) {
        Assert::markTestSkipped('Shop plugin not installed');
    }
}

/**
 * A temporary Berta root for the shop plugin's tests, with its shop database and file cache
 *
 * @return string The root's path, for the test to delete afterwards
 */
function setUpShopTestRoot(): string
{
    $realRoot = config('app.old_berta_root');
    $bertaRoot = sys_get_temp_dir() . '/berta_shop_' . uniqid();
    File::ensureDirectoryExists($bertaRoot . '/storage');
    File::ensureDirectoryExists($bertaRoot . '/engine');
    File::ensureDirectoryExists($bertaRoot . '/_plugin_shop');
    // Site settings read the legacy engine's definitions, and an anonymous request's auth
    // check logs out through the legacy engine
    foreach (['engine/_classes', 'engine/lang', 'engine/inc.settings.php', 'engine/inc.version.php', '_templates'] as $path) {
        symlink("{$realRoot}/{$path}", "{$bertaRoot}/{$path}");
    }
    File::copy($realRoot . '/_plugin_shop/inc.setting-definition.php', $bertaRoot . '/_plugin_shop/inc.setting-definition.php');
    File::put($bertaRoot . '/engine/hosting', json_encode(['emailFromAddress' => 'shop@berta.test']));

    config([
        'app.old_berta_root' => $bertaRoot,
        'plugin-Shop.key' => 'shop.test',
        'plugin-Shop.database-connections.sqlite.database' => $bertaRoot . '/storage/shop-db.sqlite',
        'plugin-Shop.database-connections.site-sqlite-template.database' => $bertaRoot . '/storage/-sites/{site}/shop-db.sqlite',
        'cache.stores.file.path' => $bertaRoot . '/cache',
    ]);
    Cache::forgetDriver('file');

    writeShopSettings($bertaRoot);

    return $bertaRoot;
}

/**
 * @param  array<string, string>  $shop
 * @param  array<string, string>  $texts  The site's texts, besides its owner's name
 */
function writeShopSettings(string $bertaRoot, array $shop = [], string $site = '', array $texts = []): void
{
    $shop = array_merge([
        'paymentMethod' => 'both',
        'email' => 'seller@berta.test',
        'currency' => 'EUR',
        'orderEmailSubject' => 'Your order',
        'promoCode' => 'SAVE10',
        'promoCodeDiscount' => '10',
    ], $shop);

    $xmlValues = fn (array $values) => implode('', array_map(
        fn ($name, $value) => "<{$name}><![CDATA[{$value}]]></{$name}>",
        array_keys($values),
        $values,
    ));

    $siteRoot = $bertaRoot . '/storage' . ($site !== '' ? "/-sites/{$site}" : '');
    File::ensureDirectoryExists($siteRoot);
    File::put($siteRoot . '/settings.xml', '<?xml version="1.0" encoding="utf-8"?><settings>'
        . '<shop>' . $xmlValues($shop) . '</shop>'
        . '<texts>' . $xmlValues(array_merge(['ownerName' => 'Shop Owner'], $texts)) . '</texts>'
        . '</settings>');
}
