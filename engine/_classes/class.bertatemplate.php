<?php
use App\Configuration\SiteTemplatesConfigService;
use App\Shared\Storage;
use App\User\UserModel;
use App\Sites\SitesDataService;
use App\Sites\SitesMenuRenderService;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;
use App\Sites\Sections\SectionHeadRenderService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\SitesHeaderRenderService;
use App\Sites\Sections\SectionsMenuRenderService;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\Sections\Entries\SectionEntryRenderService;
use App\Sites\Sections\Tags\SectionTagsDataService;

include_once dirname(__FILE__) . '/../_lib/smarty/Smarty.class.php';
include_once dirname(__FILE__) . '/Zend/Json.php';

class BertaTemplate extends BertaBase
{
    private $smarty;

    public $name;
    public $templateName;
    public $loggedIn = false;
    public $templateHTML;

    public $sectionTypes;

    public $settingsDefinition;
    public $settings;

    public $apacheRewriteUsed;

    private $requestURI;
    private $sectionName;
    private $sections;
    private $tagName;
    private $tags;

    public function __construct($templateName, $generalSettingsInstance = false, $loggedIn = false, $apacheRewriteUsed = false)
    {
        $this->name = $templateName;
        $this->templateName = explode('-', $this->name)[0];
        $this->loggedIn = $loggedIn;
        $this->environment = !empty(self::$options['ENVIRONMENT']) ? self::$options['ENVIRONMENT'] : 'site';
        $this->apacheRewriteUsed = $apacheRewriteUsed;

        $this->smarty = new Smarty();
        $this->smarty->auto_literal = false;	// to allow space aroun
        $this->smarty->compile_dir = self::$options['CACHE_ROOT'];
        $this->smarty->cache_dir = self::$options['CACHE_ROOT'];
        $this->smarty->template_dir = self::$options['TEMPLATES_FULL_SERVER_PATH'];
        $this->smarty->plugins_dir = ['plugins', self::$options['TEMPLATES_FULL_SERVER_PATH'] . '_plugins'];
        $this->smarty->register->resource(
            'text',
            [
            'BertaTemplate',
            'smarty_resource_text_get_template',
            'smarty_resource_text_get_timestamp',
            'smarty_resource_text_get_secure',
            'smarty_resource_text_get_trusted']
        );

        $this->load($this->name, $generalSettingsInstance);
    }

    public function load($templateName, $generalSettingsInstance = false)
    {
        //set default template as messy
        if (!$templateName) {
            foreach ($this->getAllTemplates() as $tpl) {
                list($template_all) = explode('-', $tpl);
                if ($template_all == 'messy') {
                    $templateName = $tpl;
                    break;
                } else {
                    $templateName = 'default';
                }
            }
            //save in settings
            $settings = new Settings(false);
            $settings->update('template', 'template', ['value' => $templateName]);
            $settings->save();
        }

        $this->name = $templateName;

        $tPath = self::$options['TEMPLATES_FULL_SERVER_PATH'] . $this->name;
        if (!file_exists($tPath)) {
            $template = explode('-', $this->name);
            $template = $template[0];

            //try to get same template with different version if not exists
            foreach ($this->getAllTemplates() as $tpl) {
                list($template_all) = explode('-', $tpl);
                if ($template_all == $template) {
                    $this->name = $tpl;
                    break;
                //default template = messy
                } else {
                    $this->name = 'default';
                }
            }
            $tPath = self::$options['TEMPLATES_FULL_SERVER_PATH'] . $this->name;
        }

        if (file_exists($tPath) && file_exists($tPath . '/template.conf.php')) {
            $this->smarty->template_dir = $tPath;
            $this->smarty->plugins_dir = ['plugins', self::$options['TEMPLATES_FULL_SERVER_PATH'] . '_plugins', $tPath . '/plugins'];

            list($this->sectionTypes, $this->settingsDefinition) = include $tPath . '/template.conf.php';

            $this->templateHTML = @file_get_contents($tPath . '/template.tpl');
            $this->templateFile = $tPath . '/template.tpl';
            $this->settings = new Settings($this->settingsDefinition, $generalSettingsInstance, $this->name);

            // instantiate settings for each section type definition (extend $this->settings)
            reset($this->sectionTypes);
            foreach ($this->sectionTypes as $tName => $t) {
                $this->sectionTypes[$tName]['settings'] = new Settings(
                    false,
                    $this->settings,
                    false,
                    isset($t['settings']) ? $t['settings'] : false
                );
            }
            return true;
        }
        return false;
    }

    public function addVariable($varName, $varValue)
    {
        $this->smarty->assign($varName, $varValue);
    }

    public function addContent($requestURI, $sectionName, &$sections, $tagName, &$tags, &$content, &$allContent)
    {
        global $shopEnabled;

        // set variables for later processing in function addEngineVariables
        $this->requestURI = $requestURI;
        $this->sectionName = $sectionName;
        $this->sections = &$sections;
        $this->tagName = $tagName;
        $this->tags = &$tags;

        $isEditMode = $this->environment == 'engine';
        $isPreviewMode = !empty(self::$options['PREVIEW_FOLDER']);

        // add entries...
        $this->content = &$content;
        $this->allContent = &$allContent;

        $storage = new Storage(self::$options['MULTISITE'], $isPreviewMode);

        $sitesDataService = new SitesDataService();
        $sites = $sitesDataService->get();

        $sectionEntriesDS = new SectionEntriesDataService(self::$options['MULTISITE'], $this->sectionName, '', self::$options['XML_ROOT']);
        $entries = $sectionEntriesDS->getByTag($this->tagName, $isEditMode);

        $siteSectionsDS = new SiteSectionsDataService(self::$options['MULTISITE'], self::$options['XML_ROOT']);
        $siteSections = $siteSectionsDS->getState();
        $sectionData = $siteSectionsDS->get($this->sectionName);

        $siteSettingsDS = new SiteSettingsDataService(self::$options['MULTISITE'], self::$options['XML_ROOT']);
        $siteSettingsState = $siteSettingsDS->getState();

        $siteTemplateSettingsDS = new SiteTemplateSettingsDataService(self::$options['MULTISITE'], $this->name, self::$options['XML_ROOT']);
        $siteTemplateSettingsState =  $siteTemplateSettingsDS->getState();
        $sectionTagsDS = new SectionTagsDataService(self::$options['MULTISITE']);
        $sectionTags = $sectionTagsDS->get();

        $user = new UserModel();

        $siteTemplatesConfigService = new SiteTemplatesConfigService();
        $siteTemplatesConfig = $siteTemplatesConfigService->getDefaults();

        $sectionHeadRS = new SectionHeadRenderService();
        $sectionHead = $sectionHeadRS->render(
            self::$options['MULTISITE'],
            $siteSections,
            $this->sectionName,
            $this->tagName,
            $sectionTags,
            $siteSettingsState,
            $siteTemplateSettingsState,
            $siteTemplatesConfig,
            $user,
            $storage,
            isset($shopEnabled) && $shopEnabled,
            $isPreviewMode,
            $isEditMode
        );
        $this->addVariable('sectionHead', $sectionHead);

        $sitesMenuRenderService = new SitesMenuRenderService(
            self::$options['MULTISITE'],
            $isEditMode,
            $siteSettingsState,
            $siteTemplateSettingsState,
            $sites
        );

        $sitesMenu = $sitesMenuRenderService->render();
        $this->addVariable('sitesMenu', $sitesMenu);

        $sitesHeaderRenderService = new SitesHeaderRenderService(
            self::$options['MULTISITE'],
            $siteSettingsState,
            $siteTemplateSettingsState,
            $siteSections,
            $this->sectionName,
            $storage,
            $isPreviewMode,
            $isEditMode
        );
        $siteHeader = $sitesHeaderRenderService->render();
        $this->addVariable('siteHeader', $siteHeader);

        $entriesHTML = '';
        foreach ($entries as $entry) {
            $sectionEntriesRS = new SectionEntryRenderService(
                self::$options['MULTISITE'],
                $siteSections,
                $entry,
                $sectionData,
                $siteSettingsState,
                $siteTemplateSettingsState,
                $storage,
                $isEditMode,
                isset($shopEnabled) && $shopEnabled
            );
            $entriesHTML .= $sectionEntriesRS->render();
        }

        $this->addVariable('entriesHTML', $entriesHTML);

        $sectionsMenuRS = new SectionsMenuRenderService(
            self::$options['MULTISITE'],
            $siteSections,
            $this->sectionName,
            $siteSettingsState,
            $siteTemplateSettingsState,
            $sectionTags,
            $this->tagName,
            $isPreviewMode,
            $isEditMode
        );
        $sectionsMenu = $sectionsMenuRS->render();
        $this->addVariable('sectionsMenu', $sectionsMenu);

        // We still need entries for portfolio view and for section type = mashup
        // TODO remove assigning entries to template when rendering is moved to API app
        list($entries, $entriesForTag) = $this->getEntriesLists($this->sectionName, $this->tagName, $this->content);
        $this->addVariable('entries', $entriesForTag);

        $socialMediaLinks = [];
        if (isset($this->settings->base->settings['socialMediaLinks']['links']['link'])) {
            $socialMediaLinks = $this->settings->base->settings['socialMediaLinks']['links']['link'];
            Array_XML::makeListIfNotList($socialMediaLinks);
        }
        $this->addVariable('socialMediaLinks', $socialMediaLinks);
    }

    private function getEntriesLists($sName, $tagName, &$content)
    {
        $haveToSave = false;
        $entries = [];
        $entriesForTag = [];

        if (!empty($content['entry'])) {
            foreach ($content['entry'] as $idx => $p) {
                if ((string) $idx == '@attributes') {
                    continue;
                }

                if (!empty($p['id']) && !empty($p['id']['value'])
                    && !empty($p['uniqid']) && !empty($p['uniqid']['value'])
                    && !empty($p['mediafolder']) && !empty($p['mediafolder']['value'])) {
                    $id = $p['id']['value'];
                    $entries[$id] = BertaTemplate::entryForTemplate($p, ['section' => $this->sections[$sName]]);

                    if (!$tagName && !$entries[$id]['tags']
                            || $tagName && isset($entries[$id]['tags'][$tagName])) {
                        $entriesForTag[$id] = $entries[$id];
                    }
                } else {
                    unset($this->content['entry'][$idx]);
                    $haveToSave = true;
                }
            }
        }

        if ($haveToSave && class_exists('BertaEditor')) {
            BertaEditor::saveBlog($this->sectionName, $this->content);
        }

        return [$entries, $entriesForTag];
    }

    public function output()
    {
        $this->addEngineVariables();

        if ($this->sectionName == 'sitemap.xml') {
            header('Content-type: text/xml; charset=utf-8');
            $tpl = self::$options['TEMPLATES_FULL_SERVER_PATH'] . '_includes/sitemap.xml';
        } else {
            $tpl = $this->templateFile;
        }

        return $this->smarty->fetch($tpl);
    }

    // PRIVATE ...

    private function addEngineVariables()
    {
        $vars = [];
        $vars['berta'] = [];
        $vars['berta']['environment'] = $this->environment;
        $vars['berta']['templateName'] = $this->name;
        $vars['berta']['options'] = &self::$options;

        $hostingPlan = false;
        if (@file_exists(self::$options['ENGINE_ROOT_PATH'] . 'plan')) {
            $hostingPlan = file_get_contents(self::$options['ENGINE_ROOT_PATH'] . 'plan');
        }
        $vars['berta']['hostingPlan'] = $hostingPlan;

        if (isset($_SESSION['_berta_msg'])) {
            $vars['berta']['msg'] = $_SESSION['_berta_msg'];
            unset($_SESSION['_berta_msg']);
        }

        $vars['berta']['settings'] = $this->settings->getApplied();

        global $shopEnabled;
        $vars['berta']['shop_enabled'] = false;
        if (isset($shopEnabled) && $shopEnabled === true) {
            $vars['berta']['shop_enabled'] = true;

            global $db;
            $BertaShop = new BertaShop($db, $this->loggedIn);
            $vars['berta']['shopData'] = $BertaShop->getTemplateData();
        }

        // add sectionTypes default settings;
        $vars['berta']['sectionTypes'] = $this->sectionTypes;

        // add sections ...
        $vars['berta']['requestURI'] = $this->requestURI;
        $vars['berta']['sectionName'] = $this->sectionName;
        $vars['berta']['section'] = null;
        $vars['berta']['sections'] = [];
        $vars['berta']['publishedSections'] = [];
        $isFirstSection = true;
        foreach ($this->sections as $sName => $s) {
            // add system variables
            $vars['berta']['sections'][$sName] = [
                'name' => $s['name']['value'],
                'title' => !empty($s['title']) ? htmlspecialchars($s['title']['value']) : '',
                'has_direct_content' => !empty($s['@attributes']['has_direct_content']) ? '1' : '0',
                'published' => !empty($s['@attributes']['published']) ? '1' : '0',
                'num_entries' => isset($s['@attributes']['num_entries']) ? (int) $s['@attributes']['num_entries'] : 0,
                'type' => !empty($s['@attributes']['type']) ? $s['@attributes']['type'] : 'default'
            ];
            // add variables from template section-type settings
            foreach ($s as $key => $val) {
                if ($key != '@attributes' && !isset($vars['berta']['sections'][$sName][$key])) {
                    $vars['berta']['sections'][$sName][$key] = isset($val['value']) ? $val['value'] : $val;
                }
            }

            // - show all sections when in engine mode
            // - show landing section in menu if landingSectionVisible=yes or it has tags menu
            if ($this->environment == 'engine' ||
                    $vars['berta']['sections'][$sName]['published'] &&
                    ($this->settings->get('navigation', 'landingSectionVisible') == 'yes' || !$isFirstSection || !empty($this->tags[$sName]))) {
                $vars['berta']['publishedSections'][$sName] = &$vars['berta']['sections'][$sName];
            }
            if ($vars['berta']['sections'][$sName]['published']) {
                $isFirstSection = false;
            }

            // set current section and page title
            if ($this->sectionName == $sName) {
                $vars['berta']['section'] = &$vars['berta']['sections'][$sName];
            }

            if (empty($s['title']['value'])) {
                unset(
                    $vars['berta']['sections'][$sName],
                    $vars['berta']['publishedSections'][$sName]
                );
            }
        }

        // add subsections...
        $vars['berta']['tagName'] = $this->tagName;
        $vars['berta']['tags'] = $this->tags;

        // add siteTexts ...
        $texts = $this->settings->base->getAll('siteTexts');
        foreach ($texts as $tVar => $t) {
            if (!isset($vars[$tVar])) {
                $vars[$tVar] = $t;
            }
        }

        // counter ...
        $vars['berta']['google_id'] = $this->settings->get('settings', 'googleAnalyticsId');
        if ($vars['berta']['google_id'] == 'none') {
            $vars['berta']['google_id'] = '';
        }

        // add vars
        reset($vars);
        foreach ($vars as $vName => $vContent) {
            $this->smarty->assign($vName, $vContent);
        }
    }

    public static function smarty_resource_text_get_template($tpl_name, &$tpl_source, &$smarty_obj)
    {
        $tpl_source = $tpl_name;
        return true;
    }

    public static function smarty_resource_text_get_timestamp($tpl_name, &$tpl_timestamp, &$smarty_obj)
    {
        $tpl_timestamp = time();
        return true;
    }

    public static function smarty_resource_text_get_secure($tpl_name, &$smarty_obj)
    {
        return true;
    }

    public static function smarty_resource_text_get_trusted($tpl_name, &$smarty_obj)
    {
    }

    // BACK-END AND UTILITY...

    public function loadSmartyPlugin($type, $name)
    {
        for ($i = count($this->smarty->plugins_dir) - 1; $i >= 0; $i--) {
            $path = realpath($this->smarty->plugins_dir[$i]) . '/' . $type . '.' . $name . '.php';
            if (file_exists($path)) {
                include_once $path;
            }
        }
    }

    public static function getAllTemplates()
    {
        $returnArr = [];
        $d = dir(self::$options['TEMPLATES_ROOT']);
        while (false !== ($entry = $d->read())) {
            if ($entry != '.' && $entry != '..' && substr($entry, 0, 1) != '_' && is_dir(self::$options['TEMPLATES_ROOT'] . $entry)) {
                $returnArr[] = $entry;
            }
        }
        $d->close();
        return $returnArr;
    }

    public static function entryForTemplate($p, $additionalValues = false)
    {
        $e = [];

        // preset variables..
        $e['__raw'] = $p;
        $e['id'] = $p['id']['value'];
        $e['uniqid'] = $p['uniqid']['value'];
        $e['date'] = !empty($p['date']) && !empty($p['date']['value']) ? $p['date']['value'] : '';
        $e['mediafolder'] = $p['mediafolder']['value'];
        $e['marked'] = !empty($p['marked']['value']) ? '1' : '0';

        if ($additionalValues) {
            foreach ($additionalValues as $key => $value) {
                if (!isset($e[$key])) {	// don't overwrite
                    $e[$key] = $value;
                }
            }
        }

        // entry content..
        if (!empty($p['content'])) {
            foreach ($p['content'] as $key => $value) {
                if (!isset($e[$key])) {	// don't overwrite
                    $e[$key] = !empty($value['value']) ? $value['value'] : '';
                }
            }
        }

        // tags..
        $tagsList = [];

        if (!empty($p['tags']['tag'])) {
            Array_XML::makeListIfNotList($p['tags']['tag']);
            foreach ($p['tags']['tag'] as $tName => $t) {
                if (!empty($t['value'])) {
                    $tagsList[strtolower(BertaUtils::canonizeString($t['value']))] = $t['value'];
                }
            }
        }
        $e['tags'] = $tagsList;

        return $e;
    }

    public static function sentryScripts()
    {
        $scripts = '';
        $file = self::$options['TEMPLATES_FULL_SERVER_PATH'] . '../../../includes/sentry_template.html';
        if (self::$options['HOSTING_PROFILE'] && file_exists($file)) {
            $scripts = file_get_contents($file);
            $scripts = str_replace('RELEASE_VERSION', self::$options['version'], $scripts);
        }
        return $scripts;
    }
}
