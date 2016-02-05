<?php

namespace App;

class Sites Extends Storage {
    private $SITES = array();
    private $ROOT_ELEMENT = 'sites';

    public function __construct() {
        parent::__construct('sites.xml');
    }

    /**
    * Returns all sites as an array
    *
    * @return array Array of sites
    */
    public function getSites() {
        if (empty($this->SITES)) {
            $this->SITES = $this->xmlFile2array($this->XML_FILE);

            if (empty($this->SITES)) {
                // case for a single site (when storage/-sites does not exist)
                $this->SITES = array('site' => array(0 => array('name' => '')));
            }
        }

        return $this->SITES;
    }

    public function createSite($cloneFrom=null) {
        $sites = $this->getSites();
        $name = 'untitled-' . uniqid();
        $dir = $this->XML_SITES_ROOT . '/' . $name;

        @mkdir($dir, 0777);

        if ($cloneFrom != null) {
            $src = $cloneFrom == '0' ? $this->XML_MAIN_ROOT : $this->XML_SITES_ROOT . '/' . $cloneFrom;
            $this->copyFolder($src, $dir);
        }

        $site = array(
            'name' => $name,
            'title' => '',
            '@attributes' => array('published' => 0)
        );
        $sites['site'][] = $site;

        $this->array2xmlFile($sites, $this->XML_FILE, $this->ROOT_ELEMENT);

        return $site;
    }

    /**
    * Saves a value with a given path and saves the change to XML file
    *
    * @param string $path Slash delimited path to the value
    * @param mixed $value Value to be saved
    * @return array Array of changed value and/or error messages
    */
    public function saveValueByPath($path, $value) {
        $sites = $this->getSites();
        $path_arr = explode('/', $path);
        $site_name = $sites['site'][$path_arr[1]]['name'];
        $site_root = $this->XML_SITES_ROOT . '/' . $site_name;
        $prop = array_pop($path_arr);
        $value = trim(urldecode($value));
        $ret = array();

        if(!file_exists($site_root)) {
            $ret['value'] = $site_name;
            $ret['error_message'] = 'Current site storage dir does not exist! you\'ll have to delete this site!';
            return $ret;
        }

        if ($prop == 'name') {
            if (empty($value)) {
                $ret['value'] = $site_name;
                $ret['error_message'] = 'Site name cannot be empty!';
                return $ret;
            }

            $value = $this->slugify($value);
            $new_root = $this->XML_SITES_ROOT . '/' . $value;

            if(file_exists($new_root)) {
                $ret['value'] = $site_name;
                $ret['error_message'] = 'Site cannot be created! another site with the same (or too similar name) exists.';
                return $ret;
            }

            if(!@rename($site_root, $new_root)) {
                $ret['value'] = $site_name;
                $ret['error_message'] = 'Storage dir cannot be renamed! check permissions and be sure the name of the site is not TOO fancy.';
                return $ret;
            }
        }

        $this->setValueByPath($sites, $path, $value);
        $this->array2xmlFile($sites, $this->XML_FILE, $this->ROOT_ELEMENT);
file_put_contents($this->XML_SITES_ROOT.'/debug.log', $value);
        $ret['value'] = $value;
        return $ret;
    }

    /**
    * Reorder sites and save to XML file
    *
    * @param array $names Array of site names in a new order
    */
    public function orderSites($names) {
        $sites = $this->getSites();
        $new_order = array();

        foreach($names as $name) {
            $site_name = ($name == '0') ? '' : $name;
            $site = array_filter($sites['site'], $this->getSiteByNameFilter($site_name));

            if (count($site) == 1) {
                $new_order[] = array_pop($site);
            }
        }

        if (count($new_order) == count($sites['site'])) {
            $sites['site'] = $new_order;
            $this->array2xmlFile($sites, $this->XML_FILE, $this->ROOT_ELEMENT);
        }
    }

    /**
    * Returns function to use in array_filter to get site by its name
    *
    * @param string $site_name Name of site to search for
    */
    private function getSiteByNameFilter($site_name) {
        return function($val) use ($site_name) {
            return $val['name'] == $site_name;
        };
    }
}
