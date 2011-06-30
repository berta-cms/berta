<?php

return array(

	// Translations from the top "admin" menu

	/* menu item */ 'close this' => 'aizvērt',
	/* menu item */ 'my site' => 'mana berta',
	/* menu item */ 'sections' => 'sadaļas',
	/* menu item */ 'settings' => 'uzstādījumi',
	/* menu item */ 'template design' => 'izskats',
	/* menu item */ 'profile' => 'mans profils',
	/* menu item */ 'sign out' => 'izlogoties',


	// Translations from the login/logout interface

	'Log in' => 'Ielogoties',
	'Logout ok. Please wait...' => 'Lūdzu, uzgaidi...',


	// Translatins from sections editor (sections.php)

	/* title */ 'Sections' => 'Sadaļas',
	/* column */ 'Title as displayed in main menu' => 'Nosaukums (galvenajā izvēlnē)',
	/* column */ 'Type' => 'Veids',
	/* column */ 'Details' => 'Uzstādījumi',
	/* column */ 'Is published?' => 'Ir redzama?',
	/* column */ 'Delete' => 'Dzēst',
	/* button */ 'create new section' => 'izveidot jaunu sadaļu',
	/* button */ 'delete' => 'dzēst',

	// Translations from settings page (settings.php)

	/* title */ 'Settings' => 'Uzstādījumi',
	/* title */ 'Template design' => 'Izskats',
	'These are settings for template' => 'Šie ir uzstādījumi veidnei',

	'Some help with CSS values' => 'CSS vērtību skaidrojums',
	'Units' => 'Vienības',
	'Valid units for any numerical value are:<br /><strong>px</strong> - pixels<br /><strong>em</strong> - 1 em = one length of letter M in the font used<br /><strong>%</strong> - percent of the font size or percent of the dimensions of the container element (e.g. the page etc.)' => '',
	'Margins' => 'Malas',
	'Margins are tricky. Use px or em as units. You can set margins in 4 ways, bu entering:<br/><strong>1 value</strong> - sets top, right, bottom and left margins to the same value. Example: <em>10px</em>.<br /><strong>2 values</strong> - sets top and bottom margins to the first value, left and right - to the second. Example: <em>0 5px</em>.<br /><strong>3 values</strong> - sets top margin to the first value, left and right - to the second, bottom - to the third value. Example: <em>10px 0 20px</em>.<br /><strong>4 values</strong> - sets all margins in the following order: top, right, bottom, left. Example: <em>10px 0 20px 2px</em>.' => '',
	
	// Translations from inc.settings.php

	/* setting tab & setting name */ 'Template' => 'Veidne',
	/* help text */    'Templates are like skins or themes for your site. You can choose one template from the ones installed in your templates folder. To add a new template to this list, upload it to the templates folder via FTP.' => 'Templates are like skins or themes for your site. You can choose one template from the ones installed in your templates folder. To add a new template to this list, upload it to the templates folder via FTP.',

	/* setting tab */ 'Texts' => 'Teksti',
	/* setting name */ 'Your name' => 'Your name',
	/* help text */    'Your name will be put in a meta-tag in the code of your site. You can choose any name ;)' => 'Your name will be put in a meta-tag in the code of your site. You can choose any name ;)',
	/* setting name */ 'Page title (title bar)' => 'Page title (title bar)',
	/* help text */    'Text that appears in the bowser title bar' => 'Text that appears in the bowser title bar',
	/* setting name */ '<META> description' => '<META> description',
	/* help text */    'Site description is visible only to search engines. It should not be longer than one or two sentences.' => 'Site description is visible only to search engines. It should not be longer than one or two sentences.',
	/* setting name */ '<META> keywords' => '<META> keywords',
	/* help text */    'Keywords visible only to search engines. Keywords along with the description can improve your site ranking in search results.' => 'Keywords visible only to search engines. Keywords along with the description can improve your site ranking in search results.',

	/* setting tab */ 'Navigation' => 'Navigācija',
	/* setting name */ 'Is first section visible in menu?' => 'Is first section visible in menu?',
	/* help text */    'Choose "no" to hide the first section in the main menu. Link from the page title (or header image) will lead to it. NOTE: This setting has no effect, if the section has a submenu; then it is visible at all times.' => 'Choose "no" to hide the first section in the main menu. Link from the page title (or header image) will lead to it. NOTE: This setting has no effect, if the section has a submenu; then it is visible at all times.',
	/* setting name */ 'Always auto-select a submenu item?' => 'Always auto-select a submenu item?',
	/* help text */    'Choose "yes" to automatically select the first submenu item when clicking on a menu item. This works only when there is a submenu.' => 'Choose "yes" to automatically select the first submenu item when clicking on a menu item. This works only when there is a submenu.',

	/* setting tab */ 'Page layout' => 'Lapas izskats',
	/* setting name */ 'Favicon' => 'Favicon',
	/* help text */    'Small picture to display in the address bar of the browser. The file must be in .ICO format and 16x16 pixels big.' => 'Small picture to display in the address bar of the browser. The file must be in .ICO format and 16x16 pixels big.',
	/* setting name */ 'Grid step' => 'Grid step',
	/* help text */    'Distance in pixels for snap-to-grid dragging.' => 'Distance in pixels for snap-to-grid dragging.',

	/* setting tab */ 'Entry layout' => 'Ieraksta izskats',
	/* setting name */ 'Small image width' => 'Small image width',
	/* setting name */ 'Small image height' => 'Small image height',
	/* help text */    'Maximum size of a small image (visible if \'Small images\' are switched on in the gallery editor). These settings don\'t affect original image.' => '',
	/* setting name */ 'Large image width' => 'Large image width',
	/* setting name */ 'Large image height' => 'Large image height',
	/* help text */    'Maximum size of a large image (visible if \'Large images\' are switched on in the gallery editor). These settings don\'t affect original image.' => '',

	/* setting tab */ 'Media' => 'Multimediji',
	/* setting subcategory */ 'Lightbox settings:' => 'Lightbox settings:',
	/* setting name */ 'Is enabled by default' => 'Is enabled by default',
	/* help text */    'Enables Lightbox mode for new entries.' => 'Enables Lightbox mode for new entries.',
	/* setting name */ 'Background color' => 'Background color',
	/* help text */    'Color of the Lightbox background layer.' => 'Color of the Lightbox background layer.',
	/* setting name */ 'Image frame' => 'Image frame',
	/* help text */    'Enables/Disables a frame around image.' => 'Enables/Disables a frame around image.',
	/* setting name */ 'Close button' => 'Close button',
	/* help text */    '&quot;Close&quot; symbol. You can enter your own.' => '&quot;Close&quot; symbol. You can enter your own.',
	/* setting name */ 'Image numbers' => 'Image numbers',
	/* help text */    'Enables/disables numbers below the image.' => 'Enables/disables numbers below the image.',
	/* setting name */ 'Caption alignment' => 'Caption alignment',
	/* help text */    'Positioning of the image caption text.' => 'Positioning of the image caption text.',
	/* setting subcategory */ 'Image gallery appierance:' => 'Image gallery appierance:',
	/* setting name */ 'Auto-rewind gallery slideshow' => 'Auto-rewind gallery slideshow',
	/* help text */    'Display the first image after clicking on the last image in galleries that are in slideshow mode.' => 'Display the first image after clicking on the last image in galleries that are in slideshow mode.',
	/* setting name */ 'Video player' => 'Video player',
	/* help text */    'Choose between the two visually different players for your video files.' => 'Choose between the two visually different players for your video files.',

	/* setting tab */ 'Banners' => 'Banneri',
	/* setting name */ 'Banner image' => 'Banner image',
	/* setting name */ 'Banner link' => 'Banner link',

	/* setting tab */ 'Other settings' => 'Dažādi...',
	/* setting name */ 'Google Analytics ID' => 'Google Analytics ID',
	/* help text */    'The ID of the <a href="http://google.com/analytics" target="_blank">Google Analytics</a> site profile. To obtain an ID, register in <a href="http://google.com/analytics" target="_blank">Google Analytics</a> and create a profile for your site.' => 'The ID of the <a href="http://google.com/analytics" target="_blank">Google Analytics</a> site profile. To obtain an ID, register in <a href="http://google.com/analytics" target="_blank">Google Analytics</a> and create a profile for your site.',
	/* setting name */ 'Advanced file uploading enabled' => 'Advanced file uploading enabled',
	/* help text */    'Set if the advanced uploading features (selecting multiple files at once, asynchronous uploading) are enabled. You should not disable them UNLESS you are experiencing problems with file uploads.' => 'Set if the advanced uploading features (selecting multiple files at once, asynchronous uploading) are enabled. You should not disable them UNLESS you are experiencing problems with file uploads.',


	// Translations from entries view (and editing)

	'<p>Congratulations! You have successfully installed Berta.</p><p>Now, before adding your content, you have to create a new section. Go to the <a href="sections.php">sections page</a> and do that!</p>' =>
		'<p>Congratulations! You have successfully installed Berta.</p><p>Now, before adding your content, you have to create a new section. Go to the <a href="sections.php">sections page</a> and do that!</p>',
	'create new entry here' => 'izveidot jaunu ierakstu',


	
	// Translations for default template

	/* setting tab */ 'General font settings' => 'Vispārīgie teksta uzstādījumi',
	/* setting name */ 'Color' => 'Krāsa',
	/* setting name */ 'Font face' => 'Šrifts',
	/* setting name */ 'Font size' => 'Šritfta izmērs',
	/* setting name */ 'Font weight' => 'Šrifta treknums',
	/* setting name */ 'Font style' => 'Šrifta stils',
	/* setting name */ 'Font variant' => 'Burtu veids',
	/* setting name */ 'Line height' => 'Rindas augstums',
	/* help text */    'Height of text line. Use em, px or % values or the default value "normal"' => 'Attālums starp divu teksta rindiņu pamatnēm. Izmanto "em", "px" vai "%" vienības, kā arī noklusēto vērtību "normal"',

	/* setting tab */ 'Hyperlinks' => 'Hipersaites',
	/* setting name */ 'Link color' => '',
	/* setting name */ 'Visited link color' => '',
	/* setting name */ 'Link color when hovered' => '',
	/* setting name */ 'Link color when clicked' => '',
	/* setting name */ 'Link decoration' => '',
	/* setting name */ 'Visited link decoration' => '',
	/* setting name */ 'Link decoration when hovered' => '',
	/* setting name */ 'Link decoration when clicked' => '',

	/* setting tab */ 'Background' => 'Fons',
	/* setting name */ 'Background color' => '',
	/* setting name */ 'Is background image enabled?' => '',
	/* setting name */ 'Background image' => '',
	/* help text */    'Picture to use for page background.' => '',
	/* setting name */ 'Background tiling' => '',
	/* help text */    'How the background fills the screen?' => '',
	/* setting name */ 'Background alignment' => '',
	/* help text */    'Where the background image is positioned?' => '',
	/* setting name */ 'Background position' => '',
	/* help text */    'Sets how background behaves in relation with the browser window.' => '',

	/* setting name */ 'Content position' => '',
	/* setting name */ 'Text alignment' => '',
	/* setting name */ 'Width of content area' => '',
	/* setting name */ 'Page margins' => '',
	/* help text */    'How far the content is from browser edges. Please see the short CSS guide at the bottom of this page.' => '',
	/* setting name */ 'Top menu margins' => '',
	/* help text */    'How big is the distance from the top menu to the other page elements' => '',

	/* setting tab */ 'Page heading' => 'Lapas virsraksts',
	/* setting name */ 'Header image' => '',
	/* help text */    'Picture to use instead of text.' => '',
	/* help text */    'How far the heading is form other elements in page. Please see the short CSS guide at the bottom of this page.' => '',
	/* help text */    'How far the menu is form other elements in page. Please see the short CSS guide at the bottom of this page.' => '',

	/* setting tab */ 'Main menu' => 'Galvenā izvēlne',
	/* setting name */ 'Menu items separator' => '',
	/* setting name */ 'Space width around separator' => '',
	/* help text */    'The distance from the separator to the menu item on both sides' => '',

	/* setting tab */ 'Submenu' => 'Apakšizvēlne',

	/* setting name */ 'Entry margins' => '',
	/* help text */    'Margins around entries. Please see the short CSS guide at the bottom of this page.' => '',
	/* setting name */ 'Gallery position' => '',
	/* setting name */ 'Default gallery type' => '',
	/* help text */    'Slideshow means that an image menu plus only one image is visible at a time. Row means that all images are visible.' => '',
	/* setting name */ 'Space between images in row' => '',
	/* setting name */ 'Gallery margins' => '',
	/* help text */    'Margin around gallery block' => '',
	/* setting name */ 'Display tags by each entry' => '',
	/* help text */    'This determines whether people will see tags you set for each entry. Regardless of this settting, tags still will make up the main menu.' => '',
	/* setting name */ 'Date format in entries' => '',
	/* setting name */ 'Date separator' => '',
	/* help text */    'Separator symbol that divides year, month and day' => '',
	/* setting name */ 'Time separator' => '',

	/* setting tab */  'Entry heading'=> '',
	/* help text */    'How far the entry heading is form other elements in page. Please see the short CSS guide at the bottom of this page.' => '',

	/* setting tab */ 'Entry footer' =>  '',



	// Translations for Messy template

	/* setting name */ 'Entry text width' => '',
	/* setting name */ 'Space between images and image navigation' => '',
	/* help text */    'Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode' => '',
	/* setting name */ 'Empty space below gallery' => '',
	/* help text */    'Distance between the gallery and the content below' => '',

	/* setting name */ 'Logo image' => '',
	/* help text */    'Picture to use instead of header text. Max size: 140 x 400 pixels. If the image is larger, it will be reduced.' => '',

	/* setting name */ 'Color when hovered' => 'Izgaismotā elementa krāsa',
	/* help text */    'Color of the element under mouse cursor' => 'Krāsa elementam, kas atrodas zem peles kursora bultiņas',
	/* setting name */ 'Color when selected' => 'Aktīvā elementa krāsa',
	/* help text */    'Color of the element of the currently opened section' => 'Krāsa patlaban atvērtās sadaļas elementam',
	/* setting name */ 'Decoration' => 'Rotājums',
	/* setting name */ 'Decoration when hovered' => 'Izgaismotā elementa rotājums',
	/* setting name */ 'Decoration when selected' => 'Aktīvā elementa rotājums',



	// Translations for White template

	/* pgeHeading */
	/* setting name */ 'Empty space on top' => '',
	/* setting name */ 'Empty space on bottom' => '',

	/* pageLayout */
	/* setting name */ 'Widh of content area' => '',
	/* help text */    'Width of texts in the entries. This does not apply to the width of images.' => '',
	/* setting name */ 'How far content is from page top?' => '',
	/* help text */    'The vertical distance between the top of the page and the content area.' => '',
	/* setting name */ 'How far content is from menu?' => '',
	/* help text */    'The horizontal distance between the menu and the content area.' => '',
	/* setting name */ 'Width of the left column' => '',

	/* entryLayout */
	/* setting name */ 'Space between entries' => '',
	/* help text */    'Distance from entry to entry. In pixels.' => '',
	/* help text */    'Horizontal space bween images when gallery is in "row" mode' => '',



	//

	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => '',
	'' => ''

)


?>