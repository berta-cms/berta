<?php

namespace App\Sites\Sections;

use App\Shared\Helpers;

class WhiteTemplateRenderService extends SectionTemplateRenderService
{
    public function getViewData(
        $request,
        $sites,
        $siteSlug,
        $sections,
        $sectionSlug,
        $tagSlug,
        $tags,
        $siteSettings,
        $siteTemplateSettings,
        $siteTemplatesConfig,
        $user,
        $storageService,
        $isShopAvailable,
        $isPreviewMode,
        $isEditMode
    ) {
        $data = parent::getViewData(
            $request,
            $sites,
            $siteSlug,
            $sections,
            $sectionSlug,
            $tagSlug,
            $tags,
            $siteSettings,
            $siteTemplateSettings,
            $siteTemplatesConfig,
            $user,
            $storageService,
            $isShopAvailable,
            $isPreviewMode,
            $isEditMode
        );

        $data['bodyClasses'] = $this->getBodyClasses($siteTemplateSettings, $sections, $sectionSlug, $tagSlug, $isEditMode);
        $data['isCenteredPageLayout'] = $siteTemplateSettings['pageLayout']['centered'] == 'yes';
        // $data['isResponsive'] = $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $data['sideColumnAttributes'] = $this->getSideColumnAttributes($siteTemplateSettings);

        return $data;
    }

    public function render(
        $request,
        $sites,
        $siteSlug,
        $sections,
        $sectionSlug,
        $tagSlug,
        $tags,
        $siteSettings,
        $siteTemplateSettings,
        $siteTemplatesConfig,
        $user,
        $storageService,
        $isShopAvailable,
        $isPreviewMode,
        $isEditMode
    ) {
        $data = $this->getViewData(
            $request,
            $sites,
            $siteSlug,
            $sections,
            $sectionSlug,
            $tagSlug,
            $tags,
            $siteSettings,
            $siteTemplateSettings,
            $siteTemplatesConfig,
            $user,
            $storageService,
            $isShopAvailable,
            $isPreviewMode,
            $isEditMode
        );

        return view('Sites/Sections/whiteTemplate', $data);
    }

    private function getSideColumnAttributes($siteTemplateSettings)
    {
        $attributes['id'] = 'sideColumn';
        $classes = [];
        if ($siteTemplateSettings['pageLayout']['centered'] == 'yes') {
            $classes[] = 'xCentered';
        }
        if ($siteTemplateSettings['pageLayout']['responsive'] == 'yes') {
            $classes[] = 'xResponsive';
        }

        $attributes['class'] = implode(' ', $classes);

        return Helpers::arrayToHtmlAttributes($attributes);
    }
}
