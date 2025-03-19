<?php

namespace App\Sites;

use App\Shared\Helpers;
use App\Shared\ImageHelpers;

class SitesBannersRenderService
{
    private function getClassList($banner, $isResponsive, $isEditMode)
    {
        $classes = [];
        $classes[] = 'floating-banner';
        $classes[] = 'banner-' . $banner->index;

        if ($isEditMode && ! $isResponsive) {
            $classes[] = 'xEditableDragXY';
            $classes[] = 'xProperty-banner' . $banner->index . 'XY';
        }

        return implode(' ', $classes);
    }

    private function getStyleList($banner, $siteSettings, $isResponsive)
    {
        $styles = [];

        if ($isResponsive) {
            return;
        }

        $left = ! empty($banner->left) ? $banner->left : rand(0, 960);
        $top = ! empty($banner->top) ? $banner->top : rand(0, 200);
        $styles[] = 'left:' . $left . 'px';
        $styles[] = 'top:' . $top . 'px';

        return implode(';', $styles);
    }

    private function getAttributes($banner, $siteName, $siteSettings, $isResponsive, $isEditMode)
    {
        return Helpers::arrayToHtmlAttributes([
            'class' => $this->getClassList($banner, $isResponsive, $isEditMode),
            'style' => $this->getStyleList($banner, $siteSettings, $isResponsive),
            'data-path' => $isEditMode && ! $isResponsive ? $siteName . '/settings/siteTexts/banner' . $banner->index . 'XY' : null,
        ]);
    }

    private function getImageAttributes($banner, $siteSettings, $storageService)
    {
        $image = ImageHelpers::getImageItem(
            $banner->image,
            $storageService,
            [
                'width' => ! empty($banner->width) ? $banner->width : null,
                'height' => ! empty($banner->height) ? $banner->height : null,
            ]
        );

        return Helpers::arrayToHtmlAttributes($image);
    }

    private function getViewData(
        $siteName,
        $siteSettings,
        $siteTemplateSettings,
        $sections,
        $sectionSlug,
        $storageService,
        $isEditMode
    ) {
        $data = [];
        $banners = [];

        foreach ($siteSettings['banners'] as $key => $value) {
            if (empty($value)) {
                continue;
            }
            $index = (int) substr($key, 6);
            $property = last(explode('_', $key));
            $banners[$index]['index'] = $index;
            $banners[$index][$property] = $value;
        }

        $banners = array_filter($banners, function ($banner) {
            return ! empty($banner['image']);
        });

        if (empty($banners)) {
            return $data;
        }

        if (! empty($sections)) {
            $currentSectionOrder = array_search($sectionSlug, array_column($sections, 'name'));
            $currentSection = $sections[$currentSectionOrder];
            $currentSectionType = isset($currentSection['@attributes']['type']) ? $currentSection['@attributes']['type'] : null;
        }

        $templateName = explode('-', $siteSettings['template']['template'])[0];
        $isResponsiveTemplate = isset($siteTemplateSettings['pageLayout']['responsive']) && $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $isResponsive = $isResponsiveTemplate || (isset($currentSectionType) && $currentSectionType == 'portfolio' && $templateName == 'messy');

        $banners = array_map(function ($banner) use ($siteName, $siteSettings, $storageService, $isResponsive, $isEditMode) {
            if (! empty($siteSettings['siteTexts']['banner' . $banner['index'] . 'XY'])) {
                [$banner['left'], $banner['top']] = explode(',', $siteSettings['siteTexts']['banner' . $banner['index'] . 'XY']);
            }
            $siteBanner = new SiteBanner($banner);
            $banner['siteBanner'] = $siteBanner;
            $banner['attributes'] = $this->getAttributes($siteBanner, $siteName, $siteSettings, $isResponsive, $isEditMode);
            $banner['imageAttributes'] = $this->getImageAttributes($siteBanner, $siteSettings, $storageService);

            return $banner;
        }, $banners);

        return [
            'banners' => $banners,
            'isResponsive' => $isResponsive,
            'isEditMode' => $isEditMode,
        ];
    }

    public function render(
        $siteName,
        $siteSettings,
        $siteTemplateSettings,
        $sections,
        $sectionSlug,
        $storageService,
        $isEditMode
    ) {
        $data = $this->getViewData(
            $siteName,
            $siteSettings,
            $siteTemplateSettings,
            $sections,
            $sectionSlug,
            $storageService,
            $isEditMode
        );
        if (! $data) {
            return '';
        }

        return view('Sites/sitesBanners', $data);
    }
}
