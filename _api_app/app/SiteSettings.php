<?php

namespace App;

class SiteSettings extends Storage
{
    private $ROOT_ELEMENT = 'settings';
    private $XML_FILE;

    public function __construct($site = '')
    {
        parent::__construct($site);
        $xml_root = $this->getSiteXmlRoot($site);
        $this->XML_FILE = $xml_root . '/settings.xml';
    }

    /**
    * Returns settings of site as an array
    *
    * @return array Array of sections
    */
    public function get()
    {
        return $this->xmlFile2array($this->XML_FILE);
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
        $path_arr = array_slice(explode('/', $path), 2);
        $value = trim(urldecode($value));

        $ret = array(
            'site' => $this->SITE == '0' ? '' : $this->SITE,
            'path' => $path,
            'value' => $value,
        );

        if (!file_exists($this->XML_FILE)) {
            $ret['error_message'] = 'Settings file not found in storage!';
            return $ret;
        }

        $this->setValueByPath(
            $settings,
            implode('/', $path_arr),
            $value
        );

        $this->array2xmlFile($settings, $this->XML_FILE, $this->ROOT_ELEMENT);

        return $ret;
    }
}
