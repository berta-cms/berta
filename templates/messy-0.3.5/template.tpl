<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>{ $berta.pageTitle }</title>
	<meta name="keywords" content="{ $berta.settings.texts.metaKeywords }" />
	<meta name="description" content="{ $berta.settings.texts.metaDescription }" />
	<meta name="author" content="{ $berta.settings.texts.ownerName }" />
	{ if $berta.settings.pageLayout.favicon }
	<link rel="SHORTCUT ICON" href="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.pageLayout.favicon }" />
	{ else }
	<link rel="SHORTCUT ICON" href="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/favicon.ico" />
	{ /if }
	
	{ $berta.scripts }
	{ $berta.css }
	{ googleWebFontsAPI }		
	<script type="text/javascript" src="{ $berta.options.TEMPLATES_ABS_ROOT }{ $berta.templateName }/mess.js"></script>
</head>

<body>
	
	{if $berta.settings.background.backgroundAttachment=='fill' AND $berta.settings.background.backgroundImageEnabled=='yes' AND $berta.settings.background.backgroundImage!=''}
		<div id="xFilledBackground" class="xPosition-{' '|str_replace:'_':$berta.settings.background.backgroundPosition}">
			<img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.background.backgroundImage }" />
		</div>
	{/if}
	
	{* all templates must include allContainer *}
	<div id="allContainer">
		
		{* engine panel lives in pageHeader - don't leave it out *}
		{ pageHeader }
		
		<div id="contentContainer">
		
			<!-- PAGE HEADING -->
		
			{ if $berta.settings.heading.image }
			<h1 class="{ messClasses property='siteHeadingXY' }" style="{ messStyles xy=$siteHeadingXY }"><a href="{ bertaLink }"><img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.heading.image }" /></a></h1>
			{ else }
			<h1 class="{ messClasses property='siteHeadingXY' }" style="{ messStyles xy=$siteHeadingXY }">
				<span class="xEditable xProperty-siteHeading">
				{ if $berta.environment == "engine" }
					{ $siteHeading }
				{ else }
					<a href="{ bertaLink }">{ $siteHeading }</a>
				{ /if }
				</span>
			</h1>
			{ /if }
		
			<!-- MENU -->
		
			{ if count($berta.publishedSections) > 0 }
				{ assign var="currnetSectionName" value=$berta.sectionName }
				{ foreach from=$berta.publishedSections item="section" key="sName" name="sectionsMenuLoop" }
					<div class="menuItem xSection-{ $sName } { messClasses property='positionXY' } { if $currnetSectionName == $section.name }menuItemSelected{ /if }" style="{ messStyles xy=$section.positionXY }">
						<a href="{ bertaLink section=$sName }" target="{ bertaTarget section=$sName }">{ $section.title }</a>
			
						{ if !empty($berta.tags.$sName) }
							<ul>
								{ foreach from=$berta.tags.$sName key="tName" item="tag" name="subSectionsMenuLoop" }
									<li { if $berta.tagName == $tName and $currnetSectionName == $section.name }class="selected"{ /if }>
										<a href="{ bertaLink section=$sName tag=$tName }" target="{ bertaTarget section=$sName tag=$tName }">{ $tag.title }</a>
									</li>
								{ /foreach }	
							</ul>
						{ /if }
					</div>
				{ /foreach }
			{ /if }
			

			<div id="pageEntries" class="{ entriesListClasses } xNoEntryOrdering">

				{* now loop through all entries and print them out *}
				{ foreach from=$entries item="entry" name="entriesLoop" }
					<div class="{ entryClasses entry=$entry } { messClasses property='positionXY' }" style="{ messStyles xy=$entry.positionXY entry=$entry }">
	
						{* the entry settings and delete and move buttons live in the entryHeader - don't leave it out! *}
						{ customEntryHeader entry=$entry }

						{* entryGallery prints the image gallery for the entry *}
						{ entryGallery entry=$entry }

						{ if $berta.environment == 'engine' || !empty($entry.description) }
						<div class="entryText xEditableMCE xProperty-description">{ $entry.description }</div>
						{ /if }
	
						{ if $berta.environment == 'engine' || $berta.settings.entryLayout.displayTags == 'yes' && !empty($entry.tags) }
						<div title="{ $entry.tags|@implode:',' }" class="entryTags xEditableRC xProperty-tags xFormatModifier-toTags">{ $entry.tags|@toTags }</div>
						{ /if }

						{* entry footer wraps the entry including the header - don't leave it out! *}
						{ entryFooter entry=$entry }
					</div>

				{ foreachelse }
					{* the template can be modified in a way that here goes content the is displayed when there are no entries in the section *}

				{ /foreach }
			</div>
			
			
			<div id="additionalText" class="{ messClasses property='additionalTextXY' }" style="{ messStyles xy=$additionalTextXY }"> 
				<div class="xEditableMCESimple xProperty-additionalText xCaption-additional-text">
				{ $additionalText }
				</div>
			</div>

		</div>


		
		{section name=foo loop=10} 
		    { assign var="setting_name_image" value="banner`$smarty.section.foo.iteration`_image" }
			{ assign var="setting_name_link" value="banner`$smarty.section.foo.iteration`_link" }
			{ assign var="setting_pos_name" value="banner`$smarty.section.foo.iteration`XY" }
			
			{ if $berta.settings.banners.$setting_name_image }
				<div class="floating-banner xEditableDragXY xProperty-{ $setting_pos_name }" style="{ bannerPos xy_name=$setting_pos_name }"> 
					<div class="xHandle"></div>
					{ if $berta.settings.banners.$setting_name_link }
						<a href="{ $berta.settings.banners.$setting_name_link }" target="_blank">
							<img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.banners.$setting_name_image }" />
						</a>
					{ else }
					<img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.banners.$setting_name_image }" />
					{ /if }
				</div>
			
			{ /if }
		{/section}
			
	</div>
	
	<div id="bottom">
		<p id="userCopyright" class="xEditableTA xProperty-siteFooter">{ $siteFooter }</p>
		<p id="bertaCopyright">{ bertaCopyright }</p>
	</div>

	{ include file="../_includes/inc.counter.tpl"  }
</body>
</html>
