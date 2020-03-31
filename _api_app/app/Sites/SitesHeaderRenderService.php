<?php

namespace App\Sites;

use App\Shared\Helpers;
use App\Shared\Storage;
use App\Shared\ImageHelpers;

class SitesHeaderRenderService
{
    private $siteName;
    private $siteSettings;
    private $siteTemplateSettings;
    private $sections;
    private $sectionSlug;
    private $storageService;
    private $isPreviewMode;
    private $isEditMode;

    private $templateName;
    private $isResponsive;
    private $DRAGGABLE_HEADING_CLASSES = ['mess', 'xEditableDragXY', 'xProperty-siteHeadingXY'];
    private $EDITABLE_CLASSES = ['xEditable', 'xProperty-siteHeading'];

    /**
     * Construct SitesHeaderRenderService instance
     */
    public function __construct(
        $siteName,
        array $siteSettings,
        array $siteTemplateSettings,
        array $sections,
        $sectionSlug,
        Storage $storageService,
        $isPreviewMode,
        $isEditMode
    ) {
        $this->siteName = $siteName;
        $this->siteSettings = $siteSettings;
        $this->siteTemplateSettings = $siteTemplateSettings;
        $this->sections = $sections;
        $this->sectionSlug = $sectionSlug;
        $this->storageService = $storageService;
        $this->isPreviewMode = $isPreviewMode;
        $this->isEditMode = $isEditMode;

        $this->templateName = explode('-', $this->siteSettings['template']['template'])[0];
    }

    private function getHeadingStyles($params)
    {
        $pos = !empty($params) ? explode(',', $params) :
            [
                rand(0, 960),
                rand(0, 600)
            ];
        return 'left:' . $pos[0] . 'px;top:' . $pos[1] . 'px;';
    }

    private function getHeadingAttributes()
    {
        // We need heading attributes only for Messy template
        if ($this->templateName !== 'messy') {
            return '';
        }

        $attributes = [];
        $classes = [];

        if ($this->isEditMode && !$this->isResponsive) {
            $attributes['data-path'] = $this->siteName . '/settings/siteTexts/siteHeadingXY';
            $classes = $this->DRAGGABLE_HEADING_CLASSES;
        }

        if (!$this->isResponsive) {
            $attributes['style'] = $this->getHeadingStyles(isset($this->siteSettings['siteTexts']['siteHeadingXY']) ? $this->siteSettings['siteTexts']['siteHeadingXY'] : '');
        }

        if ($this->siteTemplateSettings['heading']['position'] == 'fixed') {
            $classes[] = 'xFixed';
        }

        $attributes['class'] = implode(' ', $classes);

        return Helpers::arrayToHtmlAttributes($attributes);
    }

    private function getHeadingImage()
    {
        $settingGroup = $this->templateName == 'mashup' ? 'sideBar' : 'heading';
        $filename = !empty($this->siteTemplateSettings[$settingGroup]['image']) ? $this->siteTemplateSettings[$settingGroup]['image'] : null;
        $alt = !empty($this->siteSettings['texts']['pageTitle']) ? $this->siteSettings['texts']['pageTitle'] : '';

        if (empty($filename)) {
            return null;
        }

        $image = ImageHelpers::getImageItem(
            $filename,
            $this->storageService,
            [
                'width' => $this->siteTemplateSettings[$settingGroup]['image_width'],
                'height' => $this->siteTemplateSettings[$settingGroup]['image_height'],
                'alt' => $alt
            ]
        );

        return Helpers::arrayToHtmlAttributes($image);
    }

    private function getUrl()
    {
        $urlParts = [];
        if (!empty($this->siteName)) {
            $urlParts['site'] = $this->siteName;
        }

        if ($this->isEditMode) {
            if (empty($urlParts)) {
                return '.';
            }

            $parts = [];
            foreach ($urlParts as $property => $value) {
                $parts[] = $property . '=' . $value;
            }

            return '?' . implode('&', $parts);
        } else {
            return '/' . implode('/', $urlParts) . ($this->isPreviewMode ? '?preview=1' : '');
        }
    }

    private function getEditableAttributes() {
        if (!$this->isEditMode) {
            return;
        }

        $attributes = [
            'class' => implode(' ', $this->EDITABLE_CLASSES),
            'data-path' => $this->siteName . '/settings/siteTexts/siteHeading'
        ];

        return Helpers::arrayToHtmlAttributes($attributes);
    }

    private function getViewData()
    {
        $data = [];
        $isLandingSectionPageHeadingVisible = $this->siteSettings['navigation']['landingSectionPageHeadingVisible'] == 'yes';

        // Filter sections
        $sections = array_filter($this->sections, function ($section) {
            $isEmptyTitle = empty($section['title']);
            $isCartSection = isset($section['@attributes']['type']) && $section['@attributes']['type'] == 'shopping_cart';
            $isPublished = $this->isEditMode || $section['@attributes']['published'] == '1';
            return !$isEmptyTitle && !$isCartSection && $isPublished;
        });

        if (!$this->isEditMode && !$isLandingSectionPageHeadingVisible) {
            // is current page a landing page
            if (!empty($sections) && current($sections)['name'] == $this->sectionSlug) {
                return;
            }
        }

        if (!empty($this->sections)) {
            $currentSectionOrder = array_search($this->sectionSlug, array_column($this->sections, 'name'));
            $currentSection = $this->sections[$currentSectionOrder];
            $currentSectionType = isset($currentSection['@attributes']['type']) ? $currentSection['@attributes']['type'] : null;
        }

        $isResponsiveTemplate = isset($this->siteTemplateSettings['pageLayout']['responsive']) && $this->siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $this->isResponsive = $isResponsiveTemplate || (isset($currentSectionType) && $currentSectionType == 'portfolio');

        $data['title'] = isset($this->siteSettings['siteTexts']['siteHeading']) ? $this->siteSettings['siteTexts']['siteHeading'] : '';
        $data['headingAttributes'] = $this->getHeadingAttributes();
        $data['headingImageAttributes'] = $this->getHeadingImage();
        $data['link'] = $this->getUrl();
        $data['editableAttributes'] = $this->getEditableAttributes();
        $data['isEditMode'] = $this->isEditMode;

        return $data;
    }

    public function render()
    {
        $data = $this->getViewData();
        if (!$data) {
            return '';
        }
        return view('Sites/sitesHeader', $data);
    }
}
