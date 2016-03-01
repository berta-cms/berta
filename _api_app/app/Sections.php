<?php

namespace App;

use App\Entries;
use App\Tags;

class Sections Extends Storage {
    private $ROOT_ELEMENT = 'sections';
    private $SECTIONS = array();
    private $XML_FILE;

    public function __construct($site='') {
        parent::__construct($site);
        $xml_root = $this->getSiteXmlRoot($site);
        $this->XML_FILE = $xml_root . '/sections.xml';
    }

    /**
    * Returns all sections of site as an array
    *
    * @return array Array of sections
    */
    public function get() {
        if (empty($this->SECTIONS)) {
            $this->SECTIONS = $this->xmlFile2array($this->XML_FILE);

            if (empty($this->SECTIONS)) {
                $this->SECTIONS = array(
                    'section' => array()
                );
            }
        }

        return $this->SECTIONS;
    }

    public function create($name=null, $title=null) {
        $sections = $this->get();

        if ($name !== null) {
            $section_idx = array_search($name, array_column($sections['section'], 'name'));

            if ($section_idx === false) {
                return array('error_message' => 'Section "'.$name.'" not found!');
            }

            $entries = new Entries($this->SITE, 'clone-of-'.$name, 'clone of '.$title);
            $section_entries = $entries->create($name);

            $section = $sections['section'][$section_idx];
            $section['name'] = $section_entries['name'];
            $section['title'] = $section_entries['title'];
            unset($section['positionXY']);

            // copy mediafolder
            if (isset($section['mediafolder'])) {
                $section['mediafolder'] =str_replace(
                    $name,
                    $section_entries['name'],
                    $section['mediafolder']
                );

                $this->copyFolder(
                    realpath($this->MEDIA_ROOT) .'/'. $sections['section'][$section_idx]['mediafolder'],
                    realpath($this->MEDIA_ROOT) .'/'. $section['mediafolder']
                );
            }

            $section_idx = count($sections);
            $sections['section'][] = $section;
        } else {
            $section_idx = count($sections);
            $entries = new Entries($this->SITE, 'untitled' . uniqid(), $title);
            $section_entries = $entries->create();

            $section = array(
                '@attributes' => array('tags_behavior' => 'invisible', 'published'=>1),
                'name' => $section_entries['name'],
                'title' => ''
            );
            $sections['section'][] = $section;
        }

        $section_tags = array('tags' => array());

        if ($name !== null) {
            $tags = new Tags($this->SITE, $section['name']);
            $section_tags = $tags->populateTags();
            $allHaveTags = $section_tags['allHaveTags'];

            // update direct content property
            $sections['section'][$section_idx]['@attributes']['has_direct_content'] = !$allHaveTags ? '1' : '0';
        }

        $this->array2xmlFile($sections, $this->XML_FILE, $this->ROOT_ELEMENT);

        return array(
            'site' => $this->SITE,
            'idx' => $section_idx,
            'section' => $section,
            'entries' => $section_entries['entries'],
            'tags' => $section_tags['tags']
        );
    }

    /**
    * Saves a value with a given path and saves the change to XML file
    *
    * @param string $path Slash delimited path to the value
    * @param mixed $value Value to be saved
    * @return array Array of changed value and/or error messages
    */
    public function saveValueByPath($path, $value) {
        $sections = $this->get();
        $path_arr = array_slice(explode('/', $path), 1);
        $prop = $path_arr[count($path_arr) - 1];
        $section_idx = $path_arr[1];
        $value = trim(urldecode($value));
        $ret = array(
            'site' => $this->SITE,
            'section_idx' => $section_idx,
            'old_name' => null,
            'path' => $path,
            'value' => $value
        );

        if ($prop === 'title') {
            $old_name = $sections['section'][$section_idx]['name'];
            $old_title = $sections['section'][$section_idx]['title'];
            $new_name = $this->getUniqueSlug($old_name, $value);

            if(empty($value)) {
                $ret['value'] = $old_title;
                $ret['error_message'] = 'Section name cannot be empty!';
                return $ret;
            }

            $this->setValueByPath(
                $sections,
                'section/' . $section_idx . '/name',
                $new_name
            );

            $entries = new Entries($this->SITE, $old_name, $old_title);
            $ret = array_merge($ret, $entries->rename($new_name, $value));

            if (!$ret['success']) {
                $ret['value'] = $old_title;
                return $ret;
            }

            $tags = new Tags($this->SITE, $old_name);
            $tags->renameSection($new_name);
            $ret['old_name'] = $old_name;
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
        $ret['section'] = $sections['section'][$section_idx];

        return $ret;
    }

    /**
    */
    public function deleteValueByPath($path) {
        $sections = $this->get();
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
        $sections = $this->get();
        $section_idx = array_search($name, array_column($sections['section'], 'name'));

        if ($section_idx !== False) {
            // delete all entries
            $entries = new Entries($this->SITE, $name);
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
            $tags = new Tags($this->SITE, $name);
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
        $sections = $this->get();
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
        $sections = $this->get();
        $section_idx = array_search($name, array_column($sections['section'], 'name'));

        if ($section_idx !== false) {
            $section =& $sections['section'][$section_idx];

            if (!isset($section['mediaCacheData'])) {
                return array('error_message' => 'File "'.$file.'" not found!');
            }

            $files = $this->asList($section['mediaCacheData']['file']);
            $file_idx = array_search(
                $file,
                array_column(
                    array_column(
                        $files,
                        '@attributes'
                    ),
                    'src'
                )
            );

            if ($file_idx === false) {
                return array('error_message' => 'File "'.$file.'" not found!');
            }

            $mediafolder = $this->MEDIA_ROOT . '/' . $section['mediafolder'] . '/';
            $this->deleteMedia($mediafolder, $file);

            $file = array_splice($section['mediaCacheData']['file'], $file_idx, 1);
            $this->array2xmlFile($sections, $this->XML_FILE, $this->ROOT_ELEMENT);

            return array(
                'site' => $this->SITE,
                'section_idx' => $section_idx,
                'file_idx' => $file_idx,
                'sections' => $sections
            );
        }

        return array('error_message' => 'Section "'.$name.'" not found!');
    }

    /**
    */
    public function galleryOrder($name, $new_files) {
        $sections = $this->get();
        $section_idx = array_search($name, array_column($sections['section'], 'name'));

        if ($section_idx !== false) {
            $section =& $sections['section'][$section_idx];
            $section['mediaCacheData'] = isset($section['mediaCacheData']) ? $section['mediaCacheData'] : array('file' => array());
            $files = $this->asList($section['mediaCacheData']['file']);
            $reordered = array();

            foreach($new_files as $file) {
                $file_idx = array_search(
                    $file,
                    array_column(
                        array_column(
                            $files,
                            '@attributes'
                        ),
                        'src'
                    )
                );

                if ($file_idx !== false) {
                    array_push($reordered, $files[$file_idx]);
                }
            }

            $section['mediaCacheData']['file'] = $reordered;
            $this->array2xmlFile($sections, $this->XML_FILE, $this->ROOT_ELEMENT);

            return array(
                'site' => $this->SITE,
                'section' => $name,
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
        $sections = $this->get();
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
