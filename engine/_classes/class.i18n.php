<?php

class I18n extends BertaBase
{
    public static $translations;

    public static function load_language($lang = null)
    {
        $defaultLang = self::$options['default_language'];

        if ($lang && file_exists(self::$options['ENGINE_ROOT_PATH'] . 'lang/' . $lang . '.php')) {
            self::$translations = include self::$options['ENGINE_ROOT_PATH'] . 'lang/' . $lang . '.php';
        } elseif (file_exists(self::$options['ENGINE_ROOT_PATH'] . 'lang/' . $defaultLang . '.php')) {
            self::$translations = include self::$options['ENGINE_ROOT_PATH'] . 'lang/' . $defaultLang . '.php';
        }
    }

    /**
     * @param  string  $key
     * @return string
     */
    public static function _($key)
    {
        if (! empty(self::$translations) && isset(self::$translations[$key])) {
            return self::$translations[$key];
        }

        return $key;
    }
}
