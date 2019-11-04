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
    private $site;
    private $entry;
    private $section;
    private $siteSettings;
    private $siteTemplateSettings;
    private $storageService;
    private $isEditMode;
    private $templateName;
    private $sectionType;
    private $galleryType;
    private $isShopAvailable;

    /**
     * Construct SectionEntryRenderService instance
     *
     * @param array $site Site name
     * @param array $entry Single entry
     * @param array $section Single section
     * @param array $siteSettings
     * @param array $siteTemplateSettings
     * @param Storage $storageService
     * @param bool $isEditMode
     * @param bool $isShopAvailable
     */
    public function __construct(
        $site,
        array $entry,
        array $section,
        array $siteSettings,
        array $siteTemplateSettings,
        Storage $storageService,
        $isEditMode,
        $isShopAvailable
    ) {
        $this->site = $site;
        $this->entry = $entry;
        $this->section = $section;
        $this->siteSettings = $siteSettings;
        $this->siteTemplateSettings = $siteTemplateSettings;
        $this->storageService = $storageService;
        $this->isEditMode = $isEditMode;
        $this->templateName = explode('-', $this->siteSettings['template']['template'])[0];
        $this->sectionType = isset($this->section['@attributes']['type']) ? $this->section['@attributes']['type'] : null;
        $this->isShopAvailable = $isShopAvailable && $this->sectionType == 'shop';
        $this->galleryType = isset($this->entry['mediaCacheData']['@attributes']['type']) ? $this->entry['mediaCacheData']['@attributes']['type'] : $this->siteTemplateSettings['entryLayout']['defaultGalleryType'];
    }

    /**
     * Prepare data for view
     */
    public function getViewData()
    {
        $entry = $this->entry;

        $apiPath = $this->site . '/entry/' . $this->section['name'] . '/' . $entry['id'] . '/';
        $isResponsiveTemplate = isset($this->siteTemplateSettings['pageLayout']['responsive']) && $this->siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $isResponsive = $this->sectionType == 'portfolio' || $isResponsiveTemplate;

        if (($this->sectionType == 'portfolio' || $this->templateName == 'default') && ($this->isEditMode || (isset($entry['content']['title']) && !empty($entry['content']['title'])))) {
            $entryTitle = view('Sites/Sections/Entries/_entryTitle', array_merge($entry, [
                'attributes' => [
                    'title' => Helpers::arrayToHtmlAttributes([
                        'data-path' => $this->isEditMode ? "{$apiPath}content/title" : null
                    ])
                ]
            ]));
        }

        switch ($this->galleryType) {
            case 'row':
                $galleryTypeRenderService = new GalleryRowRenderService(
                    $entry,
                    $this->siteSettings,
                    $this->siteTemplateSettings,
                    $this->storageService,
                    $this->isEditMode
                );
                break;

            case 'column':
                $galleryTypeRenderService = new GalleryColumnRenderService(
                    $entry,
                    $this->siteSettings,
                    $this->siteTemplateSettings,
                    $this->storageService,
                    $this->isEditMode
                );
                break;

            case 'pile':
                $galleryTypeRenderService = new GalleryPileRenderService(
                    $entry,
                    $this->siteSettings,
                    $this->siteTemplateSettings,
                    $this->storageService,
                    $this->isEditMode
                );
                break;

            case 'link':
                $galleryTypeRenderService = new GalleryLinkRenderService(
                    $entry,
                    $this->siteSettings,
                    $this->siteTemplateSettings,
                    $this->storageService,
                    $this->isEditMode
                );
                break;

            default:
                // slideshow
                $galleryTypeRenderService = new GallerySlideshowRenderService(
                    $entry,
                    $this->siteSettings,
                    $this->siteTemplateSettings,
                    $this->storageService,
                    $this->isEditMode
                );
                break;
        }

        $gallery = $galleryTypeRenderService->render();

        // Shop plugin related data
        // TODO move the logic to plugin code
        if ($this->isShopAvailable) {
            if ($this->isEditMode || (isset($entry['content']['cartTitle']) && !empty($entry['content']['cartTitle']))) {
                $entryTitle = view('Sites/Sections/Entries/shop/_cartTitle', array_merge($entry, [
                    'attributes' => [
                        'cartTitle' => Helpers::arrayToHtmlAttributes([
                            'data-path' => $this->isEditMode ? "{$apiPath}content/cartTitle" : null
                        ])
                    ]
                ]));
            }

            $shopSettingsDS = new ShopSettingsDataService($this->site);
            $shopSettings = $shopSettingsDS->get()['group_config'];

            $addToCart = view('Sites/Sections/Entries/shop/_addToCart', array_merge($entry, [
                'isEditMode' => $this->isEditMode,
                'attributes' => [
                    'cartPrice' => Helpers::arrayToHtmlAttributes([
                        'data-path' => $this->isEditMode ? "{$apiPath}content/cartPrice" : null
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

        $galleryPosition = isset($this->siteTemplateSettings['entryLayout']['galleryPosition']) ? $this->siteTemplateSettings['entryLayout']['galleryPosition'] : null;
        $entryContents = view('Sites/Sections/Entries/_entryContents', array_merge($entry, [
            'galleryPosition' => $galleryPosition ? $galleryPosition : ($this->sectionType == 'portfolio' ? 'after text wrap' : 'above title'),
            'gallery' => $gallery,
            'templateName' => $this->templateName,
            'galleryType' => $this->galleryType,
            'entryTitle' => isset($entryTitle) ? $entryTitle : '',
            'showDescription' => $this->isEditMode || (isset($entry['content']['description']) && !empty($entry['content']['description'])),
            'attributes' => [
                'description' => Helpers::arrayToHtmlAttributes([
                    'data-path' => $this->isEditMode ? "{$apiPath}content/description" : null
                ]),
                'url' => Helpers::arrayToHtmlAttributes([
                    'data-path' => $this->isEditMode ? "{$apiPath}content/url" : null
                ])
            ],
            'showUrl' => $this->templateName == 'default' && ($this->isEditMode || (isset($entry['content']['url']) && !empty($entry['content']['url']))),
            'isEditMode' => $this->isEditMode,
            'addToCart' => isset($addToCart) ? $addToCart : ''
        ]));

        if ($this->isEditMode) {
            $entryContents = view('Sites/Sections/Entries/_entryEditor', [
                'templateName' => $this->templateName,
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
            'entryHTMLTag' => $this->templateName == 'messy' ? 'div' : 'li',
            'entryId' => $this->getEntryId(),
            'attributes' => [
                'entry' => Helpers::arrayToHtmlAttributes([
                    'class' => $this->getClassList(),
                    'style' => $this->getStyleList(),
                    'data-path' => $this->isEditMode && $this->templateName == 'messy' && !$isResponsive ? "{$apiPath}content/positionXY" : null
                ])
            ],
            'entryContents' => $entryContents,
            // 'gallery' variable is used in elements.php
            // TODO possibly we can create a new endpoint in API and replace old elements.php endpoint
            'gallery' => $gallery,
        ];
    }

    private function getEntryId()
    {
        if ($this->sectionType == 'portfolio' && isset($this->entry['content']['title']) && $this->entry['content']['title']) {
            $title = $this->entry['content']['title'];
        } else {
            $title = 'entry-' . $this->entry['id'];
        }
        $slug = Helpers::slugify($title, '-', '-');

        return $slug;
    }

    private function getClassList()
    {
        $classes = ['entry', 'xEntry', 'clearfix'];

        $classes[] = 'xEntryId-' . $this->entry['id'];
        $classes[] = 'xSection-' . $this->section['name'];

        $isResponsive = isset($this->siteTemplateSettings['pageLayout']['responsive']) ? $this->siteTemplateSettings['pageLayout']['responsive'] : 'no';

        if ($this->templateName == 'messy') {
            $classes[] = 'xShopMessyEntry';

            if ($this->sectionType == 'portfolio') {
                $isResponsive = 'yes';
            }

            if ($isResponsive == 'no') {
                $classes = array_merge($classes, ['mess', 'xEditableDragXY', 'xProperty-positionXY']);
            }
        }

        if (isset($this->entry['content']['fixed']) && $this->entry['content']['fixed']) {
            $classes[] = 'xFixed';
        }

        if ($this->sectionType == 'portfolio') {
            $classes[] = 'xHidden';
        }

        return implode(' ', $classes);
    }

    private function getStyleList()
    {
        $styles = [];
        $isResponsive = isset($this->siteTemplateSettings['pageLayout']['responsive']) ? $this->siteTemplateSettings['pageLayout']['responsive'] : 'no';

        if ($this->templateName == 'messy') {
            if ($this->sectionType == 'portfolio') {
                $isResponsive = 'yes';
            }

            if ($isResponsive == 'yes') {
                return null;
            }

            if (isset($this->entry['content']['positionXY'])) {
                list($left, $top) = explode(',', $this->entry['content']['positionXY']);
            } else {
                // new (non updated) entries are placed in top right corder
                $placeInFullScreen = isset($this->entry['updated']);
                list($left, $top) = [
                    rand($placeInFullScreen ? 0 : 900, 960),
                    rand($placeInFullScreen ? 0 : 30, $placeInFullScreen ? 600 : 200),
                ];
            }

            $styles[] = ['left' => $left . 'px'];
            $styles[] = ['top' => $top . 'px'];

            if (isset($this->entry['content']['width']) && $this->entry['content']['width']) {
                $styles[] = ['width' => $this->entry['content']['width']];
            } elseif ($this->sectionType == 'shop' && isset($this->siteSettings['shop']['entryWidth'])) {
                $width = intval($this->siteSettings['shop']['entryWidth']);

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

    public function render($tag = null)
    {
        $data = $this->getViewData();

        return view('Sites/Sections/Entries/entry', $data);
    }
}
