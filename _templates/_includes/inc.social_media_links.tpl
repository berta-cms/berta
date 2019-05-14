{foreach $socialMediaLinks as $link}
  {assign var="icon_path" value="`$berta.options.TEMPLATES_ROOT`_includes/icons/`$link.icon`.svg" }
  {if (file_exists($icon_path))}
    <a href="{$link.url}" target="_blank" class="social-icon">{ include file="../_includes/icons/`$link.icon`.svg" }</a>
  {/if}
{/foreach}
