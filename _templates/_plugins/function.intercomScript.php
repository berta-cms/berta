<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.intercomScript.php
 * Type:     function
 * Name:     intercomScript
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_intercomScript($params, &$smarty)
{
    return class_exists('BertaEditor') ? BertaEditor::intercomScript() : '';
}
