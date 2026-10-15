<?php

namespace App\Shared;

/**
 * Translations of the editor's texts, from the `engine/lang` files. A text is looked up by its key:
 * either the English text itself, or a key whose English text is in `en.php`.
 */
class I18n
{
    public static $translations;

    /**
     * The English texts of the keys, for a language that has no translation of a key
     *
     * @var array<string, string>
     */
    public static $fallback = [];

    public static $default_lang = 'en';

    public static function load_language($lang = null)
    {
        $ENGINE_ROOT_PATH = realpath(config('app.old_berta_root') . '/engine');

        if ($lang && file_exists($ENGINE_ROOT_PATH . '/lang/' . $lang . '.php')) {
            self::$translations = include $ENGINE_ROOT_PATH . '/lang/' . $lang . '.php';
        } elseif (file_exists($ENGINE_ROOT_PATH . '/lang/' . self::$default_lang . '.php')) {
            self::$translations = include $ENGINE_ROOT_PATH . '/lang/' . self::$default_lang . '.php';
        }

        $englishPath = $ENGINE_ROOT_PATH . '/lang/en.php';
        self::$fallback = file_exists($englishPath) ? include $englishPath : [];
    }

    /**
     * @param  string  $key
     * @return string
     */
    public static function _($key)
    {
        return self::$translations[$key] ?? self::$fallback[$key] ?? $key;
    }
}
