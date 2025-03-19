<?php

/**
 * make a recursive copy of an array
 *
 * @param  array  $aSource
 * @return array copy of source array
 */
function array_copy($aSource)
{
    // check if input is really an array
    if (! is_array($aSource)) {
        throw new Exception('Input is not an Array');
    }

    // initialize return array
    $aRetAr = [];

    // get array keys
    $aKeys = array_keys($aSource);
    // get array values
    $aVals = array_values($aSource);

    // loop through array and assign keys+values to new return array
    for ($x = 0; $x < count($aKeys); $x++) {
        // clone if object
        if (is_object($aVals[$x])) {
            $aRetAr[$aKeys[$x]] = clone $aVals[$x];
            // recursively add array
        } elseif (is_array($aVals[$x])) {
            $aRetAr[$aKeys[$x]] = array_copy($aVals[$x]);
            // assign just a plain scalar value
        } else {
            $aRetAr[$aKeys[$x]] = $aVals[$x];
        }
    }

    return $aRetAr;
}

// For 4.3.0 <= PHP <= 5.4.0
if (! function_exists('http_response_code')) {
    function http_response_code($newcode = null)
    {
        static $code = 200;
        if ($newcode !== null) {
            header('X-PHP-Response-Code: ' . $newcode, true, $newcode);
            if (! headers_sent()) {
                $code = $newcode;
            }
        }

        return $code;
    }
}

function d($var)
{
    echo '<div style="text-align:left;"><pre>';
    print_r($var);
    echo '</pre></div>';
}
