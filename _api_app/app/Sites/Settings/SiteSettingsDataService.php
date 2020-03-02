<?php

namespace App\Sites\Settings;

use App\Configuration\SiteSettingsConfigService;
use App\Shared\Storage;
use App\Shared\ImageHelpers;
use App\Shared\ConfigHelpers;
use App\Sites\Sections\SiteSectionsDataService;
use App\Configuration\SiteTemplatesConfigService;

/**
 * This class is a service that handles site settings data for Berta CMS.
 * Settings are stored in `settings.xml` file for the corresponding site.
 *
 * The root site has its settings stored in `storage/settings.xml`,
 * any other site has it's settings in `storage/-sites/[site name]/settings.xml`
 *
 * @example an example of XML file:
 * <?xml version="1.0" encoding="utf-8"?>
 * <settings>
 *   <template>
 *     <template><![CDATA[messy-0.4.2]]></template>
 *   </template>
 *   <siteTexts>
 *     <siteHeading><![CDATA[My heading]]></siteHeading>
 *     <siteFooter><![CDATA[© John Doe]]></siteFooter>
 *     <tourComplete><![CDATA[1]]></tourComplete>
 *     <multisitesXY><![CDATA[120,90]]></multisitesXY>
 *     <additionalTextXY><![CDATA[130,150]]></additionalTextXY>
 *     <additionalText><![CDATA[<p>Some text</p>]]></additionalText>
 *     <siteHeadingXY><![CDATA[520,190]]></siteHeadingXY>
 *   </siteTexts>
 *   <berta>
 *     <lastUpdated><![CDATA[Mon, 26 Mar 2018 08:12:20 GMT]]></lastUpdated>
 *     <installed><![CDATA[1]]></installed>
 *   </berta>
 *   <texts>
 *     <ownerName><![CDATA[John Doe]]></ownerName>
 *     <pageTitle><![CDATA[My site]]></pageTitle>
 *     <metaKeywords><![CDATA[john, doe, portfolio]]></metaKeywords>
 *     <metaDescription><![CDATA[My personal website]]></metaDescription>
 *   </texts>
 *   <settings>
 *     <hideBertaCopyright><![CDATA[yes]]></hideBertaCopyright>
 *     <googleAnalyticsId><![CDATA[123]]></googleAnalyticsId>
 *     <googleSiteVerification><![CDATA[&lt;meta name=&quot;google-site-verification&quot; content=&quot;xyz&quot; /&gt;]]></googleSiteVerification>
 *     <jsInclude><![CDATA[&lt;script&gt;<br />var b = 2;<br />&lt;/script&gt;]]></jsInclude>
 *   </settings>
 *   <entryLayout>
 *     <galleryFullScreenCaptionAlign><![CDATA[left]]></galleryFullScreenCaptionAlign>
 *     <galleryFullScreenDefault><![CDATA[yes]]></galleryFullScreenDefault>
 *     <galleryFullScreenBackground><![CDATA[black]]></galleryFullScreenBackground>
 *     <galleryFullScreenImageNumbers><![CDATA[yes]]></galleryFullScreenImageNumbers>
 *     <gallerySlideshowAutoRewind><![CDATA[no]]></gallerySlideshowAutoRewind>
 *     <gallerySlideNumberVisibilityDefault><![CDATA[yes]]></gallerySlideNumberVisibilityDefault>
 *   </entryLayout>
 *   <media>
 *     <imagesSmallWidth><![CDATA[200]]></imagesSmallWidth>
 *     <imagesSmallHeight><![CDATA[200]]></imagesSmallHeight>
 *     <imagesMediumWidth><![CDATA[400]]></imagesMediumWidth>
 *     <imagesMediumHeight><![CDATA[400]]></imagesMediumHeight>
 *     <imagesLargeWidth><![CDATA[600]]></imagesLargeWidth>
 *     <imagesLargeHeight><![CDATA[600]]></imagesLargeHeight>
 *   </media>
 *   <banners>
 *     <banner1_image><![CDATA[image-1080x1080_10_.png]]></banner1_image>
 *     <banner1_image_width><![CDATA[540]]></banner1_image_width>
 *     <banner1_image_height><![CDATA[540]]></banner1_image_height>
 *     <banner1_link><![CDATA[http://example.com]]></banner1_link>
 *     <banner2_image><![CDATA[250web.png]]></banner2_image>
 *     <banner2_image_width><![CDATA[123]]></banner2_image_width>
 *     <banner2_image_height><![CDATA[163]]></banner2_image_height>
 *     <banner2_link><![CDATA[http://example2.com]]></banner2_link>
 *   </banners>
 *   <navigation>
 *     <landingSectionVisible><![CDATA[yes]]></landingSectionVisible>
 *     <landingSectionPageHeadingVisible><![CDATA[yes]]></landingSectionPageHeadingVisible>
 *     <landingSectionMenuVisible><![CDATA[yes]]></landingSectionMenuVisible>
 *     <alwaysSelectTag><![CDATA[no]]></alwaysSelectTag>
 *   </navigation>
 *   <pageLayout>
 *     <favicon><![CDATA[favicon.ico]]></favicon>
 *     <gridStep><![CDATA[10]]></gridStep>
 *     <showGrid><![CDATA[no]]></showGrid>
 *     <gridColor><![CDATA[black]]></gridColor>
 *   </pageLayout>
 *   <socialMediaButtons>
 *     <socialMediaHTML><![CDATA[&lt;div class=&quot;social&quot;&gt;&lt;/div&gt;]]></socialMediaHTML>
 *     <socialMediaJS><![CDATA[&lt;script&gt;var a = 1;&lt;/script&gt;]]></socialMediaJS>
 *     <socialMediaLocation><![CDATA[footer]]></socialMediaLocation>
 *   </socialMediaButtons>
 *   <language>
 *     <language><![CDATA[en]]></language>
 *   </language>
 * </settings>
 */
class SiteSettingsDataService extends Storage
{
    /**
     * @var array $JSON_SCHEMA
     * Associative array representing data structure handled by this service.
     */
    public static $JSON_SCHEMA = [
        '$schema' => 'http://json-schema.org/draft-06/schema#',
        'type' => 'object',
        'properties' => [
            'template' => [
                'type' => 'object',
                'properties' => [
                    'template' => ['type' => 'string'],
                ],
            ],
            'siteTexts' => [
                'type' => 'object',
                'properties' => [
                    'siteHeading' => ['type' => 'string'],
                    'siteFooter' => ['type' => 'string'],
                    'tourComplete' => ['type' => 'integer'],
                    'multisitesXY' => ['type' => 'string'],
                    'additionalTextXY' => ['type' => 'string'],
                    'additionalText' => ['type' => 'string'],
                    'siteHeadingXY' => ['type' => 'string'],
                    'banner1XY' => ['type' => 'string'],
                    'banner2XY' => ['type' => 'string'],
                    'banner3XY' => ['type' => 'string'],
                    'banner4XY' => ['type' => 'string'],
                    'banner5XY' => ['type' => 'string'],
                    'banner6XY' => ['type' => 'string'],
                    'banner7XY' => ['type' => 'string'],
                    'banner8XY' => ['type' => 'string'],
                    'banner9XY' => ['type' => 'string'],
                    'banner10XY' => ['type' => 'string'],
                ],
            ],
            'berta' => [
                'type' => 'object',
                'properties' => [
                    'lastUpdated' => ['type' => 'string'],
                    'installed' => ['type' => 'integer'],
                ],
            ],
            'texts' => [
                'type' => 'object',
                'properties' => [
                    'ownerName' => ['type' => 'string'],
                    'pageTitle' => ['type' => 'string'],
                    'metaKeywords' => ['type' => 'string'],
                    'metaDescription' => ['type' => 'string'],
                ],
            ],
            'settings' => [
                'type' => 'object',
                'properties' => [
                    'hideBertaCopyright' => ['type' => 'string'],
                    'googleAnalyticsId' => ['type' => 'string'],
                    'googleSiteVerification' => ['type' => 'string'],
                    'jsInclude' => ['type' => 'string'],
                ],
            ],
            'entryLayout' => [
                'type' => 'object',
                'properties' => [
                    'galleryFullScreenCaptionAlign' => ['type' => 'string'],
                    'galleryFullScreenDefault' => ['type' => 'string'],
                    'galleryFullScreenBackground' => ['type' => 'string'],
                    'galleryFullScreenImageNumbers' => ['type' => 'string'],
                    'gallerySlideshowAutoRewind' => ['type' => 'string'],
                    'gallerySlideNumberVisibilityDefault' => ['type' => 'string'],
                ],
            ],
            'media' => [
                'type' => 'object',
                'properties' => [
                    'imagesSmallWidth' => ['type' => 'integer'],
                    'imagesSmallHeight' => ['type' => 'integer'],
                    'imagesMediumWidth' => ['type' => 'integer'],
                    'imagesMediumHeight' => ['type' => 'integer'],
                    'imagesLargeWidth' => ['type' => 'integer'],
                    'imagesLargeHeight' => ['type' => 'integer'],
                ],
            ],
            'banners' => [
                'type' => 'object',
                'properties' => [
                    'banner1_image' => ['type' => 'string'],
                    'banner1_image_width' => ['type' => 'integer'],
                    'banner1_image_height' => ['type' => 'integer'],
                    'banner1_link' => ['type' => 'string'],
                    'banner1_link' => ['type' => 'string'],
                    'banner2_image' => ['type' => 'string'],
                    'banner2_image_width' => ['type' => 'integer'],
                    'banner2_image_height' => ['type' => 'integer'],
                    'banner2_link' => ['type' => 'string'],
                    'banner2_link' => ['type' => 'string'],
                    'banner3_image' => ['type' => 'string'],
                    'banner3_image_width' => ['type' => 'integer'],
                    'banner3_image_height' => ['type' => 'integer'],
                    'banner3_link' => ['type' => 'string'],
                    'banner3_link' => ['type' => 'string'],
                    'banner4_image' => ['type' => 'string'],
                    'banner4_image_width' => ['type' => 'integer'],
                    'banner4_image_height' => ['type' => 'integer'],
                    'banner4_link' => ['type' => 'string'],
                    'banner4_link' => ['type' => 'string'],
                    'banner5_image' => ['type' => 'string'],
                    'banner5_image_width' => ['type' => 'integer'],
                    'banner5_image_height' => ['type' => 'integer'],
                    'banner5_link' => ['type' => 'string'],
                    'banner5_link' => ['type' => 'string'],
                    'banner6_image' => ['type' => 'string'],
                    'banner6_image_width' => ['type' => 'integer'],
                    'banner6_image_height' => ['type' => 'integer'],
                    'banner6_link' => ['type' => 'string'],
                    'banner6_link' => ['type' => 'string'],
                    'banner7_image' => ['type' => 'string'],
                    'banner7_image_width' => ['type' => 'integer'],
                    'banner7_image_height' => ['type' => 'integer'],
                    'banner7_link' => ['type' => 'string'],
                    'banner7_link' => ['type' => 'string'],
                    'banner8_image' => ['type' => 'string'],
                    'banner8_image_width' => ['type' => 'integer'],
                    'banner8_image_height' => ['type' => 'integer'],
                    'banner8_link' => ['type' => 'string'],
                    'banner8_link' => ['type' => 'string'],
                    'banner9_image' => ['type' => 'string'],
                    'banner9_image_width' => ['type' => 'integer'],
                    'banner9_image_height' => ['type' => 'integer'],
                    'banner9_link' => ['type' => 'string'],
                    'banner9_link' => ['type' => 'string'],
                    'banner10_image' => ['type' => 'string'],
                    'banner10_image_width' => ['type' => 'integer'],
                    'banner10_image_height' => ['type' => 'integer'],
                    'banner10_link' => ['type' => 'string'],
                    'banner10_link' => ['type' => 'string'],
                ],
            ],
            'navigation' => [
                'type' => 'object',
                'properties' => [
                    'landingSectionVisible' => ['type' => 'string'],
                    'landingSectionPageHeadingVisible' => ['type' => 'string'],
                    'landingSectionMenuVisible' => ['type' => 'string'],
                    'alwaysSelectTag' => ['type' => 'string'],
                ],
            ],
            'pageLayout' => [
                'type' => 'object',
                'properties' => [
                    'favicon' => ['type' => 'string'],
                    'gridStep' => ['type' => 'integer'],
                    'showGrid' => ['type' => 'string'],
                    'gridColor' => ['type' => 'string'],
                ],
            ],
            'socialMediaButtons' => [
                'type' => 'object',
                'properties' => [
                    'socialMediaHTML' => ['type' => 'string'],
                    'socialMediaJS' => ['type' => 'string'],
                    'socialMediaLocation' => ['type' => 'string'],
                ],
            ],
            'language' => [
                'type' => 'object',
                'properties' => [
                    'language' => ['type' => 'string'],
                ],
            ],
        ],
    ];
    public $ROOT_ELEMENT = 'settings';
    private $XML_FILE;
    private $SITE_SETTINGS = [];
    private static $DEFAULT_SITE_SETTINGS = [
        'template/template' => 'messy-0.4.2',
        'berta/lastUpdated' => 'D, d M Y H:i:s'
    ];
    private $siteSettingsDefaults;
    private $siteSettingsConfig;
    private $siteTemplatesConfigService;

    public function __construct($site = '', $xml_root = null)
    {
        parent::__construct($site);
        $xml_root = $xml_root ? $xml_root : $this->getSiteXmlRoot($site);
        $this->XML_FILE = $xml_root . '/settings.xml';

        $this->siteSettingsConfigService = new SiteSettingsConfigService();
        $this->siteSettingsDefaults = $this->siteSettingsConfigService->getDefaults();
        $this->siteSettingsConfig = $this->siteSettingsConfigService->get();
        $this->siteTemplatesConfigService = new SiteTemplatesConfigService();
    }

    public function getDefaultSettings()
    {
        foreach (self::$DEFAULT_SITE_SETTINGS as $path => $value) {
            if (strpos($path, 'lastUpdated') !== false) {
                $this->setValueByPath($this->SITE_SETTINGS, $path, gmdate($value, time()) . ' GMT');
            } else {
                $this->setValueByPath($this->SITE_SETTINGS, $path, $value);
            }
        }

        $this->SITE_SETTINGS = self::mergeSiteSettingsDefaults($this->siteSettingsDefaults, $this->SITE_SETTINGS);

        return $this->SITE_SETTINGS;
    }

    /**
     * Returns settings of site as an array
     *
     * @return array Array of site settings
     */
    public function get()
    {
        if (empty($this->SITE_SETTINGS)) {
            $this->reload();
        }

        return $this->SITE_SETTINGS;
    }

    public function getState()
    {
        $siteSettings = $this->get();

        // Make children setting as list
        foreach ($siteSettings as $groupSlug => $groupSettings) {
            foreach ($groupSettings as $settingSlug => $setting) {
                $listOfSlug = substr($settingSlug, 0, -1);
                if (isset($setting[$listOfSlug])) {
                    $siteSettings[$groupSlug][$settingSlug] = $this->asList($siteSettings[$groupSlug][$settingSlug][$listOfSlug]);

                    if (isset($this->siteSettingsConfig[$groupSlug][$settingSlug]['children'])) {
                        // Add non existing properties from config with empty values
                        $config = array_fill_keys(array_keys($this->siteSettingsConfig[$groupSlug][$settingSlug]['children']), '');
                        $siteSettings[$groupSlug][$settingSlug] = array_map(function($item) use ($config) {
                            return array_merge($config, $item);
                        }, $siteSettings[$groupSlug][$settingSlug]);
                    }
                }
            }
        }

        $siteSettings = self::mergeSiteSettingsDefaults($this->siteSettingsDefaults, $siteSettings);
        return $siteSettings;
    }

    /**
     * Merge site settings with site settings default values
     */
    private static function mergeSiteSettingsDefaults($siteSettingsDefaults, $siteSettings)
    {
        $data = [];
        foreach ($siteSettingsDefaults as $group => $settings) {
            if (isset($siteSettings[$group])) {
                $data[$group] = array_merge($settings, $siteSettings[$group]);
            } else {
                $data[$group] = $settings;
            }
        }

        return $data;
    }

    /**
     * Returns all settings of a given site as an array
     *
     * @param string $site name of the site
     * @return array Array of settings
     */
    public function getSettingsBySite($site)
    {
        $xml_root = $this->getSiteXmlRoot($site);
        $xml_file = $xml_root . '/settings.xml';
        return $this->xmlFile2array($xml_file);
    }

    /**
     * Saves a value with a given path and saves the change to XML file
     *
     * @param string $path Slash delimited path to the value
     * @param mixed $value Value to be saved
     * @return array Array of changed value and/or error messages
     */
    public function saveValueByPath($path, $value)
    {
        $settings = $this->get();
        /** @todo: update this to use path without site (first two peaces are predictable)  */
        $path_arr = array_slice(explode('/', $path), 2);
        $path = implode('/', $path_arr);
        $isSettingChildren = count($path_arr) > 2;

        // Checking if children is asList
        if ($isSettingChildren) {
            $setting = $this->getValueByPath($settings, $path);
            // Setting asList not found, try to save setting without index
            if ($setting === NULL) {
                array_splice($path_arr, 3, 1);
                $path = implode('/', $path_arr);
            }
        }

        $value = trim($value);

        $ret = [
            'site' => $this->SITE == '0' ? '' : $this->SITE,
            'path' => $path,
            'value' => $value,
        ];

        if (!file_exists($this->XML_FILE)) {
            $ret['error_message'] = 'Settings file not found in storage!';
            return $ret;
        }

        $this->setValueByPath(
            $this->SITE_SETTINGS,
            $path,
            $value
        );

        if (empty($this->SITE_SETTINGS)) {
            throw new \Exception('Could not write empty settings!');
        }

        $this->array2xmlFile($this->SITE_SETTINGS, $this->XML_FILE, $this->ROOT_ELEMENT);

        // If Berta is installed, create a new default `Home` section
        if ($path == 'berta/installed' && $value) {
            $sectionsDataService = new SiteSectionsDataService($this->SITE);
            $sections = $sectionsDataService->get();

            if (!$sections) {
                $section = $sectionsDataService->create('home', 'Home');
                $ret['section'] = $section;
            }
        }

        return $ret;
    }

    // Overwrite method from Storage class
    public function setValueByPath(&$settings, $path, $value)
    {
        $config_path = ConfigHelpers::getSettingPathByXmlPath($path);
        $value = ConfigHelpers::formatValue($this->siteSettingsConfig, $config_path, $value);
        parent::setValueByPath($settings, $path, $value);
    }

    /**
     * Upload a file for site setting
     *
     * @param string $path Path to setting in XML structure
     * @param object $file File object
     * @return array Array of changed value
     */
    public function uploadFileByPath($path, $file)
    {
        $isImage = in_array($file->guessExtension(), config('app.image_mimes'));
        $mediaDir = $this->getOrCreateMediaDir();
        $oldFileName = $this->getValueByPath( $this->get(), implode('/', array_slice(explode('/', $path), 2)));
        $fileName = $this->getUniqueFileName($mediaDir, $file->getClientOriginalName());
        $file->move($mediaDir, $fileName);

        if (!$isImage) {
            if ($oldFileName) {
                $this->removeImageWithThumbnails($mediaDir, $oldFileName);
            }
            return self::saveValueByPath($path, $fileName);
        }

        list($width, $height) = getimagesize($mediaDir .'/'. $fileName);
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

    public function createChildren($path, $value)
    {
        $path_arr = array_slice(explode('/', $path), 2);
        $childSlug = substr(end($path_arr), 0, -1);
        $path_arr[] = $childSlug;
        $path = implode('/', $path_arr);

        $settings = $this->get();
        $children = $this->getValueByPath($settings, $path);

        $childrenCount = 0;
        if ($children) {
            $children = $this->asList($children);
            $childrenCount = count($children);

            // We should tell SITE_SETTINGS that this is an array if only one children exists
            // @TODO implement type=array in xml structure
            if ($childrenCount == 1) {
                $this->setValueByPath(
                    $this->SITE_SETTINGS,
                    $path,
                    $children
                );
            }
        }

        foreach ($value as $k => $v) {
            $this->setValueByPath(
                $this->SITE_SETTINGS,
                "{$path}/{$childrenCount}/{$k}",
                $v
            );
        }

        $this->array2xmlFile($this->SITE_SETTINGS, $this->XML_FILE, $this->ROOT_ELEMENT);
        return $value;
    }

    public function deleteChildren($path, $value)
    {
        $path_arr = array_slice(explode('/', $path), 2);
        $parentPath = implode('/', $path_arr);
        $childSlug = substr(end($path_arr), 0, -1);
        $path_arr[] = $childSlug;
        $path = implode('/', $path_arr);

        $settings = $this->get();
        $children = $this->asList($this->getValueByPath($settings, $path));

        $child = array_splice($children, $value, 1);
        $children = $this->asList($children);

        if ($children) {
            $this->setValueByPath(
                $this->SITE_SETTINGS,
                $path,
                $children
            );
        } else {
            $this->unsetValueByPath(
                $this->SITE_SETTINGS,
                $parentPath
            );

            // Also remove parent node if parent is empty
            if (!$this->SITE_SETTINGS[$path_arr[0]]) {
                $this->unsetValueByPath(
                    $this->SITE_SETTINGS,
                    $path_arr[0]
                );
            }
        }

        $this->array2xmlFile($this->SITE_SETTINGS, $this->XML_FILE, $this->ROOT_ELEMENT);
        return $child;
    }

    public function reload() {
        $this->SITE_SETTINGS = $this->fixTemplateName($this->xmlFile2array($this->XML_FILE));
    }

    /**
     * Update version in template name to current version, save and return the settings.
     *
     * In old Berta versions templates have old versions.
     * For instance `messy-0.4.0` instead of `messy-0.4.2` (or whatever the current is).
     * To work around this legacy feature we fid the template that starts with the same name
     * and use it's current version instead.
     *
     * @param array $settings
     * @return array
     */
    private function fixTemplateName($settings) {
        $availableTemplates = array_keys($this->siteTemplatesConfigService->get());

        if (empty($settings['template']['template']) || in_array($settings['template']['template'], $availableTemplates)) {
            return $settings;
        }

        list($name) = explode('-', $settings['template']['template']);
        // This is equivalent to find function in JS
        $actualName = current(array_filter($availableTemplates, function($template) use ($name) {
            return starts_with($template, $name);
        }));

        if (!$actualName) {
            $actualName = self::$DEFAULT_SITE_SETTINGS['template/template'];
        }

        $settings['template']['template'] = $actualName;
        $this->array2xmlFile($settings, $this->XML_FILE, $this->ROOT_ELEMENT);

        return $settings;
    }

    /**
     * Merge site settings from other source folder
     * @param string $src_root settings source root folder
     */
    public function mergeSiteSettings($src_root)
    {
        $currentSiteSettings = $this->get();
        $newSiteSettings = $this->xmlFile2array($src_root . '/settings.xml');
        $siteSettingsConfig = $this->siteSettingsConfigService->get();

        // Merge only those settings that affects site style
        foreach ($siteSettingsConfig as $groupKey => $group) {
            foreach ($group as $settingKey => $setting) {
                if (!(isset($setting['affectsStyle']) && $setting['affectsStyle'])) {
                    continue;
                }

                // overwrite with defined value from new settings
                if (isset($newSiteSettings[$groupKey][$settingKey])) {
                    $currentSiteSettings[$groupKey][$settingKey] = $newSiteSettings[$groupKey][$settingKey];
                // remove existing one and keep the new default value from template settings definitions
                } else {
                    unset($currentSiteSettings[$groupKey][$settingKey]);
                }
            }

            if (empty($currentSiteSettings[$groupKey])) {
                unset($currentSiteSettings[$groupKey]);
            }
        }
        $this->array2xmlFile($currentSiteSettings, $this->XML_FILE, $this->ROOT_ELEMENT);

        return $currentSiteSettings;
    }
}
