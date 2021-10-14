<?php

namespace App\Sites\Sections\Entries\Galleries;

use App\Shared\ImageHelpers;

class EntryGalleryEditorRenderService
{
    private function getGalleryItems($entry, $storageService, $basePath)
    {
        $files = !empty($entry['mediaCacheData']['file']) ? $entry['mediaCacheData']['file'] : [];
        $items = array_map(function ($item, $index) use ($entry, $storageService, $basePath) {
            $thumbnail = '';
            $imagePath = '';
            if ($item['@attributes']['type'] == 'image') {
                $imagePath = "{$storageService->MEDIA_URL}/{$entry['mediafolder']}/{$item['@attributes']['src']}";
                $thumbnail = ImageHelpers::getThumbnail($imagePath);
            // video
            } else {
                if (!empty($item['@attributes']['poster_frame'])) {
                    $imagePath = "{$storageService->MEDIA_URL}/{$entry['mediafolder']}/{$item['@attributes']['poster_frame']}";
                    $thumbnail = ImageHelpers::getThumbnail($imagePath) . '?' . rand();
                }
            }

            $autoplay = !empty($item['@attributes']['autoplay']) ? $item['@attributes']['autoplay'] : '0';

            return array_merge($item['@attributes'], [
                'imagePath' => $imagePath,
                'thumbnail' => $thumbnail,
                'caption' => $item['@value'],
                'captionDataPath' => "{$basePath}/mediaCacheData/file/{$index}/@value",
                'autoplay' => $autoplay,
                'autoplayDataPath' => "{$basePath}/mediaCacheData/file/{$index}/@attributes/autoplay"
            ]);
        }, $files, array_keys($files));

        return $items;
    }

    public function getViewData(
        $siteSlug,
        $siteSettings,
        $section,
        $storageService,
        $entry
    ) {
        $basePath = "{$siteSlug}/entry/{$section['name']}/{$entry['id']}";
        $templateName = explode('-', $siteSettings['template']['template'])[0];

        $galleryType = !empty($entry['mediaCacheData']['@attributes']['type']) ? $entry['mediaCacheData']['@attributes']['type'] : 'slideshow';
        $autoplay = !empty($entry['mediaCacheData']['@attributes']['autoplay']) ? $entry['mediaCacheData']['@attributes']['autoplay'] : '0';
        $slideNumbersVisibility = !empty($entry['mediaCacheData']['@attributes']['slide_numbers_visible']) ? $entry['mediaCacheData']['@attributes']['slide_numbers_visible'] : $siteSettings['entryLayout']['gallerySlideNumberVisibilityDefault'];
        $galleryWidthByWidestSlide = !empty($entry['mediaCacheData']['@attributes']['gallery_width_by_widest_slide']) ? $entry['mediaCacheData']['@attributes']['gallery_width_by_widest_slide'] : 'no';
        $linkAddress = !empty($entry['mediaCacheData']['@attributes']['link_address']) ? $entry['mediaCacheData']['@attributes']['link_address'] : 'http://';
        $linkTarget = !empty($entry['mediaCacheData']['@attributes']['linkTarget']) ? $entry['mediaCacheData']['@attributes']['linkTarget'] : '_self';
        $rowGalleryPadding = !empty($entry['mediaCacheData']['@attributes']['row_gallery_padding']) ? $entry['mediaCacheData']['@attributes']['row_gallery_padding'] : '0';
        $fullscreen = !empty($entry['mediaCacheData']['@attributes']['fullscreen']) ? $entry['mediaCacheData']['@attributes']['fullscreen'] : $siteSettings['entryLayout']['galleryFullScreenDefault'];
        $imageSize = !empty($entry['mediaCacheData']['@attributes']['size']) ? $entry['mediaCacheData']['@attributes']['size'] : 'large';

        $dataPath = [
            'addMedia' => $basePath,
            'galleryType' => "{$basePath}/mediaCacheData/@attributes/type",
            'autoplay' => "{$basePath}/mediaCacheData/@attributes/autoplay",
            'slideNumbersVisibility' => "{$basePath}/mediaCacheData/@attributes/slide_numbers_visible",
            'galleryWidthByWidestSlide' => "{$basePath}/mediaCacheData/@attributes/gallery_width_by_widest_slide",
            'linkAddress' => "{$basePath}/mediaCacheData/@attributes/link_address",
            'linkTarget' => "{$basePath}/mediaCacheData/@attributes/linkTarget",
            'rowGalleryPadding' => "{$basePath}/mediaCacheData/@attributes/row_gallery_padding",
            'fullscreen' => "{$basePath}/mediaCacheData/@attributes/fullscreen",
            'imageSize' => "{$basePath}/mediaCacheData/@attributes/size",
        ];

        $items = $this->getGalleryItems($entry, $storageService, $basePath);

        return [
            'templateName' => $templateName,
            'dataPath' => $dataPath,
            'galleryType' => $galleryType,
            'autoplay' => $autoplay,
            'slideNumbersVisibility' => $slideNumbersVisibility,
            'galleryWidthByWidestSlide' => $galleryWidthByWidestSlide,
            'linkAddress' => $linkAddress,
            'linkTarget' => $linkTarget,
            'rowGalleryPadding' => $rowGalleryPadding,
            'fullscreen' => $fullscreen,
            'imageSize' => $imageSize,
            'items' => $items
        ];
    }

    public function render(
        $siteSlug,
        $siteSettings,
        $section,
        $storageService,
        $entry
    ) {
        if (empty($entry)) {
            return '';
        }

        $data = $this->getViewData(
            $siteSlug,
            $siteSettings,
            $section,
            $storageService,
            $entry
        );

        return view('Sites/Sections/Entries/Galleries/entryGalleryEditor', $data);
    }
}
