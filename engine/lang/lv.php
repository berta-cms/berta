<?php

return array(

	'berta_copyright_text' => '(latviski) Built with <a href="http://www.berta.lv/" target="_blank" title="Create your own portfolio with Berta in minutes!">Berta</a>',

	// Translations from the top "admin" menu

	/* menu item */ 'close this' => 'aizvērt',
	/* menu item */ 'my site' => 'mana berta',
	/* menu item */ 'sections' => 'sadaļas',
	/* menu item */ 'settings' => 'uzstādījumi',
	/* menu item */ 'template design' => 'veidnes izskats',
	/* menu item */ 'profile' => 'mans profils',
	/* menu item */ 'sign out' => 'izlogoties',

	// Translatins from sections editor (sections.php)

	/* title */ 'Sections' => 'Sadaļas',
	/* column */ 'Title as displayed in main menu' => 'Nosaukums (galvenajā izvēlnē)',
	/* column */ 'Type' => 'Veids',
	/* column */ 'Details' => 'Uzstādījumi',
	/* column */ 'Is published?' => 'Publicēts?',
	/* column */ 'Delete' => 'Dzēst',
	/* button */ 'create new section' => 'izveidot jaunu sadaļu',
	/* button */ 'delete' => 'dzēst',

	'What are sections?' => '(latviski)',
	'sections_help_text' => '(latviski) Sections are main divisions in your site. Think of them as containers for your content. They appear as menu items in the main menu. ',
	'What is the "external link"?' => '(latviski)',
	'external_link_help_text' => '(latviski) If you want any of the items in your main menu to lead the visitor somewhere else than your site, specify the external link. It can be an email link (e.g., <em>mailto:sombeody@someplace.net</em>) or a link to another website (e.g. <em>http://www.example.com</em>).',
	'' => '',
	'' => '',
	'' => '',
	'' => '',


	// Translations from settings page (settings.php)

	/* title */ 'Settings' => 'Uzstādījumi',
	/* title */ 'Template design' => 'Izskats',
	'These are settings for template' => 'Šie ir uzstādījumi veidnei',

	'Some help with CSS values' => 'CSS vērtību skaidrojums',
	'Units' => 'Vienības',
	'units_help_text' =>
		'Var izmantot sekojošas vienības: <br /><strong>px</strong> – pikseļi<br /><strong>em</strong> - 1 em = viena burta M platums attiecīgajā šriftā<br /><strong>%</strong> - procenti no šrifta izmēra vai arī procenti no konteinera elementa izmēra',
	'Margins' => 'Malas',
	'margins_help_text' =>
		'?????? are tricky. Use px or em as units. You can set margins in 4 ways, by entering:<br/><strong>1 value</strong> - sets top, right, bottom and left margins to the same value. Example: <em>10px</em>.<br /><strong>2 values</strong> - sets top and bottom margins to the first value, left and right - to the second. Example: <em>0 5px</em>.<br /><strong>3 values</strong> - sets top margin to the first value, left and right - to the second, bottom - to the third value. Example: <em>10px 0 20px</em>.<br /><strong>4 values</strong> - sets all margins in the following order: top, right, bottom, left. Example: <em>10px 0 20px 2px</em>.',
	
	// Translations from inc.settings.php

	/* setting tab & setting name */ 'Template' => 'Veidne',
	/* help text */    'Templates are like skins or themes for your site. You can choose one template from the ones installed in your templates folder. To add a new template to this list, upload it to the templates folder via FTP.' => 'Veidnes ir "ādiņas" jeb tēmas, kuras izmaina lapas elementu izvietojumu un izskatu.',

	/* setting tab */ 'Texts' => 'Vispārīgi',
	/* setting name */ 'Your name' => 'Tavs vārds',
	/* help text */    'Your name will be put in a meta-tag in the code of your site. You can choose any name ;)' => 'Tavs vārds tiks saglabāts meta-tagā lapas kodā. Vārds var būt jebkāds.',
	/* setting name */ 'Page title (title bar)' => 'Lapas virsraksts',
	/* help text */    'Text that appears in the bowser title bar' => 'Teksts, kas redzams pārlūka loga augšpusē',
	/* setting name */ '<META> description' => '&lt;META&gt; apraksts',
	/* help text */    'Site description is visible only to search engines. It should not be longer than one or two sentences.' => 'Lapas apraksts redzams tikai meklēšanas dzinējiem, piemēram, Google. Tam nevajadzētu pārsniegt 2 teikumus.',
	/* setting name */ '<META> keywords' => '&lt;META&gt; atslēgvārdi',
	/* help text */    'Keywords visible only to search engines. Keywords along with the description can improve your site ranking in search results.' => 'Atslēgvārdi ir redzami tikai meklētājiem, tādiem kā Google. Tie var uzlabot tavas lapas pozīciju meklēšanas rezultātos. Vēlams, lai tie ir atbilstoši lapas saturam.',

	/* setting tab */ 'Navigation' => 'Navigācija',
	/* setting name */ 'Is first section visible in menu?' => 'Vai pirmā sadaļa redzama galvenajā izvēlnē (menu)?',
	/* help text */    'Choose "no" to hide the first section in the main menu. Link from the page title (or header image) will lead to it. NOTE: This setting has no effect, if the section has a submenu; then it is visible at all times.' => 'Izvēlies "No", ja vēlies, lai pirmā sadaļa nav redzama. Uz sadaļu varēs nokļūt tikai atverot lapu vai uzklikšķinot uz lapas logo. Ņem vērā, ka iestatījums nedarbojas, ja šai sadaļai ir apakšizvēlnes (Tagi).',
	/* setting name */ 'Always auto-select a submenu item?' => 'Automātiski izvēlēties pirmo apakšizvēlni?',
	/* help text */    'Choose "yes" to automatically select the first submenu item when clicking on a menu item. This works only when there is a submenu.' => 'Izvēlies "Yes" unpēc izvēlnes iezīmēšanas automātiski tiks izvēlēta apakšizvēlne.',

	/* setting tab */ 'Page layout' => 'Lapas izskats',
	/* setting name */ 'Favicon' => 'Favicon',
	/* help text */    'Small picture to display in the address bar of the browser. The file must be in .ICO format and 16x16 pixels big.' => '16x16 pikseļu attēls, kurš atrodams pretī adrešu laukam pārlūkprogrammā. Failam jābūt .ICO formātā.',
	/* setting name */ 'Grid step' => 'Grid step',
	/* help text */    'Distance in pixels for snap-to-grid dragging.' => 'Rūtiņas izmērs pikseļos. Ja lielāks par 1, tad elementi pielips pie šī neredzamā rūtiņu sieta (snap to grid).',

	/* setting tab */ 'Entry layout' => 'Ieraksta izskats',
	/* setting name */ 'Small image width' => 'Mazā attēla platums',
	/* setting name */ 'Small image height' => 'Mazā attēla augstums',
	/* help text */    'Maximum size of a small image (visible if \'Small images\' are switched on in the gallery editor). These settings don\'t affect original image.' => 'Maksimālais mazā attēla izmērs. Tas būs redzams, kad galerijas redaktorā tiks ieslēgts "Mazās bildes"',
	/* setting name */ 'Large image width' => 'Lielā attēla platums',
	/* setting name */ 'Large image height' => 'Lielā attēla augstums',
	/* help text */    'Maximum size of a large image (visible if \'Large images\' are switched on in the gallery editor). These settings don\'t affect original image.' => 'Maksimālais mazā attēla izmērs. Tas būs redzams, kad galerijas redaktorā tiks ieslēgts "Lielās bildes"',

	/* setting tab */ 'Media' => 'Media',
	/* setting subcategory */ 'Lightbox settings:' => '<strong>Lightbox iestatījumi:</strong>',
	/* setting name */ 'Is enabled by default' => 'Pēc noklusējuma ieslēgts',
	/* help text */    'Enables Lightbox mode for new entries.' => 'Ieslēdz Lightbox režīmu jauniem ierakstiem.',
	/* setting name */ 'Background color' => 'fona krāsa',
	/* help text */    'Color of the Lightbox background layer.' => 'Lightbox fona krāsa (balts/melns/nekāda)',
	/* setting name */ 'Image frame' => 'Attēla rāmis',
	/* help text */    'Enables/Disables a frame around image.' => 'Ieslēdz/izslēdz rāmi apkārt attēlam',
	/* setting name */ 'Close button' => 'Aizvēršanas simbols',
	/* help text */    '&quot;Close&quot; symbol. You can enter your own.' => '"Aivēršanas" simbols. Vari ievadīt jebkādu simbolu vai tekstu.',
	/* setting name */ 'Image numbers' => 'Cipari zem attēla',
	/* help text */    'Enables/disables numbers below the image.' => 'Ieslēgt/izslēgt ciparus zem attēla',
	/* setting name */ 'Caption alignment' => 'Paskaidrojuma teksta pozīcija',
	/* help text */    'Positioning of the image caption text.' => 'Paskaidrojuma (caption) teksta pozīcija',
	/* setting subcategory */ 'Image gallery appierance:' => '<strong>Attēlu galerijas izskats:</strong>',
	/* setting name */ 'Auto-rewind gallery slideshow' => 'Atgriezties galerijas uz sākumu',
	/* help text */    'Display the first image after clicking on the last image in galleries that are in slideshow mode.' => 'Radīt pirmo attēlu pēc pēdējā, kad attēli ir slaidrādes režīmā',
	/* setting name */ 'Video player' => 'Video player izskats',
	/* help text */    'Choose between the two visually different players for your video files.' => 'Izvēlies starp diviem dažādiem video player veidiem.',

	/* setting tab */ 'Banners' => 'Banneri',
	/* setting name */ 'Banner image' => 'Banner attēls',
	/* setting name */ 'Banner link' => 'Bannera saite',

	/* setting name */ 'DUKA banner color' => 'DUKAs logotipa krāsa',
	/* help text */    'DUKA banner is always visible on your website. You can, however, choose its color.' => 'DUKAs logotips tavā lapā vienmēr ir redzams, taču tu vari izvēlēties tā krāsu.',
	/* setting value */  'Magenta' => 'Violeta',
	/* setting value */  'Blue' => 'Zila',
	/* setting value */  'Light blue' => 'Gaiši zila',
	/* setting value */  'Cyan' => 'Zili zaļa',
	/* setting value */  'Black' => 'Melna',


	/* setting tab */ 'Other settings' => 'Dažādi',
	/* setting name */ 'Google Analytics ID' => 'Google Analytics ID',
	/* help text */    'The ID of the <a href="http://google.com/analytics" target="_blank">Google Analytics</a> site profile. To obtain an ID, register in <a href="http://google.com/analytics" target="_blank">Google Analytics</a> and create a profile for your site.' => '<a href="http://google.com/analytics" target="_blank">Google Analytics</a> numurs. To var iegūt, ja izmanto Google. Dodies uz <a href="http://google.com/analytics" target="_blank">Google Analytics</a>, lai izveidotu savu profilu un iegūtu savu ID',
	/* setting name */ 'Advanced file uploading enabled' => 'Uzlabotā failu augšup-lādēšana',
	/* help text */    'Set if the advanced uploading features (selecting multiple files at once, asynchronous uploading) are enabled. You should not disable them UNLESS you are experiencing problems with file uploads.' => 'Nodrošina iespēju augšuplēdēt vairākus failus vienlaicīgi. Izvēlies "No" tikai tad, ja ir problēmas ar attēlu augšuplādi.',


	// Translations from entries view (and editing)

	'<p>Congratulations! You have successfully installed Berta.</p><p>Now, before adding your content, you have to create a new section. Go to the <a href="sections.php">sections page</a> and do that!</p>' =>
		'<p>Apsveicam! Esi veiksmīgi izveidojis savu web lapu!</p><p>Pirms pievienot saturu, tev jāizveido jauna sadaļa. Dodies uz <a href="sections.php">sadaļas</a></p>',
	'create new entry here' => 'izveidot jaunu ierakstu',


	// Translations for default template

	/* setting tab */ 'General font settings' => 'Teksta iestatījumi',
	/* setting name */ 'Color' => 'Krāsa',
	/* setting name */ 'Font face' => 'Burtu šrifts',
	/* setting name */ 'Font size' => 'Šritfta izmērs',
	/* setting name */ 'Font weight' => 'Šrifta treknums',
	/* setting name */ 'Font style' => 'Šrifta stils',
	/* setting name */ 'Font variant' => 'Burtu veids',
	/* setting name */ 'Line height' => 'Rindas augstums',
	/* help text */    'Height of text line. Use em, px or % values or the default value "normal"' => 'Attālums starp divu teksta rindiņu pamatnēm. Izmanto "em", "px" vai "%" vienības, kā arī noklusēto vērtību "normal"',

	/* setting tab */ 'Hyperlinks' => 'Saites',
	/* setting name */ 'Link color' => 'Saites krāsa',
	/* setting name */ 'Visited link color' => 'Apciemotas saites krāsa',
	/* setting name */ 'Link color when hovered' => 'Aktīvas (hover) saites krāsa',
	/* setting name */ 'Link color when clicked' => 'Piespiestas (clicked) saites krāsa',
	/* setting name */ 'Link decoration' => 'Saites rotājums',
	/* setting name */ 'Visited link decoration' => 'Apciemotas saites rotājums',
	/* setting name */ 'Link decoration when hovered' => 'Aktīvas (hover) saites rotājums',
	/* setting name */ 'Link decoration when clicked' => 'Piespiestas (clicked) saites rotājums',

	/* setting tab */ 'Background' => 'Fons',
	/* setting name */ 'Background color' => 'Fona krāsa',
	/* setting name */ 'Is background image enabled?' => 'Fona attēls atļauts?',
	/* setting name */ 'Background image' => 'Fona attēls',
	/* help text */    'Picture to use for page background.' => 'Izvēlies fona attēlu',
	/* setting name */ 'Background tiling' => 'Fona atkārtojums',
	/* help text */    'How the background fills the screen?' => 'Kā fons piepilda ekrānu?',
	/* setting name */ 'Background alignment' => 'Fona izkārtojums',
	/* help text */    'Where the background image is positioned?' => 'Fona attēla pozīcija',
	/* setting name */ 'Background position' => 'Fona pozīcija',
	/* help text */    'Sets how background behaves in relation with the browser window.' => 'Kā fona attēls uzvedas, ja tiek mainīts pārlūka loga izmērs',

	/* setting name */ 'Content position' => 'Satura pozīcija',
	/* setting name */ 'Text alignment' => 'Teksta izkārtojums',
	/* setting name */ 'Width of content area' => 'Satura joslas platums',
	/* setting name */ 'Page margins' => 'Lapas apmales',
	/* help text */    'How far the content is from browser edges. Please see the short CSS guide at the bottom of this page.' => '',
	/* setting name */ 'Top menu margins' => 'Menu augšas apmale',
	/* help text */    'How big is the distance from the top menu to the other page elements' => 'Attālums starp galvenās izvēlnes līdz citiem lapas elementiem',

	/* setting tab */ 'Page heading' => 'Lapas virsraksts',
	/* setting name */ 'Header image' => 'Lapas galvenes attēls',
	/* help text */    'Picture to use instead of text.' => 'Attēls, kas tiks izmantots teksta vietā lapas galvenē (header).',
	/* help text */    'How far the heading is form other elements in page. Please see the short CSS guide at the bottom of this page.' => 'Cik tālu lapas galvene (header) atrodas no citiem elementiem. Skaties CSS vērtību skaidrojumu lapas apakšā.',
	/* help text */    'How far the menu is form other elements in page. Please see the short CSS guide at the bottom of this page.' => 'Cik tālu lapas izvēlne atrodas no citiem lapas elementiem. Skaties CSS vērtību skaidrojumu lapas apakšā.',

	/* setting tab */ 'Main menu' => 'Galvenā izvēlne',
	/* setting name */ 'Menu items separator' => 'Izvēlnes atdalošais simbols',
	/* setting name */ 'Space width around separator' => 'Attālums ap atdalošo simbolu',
	/* help text */    'The distance from the separator to the menu item on both sides' => 'Attālums starp atdalītāj-simbolu un izvēlnes vienību',

	/* setting tab */ 'Submenu' => 'Apakšizvēlne',

	/* setting name */ 'Entry margins' => 'Ieraksta apmales',
	/* help text */    'Margins around entries. Please see the short CSS guide at the bottom of this page.' => 'Apmales ap ierakstiem. Lūdzu skatiet CSS skaidrojumu lapas apakšā.',
	/* setting name */ 'Gallery position' => 'Galerijas pozīcija',
	/* setting name */ 'Default gallery type' => 'Galerijas tips pēc noklusēšanas',
	/* help text */    'Slideshow means that an image menu plus only one image is visible at a time. Row means that all images are visible.' => '"Slaidrāde" nozīmē, ka redzams ir attēls ar cipariem, bet "Rindā" nozīmē, ka visi attēli redzami uzreiz rindā.',
	/* setting name */ 'Space between images in row' => 'Attālums starp attēliem rindā',
	/* setting name */ 'Gallery margins' => 'Galerijas apmales',
	/* help text */    'Margin around gallery block' => 'Apmales ap galerijas bloku',
	/* setting name */ 'Display tags by each entry' => 'Rādīt Tagus pie katra ieraksta',
	/* help text */    'This determines whether people will see tags you set for each entry. Regardless of this settting, tags still will make up the main menu.' => 'Nosaka vai rādīt Tagus pie katra ieraksta vai ne. Neatkarīgi no iestatījuma, Tagi būs redzami galvenajā izvēlnē.',
	/* setting name */ 'Date format in entries' => 'Datuma formāts ierakstiem',
	/* setting name */ 'Date separator' => 'Datuma atdalītājs',
	/* help text */    'Separator symbol that divides year, month and day' => 'Simbols, kas atdala gadu, mēnesi un dienu',
	/* setting name */ 'Time separator' => 'Laika ciparu atdalītājsimbols',

	/* setting tab */  'Entry heading'=> 'Iearaksta virsraksts',
	/* help text */    'How far the entry heading is form other elements in page. Please see the short CSS guide at the bottom of this page.' => 'Cik tālu ieraksta virsraksts atrodas no pārējiem lapas elementiem. Skatiet CSS skaidrojumu lapas apakšā.',

	/* setting tab */ 'Entry footer' =>  '',



	// Translations for Messy template

	/* setting name */ 'Entry text width' => 'Ieraksta teksta platums',
	/* setting name */ 'Space between images and image navigation' => 'Attālums starp attēlu un navigācijas elementu',
	/* help text */    'Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode' => 'Vertikālais attālums starp attēlu un navigācijas elementu (zem bildes), kad galerija ir "slaidrādes" režīmā',
	/* setting name */ 'Empty space below gallery' => 'Tukšuma izmērs zem galerijas',
	/* help text */    'Distance between the gallery and the content below' => 'Attālums starp galeriju un saturu zem tā',

	/* setting name */ 'Logo image' => 'Logo attēls',
	/* help text */    'Picture to use instead of header text. Max size: 140 x 400 pixels. If the image is larger, it will be reduced.' => 'Attēls, kas tiek izmantots lapas galvenes teksta vietā. Max izmērs 140 x 400 pikseļi. Ja attēls ir lielāks, tas tiks samazināts.',

	/* setting name */ 'Color when hovered' => 'Izgaismotā elementa krāsa',
	/* help text */    'Color of the element under mouse cursor' => 'Krāsa elementam, kas atrodas zem peles kursora bultiņas',
	/* setting name */ 'Color when selected' => 'Aktīvā elementa krāsa',
	/* help text */    'Color of the element of the currently opened section' => 'Krāsa patlaban atvērtās sadaļas elementam',
	/* setting name */ 'Decoration' => 'Rotājums',
	/* setting name */ 'Decoration when hovered' => 'Izgaismotā elementa rotājums',
	/* setting name */ 'Decoration when selected' => 'Aktīvā elementa rotājums',

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