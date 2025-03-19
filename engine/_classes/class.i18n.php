<?php

class I18n extends BertaBase
{
    public static $translations;

    public $default_lang;

    public function __construct()
    {
        $this->default_lang = self::$options['default_language'];
    }

    public static function load_language($lang = null)
    {
        if ($lang && file_exists(self::$options['ENGINE_ROOT_PATH'] . 'lang/' . $lang . '.php')) {
            self::$translations = include self::$options['ENGINE_ROOT_PATH'] . 'lang/' . $lang . '.php';
        } elseif (file_exists(self::$options['ENGINE_ROOT_PATH'] . 'lang/' . self::default_lang . '.php')) {
            self::$translations = include self::$options['ENGINE_ROOT_PATH'] . 'lang/' . self::default_lang . '.php';
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
