<?php

namespace App\Shared;

class I18n
{
    static $translations;
    public static $default_lang = 'en';

    public static function load_language($lang = null)
    {
        $ENGINE_ROOT_PATH = realpath(config('app.old_berta_root'). '/engine');

        if($lang && file_exists($ENGINE_ROOT_PATH.'/lang/'.$lang.'.php'))
        {
            self::$translations = include($ENGINE_ROOT_PATH.'/lang/'.$lang.'.php');
        }
        elseif(file_exists($ENGINE_ROOT_PATH.'/lang/'. self::$default_lang.'.php'))
        {
            self::$translations = include($ENGINE_ROOT_PATH.'/lang/'.self::$default_lang.'.php');
        }
    }

    /**
     * @param   string  $key
     * @return  string
     *
     *
     */
    public static function _($key)
    {
        if(!empty(self::$translations) && isset(self::$translations[$key]))
        {
            return self::$translations[$key];
        }

        return $key;
    }
}
