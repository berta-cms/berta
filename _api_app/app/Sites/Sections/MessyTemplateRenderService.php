<?php

namespace App\Sites\Sections;

use App\Configuration\SiteTemplatesConfigService;
use App\Plugins\Shop\ShopCartRenderService;
use App\Plugins\Shop\ShopSettingsDataService;
use App\Plugins\Shop\ShopShippingRegionsDataService;
use App\Shared\Helpers;
use App\Sites\Sections\SectionBackgroundGalleryRenderService;
use App\Sites\Sections\SectionTemplateRenderService;

class MessyTemplateRenderService extends SectionTemplateRenderService
{
    private $sectionBackgroundGalleryRS;
    private $gridViewRS;
    private $siteTemplatesConfigService;

    public function __construct()
    {
        parent::__construct();
        $this->sectionBackgroundGalleryRS = new SectionBackgroundGalleryRenderService();
        $this->siteTemplatesConfigService = new SiteTemplatesConfigService();
        $this->gridViewRS = new GridViewRenderService();
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
        $defaultConfig = $this->siteTemplatesConfigService->getDefaults();
        $templateDefaultConfig = $defaultConfig[$siteSettings['template']['template']];
        $isResponsive = $siteTemplateSettings['pageLayout']['responsive'] == 'yes' || $currentSectionType == 'portfolio';
        $isAutoResponsive = !$isResponsive && $siteTemplateSettings['pageLayout']['autoResponsive'] == 'yes';
        $isGridViewEnabled = $currentSectionType == 'grid' && $request->cookie('_berta_grid_view');

        $data['bodyClassList'] = $this->getBodyClassList(
            $siteTemplateSettings,
            $currentSection,
            $currentSectionType,
            $tagSlug,
            $isResponsive,
            $isAutoResponsive,
            $isEditMode
        );
        $data['sectionType'] = $currentSectionType;
        $data['contentContainerAttributes'] = $this->getContentContainerAttributes($siteTemplateSettings, $isResponsive);
        $data['pageEntriesClasses'] = $this->getPageEntriesClasses($currentSection, $tagSlug, $isResponsive);
        $data['showBackgroundGalleryEditor'] = $isEditMode && !empty($sections);
        $data['isGridViewEnabled'] = $isGridViewEnabled;
        $data['gridTrigger'] = $this->getGridTrigger($request, $siteSlug, $sections, $currentSection, $currentSectionType, $tagSlug, $isPreviewMode, $isEditMode);
        $data['gridView'] = $this->gridViewRS->render(
            $siteSlug,
            $storageService,
            $siteSettings,
            $sectionSlug,
            $sections,
            $tagSlug,
            $request,
            $isPreviewMode,
            $isEditMode
        );
        $data['additionalFooterText'] = $this->getAdditionalFooterText($siteSlug, $siteSettings, $user, $isEditMode);
        $data['alertMessage'] = $this->getAlertMessage();

        if ($isShopAvailable) {
            $shopSettingsDS = new ShopSettingsDataService($siteSlug);
            $shopSettings = $shopSettingsDS->get();
            $shopCartRS = new ShopCartRenderService();
        }

        if ($currentSectionType == 'shopping_cart' && $isShopAvailable) {
            $shopShippingRegionsDS = new ShopShippingRegionsDataService($siteSlug);
            $shippingRegions = $shopShippingRegionsDS->get();

            $data['cartSection'] = $shopCartRS->render(
                $siteSlug,
                $siteSettings,
                $shopSettings,
                $shippingRegions,
                $request,
                $sections,
                $sectionSlug,
                $isEditMode
            );
        } else {
            $data['backgroundGallery'] = $this->sectionBackgroundGalleryRS->render(
                $storageService,
                $siteSettings,
                $siteTemplateSettings,
                $sectionSlug,
                $sections,
                $request,
                $isEditMode
            );

            $data['backgroundVideoEmbed'] = $this->getBackgroundVideoEmbed($currentSection, $templateDefaultConfig);
            $data['gridlinesAttributes'] = $this->getGridlinesAttributes($siteSettings, $isEditMode);

            if ($isShopAvailable) {
                $data['shoppingCartLink'] = $shopCartRS->renderCartLink(
                    $request,
                    $siteSlug,
                    $siteSettings,
                    $shopSettings,
                    $sections,
                    $storageService,
                    $isResponsive,
                    $isPreviewMode,
                    $isEditMode
                );
            }
        }

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

        return view('Sites/Sections/messyTemplate', $data);
    }

    public function getBodyClassList(
        $siteTemplateSettings,
        $currentSection,
        $currentSectionType,
        $tagSlug,
        $isResponsive,
        $isAutoResponsive,
        $isEditMode
    ) {
        $classes = [
            'xContent-' . $currentSection['name'],
            'xSectionType-' . $currentSectionType,
        ];

        if (!empty($tagSlug)) {
            $classes[] = 'xSubmenu-' . $tagSlug;
        }

        if ($isEditMode) {
            $classes[] = 'page-xMySite';
        }

        if ($siteTemplateSettings['pageLayout']['centeredContents'] == 'yes') {
            $classes[] = 'bt-centered-content';
        }

        if ($isResponsive) {
            $classes[] = 'bt-responsive';
        }

        if ($isAutoResponsive) {
            $classes[] = 'bt-auto-responsive';
        }

        return implode(' ', $classes);
    }

    private function getBackgroundVideoEmbed($section, $templateDefaultConfig)
    {
        if (empty($section['backgroundVideoEmbed'])) {
            return null;
        }
        $class = !empty($section['backgroundVideoRatio']) ? $section['backgroundVideoRatio'] : $templateDefaultConfig['sectionTypes']['default']['backgroundVideoRatio'];

        return [
            'content' => $section['backgroundVideoEmbed'],
            'class' => $class,
        ];
    }

    private function getGridlinesAttributes($siteSettings, $isEditMode)
    {
        if (!$isEditMode || $siteSettings['pageLayout']['showGrid'] != 'yes' || $siteSettings['pageLayout']['gridStep'] < 2) {
            return null;
        }

        $gridStep = $siteSettings['pageLayout']['gridStep'];
        $gridStepBase = $gridStep * 5;
        $color = $siteSettings['pageLayout']['gridColor'] == 'white' ? '255, 255, 255' : '0, 0, 0';
        $styles = [
            "background-size:{$gridStepBase}px {$gridStepBase}px, {$gridStepBase}px {$gridStepBase}px, {$gridStep}px {$gridStep}px, {$gridStep}px {$gridStep}px",
            "background-image:linear-gradient(rgba({$color}, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba({$color}, 0.5) 1px, transparent 0px), linear-gradient(rgba({$color}, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba({$color}, 0.2) 1px, transparent 0px)",
        ];

        $attributes['style'] = implode(';', $styles);

        return Helpers::arrayToHtmlAttributes($attributes);
    }

    private function getContentContainerAttributes($siteTemplateSettings, $isResponsive)
    {
        $attributes = [];
        $classes = [];
        if ($siteTemplateSettings['pageLayout']['centered'] == 'yes') {
            $classes[] = 'xCentered';
        }
        if ($isResponsive) {
            $classes[] = 'xResponsive';
        }
        $attributes['class'] = implode(' ', $classes);

        return Helpers::arrayToHtmlAttributes($attributes);
    }

    public function getPageEntriesClasses($currentSection, $tagSlug, $isResponsive)
    {
        $attributes = [];
        $classes = [
            'xEntriesList',
            'clearfix',
            'xSection-' . $currentSection['name'],
        ];

        if (!empty($tagSlug)) {
            $classes[] = 'xTag-' . $tagSlug;
        }

        if ($isResponsive) {
            if (!empty($currentSection['columns'])) {
                $classes[] = 'columns-' . $currentSection['columns'];
            }
        } else {
            $classes[] = 'xNoEntryOrdering';
        }

        $attributes['class'] = implode(' ', $classes);

        return Helpers::arrayToHtmlAttributes($attributes);
    }

    private function getGridTrigger($request, $siteSlug, $sections, $currentSection, $currentSectionType, $tagSlug, $isPreviewMode, $isEditMode)
    {
        if ($currentSectionType != 'grid' || $request->cookie('_berta_grid_view') || empty($currentSection['mediaCacheData']['file'])) {
            return null;
        }

        $attributes = [];
        if ($isEditMode) {
            $attributes['style'] = 'right:44px';
        } else {
            $cartSections = array_filter($sections, function ($section) {
                $isPublished = !empty($section['@attributes']['published']) && $section['@attributes']['published'];
                $isCartSection = !empty($section['@attributes']['type']) && $section['@attributes']['type'] == 'shopping_cart';
                return $isPublished && $isCartSection;
            });
            if (!empty($cartSections)) {
                $attributes['style'] = 'top:20px';
            }
        }

        $urlParts = [];
        if (!empty($siteSlug)) {
            $urlParts['site'] = $siteSlug;
        }
        $urlParts['section'] = $currentSection['name'];
        if (!empty($tagSlug)) {
            $urlParts['tag'] = $tagSlug;
        }

        if ($isEditMode) {
            $parts = [];
            foreach ($urlParts as $property => $value) {
                $parts[] = $property . '=' . $value;
            }
            $link = '?' . implode('&', $parts);
        } else {
            $link = '/' . implode('/', $urlParts) . ($isPreviewMode ? '?preview=1' : '');
        }

        return [
            'attributes' => Helpers::arrayToHtmlAttributes($attributes),
            'link' => $link,
        ];
    }

    private function getAlertMessage()
    {
        if (!isset($_SESSION['_berta_msg'])) {
            return null;
        }
        $message = $_SESSION['_berta_msg'];
        unset($_SESSION['_berta_msg']);

        return $message;
    }
}
