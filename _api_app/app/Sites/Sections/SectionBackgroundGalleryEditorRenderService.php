<?php

namespace App\Sites\Sections;

use App\Shared\ImageHelpers;

class SectionBackgroundGalleryEditorRenderService
{
    private function getGalleryItems($currentSection, $storageService, $basePath)
    {
        $files = !empty($currentSection['mediaCacheData']['file']) ? $currentSection['mediaCacheData']['file'] : [];

        $items = array_map(function ($item, $index) use ($currentSection, $storageService, $basePath) {
            $imagePath = "{$storageService->MEDIA_URL}/{$currentSection['mediafolder']}/{$item['@attributes']['src']}";
            $thumbnail = ImageHelpers::getThumbnail($imagePath);

            return array_merge($item['@attributes'], [
                'thumbnail' => $thumbnail,
                'caption' => $item['@value'],
                'captionDataPath' => "{$basePath}/mediaCacheData/file/{$index}/@value"
            ]);
        }, $files, array_keys($files));

        return $items;
    }

    private function getViewData(
        $siteSlug,
        $currentSection,
        $currentSectionIndex,
        $storageService
    ) {
        $basePath = "{$siteSlug}/section/{$currentSectionIndex}";
        $hideNavigation = !empty($currentSection['mediaCacheData']['@attributes']['hide_navigation']) ? $currentSection['mediaCacheData']['@attributes']['hide_navigation'] : 'no';
        $animation = !empty($currentSection['mediaCacheData']['@attributes']['animation']) ? $currentSection['mediaCacheData']['@attributes']['animation'] : 'enabled';
        $fadeContent = !empty($currentSection['mediaCacheData']['@attributes']['fade_content']) ? $currentSection['mediaCacheData']['@attributes']['fade_content'] : 'disabled';
        $backgroundColor = !empty($currentSection['sectionBgColor']) ? $currentSection['sectionBgColor'] : 'none';
        $captionColor = !empty($currentSection['mediaCacheData']['@attributes']['caption_color']) ? $currentSection['mediaCacheData']['@attributes']['caption_color'] : 'none';
        $captionBackgroundColor = 'none';
        if (!empty($currentSection['mediaCacheData']['@attributes']['caption_bg_color'])) {
            $captionBackgroundColor = '#';
            foreach (explode(',', $currentSection['mediaCacheData']['@attributes']['caption_bg_color']) as $val) {
                $captionBackgroundColor .= dechex($val);
            }
        }
        $imageSize = !empty($currentSection['mediaCacheData']['@attributes']['image_size']) ? $currentSection['mediaCacheData']['@attributes']['image_size'] : 'medium';
        $autoPlay = !empty($currentSection['mediaCacheData']['@attributes']['autoplay']) ? $currentSection['mediaCacheData']['@attributes']['autoplay'] : '0';

        $dataPath = [
            'addMedia' => $basePath,
            'hideNavigation' => "{$basePath}/mediaCacheData/@attributes/hide_navigation",
            'animation' => "{$basePath}/mediaCacheData/@attributes/animation",
            'fadeContent' => "{$basePath}/mediaCacheData/@attributes/fade_content",
            'backgroundColor' => "{$basePath}/sectionBgColor",
            'captionColor' => "{$basePath}/mediaCacheData/@attributes/caption_color",
            'captionBackgroundColor' => "{$basePath}/mediaCacheData/@attributes/caption_bg_color",
            'imageSize' => "{$basePath}/mediaCacheData/@attributes/image_size",
            'autoPlay' => "{$basePath}/mediaCacheData/@attributes/autoplay"
        ];

        $items = $this->getGalleryItems($currentSection, $storageService, $basePath);

        return [
            'dataPath' => $dataPath,
            'hideNavigation' => $hideNavigation,
            'animation' => $animation,
            'fadeContent' => $fadeContent,
            'backgroundColor' => $backgroundColor,
            'captionColor' => $captionColor,
            'captionBackgroundColor' => $captionBackgroundColor,
            'imageSize' => $imageSize,
            'autoPlay' => $autoPlay,
            'items' => $items
        ];
    }

    public function render(
        $siteSlug,
        $sectionSlug,
        $sections,
        $storageService
    ) {
        $currentSection = null;

        if (!empty($sections)) {
            $currentSectionIndex = array_search($sectionSlug, array_column($sections, 'name'));
            $currentSection = $sections[$currentSectionIndex];
        }

        if (!$currentSection) {
            return '';
        }

        $data = $this->getViewData(
            $siteSlug,
            $currentSection,
            $currentSectionIndex,
            $storageService
        );

        return view('Sites/Sections/sectionBackgroundGalleryEditor', $data);
    }
}
