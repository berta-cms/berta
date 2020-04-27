<?php

namespace App\Sites\Sections\Entries\Galleries;

use App\Shared\Storage;
use App\Sites\Sections\Entries\Galleries\EntryGalleryRenderService;

class GalleryLinkRenderService extends EntryGalleryRenderService
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
        $data['galleryStyles'] = $this->getGalleryStyles($galleryItems);
        $data['linkAddress'] = !empty($entry['mediaCacheData']['@attributes']['link_address']) ? $entry['mediaCacheData']['@attributes']['link_address'] : '';
        $data['linkTarget'] = !empty($entry['mediaCacheData']['@attributes']['linkTarget']) ? $entry['mediaCacheData']['@attributes']['linkTarget'] : '_self';
        $data['items'] = $this->getLimitedGalleryItems($galleryItems);

        return $data;
    }

    public function getGalleryClassList($galleryItemsData, $galleryType, $entry, $siteSettings)
    {
        $classes = parent::getGalleryClassList($galleryItemsData, $galleryType, $entry, $siteSettings);
        if (count($galleryItemsData) > 1) {
            $classes[] = 'bt-has-hover';
        }

        return implode(' ', $classes);
    }

    private function getGalleryStyles($galleryItems)
    {
        $styles = [];

        if (!$galleryItems) {
            return '';
        }

        $item = current($galleryItems);
        $styles[] = "width: {$item['width']}px";
        // in case of video use video ratio to calculate height
        $height = $item['height'] ? $item['height'] : $item['width'] * .5625; // 16:9 ratio
        $styles[] = "height: {$height}px";

        return implode(';', $styles);
    }

    private function getLimitedGalleryItems($galleryItems)
    {
        // Limit to two items
        // First is a visible item
        // Second is element visible on hover
        return array_slice($galleryItems, 0, 2);
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

        return view('Sites/Sections/Entries/Galleries/galleryLink', $data);
    }
}
