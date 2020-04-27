<!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie6 ie-old"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie7 ie-old"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html> <!--<![endif]-->
{$sectionHead}

<body class="xContent-{ $berta.section.name }{if $berta.tagName} xSubmenu-{$berta.tagName}{/if}{if $berta.environment == 'engine'} page-xMySite{/if}{if $berta.section.type} xSectionType-{ $berta.section.type }{/if}{if $berta.settings.pageLayout.responsive=='yes'} bt-responsive{/if}">

	{* all templates must include allContainer *}
	<div id="allContainer"{ if $berta.settings.pageLayout.centered == 'yes' }class="xCentered"{ /if }>

		<div id="sideColumn" class="{ if $berta.settings.pageLayout.centered == 'yes' }xCentered{ /if }{if $berta.settings.pageLayout.responsive=='yes'} xResponsive{/if}">
			<div id="sideColumnTop">
	              {* multisites menu ********************************************************************* *}
                {$sitesMenu}

                {$siteHeader}

        {$additionalTextBlock}

        {$sectionsMenu}
			</div>
			<div id="sideColumnBottom">
				{if $berta.settings.socialMediaButtons.socialMediaLocation == 'footer' && $berta.settings.socialMediaButtons.socialMediaHTML}
          { $berta.settings.socialMediaButtons.socialMediaHTML|@html_entity_decode|replace:'<br />':"\n" }
        {elseif $berta.settings.socialMediaLinks.location == 'footer' && $socialMediaLinks}
          {$socialMediaLinks}
        {/if}
				<p id="userCopyright" class="xEditableTA xProperty-siteFooter"{if $berta.environment == 'engine'} data-path="{ $berta.options.MULTISITE }/settings/siteTexts/siteFooter"{ /if }>
          { $siteFooter }
        </p>
				{ if !($berta.settings.settings.hideBertaCopyright=='yes' && $berta.hostingPlan>1) }
					<p id="bertaCopyright">{ bertaCopyright }</p>
				{ /if }
			</div>
		</div>

		<div id="contentContainer"{if $berta.settings.pageLayout.responsive=='yes' } class="xResponsive"{/if}>
			<div id="mainColumn"{if $berta.settings.pageLayout.centered == 'yes' } class="xCentered"{ /if }{if $berta.settings.pageLayout.responsive=='yes' } data-paddingtop="{$berta.settings.pageLayout.paddingTop}"{/if}>
				<ol id="pageEntries" class="{ entriesListClasses }">
					{$entriesHTML}
				</ol>

				<br class="clear" />

                {if $berta.section.type == 'portfolio'}
                    { include file="../_includes/inc.portfolio_thumbnails.tpl"  }
                {/if}
			</div>
		</div>

		<div class="floating-banners">
		  { $siteBanners }
		</div>

	</div>

  { include file="../_includes/inc.back_to_top.tpl" }

  { include file="../_includes/inc.photoswipe_html.tpl" }

  { intercomScript }

	{ include file="../_includes/inc.js_include.tpl" }

	{ include file="../_includes/inc.counter.tpl"  }
</body>
</html>
