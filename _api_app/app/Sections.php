<?php

namespace App;

use App\Entries;

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
                'title' => array('value' => '')
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
    public function order($site, $names) {
        $site = $site == '0' ? 0 : $site;
        $sections = $this->getSectionsBySite($site);
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
}
