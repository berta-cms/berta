<?php

namespace App\Sites\Sections\Entries\Galleries;

class GalleryGridRenderService extends EntryGalleryRenderService
{
    public function getViewData(
        $entry,
        $siteSettings,
        $siteTemplateSettings,
        $storageService,
        $isEditMode,
        $isLoopAvailable,
        $asRowGallery,
        $galleryItemsData,
        $galleryItems,
        $galleryType
    ) {
        $galleryItemsData = $this->getGalleryItemsData($entry);
        $galleryItems = $this->generateGalleryItems($galleryItemsData, $entry, $storageService, $siteSettings);
        $galleryType = isset($entry['mediaCacheData']['@attributes']['type']) ? $entry['mediaCacheData']['@attributes']['type'] : $siteTemplateSettings['entryLayout']['defaultGalleryType'];

        $data = parent::getViewData(
            $entry,
            $siteSettings,
            $siteTemplateSettings,
            $storageService,
            $isEditMode,
            $isLoopAvailable,
            $asRowGallery,
            $galleryItemsData,
            $galleryItems,
            $galleryType
        );

        $data['galleryClassList'] = $this->getGalleryClassList($galleryItemsData, $galleryType, $entry, $siteSettings);
        $data['items'] = $galleryItems;
        $data['gridColumnsMobile'] = $this->getGridColumns($entry, 'grid_columns_mobile', '1');
        $data['gridColumnsDesktop'] = $this->getGridColumns($entry, 'grid_columns_desktop', '2');
        $data['gridColumnsLargeDesktop'] = $this->getGridColumns($entry, 'grid_columns_large_desktop', '3');
        $data['gridGap'] = ! empty($entry['mediaCacheData']['@attributes']['grid_gap']) ? $entry['mediaCacheData']['@attributes']['grid_gap'] : false;

        return $data;
    }

    public function getGalleryClassList($galleryItemsData, $galleryType, $entry, $siteSettings)
    {
        $classes = parent::getGalleryClassList($galleryItemsData, $galleryType, $entry, $siteSettings);

        $classes[] = 'xGridShowCaptions-' . $this->getGridShowCaptions($entry);

        return implode(' ', $classes);
    }

    private function getGridColumns($entry, $attribute, $default)
    {
        return ! empty($entry['mediaCacheData']['@attributes'][$attribute]) ? $entry['mediaCacheData']['@attributes'][$attribute] : $default;
    }

    private function getGridShowCaptions($entry)
    {
        return ! empty($entry['mediaCacheData']['@attributes']['grid_show_captions']) ? $entry['mediaCacheData']['@attributes']['grid_show_captions'] : 'yes';
    }

    public function render(
        $entry,
        $siteSettings,
        $siteTemplateSettings,
        $storageService,
        $isEditMode,
        $isLoopAvailable,
        $asRowGallery
    ) {
        if ($isEditMode && empty($entry['mediaCacheData']['file'])) {
            return view('Sites/Sections/Entries/Galleries/editEmptyGallery');
        }

        $data = $this->getViewData(
            $entry,
            $siteSettings,
            $siteTemplateSettings,
            $storageService,
            $isEditMode,
            $isLoopAvailable,
            $asRowGallery,
            null,
            null,
            null
        );

        return view('Sites/Sections/Entries/Galleries/galleryGrid', $data);
    }
}
