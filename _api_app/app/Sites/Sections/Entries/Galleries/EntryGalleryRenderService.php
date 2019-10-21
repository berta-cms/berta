<?php

namespace App\Sites\Sections\Entries\Galleries;

use App\Shared\Helpers;
use App\Shared\ImageHelpers;

abstract class EntryGalleryRenderService
{
    private $galleryType;

    public function __construct()
    {
        $this->galleryType = isset($this->entry['mediaCacheData']['@attributes']['type']) ? $this->entry['mediaCacheData']['@attributes']['type'] : $this->siteTemplateSettings['entryLayout']['defaultGalleryType'];
    }

    // Force Extending class to define this method
    abstract protected function render();

    public function getGalleryClassList()
    {
        $classes = ['xGalleryContainer'];

        if (!empty($this->getGalleryItemsData())) {
            $classes[] = 'xGalleryHasImages';
            $classes[] = 'xGalleryType-' . $this->galleryType;
        }

        return $classes;
    }

    public function getGalleryItemsData()
    {
        $items = [];
        if (isset($this->entry['mediaCacheData']['file'])) {
            $items = Helpers::asList($this->entry['mediaCacheData']['file']);
        }

        return $items;
    }

    public function getGalleryItems()
    {
        $items = [];

        foreach ($this->galleryItemsData as $item) {
            $items[] = ImageHelpers::getGalleryItem(
                $item,
                1,
                $this->entry,
                $this->storageService,
                $this->siteSettings
            );
        }

        return $items;
    }

    private function getNavigationItems()
    {
        $navigationItems = [];

        foreach ($this->galleryItemsData as $i => $item) {
            $navigationItem = array_merge($item, $this->galleryItems[$i]);
            $navigationItem['index'] = $i + 1;
            $navigationItem['autoPlay'] = isset($navigationItem['@attributes']['autoplay']) ? $navigationItem['@attributes']['autoplay'] : 0;

            if ($navigationItem['type'] == 'video') {
                $navigationItem['videoLink'] = $navigationItem['original'];
                $navigationItem['src'] = $navigationItem['poster'] ? $navigationItem['poster'] : '#';
            }

            if ($this->isEditMode) {
                $navigationItem['src'] .= '?no_cache=' . rand();
            }

            $navigationItems[] = $navigationItem;
        }

        return $navigationItems;
    }

    public function getViewData()
    {
        $data = [];
        $data['isEditMode'] = $this->isEditMode;
        $data['isFullscreen'] = !$this->isEditMode && isset($this->entry['mediaCacheData']['@attributes']['fullscreen']) && $this->entry['mediaCacheData']['@attributes']['fullscreen'] == 'yes';
        $data['galleryClassList'] = $this->getGalleryClassList();
        $data['rowGalleryPadding'] = !empty($this->entry['mediaCacheData']['@attributes']['row_gallery_padding']) ? $this->entry['mediaCacheData']['@attributes']['row_gallery_padding'] : false;
        $data['navigationItems'] = $this->getNavigationItems();

        return $data;
    }
}
