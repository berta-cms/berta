<?php

namespace App\Sites\Sections;

class SectionFooterRenderService
{
    private function getIntercomSettings($sections, $user, $isEditMode)
    {
        if (!$isEditMode || !$user->intercom || empty($sections)) {
            return;
        }

        return [
            'appId' => $user->intercom['appId'],
            'userName' => $user->name,
            'userHash' => $user->intercom['userHash'],
        ];
    }

    private function getViewData($siteSettings, $sections, $user, $request, $isEditMode)
    {
        $data = [
            'photoswipeTheme' => $siteSettings['entryLayout']['galleryFullScreenBackground'],
            'photoswipeCaptionAlign' => $siteSettings['entryLayout']['galleryFullScreenCaptionAlign'],
            'intercom' => $this->getIntercomSettings($sections, $user, $isEditMode),
            'hostName' => $request->getHost(),
            'isEditMode' => $isEditMode,
        ];

        if (in_array('custom_javascript', $user->features)) {
            $data = array_merge($data, [
                'customUserJs' => $siteSettings['settings']['jsInclude'],
                'customSocialMediaButtonsJs' => $siteSettings['socialMediaButtons']['socialMediaJS'],
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
