<?
define('AUTH_AUTHREQUIRED', true);
define('BERTA_ENVIRONMENT', 'engine');
include('inc.page.php');
$loggedIn = $berta->security->userLoggedIn;
include_once $ENGINE_ROOT . '_classes/class.bertaeditor.php';



$allSections = BertaContent::getSections();
$topPanelHTML = BertaEditor::getTopPanelHTML('sections');

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title><? echo $berta->settings->get('texts', 'pageTitle') ?> / sections</title>
<link rel="SHORTCUT ICON" href="favicon.ico"/>
<link rel="stylesheet" href="<? echo $ENGINE_ABS_ROOT ?>css/default.css" type="text/css"  charset="utf-8" />
<link rel="stylesheet" href="<? echo $ENGINE_ABS_ROOT ?>css/editor.css.php" type="text/css"  charset="utf-8" />
<? include 'inc.header_default_scripts.php' ?>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/Assets.js" charset="utf-8"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/BertaEditorBase.js"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/inline_edit.js" charset="utf-8"></script>
<script type="text/javascript" src="<? echo $ENGINE_ABS_ROOT ?>js/BertaEditor_Sections.js" charset="utf-8"></script>
</head>

<body class="xSettingsPageBody" x_mode="sections">
	<form name="infoForm" id="infoForm">
		<input type="hidden" name="ENGINE_ROOT" id="ENGINE_ROOT" value="<? echo htmlspecialchars($ENGINE_ROOT) ?>" />
	</form>
	<? echo $topPanelHTML ?>
	<div id="allContainer">
		<div id="contentContainer">
			
			<h1 id="allPageTitle">Sections</h1>

			<div id="xSectionsEditor">
				<div class="listHead">
					<div class="csHandle">&nbsp;</div>
					<div class="csTitle">Title as displayed in main menu</div>
					<div class="csBehaviour">Type</div>
					<div class="csDetails">Details</div>
					<div class="csPub">Is published?</div>
					<div class="csDelete">Delete</div>
					<br class="clear" />
				</div>
				<ul><?
				$possibleTypes = 'default|Default';
				$typeValues = array('default' => 'Default');
				$typeParams = array();
				if(!empty($berta->template->sectionTypes)) {
					$possibleTypes = array();
					foreach($berta->template->sectionTypes as $sT => $sTParams) {
						$typeValues[$sT] = $sTParams['title'];
						$possibleTypes[] = "$sT|{$sTParams['title']}";
						if(!empty($sTParams['params'])) $typeParams[$sT] = $sTParams['params'];
					}
					$possibleTypes = implode('||', $possibleTypes);
				}
				
				//$possibleBehaviors = 
				
				foreach($allSections as $sN => $s) {
					$type = !empty($s['@attributes']['type']) ? $s['@attributes']['type'] : 'default';
					$typeTitle = isset($typeValues[$type]) ? $typeValues[$type] : $type;
					echo '<li class="xSection-' . $sN . '">';
					echo '<div class="csHandle"><span class="handle"></span></div>';
					echo '<div class="csTitle"><span class="' . $xEditSelectorSimple . ' xProperty-title xNoHTMLEntities xSection-' . $sN . ' xSectionField">' . (!empty($s['title']['value']) ? htmlspecialchars($s['title']['value']) : '') . '</span></div>';
					echo '<div class="csBehaviour"><span class="' . $xEditSelectorSelectRC . ' xProperty-type xSection-' . $sN . ' xSectionField" x_options="' . $possibleTypes . '">' . htmlspecialchars($typeTitle) . '</span></div>';
					
					echo '<div class="csDetails">';
					if(!empty($typeParams[$type])) {
						foreach($typeParams[$type] as $pName => $p) {
							$value = !empty($s[$pName]['value']) ? $s[$pName]['value'] : '';
							if(!$value && $p['default']) $value = $p['default'];
							echo BertaEditor::getSettingsItemEditHTML($pName, $p, $value, array('xSection' => $sN, 'xSectionField'));
						}
					}
					
					//if($behaviour == 'external link')
					//	echo '<span class="' . $xEditSelectorSimple . ' xProperty-sectionsEditor/link xNoHTMLEntities xParam-' . $sN . ' xSectionField" title="">' . (!empty($s['link']['value']) ? htmlspecialchars($s['link']['value']) : '') . '</span>';
					echo '</div>';
					
					echo '<div class="csPub"><span class="' . $xEditSelectorYesNo . ' xProperty-published xSection-' . $sN . ' xSectionField">' . (!empty($s['@attributes']['published']) ? '1' : '0') . '</span></div>';
					echo '<div class="csDelete"><a href="#" class="xSectionDelete">delete</a></div>';
					echo '</li>';
				}
				
				
				
				?></ul><br class="clear" />
				
				<a id="xCreateNewSection" class="xPanel" href="#" class="xAction-sectionCreateNew"><span>create new section</span></a>
			
			
				<br class="clear" />
				<hr />
				<h2></h2>

				<div class="entry">
					<div class="caption">What are sections?</div>
					<div class="value value-long">
						Sections are main divisions in your site. Think of them as containers for your content. They appear as menu items in the main menu. 
					</div>
				</div>
				<div class="entry">
					<div class="caption">What is the "external link"?</div>
					<div class="value value-long">
						If you want any of the items in your main menu to lead the visitor somewhere else than your site, specify the external link.
						It can be an email link (e.g., <em>mailto:sombeody@someplace.net</em>) or a link to another website (e.g. <em>http://www.example.com</em>).
					</div>
				</div>
				<br class="clear" />
				<p>&nbsp; </p>
			</div>

			

			
		</div>
	</div>
</body>
</html>
