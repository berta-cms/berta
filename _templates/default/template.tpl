<!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie ie6 ie-old"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie ie7 ie-old"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie ie8"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html> <!--<![endif]-->
{$sectionHead}

<body class="xContent-{ $berta.section.name }{if $berta.tagName} xSubmenu-{$berta.tagName}{/if}{if $berta.environment == 'engine'} page-xMySite{/if}{if $berta.section.type} xSectionType-{ $berta.section.type }{/if}{if $berta.settings.pageLayout.responsive=='yes'} bt-responsive{/if}">

	{if $berta.settings.background.backgroundAttachment=='fill' AND $berta.settings.background.backgroundImageEnabled=='yes' AND $berta.settings.background.backgroundImage!=''}
		<div id="xFilledBackground" class="xPosition-{' '|str_replace:'_':$berta.settings.background.backgroundPosition}">
			<img src="{ $berta.options.MEDIA_ABS_ROOT }{ $berta.settings.background.backgroundImage }" />
		</div>
	{/if}

	{* all templates must include div with id=allContainer *}
	<div id="allContainer">

		<div id="contentContainer"{if $berta.settings.pageLayout.responsive=='yes' } class="xResponsive"{/if}>

            {* multisites menu ********************************************************************* *}
            {$sitesMenu}

            {$siteHeader}

			{if ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='yes') || $berta.environment == 'engine' || ($berta.environment == 'site' && $berta.settings.navigation.landingSectionMenuVisible=='no' && $berta.sectionName != $berta.sections|@key) }
				<div id="additionalText"{if $berta.settings.pageLayout.responsive!='yes'} class="xEditableDragXY xProperty-additionalTextXY" style="{ additionalTextPos xy=$additionalTextXY }"{/if}{if $berta.environment == 'engine' && $berta.settings.pageLayout.responsive != 'yes'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/additionalTextXY"{ /if }>
					<div class="xHandle"></div>
          {if $berta.settings.socialMediaButtons.socialMediaLocation == 'additionalText' && $berta.settings.socialMediaButtons.socialMediaHTML}
            { $berta.settings.socialMediaButtons.socialMediaHTML|@html_entity_decode|replace:'<br />':"\n" }
          {elseif $berta.settings.socialMediaLinks.location == 'additionalText' && $socialMediaLinks}
            { include file="../_includes/inc.social_media_links.tpl" }
          {else}
            <div class="xEditableMCESimple xProperty-additionalText xCaption-additional-text"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/additionalText"{ /if }>
              { $additionalText }
            </div>
          {/if}
				</div>
			{/if}

      {* *** sections menu ***************************************************************** *}
      {$sectionsMenu}

			<ol id="pageEntries" class="{ entriesListClasses }">
				{$entriesHTML}
			</ol>

            {if $berta.section.type == 'portfolio'}
                { include file="../_includes/inc.portfolio_thumbnails.tpl"  }
            {/if}

			<div id="additionalFooterText" class="{if !($berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML) && !($berta.settings.socialMediaLinks.location == 'footer' && $socialMediaLinks)}xEditableMCESimple {/if}xProperty-additionalFooterText xCaption-additional-footer-text clearfix"{if $berta.environment == 'engine' && !($berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML) && !($berta.settings.socialMediaLinks.location == 'footer' && $socialMediaLinks)} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/additionalFooterText"{/if}>
        {if $berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML}
          { $berta.settings.socialMediaButtons.socialMediaHTML|@html_entity_decode|replace:'<br />':"\n" }
        {elseif $berta.settings.socialMediaLinks.location == 'footer' && $socialMediaLinks}
          { include file="../_includes/inc.social_media_links.tpl" }
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

  { include file="../_includes/inc.back_to_top.tpl" }

  { include file="../_includes/inc.photoswipe_html.tpl" }

  { intercomScript }

  { include file="../_includes/inc.js_include.tpl" }

  { include file="../_includes/inc.counter.tpl"  }
</body>
</html>
