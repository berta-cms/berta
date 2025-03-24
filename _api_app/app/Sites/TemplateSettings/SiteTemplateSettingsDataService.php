<?php

namespace App\Sites\TemplateSettings;

use App\Configuration\SiteTemplatesConfigService;
use App\Shared\ImageHelpers;
use App\Shared\Storage;
use App\Sites\Settings\SiteSettingsDataService;

/**
 * This class is a service that handles site template settings data for Berta CMS.
 * Settings are stored in `settings.[template].xml` file for the corresponding site.
 *
 * The root site has its settings stored in `storage/settings.[template].xml`,
 * any other site has it's settings in `storage/-sites/[site name]/settings.[template].xml`
 *
 * @example: berta/sample-data/settings.[template-name].xml
 *
 * @example an example of XML file:
 * <?xml version="1.0" encoding="utf-8"?>
 * <settings>
 *  <generalFontSettings>
 *    <fontFamily><![CDATA[Helvetica, Arial, sans-serif]]></fontFamily>
 *  </generalFontSettings>
 *  <background>
 *    <backgroundColor><![CDATA[#edcaca]]></backgroundColor>
 *  </background>
 *  <pageLayout>
 *    <centered><![CDATA[no]]></centered>
 *    <paddingTop><![CDATA[31px]]></paddingTop>
 *    <paddingLeft><![CDATA[31px]]></paddingLeft>
 *  </pageLayout>
 *  <heading>
 *    <position><![CDATA[absolute]]></position>
 *    <color><![CDATA[#ff0000]]></color>
 *    <fontFamily><![CDATA[Arial, sans-serif]]></fontFamily>
 *  </heading>
 *  <pageHeading>
 *    <color><![CDATA[#f5c9c9]]></color>
 *    <fontFamily><![CDATA[Helvetica, Arial, sans-serif]]></fontFamily>
 *  </pageHeading>
 *  <menu>
 *    <position><![CDATA[absolute]]></position>
 *    <fontVariant><![CDATA[normal]]></fontVariant>
 *  </menu>
 *  <links>
 *    <colorHover><![CDATA[#737373]]></colorHover>
 *  </links>
 *  <css>
 *    <customCSS><![CDATA[.example {<br />color: red;<br />}]]></customCSS>
 *  </css>
 * </settings>
 */
class SiteTemplateSettingsDataService extends Storage
{
    public static $JSON_SCHEMA = [
        '$schema' => 'http://json-schema.org/draft-06/schema#',
        'type' => 'object',
        'properties' => [
            'background' => [
                'type' => 'object',
                'properties' => [
                    'backgroundAttachment' => ['type' => 'string', 'enum' => ['fixed', 'fill', 'scroll']],
                    'backgroundColor' => ['type' => 'string', 'format' => 'color'],
                    'backgroundImage_height' => ['type' => 'integer', 'minimum' => 0],
                    'backgroundImage_width' => ['type' => 'integer', 'minimum' => 0],
                    'backgroundImage' => ['type' => 'string'],
                    'backgroundImageEnabled' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'backgroundPosition' => [
                        'type' => 'string',
                        'enum' => [
                            'top left', 'top center', 'top right', 'center left', 'center', 'center right',
                            'bottom left', 'bottom center', 'bottom right',
                        ],
                    ],
                    'backgroundRepeat' => [
                        'type' => 'string', 'enum' => ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'],
                    ],
                ],
            ],
            'css' => [
                'type' => 'object',
                'properties' => [
                    'customCSS' => ['type' => 'string'],
                ],
            ],
            'entryFooter' => [
                'type' => 'object',
                'properties' => [
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                ],
            ],
            'entryHeading' => [
                'type' => 'object',
                'properties' => [
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                    'margin' => ['$ref' => '#/definitions/cssUnit.df'],
                ],
            ],
            'entryLayout' => [
                'type' => 'object',
                'properties' => [
                    'contentWidth' => ['$ref' => '#/definitions/cssUnit.df'],
                    'defaultGalleryType' => ['type' => 'string', 'enum' => ['slideshow', 'row']],
                    'galleryMargin' => ['type' => ['string', 'integer']],
                    'galleryNavMargin' => ['type' => ['string', 'integer']],
                    'galleryPosition' => [
                        'type' => 'string', 'enum' => ['between title/description', 'above title', 'below description'],
                    ],
                    'margin' => ['$ref' => '#/definitions/cssUnit.df'],
                    'spaceBetween' => ['$ref' => '#/definitions/cssUnit.df'],
                    'spaceBetweenImages' => ['$ref' => '#/definitions/cssUnit.df'],
                ],
            ],
            'firstPage' => [
                'type' => 'object',
                'properties' => [
                    'hoverWiggle' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'imageHaveShadows' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'imageSizeRatio' => ['type' => 'number'],
                ],
            ],
            'generalFontSettings' => [
                'type' => 'object',
                'properties' => [
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                ],
            ],
            'grid' => [
                'type' => 'object',
                'properties' => [
                    'contentWidth' => ['$ref' => '#/definitions/cssUnit.df'],
                ],
            ],
            'heading' => [
                'type' => 'object',
                'properties' => [
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'image_height' => ['type' => 'integer', 'minimum' => 0],
                    'image_width' => ['type' => 'integer', 'minimum' => 0],
                    'image' => ['type' => 'string'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                    'position' => [
                        'type' => 'string',
                        'enum' => ['static', 'relative', 'absolute', 'fixed', 'sticky'],
                    ],
                ],
            ],
            'links' => [
                'type' => 'object',
                'properties' => [
                    'colorLink' => ['type' => 'string', 'format' => 'color'],
                    'colorVisited' => ['type' => 'string', 'format' => 'color'],
                    'colorHover' => ['type' => 'string', 'format' => 'color'],
                    'colorActive' => ['type' => 'string', 'format' => 'color'],
                    'textDecorationLink' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationVisited' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationHover' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationActive' => ['$ref' => '#/definitions/textDecoration.df'],
                ],
            ],
            'menu' => [
                'type' => 'object',
                'properties' => [
                    'colorActive' => ['type' => 'string', 'format' => 'color'],
                    'colorHover' => ['type' => 'string', 'format' => 'color'],
                    'colorLink' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                    'margin' => ['$ref' => '#/definitions/cssUnit.df'],
                    'position' => ['$ref' => '#/definitions/cssUnit.df'],
                    'separator' => ['type' => 'string'],
                    'separatorDistance' => ['$ref' => '#/definitions/cssUnit.df'],
                    'textDecorationActive' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationHover' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationLink' => ['$ref' => '#/definitions/textDecoration.df'],
                ],
            ],
            'pageHeading' => [
                'type' => 'object',
                'properties' => [
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'image' => ['type' => 'string'],
                    'image_height' => ['type' => 'integer'],
                    'image_width' => ['type' => 'integer'],
                    'lineHeight' => ['type' => 'string'],
                    'margin' => ['$ref' => '#/definitions/cssUnit.df'],
                    'marginBottom' => ['type' => 'string'],
                    'marginTop' => ['type' => 'string'],
                ],
            ],
            'pageLayout' => [
                'type' => 'object',
                'properties' => [
                    'bgButtonType' => ['type' => 'string'],
                    'bodyMargin' => ['type' => 'string'],
                    'centered' => ['type' => 'string'],
                    'centeredContents' => ['type' => 'string'],
                    'centeredWidth' => ['$ref' => '#/definitions/cssUnit.df'],
                    'centeringGuidesColor' => ['type' => 'string'],
                    'contentAlign' => ['type' => 'string', 'enum' => ['left', 'right', 'justify-left', 'justify-right']],
                    'contentPosition' => ['type' => 'string', 'enum' => ['left', 'center', 'right']],
                    'contentWidth' => ['$ref' => '#/definitions/cssUnit.df'],
                    'headingMargin' => ['type' => 'string'],
                    'leftColumnWidth' => ['$ref' => '#/definitions/cssUnit.df'],
                    'mashUpColumns' => ['type' => 'integer', 'minimum' => 0],
                    'menuMargin' => ['type' => 'string'],
                    'paddingLeft' => ['$ref' => '#/definitions/cssUnit.df'],
                    'paddingTop' => ['$ref' => '#/definitions/cssUnit.df'],
                    'autoResponsive' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'responsive' => ['type' => 'string', 'enum' => ['no', 'yes']],
                    'siteMenuMargin' => ['$ref' => '#/definitions/cssUnit.df'],
                ],
            ],
            'sideBar' => [
                'type' => 'object',
                'properties' => [
                    'backgroundColor' => ['type' => 'string', 'format' => 'color'],
                    'color' => ['type' => 'string', 'format' => 'color'],
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'image' => ['type' => 'string'],
                    'image_height' => ['type' => 'integer'],
                    'image_width' => ['type' => 'integer'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                    'marginBottom' => ['$ref' => '#/definitions/cssUnit.df'],
                    'marginLeft' => ['$ref' => '#/definitions/cssUnit.df'],
                    'marginTop' => ['$ref' => '#/definitions/cssUnit.df'],
                    'transparent' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'width' => ['$ref' => '#/definitions/cssUnit.df'],
                ],
            ],
            'subMenu' => [
                'type' => 'object',
                'properties' => [
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'fontVariant' => ['$ref' => '#/definitions/fontVariant.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'googleFont' => ['type' => 'string'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                    'margin' => ['$ref' => '#/definitions/cssUnit.df'],
                    'separator' => ['type' => 'string'],
                    'separatorDistance' => ['$ref' => '#/definitions/cssUnit.df'],
                ],
            ],
            'tagsMenu' => [
                'type' => 'object',
                'properties' => [
                    'fontFamily' => ['$ref' => '#/definitions/fontFamily.df'],
                    'googleFont' => ['type' => 'string'],
                    'fontSize' => ['$ref' => '#/definitions/cssUnit.df'],
                    'fontWeight' => ['$ref' => '#/definitions/fontWeight.df'],
                    'fontStyle' => ['$ref' => '#/definitions/fontStyle.df'],
                    'lineHeight' => ['$ref' => '#/definitions/cssUnit.df'],
                    'colorLink' => ['type' => 'string', 'format' => 'color'],
                    'colorHover' => ['type' => 'string', 'format' => 'color'],
                    'colorActive' => ['type' => 'string', 'format' => 'color'],
                    'textDecorationLink' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationHover' => ['$ref' => '#/definitions/textDecoration.df'],
                    'textDecorationActive' => ['$ref' => '#/definitions/textDecoration.df'],
                    'x' => ['type' => 'integer'],
                    'y' => ['type' => 'integer'],
                    'alwaysOpen' => ['type' => 'string', 'enum' => ['yes', 'no']],
                    'hidden' => ['type' => 'string', 'enum' => ['yes', 'no']],
                ],
            ],
        ],
        'definitions' => [
            /**
             * Define these types only once, and reuse them, because they are used many times.
             * - The ".df" suffix is for easier searching, it is not required by the json schema.
             * - Enum values are extracted from "template.conf.php"
             */
            'fontWeight.df' => [
                'type' => 'string',
                'enum' => ['normal', 'bold', 'bolder', 'light', 'lighter', 'inherit'],
            ],
            'fontFamily.df' => [
                'type' => 'string',
                'enum' => [
                    'Arial, sans-serif',
                    'Helvetica, Arial, sans-serif',
                    '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    '"Arial Black", Gadget, sans-serif',
                    '"Comic Sans MS", cursive',
                    '"Courier New", Courier, monospace',
                    'Georgia, "Times New Roman", Times, serif',
                    'Impact, Charcoal, sans-serif',
                    '"Lucida Console", Monaco, monospace',
                    '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
                    '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                    'Tahoma, Geneva, sans-serif',
                    '"Times New Roman", Times, serif',
                    '"Trebuchet MS", Helvetica, sans-serif',
                    'Verdana, Geneva, sans-serif',
                ],
            ],
            'fontStyle.df' => [  // https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
                'type' => 'string', 'enum' => ['normal', 'italic', 'oblique', 'inherit'],
            ],
            'fontVariant.df' => [
                'type' => 'string', 'enum' => ['small-caps', 'inherit', 'normal'],
            ],
            'textDecoration.df' => [
                'type' => 'string',
                'enum' => ['none', 'underline', 'overline', 'line-through'],
            ],
            'cssUnit.df' => [
                'type' => ['string', 'integer'],
                'format' => 'css-unit',
            ],
        ],
    ];

    protected static $DEFAULT_VALUES = [];

    private $xml_root;

    private $ROOT_ELEMENT = 'settings';

    private $TEMPLATE;

    private $XML_FILE;

    private $siteTemplatesConfigService;

    private $siteTemplateDefaults;

    public function __construct($site = '', $template = 'messy-0.4.2', $xml_root = null)
    {
        parent::__construct($site);
        $this->xml_root = $xml_root ? $xml_root : $this->getSiteXmlRoot($site);
        $this->TEMPLATE = explode('-', $template)[0];
        $this->XML_FILE = $this->xml_root . '/settings.' . $this->TEMPLATE . '.xml';

        $this->siteTemplatesConfigService = new SiteTemplatesConfigService;
        $this->siteTemplateDefaults = $this->siteTemplatesConfigService->getDefaults()[$template]['templateConf'];
    }

    public function get()
    {
        $siteTemplateSettings = $this->xmlFile2array($this->XML_FILE);

        return $siteTemplateSettings;
    }

    public function getState()
    {
        $siteTemplateSettings = $this->get();

        // Disable `autoResponsive` if `responsive` is enabled for Messy
        if ($this->TEMPLATE == 'messy' && isset($siteTemplateSettings['pageLayout']['responsive']) && $siteTemplateSettings['pageLayout']['responsive'] == 'yes') {
            $siteTemplateSettings['pageLayout']['autoResponsive'] = 'no';
        }

        $siteTemplateSettings = self::mergeSiteTemplateDefaults($this->siteTemplateDefaults, $siteTemplateSettings);

        return $siteTemplateSettings;
    }

    /**
     * Merge site template settings with site template default values
     */
    private static function mergeSiteTemplateDefaults($siteTemplatesDefaults, $siteTemplateSettings)
    {
        $data = [];
        foreach ($siteTemplatesDefaults as $group => $settings) {
            if (isset($siteTemplateSettings[$group])) {
                $data[$group] = array_merge($settings, $siteTemplateSettings[$group]);
            } else {
                $data[$group] = $settings;
            }
        }

        return $data;
    }

    /**
     * Saves a value with a given path and saves the change to XML file
     *
     * @param  string  $path  Slash delimited path to the value
     * @param  mixed  $value  Value to be saved
     * @return array Array of changed value and/or error messages
     */
    public function saveValueByPath($path, $value)
    {
        $site_template_settings = $this->get();
        $path_arr = array_slice(explode('/', $path), 3);
        $value = trim($value);

        $ret = [
            'site' => $this->SITE == '0' ? '' : $this->SITE,
            'path' => $path,
            'value' => $value,
        ];

        $this->setValueByPath(
            $site_template_settings,
            implode('/', $path_arr),
            $value
        );

        $this->array2xmlFile($site_template_settings, $this->XML_FILE, $this->ROOT_ELEMENT);

        return $ret;
    }

    public function uploadFileByPath($path, $file)
    {
        $mediaDir = $this->getOrCreateMediaDir();
        $oldFileName = $this->getValueByPath($this->get(), implode('/', array_slice(explode('/', $path), 3)));
        $fileName = $this->getUniqueFileName($mediaDir, $file->getClientOriginalName());
        $file->move($mediaDir, $fileName);

        ImageHelpers::downscaleToMaxSize($mediaDir . '/' . $fileName);

        [$width, $height] = getimagesize($mediaDir . '/' . $fileName);
        $width = round($width / 2);
        $height = round($height / 2);

        ImageHelpers::getResizedSrc($mediaDir, $fileName, $width, $height);
        if ($oldFileName) {
            $this->removeImageWithThumbnails($mediaDir, $oldFileName);
        }

        self::saveValueByPath($path . '_width', $width);
        self::saveValueByPath($path . '_height', $height);

        return self::saveValueByPath($path, $fileName);
    }

    /**
     * Merge site template settings from other source folder
     *
     * @param  string  $src_root  template settings source root folder
     */
    public function mergeSiteTemplateSettings($src_root)
    {
        $newSiteTemplateSettings = [];

        $currentSiteTemplateSettings = $this->get();
        $sourceSiteSettingsDS = new SiteSettingsDataService('', $src_root);
        $sourceSiteSettings = $sourceSiteSettingsDS->get();
        $sourceSiteTemplateSettingsDS = new self('', $sourceSiteSettings['template']['template'], $src_root);
        $sourceSiteTemplateSettings = $sourceSiteTemplateSettingsDS->get();
        $sourceTemplateConfig = $this->siteTemplatesConfigService->get()[$sourceSiteSettings['template']['template']]['templateConf'];

        // Merge template settings
        foreach ($sourceSiteTemplateSettings as $groupKey => $group) {
            foreach ($group as $settingKey => $value) {
                $newSiteTemplateSettings[$groupKey][$settingKey] = $value;
                $isImageSetting = isset($sourceTemplateConfig[$groupKey][$settingKey]) && $sourceTemplateConfig[$groupKey][$settingKey]['format'] == 'image';

                if (! $isImageSetting) {
                    continue;
                }

                $affectsStyle = isset($sourceTemplateConfig[$groupKey][$settingKey]['affectsStyle']) && $sourceTemplateConfig[$groupKey][$settingKey]['affectsStyle'];

                if (! $affectsStyle) {
                    // Keep images form old settings if they don't affect style
                    if (isset($currentSiteTemplateSettings[$groupKey][$settingKey])) {
                        $newSiteTemplateSettings[$groupKey][$settingKey] = $currentSiteTemplateSettings[$groupKey][$settingKey];
                    } else {
                        unset($newSiteTemplateSettings[$groupKey][$settingKey]);
                    }
                }

                // Copy image file
                if ($affectsStyle && $value) {
                    copy($src_root . '/' . $this->MEDIA_FOLDER . '/' . $value, $this->xml_root . '/' . $this->MEDIA_FOLDER . '/' . $value);
                }
            }
        }

        $this->array2xmlFile($newSiteTemplateSettings, $this->XML_FILE, $this->ROOT_ELEMENT);
    }

    public function resetToDefaults()
    {
        if (file_exists($this->XML_FILE)) {
            unlink($this->XML_FILE);
        }

        return $this->siteTemplateDefaults;
    }
}
