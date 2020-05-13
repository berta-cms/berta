<?php

namespace App\Sites\Sections;

use App\Sites\Sections\SectionHeadRenderService;

abstract class SectionTemplateRenderService
{
    private $sectionHeadRS;

    public function __construct()
    {
        $this->sectionHeadRS = new SectionHeadRenderService();
    }

    // Force Extending class to define this method
    abstract protected function render(
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

    public function getViewData(
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
        $data = [];
        $data['sectionHead'] = $this->sectionHeadRS->render(
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

        return $data;
    }
}
