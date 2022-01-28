<?php

namespace App\Sites;

use App\Sites\SocialMediaLink;

class SocialMediaLinksRenderService
{
    public static function getSocialMediaIcons()
    {
        $icons = [];
        $dir = config('app.old_berta_root') . '/_templates/_includes/icons';

        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {

            $name = pathinfo($file)['filename'];
            $icons[$name] = self::getSocialMediaIcon($name);
        }

        return $icons;
    }

    private static function getSocialMediaIcon($name)
    {
        return file_get_contents(realpath(config('app.old_berta_root') . '/_templates/_includes/icons/' . $name . '.svg'));
    }

    private function getViewData($siteSettings)
    {
        $data = [];

        if (!empty($siteSettings['socialMediaLinks']['links'])) {
            $data['socialMediaLinks'] = array_map(function ($link) {
                $linkModel = new SocialMediaLink($link);
                $linkModel->icon = self::getSocialMediaIcon($linkModel->icon);
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
