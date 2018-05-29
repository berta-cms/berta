<?php

namespace App\Sites\Sections\Entries;

use App\Shared\Helpers;
use App\Shared\ImageHelpers;

class SectionEntryRenderService
{
    private $entry;
    private $images;
    private $section;
    private $siteSettings;
    private $siteTemplateSettings;
    private $storageService;
    private $isEditMode;
    private $templateName;
    private $sectionType;
    private $galleryType;
    private $isShopAvailable;

    public function __construct($options)
    {
        $options = array_merge(
            [
                'entry' => null,
                'section' => null,
                'siteSettings' => null,
                'siteTemplateSettings' => null,
                'storageService' => null,
                'isEditMode' => false,
                'isShopAvailable' => false,
            ],
            $options
        );

        $this->entry = $options['entry'];
        $this->images = $this->getGalleryImages();
        $this->section = $options['section'];
        $this->siteSettings = $options['siteSettings'];
        $this->siteTemplateSettings = $options['siteTemplateSettings'];
        $this->storageService = $options['storageService'];
        $this->isEditMode = $options['isEditMode'];
        $this->templateName = explode('-', $this->siteSettings['template']['template'])[0];
        $this->sectionType = isset($this->section['@attributes']['type']) ? $this->section['@attributes']['type'] : null;
        $this->isShopAvailable = $options['isShopAvailable'] && $this->sectionType == 'shop';
        $this->galleryType = isset($this->entry['mediaCacheData']['@attributes']['type']) ? $this->entry['mediaCacheData']['@attributes']['type'] : $this->siteTemplateSettings['entryLayout']['defaultGalleryType'];
    }

    /**
     * Prepare data for view
     */
    private function getViewData()
    {
        $entry = $this->entry;
        //@TODO create a method to get shop settings default values, currently default values are hardcoded here
        $currency = isset($this->siteSettings['shop']['currency']) && !empty($this->siteSettings['shop']['currency']) ? $this->siteSettings['shop']['currency'] : 'EUR';
        $addToBasketLabel = isset($this->siteSettings['shop']['addToBasket']) && !empty($this->siteSettings['shop']['addToBasket']) ? $this->siteSettings['shop']['addToBasket'] : 'add to basket';
        $addedToBasketText = isset($this->siteSettings['shop']['addedToBasket']) && !empty($this->siteSettings['shop']['addedToBasket']) ? $this->siteSettings['shop']['addedToBasket'] : 'added!';
        $outOfStockText = isset($this->siteSettings['shop']['outOfStock']) && !empty($this->siteSettings['shop']['outOfStock']) ? $this->siteSettings['shop']['outOfStock'] : 'Out of stock!';
        $galleryPosition = isset($this->siteTemplateSettings['entryLayout']['galleryPosition']) ? $this->siteTemplateSettings['entryLayout']['galleryPosition'] : null;

        $entry['entryId'] = $this->getEntryId();
        $entry['classList'] = $this->getClassList();
        $entry['styleList'] = $this->getStyleList();
        $entry['isEditMode'] = $this->isEditMode;
        $entry['templateName'] = $this->templateName;
        $entry['tagList'] = isset($entry['tags']['tag']) ? Helpers::createEntryTagList($entry['tags']['tag']) : '';
        $entry['entryMarked'] = isset($entry['marked']) && $entry['marked'] ? 1 : 0;
        $entry['entryFixed'] = isset($entry['content']['fixed']) && $entry['content']['fixed'] ? 1 : 0;
        $entry['entryWidth'] = isset($entry['content']['width']) ? $entry['content']['width'] : '';
        $entry['isShopAvailable'] = $this->isShopAvailable;
        $entry['entryHTMLTag'] = $this->templateName == 'messy' ? 'div' : 'li';
        $entry['galleryType'] = $this->galleryType;
        $entry['showCartTitle'] = $this->isShopAvailable && $this->sectionType == 'shop' && ($this->isEditMode || (isset($entry['content']['cartTitle']) && !empty($entry['content']['cartTitle'])));
        $entry['showTitle'] = ($this->sectionType == 'portfolio' || $this->templateName == 'default') && ($this->isEditMode || (isset($entry['content']['title']) && !empty($entry['content']['title'])));
        $entry['showDescription'] = $this->isEditMode || (isset($entry['content']['description']) && !empty($entry['content']['description']));
        $entry['showAddToCart'] = $this->isShopAvailable && $this->sectionType == 'shop';
        $entry['cartPriceFormatted'] = isset($entry['content']['cartPrice']) ? Helpers::formatPrice($entry['content']['cartPrice'], $currency) : '';
        $entry['cartAttributes'] = isset($entry['content']['cartAttributes']) ? Helpers::toCartAttributes($entry['content']['cartAttributes']) : '';
        $entry['addToBasketLabel'] = $addToBasketLabel;
        $entry['addedToBasketText'] = $addedToBasketText;
        $entry['outOfStockText'] = $outOfStockText;
        $entry['showUrl'] = $this->templateName == 'default' && ($this->isEditMode || (isset($entry['content']['url']) && !empty($entry['content']['url'])));

        $entry['galleryPosition'] = $galleryPosition ? $galleryPosition : ($this->sectionType == 'portfolio' ? 'below description' : 'above title');
        $entry['galleryImages'] = $this->images;
        $entry['galleryFirstImage'] = $this->getGalleryFirstImage();
        $entry['galleryNavigation'] = $this->getGalleryNavigation();
        $entry['galleryClassList'] = $this->getGalleryClassList();
        $entry['rowGalleryPadding'] = isset($entry['mediaCacheData']['@attributes']['row_gallery_padding']) && !empty($entry['mediaCacheData']['@attributes']['row_gallery_padding']) ? $entry['mediaCacheData']['@attributes']['row_gallery_padding'] : null;

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

    // @TODO Move gallery related code to helpers and/or own render class
    private function getGalleryImages()
    {
        $images = [];
        if (isset($this->entry['mediaCacheData']['file'])) {
            $images = Helpers::asList($this->entry['mediaCacheData']['file']);
        }

        return $images;
    }

    private function getGalleryFirstImage()
    {
        if (!$this->images) {
            return null;
        }

        $image = ImageHelpers::getGalleryImage([
            'image' => current($this->images),
            'sizeRatio' => 1,
            'entry' => $this->entry,
            'storageService' => $this->storageService,
            'siteSettings' => $this->siteSettings,
        ]);

        return $image;
    }

    private function getGalleryNavigation()
    {
        $images = $this->images;
        $navigationImages = [];

        if (!$images) {
            return null;
        }

        $imagePath = $this->storageService->MEDIA_ROOT . '/' . $this->entry['mediafolder'] . '/';
        $imageUrlPath = $this->storageService->MEDIA_URL . '/' . $this->entry['mediafolder'] . '/';

        foreach ($images as $i => $image) {
            $navigationImage = ImageHelpers::getGalleryImage([
                'image' => $image,
                'sizeRatio' => 1,
                'entry' => $this->entry,
                'storageService' => $this->storageService,
                'siteSettings' => $this->siteSettings,
            ]);

            $navigationImage = array_merge($image, $navigationImage ? $navigationImage : []);

            $navigationImage['index'] = $i + 1;

            $navigationImage['type'] = $navigationImage['@attributes']['type'];

            if ($navigationImage['type'] == 'video') {
                $navigationImage['src'] = '#';
                $navigationImage['videoLink'] = $imageUrlPath . $navigationImage['@attributes']['src'];

                //default image size (video without poster)
                if (!isset($navigationImage['width'])) {
                    $width = 300;
                    $height = 150;
                    $imageSize = isset($this->entry['mediaCacheData']['@attributes']['size']) ? $this->entry['mediaCacheData']['@attributes']['size'] : 'large';
                    $imageTargetWidth = $this->siteSettings['media']['images' . ucfirst($imageSize) . 'Width'];
                    $imageTargetHeight = $this->siteSettings['media']['images' . ucfirst($imageSize) . 'Height'];
                    list($width, $height) = ImageHelpers::fitInBounds($width, $height, $imageTargetWidth, $imageTargetHeight);
                    $navigationImage['width'] = $width;
                    $navigationImage['height'] = $height;
                }
                if (isset($navigationImage['@attributes']['poster_frame'])) {
                    $navigationImage['origLink'] = $imageUrlPath . $navigationImage['@attributes']['poster_frame'];
                }

                // type = Image
            } else {
                $navigationImage['origLink'] = file_exists($imagePath . '_orig_' . $navigationImage['@attributes']['src']) ? $imageUrlPath . '_orig_' . $navigationImage['@attributes']['src'] : $imageUrlPath . $navigationImage['@attributes']['src'];
            }

            if ($this->isEditMode) {
                $navigationImage['src'] .= '?no_cache=' . rand();
            }

            $navigationImage['autoPlay'] = isset($navigationImage['@attributes']['autoplay']) ? $navigationImage['@attributes']['autoplay'] : 0;

            $navigationImages[] = $navigationImage;
        }

        return [
            'showNavigation' => count($images) > 1 && $this->galleryType == 'slideshow',
            'images' => $navigationImages,
            'showFullScreen' => !$this->isEditMode && isset($this->entry['mediaCacheData']['@attributes']['fullscreen']) && $this->entry['mediaCacheData']['@attributes']['fullscreen'] == 'yes',
        ];
    }

    public function getGalleryClassList()
    {
        $entry = $this->entry;
        $classes = ['xGalleryContainer'];
        $galleryType = $this->galleryType;
        $galleryLinkAddress = isset($entry['mediaCacheData']['@attributes']['link_address']) ? $entry['mediaCacheData']['@attributes']['link_address'] : '';
        $galleryLinkTarget = isset($entry['mediaCacheData']['@attributes']['linkTarget']) ? $entry['mediaCacheData']['@attributes']['linkTarget'] : '';

        if ($this->images) {
            $classes[] = 'xGalleryHasImages';
            $classes[] = 'xGalleryType-' . $galleryType;

            if ($galleryType == 'link') {
                $classes[] = 'xGalleryLinkAddress-' . $galleryLinkAddress;
                $classes[] = 'xGalleryLinkTarget-' . $galleryLinkTarget;
            }
        }

        return implode(' ', $classes);
    }

    public function render($tag = null)
    {
        $data = $this->getViewData();

        return view('Sites/Sections/Entries/entry', $data);
    }
}
