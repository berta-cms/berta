<?php

namespace App\Sites\Sections;

use App\Shared\I18n;
use App\User\UserModel;

class SectionHeadRenderService
{
    private static $TITLE_SEPARATOR = ' / ';

    private function getTitle($siteSettings, $currentSection, $sectionTags, $tagSlug)
    {
        $titleParts = [];
        if (!empty($currentSection['seoTitle'])) {
            $titleParts[] = $currentSection['seoTitle'];
        } else {
            if (!empty($siteSettings['texts']['pageTitle'])) {
                $titleParts[] = $siteSettings['texts']['pageTitle'];
            }
            if (!empty($currentSection['title'])) {
                $titleParts[] = $currentSection['title'];
            }
            if (!empty($tagSlug) && !empty($currentSection) && !empty($sectionTags)) {
                $sectionIndex = array_search(
                    $currentSection['name'],
                    array_column(
                        array_column(
                        $sectionTags['section'],
                        '@attributes'
                        ),
                        'name'
                    )
                );

                if ($sectionIndex !== false) {
                    $tagIndex = array_search(
                        $tagSlug,
                        array_column(
                            array_column(
                                $sectionTags['section'][$sectionIndex]['tag'],
                            '@attributes'
                            ),
                            'name'
                        )
                    );
                    if ($tagIndex !== false) {
                        $titleParts[] = $sectionTags['section'][$sectionIndex]['tag'][$tagIndex]['@value'];
                    }
                }
            }
        }

        return implode($this::$TITLE_SEPARATOR, $titleParts);
    }

    private function getFavicon($siteSettings, $storageService)
    {
        if (!empty($siteSettings['pageLayout']['favicon'])) {
            return $storageService->MEDIA_URL . '/' . $siteSettings['pageLayout']['favicon'];
        } else {
            return '/_templates/' . $siteSettings['template']['template'] . '/favicon.ico';
        }
    }

    private function getScripts($siteSlug, $siteSettings, $currentSection, $isEditMode)
    {
        $scripts = [];

        $bertaGlobalOptions = [
            'templateName' => $siteSettings['template']['template'],
            'environment' => $isEditMode ? 'engine' : 'site',
            'backToTopEnabled' => $siteSettings['navigation']['backToTopEnabled'],
            'slideshowAutoRewind' => $siteSettings['entryLayout']['gallerySlideshowAutoRewind'],
            'sectionType' => !empty($currentSection['@attributes']['type']) ? $currentSection['@attributes']['type'] : 'default',
            'gridStep' => $siteSettings['pageLayout']['gridStep'],
            'galleryFullScreenBackground' => $siteSettings['entryLayout']['galleryFullScreenBackground'],
            'galleryFullScreenImageNumbers' => $siteSettings['entryLayout']['galleryFullScreenImageNumbers'],
            'paths' => [
                'engineRoot' => '/engine/',
                'engineABSRoot' => '/engine/',
                'siteABSMainRoot' => '/',
                'siteABSRoot' => '/' . (!empty($siteSlug) ? $siteSlug . '/' : ''),
                'template' => '/_templates/' . $siteSettings['template']['template'] . '/',
                'site' => $siteSlug
            ],
            'i18n' => [
                'create new entry here' => I18n::_('create new entry here'),
                'create new entry' => I18n::_('create new entry')
            ]
        ];

        return [
            'bertaGlobalOptions' => json_encode($bertaGlobalOptions)
        ];
    }

    private function getViewData(
        $siteSlug,
        $sections,
        $sectionSlug,
        $tagSlug,
        $sectionTags,
        $siteSettings,
        $siteTemplateSettings,
        $storageService,
        $isEditMode
    ) {
        $data = [];
        $currentSection = null;
        I18n::load_language($siteSettings['language']['language']);

        if (!empty($sections)) {
            $currentSectionOrder = array_search($sectionSlug, array_column($sections, 'name'));
            $currentSection = $sections[$currentSectionOrder];
            $currentSectionType = isset($currentSection['@attributes']['type']) ? $currentSection['@attributes']['type'] : null;
        }

        $templateName = explode('-', $siteSettings['template']['template'])[0];
        $isResponsiveTemplate = isset($siteTemplateSettings['pageLayout']['responsive']) && $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $isAutoResponsive = isset($siteTemplateSettings['pageLayout']['autoResponsive']) && $siteTemplateSettings['pageLayout']['autoResponsive'] == 'yes';

        $isResponsive = $isResponsiveTemplate || (isset($currentSectionType) && $currentSectionType == 'portfolio' && $templateName == 'messy');

        $data['title'] = $this->getTitle($siteSettings, $currentSection, $sectionTags, $tagSlug);
        $data['keywords'] = !empty($currentSection['seoKeywords']) ? $currentSection['seoKeywords'] : $siteSettings['texts']['metaKeywords'];
        $data['description'] = !empty($currentSection['seoDescription']) ? $currentSection['seoDescription'] : $siteSettings['texts']['metaDescription'];
        $data['author'] = $siteSettings['texts']['ownerName'];
        $data['noindex'] = !isset($currentSection['@attributes']['published']) || $currentSection['@attributes']['published'] == '0' || UserModel::getHostingData('NOINDEX');
        $data['googleSiteVerificationTag'] = $siteSettings['settings']['googleSiteVerification'];
        $data['favicon'] = $this->getFavicon($siteSettings, $storageService);
        $data['scripts'] = $this->getScripts($siteSlug, $siteSettings, $currentSection, $isEditMode);
        $data['isResponsive'] = $isResponsive;
        $data['isAutoResponsive'] = $isAutoResponsive;

        return $data;
    }

    public function render(
        $siteSlug,
        $sections,
        $sectionSlug,
        $tagSlug,
        $sectionTags,
        $siteSettings,
        $siteTemplateSettings,
        $storageService,
        $isEditMode
    ) {
        $data = $this->getViewData(
            $siteSlug,
            $sections,
            $sectionSlug,
            $tagSlug,
            $sectionTags,
            $siteSettings,
            $siteTemplateSettings,
            $storageService,
            $isEditMode
        );

        return view('Sites/Sections/sectionHead', $data);
    }
}
