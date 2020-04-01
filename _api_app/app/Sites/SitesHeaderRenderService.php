<?php

namespace App\Sites;

use App\Shared\Helpers;
use App\Shared\Storage;
use App\Shared\ImageHelpers;

class SitesHeaderRenderService
{
    private $DRAGGABLE_HEADING_CLASSES = ['mess', 'xEditableDragXY', 'xProperty-siteHeadingXY'];
    private $EDITABLE_CLASSES = ['xEditable', 'xProperty-siteHeading'];
    private $HEADER_IMAGE_TEMPLATE_SETTING_GROUP = [
        'default' => 'pageHeading',
        'messy' => 'heading',
        'mashup' => 'sideBar',
        'white' => 'pageHeading'
    ];

    private function getHeadingStyles($params)
    {
        $pos = !empty($params) ? explode(',', $params) :
            [
                rand(0, 960),
                rand(0, 600)
            ];
        return 'left:' . $pos[0] . 'px;top:' . $pos[1] . 'px;';
    }

    private function getHeadingAttributes($isResponsive, $templateName, $isEditMode, $siteName, $siteSettings, $siteTemplateSettings)
    {
        // We need heading attributes only for Messy template
        if ($templateName !== 'messy') {
            return '';
        }

        $attributes = [];
        $classes = [];

        if ($isEditMode && !$isResponsive) {
            $attributes['data-path'] = $siteName . '/settings/siteTexts/siteHeadingXY';
            $classes = $this->DRAGGABLE_HEADING_CLASSES;
        }

        if (!$isResponsive) {
            $attributes['style'] = $this->getHeadingStyles(isset($siteSettings['siteTexts']['siteHeadingXY']) ? $siteSettings['siteTexts']['siteHeadingXY'] : '');
        }

        if ($siteTemplateSettings['heading']['position'] == 'fixed') {
            $classes[] = 'xFixed';
        }

        $attributes['class'] = implode(' ', $classes);

        return Helpers::arrayToHtmlAttributes($attributes);
    }

    private function getHeadingImageAttributes($templateName, $siteTemplateSettings, $siteSettings, $storageService)
    {
        $settingGroup = isset($this->HEADER_IMAGE_TEMPLATE_SETTING_GROUP[$templateName]) ? $this->HEADER_IMAGE_TEMPLATE_SETTING_GROUP[$templateName] : 'heading';
        $filename = !empty($siteTemplateSettings[$settingGroup]['image']) ? $siteTemplateSettings[$settingGroup]['image'] : null;
        $alt = !empty($siteSettings['texts']['pageTitle']) ? $siteSettings['texts']['pageTitle'] : '';

        if (empty($filename)) {
            return null;
        }

        $image = ImageHelpers::getImageItem(
            $filename,
            $storageService,
            [
                'width' => !empty($siteTemplateSettings[$settingGroup]['image_width']) ? $siteTemplateSettings[$settingGroup]['image_width'] : null,
                'height' => !empty($siteTemplateSettings[$settingGroup]['image_height']) ? $siteTemplateSettings[$settingGroup]['image_height'] : null,
                'alt' => $alt
            ]
        );

        return Helpers::arrayToHtmlAttributes($image);
    }

    private function getUrl($siteName, $isEditMode, $isPreviewMode)
    {
        $urlParts = [];
        if (!empty($siteName)) {
            $urlParts['site'] = $siteName;
        }

        if ($isEditMode) {
            if (empty($urlParts)) {
                return '.';
            }

            $parts = [];
            foreach ($urlParts as $property => $value) {
                $parts[] = $property . '=' . $value;
            }

            return '?' . implode('&', $parts);
        } else {
            return '/' . implode('/', $urlParts) . ($isPreviewMode ? '?preview=1' : '');
        }
    }

    private function getEditableAttributes($isEditMode, $siteName)
    {
        if (!$isEditMode) {
            return;
        }

        $attributes = [
            'class' => implode(' ', $this->EDITABLE_CLASSES),
            'data-path' => $siteName . '/settings/siteTexts/siteHeading'
        ];

        return Helpers::arrayToHtmlAttributes($attributes);
    }

    /**
     * Prepare template data
     *
     * @param string $siteName
     * @param array $siteSettings
     * @param array $siteTemplateSettings
     * @param array $sections
     * @param string $sectionSlug
     * @param Storage $storageService
     * @param boolean $isPreviewMode
     * @param boolean $isEditMode
     * @return array
     */
    private function getViewData(
        $siteName,
        $siteSettings,
        $siteTemplateSettings,
        $sections,
        $sectionSlug,
        $storageService,
        $isPreviewMode,
        $isEditMode
    ) {
        $data = [];
        $isLandingSectionPageHeadingVisible = $siteSettings['navigation']['landingSectionPageHeadingVisible'] == 'yes';
        $templateName = explode('-', $siteSettings['template']['template'])[0];

        // Filter sections
        $availableSections = array_filter($sections, function ($section) use ($isEditMode) {
            $isEmptyTitle = empty($section['title']);
            $isCartSection = isset($section['@attributes']['type']) && $section['@attributes']['type'] == 'shopping_cart';
            $isPublished = $isEditMode || $section['@attributes']['published'] == '1';
            return !$isEmptyTitle && !$isCartSection && $isPublished;
        });

        if (!$isEditMode && !$isLandingSectionPageHeadingVisible) {
            // is current page a landing page
            if (!empty($availableSections) && current($availableSections)['name'] == $sectionSlug) {
                return;
            }
        }

        if (!empty($sections)) {
            $currentSectionOrder = array_search($sectionSlug, array_column($sections, 'name'));
            $currentSection = $sections[$currentSectionOrder];
            $currentSectionType = isset($currentSection['@attributes']['type']) ? $currentSection['@attributes']['type'] : null;
        }

        $isResponsiveTemplate = isset($siteTemplateSettings['pageLayout']['responsive']) && $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $isResponsive = $isResponsiveTemplate || (isset($currentSectionType) && $currentSectionType == 'portfolio');

        $data['title'] = isset($siteSettings['siteTexts']['siteHeading']) ? $siteSettings['siteTexts']['siteHeading'] : '';
        $data['headingAttributes'] = $this->getHeadingAttributes($isResponsive, $templateName, $isEditMode, $siteName, $siteSettings, $siteTemplateSettings);
        $data['headingImageAttributes'] = $this->getHeadingImageAttributes($templateName, $siteTemplateSettings, $siteSettings, $storageService);
        $data['link'] = $this->getUrl($siteName, $isEditMode, $isPreviewMode);
        $data['editableAttributes'] = $this->getEditableAttributes($isEditMode, $siteName);
        $data['isEditMode'] = $isEditMode;

        return $data;
    }

    /**
     * Render site header
     *
     * @param string $siteName
     * @param array $siteSettings
     * @param array $siteTemplateSettings
     * @param array $sections
     * @param string $sectionSlug
     * @param Storage $storageService
     * @param boolean $isPreviewMode
     * @param boolean $isEditMode
     * @return string
     */
    public function render(
        $siteName,
        $siteSettings,
        $siteTemplateSettings,
        $sections,
        $sectionSlug,
        $storageService,
        $isPreviewMode,
        $isEditMode
    ) {
        $data = $this->getViewData($siteName, $siteSettings, $siteTemplateSettings, $sections, $sectionSlug, $storageService, $isPreviewMode, $isEditMode);
        if (!$data) {
            return '';
        }
        return view('Sites/sitesHeader', $data);
    }
}
