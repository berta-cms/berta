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
                        $berta->allContent[$berta->sectionName]['entry'][$eKey]['mediaCacheData']['@attributes']['type'] = 'pile';
                    }
                }
                break;

            case 'mashup':
            case 'white':
                foreach( $berta->content['entry'] as $eKey => $e ) {
                    $galleryType = $e['mediaCacheData']['@attributes']['type'];

                    if( $galleryType == 'row' ) {
                        $berta->content['entry'][$eKey]['mediaCacheData']['@attributes']['type'] = 'column';
                        $berta->allContent[$berta->sectionName]['entry'][$eKey]['mediaCacheData']['@attributes']['type'] = 'column';
                    }
                }
                break;
        }

        $berta->content['@attributes']['last_upd_ver'] = $options['int_version'];
        $berta->allContent[$berta->sectionName]['@attributes']['last_upd_ver'] = $options['int_version'];
        $berta->template->addContent($berta->requestURI, $berta->sectionName, $berta->sections, $berta->tagName, $berta->tags, $berta->content, $berta->allContent);
        BertaEditor::saveBlog($berta->sectionName, $berta->content);
    }
}

?>