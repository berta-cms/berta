<?php

namespace App\Sites\Sections\Entries\Galleries;

use App\Shared\Storage;
use App\Sites\Sections\Entries\Galleries\EntryGalleryRenderService;
use App\Sites\Sections\Entries\Galleries\GallerySlideshowRenderService;

class GalleryPileRenderService extends EntryGalleryRenderService
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
        $data['items'] = $this->getLimitedGalleryItems($galleryItems);

        return $data;
    }

    public function getGalleryClassList($galleryItemsData, $galleryType, $entry, $siteSettings)
    {
        $classes = parent::getGalleryClassList($galleryItemsData, $galleryType, $entry, $siteSettings);
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
        // Return only one item, other items will be loaded in fronted
        return array_slice($galleryItems, 0, 1);
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

        $view = view('Sites/Sections/Entries/Galleries/galleryPile', $data);

        // Add a slideshow as a fallback for mobile devices
        if (!$isEditMode) {
            // Force entry to be as slideshow
            $entry['mediaCacheData']['@attributes']['type'] = 'slideshow';

            $gallerySlideshowRenderService = new GallerySlideshowRenderService();
            $view .= $gallerySlideshowRenderService->render(
                $entry,
                $siteSettings,
                $siteTemplateSettings,
                $storageService,
                $isEditMode,
                false,
                false
            );
        }

        return $view;
    }
}
