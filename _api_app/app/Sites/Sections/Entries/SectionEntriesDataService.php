<?php

namespace App\Sites\Sections\Entries;

use App\Events\SectionUpdated;
use App\Shared\Helpers;
use App\Shared\ImageHelpers;
use App\Shared\Storage;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\Tags\SectionTagsDataService;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;
use Illuminate\Support\Arr;

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
 *         <mediaCacheData type="slideshow" fullscreen="yes" autoplay="5" slide_numbers_visible="yes" gallery_width_by_widest_slide="no" link_address="http://example.com" linkTarget="_blank" row_gallery_padding="10px" size="medium">
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
class SectionEntriesDataService extends Storage
{
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
                        'id' => ['type' => 'integer', 'minimum' => '0'], // Maybe it's 1 (see xml files)
                        'uniqid' => ['type' => 'string'],
                        'date' => ['type' => 'string', 'format' => 'berta-date'], // think about how to standardize date format through berta
                        'mediafolder' => ['type' => 'string'],
                        'mediaCacheData' => [
                            'type' => 'object',
                            'properties' => [
                                'file' => [
                                    /** @todo: FIX: We're getting error here, because converter can't distinguish single item array from an object */
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
                                                    'type' => [
                                                        'type' => ['type' => 'string', 'enum' => ['image', 'video']],
                                                    ],
                                                    'width' => ['type' => 'integer', 'minimum' => 0],
                                                ],
                                                'required' => ['src', 'type'],
                                            ],
                                        ],
                                    ],
                                ],
                                '@attributes' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'autoplay' => ['type' => 'integer'],
                                        'fullscreen' => ['type' => 'string', 'enum' => ['yes', 'no']],
                                        'link_address' => ['type' => 'string'],
                                        'linkTarget' => [
                                            'type' => 'string',
                                            'enum' => ['_self', '_blank'],
                                        ],
                                        'row_gallery_padding' => ['type' => 'string', 'format' => 'css-unit'],
                                        'size' => [
                                            'type' => 'string',
                                            'enum' => ['large', 'medium', 'small'],
                                        ],
                                        'slide_numbers_visible' => ['type' => 'string', 'enum' => ['yes', 'no']],
                                        'gallery_width_by_widest_slide' => ['type' => 'string', 'enum' => ['no', 'yes']],
                                        'type' => [
                                            'type' => 'string',
                                            'enum' => ['slideshow', 'row', 'column', 'pile', 'link'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        'content' => [
                            'type' => 'object',
                            'properties' => [
                                'description' => ['type' => 'string'],
                                'fixed' => ['type' => 'integer'],
                                'positionXY' => ['type' => 'string', 'pattern' => '^[0-9]+,[0-9]+$'],
                                'title' => ['type' => 'string'],
                                'url' => ['type' => 'string', 'format' => 'URI'],
                                'width' => ['type' => 'string', 'format' => 'css-unit'],
                            ],
                        ],
                        'updated' => ['type' => 'string', 'format' => 'berta-date-time'],
                        'tags' => [
                            'type' => 'object',
                            'properties' => [
                                'tag' => ['type' => 'array', 'items' => ['type' => 'string']],
                            ],
                        ],
                        'marked' => ['type' => 'integer'],
                    ],
                ],
            ],
            '@attributes' => [
                'type' => 'object',
                'properties' => [
                    'section' => [
                        'type' => 'string',
                        '$comment' => 'name of section these entries belong to. See $this->SECTION_NAME',
                    ],
                    'version' => [
                        'type' => 'string',
                        '$comment' => 'Version of berta, this was created in',
                    ],
                    'last_upd_ver' => [
                        'type' => 'string',
                        '$comment' => 'internal berta version entry is created/updated with (used for migrations)',
                    ],
                ],
            ],
        ],
    ];

    protected static $DEFAULT_VALUES = [];
    private $ROOT_ELEMENT = 'blog'; // The XML document element - the one that wraps all the content in file
    private static $ROOT_LIST_ELEMENT = 'entry'; // XML element that wraps each element in the top level list - child of ROOT_ELEMENT
    private $SECTION_NAME;
    private $SECTION_TITLE;
    private $ENTRIES = [];
    private $XML_ROOT;
    private $XML_FILE;

    public function __construct($site = '', $sectionName = '', $sectionTitle = '', $xml_root = null, $isPreview = false)
    {
        parent::__construct($site, $isPreview);
        $this->XML_ROOT = $xml_root ? $xml_root : $this->getSiteXmlRoot($site);
        $this->SECTION_NAME = $sectionName;
        $this->SECTION_TITLE = $sectionTitle;
        $this->XML_FILE = $this->XML_ROOT . '/blog.' . $sectionName . '.xml';
    }

    /**
     * Returns all entries of site section as an array
     *
     * @return array Array of entries
     */
    public function get()
    {
        if (!$this->ENTRIES) {
            $this->ENTRIES = $this->xmlFile2array($this->XML_FILE);

            if (!$this->ENTRIES) {
                $this->ENTRIES = [];
                $this->ENTRIES[self::$ROOT_LIST_ELEMENT] = [];
            } else {
                if (!isset($this->ENTRIES[self::$ROOT_LIST_ELEMENT]) || !$this->ENTRIES[self::$ROOT_LIST_ELEMENT]) {
                    $this->ENTRIES[self::$ROOT_LIST_ELEMENT] = [];
                }
                $this->ENTRIES[self::$ROOT_LIST_ELEMENT] = $this->asList($this->ENTRIES[self::$ROOT_LIST_ELEMENT]);

                // Make gallery file list as list
                foreach ($this->ENTRIES[self::$ROOT_LIST_ELEMENT] as $order => $entry) {
                    if (isset($entry['mediaCacheData']['file'])) {
                        $this->ENTRIES[self::$ROOT_LIST_ELEMENT][$order]['mediaCacheData']['file'] = $this->asList($entry['mediaCacheData']['file']);

                        if (!$this->ENTRIES[self::$ROOT_LIST_ELEMENT][$order]['mediaCacheData']['file'][0]) {
                            $this->ENTRIES[self::$ROOT_LIST_ELEMENT][$order]['mediaCacheData']['file'] = [];
                        }
                    }
                    if (isset($entry['tags']['tag'])) {
                        $this->ENTRIES[self::$ROOT_LIST_ELEMENT][$order]['tags']['tag'] = $this->asList($entry['tags']['tag']);

                        if (!$this->ENTRIES[self::$ROOT_LIST_ELEMENT][$order]['tags']['tag'][0]) {
                            $this->ENTRIES[self::$ROOT_LIST_ELEMENT][$order]['tags']['tag'] = [];
                        }

                        $this->ENTRIES[self::$ROOT_LIST_ELEMENT][$order]['tags']['slugs'] = array_map(
                            function ($tag) {
                                return Helpers::slugify($tag, '-', '-');
                            },
                            $this->ENTRIES[self::$ROOT_LIST_ELEMENT][$order]['tags']['tag']
                        );
                    }
                }
            }
        }

        return $this->ENTRIES;
    }

    /**
     * Returns all entries of site section as an array filtered by tag
     *
     * @return array Array of entries
     */
    public function getByTag($tag = null, $isEditMode = false)
    {
        $entries = $this->get();

        if (!$entries[self::$ROOT_LIST_ELEMENT]) {
            return $entries[self::$ROOT_LIST_ELEMENT];
        }

        // Filter entries by tag
        $entries = array_filter($entries[self::$ROOT_LIST_ELEMENT], function ($entry) use ($tag) {
            $entryTags = !empty($entry['tags']['slugs']) ? $entry['tags']['slugs'] : [];

            if ($tag) {
                return !empty($entryTags) && in_array($tag, $entryTags);
            } else {
                return empty($entry['tags']['tag']);
            }
        });

        $siteSettingsDataService = new SiteSettingsDataService($this->SITE);
        $siteSettings = $siteSettingsDataService->getState();
        $template = $siteSettings['template']['template'];
        $templateName = explode('-', $template)[0];

        $siteTemplateSettingsDataService = new SiteTemplateSettingsDataService($this->SITE, $template);
        $siteTemplateSettings = $siteTemplateSettingsDataService->getState();
        $isResponsiveTemplate = isset($siteTemplateSettings['pageLayout']['responsive']) && $siteTemplateSettings['pageLayout']['responsive'] == 'yes';
        $isAutoResponsive = isset($siteTemplateSettings['pageLayout']['autoResponsive']) && $siteTemplateSettings['pageLayout']['autoResponsive'] == 'yes';

        $siteSectionsDataService = new SiteSectionsDataService($this->SITE);
        $sections = $siteSectionsDataService->get();
        if (!empty($sections)) {
            $section_order = array_search($this->SECTION_NAME, array_column($sections, 'name'));
            $section = $sections[$section_order];
            $sectionType = isset($section['@attributes']['type']) ? $section['@attributes']['type'] : 'default';
        }

        $isResponsive = (isset($sectionType) && $sectionType == 'portfolio') || $isResponsiveTemplate;

        // if messy template and auto responsive is ON and environment is `site`
        // reorder entries based on XY position
        if ($templateName == 'messy' && !$isEditMode && !$isResponsive && $isAutoResponsive) {
            $entries = $this->orderByXYPosition($entries);
        }

        return $entries;
    }

    public function orderByXYPosition($entries)
    {
        usort($entries, function ($item1, $item2) {
            $pos1 = isset($item1['content']['positionXY']) ? $item1['content']['positionXY'] : '0,0';
            $pos2 = isset($item2['content']['positionXY']) ? $item2['content']['positionXY'] : '0,0';
            list($pos1X, $pos1Y) = explode(',', $pos1);
            list($pos2X, $pos2Y) = explode(',', $pos2);

            if ($pos1X == $pos2X && $pos1Y == $pos2Y) {
                return 0;
            }

            if ($pos1Y == $pos2Y) {
                return $pos1X < $pos2X ? -1 : 1;
            }

            return $pos1Y < $pos2Y ? -1 : 1;
        });

        return $entries;
    }

    /**
     * Returns all entries transformed for frontend needs
     *
     * @return array Array of entries
     */
    public function getState()
    {
        $entries = $this->get();
        $entries = $entries[self::$ROOT_LIST_ELEMENT];

        foreach ($entries as $order => $entry) {
            $entries[$order]['sectionName'] = $this->SECTION_NAME;
            $entries[$order]['order'] = $order;
        }

        return $entries;
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
        $entries = $this->get();
        $path_arr = array_slice(explode('/', $path), 3);
        $value = trim($value);
        $prop = $path_arr[1];
        $entryId = $path_arr[0];
        $index = null;

        // Find entry index
        foreach ($entries[self::$ROOT_LIST_ELEMENT] as $i => $entry) {
            if ($entry['id'] == $entryId) {
                $index = $i;
                break;
            }
        }

        $ret = [
            'path' => $path,
            'value' => $value,
            'real' => $value,
        ];

        if (is_null($index)) {
            return $ret;
        }

        if ($prop === 'tags') {
            $value = Helpers::toTags($value);
            $ret['value'] = implode(' / ', $value);
            $ret['real'] = implode(', ', $value);
        }

        $path_arr[0] = $index;

        array_unshift($path_arr, self::$ROOT_LIST_ELEMENT);
        $this->setValueByPath(
            $entries,
            implode('/', $path_arr),
            $value
        );

        $this->array2xmlFile($entries, $this->XML_FILE, $this->ROOT_ELEMENT);
        // event(new SectionUpdated($this->SITE, $this->SECTION_NAME));
        SectionUpdated::dispatch($this->SITE, $this->SECTION_NAME);

        $ret['entry'] = $entries[self::$ROOT_LIST_ELEMENT][$index];

        if ($prop === 'tags') {
            // update direct content property
            $siteSectionsDataService = new SiteSectionsDataService($this->SITE);
            $sections = $siteSectionsDataService->get();
            $section_order = array_search($this->SECTION_NAME, array_column($sections, 'name'));
            $sectionTagsDataService = new SectionTagsDataService($this->SITE, $this->SECTION_NAME);
            $section_tags = $sectionTagsDataService->populateTags();
            $has_direct_content = !$section_tags['allHaveTags'] ? 1 : 0;
            $siteSectionsDataService->saveValueByPath(
                implode('/', [
                    $this->SITE,
                    'section',
                    $section_order,
                    '@attributes',
                    'has_direct_content',
                ]),
                $has_direct_content
            );

            $siteSectionsDataService = new SiteSectionsDataService($this->SITE);
            $sections = $siteSectionsDataService->get();
            $section = $sections[$section_order];

            // Initiate tags service again, we need updated data after populateTags action
            $sectionTagsDataService = new SectionTagsDataService($this->SITE, $this->SECTION_NAME);

            $ret = array_merge($ret, [
                'site_name' => $this->SITE,
                'section_name' => $this->SECTION_NAME,
                'section' => $section,
                'section_order' => $section_order,
                'tags' => $sectionTagsDataService->getSectionTagsState(),
                'has_direct_content' => $has_direct_content,
            ]);
        }

        return $ret;
    }

    public function create($name = null)
    {
        while (file_exists($this->XML_FILE)) {
            if (preg_match('/(?P<name>.*)-(?P<digit>\d+)$/', $this->SECTION_NAME, $matches)) {
                $this->SECTION_NAME = $matches['name'] . '-' . ((int) $matches['digit'] + 1);
                $this->setTitle($matches['name'] . ' ' . ((int) $matches['digit'] + 1));
            } else {
                $this->SECTION_NAME = $this->SECTION_NAME . '-2';
                $this->setTitle($this->SECTION_TITLE . ' 2');
            }

            $this->XML_FILE = $this->XML_ROOT . '/blog.' . $this->SECTION_NAME . '.xml';
        }

        if ($name === null) {
            $blog = [
                '@attributes' => ['section' => $this->SECTION_NAME],
                self::$ROOT_LIST_ELEMENT => [],
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
                            realpath($this->MEDIA_ROOT) . '/' . $entry['mediafolder'],
                            realpath($this->MEDIA_ROOT) . '/' . $blog[self::$ROOT_LIST_ELEMENT][$idx]['mediafolder']
                        );
                    }
                }
            }
        }

        $this->array2xmlFile($blog, $this->XML_FILE, $this->ROOT_ELEMENT);

        return [
            'name' => $this->SECTION_NAME,
            'title' => $this->SECTION_TITLE,
            self::$ROOT_LIST_ELEMENT => $blog,
        ];
    }

    /**
     * Reorder entries and save to XML file
     */
    public function order($entry_id, $value)
    {
        $entries = $this->get();
        $entry_current_order = array_search($entry_id, array_column($entries['entry'], 'id'));
        $entry_to_move = array_splice($entries['entry'], $entry_current_order, 1);
        $entry_new_order = $value ? array_search($value, array_column($entries['entry'], 'id')) : count($entries['entry']);

        array_splice($entries['entry'], $entry_new_order, 0, $entry_to_move);
        $this->array2xmlFile($entries, $this->XML_FILE, $this->ROOT_ELEMENT);
        // event(new SectionUpdated($this->SITE, $this->SECTION_NAME));
        SectionUpdated::dispatch($this->SITE, $this->SECTION_NAME);

        $order = array_column($entries['entry'], 'id');

        return [
            'site_name' => $this->SITE,
            'section_name' => $this->SECTION_NAME,
            'order' => $order,
        ];
    }

    public function rename($new_name, $new_title)
    {
        $ret = ['success' => true];

        if (!file_exists($this->XML_FILE)) {
            $ret['success'] = false;
            $ret['value'] = $this->SECTION_TITLE;
            $ret['error_message'] = 'Current section storage file does not exist! you\'ll have to delete this section!';
            return $ret;
        }

        $xml_file = $this->XML_ROOT . '/blog.' . $new_name . '.xml';

        if (file_exists($xml_file)) {
            $ret['success'] = false;
            $ret['value'] = $this->SECTION_TITLE;
            $ret['error_message'] = 'Section cannot be created! another section with the same (or too similar name) exists!';
            return $ret;
        }

        if (!@rename($this->XML_FILE, $xml_file)) {
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
                    $old_media = realpath($this->MEDIA_ROOT) . '/' . $entry['mediafolder'];
                    $new_name = $new_name . $entry['id'];
                    $new_media = realpath($this->MEDIA_ROOT) . '/' . $new_name;

                    if (@rename($old_media, $new_media)) {
                        $entries[self::$ROOT_LIST_ELEMENT][$key]['mediafolder'] = $new_name;
                    }
                }
            }
        }

        $this->array2xmlFile($entries, $this->XML_FILE, $this->ROOT_ELEMENT);

        return $ret;
    }

    public function delete()
    {
        $entries = $this->get();

        // delete media files
        if (array_key_exists(self::$ROOT_LIST_ELEMENT, $entries) and !empty($entries[self::$ROOT_LIST_ELEMENT])) {
            foreach ($entries[self::$ROOT_LIST_ELEMENT] as $entry) {
                if (!empty($entry['mediafolder'])) {
                    $mediaFolder = $this->MEDIA_ROOT . '/' . $entry['mediafolder'];

                    if (file_exists($mediaFolder)) {
                        $dir = opendir($mediaFolder);

                        while ($fItem = readdir($dir)) {
                            if ($fItem != '.' && $fItem != '..') {
                                @unlink($mediaFolder . '/' . $fItem);
                            }
                        }

                        if (!@rmdir($mediaFolder)) {
                            return [
                                'success' => false,
                                'error_message' => 'Unable to remove folder "' . $mediaFolder . '"!',
                            ];
                        };
                    }
                }
            }
        }

        // Delete entries
        if (!@unlink($this->XML_FILE)) {
            return [
                'success' => false,
                'error_message' => 'Unable to remove file "' . $this->XML_FILE . '"!',
            ];
        }

        return ['success' => true];
    }

    /**
     * Create new entry in section
     * $newEntry existing entry data in case we are moving data from other section
     * $beforeEntry where to place the new entry
     * $tag entry tag
     */
    public function createEntry($newEntry, $beforeEntry, $tag)
    {
        $mediafolder = $this->SECTION_NAME;
        $counter = 1;
        do {
            $new_mediafolder = $mediafolder . $counter;
            $counter++;
        } while (file_exists($this->MEDIA_ROOT . '/' . $new_mediafolder));
        $mediafolder = $new_mediafolder;

        $siteSettingsDataService = new SiteSettingsDataService($this->SITE);
        $siteSettings = $siteSettingsDataService->getState();
        $template = $siteSettings['template']['template'];

        $siteTemplateSettingsDataService = new SiteTemplateSettingsDataService($this->SITE, $template);
        $siteTemplateSettings = $siteTemplateSettingsDataService->getState();

        $defaultGalleryType = 'slideshow';
        if (isset($siteTemplateSettings['entryLayout']['defaultGalleryType'])) {
            $defaultGalleryType = $siteTemplateSettings['entryLayout']['defaultGalleryType'];
        }

        $galleryFullScreen = 'yes';
        if (isset($siteSettings['entryLayout']['galleryFullScreenDefault'])) {
            $galleryFullScreen = $siteSettings['entryLayout']['galleryFullScreenDefault'];
        }

        if (!@mkdir($this->MEDIA_ROOT . '/' . $mediafolder, 0777)) {
            $ret['value'] = $mediafolder;
            $ret['error_message'] = 'Can\'t create media folder! Check permissions.';
            $ret['status_code'] = 400;
            return $ret;
        }

        $entries = $this->get();

        $ids = Arr::pluck($entries['entry'], 'id');
        $id = $ids ? max($ids) + 1 : 1;

        // In case creating entry from existing entry from other section
        // Update references
        if ($newEntry) {
            if (isset($newEntry['mediafolder'])) {
                $this->copyFolder(
                    $this->XML_ROOT . '/' . $this->MEDIA_FOLDER . '/' . $newEntry['mediafolder'],
                    $this->XML_ROOT . '/' . $this->MEDIA_FOLDER . '/' . $mediafolder
                );
            }

            $newEntry = array_replace_recursive($newEntry, [
                'id' => (string) $id,
                'mediafolder' => $mediafolder,
            ]);

            // Remove entry tags when moving to other section
            unset($newEntry['tags']);
        } else {
            $newEntry = [
                'id' => (string) $id,
                'uniqid' => uniqid(),
                'date' => date('d.m.Y H:i:s'),
                'mediafolder' => $mediafolder,
                'mediaCacheData' => [
                    '@attributes' => [
                        'type' => $defaultGalleryType,
                        'fullscreen' => $galleryFullScreen,
                    ],
                    'file' => [],
                ],
            ];
        }

        if ($tag) {
            $sectionTagsDataService = new SectionTagsDataService($this->SITE, $this->SECTION_NAME);
            $tags = $sectionTagsDataService->getSectionTagsState();

            // Find tag and set tag title for entry
            if ($tags['tag']) {
                $tag_key = array_search(
                    $tag,
                    array_column(
                        array_column(
                            $tags['tag'],
                            '@attributes'
                        ),
                        'name'
                    )
                );

                if ($tag_key !== false) {
                    $tag_title = $tags['tag'][$tag_key]['@value'];

                    $newEntry['tags'] = [
                        'tag' => [$tag_title],
                    ];
                }
            }
        }

        // Insert entry in correct position
        $entry_order = count($entries['entry']);
        if ($beforeEntry) {
            $order = array_search($beforeEntry, array_column($entries['entry'], 'id'));

            if ($order !== false) {
                $entry_order = $order;
                array_splice($entries['entry'], $order, 0, [$newEntry]);
            } else {
                $entries['entry'][] = $newEntry;
            }
        } else {
            $entries['entry'][] = $newEntry;
        }

        // Save sorted entries
        $this->array2xmlFile($entries, $this->XML_FILE, $this->ROOT_ELEMENT);

        // Add params for frontend state
        $newEntry['sectionName'] = $this->SECTION_NAME;
        $newEntry['order'] = $entry_order;

        // Update section entry count
        $siteSectionsDataService = new SiteSectionsDataService($this->SITE);
        $sections = $siteSectionsDataService->get();
        $section_order = array_search($this->SECTION_NAME, array_column($sections, 'name'));
        $section_entry_count = count($entries['entry']);
        $siteSectionsDataService->saveValueByPath(
            implode('/', [
                $this->SITE,
                'section',
                $section_order,
                '@attributes',
                'entry_count',
            ]),
            $section_entry_count
        );

        // update direct content property
        // @todo SiteSectionsDataService method saveValueByPath should update instance state as well
        // currently it's updating only xml file
        // that is why we are calling new SiteSectionsDataService again
        $siteSectionsDataService = new SiteSectionsDataService($this->SITE);
        $sectionTagsDataService = new SectionTagsDataService($this->SITE, $this->SECTION_NAME);
        $section_tags = $sectionTagsDataService->populateTags();
        $has_direct_content = !$section_tags['allHaveTags'] ? 1 : 0;
        $siteSectionsDataService->saveValueByPath(
            implode('/', [
                $this->SITE,
                'section',
                $section_order,
                '@attributes',
                'has_direct_content',
            ]),
            $has_direct_content
        );

        // Initiate tags service again, we need updated data after populateTags action
        $sectionTagsDataService = new SectionTagsDataService($this->SITE, $this->SECTION_NAME);

        return [
            'section_order' => $section_order,
            'entry' => $newEntry,
            'tags' => $sectionTagsDataService->getSectionTagsState(),
            'has_direct_content' => $has_direct_content,
            'entry_count' => $section_entry_count,
        ];
    }

    /**
     * Move entry to other section
     */
    public function moveEntry($entryId, $toSection)
    {
        $entries = $this->get();
        $entryIndex = array_search($entryId, array_column($entries['entry'], 'id'));

        if ($entryIndex === false) {
            return [
                'error_message' => 'Entry with ID "' . $entryId . '" not found!',
            ];
        }

        $entry = $entries['entry'][$entryIndex];
        $toSectionEntriesDS = new self($this->SITE, $toSection);
        $data = $toSectionEntriesDS->createEntry($entry, null, null);

        $deletedEntry = $this->deleteEntry($entryId);
        $data['deleted_entry'] = $deletedEntry;

        return $data;
    }

    public function deleteEntry($entry_id)
    {
        $entries = $this->get();
        $entry_order = array_search($entry_id, array_column($entries['entry'], 'id'));

        if ($entry_order === false) {
            return [
                'error_message' => 'Entry with ID "' . $entry_id . '" not found!',
            ];
        }

        $entry = $entries['entry'][$entry_order];

        // Delete entry media folder
        if (isset($entry['mediafolder']) && !empty($entry['mediafolder'])) {
            $this->delFolder($this->MEDIA_ROOT . '/' . $entry['mediafolder']);
        }

        // Delete entry
        array_splice($entries['entry'], $entry_order, 1);
        $this->array2xmlFile($entries, $this->XML_FILE, $this->ROOT_ELEMENT);

        // Update section entry count
        $siteSectionsDataService = new SiteSectionsDataService($this->SITE);
        $sections = $siteSectionsDataService->get();
        $section_order = array_search($this->SECTION_NAME, array_column($sections, 'name'));
        $section_entry_count = count($entries['entry']);
        $siteSectionsDataService->saveValueByPath(
            implode('/', [
                $this->SITE,
                'section',
                $section_order,
                '@attributes',
                'entry_count',
            ]),
            $section_entry_count
        );

        // update direct content property
        $siteSectionsDataService = new SiteSectionsDataService($this->SITE);
        $sectionTagsDataService = new SectionTagsDataService($this->SITE, $this->SECTION_NAME);
        $section_tags = $sectionTagsDataService->populateTags();
        $has_direct_content = !$section_tags['allHaveTags'] ? 1 : 0;
        $siteSectionsDataService->saveValueByPath(
            implode('/', [
                $this->SITE,
                'section',
                $section_order,
                '@attributes',
                'has_direct_content',
            ]),
            $has_direct_content
        );

        // @todo SiteSectionsDataService method saveValueByPath should update instance state as well
        // currently it's updating only xml file
        // that is why we are calling new SiteSectionsDataService third time in one method here :(
        $siteSectionsDataService = new SiteSectionsDataService($this->SITE);
        $sections = $siteSectionsDataService->get();
        $section = $sections[$section_order];

        // Initiate tags service again, we need updated data after populateTags action
        $sectionTagsDataService = new SectionTagsDataService($this->SITE, $this->SECTION_NAME);

        return [
            'site_name' => $this->SITE,
            'section_name' => $this->SECTION_NAME,
            'section' => $section,
            'section_order' => $section_order,
            'entry_id' => $entry['id'],
            'tags' => $sectionTagsDataService->getSectionTagsState(),
            'has_direct_content' => $has_direct_content,
            'entry_count' => $section_entry_count,
        ];
    }

    private function setTitle($title)
    {
        if (!empty($this->SECTION_TITLE)) {
            $this->SECTION_TITLE = $title;
        }
    }

    public function galleryOrder($section_name, $entry_id, $new_files)
    {
        $entries = $this->get();
        $entry_order = array_search($entry_id, array_column($entries['entry'], 'id'));

        if ($entry_order !== false) {
            $entry = &$entries['entry'][$entry_order];
            if (!isset($entry['mediaCacheData']) || !isset($entry['mediaCacheData']['file'])) {
                $entry['mediaCacheData']['file'] = [];
            }

            $files = $this->asList($entry['mediaCacheData']['file']);
            $reordered = [];

            foreach ($new_files as $file) {
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

            $entry['mediaCacheData']['file'] = $new_files ? $reordered : [];

            $this->array2xmlFile($entries, $this->XML_FILE, $this->ROOT_ELEMENT);
            // event(new SectionUpdated($this->SITE, $this->SECTION_NAME));
            SectionUpdated::dispatch($this->SITE, $this->SECTION_NAME);

            return [
                'site' => $this->SITE,
                'section' => $section_name,
                'entry_id' => $entry_id,
                'mediafolder' => $entry['mediafolder'],
                'files' => $reordered,
            ];
        }

        return ['error_message' => 'Entry with ID "' . $entry_id . '" not found!'];
    }

    public function galleryUpload($path, $file)
    {
        $mediaRootDir = $this->getOrCreateMediaDir();
        $entries = $this->get();
        $pathParts = explode('/', $path);
        $posterVideo = count($pathParts) == 5 ? $pathParts[4] : false;
        $isImage = in_array($file->guessExtension(), config('app.image_mimes')) || $posterVideo;
        $entry_id = explode('/', $path)[3];
        $entry_order = array_search($entry_id, array_column($entries['entry'], 'id'));
        $entry = $entries['entry'][$entry_order];
        $mediaDirName = $entry['mediafolder'];
        $mediaDir = $mediaRootDir . '/' . $mediaDirName;
        unset($entry['mediaCacheData']['@value']);

        if (!file_exists($mediaDir)) {
            mkdir($mediaDir, 0777, true);
        }

        $fileName = $this->getUniqueFileName($mediaDir, $file->getClientOriginalName());
        $fileSize = $file->getSize();
        $file->move($mediaDir, $fileName);

        // A video file
        if (!$isImage) {
            $entry['mediaCacheData']['file'][] = [
                '@attributes' => [
                    'type' => 'video',
                    'src' => $fileName,
                ],
            ];

            $entries[self::$ROOT_LIST_ELEMENT][$entry_order] = $entry;
            $this->array2xmlFile($entries, $this->XML_FILE, $this->ROOT_ELEMENT);

            return [
                'status' => 1,
                'hash' => md5_file($mediaDir . '/' . $fileName),
                'type' => 'video',
                'smallthumb_path' => null,
                'smallthumb_width' => null,
                'smallthumb_height' => null,
                'path' => $this->MEDIA_URL . '/' . $mediaDirName . '/' . $fileName,
                'filename' => $fileName,
                'size' => $fileSize,
                'width' => null,
                'height' => null,
            ];
        }

        ImageHelpers::downscaleToMaxSize($mediaDir . '/' . $fileName);

        list($width, $height) = getimagesize($mediaDir . '/' . $fileName);
        $smallThumb = ImageHelpers::getThumbnail($mediaDir . '/' . $fileName);
        list($smallThumbWidth, $smallThumbHeight) = getimagesize($smallThumb);

        // Add new Poster
        if ($posterVideo) {
            $slide_order = array_search($posterVideo, array_column(array_column($entry['mediaCacheData']['file'], '@attributes'), 'src'));
            if ($slide_order !== false) {
                $slide = $entry['mediaCacheData']['file'][$slide_order];

                if (isset($slide['@attributes']['poster_frame'])) {
                    $this->removeImageWithThumbnails($mediaDir, $slide['@attributes']['poster_frame']);
                }

                $slide['@attributes'] = array_merge($slide['@attributes'], [
                    'poster_frame' => $fileName,
                    'width' => $width,
                    'height' => $height,
                ]);

                $entry['mediaCacheData']['file'][$slide_order] = $slide;
            }

            // Add new Image
        } else {
            $entry['mediaCacheData']['file'][] = [
                '@attributes' => [
                    'type' => 'image',
                    'src' => $fileName,
                    'width' => $width,
                    'height' => $height,
                ],
            ];
        }

        $entries[self::$ROOT_LIST_ELEMENT][$entry_order] = $entry;
        $this->array2xmlFile($entries, $this->XML_FILE, $this->ROOT_ELEMENT);

        return [
            'status' => 1,
            'hash' => md5_file($mediaDir . '/' . $fileName),
            'type' => 'image',
            'smallthumb_path' => $this->MEDIA_URL . '/' . $mediaDirName . '/' . basename($smallThumb),
            'smallthumb_width' => $smallThumbWidth,
            'smallthumb_height' => $smallThumbHeight,
            'path' => $this->MEDIA_URL . '/' . $mediaDirName . '/' . $fileName,
            'path_orig' => $this->MEDIA_URL . '/' . $mediaDirName . '/' . $fileName,
            'filename' => $fileName,
            'size' => $fileSize,
            'width' => $width,
            'height' => $height,
        ];
    }

    public function galleryCrop($data)
    {
        $entries = $this->get();
        $entryOrder = array_search($data['entryId'], array_column($entries['entry'], 'id'));
        $entry = $entries['entry'][$entryOrder];
        $slide = $entry['mediaCacheData']['file'][$data['imageOrder']];
        $oldFileName = $slide['@attributes']['src'];
        $mediaRootDir = $this->getOrCreateMediaDir();

        if (!is_writable($mediaRootDir)) {
            throw new \Exception('Upload failed.');
        }

        $mediaDirName = $entry['mediafolder'];
        $mediaDir = $mediaRootDir . '/' . $mediaDirName;
        $fileName = $this->getUniqueFileName($mediaDir, $oldFileName);
        copy($mediaDir . '/' . $oldFileName, $mediaDir . '/' . $fileName);
        $newSize = ImageHelpers::crop($mediaDir . '/' . $fileName, $data['x'], $data['y'], $data['w'], $data['h']);
        $width = $newSize['w'];
        $height = $newSize['h'];
        $smallThumb = ImageHelpers::getThumbnail($mediaDir . '/' . $fileName);

        $this->removeImageWithThumbnails($mediaDir, $oldFileName);

        $slide['@attributes'] = array_merge($slide['@attributes'], [
            'src' => $fileName,
            'width' => $width,
            'height' => $height,
        ]);

        $entry['mediaCacheData']['file'][$data['imageOrder']] = $slide;
        $entries[self::$ROOT_LIST_ELEMENT][$entryOrder] = $entry;
        $this->array2xmlFile($entries, $this->XML_FILE, $this->ROOT_ELEMENT);

        // create image variant for gallery size
        $storageService = new Storage($data['site']);
        $siteSettingsDataService = new SiteSettingsDataService($data['site']);
        $siteSettings = $siteSettingsDataService->getState();
        ImageHelpers::getGalleryItem($slide, $entry, $storageService, $siteSettings);

        return [
            'update' => $fileName,
            'updateText' => $fileName,
            'real' => $oldFileName,
            'eval_script' => false,
            'error_message' => false,
            'params' => [
                'path' => $this->MEDIA_URL . '/' . $mediaDirName . '/',
                'smallThumb' => $this->MEDIA_URL . '/' . $mediaDirName . '/' . basename($smallThumb),
                'width' => $width,
                'height' => $height,
            ],
        ];
    }

    public function galleryDelete($section_name, $entry_id, $file)
    {
        $entries = $this->get();
        $entry_order = array_search($entry_id, array_column($entries['entry'], 'id'));

        if ($entry_order !== false) {
            $entry = &$entries['entry'][$entry_order];

            if (!isset($entry['mediaCacheData'])) {
                return ['error_message' => 'File "' . $file . '" not found!'];
            }

            $files = $this->asList($entry['mediaCacheData']['file']);
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
                return ['error_message' => 'File "' . $file . '" not found!'];
            }

            $mediafolder = $this->MEDIA_ROOT . '/' . $entry['mediafolder'] . '/';
            $this->deleteMedia($mediafolder, $file);

            $file = current(array_splice($files, $file_order, 1));

            $entries['entry'][$entry_order]['mediaCacheData']['file'] = array_filter($files, function ($f) use ($file) {
                return $f['@attributes']['src'] != $file;
            });

            $this->array2xmlFile($entries, $this->XML_FILE, $this->ROOT_ELEMENT);

            return [
                'site' => $this->SITE,
                'section' => $section_name,
                'entry_id' => $entry_id,
                'file' => $file['@attributes']['src'],
            ];
        }

        return ['error_message' => 'Entry with ID "' . $entry_id . '" not found!'];
    }

    // @todo video poster should also be removed
    private function deleteMedia($folder, $file = '')
    {
        @unlink($folder . $file);

        if ($handle = opendir($folder)) {
            while (false !== ($f = readdir($handle))) {
                if (!$file || strpos($f, $file) !== false) {
                    if (substr($f, 0, 1) == '_') {
                        @unlink($folder . $f);
                    }
                }
            }

            closedir($handle);
        }
    }

    /**
     * Copy all section entries gallery files to destination folder
     * @param string $dst_root destination folder
     */
    public function copyMediaFiles($dst_root)
    {
        $entries = $this->get();
        $entries = $entries[self::$ROOT_LIST_ELEMENT];

        foreach ($entries as $entry) {
            if (isset($entry['mediafolder'])) {
                $this->copyFolder(
                    $this->XML_ROOT . '/' . $this->MEDIA_FOLDER . '/' . $entry['mediafolder'],
                    $dst_root . '/' . $this->MEDIA_FOLDER . '/' . $entry['mediafolder']
                );
            }
        }
    }
}
