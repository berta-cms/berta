<?php

namespace App\Sites\Sections;

use App\Shared\Helpers;

class SectionFooterRenderService
{
    private function getIntercomSettings($sections, $user, $isEditMode)
    {
        if (!$isEditMode || empty($sections)) {
            return;
        }

        if (!$user->intercomAppId || !$user->intercomSecretKey) {
            return;
        }

        $userHash = hash_hmac('sha256', $user->name, $user->intercomSecretKey);

        return [
            'appId' => $user->intercomAppId,
            'userName' => $user->name,
            'userHash' => $userHash
        ];
    }

    private function getViewData($siteSettings, $sections, $user, $request, $isEditMode)
    {
        $data = [
            'photoswipeTheme' => $siteSettings['entryLayout']['galleryFullScreenBackground'],
            'photoswipeCaptionAlign' => $siteSettings['entryLayout']['galleryFullScreenCaptionAlign'],
            'intercom' => $this->getIntercomSettings($sections, $user, $isEditMode),
            'googleAnalyticsId' => $siteSettings['settings']['googleAnalyticsId'],
            'hostName' => $request->getHost(),
            'isEditMode' => $isEditMode
        ];

        if (in_array('custom_javascript', $user->features)) {
            $data = array_merge($data, [
                'customUserJs' => $siteSettings['settings']['jsInclude'],
                'customSocialMediaButtonsJs' => $siteSettings['socialMediaButtons']['socialMediaJS']
            ]);
        }

        return $data;
    }

    public function render($siteSettings, $sections, $user, $request, $isEditMode)
    {
        $data = $this->getViewData($siteSettings, $sections, $user, $request, $isEditMode);

        return view('Sites/Sections/sectionFooter', $data);
    }
}
