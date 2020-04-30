<?php

namespace App\Sites\Sections\Entries;

use App\Shared\Helpers;
use App\Shared\ImageHelpers;

class PortfolioThumbnailsRenderService
{
    private function getFirstEntryImage($siteSettings, $storageService, $entry)
    {
        $image = null;

        if (empty($entry['mediaCacheData']['file'])) {
            return null;
        }

        foreach ($entry['mediaCacheData']['file'] as $file) {
            if ($file['@attributes']['type'] == 'image' || !empty($file['@attributes']['poster_frame'])) {
                $image = $file;
                break;
            }
        }

        if (!$image) {
            return null;
        }

        // Force use medium size for thumbnails
        $entry['mediaCacheData']['@attributes']['size'] = 'medium';

        $image = ImageHelpers::getGalleryItem($image, $entry, $storageService, $siteSettings);
        $attributes = Helpers::arrayToHtmlAttributes([
            'src' => $image['src'],
            'srcset' => $image['srcset']
        ]);

        return [
            'attributes' => $attributes
        ];
    }

    private function getViewData($siteSettings, $storageService, $entries, $isEditMode)
    {
        $entries = array_map(function ($entry) use ($siteSettings, $storageService, $isEditMode) {
            $title = !empty($entry['content']['title']) ? $entry['content']['title'] : 'entry-' . $entry['id'];
            $entry['caption'] = !empty($entry['content']['title']) ? $entry['content']['title'] : ($isEditMode ? $title : null);
            $entry['slug'] = Helpers::slugify($title, '-', '-');
            $entry['image'] = $this->getFirstEntryImage($siteSettings, $storageService, $entry);
            return $entry;
        }, $entries);

        return [
            'entries' => $entries,
            'isEditMode' => $isEditMode
        ];
    }

    public function render($siteSettings, $storageService, $section, $entries, $isEditMode)
    {
        if (empty($section['@attributes']['type']) || $section['@attributes']['type'] !== 'portfolio' || empty($entries)) {
            return '';
        }

        $data = $this->getViewData($siteSettings, $storageService, $entries, $isEditMode);

        return view('Sites/Sections/Entries/portfolioThumbnails', $data);
    }
}
