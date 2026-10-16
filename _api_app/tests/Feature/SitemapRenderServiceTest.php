<?php

use App\Sites\Sections\SitemapRenderService;
use Illuminate\Http\Request;

/**
 * The addresses the sitemap lists for a site with a front page, a section with tags, an unpublished
 * section and the shop's cart
 *
 * @return list<string>
 */
function sitemapUrls(string $site): array
{
    $sections = [
        ['name' => 'home', 'title' => 'Home', '@attributes' => ['published' => '1']],
        ['name' => 'blog', 'title' => 'Blog', '@attributes' => ['published' => '1']],
        ['name' => 'draft', 'title' => 'Draft', '@attributes' => ['published' => '0']],
        ['name' => 'cart', 'title' => 'Cart', '@attributes' => ['published' => '1', 'type' => 'shopping_cart']],
    ];
    $tags = ['section' => [[
        '@attributes' => ['name' => 'blog'],
        'tag' => [['@attributes' => ['name' => 'news']], ['@attributes' => ['name' => 'events']]],
    ]]];

    $xml = (string) (new SitemapRenderService)->render(Request::create('http://shop.test/sitemap.xml'), $site, $sections, $tags);
    preg_match_all('#<loc>(.*?)</loc>#', $xml, $matches);

    return $matches[1];
}

it('lists each page at the address the site answers, ending in a slash', function () {
    // The section's first tag is the section's own page
    expect(sitemapUrls(''))->toBe([
        'http://shop.test/',
        'http://shop.test/blog/',
        'http://shop.test/blog/events/',
    ]);
});

it('lists the pages of a multisite site under the site', function () {
    expect(sitemapUrls('second'))->toBe([
        'http://shop.test/second/',
        'http://shop.test/second/blog/',
        'http://shop.test/second/blog/events/',
    ]);
});
