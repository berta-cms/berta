<?php

namespace App\Sites\TemplateSettings;

use App\Shared\Storage;
use App\Config\SiteTemplatesConfigService;

class SiteTemplateSettingsDataService extends Storage
{
    private $ROOT_ELEMENT = 'settings';
    private $TEMPLATE;
    private $XML_FILE;
    private $siteTemplateDefaults;

    public function __construct($site = '', $template = 'messy-0.4.2')
    {
        parent::__construct($site);
        $xml_root = $this->getSiteXmlRoot($site);
        $this->TEMPLATE = explode('-', $template)[0];
        $this->XML_FILE = $xml_root . '/settings.' . $this->TEMPLATE . '.xml';

        $siteTemplatesConfigService = new SiteTemplatesConfigService();
        $this->siteTemplateDefaults = $siteTemplatesConfigService->getDefaults()[$template]['templateConf'];
    }

    public function get()
    {
        $siteTemplateSettings = $this->xmlFile2array($this->XML_FILE);

        return $siteTemplateSettings;
    }

    public function getState()
    {
        $siteTemplateSettings = $this->xmlFile2array($this->XML_FILE);
        $siteTemplateSettings = self::mergeSiteTemplateDefaults($this->siteTemplateDefaults, $siteTemplateSettings);

        return $siteTemplateSettings;
    }

    /**
     * Merge site template settings with site template default values
     */
    private static function mergeSiteTemplateDefaults($siteTemplatesDefaults, $siteTemplateSettings) {
        $data = [];
        foreach($siteTemplatesDefaults as $group => $settings){
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
     * @param string $path Slash delimited path to the value
     * @param mixed $value Value to be saved
     * @return array Array of changed value and/or error messages
     */
    public function saveValueByPath($path, $value)
    {
        $site_template_settings = $this->get();
        $path_arr = array_slice(explode('/', $path), 3);
        $value = trim(urldecode($value));

        $ret = array(
            'site' => $this->SITE == '0' ? '' : $this->SITE,
            'path' => $path,
            'value' => $value,
        );

        $this->setValueByPath(
            $site_template_settings,
            implode('/', $path_arr),
            $value
        );

        $this->array2xmlFile($site_template_settings, $this->XML_FILE, $this->ROOT_ELEMENT);

        return $ret;
    }
}
