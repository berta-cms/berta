<?php

namespace App\Sites\Sections;

use App\Shared\I18n;
use App\Shared\Helpers;
use App\Sites\SitesMenuRenderService;
use App\Sites\SitesHeaderRenderService;
use App\Sites\SitesBannersRenderService;
use App\Sites\SocialMediaLinksRenderService;
use App\Sites\Sections\SectionHeadRenderService;
use App\Sites\Sections\SectionsMenuRenderService;
use App\Sites\Sections\SectionFooterRenderService;
use App\Sites\Sections\AdditionalTextRenderService;
use App\Sites\Sections\AdditionalFooterTextRenderService;
use App\Sites\Sections\Entries\SectionEntryRenderService;
use App\Sites\Sections\Entries\PortfolioThumbnailsRenderService;

abstract class SectionTemplateRenderService
{
    private $sectionHeadRS;
    private $sectionFooterRS;
    private $sitesMenuRS;
    private $sitesHeaderRS;
    private $socialMediaLinksRS;
    private $additionalTextRS;
    private $additionalFooterTextRS;
    private $sectionsMenuRS;
    private $sectionEntryRS;
    private $portfolioThumbnailsRS;
    private $sitesBannersRS;

    public function __construct()
    {
        $this->sectionHeadRS = new SectionHeadRenderService();
        $this->sectionFooterRS = new SectionFooterRenderService();
        $this->sitesMenuRS = new SitesMenuRenderService();
        $this->sitesHeaderRS = new SitesHeaderRenderService();
        $this->socialMediaLinksRS = new SocialMediaLinksRenderService();
        $this->additionalTextRS = new AdditionalTextRenderService($this->socialMediaLinksRS);
        $this->additionalFooterTextRS = new AdditionalFooterTextRenderService($this->socialMediaLinksRS);
        $this->sectionsMenuRS = new SectionsMenuRenderService();
        $this->sectionEntryRS = new SectionEntryRenderService();
        $this->portfolioThumbnailsRS = new PortfolioThumbnailsRenderService();
        $this->sitesBannersRS = new SitesBannersRenderService();
    }

    // Force Extending class to define this method
    abstract protected function render(
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

        $data['googleTagManagerNoscript'] = $this->googleTagManagerNoscriptRender($siteSettings);

        $data['sitesMenu'] = $this->sitesMenuRS->render(
            $siteSlug,
            $user,
            $isEditMode,
            $siteSettings,
            $siteTemplateSettings,
            $sites
        );

        $data['siteHeader'] = $this->sitesHeaderRS->render(
            $siteSlug,
            $siteSettings,
            $siteTemplateSettings,
            $sections,
            $sectionSlug,
            $storageService,
            $isPreviewMode,
            $isEditMode
        );

        $data['additionalTextBlock'] = $this->additionalTextRS->render(
            $siteSlug,
            $siteSettings,
            $siteTemplateSettings,
            $sections,
            $sectionSlug,
            $isEditMode
        );

        $data['sectionsMenu'] = $this->sectionsMenuRS->render(
            $siteSlug,
            $sections,
            $sectionSlug,
            $siteSettings,
            $siteTemplateSettings,
            $tags,
            $tagSlug,
            $isPreviewMode,
            $isEditMode
        );

        $data['entries'] = $this->getEntries(
            $siteSlug,
            $sections,
            $sectionSlug,
            $entries,
            $siteSettings,
            $siteTemplateSettings,
            $storageService,
            $isEditMode,
            $isShopAvailable
        );

        $data['portfolioThumbnails'] = $this->getPortfolioThumbnails($siteSettings, $storageService, $sections, $sectionSlug, $entries, $isEditMode);

        $data['siteBanners'] = $this->sitesBannersRS->render(
            $siteSlug,
            $siteSettings,
            $siteTemplateSettings,
            $sections,
            $sectionSlug,
            $storageService,
            $isEditMode
        );

        $data['userCopyright'] = $this->getUserCopyright($siteSlug, $siteSettings, $isEditMode);

        $data['bertaCopyright'] = $this->getBertaCopyright($siteSettings, $user);

        $data['sectionFooter'] = $this->sectionFooterRS->render(
            $siteSettings,
            $sections,
            $user,
            $request,
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

    public function getSideColumnAttributes($siteTemplateSettings)
    {
        $attributes = [];
        $classes = [];
        if ($siteTemplateSettings['pageLayout']['centered'] == 'yes') {
            $classes[] = 'xCentered';
        }
        if ($siteTemplateSettings['pageLayout']['responsive'] == 'yes') {
            $classes[] = 'xResponsive';
        }

        $attributes['class'] = implode(' ', $classes);

        return Helpers::arrayToHtmlAttributes($attributes);
    }

    public function getPageEntriesAttributes($sections, $sectionSlug, $tagSlug)
    {
        $currentSection = $this->getCurrentSection($sections, $sectionSlug);
        $attributes = [];
        $classes = [
            'xEntriesList',
            'xSection-' . $currentSection['name']
        ];

        if (!empty($tagSlug)) {
            $classes[] = 'xTag-' . $tagSlug;
        }

        $attributes['class'] = implode(' ', $classes);

        return  Helpers::arrayToHtmlAttributes($attributes);
    }

    private function getEntries(
        $siteSlug,
        $sections,
        $sectionSlug,
        $entries,
        $siteSettings,
        $siteTemplateSettings,
        $storageService,
        $isEditMode,
        $isShopAvailable
    ) {
        $currentSection = $this->getCurrentSection($sections, $sectionSlug);
        $entriesHTML = '';
        foreach ($entries as $entry) {
            $entriesHTML .= $this->sectionEntryRS->render(
                $siteSlug,
                $sections,
                $entry,
                $currentSection,
                $siteSettings,
                $siteTemplateSettings,
                $storageService,
                $isEditMode,
                $isShopAvailable
            );
        }
        return $entriesHTML;
    }

    private function getPortfolioThumbnails($siteSettings, $storageService, $sections, $sectionSlug, $entries, $isEditMode)
    {
        $currentSection = $this->getCurrentSection($sections, $sectionSlug);
        return $this->portfolioThumbnailsRS->render($siteSettings, $storageService, $currentSection, $entries, $isEditMode);
    }

    // used only for White and Mashup
    public function getSocialMediaLinks($siteSettings)
    {
        if ($siteSettings['socialMediaButtons']['socialMediaLocation'] == 'footer' && !empty($siteSettings['socialMediaButtons']['socialMediaHTML'])) {
            return $siteSettings['socialMediaButtons']['socialMediaHTML'];
        }

        if ($siteSettings['socialMediaLinks']['location'] == 'footer') {
            return $this->socialMediaLinksRS->render($siteSettings);
        }

        return '';
    }

    public function getAdditionalFooterText($siteSlug, $siteSettings, $user, $isEditMode)
    {
        return $this->additionalFooterTextRS->render($siteSlug, $siteSettings, $user, $isEditMode);
    }

    private function getUserCopyright($siteSlug, $siteSettings, $isEditMode)
    {
        $content = !empty($siteSettings['siteTexts']['siteFooter']) ? $siteSettings['siteTexts']['siteFooter'] : '';
        $attributes = [];
        $classes = [];

        if ($isEditMode) {
            $classes = [
                'xEditableTA',
                'xProperty-siteFooter'
            ];
            $attributes['data-path'] = "{$siteSlug}/settings/siteTexts/siteFooter";
        }

        $attributes['class'] = implode(' ', $classes);

        return [
            'content' => $content,
            'attributes' => Helpers::arrayToHtmlAttributes($attributes)
        ];
    }

    private function getBertaCopyright($siteSettings, $user)
    {
        $hideBertaCopyright = !empty($siteSettings['settings']['hideBertaCopyright']) && $siteSettings['settings']['hideBertaCopyright'] == 'yes';
        if ($hideBertaCopyright && $user->getPlan() > 1) {
            return '';
        }

        I18n::load_language($siteSettings['language']['language']);

        return I18n::_('berta_copyright_text');
    }

    private function googleTagManagerNoscriptRender($siteSettings)
    {
        return view(
            '/Sites/Sections/googleTagManagerNoscript',
            [
                'googleTagManagerContainerId' => $siteSettings['settings']['googleTagManagerContainerId']
            ]
        );
    }
}
