<?php

namespace App\Sites\Sections;

class WhiteTemplateRenderService extends SectionTemplateRenderService
{
    public function getViewData(
        $request,
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

        return $data;
    }

    public function render(
        $request,
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
}
