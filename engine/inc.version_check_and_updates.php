<?php

include_once $ENGINE_ROOT_PATH . '_classes/class.bertaeditor.php';

if (!empty($berta->content['entry'])) {
    $tplName = $berta->template->settings->templateName;

    //remove tiny_mce *.GZ file, if current version is different - to prevent errors if tiny_mce has changed
    if (empty($berta->content['@attributes']['last_upd_ver']) || ($berta->content['@attributes']['last_upd_ver'] != $options['version'])) {
        $old_gz_files = glob($ENGINE_ROOT_PATH . '_lib/tiny_mce/*.gz');
        if ($old_gz_files) {
            foreach ($old_gz_files as $filename) {
                @unlink($filename);
            }
        }
    }

    // Updates for 0.8.2
    // Starting from version 1.0.0 last_upd_ver contains version format v[x].[x].[x]
    // Before 1.0.0 it was int_version as integer
    if (empty($berta->content['@attributes']['last_upd_ver']) || (count(explode('.', $berta->content['@attributes']['last_upd_ver'])) == 1 && $berta->content['@attributes']['last_upd_ver'] < 1082)) {
        switch ($tplName) {
            case 'messy':
                foreach ($berta->content['entry'] as $eKey => $e) {
                    $galleryType = $e['mediaCacheData']['@attributes']['type'];

                    if ($galleryType == 'row') {
                        $berta->content['entry'][$eKey]['mediaCacheData']['@attributes']['type'] = 'pile';
                        $berta->allContent[$berta->sectionName]['entry'][$eKey]['mediaCacheData']['@attributes']['type'] = 'pile';
                    }
                }
                break;

            case 'mashup':
            case 'white':
                foreach ($berta->content['entry'] as $eKey => $e) {
                    $galleryType = $e['mediaCacheData']['@attributes']['type'];

                    if ($galleryType == 'row') {
                        $berta->content['entry'][$eKey]['mediaCacheData']['@attributes']['type'] = 'column';
                        $berta->allContent[$berta->sectionName]['entry'][$eKey]['mediaCacheData']['@attributes']['type'] = 'column';
                    }
                }
                break;
        }

        $berta->content['@attributes']['last_upd_ver'] = $options['version'];
        $berta->allContent[$berta->sectionName]['@attributes']['last_upd_ver'] = $options['version'];
        $berta->template->addContent($berta->requestURI, $berta->sectionName, $berta->sections, $berta->tagName, $berta->tags, $berta->content, $berta->allContent);
        BertaEditor::saveBlog($berta->sectionName, $berta->content);
    }
}
