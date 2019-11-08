<?php

namespace App\Sites\Sections\Entries\Galleries;

use App\Shared\Storage;
use App\Sites\Sections\Entries\Galleries\GallerySlideshowRenderService;

class GalleryRowRenderService extends EntryGalleryRenderService
{
    public $entry;
    public $siteSettings;
    public $siteTemplateSettings;
    public $storageService;
    public $isEditMode;

    public $galleryItemsData;
    public $galleryItems;
    private $galleryItemsLimit;

    // @TODO get $spaceBetweenItems from template settings
    // currently we use 12px = 1em as this is a default value for messy template
    private $spaceBetweenItems = 12;

    public function __construct(
        array $entry,
        array $siteSettings,
        array $siteTemplateSettings,
        Storage $storageService,
        $isEditMode
    ) {
        $this->entry = $entry;
        $this->siteSettings = $siteSettings;
        $this->siteTemplateSettings = $siteTemplateSettings;
        $this->storageService = $storageService;
        $this->isEditMode = $isEditMode;

        parent::__construct();

        $this->galleryItemsData = $this->getGalleryItemsData($this->entry);
        $this->galleryItems = $this->generateGalleryItems($this->galleryItemsData);
        $this->galleryItemsLimit = $this->getGalleryItemsLimit();
    }

    public function getViewData()
    {
        $data = parent::getViewData();
        $data['galleryClassList'] = $this->getGalleryClassList();
        $data['galleryStyles'] = $this->getGalleryStyles();
        $data['items'] = $this->getLimitedGalleryItems();
        $data['loader'] = $this->getGalleryLoader();

        return $data;
    }

    public function getGalleryClassList()
    {
        $classes = parent::getGalleryClassList();

        if (count($this->galleryItemsData) == 1) {
            $classes[] = 'bt-gallery-has-one-item';
        }

        return implode(' ', $classes);
    }

    private function getGalleryStyles()
    {
        $styles = [];

        $galleryWidth = $this->getGalleryWidth();
        if ($galleryWidth) {
            $styles[] = "min-width: {$galleryWidth}px";
        }

        return implode(';', $styles);
    }

    private function getGalleryWidth($items = null)
    {
        $items = $items ? $items : $this->galleryItems;

        if (!$items) {
            return false;
        }

        $width = array_sum(array_column($items, 'width'));
        $width += $this->spaceBetweenItems * count($items);

        return $width;
    }

    private function getGalleryItemsLimit()
    {
        $imageSize = !empty($this->entry['mediaCacheData']['@attributes']['size']) ? $this->entry['mediaCacheData']['@attributes']['size'] : 'large';
        $limit = config('app.row_gallery_image_limit.' . $imageSize);

        return $limit;
    }

    private function getLimitedGalleryItems()
    {
        return array_slice($this->galleryItems, 0, $this->galleryItemsLimit);
    }

    private function getGalleryLoader()
    {
        if (count($this->galleryItems) <= $this->galleryItemsLimit) {
            return false;
        }

        // Calculate width of loader from remaining items total width
        $loaderWidth = $this->getGalleryWidth(array_slice($this->galleryItems, $this->galleryItemsLimit));

        $lastItem = $this->galleryItems[$this->galleryItemsLimit - 1];

        // in case of video use video ratio to calculate height
        $loaderHeight = $lastItem['height'] ? $lastItem['height'] : $lastItem['width'] * .5625; // 16:9 ratio

        return [
            'width' => $loaderWidth,
            'height' => $loaderHeight
        ];
    }

    public function render()
    {
        if ($this->isEditMode && empty($this->galleryItemsData)) {
            return view('Sites/Sections/Entries/Galleries/editEmptyGallery');
        }

        $data = $this->getViewData();
        $view = view('Sites/Sections/Entries/Galleries/galleryRow', $data);

        // Add a slideshow as a fallback for mobile devices when there is at least two slides
        if (!$this->isEditMode && count($this->galleryItemsData) > 1) {
            // Force entry to be as slideshow
            $this->entry['mediaCacheData']['@attributes']['type'] = 'slideshow';

            $gallerySlideshowRenderService = new GallerySlideshowRenderService(
                $this->entry,
                $this->siteSettings,
                $this->siteTemplateSettings,
                $this->storageService,
                $this->isEditMode,
                'row'
            );
            $view .= $gallerySlideshowRenderService->render();
        }

        return $view;
    }
}
