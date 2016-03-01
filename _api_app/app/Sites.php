<?php

namespace App;

class Sites Extends Storage {
    private $XML_FILE;
    private $SITES = array();
    private $ROOT_ELEMENT = 'sites';

    public function __construct() {
        parent::__construct();
        $this->XML_FILE = $this->XML_SITES_ROOT . '/sites.xml';
    }

    /**
    * Returns all sites as an array
    *
    * @return array Array of sites
    */
    public function get() {
        if (empty($this->SITES)) {
            $this->SITES = $this->xmlFile2array($this->XML_FILE);

            if (empty($this->SITES)) {
                // case for a single site (when storage/-sites does not exist)
                $this->SITES = array(
                    'site' => array(
                        0 => array('name' => '', 'title' => '')
                    )
                );
            }
        }

        return $this->SITES;
    }

    public function create($cloneFrom=null) {
        $sites = $this->get();
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
        $site['idx'] = count($sites['site']) - 1;

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
        $sites = $this->get();
        $path_arr = explode('/', $path);
        $site_name = $sites['site'][$path_arr[1]]['name'];
        $site_root = $this->XML_SITES_ROOT . '/' . $site_name;
        $prop = array_pop($path_arr);
        $value = trim(urldecode($value));
        $ret = array(
            'path' => $path,
            'value' => $value
        );

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

            $value = $this->slugify($value, '-', '-');
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

        return $ret;
    }

    /**
    */
    public function delete($name) {
        $sites = $this->get();
        $site_idx = array_search($name, array_column($sites['site'], 'name'));

        if ($site_idx !== False) {
            $dir = $this->XML_SITES_ROOT . '/' . $name;
            $this->delFolder($dir);
            $site = array_splice($sites['site'], $site_idx, 1);
            $this->array2xmlFile($sites, $this->XML_FILE, $this->ROOT_ELEMENT);
            return $site[0];
        }

        return array('error_message' => 'Site "'.$name.'" not found!');
    }

    /**
    * Reorder sites and save to XML file
    *
    * @param array $names Array of site names in a new order
    */
    public function order($names) {
        $sites = $this->get();
        $new_order = array();

        foreach($names as $name) {
            $site_name = ($name == '0') ? '' : $name;
            $site_idx = array_search($site_name, array_column($sites['site'], 'name'));

            if ($site_idx !== false) {
                $new_order[] = $sites['site'][$site_idx];
            }
        }

        if (count($new_order) == count($sites['site'])) {
            $sites['site'] = $new_order;
            $this->array2xmlFile($sites, $this->XML_FILE, $this->ROOT_ELEMENT);
        }
    }
}
