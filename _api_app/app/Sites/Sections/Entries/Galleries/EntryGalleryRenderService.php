<?php

namespace App\Sites\Sections\Entries\Galleries;

use App\Shared\Helpers;
use App\Shared\ImageHelpers;

abstract class EntryGalleryRenderService
{
    // Force Extending class to define this method
    abstract protected function render(
        $entry,
        $siteSettings,
        $siteTemplateSettings,
        $storageService,
        $isEditMode,
        $isLoopAvailable,
        $asRowGallery
    );

    public function getGalleryClassList($galleryItemsData, $galleryType, $entry, $siteSettings)
    {
        $classes = ['xGalleryContainer'];

        if (!empty($galleryItemsData)) {
            $classes[] = 'xGalleryHasImages';
            $classes[] = 'xGalleryType-' . $galleryType;
        }

        return $classes;
    }

    public function getGalleryItemsData($entry)
    {
        $items = [];
        if (isset($entry['mediaCacheData']['file'])) {
            $items = Helpers::asList($entry['mediaCacheData']['file']);
        }

        return $items;
    }

    public function generateGalleryItems($galleryItemsData, $entry, $storageService, $siteSettings)
    {
        $items = [];
        foreach ($galleryItemsData as $item) {
            $items[] = ImageHelpers::getGalleryItem(
                $item,
                1,
                $entry,
                $storageService,
                $siteSettings
            );
        }

        return $items;
    }

    private function getNavigationItems($galleryItemsData, $galleryItems, $isEditMode)
    {
        $navigationItems = [];

        foreach ($galleryItemsData as $i => $item) {
            $navigationItem = array_merge($item, $galleryItems[$i]);
            $navigationItem['index'] = $i + 1;
            $navigationItem['autoPlay'] = isset($navigationItem['@attributes']['autoplay']) ? $navigationItem['@attributes']['autoplay'] : 0;

            if ($navigationItem['type'] == 'video') {
                $navigationItem['videoLink'] = $navigationItem['original'];
                $navigationItem['src'] = $navigationItem['poster'] ? $navigationItem['poster'] : '#';
            }

            if ($isEditMode) {
                $navigationItem['src'] .= '?no_cache=' . rand();
            }

            $navigationItem['attributes'] = Helpers::arrayToHtmlAttributes([
                'class' => implode(' ', [
                    'xType-' . $navigationItem['type'],
                    'xVideoHref-' . (isset($navigationItem['videoLink']) ? $navigationItem['videoLink'] : ''),
                    'xAutoPlay-' . $navigationItem['autoPlay'],
                    'xOrigHref-' . ($navigationItem['type'] == 'image' ? $navigationItem['original'] : ''),
                    'xW-' . $navigationItem['width'],
                    'xH-' . $navigationItem['height'],
                    'xImgIndex-' . $navigationItem['index']
                ]),
                'data-original-src' => $navigationItem['original'],
                'data-original-width' => $navigationItem['original_width'],
                'data-original-height' => $navigationItem['original_height'],
                'data-caption' => $navigationItem['alt'],
                'data-mobile-src' => $navigationItem['large_src'],
                'data-mobile-width' => $navigationItem['large_width'],
                'data-mobile-height' => $navigationItem['large_height'],
                'data-srcset' => $navigationItem['srcset'] ? $navigationItem['srcset'] : null
            ]);

            $navigationItems[] = $navigationItem;
        }

        return $navigationItems;
    }

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
        $data = [];
        $data['isEditMode'] = $isEditMode;
        $data['isFullscreen'] = !$isEditMode && isset($entry['mediaCacheData']['@attributes']['fullscreen']) && $entry['mediaCacheData']['@attributes']['fullscreen'] == 'yes';
        $data['galleryClassList'] = $this->getGalleryClassList($galleryItemsData, $galleryType, null, null);
        $data['rowGalleryPadding'] = !empty($entry['mediaCacheData']['@attributes']['row_gallery_padding']) ? $entry['mediaCacheData']['@attributes']['row_gallery_padding'] : false;
        $data['navigationItems'] = $this->getNavigationItems($galleryItemsData, $galleryItems, $isEditMode);

        return $data;
    }
}
