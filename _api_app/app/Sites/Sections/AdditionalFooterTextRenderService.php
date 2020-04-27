<?php

namespace App\Sites\Sections;

use App\Shared\Helpers;

class AdditionalFooterTextRenderService
{
    public $socialMediaLinksRS;
    private $USED_IN_TEMPLATES = ['messy', 'default'];
    private $EDITABLE_CLASSES = ['xEditableMCESimple', 'xProperty-additionalFooterText', 'xCaption-additional-footer-text'];

    public function __construct($socialMediaLinksRS)
    {
        $this->socialMediaLinksRS = $socialMediaLinksRS;
    }

    private function getAttributes($showAdditionalFooterText, $siteSlug, $isEditMode)
    {
        $attributes['id'] = 'additionalFooterText';
        $classes = ['clearfix'];

        if ($isEditMode && $showAdditionalFooterText) {
            $classes = array_merge($classes, $this->EDITABLE_CLASSES);
            $attributes['data-path'] = "{$siteSlug}/settings/siteTexts/additionalFooterText";
        }

        $attributes['class'] = implode(' ', $classes);

        return Helpers::arrayToHtmlAttributes($attributes);
    }

    private function getViewData($siteSlug, $siteSettings, $isEditMode)
    {
        $showSocialMediaButtons = $siteSettings['socialMediaButtons']['socialMediaLocation'] == 'footer' && !empty($siteSettings['socialMediaButtons']['socialMediaHTML']);
        $showSocialMediaLinks = $siteSettings['socialMediaLinks']['location'] == 'footer' && !empty($siteSettings['socialMediaLinks']['links']);
        $showAdditionalFooterText = false;

        if ($showSocialMediaButtons) {
            $content = $siteSettings['socialMediaButtons']['socialMediaHTML'];
        } elseif ($showSocialMediaLinks) {
            $content = $this->socialMediaLinksRS->render($siteSettings);
        } else {
            $content = !empty($siteSettings['siteTexts']['additionalFooterText']) ? $siteSettings['siteTexts']['additionalFooterText'] : '';
            $showAdditionalFooterText = true;
        }

        $attributes = $this->getAttributes($showAdditionalFooterText, $siteSlug, $isEditMode);

        return [
            'content' => $content,
            'attributes' => $attributes
        ];
    }

    public function render($siteSlug, $siteSettings, $isEditMode)
    {
        $templateName = explode('-', $siteSettings['template']['template'])[0];

        if (!in_array($templateName, $this->USED_IN_TEMPLATES)) {
            return '';
        }

        $data = $this->getViewData($siteSlug, $siteSettings, $isEditMode);

        return view('Sites/Sections/additionalFooterText', $data);
    }
}
