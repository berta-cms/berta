<?php

use App\Sites\Sections\DefaultTemplateRenderService;
use App\Sites\Sections\MessyTemplateRenderService;

function sectionTemplateRenderSettings(): array
{
    return ['pageLayout' => ['responsive' => 'no', 'centeredContents' => 'no']];
}

it('renders default template classes for a site without sections', function () {
    $service = new DefaultTemplateRenderService;

    $bodyClasses = $service->getBodyClasses(sectionTemplateRenderSettings(), [], null, null, false);
    $pageEntriesAttributes = $service->getPageEntriesAttributes([], null, null);

    expect($bodyClasses)->toBe('xSectionType-default')
        ->and($pageEntriesAttributes)->toContain('xEntriesList')
        ->and($pageEntriesAttributes)->not->toContain('xSection-');
});

it('renders messy template classes for a site without sections', function () {
    $service = new MessyTemplateRenderService;

    $bodyClasses = $service->getBodyClassList(sectionTemplateRenderSettings(), null, 'default', null, false, false, false);
    $pageEntriesClasses = $service->getPageEntriesClasses(null, null, false);

    expect($bodyClasses)->toBe('xSectionType-default')
        ->and($pageEntriesClasses)->toContain('xEntriesList')
        ->and($pageEntriesClasses)->not->toContain('xSection-');
});

it('renders the current section name in template classes', function () {
    $sections = [['name' => 'about', '@attributes' => ['type' => 'default']]];
    $defaultService = new DefaultTemplateRenderService;
    $messyService = new MessyTemplateRenderService;

    expect($defaultService->getBodyClasses(sectionTemplateRenderSettings(), $sections, 'about', null, false))
        ->toBe('xContent-about xSectionType-default')
        ->and($defaultService->getPageEntriesAttributes($sections, 'about', null))->toContain('xSection-about')
        ->and($messyService->getBodyClassList(sectionTemplateRenderSettings(), $sections[0], 'default', null, false, false, false))
        ->toBe('xContent-about xSectionType-default')
        ->and($messyService->getPageEntriesClasses($sections[0], null, false))->toContain('xSection-about');
});
