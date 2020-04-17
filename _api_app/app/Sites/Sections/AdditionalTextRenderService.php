<?php

namespace App\Sites\Sections;

use App\Shared\Helpers;

class AdditionalTextRenderService
{
    private $DRAGGABLE_CLASSES = ['xEditableDragXY', 'xProperty-additionalTextXY'];

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

    public function getStyles($siteSettings, $isResponsive)
    {
        if ($isResponsive) {
            return null;
        }

        $xyPos = !empty($siteSettings['siteTexts']['additionalTextXY']) ? $siteSettings['siteTexts']['additionalTextXY'] : null;

        $pos = !empty($xyPos) ? explode(',', $xyPos) :
            [
                rand(0, 960),
                rand(0, 600)
            ];
        return 'left:' . $pos[0] . 'px;top:' . $pos[1] . 'px;';
    }

    private function getWrapperAttributes($siteSlug, $siteSettings, $templateName, $isResponsive, $isEditMode)
    {
        $attributes['id'] = 'additionalText';
        $classes = [];

        if ($isEditMode && !$isResponsive) {
            $attributes['data-path'] = "{$siteSlug}/settings/siteTexts/additionalTextXY";
        }

        if (!$isResponsive) {
            $classes = $this->DRAGGABLE_CLASSES;
            if ($templateName == 'messy') {
                $classes[] = 'mess';
            }
        }

        $attributes['class'] = implode(' ', $classes);
        $attributes['style'] = $this->getStyles($siteSettings, $isResponsive);

        return Helpers::arrayToHtmlAttributes($attributes);
    }

    private function getViewData(
        $siteSlug,
        $siteSettings,
        $siteTemplateSettings,
        $sections,
        $sectionSlug,
        $templateName,
        $isResponsive,
        $isEditMode
    ) {
        $wrapperAttributes = $this->getWrapperAttributes($siteSlug, $siteSettings, $templateName, $isResponsive, $isEditMode);

        return [
            'wrapperAttributes' => $wrapperAttributes
        ];
    }

    public function render(
        $siteSlug,
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

        $templateName = explode('-', $siteSettings['template']['template'])[0];
        $currentSection = null;
        $currentSectionType = null;

        if (!empty($sections)) {
            $currentSectionOrder = array_search($sectionSlug, array_column($sections, 'name'));
            $currentSection = $sections[$currentSectionOrder];
            $currentSectionType = isset($currentSection['@attributes']['type']) ? $currentSection['@attributes']['type'] : null;
        }

        $templateName = explode('-', $siteSettings['template']['template'])[0];
        $isResponsiveTemplate = isset($siteTemplateSettings['pageLayout']['responsive']) && $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $isResponsive = $isResponsiveTemplate || (isset($currentSectionType) && $currentSectionType == 'portfolio' && $templateName == 'messy');

        $data = $this->getViewData(
            $siteSlug,
            $siteSettings,
            $siteTemplateSettings,
            $sections,
            $sectionSlug,
            $templateName,
            $isResponsive,
            $isEditMode
        );

        return view('Sites/Sections/additionalText', $data);
    }
}
