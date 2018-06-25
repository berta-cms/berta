<?php
define('AUTH_AUTHREQUIRED', true);
define('BERTA_ENVIRONMENT', 'engine');
include('inc.page.php');
$loggedIn = $berta->security->userLoggedIn;
include_once $ENGINE_ROOT_PATH . '_classes/class.bertaeditor.php';

$allSections = BertaContent::getSections();
$topPanelHTML = BertaEditor::getTopPanelHTML('sections');
$int_version = BertaEditor::$options['int_version'];
$site = empty($options['MULTISITE']) ? '0' : $options['MULTISITE'];

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title><?php echo $berta->settings->get('texts', 'pageTitle') ?> / <?php echo I18n::_('Sections') ?></title>
<link rel="SHORTCUT ICON" href="favicon.ico"/>
<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/backend.min.css?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
<link rel="stylesheet" href="<?php echo $ENGINE_ABS_ROOT ?>css/editor.css.php?<?php echo $int_version ?>" type="text/css" charset="utf-8" />
<?php include('inc.head.php'); ?>
</head>

<body class="xSettingsPageBody page-xSections" x_mode="sections">
    <form name="infoForm" id="infoForm">
        <input type="hidden" name="ENGINE_ROOT" id="ENGINE_ROOT" value="<?php echo htmlspecialchars($ENGINE_ROOT_URL) ?>" />
    </form>
    <?php echo $topPanelHTML ?>
    <div id="allContainer">
        <div id="contentContainer">

            <h1 id="allPageTitle"><?php echo I18n::_('Sections') ?></h1>

            <div id="xSectionsEditor">
                <div class="listHead">
                    <div class="csHandle">&nbsp;</div>
                    <div class="csTitle"><?php echo I18n::_('Title as displayed in main menu') ?></div>
                    <div class="csBehaviour"><?php echo I18n::_('Type') ?></div>
                    <div class="csDetails"><?php echo I18n::_('Details') ?></div>
                    <div class="csPub"><?php echo I18n::_('Is published?') ?></div>
                    <div class="csClone"><?php echo I18n::_('Clone') ?></div>
                    <div class="csDelete"><?php echo I18n::_('Delete') ?></div>
                    <br class="clear" />
                </div>
                <ul><?php
                $possibleTypes = 'default|Default';
                $typeValues = array('default' => 'Default');
                $typeParams = array();
                if(!empty($berta->template->sectionTypes)) {
                    $possibleTypes = array();
                    foreach($berta->template->sectionTypes as $sT => $sTParams) {
                        $typeValues[$sT] = $sTParams['title'];
                        $possibleTypes[] = "$sT|{$sTParams['title']}";

                        if(!empty($sTParams['params'])) {
                            $typeParams[$sT] = $sTParams['params'];
                        }
                    }
                    $possibleTypes = implode('||', $possibleTypes);
                }

                $i = 0;
                foreach($allSections as $sN => $s) {
                    $basePath = $site . '/section/' . $i;
                    $type = !empty($s['@attributes']['type']) ? $s['@attributes']['type'] : 'default';
                    $typeTitle = isset($typeValues[$type]) ? $typeValues[$type] : $type;
                    echo '<li class="xSection-' . $sN . '">';
                    echo '<div class="csHandle"><span class="handle"></span></div>';
                    echo '<div class="csTitle"><span class="' . $xEditSelectorSimple . ' xProperty-title xNoHTMLEntities xSection-' . $sN . ' xSectionField" data-path="' . $basePath . '/title">' . (!empty($s['title']['value']) ? htmlspecialchars($s['title']['value']) : '') . '</span></div>';
                    echo '<div class="csBehaviour"><span class="' . $xEditSelectorSelectRC . ' xProperty-type xSection-' . $sN . ' xSectionField" data-path="' . $basePath . '/@attributes/type" x_options="' . $possibleTypes . '">' . htmlspecialchars($typeTitle) . '</span></div>';

                    echo '<div class="csDetails">';
                    if(!empty($typeParams[$type])) {

                        //remove responsive section settings
                        if ($berta->template->settings->get('pageLayout', 'responsive') != 'yes') {
                            unset(
                                $typeParams['default']['columns'],
                                $typeParams['default']['entryMaxWidth'],
                                $typeParams['default']['entryPadding'],
                                $typeParams['shop']['columns'],
                                $typeParams['shop']['entryMaxWidth'],
                                $typeParams['shop']['entryPadding']
                            );
                        }
                        foreach($typeParams[$type] as $pName => $p) {
                            $value = !empty($s[$pName]['value']) ? $s[$pName]['value'] : '';

                            if(!$value && $p['default']) {
                                $value = $p['default'];
                            }

                            echo BertaEditor::getSettingsItemEditHTML(
                                $pName,
                                $p,
                                $value,
                                array('xSection' => $sN, 'xSectionField'),
                                'div',
                                $basePath . '/' . $pName
                            );
                        }
                    }
                    echo '</div>';

                    echo '<div class="csPub"><span class="' . $xEditSelectorYesNo . ' xProperty-published xSection-' . $sN . ' xSectionField" data-path="' . $basePath . '/@attributes/published">' . (!empty($s['@attributes']['published']) ? '1' : '0') . '</span></div>';
                    echo '<div class="csClone"><a href="#" class="xSectionClone">'.I18n::_('clone').'</a></div>';
                    echo '<div class="csDelete"><a href="#" class="xSectionDelete">'.I18n::_('delete').'</a></div>';
                    echo '</li>';

                    $i++;
                }

                ?></ul><br class="clear" />

                <a id="xCreateNewSection" class="xPanel" href="#" class="xAction-sectionCreateNew"><span><?php echo I18n::_('create new section') ?></span></a>

                <br class="clear" />
                <hr />
                <h2></h2>

                <div class="entry">
                    <div class="caption"><?php echo I18n::_('What are sections?') ?></div>
                    <div class="value value-long">
                        <?php echo I18n::_('sections_help_text') ?>
                    </div>
                </div>
                <div class="entry">
                    <div class="caption"><?php echo I18n::_('What is the "external link"?') ?></div>
                    <div class="value value-long">
                        <?php echo I18n::_('external_link_help_text') ?>
                    </div>
                </div>
                <br class="clear" />
                <p>&nbsp; </p>
            </div>
        </div>
    </div>
    <?php echo BertaEditor::intercomScript() ?>
    <div id="templateList">
        <?php include $options['ENGINE_ROOT'] . 'js/ng/templates/sections.html'; ?>
    </div>
</body>
</html>
