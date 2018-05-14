<?php
namespace App\Shared;

/**
 * Using a class, so we can import the helper functions and use them in
 * PHP versions older then 5.6.
 */
class Helpers {

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
    public static function arrayToJsonObject(array $array) {
        $ret = [];
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $ret[$key] = self::arrayToJsonObject($value);
            } else {
                $ret[$key] = $value;
            }
        }
        if (self::isAssociativeArray($ret)) {
            return (object) $ret;
        }
        return $ret;
    }

    /**
     * Check if the given array is map type array, like JSON object or Python map.
     *
     * @param array $array
     * @return boolean
     */
    public static function isAssociativeArray(array $array) {
        /* This might be an issue for JSON conversion:
        - we can not know if an empty array is supposed to be associative */
        if ($array === array()) { return false; }

        if (array_keys($array) === range(0, count($array) - 1)) {
            return false;
        }
        return true;
    }
}
