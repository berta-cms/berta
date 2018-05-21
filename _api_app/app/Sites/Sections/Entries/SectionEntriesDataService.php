<?php

namespace App\Sites\Sections\Entries;

use App\Shared\Storage;

/**
 * @class SectionEntriesDataService
 *
 * This service handles storing, updating, deleting section entry data in Berta.
 *
 * The data is stored in XML files like this: `blog.[section name].xml`
 * The data files are located in the given sites data folder.
 * For the root site it's: `storage/blog.[section name].xml`
 * For other sites it's: `storage/-sites/[site name]/blog.[section name].xml`
 *
 * @example file: sample-data/blog.[section-name].xml
 *
 * @example XML:
 * ```xml
 * <?xml version="1.0" encoding="utf-8"?>
 * <blog section="section-two" version="0.8.11b" last_upd_ver="1130">
 *     <entry>
 *         <id><![CDATA[1]]></id>
 *         <uniqid><![CDATA[5af2bc3d80e13]]></uniqid>
 *         <date><![CDATA[09.05.2018 12:15:41]]></date>
 *         <mediafolder><![CDATA[section-two1]]></mediafolder>
 *         <mediaCacheData type="slideshow" fullscreen="yes" autoplay="5" slide_numbers_visible="yes" link_address="http://example.com" linkTarget="_blank" row_gallery_padding="10px" size="medium">
 *             <file type="video" src="small.mp4" autoplay="1" poster_frame="small.jpg" width="842" height="842"><![CDATA[<p>Video caption</p>]]></file>
 *             <file type="image" src="square11525866927.jpg" width="383" height="655"><![CDATA[<p>Image caption 1</p>]]></file>
 *             <file type="image" src="square6.jpg" width="842" height="842"><![CDATA[<p>Image caption 2</p>]]></file>
 *         </mediaCacheData>
 *         <content>
 *             <description><![CDATA[<p><span>Animals</span></p>]]></description>
 *             <positionXY><![CDATA[330,240]]></positionXY>
 *             <fixed><![CDATA[1]]></fixed>
 *             <width><![CDATA[400px]]></width>
 *             <title><![CDATA[Lorem ipsum]]></title>
 *             <url><![CDATA[http://example.com]]></url>
 *         </content>
 *         <updated><![CDATA[09.05.2018 16:03:33]]></updated>
 *         <tags>
 *             <tag><![CDATA[Cats]]></tag>
 *             <tag><![CDATA[Dogs]]></tag>
 *         </tags>
 *         <marked><![CDATA[1]]></marked>
 *     </entry>
 *     <entry>
 *         <id><![CDATA[2]]></id>
 *         <uniqid><![CDATA[5af2dd4ead80f]]></uniqid>
 *         <date><![CDATA[09.05.2018 14:36:46]]></date>
 *         <mediafolder><![CDATA[section-two2]]></mediafolder>
 *         <mediaCacheData type="slideshow" fullscreen="yes" />
 *     </entry>
 * </blog>
 * ```
 */
class SectionEntriesDataService Extends Storage {
    public static $JSON_SCHEMA = [
        'type' => 'object',
        'properties' => [
            'entry' => [
                'type' => 'array',
                '$comment' => 'A list of <entry> elements in XML',
                'items' => [
                    'type' => 'object',
                    '$comment' => 'This represents the <entry> elements in a list. They can only be <entry> in this list',
                    'properties' => [
                        'id' => ['type' => 'integer', 'minimum' => '0'],  // Maybe it's 1 (see xml files)
                        'uniqid' => ['type' => 'string'],
                        'date' => ['type' => 'string', 'format' => 'berta-date'],  // think about how to standardize date format through berta
                        'mediafolder' => ['type' => 'string'],
                        'mediaCacheData' => [
                            'type' => 'object',
                            'properties' => [
                                'file' => [  /** @todo: FIX: We're getting error here, because converter can't distinguish single item array from an object */
                                    'type' => 'array',
                                    '$comment' => 'This is a list of <file> elements. This element can only contain <file> elements',
                                    'items' => [
                                        'type' => 'object',
                                        'properties' => [
                                            '@value' => ['type' => 'string'],
                                            '@attributes' => [
                                                'type' => 'object',
                                                'properties' => [
                                                    'autoplay' => ['type' => 'integer'],
                                                    'height' => ['type' => 'integer', 'minimum' => 0],
                                                    'poster_frame' => ['type' => 'string'],
                                                    'src' => ['type' => 'string'],
                                                    'type' => ['type' => 'string'],
                                                    'width' => ['type' => 'integer', 'minimum' => 0]
                                                ],
                                                'required' => ['src', 'type']
                                            ]
                                        ]
                                    ]
                                ],
                                '@attributes' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'autoplay' => ['type' => 'integer'],
                                        'fullscreen' => ['type' => 'string', 'enum' => ['yes', 'no']],
                                        'link_address' => ['type' => 'string'],
                                        'linkTarget' => ['type' => 'string'],
                                        'row_gallery_padding' => ['type' => 'string', 'format' => 'css-unit'],
                                        'size' => ['type' => 'string'],
                                        'slide_numbers_visible' => ['type' => 'string', 'enum' => ['yes', 'no']],
                                        'type' => ['type' => 'string', 'enum' => ['image', 'video']],
                                    ]
                                ]
                            ]
                        ],
                        'content' => [
                            'type' => 'object',
                            'properties' => [
                                'description' => ['type' => 'string'],
                                'fixed' => ['type' => 'integer'],
                                'positionXY' => ['type' => 'string', 'pattern' => '^[0-9]+,[0-9]+$'],
                                'title' => ['type' => 'string'],
                                'url' => ['type' => 'string', 'format' => 'URI'],
                                'width' => ['type' => 'string', 'format' => 'css-unit']
                            ]
                        ],
                        'updated' => ['type' => 'string', 'format' => 'berta-date-time'],
                        'tags' => [
                            'type' => 'object',
                            'properties' => [
                                'tag' => ['type' => 'array', 'items' => ['type' => 'string']]
                            ]
                        ],
                        'marked' => ['type' => 'integer']
                    ]
                ]
            ],
            '@attributes' => [
                'type' => 'object',
                'properties' => [
                    'section' => [
                        'type' => 'string',
                        '$comment' => 'name of section these entries belong to. See $this->SECTION_NAME'
                    ],
                    'version' => [
                        'type' => 'string',
                        '$comment' => 'Version of berta, this was created in'
                    ],
                    'last_upd_ver' => [
                        'type' => 'string',
                        '$comment' => 'internal berta version entry is created/updated with (used for migrations)'
                    ]
                ]
            ]
        ]
    ];

    protected static $DEFAULT_VALUES = [];
    private $ROOT_ELEMENT = 'blog';  // The XML document element - the one that wraps all the content in file
    private static $ROOT_LIST_ELEMENT = 'entry';  // XML element that wraps each element in the top level list - child of ROOT_ELEMENT
    private $SECTION_NAME;
    private $SECTION_TITLE;
    private $ENTRIES = [];
    private $XML_ROOT;
    private $XML_FILE;

    public function __construct($site='', $sectionName='', $sectionTitle='') {
        parent::__construct($site);
        $this->XML_ROOT = $this->getSiteXmlRoot($site);
        $this->SECTION_NAME = $sectionName;
        $this->SECTION_TITLE = $sectionTitle;
        $this->XML_FILE = $this->XML_ROOT . '/blog.' . $sectionName . '.xml';
    }

    /**
    * Returns all entries of site section as an array
    *
    * @return array Array of entries
    */
    public function get() {
        if (empty($this->ENTRIES)) {
            $this->ENTRIES = $this->xmlFile2array($this->XML_FILE);

            if (empty($this->ENTRIES)) {
                $this->ENTRIES = [self::$ROOT_LIST_ELEMENT => []];
            } else {
                $this->ENTRIES[self::$ROOT_LIST_ELEMENT] = isset($this->ENTRIES[self::$ROOT_LIST_ELEMENT]) ? $this->asList($this->ENTRIES[self::$ROOT_LIST_ELEMENT]) : [];
            }
        }

        return $this->ENTRIES;
    }

    public function create($name=null) {
        while (file_exists($this->XML_FILE)) {
            if (preg_match('/(?P<name>.*)-(?P<digit>\d+)$/', $this->SECTION_NAME, $matches)) {
                $this->SECTION_NAME = $matches['name'] . '-' . ((int)$matches['digit'] + 1);
                $this->setTitle($matches['name'] . ' ' . ((int)$matches['digit'] + 1));
            } else {
                $this->SECTION_NAME = $this->SECTION_NAME . '-2';
                $this->setTitle($this->SECTION_TITLE . ' 2');
            }

            $this->XML_FILE = $this->XML_ROOT . '/blog.' . $this->SECTION_NAME . '.xml';
        }

        if ($name === null) {
            $blog = [
                '@attributes' => ['section' => $this->SECTION_NAME],
                self::$ROOT_LIST_ELEMENT => []
            ];
        } else {
            $entries = new SectionEntriesDataService($this->SITE, $name);
            $blog = $entries->get();
            $blog['@attributes']['section'] = $this->SECTION_NAME;

            if (isset($blog[self::$ROOT_LIST_ELEMENT])) {
                foreach ($blog[self::$ROOT_LIST_ELEMENT] as $idx => $entry) {
                    $blog[self::$ROOT_LIST_ELEMENT][$idx]['uniqid'] = uniqid();
                    $blog[self::$ROOT_LIST_ELEMENT][$idx]['date'] = date('d.m.Y H:i:s');
                    $blog[self::$ROOT_LIST_ELEMENT][$idx]['updated'] = date('d.m.Y H:i:s');

                    if (isset($entry['mediafolder'])) {
                        $blog[self::$ROOT_LIST_ELEMENT][$idx]['mediafolder'] = str_replace(
                            $name,
                            $this->SECTION_NAME,
                            $entry['mediafolder']
                        );

                        $this->copyFolder(
                            realpath($this->MEDIA_ROOT) .'/'. $entry['mediafolder'],
                            realpath($this->MEDIA_ROOT) .'/'. $blog[self::$ROOT_LIST_ELEMENT][$idx]['mediafolder']
                        );
                    }
                }
            }
        }

        $this->array2xmlFile($blog, $this->XML_FILE, $this->ROOT_ELEMENT);

        return [
            'name' => $this->SECTION_NAME,
            'title' => $this->SECTION_TITLE,
            self::$ROOT_LIST_ELEMENT => $blog
        ];
    }

    public function rename($new_name, $new_title) {
        $ret = array('success' => true);

        if(!file_exists($this->XML_FILE)) {
            $ret['success'] = false;
            $ret['value'] = $this->SECTION_TITLE;
            $ret['error_message'] = 'Current section storage file does not exist! you\'ll have to delete this section!';
            return $ret;
        }

        $xml_file = $this->XML_ROOT . '/blog.' . $new_name . '.xml';

        if(file_exists($xml_file)) {
            $ret['success'] = false;
            $ret['value'] = $this->SECTION_TITLE;
            $ret['error_message'] = 'Section cannot be created! another section with the same (or too similar name) exists!';
            return $ret;
        }

        if(!@rename($this->XML_FILE, $xml_file)) {
            $ret['success'] = false;
            $ret['value'] = $this->SECTION_TITLE;
            $ret['error_message'] = 'Section storage file cannot be renamed! check permissions and be sure the name of the section is not TOO fancy!';
            return $ret;
        }

        @chmod($xml_file, 0666);
        $this->XML_FILE = $xml_file;
        $this->SECTION_NAME = $new_name;
        $this->SECTION_TITLE = $new_title;

        $entries = $this->get();
        $entries['@attributes']['section'] = $new_name;

        if (isset($entries[self::$ROOT_LIST_ELEMENT])) {
            foreach ($entries[self::$ROOT_LIST_ELEMENT] as $key => $entry) {
                if (isset($entry['mediafolder'])) {
                    $old_media = realpath($this->MEDIA_ROOT) .'/'. $entry['mediafolder'];
                    $new_name = $new_name . $entry['id'];
                    $new_media = realpath($this->MEDIA_ROOT) .'/'. $new_name;

                    if(@rename($old_media, $new_media)) {
                        $entries[self::$ROOT_LIST_ELEMENT][$key]['mediafolder'] = $new_name;
                    }
                }
            }
        }

        $this->array2xmlFile($entries, $this->XML_FILE, $this->ROOT_ELEMENT);

        return $ret;
    }

    public function delete() {
        $entries = $this->get();

        // delete media files
        if(array_key_exists(self::$ROOT_LIST_ELEMENT, $entries) and !empty($entries[self::$ROOT_LIST_ELEMENT])) {
            foreach($entries[self::$ROOT_LIST_ELEMENT] as $entry) {
                if(!empty($entry['mediafolder'])) {
                    $mediaFolder = $this->MEDIA_ROOT . '/' . $entry['mediafolder'];

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
                        };
                    }
                }
            }
        }

        // Delete entries
        if (!@unlink($this->XML_FILE)) {
            return array(
                'success' => false,
                'error_message' => 'Unable to remove file "' . $this->XML_FILE . '"!'
            );
        }

        return array('success' => true);
    }

    private function setTitle($title) {
        if (!empty($this->SECTION_TITLE)) {
            $this->SECTION_TITLE = $title;
        }
    }
}
