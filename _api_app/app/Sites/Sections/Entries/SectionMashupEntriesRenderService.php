<?php

namespace App\Sites\Sections\Entries;

use App\Shared\Helpers;
use App\Shared\ImageHelpers;
use App\Sites\Sections\Entries\SectionEntriesDataService;

class SectionMashupEntriesRenderService
{
    private $USED_IN_TEMPLATES = ['mashup'];
    private $siteTemplatesConfigService;

    public function __construct($siteTemplatesConfigService)
    {
        $this->siteTemplatesConfigService = $siteTemplatesConfigService;
    }

    private function getWrapperAttributes(
        $siteTemplateSettings,
        $sectionSlug,
        $tagSlug,
        $isEditMode
    ) {
        $attributes['id'] = 'firstPageMarkedEntries';
        $classes = [
            'xEntriesList',
            'xSection-' . $sectionSlug,
            'xTag-' . $tagSlug
        ];

        if ($isEditMode) {
            $classes[] = 'xNoEntryOrdering';
        }

        $columnCount = $siteTemplateSettings['pageLayout']['mashUpColumns'];
        if ($columnCount > 1) {
            $classes[] = 'columns-' . $columnCount;
        }

        $attributes['class'] = implode(' ', $classes);

        return Helpers::arrayToHtmlAttributes($attributes);
    }

    private function getStyles($entry, $isResponsive)
    {
        if ($isResponsive) {
            return null;
        }

        $styles = [];

        $viewportWidth = 980;
        $viewportHeight = 800;

        $width = !empty($entry['item']['galleryItem']['width']) ? $entry['item']['galleryItem']['width'] : 0;
        $height = !empty($entry['item']['galleryItem']['height']) ? $entry['item']['galleryItem']['height'] : 0;

        list($left, $top) = !empty($entry['content']['positionXY']) ? explode(',', $entry['content']['positionXY']) : [rand(0, $viewportWidth - $width), rand(0, $viewportHeight - $height)];

        $styles[] = "left:{$left}px";
        $styles[] = "top:{$top}px";

        return implode(';', $styles);
    }

    private function getAttributes($entry, $siteSlug, $siteTemplateSettings, $isResponsive, $isEditMode)
    {
        $classes = [
            'firstPagePic',
            'xEntry',
            'xEntryId-' . $entry['id'],
            'xSection-' . $entry['section']['name']
        ];

        if (!empty($entry['content']['fixed']) && $entry['content']['fixed'] == '1') {
            $classes[] = 'xFixed';
        }

        if ($siteTemplateSettings['firstPage']['hoverWiggle'] == 'yes') {
            $classes[] = 'firstPageWiggle';
        }

        if ($isEditMode && !$isResponsive) {
            $classes = array_merge($classes, ['xEditableDragXY', 'xProperty-positionXY']);
        }

        $attributes['class'] = implode(' ', $classes);
        $attributes['style'] = $this->getStyles($entry, $isResponsive);

        if ($isEditMode && !$isResponsive) {
            $attributes['data-path'] = "{$siteSlug}/entry/{$entry['section']['name']}/{$entry['id']}/content/positionXY";
        }

        return Helpers::arrayToHtmlAttributes($attributes);
    }

    private function getContent($entry, $storageService, $siteSettings, $siteSlug, $isRandom, $isPreviewMode, $isEditMode)
    {
        $url = null;
        $galleryItem = null;

        if (empty($entry['mediaCacheData']['file'])) {
            return [
                'content' => !empty($entry['content']['description']) ? $entry['content']['description'] : '',
                'url' => $url,
                'galleryItem' => $galleryItem
            ];
        }

        $files = $entry['mediaCacheData']['file'];
        $item = $isRandom ? $files[array_rand($files)] : $files[0];

        if (!$isEditMode && $item['@attributes']['type'] == 'image') {
            $urlParts = [];
            if (!empty($siteSlug)) {
                $urlParts[] = $siteSlug;
            }
            $urlParts[] = $entry['section']['name'];

            if (!empty($entry['tags']['tag'])) {
                $urlParts[] = Helpers::slugify($entry['tags']['tag'][0], '-', '-');
            }

            $url = '/' . implode('/', $urlParts) . ($isPreviewMode ? '?preview=1' : '');
        }


        $galleryItem = ImageHelpers::getGalleryItem(
            $item,
            1,
            $entry,
            $storageService,
            $siteSettings
        );

        return [
            'url' => $url,
            'galleryItem' => $galleryItem
        ];
    }

    /**
     * Get marked entries from all sections
     */
    private function getEntries(
        $storageService,
        $siteSettings,
        $siteTemplateSettings,
        $siteSlug,
        $sections,
        $sectionSlug,
        $currentSection,
        $sectionTypeConfig,
        $isResponsive,
        $isPreviewMode,
        $isEditMode
    ) {
        $entries = [];
        foreach ($sections as $section) {
            if ($section['name'] == $sectionSlug) {
                continue;
            }

            $sectionEntriesDS = new SectionEntriesDataService($siteSlug, $section['name']);
            $sectionEntries = $sectionEntriesDS->get()['entry'];

            foreach ($sectionEntries as $entry) {
                if (empty($entry['marked']) || $entry['marked'] == '0') {
                    continue;
                }
                $entry['section'] = $section;
                $entries[] = $entry;
            }
        }

        $order = !empty($currentSection['marked_items_imageselect']) ? $currentSection['marked_items_imageselect'] : $sectionTypeConfig['marked_items_imageselect']['default'];
        $isRandom = $order == 'random';
        if ($isRandom) {
            shuffle($entries);
        }

        $count = !empty($currentSection['marked_items_count']) ? $currentSection['marked_items_count'] : $sectionTypeConfig['marked_items_count']['default'];
        if (count($entries) > $count) {
            $entries = array_slice($entries, 0, $count);
        }

        $entries = array_map(function ($entry) use ($storageService, $siteSlug, $siteSettings, $siteTemplateSettings, $isResponsive, $isRandom, $isPreviewMode, $isEditMode) {
            $entry['item'] = $this->getContent($entry, $storageService, $siteSettings, $siteSlug, $isRandom, $isPreviewMode, $isEditMode);
            $entry['attributes'] = $this->getAttributes($entry, $siteSlug, $siteTemplateSettings, $isResponsive, $isEditMode);
            return $entry;
        }, $entries);

        return $entries;
    }

    private function getViewData(
        $storageService,
        $siteSlug,
        $siteSettings,
        $siteTemplateSettings,
        $sections,
        $sectionSlug,
        $tagSlug,
        $currentSection,
        $isResponsive,
        $sectionTypeConfig,
        $isPreviewMode,
        $isEditMode
    ) {
        $wrapperAttributes = $this->getWrapperAttributes(
            $siteTemplateSettings,
            $sectionSlug,
            $tagSlug,
            $isEditMode
        );

        $entries = $this->getEntries(
            $storageService,
            $siteSettings,
            $siteTemplateSettings,
            $siteSlug,
            $sections,
            $sectionSlug,
            $currentSection,
            $sectionTypeConfig,
            $isResponsive,
            $isPreviewMode,
            $isEditMode
        );

        return [
            'entries' => $entries,
            'wrapperAttributes' => $wrapperAttributes,
            'isEditMode' => $isEditMode
        ];
    }

    public function render(
        $storageService,
        $siteSlug,
        $siteSettings,
        $siteTemplateSettings,
        $sections,
        $sectionSlug,
        $tagSlug,
        $isPreviewMode,
        $isEditMode
    ) {
        $templateName = explode('-', $siteSettings['template']['template'])[0];

        if (!in_array($templateName, $this->USED_IN_TEMPLATES)) {
            return '';
        }

        $currentSection = null;
        $currentSectionType = null;

        if (!empty($sections)) {
            $currentSectionOrder = array_search($sectionSlug, array_column($sections, 'name'));
            $currentSection = $sections[$currentSectionOrder];
            $currentSectionType = isset($currentSection['@attributes']['type']) ? $currentSection['@attributes']['type'] : null;
        }

        if ($currentSectionType !== 'mash_up') {
            return '';
        }

        $isResponsive = isset($siteTemplateSettings['pageLayout']['responsive']) && $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $siteTemplatesConfig = $this->siteTemplatesConfigService->get();
        $sectionTypeConfig = $siteTemplatesConfig[$siteSettings['template']['template']]['sectionTypes']['mash_up']['params'];

        $data = $this->getViewData(
            $storageService,
            $siteSlug,
            $siteSettings,
            $siteTemplateSettings,
            $sections,
            $sectionSlug,
            $tagSlug,
            $currentSection,
            $isResponsive,
            $sectionTypeConfig,
            $isPreviewMode,
            $isEditMode
        );

        return view('Sites/Sections/Entries/mashupEntries', $data);
    }
}
