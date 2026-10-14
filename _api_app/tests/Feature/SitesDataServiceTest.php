<?php

use App\Http\Middleware\SetupMiddleware;
use App\Models\User;
use App\Plugins\Shop\ShopOrderNumbersDataService;
use App\Sites\SitesDataService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\File;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\putJson;
use function Pest\Laravel\travelTo;
use function Pest\Laravel\withoutMiddleware;

beforeEach(function () {
    skipWithoutShopPlugin();

    $this->bertaRoot = setUpShopTestRoot();
    writeShopSettings($this->bertaRoot, [], 'second');
    File::put($this->bertaRoot . '/storage/-sites/sites.xml', '<?xml version="1.0" encoding="utf-8"?><sites>'
        . '<site published="1"><title><![CDATA[Main]]></title></site>'
        . '<site published="1"><name><![CDATA[second]]></name><title><![CDATA[Second]]></title></site>'
        . '</sites>');
});

afterEach(function () {
    if (isset($this->bertaRoot)) {
        File::deleteDirectory($this->bertaRoot);
    }
});

function putShopFile(string $path, string $contents, string $site = ''): void
{
    File::ensureDirectoryExists(dirname(shopFile($path, $site)));
    File::put(shopFile($path, $site), $contents);
}

it('swaps the shop files of two sites along with their contents', function () {
    withoutMiddleware(SetupMiddleware::class);
    actingAs(new User);
    putShopFile('invoices/invoice-2026-1.pdf', '%PDF-main');
    putShopFile('invoices/invoice-2026-1.pdf', '%PDF-second', 'second');
    putShopFile('paypal/EC-1.json', '{}', 'second');

    putJson(route('site_swap_contents_between_sites'), ['siteSlugFrom' => '', 'siteSlugTo' => 'second'])->assertOk();

    expect(shopFiles())->toBe(['invoices/invoice-2026-1.pdf', 'paypal/EC-1.json'])
        ->and(File::get(shopFile('invoices/invoice-2026-1.pdf')))->toBe('%PDF-second')
        ->and(shopFiles('second'))->toBe(['invoices/invoice-2026-1.pdf'])
        ->and(File::get(shopFile('invoices/invoice-2026-1.pdf', 'second')))->toBe('%PDF-main');
});

it('starts the order numbers of a site cloned from a site with orders from 1, without its shop files', function () {
    travelTo(Carbon::parse('2026-10-14 10:00:00'));
    (new ShopOrderNumbersDataService('second'))->next();
    putShopFile('invoices/invoice-2026-1.pdf', '%PDF-second', 'second');

    $site = (new SitesDataService)->create(Request::create('http://shop.test/'), 'second');

    expect((new ShopOrderNumbersDataService($site['name']))->next())->toBe('2026-1')
        ->and(shopFiles($site['name']))->toBe([])
        ->and((new ShopOrderNumbersDataService('second'))->next())->toBe('2026-2')
        ->and(shopFiles('second'))->toBe(['invoices/invoice-2026-1.pdf']);
});

it('leaves the shop files out of the theme preview copy of a site', function () {
    symlink(realpath(base_path('../_themes')), $this->bertaRoot . '/_themes');
    // The theme's images are copied into the preview's media folder
    File::ensureDirectoryExists($this->bertaRoot . '/storage/media');
    putShopFile('invoices/invoice-2026-1.pdf', '%PDF-main');

    (new SitesDataService)->createPrieview('kyoto');

    expect(File::exists($this->bertaRoot . '/storage/preview/settings.xml'))->toBeTrue()
        ->and(File::exists($this->bertaRoot . '/storage/preview/_shop_files'))->toBeFalse();
});
