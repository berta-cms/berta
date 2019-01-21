<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.entryGalleryFirstImage.php
 * Type:     function
 * Name:     entryGalleryFirstImage
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_entryGalleryFirstImage($params, &$smarty)
{
    if (!empty($params['entry'])) {
        return BertaGallery::getFirstImage($params['entry']['__raw']);
    }

    return '';
}
