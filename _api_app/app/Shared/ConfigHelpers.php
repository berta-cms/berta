<?php

namespace App\Shared;

class ConfigHelpers
{
    public static function formatValue($config, $path, $value)
    {
        //search setting config by path
        $keys = explode('/', $path);
        foreach ($keys as $key) {
            if (!isset($config[$key])) {
                $config = null;
                break;
            }
            $config = $config[$key];
        }

        if (!$config || !isset($config['format'])) {
            return $value;
        }

        switch ($config['format']) {
            case 'url':
                if ($value && !preg_match('/http(s?)\:\/\//i', $value)) {
                    $value = 'https://' . $value;
                }
                break;

            default:
                break;
        }

        return $value;
    }

    /**
     *  Returns site settings path to configuration from path in xml
     */
    public static function getSettingPathByXmlPath($xmlPath)
    {
        $keys = explode('/', $xmlPath);
        $settingPath = [];

        foreach ($keys as $key) {
            if (is_numeric($key)) {
                array_pop($settingPath);
                $settingPath[] = 'children';
                continue;
            }
            $settingPath[] = $key;
        }

        return implode('/', $settingPath);
    }

    /**
     *  Returns section settings path to configuration from path in xml
     */
    public static function getSectionPathByXmlPath($xmlPath, $siteTemplatesConfig, $siteSettings, $sections)
    {
        $xmlPathParts = explode('/', $xmlPath);
        $sectionOrder = $xmlPathParts[1];
        $property = $xmlPathParts[2];
        $templateName = $siteSettings['template']['template'];
        $siteTemplateConfig = $siteTemplatesConfig[$templateName];
        $section = $sections['section'][$sectionOrder];
        $sectionType = isset($section['@attributes']['type']) ? $section['@attributes']['type'] : 'default';

        if (!isset($siteTemplateConfig['sectionTypes'][$sectionType]['params'][$property])) {
            return false;
        }

        return "{$templateName}/sectionTypes/{$sectionType}/params/{$property}";
    }
}
