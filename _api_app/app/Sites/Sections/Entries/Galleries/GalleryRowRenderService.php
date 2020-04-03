<?php

namespace App\Sites\Sections\Entries\Galleries;

use App\Shared\Storage;
use App\Sites\Sections\Entries\Galleries\EntryGalleryRenderService;
use App\Sites\Sections\Entries\Galleries\GallerySlideshowRenderService;

class GalleryRowRenderService extends EntryGalleryRenderService
{
    // @TODO get $spaceBetweenItems from template settings
    // currently we use 12px = 1em as this is a default value for messy template
    private $spaceBetweenItems = 12;

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

        $galleryItemsLimit = $this->getGalleryItemsLimit($entry);

        $data['galleryClassList'] = $this->getGalleryClassList($galleryItemsData, $galleryType, $entry, $siteSettings);
        $data['galleryStyles'] = $this->getGalleryStyles($galleryItems);
        $data['items'] = $this->getLimitedGalleryItems($galleryItems, $galleryItemsLimit);
        $data['loader'] = $this->getGalleryLoader($galleryItems, $galleryItemsLimit);

        return $data;
    }

    public function getGalleryClassList($galleryItemsData, $galleryType, $entry, $siteSettings)
    {
        $classes = parent::getGalleryClassList($galleryItemsData, $galleryType, $entry, $siteSettings);

        if (count($galleryItemsData) == 1) {
            $classes[] = 'bt-gallery-has-one-item';
        }

        return implode(' ', $classes);
    }

    private function getGalleryStyles($galleryItems)
    {
        $styles = [];

        $galleryWidth = $this->getGalleryWidth($galleryItems);
        if ($galleryWidth) {
            $styles[] = "min-width: {$galleryWidth}px";
        }

        return implode(';', $styles);
    }

    private function getGalleryWidth($galleryItems)
    {
        if (empty($galleryItems)) {
            return false;
        }

        $width = array_sum(array_column($galleryItems, 'width'));
        $width += $this->spaceBetweenItems * count($galleryItems);

        return $width;
    }

    private function getGalleryItemsLimit($entry)
    {
        $imageSize = !empty($entry['mediaCacheData']['@attributes']['size']) ? $entry['mediaCacheData']['@attributes']['size'] : 'large';
        $limit = config('app.row_gallery_image_limit.' . $imageSize);

        return $limit;
    }

    private function getLimitedGalleryItems($galleryItems, $galleryItemsLimit)
    {
        return array_slice($galleryItems, 0, $galleryItemsLimit);
    }

    private function getGalleryLoader($galleryItems, $galleryItemsLimit)
    {
        if (count($galleryItems) <= $galleryItemsLimit) {
            return false;
        }

        // Calculate width of loader from remaining items total width
        $loaderWidth = $this->getGalleryWidth(array_slice($galleryItems, $galleryItemsLimit));

        $lastItem = $galleryItems[$galleryItemsLimit - 1];

        // in case of video use video ratio to calculate height
        $loaderHeight = $lastItem['height'] ? $lastItem['height'] : $lastItem['width'] * .5625; // 16:9 ratio

        return [
            'width' => $loaderWidth,
            'height' => $loaderHeight
        ];
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

        $view = view('Sites/Sections/Entries/Galleries/galleryRow', $data);

        // Add a slideshow as a fallback for mobile devices when there is at least two slides
        if (!$isEditMode && !empty($entry['mediaCacheData']['file']) && count($entry['mediaCacheData']['file']) > 1) {
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
                true
            );
        }

        return $view;
    }
}
