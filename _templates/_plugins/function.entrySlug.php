<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.entrySlug.php
 * Type:     function
 * Name:     entrySlug
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_entrySlug($params, &$smarty) {

    if(!empty($params['entry'])) {
        $title = isset($params['entry']['title']) && $params['entry']['title'] ? $params['entry']['title'] : 'entry-'.$params['entry']['id'];
        $slug = strtolower(BertaUtils::canonizeString($title, '-', '-'));
        return $slug;
    }

    return '';
}
?>