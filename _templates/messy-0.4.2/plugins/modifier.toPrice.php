<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     modifier.toPrice.php
 * Type:     modifier
 * Name:     toPrice
 * Purpose:  converts tags array to tags list
 * -------------------------------------------------------------
 */
function smarty_modifier_toPrice($number)
{
    global $berta;

    $currency = $berta->template->settings->get('shop', 'currency');
    $number = (float) $number;
    if ($number) {
        return sprintf('%01.2f', $number) . ' ' . $currency;
    }

    return '';
}
