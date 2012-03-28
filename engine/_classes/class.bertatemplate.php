<?php

include_once dirname(__FILE__) . '/../_lib/smarty/Smarty.class.php';
include_once dirname(__FILE__) . '/Zend/Json.php';

class BertaTemplate extends BertaBase {
	
	private $smarty;
	
	public $name;
	public $loggedIn = false;
	public $templateHTML;
	
	public $sectionTypes;
	
	public $settingsDefinition;
	public $settings;
	
	private $requestURI;
	private $sectionName;
	private $sections;
	private $tagName;
	private $tags;
	
	public function BertaTemplate($templateName, $generalSettingsInstance = false, $loggedIn = false) {
		$this->name = $templateName;
		$this->loggedIn = $loggedIn;
		$this->environment = !empty(self::$options['ENVIRONMENT']) ? self::$options['ENVIRONMENT'] : 'site';

		$this->smarty = new Smarty();
		$this->smarty->auto_literal = false;	// to allow space aroun 
		$this->smarty->compile_dir = self::$options['CACHE_ROOT'];
		$this->smarty->cache_dir = self::$options['CACHE_ROOT'];
		$this->smarty->template_dir = self::$options['TEMPLATES_FULL_SERVER_PATH'];
		$this->smarty->plugins_dir = array('plugins', self::$options['TEMPLATES_FULL_SERVER_PATH'] . '_plugins');
		$this->smarty->register->resource('text', array(
			'BertaTemplate',
		    'smarty_resource_text_get_template',
		    'smarty_resource_text_get_timestamp',
		    'smarty_resource_text_get_secure',
		    'smarty_resource_text_get_trusted')
		);

		$this->load($this->name, $generalSettingsInstance);
	}
	
	public function load($templateName, $generalSettingsInstance = false) {

		//set default temaplte as messy
		if (!$templateName){	
            foreach ( $this->getAllTemplates() AS $tpl ){
                list($template_all)=explode('-',$tpl);
                if ($template_all=='messy'){
                    $templateName = $tpl;
                    break;
                }else{
                	$templateName = 'default';
                }
            }
            //save in settings
            $settings = new Settings(false);
			$settings->update('template', 'template', array('value'=>$templateName));
			$settings->save();
		}
		
		$this->name =  $templateName;

		$tPath = self::$options['TEMPLATES_FULL_SERVER_PATH'] . $this->name;
		if(!file_exists($tPath)) {	
		
		    $template=explode('-',$this->name);
            $template=$template[0];

            //try to get same template with different version if not exists
            foreach ( $this->getAllTemplates() AS $tpl ){
                list($template_all)=explode('-',$tpl);
                if ($template_all==$template){
                    $this->name = $tpl;
                    break;
                //default template = messy
                }else{
                	$this->name = 'default';
                }
            }
			$tPath = self::$options['TEMPLATES_FULL_SERVER_PATH'] . $this->name;
		}	
		

		if(file_exists($tPath) && file_exists($tPath . '/template.conf.php')) {
			$this->smarty->template_dir = $tPath;
			$this->smarty->plugins_dir = array('plugins', self::$options['TEMPLATES_FULL_SERVER_PATH'] . '_plugins', $tPath . '/plugins');
			//var_dump($this->smarty->plugins_dir);
			
			list($this->sectionTypes, $this->settingsDefinition) = include($tPath . '/template.conf.php');
			
			//$firstType = reset(array_keys($this->sectionTypes));
			//if($firstType != 'default') array_unshift()
			
			$this->templateHTML = @file_get_contents($tPath . '/template.tpl');
			$this->templateFile = $tPath . '/template.tpl';
			$this->settings = new Settings($this->settingsDefinition, $generalSettingsInstance, $this->name);
			
			// instantiate settings for each section type definition (extend $this->settings)
			reset($this->sectionTypes);
			while(list($tName, $t) = each($this->sectionTypes)) {
				$this->sectionTypes[$tName]['settings'] = new Settings(
					false, $this->settings, false, 
					isset($t['settings']) ? $t['settings'] : false
				);
			}
			return true;
		}
		return false;
	}
	

	
	public function addVariable($varName, $varValue) {
		//$this->smarty->assign('aaa', 'TEST TEST');
		$this->smarty->assign($varName, $varValue);
	}
	

	public function addContent($requestURI, $sectionName, &$sections, $tagName, &$tags, &$content, &$allContent) {
		// set variables for later processing in function addEngineVariables
		$this->requestURI = $requestURI;
		$this->sectionName = $sectionName;
		$this->sections =& $sections;
		$this->tagName = $tagName;
		$this->tags =& $tags;
		
		// add entries...
		$this->content =& $content;
		$this->allContent =& $allContent;
		
		list($entries, $entriesForTag) = $this->getEntriesLists($this->sectionName, $this->tagName, $this->content);
		$this->addVariable('allentries', $entries);
		$this->addVariable('entries', $entriesForTag);
		
		if($allContent) {
			$allEntries = array();
			reset($allContent);
			while(list($sName, $c) = each($allContent)) {
				if($sName == $this->sectionName) {
					$allEntries[$sName] = $entries;
				} else {
					list($e, ) = $this->getEntriesLists($sName, null, $c);
					$allEntries[$sName] = $e;
				}
			}
			$this->addVariable('entriesBySection', $allEntries);
		}
	}
	
	private function getEntriesLists($sName, $tagName, &$content) {
		$haveToSave = false;
		$entries = array();
		$entriesForTag = array();
		
		if(!empty($content['entry'])) {
			foreach($content['entry'] as $idx => $p) {
				if((string) $idx == '@attributes') continue;

				if(!empty($p['id']) && !empty($p['id']['value']) 
					&& !empty($p['uniqid']) && !empty($p['uniqid']['value']) 
					&& !empty($p['mediafolder']) && !empty($p['mediafolder']['value'])) {
					
					$id = $p['id']['value'];
					$entries[$id] = BertaTemplate::entryForTemplate($p, array('section' => $this->sections[$sName])); 
				
					//var_dump($entries[$id]['tags'], $tagName);
				

					//I'm not sure what I'm doing here - this can make a bug in sorting order
					/*
					if(!$tagName && ($this->environment == 'engine' || !$entries[$id]['tags'])
							|| $tagName && isset($entries[$id]['tags'][$tagName])) {
						$entriesForTag[$id] = $entries[$id];	
					}
					*/
					if(!$tagName && !$entries[$id]['tags']
							|| $tagName && isset($entries[$id]['tags'][$tagName])) {
						$entriesForTag[$id] = $entries[$id];	
					}
				
				} else {					
					unset($this->content['entry'][$idx]);
					$haveToSave = true;
				}
			}
		}
		
		if($haveToSave && class_exists('BertaEditor')) {
			//echo dirname(__FILE__) . '/class.bertaeditor.php';
			//include_once dirname(__FILE__) . 'class.bertaeditor.php';
			BertaEditor::saveBlog($this->sectionName, $this->content);
		}
		
		return array($entries, $entriesForTag);
	}
	
	
	
	
	
	
	
	
	public function output() {
		$this->addEngineVariables();
		//$this->smarty->assign('aaa', 'TEST TEST');
		return $this->smarty->fetch($this->templateFile);
		//return $this->smarty->fetch('text:' . $this->templateHTML);
		//$smarty->template_dir = '/web/www.domain.com/smarty/templates';
	}
	
	
	
	
	
	
	// PRIVATE ...
	
	
	private function addEngineVariables() {
		$vars = array();
		$vars['berta'] = array();
		$vars['berta']['environment'] = $this->environment;
		$vars['berta']['templateName'] = $this->name;
		$vars['berta']['options'] =& self::$options;

		if ( isset($_SESSION['_berta_msg']) ){
			$vars['berta']['msg'] = $_SESSION['_berta_msg'];
			unset( $_SESSION['_berta_msg'] );
		}
		
		$vars['berta']['settings'] = $this->settings->getApplied();
		//print_r($vars['berta']['settings']);
		
		$vars['berta']['pageTitle'] = $this->settings->get('texts', 'pageTitle');
		
		global $shopEnabled;
		$vars['berta']['shop_enabled'] = false;
		if(isset($shopEnabled) && $shopEnabled === true) {
			$vars['berta']['shop_enabled'] = true;
		}
		//$vars['berta']['shop'] = array();
		//$vars['berta']['shop'] = array('cart_name' => I18n::_('Shopping cart'));
		
		
		// add sections ...
		$vars['berta']['requestURI'] = $this->requestURI;
		$vars['berta']['sectionName'] = $this->sectionName;
		$vars['berta']['section'] = null;
		$vars['berta']['sections'] = array();
		$vars['berta']['publishedSections'] = array();
		$isFirstSection = true;
		foreach($this->sections as $sName => $s) {
			if(!empty($s['title']['value'])) {
				// add system variables
				$vars['berta']['sections'][$sName] = array(
					'name' => $s['name']['value'],
					'title' => !empty($s['title']) ? htmlspecialchars($s['title']['value']) : '',
					'has_direct_content' => !empty($s['@attributes']['has_direct_content']) ? '1' : '0',
					'published' => !empty($s['@attributes']['published']) ? '1' : '0',
					'num_entries' => isset($s['@attributes']['num_entries']) ? (int) $s['@attributes']['num_entries'] : 0,
					'type' => !empty($s['@attributes']['type']) ? $s['@attributes']['type'] : 'default'
				);
				// add variables from template section-type settings
				foreach($s as $key => $val) {
					if($key != '@attributes' && !isset($vars['berta']['sections'][$sName][$key]))
						$vars['berta']['sections'][$sName][$key] = isset($val['value']) ? $val['value'] : $val;
				}
				
				// - show all sections when in engine mode
				// - show landing section in menu if landingSectionVisible=yes or it has tags menu
				if($this->environment == 'engine' || 
						$vars['berta']['sections'][$sName]['published'] && 
						($this->settings->get('navigation', 'landingSectionVisible') == 'yes' || !$isFirstSection || !empty($this->tags[$sName])))
					$vars['berta']['publishedSections'][$sName] =& $vars['berta']['sections'][$sName];
				if($vars['berta']['sections'][$sName]['published']) $isFirstSection = false;
				
				// set current section and page title
				if($this->sectionName == $sName) {
					$vars['berta']['pageTitle'] .= ' / ' . $s['title']['value'];
					$vars['berta']['section'] =& $vars['berta']['sections'][$sName];
                }
			}
		}
		
	//	var_dump($vars['berta']['publishedSections']);
		
		// add subsections...
		$vars['berta']['tagName'] = $this->tagName;
		$vars['berta']['tags'] = $this->tags;
		if($this->tagName) $vars['berta']['pageTitle'] .= ' / ' . $this->tags[$this->sectionName][$this->tagName]['title'];
		
		// add tags ...
		//$vars['berta']['tagName'] = $this->tagName;
		//$vars['berta']['tags'] = $this->tags;
		
		// add siteTexts ... 
		
		$texts = $this->settings->base->getAll('siteTexts');
		foreach($texts as $tVar => $t) if(!isset($vars[$tVar])) $vars[$tVar] = $t;
		
		// gets berta's version at the time the section was last updated
		$blog = BertaContent::loadBlog($this->sectionName);
		if(!empty($blog['@attributes']['last_upd_ver'])) $lastUpdVer = $blog['@attributes']['last_upd_ver'];
		else $lastUpdVer = 0;
		
		// berta scripts ...
		global $ENGINE_ROOT;		
		include($ENGINE_ROOT . 'inc.tips.php');
		
		$engineAbsRoot = self::$options['ENGINE_ABS_ROOT'];
		$templatesAbsRoot = self::$options['TEMPLATES_ABS_ROOT'];
		$jsSettings = array(
			'templateName' => $this->name,
			'environment' => $this->environment,
			'shopEnabled' => $shopEnabled,
			'flashUploadEnabled' => $this->settings->get('settings', 'flashUploadEnabled') == 'yes' ? 'true' : 'false',
			'videoPlayerType' => $this->settings->get('entryLayout', 'galleryVideoPlayer'),
			'slideshowAutoRewind' => $this->settings->get('entryLayout', 'gallerySlideshowAutoRewind'),
			'sectionType' => $vars['berta']['section']['type'],
			'gridStep' => $this->settings->get('pageLayout', 'gridStep'),
			'galleryFullScreenBackground' => $this->settings->get('entryLayout', 'galleryFullScreenBackground'),			
			'galleryFullScreenFrame' => $this->settings->get('entryLayout', 'galleryFullScreenFrame'),
			'galleryFullScreenCloseText' => $this->settings->get('entryLayout', 'galleryFullScreenCloseText'),			
			'galleryFullScreenImageNumbers' => $this->settings->get('entryLayout', 'galleryFullScreenImageNumbers'),
			'galleryFullScreenCaptionAlign' => $this->settings->get('entryLayout', 'galleryFullScreenCaptionAlign'),									
			'paths' => array(
				'engineRoot' => htmlspecialchars(self::$options['ENGINE_ROOT']),
				'engineABSRoot' => htmlspecialchars($engineAbsRoot),
				'siteABSRoot' => htmlspecialchars(self::$options['SITE_ABS_ROOT']),
				'template' => htmlspecialchars(self::$options['SITE_ABS_ROOT'] . 'templates/' . $this->name . '/')
			),
			
			'i18n' => array(
				'create new entry here' => I18n::_('create new entry here'),
				'create new entry' => I18n::_('create new entry'),
			),
			'lastUpdVer' => $lastUpdVer,
			//'settings' => $vars['berta']['settings']
		);
		
		foreach($tipTexts as $key=>$value) {
			$jsSettings['i18n'][$key] = $value;
		}
		
		$sttingsJS = Zend_Json::encode($jsSettings);
		
		//
		$now = time();
		$vars['berta']['css'] = <<<DOC
	<link rel="stylesheet" href="{$engineAbsRoot}css/default.css" type="text/css" charset="utf-8" />
	<link rel="stylesheet" href="{$templatesAbsRoot}{$this->name}/style.css.php?{$now}" type="text/css" />
	
DOC;
		if($this->loggedIn) {
			$vars['berta']['css'] .= <<<DOC
	<link rel="stylesheet" href="{$engineAbsRoot}css/editor.css.php" type="text/css" />
	<link rel="stylesheet" href="{$templatesAbsRoot}{$this->name}/editor.css.php" type="text/css" />
	<link rel="stylesheet" href="{$engineAbsRoot}_lib/moorainbow/mooRainbow.css" type="text/css" charset="utf-8" />
DOC;
		}else{
			$vars['berta']['css'] .= <<<DOC
	<link rel="stylesheet" href="{$engineAbsRoot}_lib/milkbox/css/milkbox/milkbox.css" type="text/css" />
DOC;
        }
		
		$vars['berta']['scripts'] = <<<DOC
	<script src="{$engineAbsRoot}_lib/mootools/mootools-1.2.5-core-yc.js" type="text/javascript" charset="utf-8"></script>
	<script src="{$engineAbsRoot}_lib/mootools/mootools-1.2.5.1-more.js" type="text/javascript" charset="utf-8"></script>
	<script src="{$engineAbsRoot}_lib/mootools/mootools-1.2.5.1-more-delegation.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript">
		var bertaGlobalOptions = $sttingsJS;
	</script>
	<script src="{$engineAbsRoot}js/BertaGallery.js" type="text/javascript" charset="utf-8"></script>
DOC;
		if($this->loggedIn) {
			$vars['berta']['scripts'] .= <<<DOC
	<script src="{$engineAbsRoot}_lib/mootools/mootools-1.2.5.1-more-tips.js" type="text/javascript" charset="utf-8"></script>
	
	<script type="text/javascript" src="{$engineAbsRoot}js/Assets.js" charset="utf-8"></script>
	<script type="text/javascript" src="{$engineAbsRoot}js/BertaEditorBase.js" charset="utf-8"></script>
	<script type="text/javascript" src="{$engineAbsRoot}js/inline_edit.js" charset="utf-8"></script>

	<script type="text/javascript" src="{$engineAbsRoot}js/swiff/Swiff.Uploader.js" charset="utf-8"></script>
	<script type="text/javascript" src="{$engineAbsRoot}js/BertaGalleryEditorAssets.js" charset="utf-8"></script>
	<script type="text/javascript" src="{$engineAbsRoot}js/BertaGalleryEditor.js" charset="utf-8"></script>
	<script type="text/javascript" src="{$engineAbsRoot}js/BertaBgEditor.js" charset="utf-8"></script>

	<script type="text/javascript" src="{$engineAbsRoot}js/BertaEditor.js" charset="utf-8"></script>

	<script type="text/javascript" src="{$engineAbsRoot}_lib/tiny_mce/tiny_mce_gzip.js"></script>
	<script type="text/javascript" src="{$engineAbsRoot}_lib/moorainbow/mooRainbow.1.2b2.js" charset="utf-8"></script>
DOC;
		} else {
			$vars['berta']['scripts'] .= <<<DOC
	<script type="text/javascript" src="{$engineAbsRoot}js/Berta.js"></script>
	<script type="text/javascript" src="{$engineAbsRoot}_lib/milkbox/js/milkbox.js"></script>
DOC;
		}
		
		
		// counter ...
		
		$vars['berta']['google_id'] = $this->settings->get('settings', 'googleAnalyticsId');
		if($vars['berta']['google_id'] == 'none') $vars['berta']['google_id'] = '';
		
		
		
		// add vars
		reset($vars);
		while(list($vName, $vContent) = each($vars)) {
			$this->smarty->assign($vName, $vContent);
		}
		
	}
	
	
	
	
	
	
	public static function smarty_resource_text_get_template($tpl_name, &$tpl_source, &$smarty_obj) { $tpl_source = $tpl_name; return true; }
	public static function smarty_resource_text_get_timestamp($tpl_name, &$tpl_timestamp, &$smarty_obj) { $tpl_timestamp = time(); return true; }
	public static function smarty_resource_text_get_secure($tpl_name, &$smarty_obj) { return true; }
	public static function smarty_resource_text_get_trusted($tpl_name, &$smarty_obj) {}



	// BACK-END AND UTILITY...
	
	public function loadSmartyPlugin($type, $name) {
		for($i = count($this->smarty->plugins_dir) - 1; $i >= 0; $i--) {
			$path = realpath($this->smarty->plugins_dir[$i]) . '/' . $type . '.' . $name . '.php';
			if(file_exists($path)) {
				include_once($path);
			}
		}
	}
	
	
	public static function getAllTemplates() {
		$returnArr = array();
		$d = dir(self::$options['TEMPLATES_ROOT']);
		while(false !== ($entry = $d->read())) {
			if($entry != '.' && $entry != '..' && substr($entry, 0, 1) != '_' && is_dir(self::$options['TEMPLATES_ROOT'] . $entry))
				$returnArr[] = $entry;
		}
		$d->close();
		return $returnArr;
	}

	
	public static function entryForTemplate($p, $additionalValues = false) {
		$e = array();
		
		// preset variables..
		$e['__raw'] = $p;
		$e['id'] = $p['id']['value'];
		$e['uniqid'] = $p['uniqid']['value'];
		$e['date'] = !empty($p['date']) && !empty($p['date']['value']) ? $p['date']['value'] : '';
		$e['mediafolder'] = $p['mediafolder']['value'];
		$e['marked'] = !empty($p['marked']['value']) ? '1' : '0';
		
		if($additionalValues) {
			foreach($additionalValues as $key => $value) {
				if(!isset($e[$key]))	// don't overwrite
					$e[$key] = $value;
			}
		}

		// entry content..
		if(!empty($p['content'])) {
			foreach($p['content'] as $key => $value) {
				if(!isset($e[$key]))	// don't overwrite
					$e[$key] = !empty($value['value']) ? $value['value'] : '';
			}
		}

		// tags..
		$tagsList = array();
		
		if(!empty($p['tags']['tag'])) {
			Array_XML::makeListIfNotList($p['tags']['tag']);
			foreach($p['tags']['tag'] as $tName => $t) {
				if(!empty($t['value'])) {
					$tagsList[strtolower(BertaUtils::canonizeString($t['value']))] = $t['value'];
				}
			}
		}
		$e['tags'] = $tagsList;
		
		return $e;
	}
	
}




?>