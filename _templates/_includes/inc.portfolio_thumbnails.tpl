{if ($entries)}
    <div class="portfolioThumbnailsWrap">
        <div class="portfolioThumbnails clearfix">
            {foreach from=$entries key="entryId" item="entry" name="entriesLoop"}
                <div class="portfolioThumbnail" data-id="{ $entryId }">
                    <div class="wrap">
                        <div class="xHandle"></div>
                        <a href="#{ entrySlug entry=$entry }">
                            { entryGalleryFirstImage entry=$entry }
                            <span> {if $entry.title}{ $entry.title }{elseif $berta.environment == 'engine'}entry-{ $entryId }{/if}</span>
                        </a>
                    </div>
                </div>
            {/foreach}
        </div>
    </div>
{/if}