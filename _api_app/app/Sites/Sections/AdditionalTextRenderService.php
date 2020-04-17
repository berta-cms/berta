<?php

namespace App\Sites\Sections;

class AdditionalTextRenderService
{
    // @TODO move this to sections helper class
    private function isLandingPage($sections, $sectionSlug, $isEditMode)
    {
        // Filter sections
        $sections = array_filter($sections, function ($section) use ($isEditMode) {
            $isEmptyTitle = empty($section['title']);
            $isCartSection = isset($section['@attributes']['type']) && $section['@attributes']['type'] == 'shopping_cart';
            $isPublished = $isEditMode || (!empty($section['@attributes']['published']) && $section['@attributes']['published'] == '1');
            return !$isEmptyTitle && !$isCartSection && $isPublished;
        });

        if (empty($sections)) {
            return false;
        }

        return current($sections)['name'] == $sectionSlug;
    }

    private function getViewData(
        $siteSettings,
        $siteTemplateSettings,
        $sections,
        $sectionSlug,
        $isEditMode
    ) {
        return [
        ];
    }

    public function render(
        $siteSettings,
        $siteTemplateSettings,
        $sections,
        $sectionSlug,
        $isEditMode
    ) {
        $showMenuInFirstSection = $siteSettings['navigation']['landingSectionMenuVisible'] == 'yes';

        if (!$isEditMode && !$showMenuInFirstSection && $this->isLandingPage($sections, $sectionSlug, $isEditMode)) {
            return '';
        }

        $data = $this->getViewData(
            $siteSettings,
            $siteTemplateSettings,
            $sections,
            $sectionSlug,
            $isEditMode
        );

        return view('Sites/Sections/additionalText', $data);
    }
}
