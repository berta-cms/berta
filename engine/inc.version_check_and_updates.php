<?php

include_once($ENGINE_ROOT . '_classes/class.bertaeditor.php');

if( !empty($berta->content['entry']) ) {
    $tplName = $berta->template->settings->templateName;

    // Updates for 0.8.2
    if( empty($berta->content['@attributes']['last_upd_ver']) || ($berta->content['@attributes']['last_upd_ver'] < 1082) ) {
        switch($tplName) {
            case 'messy':
                foreach( $berta->content['entry'] as $eKey => $e ) {
                    $galleryType = $e['mediaCacheData']['@attributes']['type'];

                    if( $galleryType == 'row' ) {
                        $berta->content['entry'][$eKey]['mediaCacheData']['@attributes']['type'] = 'pile';
                    }
                }
                break;

            case 'mashup':
            case 'white':
                foreach( $berta->content['entry'] as $eKey => $e ) {
                    $galleryType = $e['mediaCacheData']['@attributes']['type'];

                    if( $galleryType == 'row' ) {
                        $berta->content['entry'][$eKey]['mediaCacheData']['@attributes']['type'] = 'column';
                    }
                }
                break;
        }

        $berta->content['@attributes']['last_upd_ver'] = $options['int_version'];
        BertaEditor::saveBlog($berta->sectionName, $berta->content);
        //header('Location: ' . $_SERVER['PHP_SELF']);
    }
}

?>