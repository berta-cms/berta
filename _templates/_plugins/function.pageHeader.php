<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.pageHeader.php
 * Type:     function
 * Name:     pageHeader
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_pageHeader($params, &$smarty)
{
    global $berta;
    return $berta->security->userLoggedIn ?
                BertaEditor::getTopPanelHTML('site') :
                '';
}
