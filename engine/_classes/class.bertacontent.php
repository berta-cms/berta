<?php

class BertaContent extends BertaBase
{
    public static function getSites($published = true)
    {
        $sArr = [];
        $xmlFile = self::$options['XML_SITES_ROOT'] . self::$options['sites.xml'];

        if (file_exists($xmlFile)) {
            $xmlStr = file_get_contents($xmlFile);

            if ($xmlStr) {
                $xmlFeed = Array_XML::xml2array($xmlStr, 'sites', true);
                if (isset($xmlFeed['site']) && is_array($xmlFeed['site'])) {
                    Array_XML::makeListIfNotList($xmlFeed['site']);
                    foreach ($xmlFeed['site'] as $s) {
                        if ($published || isset($_REQUEST['preview']) || (isset($s['@attributes']['published']) && $s['@attributes']['published'])) {
                            if (!empty($s['name']['value']) && trim($s['name']['value']) != '') {
                                $sArr[trim($s['name']['value'])] = $s;
                            } else {
                                $sArr[] = $s;
                            }
                        }
                    }
                }
            }
            //create main site element if no XML exists
        } else {
            $sArr[] = [
                '@attributes' => ['published' => 1],
                'name' => null,
                'title' => ['value' => 'Main site']
            ];
        }
        return $sArr;
    }

    public static function getSite($options)
    {
        $site = '';
        $apacheRewriteUsed = !empty($_REQUEST['__rewrite']);

        if ($apacheRewriteUsed) {
            $urlStr = $_SERVER['REQUEST_URI'];
            if (strpos($urlStr, $options['SITE_ROOT_URL']) === 0) {
                $urlStr = substr($urlStr, strlen($options['SITE_ROOT_URL']) - 1);
            }
            $urlArr = explode('/', $urlStr);

            if (isset($urlArr[1]) && array_key_exists($urlArr[1], $options['MULTISITES'])) {
                $site = $urlArr[1];
            }
        } elseif (!empty($_REQUEST['site']) && array_key_exists($_REQUEST['site'], $options['MULTISITES'])) {
            $site = $_REQUEST['site'];
        }

        return $site;
    }

    public static function getSections($with_index = false)
    {
        $sArr = [];

        if (file_exists(self::$options['XML_ROOT'] . self::$options['sections.xml'])) {
            $xmlStr = file_get_contents(self::$options['XML_ROOT'] . self::$options['sections.xml']);

            if ($xmlStr) {
                $xmlFeed = Array_XML::xml2array($xmlStr, 'sections', true);
                if (isset($xmlFeed['section']) && is_array($xmlFeed['section'])) {
                    Array_XML::makeListIfNotList($xmlFeed['section']);
                    $indexes = [];
                    $idx = 0;
                    foreach ($xmlFeed['section'] as $s) {
                        if (!empty($s['name']['value']) && trim($s['name']['value']) != '') {
                            $name = trim($s['name']['value']);
                            $s['order'] = $idx;
                            $sArr[$name] = $s;
                            $indexes[$name] = $idx;
                        }
                        $idx++;
                    }
                }
            }
        }

        if ($with_index) {
            return [$indexes, $sArr];
        }

        return $sArr;
    }

    public static function loadBlog($sName)
    {
        if ($sName) {
            $fileName = self::$options['XML_ROOT'] . str_replace('%', $sName, self::$options['blog.%.xml']);
            if (file_exists($fileName)) {
                $xmlStr = file_get_contents($fileName);
                $xmlFeed = [];

                if ($xmlStr) {
                    $xmlFeed = Array_XML::xml2array($xmlStr, 'blog', true);
                    if (!empty($xmlFeed['entry']) && is_array($xmlFeed['entry']) && empty($xmlFeed['entry'][0])) {
                        $xmlFeed['entry'] = [0 => $xmlFeed['entry']];
                    }
                }
                return $xmlFeed;
            }
        }

        return false;
    }

    public static function &getEntry($entryId, &$blog)
    {
        foreach ($blog['entry'] as $eId => $e) {
            if ($eId === '@attributes') {
                continue;
            }
            if ($e['id']['value'] == $entryId) {
                return $blog['entry'][$eId];
            }
        }

        $retVal = false;
        return $retVal;
    }

    /* ---------------------------------------------------------------------------------------------------------------------- */
    /*  S U B   S E C T I O N S                                                                                                         */
    /* ---------------------------------------------------------------------------------------------------------------------- */

    public static function getTags()
    {
        $ssArr = [];
        $tagsCacheFile = self::$options['XML_ROOT'] . self::$options['tags.xml'];

        $xmlStr = file_exists($tagsCacheFile) ? file_get_contents($tagsCacheFile) : '';
        if ($xmlStr) {
            $xmlFeed = Array_XML::xml2array($xmlStr, 'sections', true);

            if (isset($xmlFeed['section']) && is_array($xmlFeed['section'])) {
                Array_XML::makeListIfNotList($xmlFeed['section']);
                foreach ($xmlFeed['section'] as $section) {
                    $name = !empty($section['@attributes']['name']) ? $section['@attributes']['name'] : false;
                    if ($name && isset($section['tag']) && is_array($section['tag'])) {
                        Array_XML::makeListIfNotList($section['tag']);
                        $ssArr[$name] = [];
                        foreach ($section['tag'] as $subSection) {
                            if (!empty($subSection['@attributes']['name']) && !empty($subSection['value'])) {
                                $ssArr[$name][$subSection['@attributes']['name']] = [
                                'title' => $subSection['value'],
                                'entry_count' => !empty($subSection['@attributes']['entry_count']) ? $subSection['@attributes']['entry_count'] : 0
                            ];
                            }
                        }
                    }
                }
            }
        }

        return $ssArr;
    }

    // getXEmpty is in fact and editor function, but because of the way it is used, it lives in BertaContent
    public static function getXEmpty($property)
    {
        $xEmpty = 'xEmpty';
        return self::$options['logged_in'] ? ('<span class="' . $xEmpty . '">&nbsp;' . $property . '&nbsp;</span>') : '';
    }
}
