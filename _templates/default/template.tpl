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

			{$additionalTextBlock}

      {* *** sections menu ***************************************************************** *}
      {$sectionsMenu}

			<ol id="pageEntries" class="{ entriesListClasses }">
				{$entriesHTML}
			</ol>

            {if $berta.section.type == 'portfolio'}
                { include file="../_includes/inc.portfolio_thumbnails.tpl"  }
            {/if}

      {$additionalFooterTextBlock}

			<div class="footer xEditableTA xProperty-siteFooter"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/siteFooter"{ /if }>
        { $siteFooter }
      </div>
			{ if !($berta.settings.settings.hideBertaCopyright=='yes' && $berta.hostingPlan>1) }
				<div class="bertaCopyright">{ bertaCopyright }</div>
			{ /if }
		</div>

		{ $siteBanners }
	</div>

  { include file="../_includes/inc.back_to_top.tpl" }

  { include file="../_includes/inc.photoswipe_html.tpl" }

  { intercomScript }

  { include file="../_includes/inc.js_include.tpl" }

  { include file="../_includes/inc.counter.tpl"  }
</body>
</html>
