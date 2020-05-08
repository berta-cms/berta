<?php
use App\Shared\Storage;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\Sections\Entries\SectionEntryRenderService;
use App\Sites\Sections\Entries\Galleries\EntryGalleryEditorRenderService;

define('AUTH_AUTHREQUIRED', true);
define('BERTA_ENVIRONMENT', 'engine');
include 'inc.page.php';
include_once '_classes/Zend/Json.php';
include_once '_classes/class.array_xml.php';
include_once '_classes/class.bertaeditor.php';

header('Content-Type: text/plain; charset=utf8');

$jsonRequest = !empty($_REQUEST['json']) ? stripslashes($_REQUEST['json']) : false;

if ($jsonRequest) {
    $decoded = $result = Zend_Json::decode(str_replace(["\n", "\r"], ['\n', ''], $jsonRequest));
    $site = !empty($_REQUEST['site']) ? $_REQUEST['site'] : '';
    $isMessyTemplate = strpos($berta->settings->get('template', 'template'), 'messy') === 0;

    $siteSettingsDS = new SiteSettingsDataService($site);
    $siteSettings = $siteSettingsDS->getState();
    $siteSectionsDS = new SiteSectionsDataService($site);
    $sections = $siteSectionsDS->getState();
    $section = $siteSectionsDS->get($decoded['section']);
    $storageService = new Storage($site);

    if ($decoded['entry']) {
        $sectionEntriesDS = new SectionEntriesDataService($site, $decoded['section']);
        $entries = $sectionEntriesDS->get();
        $entryIndex = array_search($decoded['entry'], array_column($entries['entry'], 'id'));
        $entry = $entries['entry'][$entryIndex];
    }

    switch ($decoded['property']) {
        case 'gallery':
            if ($decoded['section'] && $decoded['entry']) {
                $siteTemplateSettingsDS = new SiteTemplateSettingsDataService($site);
                $sectionEntriesRS = new SectionEntryRenderService();

                echo $sectionEntriesRS->getViewData(
                    $site,
                    $sections,
                    $entry,
                    $section,
                    $siteSettings,
                    $siteTemplateSettingsDS->getState(),
                    $storageService,
                    true,
                    isset($shopEnabled) && $shopEnabled
                )['gallery'];
            }

            break;

        case 'galleryEditor':
            if ($decoded['section'] && $decoded['entry']) {
                $entryGalleryEditorRS = new EntryGalleryEditorRenderService();

                echo $entryGalleryEditorRS->render(
                    $site,
                    $siteSettings,
                    $section,
                    $storageService,
                    $entry
                );
            }

            break;

        case 'bgEditor':
            if ($decoded['section']) {
                $site = empty(BertaEditor::$options['MULTISITE']) ? '0' : BertaEditor::$options['MULTISITE'];
                list($idx, $sections) = BertaEditor::getSections(true);
                $sections = BertaEditor::getSections();
                $section = $sections[$decoded['section']];
                $section_idx = $idx[$decoded['section']];
                $basePath = $site . '/section/' . $section_idx . '/';

                if (!empty($section['mediafolder']['value'])) {
                    $sectionMF = $section['mediafolder']['value'];
                } else {
                    $sectionMF = BertaEditor::getSectionMediafolder($section['name']['value']);
                }

                $autoPlay = !empty($section['mediaCacheData']['@attributes']['autoplay'])
                                        ? $section['mediaCacheData']['@attributes']['autoplay'] : '0';
                $bgSize = !empty($section['mediaCacheData']['@attributes']['image_size'])
                                        ? $section['mediaCacheData']['@attributes']['image_size'] : 'medium';
                $bgHideNavigation = !empty($section['mediaCacheData']['@attributes']['hide_navigation'])
                                        ? $section['mediaCacheData']['@attributes']['hide_navigation'] : 'no';
                $bgAnimation = !empty($section['mediaCacheData']['@attributes']['animation'])
                                        ? $section['mediaCacheData']['@attributes']['animation'] : 'enabled';
                $bgFading = !empty($section['mediaCacheData']['@attributes']['fade_content'])
                                        ? $section['mediaCacheData']['@attributes']['fade_content'] : 'disabled';
                $bgColor = !empty($section['sectionBgColor']['value'])
                                        ? $section['sectionBgColor']['value'] : '#ffffff';
                $bgColorText = !empty($section['sectionBgColor']['value'])
                                        ? $section['sectionBgColor']['value'] : 'none';
                $bgCaptionColor = !empty($section['mediaCacheData']['@attributes']['caption_color'])
                                        ? $section['mediaCacheData']['@attributes']['caption_color'] : '#ffffff';
                $bgCaptionColorText = !empty($section['mediaCacheData']['@attributes']['caption_color'])
                                        ? $section['mediaCacheData']['@attributes']['caption_color'] : 'none';
                $bgCaptionBackColorTmp = !empty($section['mediaCacheData']['@attributes']['caption_bg_color'])
                                            ? explode(',', $section['mediaCacheData']['@attributes']['caption_bg_color']) : explode(',', '255,255,255');
                $bgCaptionBackColor = '#';

                foreach ($bgCaptionBackColorTmp as $val) {
                    $bgCaptionBackColor .= dechex($val);
                }

                $bgCaptionBackColorTextTmp = !empty($section['mediaCacheData']['@attributes']['caption_bg_color']) ? explode(',', $section['mediaCacheData']['@attributes']['caption_bg_color']) : 'none';
                if ($bgCaptionBackColorTextTmp != 'none') {
                    $bgCaptionBackColorText = '#';
                    foreach ($bgCaptionBackColorTextTmp as $val) {
                        $bgCaptionBackColorText .= dechex($val);
                    }
                } else {
                    $bgCaptionBackColorText = 'none';
                }

                echo '<div id="xBgEditorPanel" class="xPanel">';
                echo '<div class="xBgEditorTabs">';
                echo '<div class="xBgMediaTab tab">',
                                '<a href="#" class="xParams-media selected" title="add images and videos"><span>media</span></a>',
                            '</div>';
                echo '<div class="xBgSettingsTab tab">',
                                '<a href="#" class="xParams-settings" title="background settings"><span>background settings</span></a>',
                            '</div>';
                echo '<div class="xBgSlideshowSettingsTab tab">',
                                '<a href="#" class="xParams-slideshow_settings" title="slideshow settings"><span>slideshow settings</span></a>',
                            '</div>';
                echo '<div class="xBgImgSizeSettingsTab tab">',
                                '<a href="#" class="xParams-image_size_settings" title="image size"><span>image size</span></a>',
                            '</div>';
                echo '<a class="xBgEditorCloseLink" href="#" title="close background editor"><span>X</span></a>';
                echo '</div>';

                echo '<div class="xBgAddMedia">';
                echo '<input type="file" name="Filedata" class="xHidden" multiple>';
                echo '<a class="xEntryAddImagesLink" href="/_api/v1/sites/sections/backgrounds" data-path="' . $basePath . '">+ add media</a>';
                echo '</div>';

                echo '<div class="xBgSettings xHidden">';
                echo '<div class="xBgNavigationSettings">',
                                '<div class="caption">hide navigation arrows</div>',
                                '<div class="xBgNavigation xFloatLeft xEditableSelectRC xCommand-SET_BG_NAVIGATION" x_options="no||yes" data-path="' . $basePath . 'mediaCacheData/@attributes/hide_navigation">' . $bgHideNavigation . '</div>',
                                '<div class="clear"></div>',
                            '</div>';
                echo '<div class="xBgAnimationSettings">',
                                '<div class="caption">animation</div>',
                                '<div class="xBgAnimation xEditableSelectRC xCommand-SET_BG_ANIMATION" x_options="enabled||disabled" data-path="' . $basePath . 'mediaCacheData/@attributes/animation">' . $bgAnimation . '</div>',
                                '<div class="clear"></div>',
                            '</div>';
                echo '<div class="xBgFadingSettings">',
                                '<div class="caption">fade content</div>',
                                '<div class="xBgFading xEditableSelectRC xCommand-SET_BG_FADE_CONTENT" x_options="enabled||disabled" data-path="' . $basePath . 'mediaCacheData/@attributes/fade_content">' . $bgFading . '</div>',
                                '<div class="clear"></div>',
                            '</div>';
                echo '<div class="xBgColorSettings">',
                                '<div class="caption">background color</div>',
                                '<div class="xBgColor xEditableColor xProperty-sectionBgColor xNoHTMLEntities xCSSUnits-0 xRequired-1 " title="' . $bgColor . '" data-path="' . $basePath . 'sectionBgColor">' . $bgColorText . '</div>',
                                '<div class="xBgColorReset xReset xCommand-sectionBgColorReset xParams-sectionBgColor" data-path="' . $basePath . 'sectionBgColor"><a href="#"><span>remove</span></a></div>',
                                '<div class="clear"></div>',
                                '<div class="caption">caption text color</div>',
                                '<div class="xBgColor xEditableColor xCommand-SET_BG_CAPTION_COLOR xNoHTMLEntities xCSSUnits-0 xRequired-1 " title="' . $bgCaptionColor . '" data-path="' . $basePath . 'mediaCacheData/@attributes/caption_color">' . $bgCaptionColorText . '</div>',
                                '<div class="xBgColorReset xReset xCommand-RESET_BG_CAPTION_COLOR xParams-SET_BG_CAPTION_COLOR" data-path="' . $basePath . 'mediaCacheData/@attributes/caption_color"><a href="#"><span>remove</span></a></div>',
                                '<div class="clear"></div>',
                                '<div class="caption">caption background color</div>',
                                '<div class="xBgColor xEditableColor xCommand-SET_BG_CAPTION_BACK_COLOR xNoHTMLEntities xCSSUnits-0 xRequired-1 " title="' . $bgCaptionBackColor . '" data-path="' . $basePath . 'mediaCacheData/@attributes/caption_bg_color">' . $bgCaptionBackColorText . '</div>',
                                '<div class="xBgColorReset xReset xCommand-RESET_BG_CAPTION_BACK_COLOR xParams-SET_BG_CAPTION_BACK_COLOR" data-path="' . $basePath . 'mediaCacheData/@attributes/caption_bg_color"><a href="#"><span>remove</span></a></div>',
                                '<div class="clear"></div>',
                            '</div>';
                echo '</div>';

                echo '<div class="xBgImgSizeSettings xHidden">';
                echo '<div class="caption">background image size</div>',
                            '<div class="xBgImgSize xEditableSelectRC xCommand-SET_BG_IMG_SIZE" x_options="large||medium||small" data-path="' . $basePath . 'mediaCacheData/@attributes/image_size">' . $bgSize . '</div>',
                            '<div class="clear"></div>';
                echo '</div>';

                echo '<div class="xBgSlideshowSettings xHidden">';
                echo '<div class="caption">autoplay seconds</div>',
                            '<div class="xBgAutoPlay xEditableRC xCommand-SET_AUTOPLAY xCaption-0" title="' . $autoPlay . '" data-path="' . $basePath . 'mediaCacheData/@attributes/autoplay">' . $autoPlay . '</div>',
                            '<div class="clear"></div>';
                echo '</div>';

                echo '<div class="images"><ul>';
                if (!empty($section['mediaCacheData']['file']) && count($section['mediaCacheData']['file']) > 0) {
                    // if the xml tag is not a list tag, convert it.
                    Array_XML::makeListIfNotList($section['mediaCacheData']['file']);

                    // print out images
                    foreach ($section['mediaCacheData']['file'] as $idx => $im) {
                        if ((string) $idx == '@attributes') {
                            continue;
                        }
                        $imageThumbSrc = false;

                        $entryImageSrc = $section['mediafolder']['value'] . '/' . (string) $im['@attributes']['src'];
                        $imageThumbSrc = BertaEditor::images_getSmallThumbFor($entryImageSrc);

                        if ($imageThumbSrc) {
                            echo '<li class="image" filename="' . (string) $im['@attributes']['src'] . '" fileinfo="' . '' . '">';
                            echo '<img class="img" src="' . $imageThumbSrc . '" />';
                            echo '<span class="grabHandle xMAlign-container"><span class="xMAlign-outer"><a class="xMAlign-inner" title="click and drag to move"><span></span></a></span></span>';
                            echo '<a href="#" class="delete"></a>';
                            echo '<div class="xEGEImageCaption ' . $xEditSelectorMCESimple . ' xProperty-galleryImageCaption xCaption-image-caption xParam-' . $im['@attributes']['src'] . '" data-path="' . $basePath . 'mediaCacheData/file/' . $idx . '/@value">', !empty($im['value']) ? $im['value'] : '', '</div>';
                            echo '</li>';
                        }
                    }
                }
                echo "</ul></div>\n";
                echo '</div>';
            }
            break;
    }
}
