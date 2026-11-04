<?php

use App\Sites\Sections\Entries\SectionEntryRenderService;

it('shows entry titles on the default template and in portfolio sections', function (string $templateName, ?string $sectionType, bool $shown) {
    expect(SectionEntryRenderService::showsEntryTitles($templateName, $sectionType))->toBe($shown);
})->with([
    'default template' => ['default', 'default', true],
    'default template, portfolio section' => ['default', 'portfolio', true],
    'other template, portfolio section' => ['messy', 'portfolio', true],
    'other template' => ['messy', 'default', false],
    'other template, no section type' => ['messy', null, false],
]);

it('accepts entries in sections other than external links and the shopping cart', function (?string $sectionType, bool $accepts) {
    expect(SectionEntryRenderService::acceptsEntries($sectionType))->toBe($accepts);
})->with([
    'no section type' => [null, true],
    'default' => ['default', true],
    'portfolio' => ['portfolio', true],
    'external link' => ['external_link', false],
    'shopping cart' => ['shopping_cart', false],
]);
