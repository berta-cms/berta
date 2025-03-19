<?php

namespace App\Sites\Sections;

use App\Configuration\SiteTemplatesConfigService;
use App\Shared\Helpers;
use App\Sites\Sections\Entries\SectionMashupEntriesRenderService;

class MashupTemplateRenderService extends SectionTemplateRenderService
{
    private $mashupEntriesRS;

    public function __construct()
    {
        parent::__construct();
        $siteTemplatesConfigService = new SiteTemplatesConfigService;
        $this->mashupEntriesRS = new SectionMashupEntriesRenderService($siteTemplatesConfigService);
    }

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

        $currentSection = $this->getCurrentSection($sections, $sectionSlug);
        $currentSectionType = $this->getCurrentSectionType($currentSection);

        $data['bodyClasses'] = $this->getBodyClasses($siteTemplateSettings, $sections, $sectionSlug, $tagSlug, $isEditMode);
        $data['isCenteredPageLayout'] = $siteTemplateSettings['pageLayout']['centered'] == 'yes';
        $data['isResponsive'] = $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $data['sectionType'] = $currentSectionType;
        $data['sideColumnAttributes'] = $this->getSideColumnAttributes($siteTemplateSettings);
        $data['contentContainerAttributes'] = $this->getContentContainerAttributes($siteTemplateSettings, $currentSectionType);
        $data['mainColumnAttributes'] = $this->getMainColumnAttributes($siteTemplateSettings);
        $data['pageEntriesAttributes'] = $this->getPageEntriesAttributes($sections, $sectionSlug, $tagSlug);
        $data['socialMediaLinks'] = $this->getSocialMediaLinks($siteSettings);
        $data['mashupEntries'] = $this->mashupEntriesRS->render(
            $storageService,
            $siteSlug,
            $siteSettings,
            $siteTemplateSettings,
            $sections,
            $sectionSlug,
            $tagSlug,
            $isPreviewMode,
            $isEditMode
        );

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

        return view('Sites/Sections/mashupTemplate', $data);
    }

    private function getContentContainerAttributes($siteTemplateSettings, $currentSectionType)
    {
        $attributes = [];
        $classes = [];
        if ($currentSectionType == 'mash_up') {
            $classes[] = 'noEntries';
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
