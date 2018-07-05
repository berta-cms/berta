<?php
namespace App\Shared;

use Firebase\JWT\JWT;

/**
 * Using a class, so we can import the helper functions and use them in
 * PHP versions older then 5.6.
 */
class Helpers
{

    /**
     * Turn an array to an array object combination representing JSON data structure and return it.
     *
     * @param array $array
     * @return object|array
     *
     * Associative arrays are converted to stdClass objects,
     * but normal arrays are left as arrays. This fits nice to JSON structure.
     *
     * @example
     * This is object, so it should be represented as one in PHP:
     * ```json
     * {
     *  prop: 'val'
     * }
     * ```
     * ```php
     * (object)[
     *  'prop' => 'val'
     * ]
     * ```
     *
     * This is Array so it should be array in PHP:
     * ```json
     * [ 1, 2, 3 ]
     * ```
     * ```php
     * [1, 2, 3]
     * ```
     */
    public static function arrayToJsonObject(array $array)
    {
        $ret = [];
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $ret[$key] = self::arrayToJsonObject($value);

                /** @todo: This should be done by XML conversion function: */
            } else if (is_string($value) && is_numeric($value)) {
                $ret[$key] = strpos($value, '.') === false ? (int)$value : (float)$value;

            } else {
                $ret[$key] = $value;
            }
        }
        if (self::isAssociativeArray($ret)) {
            return (object)$ret;
        }
        return $ret;
    }

    /**
     * Check if the given array is map type array, like JSON object or Python map.
     *
     * @param array $array
     * @return boolean
     */
    public static function isAssociativeArray(array $array)
    {
        /* This might be an issue for JSON conversion:
        - we can not know if an empty array is supposed to be associative */
        if ($array === array()) {
            return false;
        }

        if (array_keys($array) === range(0, count($array) - 1)) {
            return false;
        }
        return true;
    }

    /**
     */
    public static function slugify($text, $replacementStr = '-', $allowNonWordChars = '', $reallyRemoveOtherChars = false)
    {
        $char_map = array(
            // Latin
            'À' => 'A', 'Á' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Ä' => 'A', 'Å' => 'A', 'Æ' => 'AE', 'Ç' => 'C',
            'È' => 'E', 'É' => 'E', 'Ê' => 'E', 'Ë' => 'E', 'Ì' => 'I', 'Í' => 'I', 'Î' => 'I', 'Ï' => 'I',
            'Ð' => 'D', 'Ñ' => 'N', 'Ò' => 'O', 'Ó' => 'O', 'Ô' => 'O', 'Õ' => 'O', 'Ö' => 'O', 'Ő' => 'O',
            'Ø' => 'O', 'Ù' => 'U', 'Ú' => 'U', 'Û' => 'U', 'Ü' => 'U', 'Ű' => 'U', 'Ý' => 'Y', 'Þ' => 'TH',
            'ß' => 'ss',
            'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a', 'æ' => 'ae', 'ç' => 'c',
            'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i',
            'ð' => 'd', 'ñ' => 'n', 'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o', 'ö' => 'o', 'ő' => 'o',
            'ø' => 'o', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ü' => 'u', 'ű' => 'u', 'ý' => 'y', 'þ' => 'th',
            'ÿ' => 'y',

            // Latin symbols
            '©' => '(c)',

            // Greek
            'Α' => 'A', 'Β' => 'B', 'Γ' => 'G', 'Δ' => 'D', 'Ε' => 'E', 'Ζ' => 'Z', 'Η' => 'H', 'Θ' => '8',
            'Ι' => 'I', 'Κ' => 'K', 'Λ' => 'L', 'Μ' => 'M', 'Ν' => 'N', 'Ξ' => '3', 'Ο' => 'O', 'Π' => 'P',
            'Ρ' => 'R', 'Σ' => 'S', 'Τ' => 'T', 'Υ' => 'Y', 'Φ' => 'F', 'Χ' => 'X', 'Ψ' => 'PS', 'Ω' => 'W',
            'Ά' => 'A', 'Έ' => 'E', 'Ί' => 'I', 'Ό' => 'O', 'Ύ' => 'Y', 'Ή' => 'H', 'Ώ' => 'W', 'Ϊ' => 'I',
            'Ϋ' => 'Y',
            'α' => 'a', 'β' => 'b', 'γ' => 'g', 'δ' => 'd', 'ε' => 'e', 'ζ' => 'z', 'η' => 'h', 'θ' => '8',
            'ι' => 'i', 'κ' => 'k', 'λ' => 'l', 'μ' => 'm', 'ν' => 'n', 'ξ' => '3', 'ο' => 'o', 'π' => 'p',
            'ρ' => 'r', 'σ' => 's', 'τ' => 't', 'υ' => 'y', 'φ' => 'f', 'χ' => 'x', 'ψ' => 'ps', 'ω' => 'w',
            'ά' => 'a', 'έ' => 'e', 'ί' => 'i', 'ό' => 'o', 'ύ' => 'y', 'ή' => 'h', 'ώ' => 'w', 'ς' => 's',
            'ϊ' => 'i', 'ΰ' => 'y', 'ϋ' => 'y', 'ΐ' => 'i',

            // Turkish
            'Ş' => 'S', 'İ' => 'I', 'Ç' => 'C', 'Ü' => 'U', 'Ö' => 'O', 'Ğ' => 'G',
            'ş' => 's', 'ı' => 'i', 'ç' => 'c', 'ü' => 'u', 'ö' => 'o', 'ğ' => 'g',

            // Russian
            'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Д' => 'D', 'Е' => 'E', 'Ё' => 'Yo', 'Ж' => 'Zh',
            'З' => 'Z', 'И' => 'I', 'Й' => 'J', 'К' => 'K', 'Л' => 'L', 'М' => 'M', 'Н' => 'N', 'О' => 'O',
            'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T', 'У' => 'U', 'Ф' => 'F', 'Х' => 'H', 'Ц' => 'C',
            'Ч' => 'Ch', 'Ш' => 'Sh', 'Щ' => 'Sh', 'Ъ' => '', 'Ы' => 'Y', 'Ь' => '', 'Э' => 'E', 'Ю' => 'Yu',
            'Я' => 'Ya',
            'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'yo', 'ж' => 'zh',
            'з' => 'z', 'и' => 'i', 'й' => 'j', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n', 'о' => 'o',
            'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't', 'у' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'c',
            'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sh', 'ъ' => '', 'ы' => 'y', 'ь' => '', 'э' => 'e', 'ю' => 'yu',
            'я' => 'ya',

            // Ukrainian
            'Є' => 'Ye', 'І' => 'I', 'Ї' => 'Yi', 'Ґ' => 'G',
            'є' => 'ye', 'і' => 'i', 'ї' => 'yi', 'ґ' => 'g',

            // Czech
            'Č' => 'C', 'Ď' => 'D', 'Ě' => 'E', 'Ň' => 'N', 'Ř' => 'R', 'Š' => 'S', 'Ť' => 'T', 'Ů' => 'U',
            'Ž' => 'Z',
            'č' => 'c', 'ď' => 'd', 'ě' => 'e', 'ň' => 'n', 'ř' => 'r', 'š' => 's', 'ť' => 't', 'ů' => 'u',
            'ž' => 'z',

            // Polish
            'Ą' => 'A', 'Ć' => 'C', 'Ę' => 'e', 'Ł' => 'L', 'Ń' => 'N', 'Ó' => 'o', 'Ś' => 'S', 'Ź' => 'Z',
            'Ż' => 'Z',
            'ą' => 'a', 'ć' => 'c', 'ę' => 'e', 'ł' => 'l', 'ń' => 'n', 'ó' => 'o', 'ś' => 's', 'ź' => 'z',
            'ż' => 'z',

            // Latvian
            'Ā' => 'A', 'Č' => 'C', 'Ē' => 'E', 'Ģ' => 'G', 'Ī' => 'i', 'Ķ' => 'k', 'Ļ' => 'L', 'Ņ' => 'N',
            'Š' => 'S', 'Ū' => 'u', 'Ž' => 'Z',
            'ā' => 'a', 'č' => 'c', 'ē' => 'e', 'ģ' => 'g', 'ī' => 'i', 'ķ' => 'k', 'ļ' => 'l', 'ņ' => 'n',
            'š' => 's', 'ū' => 'u', 'ž' => 'z',

            //Lithuanian
            'Ą' => 'A', 'Ę' => 'E', 'Ė' => 'E', 'Į' => 'I', 'Ų' => 'U',
            'ą' => 'a', 'ę' => 'e', 'ė' => 'e', 'į' => 'i', 'ų' => 'u',

            //Other
            'ɗ' => 'd', 'ə' => 'e', 'ʍ' => 'm', 'ş' => 's', 'ţ' => 't',
            'Ɗ' => 'D', 'Ə' => 'E', 'Ş' => 'S', 'Ţ' => 'T',
        );

        $text = str_replace(array_keys($char_map), $char_map, $text);

        // replace all other characters with the replacement string
        if ($reallyRemoveOtherChars) {
            $text = preg_replace('/([^a-zA-Z0-9' . $allowNonWordChars . '])+/', $replacementStr, $text);
        } else {
            $text = mb_ereg_replace("[^\w$allowNonWordChars]", $replacementStr, $text);
        }

        //no duplicates
        $text = mb_ereg_replace("[$replacementStr]{2,}", $replacementStr, $text);

        // convert .- to .
        $text = str_replace('.' . $replacementStr, '.', $text);

        // remove . from the beinning and the end
        if (mb_substr($text, 0, 1) == '.') {
            $text = mb_substr($text, 1);
        }

        if (mb_substr($text, mb_strlen($text) - 1, 1) == '.') {
            $text = mb_substr($text, 0, mb_strlen($text) - 1);
        }

        // remove replacement strings from the beginning and the end
        if (mb_substr($text, 0, 1) == $replacementStr) {
            $text = mb_substr($text, 1);
        }

        if (mb_substr($text, mb_strlen($text) - 1, 1) == $replacementStr) {
            $text = mb_substr($text, 0, mb_strlen($text) - 1);
        }

        return strtolower($text);
    }

    /**
     * Return list of tags as string
     */
    public static function createEntryTagList($tags)
    {
        if (!$tags) {
            return '';
        }
        if (is_array($tags)) {
            return implode(', ', $tags);
        }

        return $tags;
    }

    public static function formatPrice($price, $currency)
    {
        $price = (float)$price;
        if ($price) {
            return sprintf("%01.2f", $price) . ' ' . $currency;
        }

        return '';
    }

    /**
     * Converts cart attributes comma separated string to array
     */
    public static function toCartAttributes($attributes)
    {
        $attributes = trim($attributes);
        $attributes = explode(',', $attributes);
        $attributes = array_map('trim', $attributes);
        $attributes = array_filter($attributes, function ($attribute) {
            return strlen($attribute);
        });

        return $attributes;
    }


    /**
     * Converts tags comma separated string to array
     */
    public static function toTags($tags)
    {
        $tags = trim($tags);
        $tags = explode(',', $tags);
        $tags = array_map('trim', $tags);
        $tags = array_filter($tags, function ($tag) {
            return strlen($tag);
        });

        return array_unique($tags);
    }


    /**
     * Converts array as list or arrays
     */
    public static function asList($val)
    {
        if (!$val) {
            return [];
        }

        if (is_array($val)) {
            if (array_values($val) !== $val) {
                return array(0 => $val);
            }
        } else {
            return array(0 => $val);
        }

        return $val;
    }

    public static function uuid_v4()
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',

        // 32 bits for "time_low"
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),

        // 16 bits for "time_mid"
            mt_rand(0, 0xffff),

        // 16 bits for "time_hi_and_version",
        // four most significant bits holds version number 4
            mt_rand(0, 0x0fff) | 0x4000,

        // 16 bits, 8 bits for "clk_seq_hi_res",
        // 8 bits for "clk_seq_low",
        // two most significant bits holds zero and one for variant DCE1.1
            mt_rand(0, 0x3fff) | 0x8000,

        // 48 bits for "node"
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff)
        );
    }

    public static function validate_token($token)
    {
        try {
            $app_key = config('app.key');
            $app_id = config('app.id');
            JWT::$leeway = 60;
            $decoded = JWT::decode($token, $app_key, ['HS256']);

            if ($decoded->sub !== $app_id) {
                return null;
            }
            return true;
        } catch (\Throwable $t) {
            \Log::error($t);
            return null;
        } catch (\Excpetion $e) {
            \Log::error($e);
            return null;
        }
    }
}
