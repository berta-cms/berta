<?php

namespace App\Sites\Sections\Entries;

use App\Shared\Helpers;
use App\Shared\ImageHelpers;
use App\Shared\Storage;
use App\Sites\Sections\Entries\Galleries\GallerySlideshowRenderService;
use App\Sites\Sections\Entries\Galleries\GalleryRowRenderService;
use App\Sites\Sections\Entries\Galleries\GalleryColumnRenderService;
use App\Sites\Sections\Entries\Galleries\GalleryPileRenderService;
use App\Sites\Sections\Entries\Galleries\GalleryLinkRenderService;
use App\Plugins\Shop\ShopSettingsDataService;

class SectionEntryRenderService
{
    public function __construct()
    {
        $this->gallerySlideshowRenderService = new GallerySlideshowRenderService();
        $this->galleryRowRenderService = new GalleryRowRenderService();
        $this->galleryColumnRenderService = new GalleryColumnRenderService();
        $this->galleryPileRenderService = new GalleryPileRenderService();
        $this->galleryLinkRenderService = new GalleryLinkRenderService();
    }

    /**
     * Prepare data for view
     */
    public function getViewData(
        $site,
        $sections,
        $entry,
        $section,
        $siteSettings,
        $siteTemplateSettings,
        $storageService,
        $isEditMode,
        $isShopAvailable
    )
    {
        $sectionType = isset($section['@attributes']['type']) ? $section['@attributes']['type'] : null;
        $isShopAvailable = $isShopAvailable && $sectionType == 'shop';
        $galleryType = isset($entry['mediaCacheData']['@attributes']['type']) ? $entry['mediaCacheData']['@attributes']['type'] : $siteTemplateSettings['entryLayout']['defaultGalleryType'];
        $templateName = explode('-', $siteSettings['template']['template'])[0];
        $apiPath = $site . '/entry/' . $section['name'] . '/' . $entry['id'] . '/';
        $isResponsiveTemplate = isset($siteTemplateSettings['pageLayout']['responsive']) && $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $isResponsive = $sectionType == 'portfolio' || $isResponsiveTemplate;

        if (($sectionType == 'portfolio' || $templateName == 'default') && ($isEditMode || (isset($entry['content']['title']) && !empty($entry['content']['title'])))) {
            $entryTitle = view('Sites/Sections/Entries/_entryTitle', array_merge($entry, [
                'attributes' => [
                    'title' => Helpers::arrayToHtmlAttributes([
                        'data-path' => $isEditMode ? "{$apiPath}content/title" : null
                    ])
                ]
            ]));
        }

        switch ($galleryType) {
            case 'row':
                $galleryTypeRenderService = $this->galleryRowRenderService;
                break;

            case 'column':
                $galleryTypeRenderService = $this->galleryColumnRenderService;
                break;

            case 'pile':
                $galleryTypeRenderService = $this->galleryPileRenderService;
                break;

            case 'link':
                $galleryTypeRenderService = $this->galleryLinkRenderService;
                break;

            default:
                // slideshow
                $galleryTypeRenderService = $this->gallerySlideshowRenderService;
                break;
        }

        $gallery = $galleryTypeRenderService->render(
            $entry,
            $siteSettings,
            $siteTemplateSettings,
            $storageService,
            $isEditMode,
            true,
            false
        );

        // Shop plugin related data
        // TODO move the logic to plugin code
        if ($isShopAvailable) {
            if ($isEditMode || (isset($entry['content']['cartTitle']) && !empty($entry['content']['cartTitle']))) {
                $entryTitle = view('Sites/Sections/Entries/shop/_cartTitle', array_merge($entry, [
                    'attributes' => [
                        'cartTitle' => Helpers::arrayToHtmlAttributes([
                            'data-path' => $isEditMode ? "{$apiPath}content/cartTitle" : null
                        ])
                    ]
                ]));
            }

            $shopSettingsDS = new ShopSettingsDataService($site);
            $shopSettings = $shopSettingsDS->get()['group_config'];

            $addToCart = view('Sites/Sections/Entries/shop/_addToCart', array_merge($entry, [
                'isEditMode' => $isEditMode,
                'attributes' => [
                    'cartPrice' => Helpers::arrayToHtmlAttributes([
                        'data-path' => $isEditMode ? "{$apiPath}content/cartPrice" : null
                    ])
                ],
                'cartPriceFormatted' => isset($entry['content']['cartPrice']) ? Helpers::formatPrice($entry['content']['cartPrice'], $shopSettings['currency']) : '',
                'cartAttributes' => isset($entry['content']['cartAttributes']) ? Helpers::toCartAttributes($entry['content']['cartAttributes']) : '',
                'addToBasketLabel' => $shopSettings['addToBasket'],
                'addedToBasketText' => $shopSettings['addedToBasket'],
                'outOfStockText' => $shopSettings['outOfStock']
            ]));

            $productAttributesEditor = view('Sites/Sections/Entries/shop/_productAttributesEditor', [
                'apiPath' => $apiPath,
                'cartAttributesEdit' => isset($entry['content']['cartAttributes']) ? $entry['content']['cartAttributes'] : '',
                'weightUnits' => $shopSettings['weightUnit'],
                'entryWeight' => isset($entry['content']['weight']) ? $entry['content']['weight'] : ''
            ]);
        }
        // End shop plugin related data

        $galleryPosition = isset($siteTemplateSettings['entryLayout']['galleryPosition']) ? $siteTemplateSettings['entryLayout']['galleryPosition'] : null;
        $entryContents = view('Sites/Sections/Entries/_entryContents', array_merge($entry, [
            'galleryPosition' => $galleryPosition ? $galleryPosition : ($sectionType == 'portfolio' ? 'after text wrap' : 'above title'),
            'gallery' => $gallery,
            'templateName' => $templateName,
            'galleryType' => $galleryType,
            'entryTitle' => isset($entryTitle) ? $entryTitle : '',
            'showDescription' => $isEditMode || (isset($entry['content']['description']) && !empty($entry['content']['description'])),
            'attributes' => [
                'description' => Helpers::arrayToHtmlAttributes([
                    'data-path' => $isEditMode ? "{$apiPath}content/description" : null
                ]),
                'url' => Helpers::arrayToHtmlAttributes([
                    'data-path' => $isEditMode ? "{$apiPath}content/url" : null
                ])
            ],
            'showUrl' => $templateName == 'default' && ($isEditMode || (isset($entry['content']['url']) && !empty($entry['content']['url']))),
            'isEditMode' => $isEditMode,
            'addToCart' => isset($addToCart) ? $addToCart : ''
        ]));

        if ($isEditMode) {
            // Sections list for moving entry to other section
            // Exclude current section, external link and shopping cart
            $sections = array_filter($sections, function ($s) use ($section) {
                $isCurrentSection = $s['name'] === $section['name'];
                $validSectionType = empty($s['@attributes']['type']) ? true : !in_array($s['@attributes']['type'], ['external_link', 'shopping_cart']);
                return !$isCurrentSection && $validSectionType;
            });

            $entryContents = view('Sites/Sections/Entries/_entryEditor', [
                'sections' => $sections,
                'templateName' => $templateName,
                'tagList' => isset($entry['tags']['tag']) ? Helpers::createEntryTagList($entry['tags']['tag']) : '',
                'apiPath' => $apiPath,
                'entryFixed' => isset($entry['content']['fixed']) && $entry['content']['fixed'] ? 1 : 0,
                'entryWidth' => isset($entry['content']['width']) ? $entry['content']['width'] : '',
                'entryMarked' => isset($entry['marked']) && $entry['marked'] ? 1 : 0,
                'productAttributesEditor' => isset($productAttributesEditor) ? $productAttributesEditor : '',
                'entryContents' => $entryContents,
            ]);
        }

        return [
            'entryHTMLTag' => $templateName == 'messy' ? 'div' : 'li',
            'entryId' => $this->getEntryId($entry, $sectionType),
            'attributes' => [
                'entry' => Helpers::arrayToHtmlAttributes([
                    'class' => $this->getClassList($entry, $section, $siteTemplateSettings, $templateName, $sectionType),
                    'style' => $this->getStyleList($entry, $siteSettings, $siteTemplateSettings, $templateName, $sectionType),
                    'data-path' => $isEditMode && $templateName == 'messy' && !$isResponsive ? "{$apiPath}content/positionXY" : null
                ])
            ],
            'entryContents' => $entryContents,
            // 'gallery' variable is used in elements.php
            // TODO possibly we can create a new endpoint in API and replace old elements.php endpoint
            'gallery' => $gallery,
        ];
    }

    private function getEntryId($entry, $sectionType)
    {
        if ($sectionType == 'portfolio' && isset($entry['content']['title']) && $entry['content']['title']) {
            $title = $entry['content']['title'];
        } else {
            $title = 'entry-' . $entry['id'];
        }
        $slug = Helpers::slugify($title, '-', '-');

        return $slug;
    }

    private function getClassList($entry, $section, $siteTemplateSettings, $templateName, $sectionType)
    {
        $classes = ['entry', 'xEntry', 'clearfix'];

        $classes[] = 'xEntryId-' . $entry['id'];
        $classes[] = 'xSection-' . $section['name'];

        $isResponsive = isset($siteTemplateSettings['pageLayout']['responsive']) ? $siteTemplateSettings['pageLayout']['responsive'] : 'no';

        if ($templateName == 'messy') {
            $classes[] = 'xShopMessyEntry';

            if ($sectionType == 'portfolio') {
                $isResponsive = 'yes';
            }

            if ($isResponsive == 'no') {
                $classes = array_merge($classes, ['mess', 'xEditableDragXY', 'xProperty-positionXY']);
            }
        }

        if (isset($entry['content']['fixed']) && $entry['content']['fixed']) {
            $classes[] = 'xFixed';
        }

        if ($sectionType == 'portfolio') {
            $classes[] = 'xHidden';
        }

        return implode(' ', $classes);
    }

    private function getStyleList($entry, $siteSettings, $siteTemplateSettings, $templateName, $sectionType)
    {
        $styles = [];
        $isResponsive = isset($siteTemplateSettings['pageLayout']['responsive']) ? $siteTemplateSettings['pageLayout']['responsive'] : 'no';

        if ($templateName == 'messy') {
            if ($sectionType == 'portfolio') {
                $isResponsive = 'yes';
            }

            if ($isResponsive == 'yes') {
                return null;
            }

            if (isset($entry['content']['positionXY'])) {
                list($left, $top) = explode(',', $entry['content']['positionXY']);
            } else {
                // new (non updated) entries are placed in top right corder
                $placeInFullScreen = isset($entry['updated']);
                list($left, $top) = [
                    rand($placeInFullScreen ? 0 : 900, 960),
                    rand($placeInFullScreen ? 0 : 30, $placeInFullScreen ? 600 : 200),
                ];
            }

            $styles[] = ['left' => $left . 'px'];
            $styles[] = ['top' => $top . 'px'];

            if (isset($entry['content']['width']) && $entry['content']['width']) {
                $styles[] = ['width' => $entry['content']['width']];
            } elseif ($sectionType == 'shop' && isset($siteSettings['shop']['entryWidth'])) {
                $width = intval($siteSettings['shop']['entryWidth']);

                if ($width > 0) {
                    $styles[] = ['width' => $width . 'px'];
                }
            }

            if (!empty($styles)) {
                $styles = array_map(function ($style) {
                    $key = key($style);
                    return $key . ': ' . ($style[$key]);
                }, $styles);

                return implode(';', $styles);
            }
        }

        return null;
    }

    public function render(
        $site,
        $sections,
        $entry,
        $section,
        $siteSettings,
        $siteTemplateSettings,
        $storageService,
        $isEditMode,
        $isShopAvailable
    ) {
        $data = $this->getViewData(
            $site,
            $sections,
            $entry,
            $section,
            $siteSettings,
            $siteTemplateSettings,
            $storageService,
            $isEditMode,
            $isShopAvailable
        );

        return view('Sites/Sections/Entries/entry', $data);
    }
}
