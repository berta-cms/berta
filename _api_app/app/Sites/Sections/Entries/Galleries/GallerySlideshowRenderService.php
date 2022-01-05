<?php

namespace App\Sites\Sections\Entries\Galleries;

use App\Shared\Storage;
use App\Shared\Helpers;
use App\Sites\Sections\Entries\Galleries\EntryGalleryRenderService;

class GallerySlideshowRenderService extends EntryGalleryRenderService
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
        $data['attributes'] = [
            'gallery' => Helpers::arrayToHtmlAttributes([
                'data-fullscreen' => $data['isFullscreen'] ? 1 : null,
                'data-as-row-gallery' => $asRowGallery,
                'data-autoplay' => ($isLoopAvailable && !empty($entry['mediaCacheData']['@attributes']['autoplay'])) ? $entry['mediaCacheData']['@attributes']['autoplay'] : '0',
                'data-loop' => $isLoopAvailable && isset($siteSettings['entryLayout']['gallerySlideshowAutoRewind']) && $siteSettings['entryLayout']['gallerySlideshowAutoRewind'] == 'yes'
            ])
        ];
        $data['galleryStyles'] = $this->getGalleryStyles($entry, $galleryItems, $siteSettings);

        $data['items'] = $galleryItems;
        $data['showNavigation'] = count($galleryItemsData) > 1;

        return $data;
    }

    public function getGalleryClassList($galleryItemsData, $galleryType, $entry, $siteSettings)
    {
        $classes = parent::getGalleryClassList($galleryItemsData, $galleryType, $entry, $siteSettings);

        if (!empty($galleryItemsData) && !empty($entry)) {
            $gallerySlideNumbersVisible = !empty($entry['mediaCacheData']['@attributes']['slide_numbers_visible']) ? $entry['mediaCacheData']['@attributes']['slide_numbers_visible'] : $siteSettings['entryLayout']['gallerySlideNumberVisibilityDefault'];

            $classes[] = 'xSlideNumbersVisible-' . $gallerySlideNumbersVisible;
        }

        return implode(' ', $classes);
    }

    public function getGalleryStyles($entry, $galleryItems, $siteSettings)
    {
        $styles = [];

        $galleryWidth = $this->getGalleryWidth($entry, $galleryItems, $siteSettings);
        if ($galleryWidth) {
            $styles[] = "width: {$galleryWidth}px";
        }

        return implode(';', $styles);
    }

    public function getGalleryWidth($entry, $galleryItems, $siteSettings)
    {
        if (!$galleryItems) {
            return false;
        }

        $template = $siteSettings['template']['template'];
        $templateName = explode('-', $template)[0];
        $isMessyTemplate = $templateName == 'messy';
        $galleryWidthByWidestSlide = !empty($entry['mediaCacheData']['@attributes']['gallery_width_by_widest_slide']) ? $entry['mediaCacheData']['@attributes']['gallery_width_by_widest_slide'] : 'no';

        // Set slideshow gallery width by widest slide
        // except if current template is messy and gallery setting `galleryWidthByWidestSlide` is OFF
        if (!$isMessyTemplate || $isMessyTemplate && $galleryWidthByWidestSlide === 'yes') {
            return max(array_column($galleryItems, 'width'));
        }

        return $galleryItems[0]['width'];
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

        return view('Sites/Sections/Entries/Galleries/gallerySlideshow', $data);
    }
}
