<?php

return array(

	'berta_copyright_text' => 'Gemaakt met <a href="http://www.berta.me/" target="_blank" title="Maak snel jouw eigen site met">Berta</a>',

	// Translations from the top "admin" menu

		/* menu item */ 'close this' => 'sluiten',
		/* menu item */ 'my site' => 'mijn site',
		/* menu item */ 'sections' => 'sections',
		/* menu item */ 'settings' => 'instellingen',
		/* menu item */ 'template design' => 'template design',
		/* menu item */ 'profile' => 'profiel',
		/* menu item */ 'sign out' => 'uitloggen',

	// Translatins from login / logout window

		'Logout ok. Please wait...' => 'Uitloggen. Wacht even A.U.B.…',
		'Log in' => 'Inloggen',

	// First visit

		'welcome' => 'Welkom!',
		'welcome_text__not_installed' => '<h2>Goed dat je Berta gebruikt!</h2>
		<p>Berta is nog niet geconfigureerd.<br /><a href="./engine/">Log in</a> en volg de set up procedure.</p>',

		'welcome_text__not_supported' => '<h2>Goed dat je Berta gebruikt!</h2>
		<p>Deze server voldoet helaas niet aan Berta\'s minimum eisen.<br />
										PHP versie 5 of hoger moet op de server geinstalleerd zijn.</p>',

		'Setup your site' => 'Richt jouw site in',
		'setup_info_text' => 'Klik op de geelgekleurde velden om deze te editen.
							Om te bewaren toets Enter of klik buiten het geelgekleurde veld.
							Dit werkt zo door de hele site; alles met een gele achtergrondkleur is editable. Je kan deze instellingen later ook veranderen.',
		'What is the title of your site?' => 'Wat is de titel (naam) van jouw site?',
		'Site title will be visible in all sections of your site.' => 'De titel (naam) van jouw site is zichtbaar in alle Sections van jouw site.',
		'What is your name?' => 'Wat is jouw naam?',
		'Your name will be put in the copyright notice in the footer of yout site. You can leave it blank.' => 'Jouw naam wordt in de copyright-notice onderin (in de footer) het beeld gezet. Je mag dit ook leeg laten.',
		'How would you — in one sentence — describe your site?' => 'Hoe zou je -in één zin- jouw site beschrijven?',
		'This will appear under your site name as an excerpt in search engine results.' => 'Dit zal verschijnen als samenvatting onder de sitenaam in de (Google) zoekresultaten.',
		'Note: the fields that already have value appear yellow only when you roll over them with your mouse. Click on the text below to edit.' => 'Tip: de velden die al een waarde hebben verschijnen alleen als gele velden als je eroverheen gaat met je cursor . Klik op[ onderstaande tekst om deze aan te passen.',
		'Done!' => 'Klaar!',


	// Translatins from sections editor (sections.php)

		/* title */ 'Sections' => 'Sections',
		/* column */ 'Title as displayed in main menu' => 'Titel zoals die in het hoofdmenu verschijnt',
		/* column */ 'Type' => 'Type',
		/* column */ 'Details' => 'Details',
		/* column */ 'Is published?' => 'is het gepubliceerd?',
		/* column */ 'Delete' => 'Delete',
		/* button */ 'create new section' => 'Maak nieuwe Section',
		/* button */ 'delete' => 'Delete',

		'What are sections?' => 'Wat zijn Sections?',
		'sections_help_text' => 'Sections zijn de grootste of grofste onderverdelingen in jouw site. Je kan ze zien als containers voor jouw content (beeld, tekst, video). Sections verschijnen dus menu-items in het main menu.',
		'What is the "external link"?' => 'Wat is een external link?',
		'external_link_help_text' => 'Als je een menu item een link naar een andere site wilt laten zijn moet je de externe link exact ingeven. Dit kan een email link zijn (bijv., <em>mailto:somebody@someplace.net</em>) of een link naar een andere website (bijv. <em>http://www.artez.nl</em>).',


	// Translations from profile page (profile.php)
		'Profile' => 'Profiel',
		'Old password' => 'Oud wachtwoord',
		'New password' => 'Nieuw wachtwoord',
		'Retype new password' => 'Bevestig nieuw wachtwoord',
		'Change password' => 'Verander wachtwoord',
		'password_help_text' => 'Het wachtwoord moet tenminste 6 karakters bevatten<br /> en alphanumerieke (A-Z, a-z, 0-9) karakters, maar geen leestekens zoals *&%$?.:;/, en ook geen spaties.',
		'' => '',

	// Translations from settings page (settings.php)

		/* title */ 'Settings' => 'Instellingen',
		/* title */ 'Template design' => 'Template Design',
		'These are settings for template' => 'Dit zijn de instellingen voor de Template',

		'Some help with CSS values' => 'Hulp met CSS waarden (units)',
		'Units' => 'Units',
		'units_help_text' => 'Correcte Units (eenheden) om numerieke waarden in te geven zijn:<br /><strong>px</strong> - pixels. Voorbeeld: <em>10px</em>. Als je alleen nummers invoert veranderen de waarden NIET.<br /><strong>em</strong> - 1em = een breedte van de letter M in het gebruikte font. Voorbeeld: <em>1em</em><br /><strong>%</strong> - procent van de fontsize of procent van de afmetingen van het container element (bijv. the page etc.)',
		'Margins' => 'Margins',
		'margins_help_text' => 'Margins kunnen lastig zijn. Gebruik px of em als units. Je kan op 4 manieren margins aangeven, door in te geven:<br/><strong>1 waarde</strong> - zet top, right, bottom en left margins naar dezelfde waarde. Voorbeeld: <em>10px</em>.<br /><strong>2 waarden</strong> - zet top en bottom margins naar de eerste waarde, left en right - naar de tweede. Voorbeeld: <em>0 5px</em>.<br /><strong>3 waarden</strong> - zet top margin naar de eerste waarde, left en right - naar de tweede, bottom - naar de derde waarde. Voorbeeld: <em>10px 0 20px</em>.<br /><strong>4 waarden</strong> - zet alle margins in deze volgorde: top, right, bottom, left. Voorbeeld: <em>10px 0 20px 2px</em>.',

	// Translations from inc.settings.php

		'Texts in the website' => 'Tekst in de website',
		'Main heading' => 'Heading titel',

		/* setting tab & setting name */ 'Template' => 'Template',
		/* help text */    'Templates are like skins or themes for your site. You can choose one template from the ones installed in your templates folder. To add a new template to this list, upload it to the templates folder via FTP.' => 'Templates zijn als een Theme of Skin voor jouw site. Je kan een Template kiezen uit degene die in jouw Templates folder zijn geinstalleerd (Settings>Templates). Om zelf een nieuwe Template toe te voegen aan deze lijst moet je die uploaden via FTP.',

		/* setting tab */ 'Info' => 'Info',
		/* setting name */ 'Your name' => 'Jouw naam',
		/* help text */    'Your name will be put in a meta-tag in the code of your site. You can choose any name ;)' => 'Jouw naam zal worden toegevoegd in een meta-tag in de code van jouw site. Je kan elke naam kiezen die je maar wilt ;)',
		/* setting name */ 'Page title (title bar)' => 'Paginatitel',
		/* help text */    'Text that appears in the bowser title bar' => 'Tekst die verschijnt in de bowser title bar',
		/* setting name */ '<META> description' => '&lt;META&gt; description',
		/* help text */    'Short site description. It should not be longer than one or two sentences.' => 'Site beschrijving. Gebruik hiervoor niet meer dan twee regels',
		/* setting name */ '<META> keywords' => '&lt;META&gt; keywords',
		/* help text */    'Keywords visible only to search engines. Keywords along with the description can improve your site ranking in search results.' => 'Keywords die alleen zichtbaar zijn voor zoekmachines. Het gebruik van keywords, samen met de description (beschrijving) van jouw site kunnen ervoor zorgen dat je beter via zoekmachines vindbaar bent.',

		/* setting tab */ 'Navigation' => 'Navigatie',
		/* setting name */ 'Is first section visible in menu?' => 'Is de eerste Section zichtbaar in het menu?',
		/* help text */    'Choose "no" to hide the first section in the main menu. Link from the page title (or header image) will lead to it. NOTE: This setting has no effect, if the section has a submenu; then it is visible at all times.' => 'Kies "no" om de eerste Section in het menu te verbergen. Zet een Link op de titelpagina (beeld of tekst) om hier naar toe te linken. Let op: deze instelling heeft geen effect als de sction een submenu heeft: dat is deze altijd zichtbaar.',
		/* setting name */ 'Show menu in first section?' => 'Toon menu in de eerste Section?',
		/* help text */    'Choose "no" to hide the menu in first section.' => 'Kies "no" om het menu in de eerste Section te verbergen.',
		/* setting name */ 'Always auto-select a submenu item?' => 'Altijd automatisch een submenu-item selecteren?',
		/* help text */    'Choose "yes" to automatically select the first submenu item when clicking on a menu item. This works only when there is a submenu.' => 'Kies "yes" om automatisch het eerste submenu-item te selecteren als je op een menu-item klikt. Dit werkt alleen als er een submenu-item is.',

		/* setting name */ 'Favicon' => 'Favicon',
		/* help text */    'Small picture to display in the address bar of the browser. The file must be in .ICO format and 16x16 pixels big.' => 'Kleine afbeelding die in de adressbar van de browser zichtbaar is. Het bestand moet in .ICO formaat en 16 x 16 pixels groot zijn.',
		/* setting name */ 'Grid step' => 'Grid Step',
		/* help text */    'Distance in pixels for snap-to-grid dragging.' => 'De afstand in pixels om gebruik te maken van het snap-to-grid systeem.',

		/* setting tab */  'Entry layout' => 'Entry Layout',
		/* setting name */ 'Small image width' => 'Small image breedte',
		/* setting name */ 'Small image height' => 'Small image hoogte',
		/* help text */    'Maximum size of a small image (visible if \'Small images\' are switched on in the gallery editor). These settings don\'t affect original image.' => 'De maximale afmeting van een "small image" (zichtbaar als "small images" in de gallery editor aanstaat).Deze instelling zal de afmeting van de originele afbeelding niet beinvloeden.',
		/* setting name */ 'Large image width' => 'Large image breedte',
		/* setting name */ 'Large image height' => 'Large image hoogte',
		/* help text */    'Maximum size of a large image (visible if \'Large images\' are switched on in the gallery editor). These settings don\'t affect original image.' => 'De maximale afmeting van een "large image" (zichtbaar als "large images" in de gallery editor aanstaat).Deze instelling zal de afmeting van de originele afbeelding niet beinvloeden.',

		/* setting tab */ 'Media' => 'Media',
		/* setting subcategory */ 'Lightbox settings:' => '<strong>Lightbox instellingen :</strong>',
		/* setting name */ 'Is enabled by default' => 'Staat default aan',
		/* help text */    'Enables Lightbox mode for new entries.' => 'Zet Lightbox mode voor nieuwe Entries aan.',
		/* setting name */ 'Background color' => 'Background color',
		/* help text */    'Color of the Lightbox background layer.' => 'Color van de Lightbox background laag.',
		/* setting name */ 'Image frame' => 'Image frame',
		/* help text */    'Enables/Disables a frame around image.' => 'Zet frame om image heen aan/uit',
		/* setting name */ 'Close button' => 'Close button',
		/* help text */    '&quot;Close&quot; symbol. You can enter your own.' => 'Symbool of tekst om de lightbox te sluiten. Je kan hier jouw eigen tekst of symbool invoegen',
		/* setting name */ 'Image numbers' => 'Image numbers',
		/* help text */    'Enables/disables numbers below the image.' => 'Zet de nummering onder de afbeeldingen aan/uit',
		/* setting name */ 'Caption alignment' => 'Caption alignment',
		/* help text */    'Positioning of the image caption text.' => 'Positionering van de image caption tekst.',
		/* setting subcategory */ 'Image gallery appearance:' => '<strong>Image gallery appearance:</strong>',
		/* setting name */ 'Auto-rewind gallery slideshow' => 'Slideshow loop',
		/* help text */    'Display the first image after clicking on the last image in galleries that are in slideshow mode.' => 'Toon de eerste afbeelding na het klikken op de laatste afbeelding van een gallery in slideshow mode.',
		/* setting name */ 'Show slideshow image numbers' => 'Show slideshow image numbers',
		/* help text */    'Set the default state of image number visibility in slideshow galleries.' => 'Zijn de image numbers zichtbaar in de slide show?',
		/* setting name */ 'Video player' => 'Video player',
		/* help text */    'Choose between the two visually different players for your video files.' => 'Maak hier een keuze tussen twee qua uiterlijk verschillende videoplayers voor jouw videobestanden.',





		/* setting tab */ 'Banners' => 'Banners',
		/* setting name */ 'Banner image' => 'Banner image',
		/* setting name */ 'Banner link' => 'Banner link',


/* setting tab */ 'HTML code' => 'HTML code',
/*setting name*/ 'Paste or write your HTML code here.' => 'Plak of schrijf jouw HTML code hier.',
/* setting tab */ 'Javascript code' => 'Javascript code',
/*setting name*/ 'Paste or write your Javascript code here.' => 'Plak of schrijf jouw Javascript code hier.',
/* setting tab */ 'Location' => 'Plaatsing',
/*setting name*/ 'Location of social media buttons. Content of addition text or addition footer will be replaced.' => 'Plaatsing van  de social media buttons. De inhoud van additional text of additional footer text wordt door deze inhoud vervangen.',
/* setting tab */ 'Show videos on startup' => 'Toon videos bij opstarten',
/*setting name*/ 'Show or hide Berta\'s tutorial videos on startup. To view the videos, set this to \'Yes\' and they will appear next time you log in.' => 'Vertoon of verberg videos bij opstarten. Om de videos te tonen kies je "yes" en ze verschijnen de volgende keer dat je weer inlogt.',

		/* setting tab */ 'Language' => 'Taal',
		/* setting name */ 'Interface language' => 'Interface taal',

		/* setting tab */ 'Other settings' => 'Andere instellingen',
		/* setting name */ 'Google Analytics ID' => 'ID Google Analytics',
		/* setting name */ 'Google site verification tag' => 'Google site verification tag',
		/* help text */    'The ID of the <a href="http://google.com/analytics" target="_blank">Google Analytics</a> site profile. To obtain an ID, register in <a href="http://google.com/analytics" target="_blank">Google Analytics</a> and create a profile for your site.' => 'De ID van de Google Analytics site profile (bijvoorbeeld: <em>UA-1234567-12</em>). Om een eigen ID te krijgen moet je je hier  <a href="http://google.com/analytics" target="_blank">Google Analytics</a> registreren en een profiel aanmaken voor jouw site.',
		/* setting name */ 'Advanced file uploading enabled' => 'Advanced file upload aanzetten',
		/* help text */    'Set if the advanced uploading features (selecting multiple files at once, asynchronous uploading) are enabled. You should not disable them UNLESS you are experiencing problems with file uploads.' => 'Dit staat standaard aan. Hiermee kun je meerdere bestanden uploaden of asynchroon uploaden. Niet uitzetten tenzij je problemen met uploaden hebt.',


	// Translations from entries view (and editing)

		'<p>Congratulations! You have successfully installed Berta.</p><p>Now, before adding your content, you have to create a new section. Go to the <a href="sections.php">sections page</a> and do that!</p>' => '<p>Gefeliciteerd! Berta is geinstalleerd.</p><p>Voor dat je content gaat toevoegen, moet je eerst een Section maken. Ga naar de<a href="sections.php">pagina om dit te doen</a> Nu aan de gang!</p>',
		'create new entry here' => 'maak hier een nieuwe entry',
		'create new entry' => 'maak een nieuwe entry',


	// Translations for default template

		/* setting tab */ 'General font settings' => 'Algemene font settings',
		/* setting name */ 'Color' => 'Color',
		/* setting name */ 'Font face' => 'Font face',
		/* setting name */ 'Font size' => 'Font size',
		/* setting name */ 'Font weight' => 'Bold',
		/* setting name */ 'Font style' => 'Italic',
		/* setting name */ 'Font variant' => 'SmallCaps',
		/* setting name */ 'Line height' => 'Line height',
		/* help text */    'Height of text line. Use em, px or % values or the default value "normal"' => 'Ruimte tussen de regels tekst. Gebruik de units (eenheden) em, px of %, of de standaard waarde « normal ».',

		/* setting tab */ 'Hyperlinks' => 'Links',
		/* setting name */ 'Link color' => 'Link color',
		/* setting name */ 'Visited link color' => 'Visited link color',
		/* setting name */ 'Link color when hovered' => 'Link color when hovered',
		/* setting name */ 'Link color when clicked' => 'Link color when clicked',
		/* setting name */ 'Link decoration' => 'Link decoration',
		/* setting name */ 'Visited link decoration' => 'Visited link decoration',
		/* setting name */ 'Link decoration when hovered' => 'Link decoration when hovered',
		/* setting name */ 'Link decoration when clicked' => 'Link decoration when clicked',

		/* setting tab */ 'Background' => 'Background',
		/* setting name */ 'Background color' => 'Background color',
		/* help text */    'IMPORTANT! These settings will be overwritten, if you are using background gallery feature. You access it by clicking "edit background gallery" button in each section.' => 'Belangrijk! Deze instellingen worden overschreven als je de background gallery gebruikt. Je kan deze openen met de "edit background" button rechtbovenin je scherm in elke Section.',
		/* setting name */ 'Is background image enabled?' => 'Is de background image geactiveerd?',
		/* setting name */ 'Background image' => 'Background image',
		/* help text */    'Picture to use for page background.' => 'Afbeelding die je als Background wilt gebruiken.',
		/* setting name */ 'Background tiling' => 'Background Tilen (herhalen in tegelpatroon) ?',
		/* help text */    'How the background fills the screen?' => 'Hoe vult de Background het scherm? Horizontaal, verticaal of allebei?',
		/* setting name */ 'Background alignment' => 'Alignment van de Background.',
		/* help text */    'Where the background image is positioned?' => 'Waar is de Background Image gepositioneerd?',
		/* setting name */ 'Background position' => 'Background position',
		/* help text */    'Sets how background behaves in relation with the browser window.' => 'Hoe gedraagt de Background zich in  relatie tot de browser?.',

		/* setting name */ 'Background button type' => 'Background button type',
		/* help name */    'Select type for background gallery buttons.' => 'Selecteer type voor background buttons.',
		/* setting name */ 'Centered layout' => 'Centered layout',
		/* help name */    'Sets whether layout should be centered or not.' => 'Is de layout gecentreerd of juist niet?',

		/* setting name */ 'Centered content width' => 'Centered content breedte',
		/* help name */    'Content width if layout is centered.' => 'Breedte van de content als deze gecentreerd is.',
		/* setting name */ 'Centered content width' => 'Centering guides kleurschema',
		/* help name */    'Color tone for centering guides (dark for bright background colors, bright for dark background colors).' => 'Kleurschema voor de centering guides (dark voor heldere backgroundcolors, bright voor donkere backgroundcolors).',

		/* setting name */ 'Content position' => 'Content position',
		/* setting name */ 'Text alignment' => 'Text alignment',
		/* setting name */ 'Width of content area' => 'Breedte van de content area',
		/* setting name */ 'Page margins' => 'Page Margins',
		/* help text */    'How far the content is from browser edges. Please see the short CSS guide at the bottom of this page.' => 'Afstand tot de randen van de browser. Lees voor meer informatie de verkorte CSS gids onderaan deze pagina.',
		/* setting name */ 'Top menu margins' => 'Top menu margins',
		/* help text */    'How big is the distance from the top menu to the other page elements' => 'Wat is de afstand van het Top menu tot de andere Page Elements?',

		/* setting tab */ 'Page heading' => 'Page heading',
		/* setting name */ 'Header image' => 'Header image',
		/* help text */    'Picture to use instead of text.' => 'Image Die je wilt gebruiken in plaats van tekst.',
		/* help text */    'How far the heading is form other elements in page. Please see the short CSS guide at the bottom of this page.' => 'Hoe ver is de heading van de andere elementen verwijderd? Zie ook korte CSS gids onderaan de pagina.',
		/* help text */    'How far the menu is form other elements in page. Please see the short CSS guide at the bottom of this page.' => 'Hoe ver is het menu van de andere elementen verwijderd? Zie ook korte CSS gids onderaan de pagina.',

		/* setting tab */ 'Main menu' => 'Main menu',
		/* setting name */ 'Menu items separator' => 'Separator (leesteken) tussen de menu-items',
		/* setting name */ 'Space width around separator' => 'Ruimte rond Separator',
		/* help text */    'The distance from the separator to the menu item on both sides' => 'Afstand van separator tot menu-items aan beide kanten.',

		/* setting tab */ 'Submenu' => 'Submenu',

		/* setting name */ 'Entry margins' => 'Margins (marges)',
		/* help text */    'Margins around entries. Please see the short CSS guide at the bottom of this page.' => 'Margins rond entries. Zie ook korte CSS gids onderaan de pagina.',
		/* setting name */ 'Gallery position' => 'Gallery positie',
		/* setting name */ 'Default gallery type' => 'Standaard gallery type',
		/* help text */    'Slideshow means that an image menu plus only one image is visible at a time. Row means that all images are visible.' => 'Slideshow betekent dat een image menu plus alleen maar een image zichtbaar is. Row betekent dat alle images zichtbaar zijn.',
		/* setting name */ 'Space between images in row and column' => 'Ruimte tussen images in row en column',
		/* help text */    'Horizontal/vertical space between images when gallery is in "row"/"column" mode' => 'De horizontale/verticale ruimte tussen de images als de gallery in "Row"/"Column" mode staat.',
		/* setting name */ 'Gallery margins' => 'Gallery margins (marges)',
		/* help text */    'Margin around gallery block' => 'Margin rond gallery block',
		/* setting name */ 'Display tags by each entry' => 'Toon tags bij elke entry',
		/* help text */    'This determines whether people will see tags you set for each entry. Regardless of this settting, tags still will make up the main menu.' => 'Hiermee toon/verberg je de tags die je voor elke entry aanmaakt. Onafhankelijk van deze setting zal het menu uit tags worden samengesteld.',
		/* setting name */ 'Date format in entries' => 'Datum format in entries',
		/* setting name */ 'Date separator' => 'Datum separator',
		/* help text */    'Separator symbol that divides year, month and day' => 'Separator symbool dat jaar, maand en dag scheidt.',
		/* setting name */ 'Time separator' => 'Tijd separator',

		/* setting tab */  'Entry heading'=> 'Entry heading',
		/* help text */    'How far the entry heading is form other elements in page. Please see the short CSS guide at the bottom of this page.' => 'Hoe ver is de entry heading van de andere elementen in de pagina verwijderd? Zie ook korte CSS gids onderaan de pagina.',

		/* setting tab */ 'Entry footer' =>  'Entry footer',


    // Translations for Mashup template

		/* setting name */ 'First page' => 'Eerste pagina',
		/* setting name */ 'Sidebar' => 'Sidebar',
		/* setting tab */  'Page layout' => 'Page Layout',
		/* setting name */ 'Entry text max width' => 'Maximale breedte van entry tekst',
		/* help text */    'Width of texts in the entries. This does not apply to the width of images.' => 'Breedte van de teksten in de entries. Is niet van toepassing op de breedte van de pagina',
		/* setting name */ 'How far content is from page top?' => 'Hoe ver staat de content van de top af?',
		/* help text */    'The vertical distance between the top of the page and the content area.' => 'Verticale afstand van de top van de pagina tot content area.',
		/* setting name */ 'How far content is from sidebar?' => 'Hoever is de content van de sidebar verwijderd?',
		/* help text */    'The horizontal distance between the menu and the content area.' => 'Horizontale afstand tussen menu en content area.',

		/* setting name */ 'Space between entries' => 'Ruimte tussen de Entries',
		/* help text */    'Distance from entry to entry. In pixels.' => 'Ruimte tussen entries, in pixels.',

		/* setting name */ 'Width' => 'Width',
		/* setting name */ 'Left margin' => 'Left margin',
		/* help text */    'How far the sidebar is from the left side of the screen. This gets ignored, if centered layout is enabled.' => 'Hoever is de sidebar van de linkerkant van het scherm verwijderd? Dit is niet van toepassing als "centered layout" aan staat.',
		/* setting name */ 'Top padding' => 'Top padding',
		/* help text */    'How far the header is from the top of the screen?' => 'Hoever de header van de bovenkant van het scherm verwijderd is.',
		/* setting name */ 'Space between header and menu' => 'Ruimte tussen header en menu',
		/* help text */    'How far the menu is from the header text or header image.' => 'Hoe ver is het menu van de header tekst of header image verwijderd?',
		/* setting name */ 'Heading text color' => 'Heading text color',
		/* setting name */ 'Is transparent?' => 'Transparant ?',
		/* setting name */ 'Heading font' => 'Heading font',
		/* setting name */ 'Heading font size' => 'Heading font size',
		/* setting name */ 'Heading font weight' => 'Bold',
		/* setting name */ 'Heading font style' => 'Italic',
		/* setting name */ 'Heading font variant' => 'SmallCaps',
		/* setting name */ 'Heading line height' => 'Heading line height',

		/* setting name */ 'Image size ratio' => 'Image size ratio',
		/* help text */    'Images in the first page layout will be resized by this ratio. Think of it as percentage, e.g., 0.7 = 70% of the original image size.' => 'Images op de eerste pagina worden geschaald naar deze verhouding. Zie het als een percentage: 0.7 = 70% van de oorspronkelijke image size.',
		/* setting name */ 'Images have shadows?' => 'Hebben de images een schaduw?',
		/* setting name */ 'Images wiggle on mouse-over?' => 'Wiebelen de images bij mouse-over?',

		/* setting name */ 'Color when opened' => 'Kleur indien open',
		/* setting name */ 'Decoration when opened' => 'Decoration indien open (underline, overline, etc.)',


    // Translations for White template

		/* setting name */ 'Empty space on top' => 'Lege ruimte bovenin',
		/* setting name */ 'Empty space on bottom' => 'Lege ruimte onderin',
		/* setting name */ 'How far content is from menu?' => 'Afstand van de content tot het menu',
		/* setting name */ 'Width of the left column' => 'Breedte van de linkerkolom',


    // Translations for Messy template

		/* setting name */ 'Space between images and image navigation' => 'Afstand tussen de images en de image navigatie',
		/* help text */    'Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode' => 'Verticale ruimte tussen afbeeldingen en afbeeldingsnavigatie (de cijfers onder de afbeelding) als de gallery in "slideshow" mode staat.',
		/* setting name */ 'Empty space below gallery' => 'Lege ruimte onder de gallery',
		/* help text */    'Distance between the gallery and the content below' => 'Afstand tussen de gallery en de content er onder',

		/* setting name */ 'Logo image' => 'Logo image',
		/* help text */    'Picture to use instead of header text. Max size: 140 x 400 pixels. If the image is larger, it will be reduced.' => 'Afbeelding die je gebruikt in plaats van de header tekst. Maximale afmeting is 140 x 400 pixels. Als de afbeelding groter is wordt deze kleiner gemaakt.',

		/* setting name */ 'Color when hovered' => 'Color bij mouse-over',
		/* help text */    'Color of the element under mouse cursor' => 'Color van het element onder de cursor.',
		/* setting name */ 'Color when selected' => 'Color bij selectie',
		/* help text */    'Color of the element of the currently opened section' => 'Color van de section die geselecteerd is.',
		/* setting name */ 'Decoration' => 'Decoration',
		/* setting name */ 'Decoration when hovered' => 'Decoration bij mouse-over',
		/* setting name */ 'Decoration when selected' => 'Decoration indien geselecteerd',

		/* setting name */ 'Thumbnails' => 'Thumbnails',
		/* setting name */ 'Thumbnails can be turned on by setting the section type to "Thumbnails enabled" & adding more than 1 images to background gallery.' => 'Thumbnails kunnen worden aangezet door het Section Type naar "Thumbnails enabled" te zetten en meer dan een image aan de background gallery toe te voegen.',
		/* setting name */ 'Thumbnail container width' => 'Thumbnail container breedte',
		/* help text */    'IMPORTANT! This must be set as percentage. i.e. 60%' => 'Belangrijk! Dit moet als percentage worden ingevoerd, bijv. 60%',

		'googleFont_description' => 'Type of copy/paste een Google font naam. Beschikbare fonts vind je hier: <a href="http://www.google.com/webfonts" target="_blank">Google web fonts</a>. Let op: Google font overschrijft systeem font. Vakje leeglaten als je een systeem font wilt gebruiken. Voorbeeld: <em>Marvel</em>, <em>Marvel:700italic</em> of <em>Josefin Slab:700italic</em>',
		'Menu position' => 'Menu position',
		'Positon X' => 'Positie X',
		'Positon Y' => 'Positie Y',
		'description_tagsMenu_x' => 'Submenu X positie in pixels (bijv. 10px)',
		'description_tagsMenu_y' => 'Submenu Y positie in pixels (bijv. 10px)',
		'description_menu_position' => 'Menu positie',
		'description_banner' => 'Banners zijn images die in alle Sections zichtbaar zijn. Gebruik deze voor buttons of social icons in jouw site',
		'description_banner_link' => 'Banner link \'http://\' moet zich voor het adres bevinden',
		'description_language' => 'Kies hier de taal van de Berta interface. Refresh site om toe te passen.',
		'Heading position' => 'Heading positie fixed of absolute. Fixed blijft altijd op dezelfde plaats, absolute beweegt mee met de content.',
		'description_heading_position' => 'Heading positie fixed of absolute. Fixed blijft altijd op dezelfde plaats, absolute beweegt mee met de content.',
		'description_submenu_alwaysopen' => 'Submenu is open als het menu item geselecteerd is.',

		'Submenu is allways open' => 'Submenu is altijd open',
		'Submenu is hidden' => 'Submenu is verborgen',
		'mobile_device_detected' => 'Je kan op jouw mobiele telefoon de site NIET editen! Jammer!',
		'javascript_include' => 'Javascript code invoegen voor closing &lt;/body&gt; element. Leer hier meer over <a href="https://github.com/berta-cms/berta/wiki/Include-JavaScript-code" target="_blank" title="How to include JavaScript code">include JavaScript code</a>.',
		'description_custom_css' => 'Plak jouw custom CSS code hier. Bestaande CSS definities worden overschreven. Voor meer informatie ga naar onze <a href="https://github.com/berta-cms/berta/wiki/Add-custom-CSS" target="_blank">WIKI</a>.',
		'' => '',
		'Custom CSS' => 'Custom CSS.',
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

		);


?>