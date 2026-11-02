<?php

namespace App\Sites\Sections;

use App\Shared\Helpers;

class GridViewRenderService
{
    private $USED_IN_TEMPLATES = ['messy'];

    private function getUrl($siteSlug, $currentSection, $tagSlug, $isPreviewMode, $isEditMode)
    {
        $urlParts = [];
        if (! empty($siteSlug)) {
            $urlParts['site'] = $siteSlug;
        }

        $urlParts['section'] = $currentSection['name'];

        if (! empty($tagSlug)) {
            $urlParts['tag'] = $tagSlug;
        }

        if ($isEditMode) {
            if (empty($urlParts)) {
                return '.';
            }

            $parts = [];
            foreach ($urlParts as $property => $value) {
                $parts[] = $property . '=' . $value;
            }

            return '?' . implode('&', $parts);
        } else {
            return Helpers::sitePath($urlParts, $isPreviewMode);
        }
    }

    private function getImageItems($siteSlug, $currentSection, $tagSlug, $storageService, $isPreviewMode, $isEditMode)
    {
        $items = array_map(function ($item) use ($siteSlug, $currentSection, $tagSlug, $storageService, $isPreviewMode, $isEditMode) {
            $gridImage = $currentSection['mediafolder'] . '/' . config('app.grid_image_prefix') . $item['@attributes']['src'];
            $item['url'] = $this->getUrl($siteSlug, $currentSection, $tagSlug, $isPreviewMode, $isEditMode);
            $item['src'] = $storageService->MEDIA_URL . '/' . $gridImage;

            // The masonry layout measures the boxes before lazy loaded images arrive, so they need their size
            $gridImagePath = $storageService->MEDIA_ROOT . '/' . $gridImage;
            $gridImageSize = is_file($gridImagePath) ? getimagesize($gridImagePath) : false;
            if ($gridImageSize) {
                [$item['width'], $item['height']] = $gridImageSize;
            }

            return $item;
        }, $currentSection['mediaCacheData']['file']);

        return $items;
    }

    private function getViewData(
        $siteSlug,
        $storageService,
        $currentSection,
        $tagSlug,
        $isPreviewMode,
        $isEditMode
    ) {
        $items = $this->getImageItems($siteSlug, $currentSection, $tagSlug, $storageService, $isPreviewMode, $isEditMode);

        return [
            'items' => $items,
        ];
    }

    public function render(
        $siteSlug,
        $storageService,
        $siteSettings,
        $sectionSlug,
        $sections,
        $tagSlug,
        $request,
        $isPreviewMode,
        $isEditMode
    ) {
        $templateName = explode('-', $siteSettings['template']['template'])[0];

        if (! in_array($templateName, $this->USED_IN_TEMPLATES)) {
            return '';
        }

        $currentSection = null;
        $currentSectionType = null;

        if (! empty($sections)) {
            $currentSectionOrder = array_search($sectionSlug, array_column($sections, 'name'));
            $currentSection = $sections[$currentSectionOrder];
            $currentSectionType = isset($currentSection['@attributes']['type']) ? $currentSection['@attributes']['type'] : null;
        }

        if (! $currentSection || empty($currentSection['mediaCacheData']['file'])) {
            return '';
        }

        $isGridViewEnabled = $currentSectionType == 'grid' && $request->cookie('_berta_grid_view');
        if (! $isGridViewEnabled) {
            return '';
        }

        $data = $this->getViewData(
            $siteSlug,
            $storageService,
            $currentSection,
            $tagSlug,
            $isPreviewMode,
            $isEditMode
        );

        return view('Sites/Sections/gridView', $data);
    }
}
