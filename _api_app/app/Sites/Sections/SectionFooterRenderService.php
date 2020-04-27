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
        return [
            'photoswipeTheme' => $siteSettings['entryLayout']['galleryFullScreenBackground'],
            'photoswipeCaptionAlign' => $siteSettings['entryLayout']['galleryFullScreenCaptionAlign'],
            'intercom' => $this->getIntercomSettings($sections, $user, $isEditMode),
            'customSocialMediaButtonsJs' => $siteSettings['socialMediaButtons']['socialMediaJS'],
            'customUserJs' => $siteSettings['settings']['jsInclude'],
            'googleAnalyticsId' => $siteSettings['settings']['googleAnalyticsId'],
            'hostName' => $request->getHost(),
            'isEditMode' => $isEditMode
        ];
    }

    public function render($siteSettings, $sections, $user, $request, $isEditMode)
    {
        $data = $this->getViewData($siteSettings, $sections, $user, $request, $isEditMode);

        return view('Sites/Sections/sectionFooter', $data);
    }
}
