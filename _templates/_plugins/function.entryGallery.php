<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.entryGallery.php
 * Type:     function
 * Name:     entryGallery
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_entryGallery($params, &$smarty)
{
    global $berta;

    if (!empty($params['entry'])) {
        return BertaGallery::getHTMLForEntry($params['entry']['__raw'], $berta->environment == 'engine');
    }

    return '';
}
