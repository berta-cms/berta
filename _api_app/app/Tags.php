<?php

namespace App;

use App\Entries;

class Tags Extends Storage {
    private $ROOT_ELEMENT = 'sections';
    private $SECTION_NAME;
    private $XML_ROOT;
    private $XML_FILE;
    private $TAGS;

    public function __construct($site='', $sectionName='') {
        parent::__construct($site);
        $this->XML_ROOT = $this->getSiteXmlRoot($site);
        $this->SECTION_NAME = $sectionName;
        $this->XML_FILE = $this->XML_ROOT . '/tags.xml';
    }

    /**
    * Returns all tags of a given site as an array
    *
    * @param string $site name of the site
    * @return array Array of tags
    */
    public function get() {
        if (empty($this->TAGS)) {
            $this->TAGS = $this->xmlFile2array($this->XML_FILE);

            if (empty($this->TAGS)) {
                $this->TAGS = array(
                    'section' => array()
                );
            }
        }

        return $this->TAGS;
    }

    /**
    */
    public function delete() {
        $tags = $this->get();
        $tags_idx = array_search(
            $this->SECTION_NAME,
            array_column(
                array_column(
                    $tags['section'],
                    '@attributes'
                ),
                'name'
            )
        );

        if ($tags_idx !== False) {
            $section_tags = array_splice($tags['section'], $tags_idx, 1);
            $this->array2xmlFile($tags, $this->XML_FILE, $this->ROOT_ELEMENT);
            return $section_tags;
        }

        return array();
    }

    /**
    */
    public function populateTags() {
        // @@@:TODO: Maybe it's possibe to write this method
        //           in a shorter and/or more efficient way
        $tags = $this->get();
        $entries = new Entries($this->SITE, $this->SECTION_NAME);
        $blog = $entries->get();

        $newCache = array();
        $allHaveTags = true;
        $section_entry_count = 0;

        if (isset($blog['entry']) && !empty($blog['entry'])) {
            foreach($blog['entry'] as $key => $entry) {
                if($key === '@attributes') { continue; }

                $hasTags = false;

                if(isset($entry['tags'])) {
                    $_tags = $this->asList($entry['tags']['tag']);

                    foreach($_tags as $tag) {
                        $tag_name = trim((string) $tag);

                        if ($tag_name) {
                            $tag_name = $this->slugify($tag_name, '-', '-');
                            $c = isset($newCache[$tag_name]) ? $newCache[$tag_name]['@attributes']['entry_count'] : 0;
                            $newCache[$tag_name] = array(
                                '@value' => $tag,
                                '@attributes' => array(
                                    'name' => $tag_name,
                                    'entry_count' => ++$c
                                )
                            );
                            $section_entry_count++;
                            $hasTags = true;
                        }
                    }
                }

                $allHaveTags &= $hasTags;
            }
        }

        $section_idx = array_search(
            $this->SECTION_NAME,
            array_column(
                array_column(
                    $tags['section'],
                    '@attributes'
                ),
                'name'
            )
        );

        //to keep sorting order, we need to check old and new tag arrays
        //loop through old and check if exists and update, else do not add
        $tempCache = array();

        if ($section_idx !== false) {
            foreach ($tags['section'][$section_idx]['tag'] as $tag) {
                $tag_name = $tag['@attributes']['name'];
                if (isset($newCache[$tag_name])){
                    $tempCache[$tag_name] = $newCache[$tag_name];
                }
            }
        }

        //loop through new and check if exists, if not - add at bottom
        foreach ($newCache as $tag => $tagVars) {
            if ($section_idx !== false) {
                $tag_idx = array_search(
                    $tag,
                    array_column(
                        array_column(
                            $tags['section'][$section_idx]['tag'],
                            '@attributes'
                        ),
                        'name'
                    )
                );

                if ($tag_idx === false) {
                    $tempCache[$tag] = $tagVars;
                }
            } else {
                $tempCache[$tag] = $tagVars;
            }
        }

        if ($section_idx !== false) {
            $new_tags = array_values($tempCache);
            $tags['section'][$section_idx]['tag'] = $new_tags;
        } else {
            $section_idx = count($tags['section']);
            $new_tags = array(
                'tag' => array_values($tempCache),
                '@attributes' => array(
                    'name' => $this->SECTION_NAME,
                    'entry_count' => $section_entry_count
                )
            );
            $tags['section'][] = $new_tags;
        }

        $this->array2xmlFile($tags, $this->XML_FILE, $this->ROOT_ELEMENT);

        return array(
            'tags' => $tags['section'][$section_idx],
            'allHaveTags' => $allHaveTags
        );
    }

    public function renameSection($new_name) {
        $tags = $this->get();
        $section_idx = array_search(
            $this->SECTION_NAME,
            array_column(
                array_column(
                    $tags['section'],
                    '@attributes'
                ),
                'name'
            )
        );

        if ($section_idx !== false) {
            $tags['section'][$section_idx]['@attributes']['name'] = $new_name;
            $this->array2xmlFile($tags, $this->XML_FILE, $this->ROOT_ELEMENT);
        }
    }
}
