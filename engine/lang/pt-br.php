<?php

return array(

	'berta_copyright_text' => 'Desenvolvido com <a href="http://www.berta.me/" target="_blank" title="Crie seu própio website com Berta em alguns minutos!">Berta</a>',

	'margins_help_text' => 'O parâmetro Margin é traiçoeiro. Use px ou em como unidades de medida. Você pode definir os parâmetros Margin de 4 maneiras diferentes:<br/><strong>1 Valor</strong> - define que as margens do topo, direita, inferior e esquerda com os mesmos valores. Exemplo:<em>10px</em>.<br /><strong>2 valores</strong>

 Example: <em>10px</em>.<br /><strong>2 values</strong> - sets top and bottom margins to the first value, left and right - to the second. Example: <em>0 5px</em>.<br /><strong>3 values</strong> - sets top margin to the first value, left and right - to the second, bottom - to the third value. Example: <em>10px 0 20px</em>.<br /><strong>4 values</strong> - sets all margins in the following order: top, right, bottom, left. Example: <em>10px 0 20px 2px</em>.',
	'units_help_text' => 'Valid units for any numerical value are:<br /><strong>px</strong> - pixels. Example: <em>10px</em>. By using just numbers value WILL NOT change.<br /><strong>em</strong> - 1em = one length of letter M in the font used. Example: <em>1em</em><br /><strong>%</strong> - percent of the font size or percent of the dimensions of the container element (e.g. the page etc.)',

	'sections_help_text' => 'Sections are main divisions in your site. Think of them as containers for your content. They appear as menu items in the main menu. ',
	'external_link_help_text' => 'If you want any of the items in your main menu to lead the visitor somewhere else than your site, specify the external link. It can be an email link (e.g., <em>mailto:sombeody@someplace.net</em>) or a link to another website (e.g. <em>http://www.example.com</em>).',

	'password_help_text' => 'Password must be at least 6 characters long<br /> and containing alphanumeric (A-Z, a-z, 0-9) characters.',
	
	'welcome_text__not_installed' => '<h2>Thank you for choosing Berta!</h2>
		   <p>Berta is not set up.<br />Please <a href="./engine/">log in</a> and follow the set up procedure.</p>',

	'welcome_text__not_supported' => '<h2>Thank you for choosing Berta!</h2>
										<p>This server does not meet Berta\'s requirements.<br />
										Please check that PHP version 5 or above is installed on the server.</p>',
	'setup_info_text' => 'Click on the fields with yellow background to edit them.
							Then press Enter or click anywhere outside the field to save.
							This way it will be throughout your site — all that has a yellow background is editable. You will also be able to change these settings later.',

	'googleFont_description' => 'Type in any google font name. To check available fonts go to <a href="http://www.google.com/webfonts" target="_blank">Google web fonts</a>. Remember – google font overrides system font. Leave empty if you want to use system font. Example: <em>Marvel</em>, <em>Marvel:700italic</em> or <em>Josefin Slab:700italic</em>',
	'description_tagsMenu_x' => 'Submenu X position in pixels (i.e. 10px)',
	'description_tagsMenu_y' => 'Submenu Y position in pixels (i.e. 10px)',
	'description_menu_position' => 'Menu position',
	'description_banner' => 'Banners are images which are visible in all sections. Use it for buttons or social icons in your site',
	'description_banner_link' => 'Banner link \'http://\' should be in front of the address',
	'description_language' => 'Choose language of berta interface. Refresh site, to apply.',
	'Heading position' => 'Heading position fixed or absolute. Fixed always stays in one place, absolute moves together with content.',
	'description_heading_position' => 'Heading position fixed or absolute. Fixed always stays in one place, absolute moves together with content.',
	'description_submenu_alwaysopen' => 'Submenu is open when menu item is current.',
	'mobile_device_detected' => 'You can\'t use mobile device to edit your site!',
	'javascript_include' => 'Javascript code included right before closing &lt;/body&gt; element. Learn more how to <a href="https://github.com/berta-cms/berta/wiki/Include-JavaScript-code" target="_blank" title="How to include JavaScript code">include JavaScript code</a>.',
	'description_custom_css' => 'Place your custom CSS code here. Any existing CSS definitions will be overwritten. For more information visit our <a href="https://github.com/berta-cms/berta/wiki/Add-custom-CSS" target="_blank">WIKI</a>.',
)

?>
