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
        $data['isResponsive'] = $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $data['sideColumnAttributes'] = $this->getSideColumnAttributes($siteTemplateSettings);
        $data['mainColumnAttributes'] = $this->getMainColumnAttributes($siteTemplateSettings);
        $data['pageEntriesAttributes'] = $this->getPageEntriesAttributes($sections, $sectionSlug, $tagSlug);
        $data['socialMediaLinks'] = $this->getSocialMediaLinks($siteSettings);

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
        $attributes = [];
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

    private function getMainColumnAttributes($siteTemplateSettings)
    {
        $attributes = [];
        if ($siteTemplateSettings['pageLayout']['centered'] == 'yes') {
            $attributes['class'] = 'xCentered';
        }
        if ($siteTemplateSettings['pageLayout']['responsive'] == 'yes') {
            $attributes['data-paddingtop'] = $siteTemplateSettings['pageLayout']['paddingTop'];
        }

        return Helpers::arrayToHtmlAttributes($attributes);
    }
}
