<?php

namespace App\Sites\Sections;

use App\Shared\Helpers;

class DefaultTemplateRenderService extends SectionTemplateRenderService
{
    public function getViewData(
        $request,
        $sites,
        $siteSlug,
        $sections,
        $sectionSlug,
        $tagSlug,
        $tags,
        $entries,
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
            $entries,
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
        $data['isResponsive'] = $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $data['pageEntriesAttributes'] = $this->getPageEntriesAttributes($sections, $sectionSlug, $tagSlug);
        $data['additionalFooterText'] = $this->getAdditionalFooterText($siteSlug, $siteSettings, $isEditMode);

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
        $entries,
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
            $entries,
            $siteSettings,
            $siteTemplateSettings,
            $siteTemplatesConfig,
            $user,
            $storageService,
            $isShopAvailable,
            $isPreviewMode,
            $isEditMode
        );

        return view('Sites/Sections/defaultTemplate', $data);
    }
}
