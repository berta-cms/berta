<?php

include_once 'class.array_xml.php';

define('SETTINGS_EMPTY', '$$$emptysettingsvalue$$$');

class Settings
{
    public $settings = [];

    public $settingsDefinition;

    public $base; // the super-settings, that propogate to these settings, if there's not value

    public $templateName; // name of the template (without version info)

    public $templateFullName; // full name of the template (the actual folder name with version)

    public $templateVersion; // version of the template (derived from folder name)

    public $fileName; // the actual template file name

    public function __construct($settingsDefinition, $settingsBaseInstance = false, $templateName = false, $settings = false)
    {
        $this->settingsDefinition = $settingsDefinition;
        $this->base = $settingsBaseInstance;
        $this->templateFullName = $templateName;

        $tParts = explode('-', $templateName);
        $this->templateName = $tParts[0];
        $this->templateVersion = ! empty($tParts[1]) ? $tParts[1] : 0;

        $this->fileName = $this->templateName ? str_replace('%', $this->templateName, BertaBase::$options['settings.%.xml']) : BertaBase::$options['settings.xml'];

        if ($settings) {
            $this->settings = $settings;
        } else {
            $this->load();
        }
    }

    public function load()
    {
        $xml_file = BertaBase::$options['XML_ROOT'] . $this->fileName;
        if (file_exists($xml_file)) {
            $fp = fopen($xml_file, 'r');
            if (flock($fp, LOCK_SH)) {
                $xml = file_get_contents($xml_file);
                flock($fp, LOCK_UN);
                $this->settings = Array_XML::xml2array($xml, 'settings');

                return $this->settings;
            } else {
                throw new \Exception('Could not read locked file: ' . $xml_file);
            }
        }

        return false;
    }

    public function save()
    {
        return $this->saveDo($this->settings);
    }

    private function saveDo($settingsCopy)
    {
        Array_XML::addCDATA($settingsCopy);
        if ($xml = Array_XML::array2xml($settingsCopy, 'settings')) {
            if ($xml == '') {
                throw new \Exception('Could not write empty settings');
            }

            $xml_file = BertaBase::$options['XML_ROOT'] . $this->fileName;

            // Use append flag ('a'), so we wouldn't delete the file, before lock
            $fp = fopen($xml_file, 'a');
            if (flock($fp, LOCK_EX)) {
                // Clear the file once we have the lock
                ftruncate($fp, 0);

                fwrite($fp, $xml);
                @chmod($xml_file, 0666);

                // Make sure everything is written to the file
                fflush($fp);
                flock($fp, LOCK_UN);
                fclose($fp);

                return true;
            } else {
                fclose($fp);
                throw new \Exception('Could not write locked file: ' . $xml_file);
            }
        }

        return false;
    }

    public function update($collection, $prop, $value)
    {
        if (empty($this->settings[$collection])) {
            $this->settings[$collection] = [];
        }
        $this->settings[$collection][$prop] = $value;

        return true;
    }

    public function delete($collection, $prop)
    {
        if (isset($this->settings[$collection][$prop])) {
            unset($this->settings[$collection][$prop]);
        }

        return true;
    }

    public function getFont($collection)
    {
        if (isset($this->settings[$collection]['googleFont']) && ! empty($this->settings[$collection]['googleFont'])) {
            $googleFont = explode(':', $this->settings[$collection]['googleFont']);

            return $googleFont[0];
        } elseif ($collection == 'priceItem') {
            if (isset($this->settings['shop'][$collection . 'googleFont']) && ! empty($this->settings['shop'][$collection . 'googleFont'])) {
                $googleFont = explode(':', $this->settings['shop'][$collection . 'googleFont']);

                return $googleFont[0];
            } else {
                return $this->get('shop', $collection . 'fontFamily');
            }
        } else {
            return $this->get($collection, 'fontFamily');
        }
    }

    public function get($collection, $prop, $useEmptyIfEmpty = false, $inheritBase = true)
    {
        if (isset($this->settings[$collection][$prop])) {
            $s = trim($this->settings[$collection][$prop]);
            if (! $s && $this->base && $this->base->exists($collection, $prop)) {
                $s = trim($this->base->get($collection, $prop, $useEmptyIfEmpty));
            }
            if (! $s && $useEmptyIfEmpty) {
                return $this->getEmpty($prop);
            } else {
                return $s;
            }
        } elseif ($inheritBase && $this->base && $this->base->exists($collection, $prop)) {
            return trim($this->base->get($collection, $prop, $useEmptyIfEmpty));
        } elseif (isset($this->settingsDefinition[$collection][$prop]['default'])) {
            return $this->settingsDefinition[$collection][$prop]['default'];
        } elseif ($inheritBase && $this->base && isset($this->base->settingsDefinition[$collection][$prop]['default'])) {
            return $this->base->settingsDefinition[$collection][$prop]['default'];
        } elseif ($useEmptyIfEmpty) {
            return $this->getEmpty($prop);
        } else {
            return null;
        }
    }

    public function getAll($collection, $useEmptyIfEmpty = false)
    {
        $retArr = [];
        if ($collection != 'siteTexts') {
            if (! empty($this->settingsDefinition[$collection])) {
                foreach ($this->settingsDefinition[$collection] as $prop => $propDefaults) {
                    $retArr[$prop] = $this->get($collection, $prop, $useEmptyIfEmpty);
                }
            }
        } elseif (! empty($this->settings[$collection])) {
            foreach ($this->settings[$collection] as $prop => $value) {
                $retArr[$prop] = $value;
            }
        }

        return $retArr;
    }

    public function getApplied()
    {
        $defArray = [];
        foreach ($this->settingsDefinition as $col => $arr) {
            $defArray[$col] = [];
            foreach ($arr as $s => $def) {
                if (! empty($def['default'])) {
                    $defArray[$col][$s] = $def['default'];
                }
            }
        }
        $workingArray = array_merge_replace_recursive($defArray, $this->settings);

        if ($this->base) {
            $baseArr = $this->base->getApplied();
            $workingArray = array_merge_replace_recursive($baseArr, $workingArray);
        }

        return $workingArray;
    }

    public function getDefinition($collection, $prop)
    {
        if (isset($this->settingsDefinition[$collection][$prop])) {
            return $this->settingsDefinition[$collection][$prop];
        } else {
            return null;
        }
    }

    public function getDefinitionParam($collection, $prop, $param)
    {
        if (isset($this->settingsDefinition[$collection][$prop][$param])) {
            return $this->settingsDefinition[$collection][$prop][$param];
        } else {
            return null;
        }
    }

    public function getEmpty($property = false)
    {
        return BertaContent::getXEmpty($property);
    }

    public function exists($collection, $prop)
    {
        if (isset($this->settings[$collection][$prop])) {
            return true;
        }

        return false;
    }

    public function definitionExists($collection, $prop)
    {
        if (isset($this->settingsDefinition[$collection][$prop])) {
            return true;
        }

        return false;
    }

    public function isRequired($collection, $prop)
    {
        if (! isset($this->settingsDefinition[$collection][$prop])) {
            return false;
        } elseif (! empty($this->settingsDefinition[$collection][$prop]['allow_blank'])) {
            return false;
        }

        return true;
    }

    public function oppositeAlign($align)
    {
        switch ($align) {
            case 'left':
                return 'right';
            case 'right':
                return 'left';
            default:
                return 'none';
        }
    }

    public function oppositeFloat($float)
    {
        return $this->oppositeAlign($float);
    }
}

function array_merge_replace_recursive()
{
    // Holds all the arrays passed
    $params = func_get_args();

    // First array is used as the base, everything else overwrites on it
    $return = array_shift($params);

    // Merge all arrays on the first array
    foreach ($params as $array) {
        foreach ($array as $key => $value) {
            // Numeric keyed values are added (unless already there)
            if (is_numeric($key) && (! in_array($value, $return))) {
                if (is_array($value)) {
                    $return[] = array_merge_replace_recursive($return[$key], $value);
                } else {
                    $return[] = $value;
                }

                // String keyed values are replaced/appended
            } else {
                if (isset($return[$key]) && is_array($value) && is_array($return[$key])) {
                    $return[$key] = array_merge_replace_recursive($return[$key], $value);
                } else {
                    $return[$key] = $value;
                }
            }
        }
    }

    return $return;
}
