<?php

namespace App\Sites\Sections;

use App\Shared\I18n;

use Illuminate\Support\Str;
use App\Plugins\Shop\ShopSettingsDataService;

class SectionHeadRenderService
{
    protected $version;
    private static $TITLE_SEPARATOR = ' / ';

    public function __construct()
    {
        include realpath(config('app.old_berta_root') . '/engine/inc.version.php');
        $this->version = $options['version'];
    }

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

    private function getStyles($siteSlug, $siteSettings, $currentSection, $siteTemplateSettings, $siteTemplatesConfig, $templateName, $currentSectionType, $isShopAvailable, $isResponsive, $isAutoResponsive, $isPreviewMode, $isEditMode)
    {
        $googleWebFonts = [];
        $cssFiles = [];
        $inlineCSS = '';
        $cacheBoost = time();

        if ($isShopAvailable) {
            $shopSettingsDS = new ShopSettingsDataService($siteSlug);
            $shopSettings = $shopSettingsDS->get();
            $siteTemplateSettings = array_merge($siteTemplateSettings, $shopSettings);
        }

        foreach ($siteTemplateSettings as $settingGroup) {
            foreach ($settingGroup as $key => $value) {
                if (Str::endsWith($key, 'googleFont') && !empty($value)) {
                    $googleWebFonts[] = urlencode($value);
                }
            }
        }
        $googleWebFonts = array_unique($googleWebFonts);
        $googleWebFonts = implode('|', $googleWebFonts);

        if($isEditMode) {
            $cssFiles[] = "/engine/css/backend.min.css?{$this->version}";
            $cssFiles[] = "/engine/css/editor.css.php?{$cacheBoost}&{$this->version}";
            $cssFiles[] = "/_templates/". $siteSettings['template']['template']."/editor.css.php?{$cacheBoost}&{$this->version}";
        } else {
            $cssFiles[] = "/engine/css/frontend.min.css?{$this->version}";
        }

        $cssFiles[] = "/_templates/". $siteSettings['template']['template']."/style.css?{$this->version}";

        $queryParams = '';
        $queryParams .= !empty($siteSlug) ? "&site={$siteSlug}" : '';
        $queryParams .= $currentSectionType == 'portfolio' ? '&responsive=1' : '';
        $queryParams .= $isEditMode ? '&engine=1' : '';
        $queryParams .= $isPreviewMode ? '&preview=1' : '';
        $cssFiles[] = "/_templates/". $siteSettings['template']['template']."/style.css.php?{$cacheBoost}&{$this->version}{$queryParams}";

        if ($templateName == 'messy') {
            if ($isResponsive || $isAutoResponsive) {
                if ($isAutoResponsive) {
                    $inlineCSS .= '@media (max-width: 767px) {';
                }

                $entryPadding = !empty($currentSection['entryPadding']) ? $currentSection['entryPadding'] : $siteTemplatesConfig[$siteSettings['template']['template']]['sectionTypes']['default']['entryPadding'];
                $entryMaxWidth = !empty($currentSection['entryMaxWidth']) ? $currentSection['entryMaxWidth'] : '';
                $inlineCSS .= "
                    #pageEntries .xEntry {
                        padding: {$entryPadding};
                        ".
                        ($entryMaxWidth ? "max-width: {$entryMaxWidth}" : '')
                        ."
                    }
                ";
                if ($isAutoResponsive) {
                    $inlineCSS .= '}';
                }
            }

            if ($isShopAvailable) {
                $cssFiles[] = "/_plugin_shop/css/shop.css.php?{$cacheBoost}&{$this->version}" . ($siteSlug ? "&site={$siteSlug}" : '');
            }
        }

        return [
            'googleWebFonts' => $googleWebFonts,
            'cssFiles' => $cssFiles,
            'inlineCSS' => $inlineCSS,
            'customCSS' => $siteTemplateSettings['css']['customCSS']
        ];
    }

    public function getSentryScript($user)
    {
        $script = '';

        if (!$user->isBertaHosting()) {
            return $script;
        }

        $sentryScriptFile = config('app.old_berta_root') . '/../../includes/sentry_template.html';

        if (file_exists($sentryScriptFile)) {
            $script = file_get_contents($sentryScriptFile);
            $script = str_replace('RELEASE_VERSION', $this->version, $script);
        }
        return $script;
    }

    private function getScripts($siteSlug, $siteSettings, $currentSection, $templateName, $isShopAvailable, $isEditMode, $user)
    {
        $scriptFiles = [];

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

        if ($isEditMode) {
            $scriptFiles[] = "/engine/js/backend.min.js?{$this->version}";
            $scriptFiles[] = "/engine/js/ng-backend.min.js?{$this->version}";
        } else {
            $scriptFiles[] = "/engine/js/frontend.min.js?{$this->version}";
        }

        if ($templateName == 'messy') {
            // @todo check this case
            // { if ($berta.section.type == 'shopping_cart' &&  $berta.environment == 'engine') || $berta.section.type != 'shopping_cart'  }

            $scriptFiles[] = "/_templates/" . $siteSettings['template']['template'] . "/mess.js?{$this->version}";
            $scriptFiles[] = "/_templates/" . $siteSettings['template']['template'] . "/mooMasonry.js?{$this->version}";

            if ($isShopAvailable) {
                $scriptFiles[] = "/_plugin_shop/js/shop.js?{$this->version}";
            }
        } else {
            $scriptFiles[] = "/_templates/" . $siteSettings['template']['template'] . "/{$templateName}.js?{$this->version}";
        }

        return [
            'bertaGlobalOptions' => json_encode($bertaGlobalOptions),
            'sentryScript' => $this->getSentryScript($user),
            'scriptFiles' => $scriptFiles
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
        $siteTemplatesConfig,
        $user,
        $storageService,
        $isShopAvailable,
        $isPreviewMode,
        $isEditMode
    ) {
        $data = [];
        $currentSection = null;
        $currentSectionType = null;
        I18n::load_language($siteSettings['language']['language']);

        if (!empty($sections)) {
            $currentSectionOrder = array_search($sectionSlug, array_column($sections, 'name'));
            $currentSection = $sections[$currentSectionOrder];
            $currentSectionType = isset($currentSection['@attributes']['type']) ? $currentSection['@attributes']['type'] : null;
        }

        $templateName = explode('-', $siteSettings['template']['template'])[0];
        $isResponsiveTemplate = isset($siteTemplateSettings['pageLayout']['responsive']) && $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $isResponsive = $isResponsiveTemplate || (isset($currentSectionType) && $currentSectionType == 'portfolio' && $templateName == 'messy');
        $isAutoResponsive = !$isResponsive && isset($siteTemplateSettings['pageLayout']['autoResponsive']) && $siteTemplateSettings['pageLayout']['autoResponsive'] == 'yes';

        $data['title'] = $this->getTitle($siteSettings, $currentSection, $sectionTags, $tagSlug);
        $data['keywords'] = !empty($currentSection['seoKeywords']) ? $currentSection['seoKeywords'] : $siteSettings['texts']['metaKeywords'];
        $data['description'] = !empty($currentSection['seoDescription']) ? $currentSection['seoDescription'] : $siteSettings['texts']['metaDescription'];
        $data['author'] = $siteSettings['texts']['ownerName'];
        $data['noindex'] = !isset($currentSection['@attributes']['published']) || $currentSection['@attributes']['published'] == '0' || $user->noindex;
        $data['favicon'] = $this->getFavicon($siteSettings, $storageService);
        $data['styles'] = $this->getStyles($siteSlug, $siteSettings, $currentSection, $siteTemplateSettings, $siteTemplatesConfig, $templateName, $currentSectionType, $isShopAvailable, $isResponsive, $isAutoResponsive, $isPreviewMode, $isEditMode);
        $data['scripts'] = $this->getScripts($siteSlug, $siteSettings, $currentSection, $templateName, $isShopAvailable, $isEditMode, $user);
        $data['isResponsive'] = $isResponsive;
        $data['isAutoResponsive'] = $isAutoResponsive;

        if (in_array('custom_javascript', $user->features)) {
            $data['googleSiteVerificationTag'] = $siteSettings['settings']['googleSiteVerification'];
        }

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
        $siteTemplatesConfig,
        $user,
        $storageService,
        $isShopAvailable,
        $isPreviewMode,
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
            $siteTemplatesConfig,
            $user,
            $storageService,
            $isShopAvailable,
            $isPreviewMode,
            $isEditMode
        );


        // dd(config('view'));

        return view('Sites/Sections/sectionHead', $data);
        // return view('hello', $data);
    }
}
