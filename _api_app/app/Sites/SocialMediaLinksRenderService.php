<?php

namespace App\Sites;

use App\Sites\SocialMediaLink;

class SocialMediaLinksRenderService
{
    private function getViewData($siteSettings)
    {
        $data = [];

        if (!empty($siteSettings['socialMediaLinks']['links'])) {
            $data['socialMediaLinks'] = array_map(function ($link) {
                $linkModel = new SocialMediaLink($link);
                $linkModel->icon = file_get_contents(realpath(config('app.old_berta_root') . '/_templates/_includes/icons/' . $linkModel->icon  . '.svg' ));
                return $linkModel;
            }, $siteSettings['socialMediaLinks']['links']);
        }

        return $data;
    }

    public function render($siteSettings)
    {
        $data = $this->getViewData($siteSettings);

        if (!$data) {
            return '';
        }

        return view('Sites/socialMediaLinks', $data);
    }
}
