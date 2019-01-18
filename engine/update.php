<?php

//sleep(0.2);
define('AUTH_AUTHREQUIRED', true);
define('SETTINGS_INSTALLREQUIRED', false);  // for the wizzard to be able to save settings
define('BERTA_ENVIRONMENT', 'engine');
include 'inc.page.php';
include_once '_classes/Zend/Json.php';
include_once '_classes/class.array_xml.php';
include_once '_classes/class.bertaeditor.php';

/* This is the correct way to access HTTP_RAW_POST_DATA in php. In PHP 7 $HTTP_RAW_POST_DATA variable doesn't exist */
$jsonRequest = file_get_contents('php://input');

if (empty($jsonRequest)) {
    echo Zend_Json::encode(['update' => false, 'real' => false, 'eval_script' => false, 'error_message' => 'NO DATA!']);
    exit;
}

// convert bad characters to their escaped equivalents
$jsonRequest = str_replace(["\n", "\r", "\t"], ['\n', '', ' '], $jsonRequest);

// decode the json string into an array
$decoded = $result = json_decode($jsonRequest, true);
if (empty($decoded['action'])) {
    $decoded['action'] = 'SAVE';
}  // default action = save
if (!isset($decoded['property'])) {
    $decoded['property'] = '';
}

$returnUpdate = $returnReal = $decoded['value'];
$returnError = $returnEvalScript = false;
$returnValues = [];
$returnParams = '';

// &nbsp; is put if editing an empty field (otherwise safari collapses it)
if (is_string($decoded['value']) && trim($decoded['value']) == '&nbsp;') {
    $returnUpdate = $returnReal = $decoded['value'] = '';
}

//log event before update
BertaUtils::logEvent('before update');

// update the blog or settings ---------------------------------------------------------------------------------
if (!$returnError) {
    $allowFormatModifier = false;

    if (!empty($decoded['section'])) {   // the property is for for the blog
        if (!empty($decoded['entry'])) { // the property belongs to an entry
            $blog = BertaEditor::loadBlog($decoded['section']);
            $e = &BertaEditor::getEntry($decoded['entry'], $blog);

            if ($decoded['property'] == 'galleryImageCrop') {    // image gets cropped
                $mediafolder = $e['mediafolder']['value'] . '/';
                $path = $options['MEDIA_ROOT'] . $mediafolder;
                $url_path = $options['MEDIA_URL'] . $mediafolder;

                $crop = BertaUtils::smart_crop_image($path . $decoded['value'], $decoded['x'], $decoded['y'], $decoded['w'], $decoded['h']);
                BertaEditor::images_deleteDerivatives($path, $decoded['value']);

                //rename cropped file to prevent caching
                $fileInfo = pathinfo($path . $decoded['value']);
                $newFileName = $fileInfo['filename'] . time() . '.' . $fileInfo['extension'];
                @rename($path . $decoded['value'], $path . $newFileName);

                if (!isset($e['mediaCacheData']['file']['value']) && count($e['mediaCacheData']['file']) > 1) {
                    foreach ($e['mediaCacheData']['file'] as $cacheIndex => $im) {
                        if ($im['@attributes']['src'] == $decoded['value']) {
                            $e['mediaCacheData']['file'][$cacheIndex]['@attributes']['src'] = $newFileName;
                            $e['mediaCacheData']['file'][$cacheIndex]['@attributes']['width'] = $crop['w'];
                            $e['mediaCacheData']['file'][$cacheIndex]['@attributes']['height'] = $crop['h'];
                            break;
                        }
                    }
                } else {
                    $e['mediaCacheData']['file']['@attributes']['src'] = $newFileName;
                    $e['mediaCacheData']['file']['@attributes']['width'] = $crop['w'];
                    $e['mediaCacheData']['file']['@attributes']['height'] = $crop['h'];
                }

                $smallThumb = BertaEditor::images_getSmallThumbFor($mediafolder . $newFileName);

                $returnUpdate = $newFileName;
                $returnParams = [
                    'path' => $url_path,
                    'smallThumb' => $smallThumb
                    ];

            }

            $e['updated'] = ['value' => date('d.m.Y H:i:s')];
            BertaEditor::saveBlog($decoded['section'], $blog);
            if ($decoded['property'] == 'submenu') {
                BertaEditor::populateTags($decoded['section'], $blog);
            }
        }
    }

    // format modifier
    if ($allowFormatModifier) {
        if (!empty($decoded['format_modifier'])) {
            $berta->template->loadSmartyPlugin('modifier', $decoded['format_modifier']);
            $modName = 'smarty_modifier_' . $decoded['format_modifier'];
            if (function_exists($modName)) {
                $returnUpdate = @call_user_func($modName, $returnUpdate);
            }
        }
    }
}

// add "last updated" time
$berta->settings->update('berta', 'lastUpdated', gmdate('D, d M Y H:i:s', time()) . ' GMT');
$berta->settings->save();

//log event after update
BertaUtils::logEvent('after update');

echo Zend_Json::encode(
    $returnValues ?
                        $returnValues :
                        [
                        'update' => $returnUpdate,              // the returned value
                        'updateText' => $returnUpdate,          // the text for the returned value (used by, e.g., the RC SELECT)
                        'real' => $returnReal,                  // the returned "real" value
                        'eval_script' => $returnEvalScript,
                        'error_message' => $returnError,
                        'params' => $returnParams
                        ]
                    );
