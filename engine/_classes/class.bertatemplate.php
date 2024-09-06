<?php

use Illuminate\Http\Request;
use App\Shared\Storage;
use App\User\UserModel;
use App\Configuration\SiteTemplatesConfigService;
use App\Sites\SitesDataService;
use App\Sites\Settings\SiteSettingsDataService;
use App\Sites\TemplateSettings\SiteTemplateSettingsDataService;
use App\Sites\Sections\SiteSectionsDataService;
use App\Sites\Sections\Entries\SectionEntriesDataService;
use App\Sites\Sections\Tags\SectionTagsDataService;

use App\Sites\Sections\MessyTemplateRenderService;
use App\Sites\Sections\MashupTemplateRenderService;
use App\Sites\Sections\DefaultTemplateRenderService;
use App\Sites\Sections\WhiteTemplateRenderService;
use App\Sites\Sections\SitemapRenderService;

class BertaTemplate extends BertaBase
{
    public $name;
    public $templateName;
    public $loggedIn = false;

    public $sectionTypes;

    public $settingsDefinition;
    public $settings;

    public $apacheRewriteUsed;

    private $requestURI;
    private $sectionName;
    private $sections;
    private $tagName;
    private $tags;
    private $environment;
    private $content;
    private $allContent;

    private $twigOutput;

    public function __construct($templateName, $generalSettingsInstance = false, $loggedIn = false, $apacheRewriteUsed = false)
    {
        $this->name = $templateName;
        $this->templateName = explode('-', $this->name)[0];
        $this->loggedIn = $loggedIn;
        $this->environment = !empty(self::$options['ENVIRONMENT']) ? self::$options['ENVIRONMENT'] : 'site';
        $this->apacheRewriteUsed = $apacheRewriteUsed;

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
            list($this->sectionTypes, $this->settingsDefinition) = include $tPath . '/template.conf.php';

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

    public function addContent($requestURI, $sectionName, &$sections, $tagName, &$tags, &$content, &$allContent)
    {
        global $shopEnabled;

        // set variables for later processing in function addEngineVariables
        $this->requestURI = $requestURI;
        $this->sectionName = $sectionName;
        $this->sections = &$sections;
        $this->tagName = $tagName;
        $this->tags = &$tags;

        // add entries...
        $this->content = &$content;
        $this->allContent = &$allContent;

        $isShopAvailable = isset($shopEnabled) && $shopEnabled;

        if ($isShopAvailable) {
            global $db;
            // We need to initialize BertaShop here for correct migration order
            new BertaShop($db, $this->loggedIn);
        }

        $isEditMode = $this->environment == 'engine';
        $isPreviewMode = !empty(self::$options['PREVIEW_FOLDER']);
        $request = Request::capture();
        $siteSlug = self::$options['MULTISITE'];

        $sectionsDS = new SiteSectionsDataService($siteSlug, self::$options['XML_ROOT']);
        $siteSections = $sectionsDS->getState();

        $sectionTagsDS = new SectionTagsDataService($siteSlug);
        $tags = $sectionTagsDS->get();

        if ($this->sectionName == 'sitemap.xml') {
            header('Content-type: text/xml; charset=utf-8');
            $sitemapRS = new SitemapRenderService();
            $this->twigOutput = $sitemapRS->render(
                $request,
                $siteSlug,
                $siteSections,
                $tags
            );

            return;
        }

        $sectionSlug = $this->sectionName;
        $tagSlug = $this->tagName;

        $sitesDataService = new SitesDataService();
        $sites = $sitesDataService->get();

        $siteSettingsDS = new SiteSettingsDataService($siteSlug, self::$options['XML_ROOT']);
        $siteSettings = $siteSettingsDS->getState();

        $siteTemplateSettingsDS = new SiteTemplateSettingsDataService($siteSlug, $siteSettings['template']['template'], self::$options['XML_ROOT']);
        $siteTemplateSettings = $siteTemplateSettingsDS->getState();

        $siteTemplatesConfigService = new SiteTemplatesConfigService();
        $siteTemplatesConfig = $siteTemplatesConfigService->getDefaults();

        $user = new UserModel();

        $storageService = new Storage($siteSlug, $isPreviewMode);

        $sectionEntriesDS = new SectionEntriesDataService($siteSlug, $sectionSlug, '', self::$options['XML_ROOT']);
        $entries = $sectionEntriesDS->getByTag($tagSlug, $isEditMode);

        switch ($this->templateName) {
            case 'white':
                $templateRenderService = new WhiteTemplateRenderService();
                break;

            case 'default':
                $templateRenderService = new DefaultTemplateRenderService();
                break;

            case 'mashup':
                $templateRenderService = new MashupTemplateRenderService();
                break;

            default:
                // Messy
                $templateRenderService = new MessyTemplateRenderService();
                break;
        }

        $this->twigOutput = $templateRenderService->render(
            $request,
            $sites,
            $siteSlug,
            $siteSections,
            $sectionSlug,
            $tagSlug,
            $tags,
            $entries,
            $siteSettings,
            $siteTemplateSettings,
            $siteTemplatesConfig,
            $user,
            $storageService,
            $isShopAvailable,
            $isPreviewMode,
            $isEditMode
        );
    }

    public function output()
    {
        return $this->twigOutput;
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
