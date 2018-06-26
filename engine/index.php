<?php
if (!$INDEX_INCLUDED) {
    define('AUTH_AUTHREQUIRED', true); // require authentification if inside engine folder
    define('BERTA_ENVIRONMENT', 'engine');
} else {
    define('SETTINGS_INSTALLREQUIRED', true);	// don't require INSTALL if just watching the site
}

include __dir__ . '/inc.page.php';

if (!$berta->security->userLoggedIn) {
    include_once $ENGINE_ROOT_PATH . 'editor/index.php';
    exit;
}
include_once $ENGINE_ROOT_PATH . '_classes/class.bertaeditor.php';

if (empty($INDEX_INCLUDED)) {
    $INDEX_INCLUDED = false;
}

$int_version = BertaEditor::$options['int_version'];

?><!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title><?php echo $berta->settings->get('texts', 'pageTitle') ?></title>
    <link rel="SHORTCUT ICON" href="favicon.ico"/>
    <link rel="stylesheet" href="<?php echo $ENGINE_ROOT_URL ?>css/backend.min.css?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
    <link rel="stylesheet" href="<?php echo $ENGINE_ROOT_URL ?>css/editor.css.php?<?php echo $int_version ?>" type="text/css" charset="utf-8" />

    <?php echo BertaTemplate::sentryScripts(); ?>
    <script type="text/javascript">
    var bertaGlobalOptions = {
        "paths":{
        "engineRoot":"<?php echo BertaEditor::$options['ENGINE_ROOT_URL'] ?>",
        "engineABSRoot":"<?php echo BertaEditor::$options['ENGINE_ROOT_URL'] ?>",
        "siteABSRoot" : "<?php echo BertaEditor::$options['SITE_ROOT_URL'] ?>",
        "template" : "<?php echo BertaEditor::$options['SITE_ROOT_URL'] . '_templates/' . $berta->template->name . '/' ?>"
        },
        "skipTour": <?php echo (isset($sections) && count($sections)) || $berta->settings->get('siteTexts', 'tourComplete') ? 'true' : 'false' ?>,
        "session_id" : "<?php echo session_id() ?>"
    };
    </script>
    <style>
        html,body {
            width: 100%;
            height: 100%;
            margin: 0;
        }
        body {
            overflow-y: hidden;
        }
    </style>
</head>
<body class="bt-content-editor">
    <?php echo BertaEditor::getTopPanelHTML('site') ?>
    <iframe src="/engine/editor" frameborder="0" style="width:100%;height:100%;"></iframe>
</body>
</html>
