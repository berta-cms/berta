<!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie ie6 ie-old"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie ie7 ie-old"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie ie8"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html> <!--<![endif]-->
<head>
	<meta charset="UTF-8">
	{if $berta.settings.pageLayout.responsive=='yes'}<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">{/if}
	<title>{if $berta.section.seoTitle}{ $berta.section.seoTitle|strip_tags|escape }{else}{ $berta.pageTitle|strip_tags|escape }{/if}</title>
	<meta name="keywords" content="{if $berta.section.seoKeywords}{ $berta.section.seoKeywords|strip_tags|escape }{else}{ $berta.settings.texts.metaKeywords|strip_tags|escape }{/if}">
	<meta name="description" content="{if $berta.section.seoDescription}{ $berta.section.seoDescription|strip_tags|escape }{else}{ $berta.settings.texts.metaDescription|strip_tags|escape }{/if}">
	<meta name="author" content="{ $berta.settings.texts.ownerName }">
  {if $berta.options.NOINDEX || !$berta.section.published}<meta name="robots" content="noindex, nofollow">{/if}
	{$berta.settings.settings.googleSiteVerification|@html_entity_decode}

	{ if $berta.settings.pageLayout.favicon }
	<link rel="SHORTCUT ICON" href="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.pageLayout.favicon }">
	{ else }
	<link rel="SHORTCUT ICON" href="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/favicon.ico">
	{ /if }
	{ $berta.scripts }
	{ $berta.css }
    {if $berta.settings.css.customCSS}
        <style type="text/css">
        {$berta.settings.css.customCSS|@html_entity_decode|replace:'<br />':"\n"}
        </style>
    {/if}
	{ googleWebFontsAPI }
	<script type="text/javascript" src="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/default.js?{$berta.options.int_version}"></script>
</head>

<body class="xContent-{ $berta.section.name }{if $berta.tagName} xSubmenu-{$berta.tagName}{/if}{if $berta.environment == 'engine'} page-xMySite{/if}{if $berta.section.type} xSectionType-{ $berta.section.type }{/if}">

	{if $berta.settings.background.backgroundAttachment=='fill' AND $berta.settings.background.backgroundImageEnabled=='yes' AND $berta.settings.background.backgroundImage!=''}
		<div id="xFilledBackground" class="xPosition-{' '|str_replace:'_':$berta.settings.background.backgroundPosition}">
			<img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.background.backgroundImage }" />
		</div>
	{/if}

	{* all templates must include div with id=allContainer *}
	<div id="allContainer">

		<div id="contentContainer"{if $berta.settings.pageLayout.responsive=='yes' } class="xResponsive"{/if}>

            {* multisites menu ********************************************************************* *}
            {if $berta.options.MULTISITES|count > 1}
                <ul id="multisites">
                    {foreach $berta.options.MULTISITES AS $siteName => $site }
                        {if $berta.environment == 'engine' || $berta.options.MULTISITE != $siteName || ($siteName=='0' && $berta.options.MULTISITE !='' ) }
                            <li{if $berta.options.MULTISITE === $siteName || ($siteName=='0' && $berta.options.MULTISITE =='')} class="selected"{/if}><a href="{ bertaLink site=$siteName }">{if $site['title']['value']!=''}{$site['title']['value']}{else}{if $siteName=='0'}Main site{else}{$siteName}{/if}{/if}</a></li>
                        {/if}
                    {/foreach}
                </ul>
            {/if}

            { if ($berta.environment == 'site' && $berta.settings.navigation.landingSectionPageHeadingVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionPageHeadingVisible=='no' && $berta.sectionName != $berta.sections|@key) }
                { if $berta.settings.pageHeading.image }
                	<h1><a href="{ bertaLink }">{ responsiveImage image = $berta.settings.pageHeading prefix=image path = $berta.options.MEDIA_ABS_ROOT alt=$berta.settings.texts.pageTitle }</a></h1>
                { else }
                	<h1 class="xEditable xProperty-siteHeading"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/siteHeading"{ /if }>
                    { if $berta.environment == "engine" }
                        { $siteHeading }
                    { else }
                        <a href="{ bertaLink }">{ $siteHeading }</a>
                    { /if }
                    </h1>
                { /if }
			{ /if }

			{if ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key) }
				<div id="additionalText"{if $berta.settings.pageLayout.responsive!='yes'} class="xEditableDragXY xProperty-additionalTextXY" style="{ additionalTextPos xy=$additionalTextXY }"{/if}{if $berta.environment == 'engine' && $berta.settings.pageLayout.responsive != 'yes'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/additionalTextXY"{ /if }>
					<div class="xHandle"></div>
					{if $berta.settings.socialMediaButtons.socialMediaLocation == 'additionalText' && $berta.settings.socialMediaButtons.socialMediaHTML}
                    	{ $berta.settings.socialMediaButtons.socialMediaHTML|@html_entity_decode|replace:'<br />':"\n" }
                    {else}
						<div class="xEditableMCESimple xProperty-additionalText xCaption-additional-text"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/additionalText"{ /if }>
						  { $additionalText }
						</div>
					{/if}
				</div>
			{/if}

			<div id="siteTopMenu">
				{if $berta.settings.pageLayout.responsive == 'yes'}
                    <a href="#" id="menuToggle"><span></span></a>
                {/if}

				{* *** sections menu ***************************************************************** *}
				{ assign var="sName" value=$berta.sectionName }
				{

				if count($berta.publishedSections) > 0 &&
					(
						($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') ||
						$berta.environment == 'engine' ||
						($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key)
					)
				}
					<ul id="mainMenu">
						{ assign var="firstSection" value="1" }
						{ foreach from=$berta.publishedSections item="section" name="sectionsMenuLoop" }
							{ if $berta.sectionName == $section.name }<li class="selected">{ else }<li>{ /if }
								{ if !$firstSection }
									<span class="separator">{ $berta.settings.menu.separator }</span>
								{ /if }
								<a href="{ bertaLink section=$section.name }" target="{ bertaTarget section=$section.name }">{ $section.title }</a>

								{ assign var="subName" value=$section.name }
								{ if $berta.settings.pageLayout.responsive == 'yes' && !empty($berta.tags.$subName) }
                                    <ul class="subMenu xSection-{ $subName }">
                                        { foreach $berta.tags.$subName as $tName => $tag }
                                            <li class="xTag-{ $tName }{ if $berta.tagName == $tName and $subName == $section.name } selected{ /if }">
                                                <a class="handle" href="{ bertaLink section=$subName tag=$tName }" target="{ bertaTarget section=$subName tag=$tName }">{ $tag.title }</a>
                                            </li>
                                        { /foreach }
                                    </ul>
                                { /if }

							</li>
							{ assign var="firstSection" value="0" }
						{ /foreach }
					</ul>
				{ /if }

				{* *** sub menu ********************************************************************* *}
				{ if !empty($berta.tags.$sName) }
						<ul id="subMenu" class="subMenu xSection-{ $sName }{ if $berta.tags.$sName|@count > 1 && $berta.environment == 'engine' } xAllowOrdering{ /if }">
							{ assign var="firstSection" value="1" }
							{ foreach from=$berta.tags.$sName key="tName" item="tag" name="subMenuLoop" }
								{ if $berta.tagName == $tName }<li class="selected xTag-{ $tName }">{ else }<li class="xTag-{ $tName }">{ /if }
									{ if $berta.environment == 'engine' || !$firstSection }
										<span class="separator">{ $berta.settings.subMenu.separator }</span>
									{ /if }
									<a class="handle" href="{ bertaLink section=$berta.sectionName tag=$tName }" target="{ bertaTarget section=$berta.sectionName tag=$tName }">{ $tag.title }</a>
								</li>
								{ assign var="firstSection" value="0" }
							{ /foreach }
						</ul>
				{ /if }

				<br class="clear" />
			</div>

			<ol id="pageEntries" class="{ entriesListClasses }">

				{* now loop through all entries and print them out *}
				{ foreach from=$entries key="entryId" item="entry" name="entriesLoop" }
 					<li class="entry {if $berta.section.type == 'portfolio'}xHidden {/if}{ entryClasses entry=$entry }" id="{ entrySlug entry=$entry }">

						{* the entry settings and delete and move buttons live in the entryHeader - don't leave it out! *}
						{ entryHeader section=$berta.section.name entry=$entry }

						{ if $berta.settings.entryLayout.galleryPosition == 'above title' }
							{* entryGallery prints the image gallery for the entry *}
							{ entryGallery entry=$entry }
						{ /if }

						{ if $berta.environment == 'engine' || !empty($entry.title) }
						<h2><span class="xEditable xProperty-title xCaption-entry&nbsp;title"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/entry/{ $berta.section.name }/{ $entry.id }/content/title"{ /if }>{ $entry.title }</span></h2>
						{ /if }

						{ if $berta.settings.entryLayout.galleryPosition == 'between title/description' }
							{* entryGallery prints the image gallery for the entry *}
							{ entryGallery entry=$entry }
						{ /if }

						{ if $berta.environment == 'engine' || !empty($entry.description) }
						<div class="entryText xEditableMCE xProperty-description"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/entry/{ $berta.section.name }/{ $entry.id }/content/description"{ /if }>{ $entry.description }</div>
						{ /if }

						{ if $berta.settings.entryLayout.galleryPosition == 'below description' }
							{* entryGallery prints the image gallery for the entry *}
							{ entryGallery entry=$entry }
						{ /if }

						{ assign var=hasURL value= $berta.environment == 'engine' || !empty($entry.url) }
						{ if $hasURL }
						<div class="entryContent">
							<div class="xEditable xProperty-url"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/entry/{ $berta.section.name }/{ $entry.id }/content/url"{ /if }>{ if $berta.environment == 'site'}<a href="{ $entry.url }" target="_blank">{ $entry.url }</a>{else}{ $entry.url }{/if}</div>
						</div>
						{ /if }

						{* entry footer wraps the entry including the header - don't leave it out! *}
						{ entryFooter entry=$entry }
						<br class="clear" />
					</li>
				{ foreachelse }
					{* the template can be modified in a way that here goes content that is displayed when there are no entries in the section *}

				{ /foreach }

			</ol>

            {if $berta.section.type == 'portfolio'}
                { include file="../_includes/inc.portfolio_thumbnails.tpl"  }
            {/if}

			<div id="additionalFooterText" class="{if !($berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML)}xEditableMCESimple {/if}xProperty-additionalFooterText xCaption-additional-footer-text clearfix"{if $berta.environment == 'engine' && !($berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML)} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/additionalFooterText"{/if}>
                {if $berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML}
                    { $berta.settings.socialMediaButtons.socialMediaHTML|@html_entity_decode|replace:'<br />':"\n" }
                {else}
                    { $additionalFooterText }
                {/if}
            </div>

			<div class="footer xEditableTA xProperty-siteFooter"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/siteFooter"{ /if }>
        { $siteFooter }
      </div>
			{ if !($berta.settings.settings.hideBertaCopyright=='yes' && $berta.hostingPlan>1) }
				<div class="bertaCopyright">{ bertaCopyright }</div>
			{ /if }
		</div>

		{section name=banners loop=10}
		    { assign var="setting_name_image" value="banner`$smarty.section.banners.iteration`_image" }
			{ assign var="setting_name_link" value="banner`$smarty.section.banners.iteration`_link" }
			{ assign var="setting_pos_name" value="banner`$smarty.section.banners.iteration`XY" }

			{ if $berta.settings.banners.$setting_name_image }
				<div class="floating-banner banner-{$smarty.section.banners.iteration}{if $berta.settings.pageLayout.responsive!='yes' } xEditableDragXY xProperty-{ $setting_pos_name }{/if}"{ if $berta.settings.pageLayout.responsive!='yes' } style="{ bannerPos xy_name=$setting_pos_name }"{/if}{if $berta.environment == 'engine' && $berta.settings.pageLayout.responsive != 'yes'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/banner{$smarty.section.banners.iteration}XY"{ /if }>
                    { if $berta.settings.pageLayout.responsive!='yes' }
                        <div class="xHandle"></div>
                    {/if}
					{ if $berta.settings.banners.$setting_name_link }
						<a href="{ $berta.settings.banners.$setting_name_link }" target="_blank">
							{ responsiveImage image = $berta.settings.banners prefix=$setting_name_image path = $berta.options.MEDIA_ABS_ROOT }
						</a>
					{ else }
						{ responsiveImage image = $berta.settings.banners prefix=$setting_name_image path = $berta.options.MEDIA_ABS_ROOT }
					{ /if }
				</div>

			{ /if }
		{/section}

	</div>

    { if $berta.settings.settings.showTutorialVideos == 'yes' && !$smarty.cookies._berta_videos_hidden }{ videoTutorials }{ /if }

	{ intercomScript }

    { include file="../_includes/inc.js_include.tpl" }

	{ include file="../_includes/inc.counter.tpl"  }
</body>
</html>
