<?php

namespace App\Sites\Sections\Entries;

use App\Shared\Helpers;

class PortfolioThumbnailsRenderService
{
    private function getViewData($entries, $isEditMode)
    {
        $entries = array_map(function ($entry) use ($isEditMode) {
            $title = !empty($entry['content']['title']) ? $entry['content']['title'] : 'entry-' . $entry['id'];
            $entry['caption'] = !empty($entry['content']['title']) ? $entry['content']['title'] : ($isEditMode ? $title : null);
            $entry['slug'] = Helpers::slugify($title, '-', '-');
            return $entry;
        }, $entries);

        return [
            'entries' => $entries,
            'isEditMode' => $isEditMode
        ];
    }

    public function render($section, $entries, $isEditMode)
    {
        if (empty($section['@attributes']['type']) || $section['@attributes']['type'] !== 'portfolio' || empty($entries)) {
            return '';
        }

        $data = $this->getViewData($entries, $isEditMode);

        return view('Sites/Sections/Entries/portfolioThumbnails', $data);
    }
}
