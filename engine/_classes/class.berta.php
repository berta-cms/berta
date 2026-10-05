<?php

include_once 'class.bertabase.php';
include_once 'class.i18n.php';
include_once 'class.bertasecurity.php';
include_once 'class.bertautils.php';
include_once 'class.bertacontent.php';
include_once 'class.bertatemplate.php';

include_once 'class.settings.php';

class Berta extends BertaBase
{
    public $security;

    public $settings;

    public $environment;

    public $apacheRewriteUsed = false;

    public $sections;

    public $sectionName;

    public $template;

    public $tags;

    public $tagName;

    public $content;

    public function __construct()
    {
        // Set variables
        $this->environment = ! empty(self::$options['ENVIRONMENT']) ? self::$options['ENVIRONMENT'] : 'site';
        $this->apacheRewriteUsed = ! empty($_REQUEST['__rewrite']) ? true : false;
        $this->security = new BertaSecurity($this->environment);

        // [Bad bad bad practice!] Update logged in status in the options
        self::$options['logged_in'] = $this->security->userLoggedIn;
    }

    // 1st: init settings
    public function init(array $setttingsDefaults)
    {
        $this->settings = new Settings($setttingsDefaults); // general site-wide settings

        I18n::load_language($this->settings->get('language', 'language'));

        $templateName = $this->settings->get('template', 'template', true);

        $this->template = new BertaTemplate($templateName, $this->settings, $this->security->userLoggedIn);
    }

    // finally: init content
    public function initContent($sectionName, $tagName)
    {
        // seciton ...
        $this->sections = BertaContent::getSections();

        if (! $sectionName || empty($this->sections[$sectionName]) && $sectionName != 'sitemap.xml') {
            if ($this->environment == 'engine') {
                $sectionName = current(array_keys($this->sections));
            } else {
                foreach ($this->sections as $sName => $s) {
                    if (! empty($s['@attributes']['published'])) {
                        $sectionName = $sName;
                        break;
                    }
                }
            }
        }
        $this->sectionName = $sectionName;

        // content ...
        $this->content = BertaContent::loadBlog($sectionName);

        // subsections ...
        $this->tags = BertaContent::getTags();
        $this->tagName = $tagName;
        if (! isset($this->tags[$this->sectionName][$this->tagName])) {
            $this->tagName = false;
        }

        // in the engine mode one can view all entries for a section, even if the section has subsections
        // but in the front-ends mode, if there are subsections, the first of them is automatically selected.

        // I'm not sure what I'm doing here - this can make a bug in sorting order
        if (
            ! empty($this->tags[$this->sectionName])
            && empty($this->tagName)
            && empty($this->sections[$this->sectionName]['@attributes']['has_direct_content'])
            && $this->settings->get('navigation', 'alwaysSelectTag') == 'yes'
        ) {
            $this->tagName = array_keys($this->tags[$this->sectionName]);
            $this->tagName = reset($this->tagName);
        }

        // template ...
        $this->template->addContent($this->sectionName, $this->tagName);
    }

    public function output()
    {
        return $this->template->output();
    }
}
