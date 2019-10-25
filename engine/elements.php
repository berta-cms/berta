<?php
use App\Shared\Storage;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\Sections\Entries\SectionEntryRenderService;

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

    switch ($decoded['property']) {
        case 'gallery':
            if ($decoded['section'] && $decoded['entry']) {
                $storageService = new Storage($site);
                $siteSettingsDS = new SiteSettingsDataService($site);
                $siteTemplateSettingsDS = new SiteTemplateSettingsDataService($site);
                $siteSectionsDS = new SiteSectionsDataService($site);
                $sectionData = $siteSectionsDS->get($decoded['section']);
                $sectionEntriesDS = new SectionEntriesDataService($site, $decoded['section']);
                $entries = $sectionEntriesDS->get();
                $entryIndex = array_search($decoded['entry'], array_column($entries['entry'], 'id'));
                $entry = $entries['entry'][$entryIndex];

                $sectionEntriesRS = new SectionEntryRenderService(
                    $site,
                    $entry,
                    $sectionData,
                    $siteSettingsDS->getState(),
                    $siteTemplateSettingsDS->getState(),
                    $storageService,
                    true,
                    isset($shopEnabled) && $shopEnabled
                );

                echo $sectionEntriesRS->getViewData()['gallery'];
            }

            break;

        case 'galleryEditor':
            if ($decoded['section'] && $decoded['entry']) {
                $blog = BertaEditor::loadBlog($decoded['section']);
                $entry = BertaEditor::getEntry($decoded['entry'], $blog);

                if ($entry) {
                    $site = empty(BertaEditor::$options['MULTISITE']) ? '0' : BertaEditor::$options['MULTISITE'];
                    $basePath = $site . '/entry/' . $decoded['section'] . '/' . $entry['id']['value'] . '/';

                    $galType = !empty($entry['mediaCacheData']['@attributes']['type'])
                                        ? $entry['mediaCacheData']['@attributes']['type'] : 'slideshow';
                    $imageSize = !empty($entry['mediaCacheData']['@attributes']['size'])
                                        ? $entry['mediaCacheData']['@attributes']['size'] : 'large';
                    $FullScreen = !empty($entry['mediaCacheData']['@attributes']['fullscreen'])
                                        ? $entry['mediaCacheData']['@attributes']['fullscreen']
                                        : $berta->settings->get('entryLayout', 'galleryFullScreenDefault');
                    $autoPlay = !empty($entry['mediaCacheData']['@attributes']['autoplay'])
                                            ? $entry['mediaCacheData']['@attributes']['autoplay'] : '0';
                    $numberVisibility = !empty($entry['mediaCacheData']['@attributes']['slide_numbers_visible'])
                                        ? $entry['mediaCacheData']['@attributes']['slide_numbers_visible']
                                        : $berta->settings->get('entryLayout', 'gallerySlideNumberVisibilityDefault');
                    $galleryWidthByWidestSlide = !empty($entry['mediaCacheData']['@attributes']['gallery_width_by_widest_slide'])
                                        ? $entry['mediaCacheData']['@attributes']['gallery_width_by_widest_slide']
                                        : 'no';

                    $linkAddress = !empty($entry['mediaCacheData']['@attributes']['link_address'])
                                        ? $entry['mediaCacheData']['@attributes']['link_address'] : '';
                    $linkTarget = !empty($entry['mediaCacheData']['@attributes']['linkTarget'])
                                        ? $entry['mediaCacheData']['@attributes']['linkTarget'] : '_self';

                    $rowGalleryPadding = !empty($entry['mediaCacheData']['@attributes']['row_gallery_padding'])
                                            ? $entry['mediaCacheData']['@attributes']['row_gallery_padding'] : '0';

                    echo '<div class="xEntryGalleryEditor-wrap"><div class="xEntryGalleryEditor xPanel clearfix">';
                    echo '<div class="xEntryGalleryMenu">';
                    echo '<div class="xEntryMedia tab">',
                                    '<a href="#" class="xParams-media selected" title="add images and videos"><span>media</span></a>',
                                '</div>';
                    echo '<div class="xEntryMediaSettings tab">',
                                    '<a href="#" class="xParams-media_settings" title="gallery settings"><span>settings</span></a>',
                                '</div>';
                    echo '<div class="xEntryFullScreenSettings tab ">',
                                    '<a href="#" class="xParams-fullscreen" title="lightbox on/off"><span>lightbox</span></a>',
                                '</div>';
                    echo '<div class="xEntryImageSizeSettings tab ">',
                                    '<a href="#" class="xParams-image_size" title="large/medium/small image size"><span>image size</span></a>',
                                '</div>';
                    echo '<a class="xEntryGalCloseLink xEditorLink" href="#" title="close image editor"><span>X</span></a>';
                    echo '</div>';

                    echo '<div class="xEntryGalleryAddMedia">';
                    echo '<input type="file" name="Filedata" class="xHidden" multiple>';
                    echo '<a class="xEntryAddImagesLink" href="/_api/v1/sites/sections/entries/galleries" data-path="' . $basePath . '">+ add media</a>';
                    echo '</div>';

                    echo '<div class="xEntryGallerySettings xGreyBack xHidden">';
                    echo '<div class="caption">gallery type</div>',
                                '<div class="xEntrySetGalType xFloatLeft xEditableSelectRC xCommand-SET_GALLERY_TYPE" x_options="slideshow||row||column||pile||link" data-path="' . $basePath . 'mediaCacheData/@attributes/type">' . $galType . '</div>',
                                '<div class="clear"></div>';
                    echo '<div class="xEntrySlideshowSettings galleryTypeSettings' . ($galType == 'slideshow' ? '' : ' xHidden') . '">',
                                    '<div class="caption">autoplay seconds</div>',
                                    '<div class="xEntryAutoPlay xFloatLeft xEditableRC xCommand-SET_AUTOPLAY xCaption-0" title="' . $autoPlay . '" data-path="' . $basePath . 'mediaCacheData/@attributes/autoplay">' . $autoPlay . '</div>',
                                    '<div class="clear"></div>',
                                    '<div class="caption">show image numbers</div>',
                                    '<div class="xEntrySlideNumberVisibility xFloatLeft xEditableSelectRC xCommand-SET_SLIDE_NUMBER_VISIBILITY" x_options="yes||no" data-path="' . $basePath . 'mediaCacheData/@attributes/slide_numbers_visible">' . $numberVisibility . '</div>',

                                    ($isMessyTemplate ?
                                    '<div class="clear"></div>
                                    <div class="caption">width by widest slide</div>
                                    <div class="xGalleryWidthByWidestSlide xFloatLeft xEditableSelectRC xCommand-GALLERY_WIDTH_BY_WIDEST_SLIDE" x_options="no||yes" data-path="' . $basePath . 'mediaCacheData/@attributes/gallery_width_by_widest_slide">' . $galleryWidthByWidestSlide . '</div>'
                                    : ''),

                                '</div>';
                    echo '<div class="xEntryLinkSettings galleryTypeSettings' . ($galType == 'link' ? '' : ' xHidden') . ' ">',
                                    '<div class="caption">link address</div>',
                                    '<div class="xEntryLinkAddress xFloatLeft xEditableRC xCommand-SET_LINK_ADDRESS" title="' . ($linkAddress ? $linkAddress : 'http://') . '" data-path="' . $basePath . 'mediaCacheData/@attributes/link_address">' . ($linkAddress ? $linkAddress : 'http://') . '</div>',
                                    '<div class="clear"></div>',
                                    '<div class="caption">link target</div>',
                                    '<div class="xEntryLinkTarget xFloatLeft xEditableSelectRC xCommand-SET_LINK_TARGET" x_options="_self||_blank" data-path="' . $basePath . 'mediaCacheData/@attributes/linkTarget">' . $linkTarget . '</div>',
                                '</div>';
                    echo '<div class="xEntryRowSettings galleryTypeSettings' . ($galType == 'row' ? '' : ' xHidden') . ' ">',
                                    '<div class="caption">image padding</div>',
                                    '<div class="xRowGalleryPadding xFloatLeft xEditableRC xCommand-SET_ROW_GALLERY_PADDING xCaption-0" title="' . $rowGalleryPadding . '" data-path="' . $basePath . 'mediaCacheData/@attributes/row_gallery_padding">' . $rowGalleryPadding . '</div>',
                                '</div>';
                    echo '</div>';

                    echo '<div class="xEntryGalleryFullScreen xHidden">';
                    echo '<div class="caption">fullscreen</div>',
                                '<div class="xEntrySetFullScreen xFloatLeft xEditableSelectRC xCommand-SET_FULLSCREEN" x_options="yes||no" data-path="' . $basePath . 'mediaCacheData/@attributes/fullscreen">' . $FullScreen . '</div><div class="clear"></div>';
                    echo '</div>';

                    echo '<div class="xEntryGalleryImageSize xHidden">';
                    echo '<div class="caption">image size</div>',
                                '<div class="xEntrySetImageSize xFloatLeft xEditableSelectRC xCommand-SET_GALLERY_SIZE" x_options="large||medium||small" data-path="' . $basePath . 'mediaCacheData/@attributes/size">' . $imageSize . '</div><div class="clear"></div>';
                    echo '</div>';

                    echo '<div class="images"><ul>';
                    if (!empty($entry['mediaCacheData']['file']) && count($entry['mediaCacheData']['file']) > 0) {
                        // if the xml tag is not a list tag, convert it.
                        Array_XML::makeListIfNotList($entry['mediaCacheData']['file']);

                        // print out images
                        foreach ($entry['mediaCacheData']['file'] as $idx => $im) {
                            if ((string) $idx == '@attributes') {
                                continue;
                            }
                            $imageThumbSrc = false;
                            $imageWidth = 'auto';
                            if ($im['@attributes']['type'] == 'video') {
                                if (!empty($im['@attributes']['poster_frame'])) {
                                    $entryImageSrc = $entry['mediafolder']['value'] . '/' . (string) $im['@attributes']['poster_frame'];
                                    $imageThumbSrc = BertaEditor::images_getSmallThumbFor($entryImageSrc);
                                    $thumbName = basename($imageThumbSrc);
                                    $imageSize = getimagesize($options['MEDIA_ROOT'] . $entry['mediafolder']['value'] . '/' . $thumbName);
                                    $imageWidth = $imageSize[0] . 'px';
                                }

                                echo '<li class="video" filename="' . (string) $im['@attributes']['src'] . '" fileinfo="' . '' . '">';
                                echo '<div class="placeholderContainer" style="background-image: ' . ($imageThumbSrc ? ('url(' . $imageThumbSrc . '?no_cache=' . rand() . ')') : 'none') . '; width: ' . $imageWidth . ';"><div class="placeholder"></div></div>';
                                echo '<span class="grabHandle xMAlign-container"><span class="xMAlign-outer"><a class="xMAlign-inner" title="click and drag to move"><span></span></a></span></span>';
                                echo '<a href="#" class="delete"></a>';
                                echo '<div class="dimsForm">' .
                                                '<div class="posterContainer"></div><input type="file"><a class="poster" href="#">' . ($imageThumbSrc ? 'change' : 'upload') . ' poster frame</a>' .
                                            '</div>';
                                echo '<div class="xAutoPlay"><label><span class="xEditableRealCheck xProperty-videoAutoplay xParam-' . $im['@attributes']['src'] . '" data-path="'. $basePath .'mediaCacheData/file/' . $idx . '/@attributes/autoplay">' . (isset($im['@attributes']['autoplay']) && $im['@attributes']['autoplay'] ? 1 : 0) . '</span>autoplay</label></div>';
                                echo '<div class="xEGEImageCaption ' . $xEditSelectorMCESimple . ' xProperty-galleryImageCaption xCaption-caption xParam-' . $im['@attributes']['src'] . '" data-path="' . $basePath . 'mediaCacheData/file/' . $idx . '/@value">', !empty($im['value']) ? $im['value'] : '', '</div>';
                                echo '</li>';
                                echo "\n";
                            } else {
                                $imSrc = $options['MEDIA_URL'] . $entry['mediafolder']['value'] . '/' . (string) $im['@attributes']['src'];
                                $entryImageSrc = $entry['mediafolder']['value'] . '/' . (string) $im['@attributes']['src'];
                                $imageThumbSrc = BertaEditor::images_getSmallThumbFor($entryImageSrc);

                                if ($imageThumbSrc) {
                                    echo '<li class="image" filename="' . (string) $im['@attributes']['src'] . '" fileinfo="' . '' . '">';
                                    echo '<img class="img" src="' . $imageThumbSrc . '" />';
                                    echo '<span class="grabHandle xMAlign-container"><span class="xMAlign-outer"><a class="xMAlign-inner" title="click and drag to move"><span></span></a></span></span>';
                                    echo '<a href="#" class="crop" data-src="' . $imSrc . '"></a>';
                                    echo '<a href="#" class="delete"></a>';
                                    echo '<div class="xEGEImageCaption ' . $xEditSelectorMCESimple . ' xProperty-galleryImageCaption xCaption-image-caption xParam-' . $im['@attributes']['src'] . '" data-path="' . $basePath . 'mediaCacheData/file/' . $idx . '/@value">', !empty($im['value']) ? $im['value'] : '', '</div>';
                                    echo '</li>';
                                }
                            }
                        }
                    }
                    echo "</ul></div>\n";

                    echo '<div class="xEntryGalleryCrop xHidden">
                                <section class="checkBoard">
                                    <img src="" class="cropImage">
                                    <p class="loader xHidden"><img src="/engine/layout/loader.gif"></p>
                                </section>
                                <section class="cropToolbar">
                                    <p>original size (px):</p>
                                    <p class="widthOrigUI"></p>
                                    <p class="heightOrigUI"></p>

                                    <p class="newSize">new size (px):</p>
                                    <div class="clearfix">
                                        <div class="manualSizeBox">
                                            <p class="widthRealUI"><input type="text" name="widthReal" class="widthReal" value=""></p>
                                            <p class="heightRealUI"><input type="text" name="heightReal" class="heightReal"></p>
                                        </div>
                                        <div class="manualSizeBox">
                                            <span class="ratio" title="keep proportions"></span>
                                        </div>
                                    </div>
                                    <input type="hidden" name="leftReal" class="leftReal">
                                    <input type="hidden" name="topReal" class="topReal">
                                    <button class="processCrop">Crop</button>
                                    <button class="cancel">Cancel</button>
                                </section>
                            </div>' . "\n";

                    echo "</div></div>\n";
                }
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
