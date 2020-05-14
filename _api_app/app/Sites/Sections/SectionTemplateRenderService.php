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

    public function getCurrentSection($sections, $sectionSlug)
    {
        if (empty($sections)) {
            return null;
        }

        $currentSectionOrder = array_search($sectionSlug, array_column($sections, 'name'));

        if ($currentSectionOrder === false) {
            return null;
        }

        return $sections[$currentSectionOrder];
    }

    public function getCurrentSectionType($currentSection)
    {
        if (empty($currentSection['@attributes']['type'])) {
            return 'default';
        }

        return $currentSection['@attributes']['type'];
    }

    // @todo define getBodyClasses method in MessyTemplateRenderService class
    // because for Messy body classes are different
    public function getBodyClasses($siteTemplateSettings, $sections, $sectionSlug, $tagSlug, $isEditMode)
    {
        $currentSection = $this->getCurrentSection($sections, $sectionSlug);
        $currentSectionType = $this->getCurrentSectionType($currentSection);

        $classes = [
            'xContent-' . $currentSection['name'],
            'xSectionType-' . $currentSectionType
        ];

        if (!empty($tagSlug)) {
            $classes[] = 'xSubmenu-' . $tagSlug;
        }

        if ($isEditMode) {
            $classes[] = 'page-xMySite';
        }

        if ($siteTemplateSettings['pageLayout']['responsive'] == 'yes') {
            $classes[] = 'bt-responsive';
        }

        return implode(' ', $classes);
    }
}
