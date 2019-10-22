<?php

namespace App\Sites\Sections\Entries\Galleries;

use App\Shared\Storage;

class GalleryLinkRenderService extends EntryGalleryRenderService
{
    public $entry;
    public $siteSettings;
    public $siteTemplateSettings;
    public $storageService;
    public $isEditMode;

    public $galleryItemsData;
    public $galleryItems;

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
    }

    public function getViewData()
    {
        $data = parent::getViewData();
        $data['galleryClassList'] = $this->getGalleryClassList();
        $data['galleryStyles'] = $this->getGalleryStyles();
        $data['items'] = $this->getLimitedGalleryItems();

        return $data;
    }

    public function getGalleryClassList()
    {
        $classes = parent::getGalleryClassList();
        $galleryLinkAddress = !empty($this->entry['mediaCacheData']['@attributes']['link_address']) ? $this->entry['mediaCacheData']['@attributes']['link_address'] : '';
        $galleryLinkTarget = !empty($this->entry['mediaCacheData']['@attributes']['linkTarget']) ? $this->entry['mediaCacheData']['@attributes']['linkTarget'] : '';
        $classes[] = 'xGalleryLinkAddress-' . $galleryLinkAddress;
        $classes[] = 'xGalleryLinkTarget-' . $galleryLinkTarget;

        return implode(' ', $classes);
    }

    private function getGalleryStyles()
    {
        $styles = [];

        if (!$this->galleryItems) {
            return '';
        }

        $item = current($this->galleryItems);
        $styles[] = "width: {$item['width']}px";
        // in case of video use video ratio to calculate height
        $height = $item['height'] ? $item['height'] : $item['width'] * .5625; // 16:9 ratio
        $styles[] = "height: {$height}px";

        return implode(';', $styles);
    }

    private function getLimitedGalleryItems()
    {
        // Return only one item, other items will be loaded in fronted
        return array_slice($this->galleryItems, 0, 1);
    }

    public function render()
    {
        if ($this->isEditMode && empty($this->galleryItemsData)) {
            return view('Sites/Sections/Entries/Galleries/editEmptyGallery');
        }

        $data = $this->getViewData();

        return view('Sites/Sections/Entries/Galleries/galleryLink', $data);
    }
}
