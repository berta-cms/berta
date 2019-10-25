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
    private function getViewData()
    {
        $entry = $this->entry;

        $galleryPosition = isset($this->siteTemplateSettings['entryLayout']['galleryPosition']) ? $this->siteTemplateSettings['entryLayout']['galleryPosition'] : null;
        $isResponsiveTemplate = isset($this->siteTemplateSettings['pageLayout']['responsive']) && $this->siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $isResponsive = $this->sectionType == 'portfolio' || $isResponsiveTemplate;

        $entry['entryId'] = $this->getEntryId();
        $entry['classList'] = $this->getClassList();
        $entry['styleList'] = $this->getStyleList();
        $entry['isResponsive'] = $isResponsive;
        $entry['apiPath'] = $this->site . '/entry/' . $this->section['name'] . '/' . $entry['id'] . '/';
        $entry['isEditMode'] = $this->isEditMode;
        $entry['templateName'] = $this->templateName;
        $entry['tagList'] = isset($entry['tags']['tag']) ? Helpers::createEntryTagList($entry['tags']['tag']) : '';
        $entry['entryMarked'] = isset($entry['marked']) && $entry['marked'] ? 1 : 0;
        $entry['entryFixed'] = isset($entry['content']['fixed']) && $entry['content']['fixed'] ? 1 : 0;
        $entry['entryWidth'] = isset($entry['content']['width']) ? $entry['content']['width'] : '';
        $entry['isShopAvailable'] = $this->isShopAvailable;
        $entry['entryHTMLTag'] = $this->templateName == 'messy' ? 'div' : 'li';
        $entry['showCartTitle'] = $this->isShopAvailable && $this->sectionType == 'shop' && ($this->isEditMode || (isset($entry['content']['cartTitle']) && !empty($entry['content']['cartTitle'])));
        $entry['showTitle'] = ($this->sectionType == 'portfolio' || $this->templateName == 'default') && ($this->isEditMode || (isset($entry['content']['title']) && !empty($entry['content']['title'])));
        $entry['showDescription'] = $this->isEditMode || (isset($entry['content']['description']) && !empty($entry['content']['description']));
        $entry['showAddToCart'] = $this->isShopAvailable && $this->sectionType == 'shop';
        $entry['cartAttributes'] = isset($entry['content']['cartAttributes']) ? Helpers::toCartAttributes($entry['content']['cartAttributes']) : '';
        $entry['entryWeight'] = isset($entry['content']['weight']) ? $entry['content']['weight'] : '';
        $entry['showUrl'] = $this->templateName == 'default' && ($this->isEditMode || (isset($entry['content']['url']) && !empty($entry['content']['url'])));

        if ($this->isShopAvailable) {
            $shopSettingsDS = new ShopSettingsDataService($this->site);
            $shopSettings = $shopSettingsDS->get()['group_config'];

            $entry['cartPriceFormatted'] = isset($entry['content']['cartPrice']) ? Helpers::formatPrice($entry['content']['cartPrice'], $shopSettings['currency']) : '';
            $entry['weightUnits'] = $shopSettings['weightUnit'];
            $entry['addToBasketLabel'] = $shopSettings['addToBasket'];
            $entry['addedToBasketText'] = $shopSettings['addedToBasket'];
            $entry['outOfStockText'] = $shopSettings['outOfStock'];
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

        $entry['gallery'] = $galleryTypeRenderService->render();
        $entry['galleryType'] = $this->galleryType;
        $entry['galleryPosition'] = $galleryPosition ? $galleryPosition : ($this->sectionType == 'portfolio' ? 'below description' : 'above title');

        return $entry;
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
