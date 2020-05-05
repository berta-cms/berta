<?php

namespace App\Sites\Sections;

class GridViewRenderService
{
    private $USED_IN_TEMPLATES = ['messy'];

    private function getUrl($siteSlug, $currentSection, $tagSlug, $isPreviewMode, $isEditMode)
    {
        $urlParts = [];
        if (!empty($siteSlug)) {
            $urlParts['site'] = $siteSlug;
        }

        $urlParts['section'] = $currentSection['name'];

        if (!empty($tagSlug)) {
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
            return '/' . implode('/', $urlParts) . ($isPreviewMode ? '?preview=1' : '');
        }
    }

    private function getImageItems($siteSlug, $currentSection, $tagSlug, $storageService, $isPreviewMode, $isEditMode)
    {
        $items = array_map(function ($item) use ($siteSlug, $currentSection, $tagSlug, $storageService, $isPreviewMode, $isEditMode) {
            $item['url'] = $this->getUrl($siteSlug, $currentSection, $tagSlug, $isPreviewMode, $isEditMode);
            $item['src'] = $storageService->MEDIA_URL . '/' . $currentSection['mediafolder'] . '/' . config('app.grid_image_prefix') . $item['@attributes']['src'];
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

        if (!$currentSection || empty($currentSection['mediaCacheData']['file'])) {
            return '';
        }

        $isGridViewEnabled = $currentSectionType == 'grid' && $request->cookie('_berta_grid_view');
        if (!$isGridViewEnabled) {
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
