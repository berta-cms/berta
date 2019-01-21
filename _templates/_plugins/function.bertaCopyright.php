<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.bertaCopyright.php
 * Type:     function
 * Name:     bertaCopyright
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_bertaCopyright($params, &$smarty)
{
    $str = I18n::_('berta_copyright_text');
    return $str;
}
