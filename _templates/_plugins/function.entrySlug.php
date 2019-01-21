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
function smarty_function_entrySlug($params, &$smarty)
{
    global $berta;

    if (!empty($params['entry'])) {
        $section_type = isset($berta->sections[$berta->sectionName]['@attributes']['type']) ? $berta->sections[$berta->sectionName]['@attributes']['type'] : null;

        if ($section_type == 'portfolio' && isset($params['entry']['title']) && $params['entry']['title']) {
            $title = $params['entry']['title'];
        } else {
            $title = 'entry-' . $params['entry']['id'];
        }

        $slug = strtolower(BertaUtils::canonizeString($title, '-', '-'));

        return $slug;
    }

    return '';
}
