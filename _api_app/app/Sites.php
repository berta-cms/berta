<?php
namespace App;

/**
 * @class Sites
 *
 * This model handles storing, updating, deleting multi site data in Berta.
 *
 * When there is only one site, the model will always return the same hard-coded data. Otherwise will read/write the
 * the data in `storage/-sites/sites.xml`
 *
 * File example:
```xml
<?xml version="1.0" encoding="utf-8"?>
<sites>
    <!-- This is the first and main site, that exists always even when there is just one site -->
    <site published="1">
        <name><![CDATA[]]></name>
        <title><![CDATA[Main site]]></title>
    </site>
    <!-- This is an example of additional site data. -->
    <site published="0">
        <name><![CDATA[other-site]]></name>
        <title><![CDATA[Other site]]></title>
    </site>
</sites>
```
 */
class Sites Extends Storage {
    private $XML_FILE;
    private $SITES = array();
    private $ROOT_ELEMENT = 'sites';
    private $JSON_SCHEME = [
        '$schema' => "http://json-schema.org/draft-06/schema#",
        'type' => 'array',
        'items' => [
            'type' => 'object',
            'properties' => [
                'name' => ['type' => 'string'],
                'title' => ['type' => 'string'],
                '@attributes' => [
                    'type' => 'object',
                    'properties' => [
                        'published' => [
                            'type' => 'integer',
                            'minimum' => 0,
                            'maximum' => 1
                        ]
                    ]
                ]
            ],
            'required' => ['name']
        ]
    ];

    private static $DEFAULT_VALUES = [
        'name' => '',
        '@attributes' => [
            'published' => 0
        ]
    ];

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
        if (!($this->SITES)) {
            $this->SITES = $this->xmlFile2array($this->XML_FILE);

            if (!($this->SITES)) {
                // Return only main site when storage/-sites does not exist
                $this->SITES[] = [
                    'name' => null,
                    'title' => 'Main site',
                    '@attributes' => ['published' => 1]
                ];
            } else {
                $this->SITES = $this->asList($this->SITES['site']);
            }
        }

        return $this->SITES;
    }

    /**
     * Returns all sites transformed for frontend needs
     *
     * @return array Array of sites
     */
    public function state() {
        $sites = $this->get();
        foreach ($sites as $order => $site) {
            $sites[$order]['order'] = $order;
        }

        return $sites;
    }

    public function create($cloneFrom=null) {
        $sites = $this->get();
        $name = 'untitled-' . uniqid();
        $dir = $this->XML_SITES_ROOT . '/' . $name;

        @mkdir($dir, 0777, true);

        if ($cloneFrom != null) {
            $src = $cloneFrom == '0' ? $this->XML_MAIN_ROOT : $this->XML_SITES_ROOT . '/' . $cloneFrom;
            $this->copyFolder($src, $dir);
        }

        $site = [
            'name' => $name,
            'title' => '',
            '@attributes' => array('published' => 0)
        ];
        array_push($sites, $site);

        $this->array2xmlFile(['site' => $sites], $this->XML_FILE, $this->ROOT_ELEMENT);
        $site['order'] = count($sites) - 1;

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
        $sites['site'] = $this->get();
        $path_arr = explode('/', $path);
        $site_name = $sites['site'][$path_arr[1]]['name'];
        $site_root = $this->XML_SITES_ROOT . '/' . $site_name;
        $prop = array_pop($path_arr);
        $value = trim(urldecode($value));
        $ret = array(
            'path' => $path,
            'value' => $value,
            'status_code' => 200
        );

        if (!file_exists($this->XML_SITES_ROOT)) {
            @mkdir($this->XML_SITES_ROOT, 0777);
        }

        if(!file_exists($site_root)) {
            $ret['value'] = $site_name;
            $ret['error_message'] = 'Current site storage dir does not exist! you\'ll have to delete this site!';
            $ret['status_code'] = 400;
            return $ret;
        }

        if ($prop == 'name') {
            if (empty($value)) {
                $ret['value'] = $site_name;
                $ret['error_message'] = 'Site name cannot be empty!';
                $ret['status_code'] = 400;
                return $ret;
            }

            $value = $this->slugify($value, '-', '-');
            $new_root = $this->XML_SITES_ROOT . '/' . $value;

            if(file_exists($new_root)) {
                $ret['value'] = $site_name;
                $ret['error_message'] = 'Site cannot be created! another site with the same (or too similar name) exists.';
                $ret['status_code'] = 400;
                return $ret;
            }

            if(!@rename($site_root, $new_root)) {
                $ret['value'] = $site_name;
                $ret['error_message'] = 'Storage dir cannot be renamed! check permissions and be sure the name of the site is not TOO fancy.';
                $ret['status_code'] = 500;
                return $ret;
            }

            $ret['value'] = $value;
        }

        $this->setValueByPath($sites, $path, $value);
        $this->array2xmlFile($sites, $this->XML_FILE, $this->ROOT_ELEMENT);

        return $ret;
    }

    /**
    */
    public function delete($name) {
        $sites['site'] = $this->get();
        $order = array_search($name, array_column($sites['site'], 'name'));

        if ($order !== False) {
            $dir = $this->XML_SITES_ROOT . '/' . $name;
            $this->delFolder($dir);
            $site = array_splice($sites['site'], $order, 1);
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
        $sites['site'] = $this->get();
        $new_order = array();

        foreach($names as $name) {
            $site_name = ($name == '0') ? '' : $name;
            $order = array_search($site_name, array_column($sites['site'], 'name'));

            if ($order !== false) {
                $new_order[] = $sites['site'][$order];
            }
        }

        if (count($new_order) == count($sites['site'])) {
            $sites['site'] = $new_order;
            $this->array2xmlFile($sites, $this->XML_FILE, $this->ROOT_ELEMENT);
        }
    }
}
