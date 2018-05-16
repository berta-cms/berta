<?php

namespace App\Sites\Sections;

use App\Shared\Storage;
use App\Sites\Sections\SiteSectionTagsDataService;
use App\Sites\Sections\Entries\SectionEntriesDataService;


/**
 * This class is a service that handles site section data for Berta CMS.
 * Sections are stored in `sections.xml` file for the corresponding site.
 *
 * The root site has its sections stored in `storage/sections.xml`,
 * any other site has it's sections in `storage/-sites/[site name]/sections.xml`
 *
 * @example an example of XML file:
 * ```xml
 * <?xml version="1.0" encoding="utf-8"?>
 * <sections>
 *   <section tags_behavior="invisible" published="1" entry_count="2" has_direct_content="0">
 *     <name><![CDATA[first section]]></name>
 *     <title><![CDATA[First Section]]></title>
 *     <backgroundVideoEmbed><![CDATA[https://youtu.be/video]]></backgroundVideoEmbed>
 *     <mediafolder><![CDATA[media-folder]]></mediafolder>
 *     <mediaCacheData hide_navigation="yes" caption_bg_color="235,73,73" autoplay="0" image_size="small">
 *       <file type="image" src="some-image.jpg" width="1200" height="640"><![CDATA[<p>A caption for this image</p>]]></file>
 *     </mediaCacheData>
 *   </section>
 *   <section tags_behavior="invisible" published="1" has_direct_content="0">
 *     <name><![CDATA[second section]]></name>
 *   </section>
 * </sections>
 * ```
 */
class SiteSectionsDataService Extends Storage {
    /**
     * @var array $JSON_SCHEMA
     * Associative array representing data structure handled by this service.
     *
     */
    public static $JSON_SCHEMA = [
        '$schema' => "http://json-schema.org/draft-07/schema#",
        'type' => 'array',
        'items' => [ // <section>
            'type' => 'object',
            'properties' => [
                'name' => ['type' => 'string'],
                'title' => ['type' => 'string'],
                'backgroundVideoEmbed' => ['type' => 'string'],
                'mediafolder' => ['type' => 'string'],
                'mediaCacheData' => [
                    'type' => 'object',
                    'properties' => [
                        'file' => [
                            '$comment' => 'This field is a result of all <file> tags existing inside of <mediaCacheData> conversion to JSON',
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                '@value' => ['type' => 'string'],
                                '@attributes' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'type' => ['type' => 'string'],
                                        'src' => ['type' => 'string'],
                                        'width' => ['type' => 'integer'],
                                        'height' => ['type' => 'integer'],
                                    ]
                                ]
                            ]
                        ],
                        '@attributes' => [
                            'type' => 'object',
                            'properties' => [
                                'hide_navigation' => [
                                    'type' => 'string',
                                    'enum' => ['yes', 'no'],
                                    'format' => 'bt-select'
                                ],
                                'caption_bg_color' => ['type' => 'string'],
                                'autoplay' => [
                                    'type' => 'integer',
                                    'enum' => [0, 1]
                                ],
                                'image_size' => ['type' => 'string'],
                            ]
                        ]
                    ]
                ],
                '@attributes' => [
                    'type' => 'object',
                    'properties' => [
                        'tags_behavior' => ['type' => 'string'],
                        'entry_count' => [
                            'type' => 'integer',
                            'minimum' => 0
                        ],
                        'published' => [
                            'type' => 'integer',
                            'enum' => [0, 1]
                        ],
                        'has_direct_content' => [
                            'type' => 'integer',
                            'enum' => [0, 1]
                        ]
                    ]
                ]
            ],
            'required' => ['name']
        ]
    ];
    protected static $DEFAULT_VALUES = [
        'name' => '',
        '@attributes' => [
            'tags_behavior' => 'invisible',
            'published' => 0,
            'has_direct_content' => 0
        ]
    ];

    private $ROOT_ELEMENT = 'sections';
    private $SECTIONS = array();
    private $XML_FILE;
    private $site_name;

    public function __construct($site='') {
        parent::__construct($site);
        $this->site_name = $site;
        $xml_root = $this->getSiteXmlRoot($site);
        $this->XML_FILE = $xml_root . '/sections.xml';
    }

    /**
    * Returns all sections of site as an array
    *
    * @return array Array of sections
    */
    public function get() {
        if (!$this->SECTIONS) {
            $this->SECTIONS = $this->xmlFile2array($this->XML_FILE);

            if ($this->SECTIONS) {
                $this->SECTIONS = $this->asList($this->SECTIONS['section']);

                foreach ($this->SECTIONS as $order => $section) {
                    if (isset($section['mediaCacheData']['file'])) {
                        $this->SECTIONS[$order]['mediaCacheData']['file'] = $this->asList($section['mediaCacheData']['file']);
                    }
                }
            }
        }

        return $this->SECTIONS;
    }

    /**
     * Returns all site sections transformed for frontend needs
     *
     * @return array Array of sections
     */
    public function state() {
        $sections = $this->get();
        foreach ($sections as $order => $section) {
            $sections[$order]['site_name'] = $this->site_name;
            $sections[$order]['order'] = $order;
        }

        return $sections;
    }

    public function create($name=null, $title=null) {
        $isClone = $name !== null;
        $sections = $this->get();

        // Clone section
        if ($isClone) {
            $title = empty($title) ? $name : $title;
            $section_order = array_search($name, array_column($sections, 'name'));

            if ($section_order === false) {
                return array('error_message' => 'Section "'.$name.'" not found!');
            }

            // Berta requires existing section file for entries
            $entries = new SectionEntriesDataService($this->SITE, 'clone-of-'.$name, 'clone of '.$title);
            $section_entries = $entries->create($name);

            $section = $sections[$section_order];
            $section['name'] = $section_entries['name'];
            $section['title'] = $section_entries['title'];
            unset($section['positionXY']);

            // copy mediafolder
            if (isset($section['mediafolder'])) {
                $section['mediafolder'] = $section_entries['name'] . '-background';

                $this->copyFolder(
                    realpath($this->MEDIA_ROOT) .'/'. $sections[$section_order]['mediafolder'],
                    realpath($this->MEDIA_ROOT) .'/'. $section['mediafolder']
                );
            }

            $section_order = count($sections);

        } else {
            $name = 'untitled-' . uniqid();

            // Berta requires existing section file for entries
            $entries = new SectionEntriesDataService($this->SITE, $name, $title);
            $section_entries = $entries->create();

            $section = [
                '@attributes' => array('tags_behavior' => 'invisible', 'published'=>1),
                'name' => $name,
                'title' => ''
            ];
        }

        array_push($sections, $section);

        // Clone section
        if ($isClone) {
            $tags = new SiteSectionTagsDataService($this->SITE, $section['name']);
            $section_tags = $tags->populateTags();
            $allHaveTags = $section_tags['allHaveTags'];

            // update direct content property
            // @TODO redux also should know about this attribute change!
            $sections[$section_order]['@attributes']['has_direct_content'] = !$allHaveTags ? '1' : '0';
        }

        $this->array2xmlFile(['section' => $sections], $this->XML_FILE, $this->ROOT_ELEMENT);

        $section['order'] = count($sections) - 1;
        $section['site_name'] = $this->site_name;

        // @TODO Also return cloned entries and tags
        return $section;
    }

    /**
    * Saves a value with a given path and saves the change to XML file
    *
    * @param string $path Slash delimited path to the value
    * @param mixed $value Value to be saved
    * @return array Array of changed value and/or error messages
    */
    public function saveValueByPath($path, $value) {
        $sections['section'] = $this->get();
        $path_arr = array_slice(explode('/', $path), 1);
        $prop = $path_arr[count($path_arr) - 1];
        $order = $path_arr[1];
        $value = trim(urldecode($value));
        $ret = array(
            'site' => $this->site_name,
            'order' => $order,
            'old_name' => null,
            'path' => $path,
            'value' => $value,
            'real' => $value
        );

        if ($prop === 'title') {
            $old_name = $sections['section'][$order]['name'];
            $old_title = isset($sections['section'][$order]['title']) ? $sections['section'][$order]['title'] : '';
            $new_name = $this->getUniqueSlug($old_name, $value);

            if(empty($value)) {
                $ret['value'] = $old_title;
                $ret['error_message'] = 'Section name cannot be empty!';
                return $ret;
            }

            // Rename section name
            $this->setValueByPath(
                $sections,
                'section/' . $order . '/name',
                $new_name
            );

            // Rename section background path
            if (isset($sections['section'][$order]['mediafolder'])) {
                $mediafolder = $new_name . '-background';

                @rename(
                    realpath($this->MEDIA_ROOT) .'/'. $sections['section'][$order]['mediafolder'],
                    realpath($this->MEDIA_ROOT) .'/'. $mediafolder
                );

                $this->setValueByPath(
                    $sections,
                    'section/' . $order . '/mediafolder',
                    $mediafolder
                );
            }

            $entries = new SectionEntriesDataService($this->SITE, $old_name, $old_title);
            $ret = array_merge($ret, $entries->rename($new_name, $value));

            if (!$ret['success']) {
                $ret['value'] = $old_title;
                return $ret;
            }

            $tags = new SiteSectionTagsDataService($this->SITE, $old_name);
            $tags->renameSection($new_name);
            $ret['old_name'] = $old_name;
            $ret['real'] = $new_name;
        }

        if ($prop === 'caption_bg_color') {
            $value = implode(',', sscanf($value, '#%02x%02x%02x'));
        }

        $this->setValueByPath(
            $sections,
            implode('/', $path_arr),
            $value
        );

        $this->array2xmlFile($sections, $this->XML_FILE, $this->ROOT_ELEMENT);
        $ret['section'] = $sections['section'][$order];

        return $ret;
    }

    /**
    */
    public function deleteValueByPath($path) {
        $sections['section'] = $this->get();
        $path_arr = array_slice(explode('/', $path), 1);
        $section_idx = $path_arr[1];
        $this->unsetValueByPath($sections, implode('/', $path_arr));
        $this->array2xmlFile($sections, $this->XML_FILE, $this->ROOT_ELEMENT);
        $ret = array(
            'site' => $this->SITE,
            'section_idx' => $section_idx,
            'path' => $path
        );
        return $ret;
    }

    /**
    */
    public function delete($name) {
        $sections['section'] = $this->get();
        $section_idx = array_search($name, array_column($sections['section'], 'name'));

        if ($section_idx !== False) {
            // delete all entries
            $entries = new SectionEntriesDataService($this->SITE, $name);
            $res = $entries->delete();

            if (!$res['success']) {
                return $res;
            }

            // delete section media
            $section = $sections['section'][$section_idx];

            if(array_key_exists('mediafolder', $section) and !empty($section['mediafolder'])) {
                $mediaFolder = $this->MEDIA_ROOT . '/' . $section['mediafolder'];

                if(file_exists($mediaFolder)) {
                    $dir = opendir($mediaFolder);

                    while($fItem = readdir($dir)) {
                        if($fItem != '.' && $fItem != '..') {
                            @unlink($mediaFolder . '/' . $fItem);
                        }
                    }

                    if (!@rmdir($mediaFolder)) {
                        return array(
                            'success' => false,
                            'error_message' => 'Unable to remove folder "' . $mediaFolder . '"!'
                        );
                    }
                }
            }

            // delete tags
            $tags = new SiteSectionTagsDataService($this->SITE, $name);
            $section_tags = $tags->delete();

            // delete section
            $section = array_splice($sections['section'], $section_idx, 1);
            $this->array2xmlFile($sections, $this->XML_FILE, $this->ROOT_ELEMENT);
            $ret = $section[0];
            $ret['site'] = $this->SITE;
            return $ret;
        }

        return array('error_message' => 'Section "'.$name.'" not found!');
    }

    /**
    * Reorder sections and save to XML file
    *
    * @param array $names Array of section names in a new order
    */
    public function order($names) {
        $sections['section'] = $this->get();
        $new_order = array();

        foreach($names as $section_name) {
            $section_idx = array_search($section_name, array_column($sections['section'], 'name'));

            if ($section_idx !== false) {
                $new_order[] = $sections['section'][$section_idx];
            }
        }

        if (count($new_order) == count($sections['section'])) {
            $sections['section'] = $new_order;
            $this->array2xmlFile($sections, $this->XML_FILE, $this->ROOT_ELEMENT);
        }
    }

    /**
    */
    public function galleryDelete($name, $file) {
        $sections['section'] = $this->get();
        $section_order = array_search($name, array_column($sections['section'], 'name'));

        if ($section_order !== false) {
            $section =& $sections['section'][$section_order];

            if (!isset($section['mediaCacheData'])) {
                return ['error_message' => 'File "'.$file.'" not found!'];
            }

            $files = $this->asList($section['mediaCacheData']['file']);
            $file_order = array_search(
                $file,
                array_column(
                    array_column(
                        $files,
                        '@attributes'
                    ),
                    'src'
                )
            );

            if ($file_order === false) {
                return ['error_message' => 'File "'.$file.'" not found!'];
            }

            $mediafolder = $this->MEDIA_ROOT . '/' . $section['mediafolder'] . '/';
            $this->deleteMedia($mediafolder, $file);

            $file = current(array_splice($section['mediaCacheData']['file'], $file_order, 1));
            $this->array2xmlFile($sections, $this->XML_FILE, $this->ROOT_ELEMENT);

            return [
                'site' => $this->SITE,
                'section' => $section['name'],
                'file' => $file['@attributes']['src']
            ];
        }

        return ['error_message' => 'Section "'.$name.'" not found!'];
    }

    /**
    */
    public function galleryOrder($name, $new_files) {
        $sections['section'] = $this->get();
        $section_order = array_search($name, array_column($sections['section'], 'name'));

        if ($section_order !== false) {
            $section =& $sections['section'][$section_order];
            $section['mediaCacheData'] = isset($section['mediaCacheData']) ? $section['mediaCacheData'] : array('file' => array());
            $files = $this->asList($section['mediaCacheData']['file']);
            $reordered = array();

            foreach($new_files as $file) {
                $file_order = array_search(
                    $file,
                    array_column(
                        array_column(
                            $files,
                            '@attributes'
                        ),
                        'src'
                        )
                    );

                    if ($file_order !== false) {
                        array_push($reordered, $files[$file_order]);
                    }
                }

                $section['mediaCacheData']['file'] = $reordered;
                $this->array2xmlFile($sections, $this->XML_FILE, $this->ROOT_ELEMENT);

            return array(
                'site' => $this->SITE,
                'section' => $name,
                'mediafolder' => $section['mediafolder'],
                'files' => $reordered
            );
        }

        return array('error_message' => 'Section "'.$name.'" not found!');
    }

    /************************************************************
     * Private methods
     ************************************************************/

    /**
    */
    private function getUniqueSlug($old_name, $new_title){
        $sections['section'] = $this->get();
        $title = trim($new_title);

        if (strlen($title) < 1) {
            return '';
        }

        $slug = $this->slugify($new_title, '-', '\._-', true);
        $slug = $slug ? $slug : '_';

        $names = array_values(array_column($sections['section'], 'name'));
        $old_title_idx = array_search($old_name, $names);
        $_ = array_splice($names, $old_title_idx, 1);

        $notUnique = true;
        $i = 1;

        while ($notUnique) {
            if (in_array($slug, $names)) {
                $slug = preg_replace('/(^.*?)+([\-])+([0-9])+$/', '$1', $slug);
                $slug .= '-' . $i;

                $i++;
            }else{
                $notUnique = false;
            }
        }

        return $slug;
    }

    /**
    */
    private function deleteMedia($folder, $file='') {
        @unlink($folder . $file);

        if($handle = opendir($folder)) {
            while (false !== ($f = readdir($handle))) {
                if(!$file || strpos($f, $file) !== false) {
                    if(substr($f, 0, 1) == '_') {
                        @unlink($folder . $f);
                    }
                }
            }

            closedir($handle);
        }
    }
}
