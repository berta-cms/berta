<?php

return [
    'berta_copyright_text' => '<a href="http://www.berta.me/" target="_blank" title="Create your own portfolio with Berta.me in minutes!">Berta.me</a>',

    // Translations from the top "admin" menu

    /* menu item */
    'close this' => 'aizvērt',
    /* menu item */
    'my site' => 'mana berta',
    /* menu item */
    'sections' => 'sadaļas',
    /* menu item */
    'settings' => 'uzstādījumi',
    /* menu item */
    'design' => 'dizains',
    /* menu item */
    'profile' => 'konts',
    /* menu item */
    'log out' => 'izlogoties',

    // Translatins from login / logout window

    'Logout ok. Please wait...' => 'Lūdzu, uzgaidi...',
    'Log in' => 'Ielogoties',

    // First visit

    'welcome' => 'Esi sveicināts!',
    'welcome_text__not_installed' => '<h2>Paldies,<br/>ka izvēlējies Berta.me!</h2>
                                         <p>Berta nav uzstādīta.<br />Lūdzu <a href="%s">ielogojies</a> un seko uzstādīšanas procedūrai.</p>',

    'welcome_text__not_supported' => '<h2>Paldies,<br/>ka izvēlējies Berta.me!</h2>
                                        <p>This server does not meet Berta\'s requirements.<br />
                                        Please check that PHP version 5 or above is installed on the server.</p>',

    'Setup your site' => 'Setup your site',
    'setup_info_text' => 'Dzeltenās krāsas lauki ir labojami. Lai saglabātu ierakstu, nospied ENTER vai klikšķini ārpus datu lauka. Šādi iespējams ievadīt vai labot saturu Berta.me rīkā.',
    'What is the title of your site?' => 'Kāds ir tavas lapas virsraksts?',
    'Site title will be visible in all sections of your site.' => 'Lapas virsraksts būs redzams visās sadaļās',
    'What is your name?' => 'Ievadi savu vārdu',
    'It will appear in the copyright notice in the footer. You may leave it blank.' => 'Vārds tiks pievienots pie (c) simbola lapas apakšā. Lauku var atstāt arī tukšu.',
    'What is this website about?' => 'Lapas apraksts.',
    'It will appear under your site name in search engine results.' => 'Meklētāj-programmās tas parādīsies zem tavas lapas nosaukuma kā apraksts.',
    'Note: the fields that already have value appear yellow only when you roll over them with your mouse. Click on the text below to edit.' => 'Piezīme: aizpildītie lauki kļūst dzelteni tiem uzbraucot ar peles kursoru. Klikšķini uz teksta zemāk, lai labotu.',
    'Done!' => 'Darīts!',

    // Translatins from sections editor (sections.php)

    /* title */
    'Sections' => 'Sadaļas',
    /* column */
    'Title as displayed in main menu' => 'Nosaukums (galvenajā izvēlnē)',
    /* column */
    'Type' => 'Veids',
    /* column */
    'Details' => 'Uzstādījumi',
    /* column */
    'Is published?' => 'Publicēts?',
    /* column */
    'Delete' => 'Dzēst',
    /* button */
    'create new section' => 'izveidot jaunu sadaļu',
    /* button */
    'delete' => 'dzēst',

    'What are sections?' => 'Kas ir sadaļas?',
    'sections_help_text' => 'Sadaļas ir lapas pamatelementi un to nosaukumi veido galveno izvēlni (menu).',
    'What is the "external link"?' => 'Kas ir "external link" (ārējā saite)?',
    'external_link_help_text' => 'Izvēlnes elements var būt ārējā saite. Piemēram epasta adrese <em>mailto:sombeody@someplace.net</em>) vai saite uz citu mājas lapu (piemēram, <em>http://www.example.com</em>)',

    // Translations from profile page (profile.php)
    'Profile' => 'Profils',
    'Old password' => 'Vecā parole',
    'New password' => 'Jaunā parole',
    'Retype new password' => 'Jaunā parole vēlreiz',
    'Change password' => 'Nomainīt paroli',
    'password_help_text' => 'Parolei jābūt vismaz 6 simbolus garai<br /> un tai jāsatur tikai lielie/mazie latīņu burti un/vai cipari (A-Z, a-z, 0-9).',
    '' => '',

    // Translations from settings page (settings.php)

    /* title */
    'Settings' => 'Uzstādījumi',
    /* title */
    'Design' => 'Dizains',
    'These are settings for template' => 'Šie ir uzstādījumi veidnei',

    'Some help with CSS values' => 'CSS vērtību skaidrojums',
    'Units' => 'Vienības',
    'units_help_text' => 'Var izmantot sekojošas vienības: <br /><strong>px</strong> – pikseļi<br /><strong>em</strong> - 1 em = viena burta M platums attiecīgajā šriftā<br /><strong>%</strong> - procenti no šrifta izmēra vai arī procenti no konteinera elementa izmēra',
    'Margins' => 'Malas',
    'margins_help_text' => 'Ir 4 veidi kā var ievadīt izmēru apmalēm (margins):<br/><strong>1 vērtība</strong> – iestāda augšējo, labo, apakšējo un kreiso apmales platumu vienādā izmērā. Piemēram, <em>10px</em>.<br /><strong>2 vērtības</strong> – pirmais cipars iestāda augšējo un apakšējo apmales platumu, bet otrs kreiso un labo malas platumu. Piemēram: <em>0 5px</em>.<br /><strong>3 vērtības</strong> – pirmā vērtība iestāda augšējās apmales platumu, otra kreiso un labo apmali, bet trešā apakšas apmales platumu. Piemēram: <em>10px 0 20px</em>.<br /><strong>4 vērtības</strong> - iestāda platumus visām apmalēm sekojošā secībā: augša, labā mala, apakša, kreisā apmale. Piemēram: <em>10px 0 20px 2px</em>',

    // Translations from inc.settings.php

    'Texts in the website' => 'Teksti lapā',
    'Site heading' => 'Lapas virsraksts',

    /* setting tab & setting name */
    'Template' => 'Veidne',
    /* help text */
    'Templates are like skins or themes for your site. You can choose one template from the ones installed in your templates folder. To add a new template to this list, upload it to the templates folder via FTP.' => 'Veidnes ir "ādiņas" jeb tēmas, kuras izmaina lapas elementu izvietojumu un izskatu.',

    /* setting tab */
    'Info' => 'Vispārīgi',
    /* setting name */
    'Your name' => 'Tavs vārds',
    /* help text */
    'Your name will be put in a meta-tag in the code of your site. You can choose any name ;)' => 'Tavs vārds tiks saglabāts meta-tagā lapas kodā. Vārds var būt jebkāds.',
    /* setting name */
    'Page title (title bar)' => 'Lapas virsraksts',
    /* help text */
    'Text that appears in the bowser title bar' => 'Teksts, kas redzams pārlūka loga augšpusē',
    /* setting name */
    '<META> description' => '<META> apraksts',
    /* help text */
    'Site description. It should not be longer than one or two sentences.' => 'Lapas apraksts. Tam nevajadzētu pārsniegt 2 teikumus.',
    /* setting name */
    '<META> keywords' => '<META> atslēgvārdi',
    /* help text */
    'Keywords visible only to search engines. Keywords along with the description can improve your site ranking in search results.' => 'Atslēgvārdi ir redzami tikai meklētājiem, tādiem kā Google. Tie var uzlabot tavas lapas pozīciju meklēšanas rezultātos. Vēlams, lai tie ir atbilstoši lapas saturam.',

    /* setting tab */
    'Navigation' => 'Navigācija',
    /* setting name */
    'Is first section visible in menu?' => 'Vai pirmā sadaļa redzama galvenajā izvēlnē (menu)?',
    /* help text */
    'Choose "no" to hide the first section in the main menu. Link from the page title (or header image) will lead to it. NOTE: This setting has no effect, if the section has a submenu; then it is visible at all times.' => 'Izvēlies "No", ja vēlies, lai pirmā sadaļa nav redzama. Uz sadaļu varēs nokļūt tikai atverot lapu vai uzklikšķinot uz lapas logo. Ņem vērā, ka iestatījums nedarbojas, ja šai sadaļai ir apakšizvēlnes (Tagi).',
    /* setting name */
    'Show menu in first section?' => 'Rādīt izvēlni pirmajā sadaļā?',
    /* help text */
    'Choose "no" to hide the menu in first section.' => 'Izvēlies "No", lai paslēptu izvēlni pirmajā sadaļā.',
    /* setting name */
    'Always auto-select a submenu item?' => 'Automātiski izvēlēties pirmo apakšizvēlni?',
    /* help text */
    'Choose "yes" to automatically select the first submenu item when clicking on a menu item. This works only when there is a submenu.' => 'Izvēlies "Yes" un pēc izvēlnes iezīmēšanas automātiski tiks izvēlēta apakšizvēlne.',
    /* setting name */
    'Enable navigation to page top' => 'Atļaut navigāciju uz lapas sākumu',
    /* help text */
    'Shows navigation button at the bottom when page is scrolled.' => 'Rāda navigācijas pogu, kad lapa tiek ritināta.',

    /* setting name */
    'Favicon' => 'Favicon',
    /* help text */
    'Small picture to display in the address bar of the browser. The file must be in PNG format and 180x180 pixels big.' => '180x180 pikseļu attēls, kurš atrodams pretī adrešu laukam pārlūkprogrammā. Failam jābūt PNG formātā.',
    /* setting name */
    'Grid step' => 'Režģa solis',
    /* help text */
    'Distance in pixels for snap-to-grid dragging.' => 'Režģa rūtiņas izmērs pikseļos. Ja lielāks par 1, tad elementi pielips pie šī neredzamā režģa (snap to grid).',

    /* setting tab */
    'Entry layout' => 'Ieraksta izskats',

    /* setting name */
    'Small image width' => 'Mazā attēla platums',
    /* setting name */
    'Small image height' => 'Mazā attēla augstums',
    /* help text */
    'Maximum size of a small image (visible if \'Small images\' are switched on in the gallery editor). These settings don\'t affect original image.' => 'Maksimālais mazā attēla izmērs. Tas būs redzams, kad galerijas redaktorā tiks ieslēgts "Mazās bildes"',
    /* setting name */
    'Medium image width' => 'Vidējā attēla platums',
    /* setting name */
    'Medium image height' => 'Vidējā attēla augstums',
    /* help text */
    'Maximum size of a medium image (visible if \'Medium images\' are switched on in the gallery editor). These settings don\'t affect original image.' => 'Maksimālais vidējā attēla izmērs. Tas būs redzams, kad galerijas redaktorā tiks ieslēgts "Vidējās bildes"',
    /* setting name */
    'Large image width' => 'Lielā attēla platums',
    /* setting name */
    'Large image height' => 'Lielā attēla augstums',
    /* help text */
    'Maximum size of a large image (visible if \'Large images\' are switched on in the gallery editor). These settings don\'t affect original image.' => 'Maksimālais mazā attēla izmērs. Tas būs redzams, kad galerijas redaktorā tiks ieslēgts "Lielās bildes"',

    /* setting tab */
    'Media' => 'Media',
    /* setting subcategory */
    'Gallery fullscreen settings:' => 'Galerijas pilnekrāna iestatījumi:',
    /* setting name */
    'Is enabled by default' => 'Pēc noklusējuma ieslēgts',
    /* help text */
    'Enables gallery fullscreen mode for new entries.' => 'Ieslēdz galerijas pilnekrāna režīmu jauniem ierakstiem.',
    /* setting name */
    'Background color' => 'fona krāsa',
    /* help text */
    'Color of the fullscreen gallery background.' => 'Galerijas pilnekrāna fona krāsa.',
    /* setting name */
    'Image numbers' => 'Cipari zem attēla',
    /* help text */
    'Enables fullscreen gallery slide numbers.' => 'Ieslēgt pilnekrāna galerijas slaidu numurus.',
    /* setting name */
    'Caption alignment' => 'Paskaidrojuma teksta pozīcija',
    /* help text */
    'Positioning of the image caption text.' => 'Paskaidrojuma (caption) teksta pozīcija',
    /* setting subcategory */
    'Image gallery appearance:' => 'Attēlu galerijas izskats:',
    /* setting name */
    'Slideshow loop mode' => 'Slaidrādes atkārtošanas režīms',
    /* setting name */
    'Show slideshow image numbers' => 'Rādīt slaidrādes attēlu nummurus',
    /* help text */
    'Set the default state of image number visibility in slideshow galleries.' => 'Nosaka, vai pēc noklusējuma rādīt attēlu nummurus slaidrādes galerijām, vai nē.',
    /* setting name */
    'Video player' => 'Video player izskats',
    /* help text */
    'Choose between the two visually different players for your video files.' => 'Izvēlies starp diviem dažādiem video player veidiem.',

    /* setting tab */
    'Banners' => 'Banneri',
    /* setting name */
    'Banner image' => 'Bannera attēls',
    /* setting name */
    'Banner link' => 'Bannera saite',

    /* setting tab */
    'Language' => 'Lokalizācija',
    /* setting name */
    'Interface language' => 'Valoda',

    /* setting tab */
    'Other settings' => 'Dažādi',

    // Translations from entries view (and editing)

    '<p>Congratulations! You have successfully installed Berta.</p><p>Now, before adding your content, you have to create a new section. Go to the <a href="sections.php">sections page</a> and do that!</p>' => '<p>Apsveicam! Esi veiksmīgi izveidojis savu web lapu!</p><p>Pirms pievienot saturu, tev jāizveido jauna sadaļa. Dodies uz <a href="sections.php">sadaļas</a></p>',
    'create new entry here' => 'izveidot jaunu ierakstu',
    'create new entry' => 'izveidot jaunu ierakstu',

    // Translations for default template

    /* setting tab */
    'General font settings' => 'Teksta iestatījumi',
    /* setting name */
    'Color' => 'Krāsa',
    /* setting name */
    'Font face' => 'Burtu šrifts',
    /* setting name */
    'Font size' => 'Šritfta izmērs',
    /* setting name */
    'Font weight' => 'Šrifta treknums',
    /* setting name */
    'Font style' => 'Šrifta stils',
    /* setting name */
    'Font variant' => 'Burtu veids',
    /* setting name */
    'Line height' => 'Rindas augstums',
    /* help text */
    'Height of text line. Use em, px or % values or the default value "normal"' => 'Attālums starp divu teksta rindiņu pamatnēm. Izmanto "em", "px" vai "%" vienības, kā arī noklusēto vērtību "normal"',

    /* setting tab */
    'Hyperlinks' => 'Saites',
    /* setting name */
    'Link color' => 'Saites krāsa',
    /* setting name */
    'Visited link color' => 'Apciemotas saites krāsa',
    /* setting name */
    'Link color when hovered' => 'Aktīvas (hover) saites krāsa',
    /* setting name */
    'Link color when clicked' => 'Piespiestas (clicked) saites krāsa',
    /* setting name */
    'Link decoration' => 'Saites rotājums',
    /* setting name */
    'Visited link decoration' => 'Apciemotas saites rotājums',
    /* setting name */
    'Link decoration when hovered' => 'Aktīvas (hover) saites rotājums',
    /* setting name */
    'Link decoration when clicked' => 'Piespiestas (clicked) saites rotājums',

    /* setting tab */
    'Background' => 'Fons',
    /* setting name */
    'Background color' => 'Fona krāsa',
    /* help text */
    'IMPORTANT! These settings will be overwritten, if you are using background gallery feature. You access it by clicking "edit background gallery" button in each section.' => 'UZMANĪBU! Šie uzstādījumi netiek ņemti vērā, ja tiek lietota fona galerija.',
    /* setting name */
    'Is background image enabled?' => 'Fona attēls atļauts?',
    /* setting name */
    'Background image' => 'Fona attēls',
    /* help text */
    'Picture to use for page background.' => 'Izvēlies fona attēlu',
    /* setting name */
    'Background tiling' => 'Fona atkārtojums',
    /* help text */
    'How the background fills the screen?' => 'Kā fons piepilda ekrānu?',
    /* setting name */
    'Background alignment' => 'Fona izkārtojums',
    /* help text */
    'Where the background image is positioned?' => 'Fona attēla pozīcija',
    /* setting name */
    'Background position' => 'Fona pozīcija',
    /* help text */
    'Sets how background behaves in relation with the browser window.' => 'Kā fona attēls uzvedas, ja tiek mainīts pārlūka loga izmērs',

    /* setting name */
    'Background button type' => 'Fona pogu tips',
    /* help name */
    'Select type for background gallery buttons.' => 'Izvēlies tipu fona galerijas pogām',

    /* setting name */
    'Content position' => 'Satura pozīcija',
    /* setting name */
    'Text alignment' => 'Teksta izkārtojums',
    /* setting name */
    'Width of content area' => 'Satura joslas platums',
    /* setting name */
    'Page margins' => 'Lapas apmales',
    /* help text */
    'How far the content is from browser edges.' => 'Kāds ir attālums no lapas satura līdz pārlūkprogrammas malām.',
    /* setting name */
    'Top menu margins' => 'Izvēlnes augšas apmale',
    /* help text */
    'How big is the distance from the top menu to the other page elements' => 'Attālums starp galvenās izvēlnes līdz citiem lapas elementiem',

    /* setting tab */
    'Page heading' => 'Lapas virsraksts',
    /* setting name */
    'Header image' => 'Lapas galvenes attēls',
    /* help text */
    'Picture to use instead of text.' => 'Attēls, kas tiks izmantots teksta vietā lapas galvenē (header).',
    /* help text */
    'How far the heading is from other elements in page.' => 'Cik tālu lapas galvene (header) atrodas no citiem elementiem.',
    /* help text */
    'How far the menu is form other elements in page.' => 'Cik tālu lapas izvēlne atrodas no citiem lapas elementiem.',

    /* setting tab */
    'Main menu' => 'Galvenā izvēlne',
    /* setting name */
    'Menu items separator' => 'Izvēlnes atdalošais simbols',
    /* setting name */
    'Space width around separator' => 'Attālums ap atdalošo simbolu',
    /* help text */
    'The distance from the separator to the menu item on both sides' => 'Attālums starp atdalītāj-simbolu un izvēlnes vienību',

    /* setting tab */
    'Submenu' => 'Apakšizvēlne',

    /* setting name */
    'Entry margins' => 'Ieraksta apmales',
    /* help text */
    'Margins around entries.' => 'Apmales ap ierakstiem. Lūdzu skatiet CSS skaidrojumu lapas apakšā.',
    /* setting name */
    'Gallery position' => 'Galerijas pozīcija',
    /* setting name */
    'Default gallery type' => 'Galerijas tips pēc noklusēšanas',
    /* help text */
    'Slideshow means that an image menu plus only one image is visible at a time. Row means that all images are visible.' => '"Slaidrāde" nozīmē, ka redzams ir attēls ar cipariem, bet "Rindā" nozīmē, ka visi attēli redzami uzreiz rindā.',
    /* setting name */
    'Space between images in row and column' => 'Attālums starp attēliem rindā un kolonnā',
    /* help text */
    'Horizontal/vertical space between images when gallery is in "row"/"column" mode' => 'Horizontālais/vertikālais attālums starp attēliem "row"/"column" režīmos',
    /* setting name */
    'Gallery margins' => 'Galerijas apmales',
    /* help text */
    'Margin around gallery block' => 'Apmales ap galerijas bloku',

    /* setting tab */
    'Entry heading' => 'Ieraksta virsraksts',
    /* help text */
    'How far the entry heading is form other elements in page.' => 'Cik tālu ieraksta virsraksts atrodas no pārējiem lapas elementiem. Skatiet CSS skaidrojumu lapas apakšā.',

    /* setting tab */
    'Entry footer' => 'Ieraksta apakša',

    // Translations for Mashup template

    /* setting name */
    'First page' => 'Pirmā lapa',
    /* setting name */
    'Sidebar' => 'Sānjosla',
    /* setting tab */
    'Page layout' => 'Lapas izskats',
    /* setting name */
    'Entry text max width' => 'Ieraksta teksta maksimālais platums',
    /* help text */
    'Width of texts in the entries. This does not apply to the width of images.' => 'Teksta platums ierakstos.',
    /* setting name */
    'How far content is from page top?' => 'Lapas satura attālums no lapas augšas.',
    /* help text */
    'The vertical distance between the top of the page and the content area.' => 'Vertikālais attālums no lapas augšas līdz lapas saturam.',
    /* setting name */
    'How far content is from sidebar?' => 'Lapas satura attālums no sānjoslas.',
    /* help text */
    'The horizontal distance between the menu and the content area.' => 'Horizontālais attālums starp galveno izvēlni un lapas saturu.',

    /* setting name */
    'Space between entries' => 'Attālums starp ierakstiem',
    /* help text */
    'Distance from entry to entry. In pixels.' => 'Attālums no ieraksta līdz ierakstam. Pikseļos.',

    /* setting name */
    'Width' => 'Platums',
    /* setting name */
    'Left margin' => 'Attālums no kreisās malas',
    /* help text */
    'How far the sidebar is from the left side of the screen.' => 'Cik tālu sānjosla atrodas no ekrāna kreisās malas?',
    /* setting name */
    'Top padding' => 'Attālums no augšas',
    /* help text */
    'How far the header is from the top of the screen?' => 'Cik tālu sānjosla atrodas no ekrāna augšas?',
    /* setting name */
    'Space between header and menu' => 'Attālums starp galveni un galveno izvēlni',
    /* help text */
    'How far the menu is from the header text or header image.' => 'Cik tālu galvenā izvēlne atrodas no galvenes teksta vai attēla?',
    /* setting name */
    'Heading text color' => 'Galvenes teksta krāsa',
    /* setting name */
    'Is transparent?' => 'Ir caurspīdīga?',
    /* setting name */
    'Heading font' => 'Galvenes burtu šrifts',
    /* setting name */
    'Heading font size' => 'Galvenes burtu izmērs',
    /* setting name */
    'Heading font weight' => 'Galvenes burtu treknums',
    /* setting name */
    'Heading font style' => 'Galvenes burtu stils',
    /* setting name */
    'Heading font variant' => 'Galvenes burtu veids',
    /* setting name */
    'Heading line height' => 'Galvenes rindas augstums',

    /* setting name */
    'Image size ratio' => 'Attēla izmēra attiecība',
    /* help text */
    'Images in the first page layout will be resized by this ratio. Think of it as percentage, e.g., 0.7 = 70% of the original image size.' => 'Attēlu izmēri pirmās lapas izkārtojumā tiks izmainīti pēc šīs attiecības. Piemēram, 0.7 = 70% no sākotnējā izmēra.',
    /* setting name */
    'Images have shadows?' => 'Attēliem ir ēnas?',
    /* setting name */
    'Images wiggle on mouse-over?' => 'Attēli izkustas uz tiem uzbraucot ar peli?',

    /* setting name */
    'Color when opened' => 'Atvērtā elementa krāsa',
    /* setting name */
    'Decoration when opened' => 'Atvērtā elementa rotājums',

    // Translations for White template

    /* setting name */
    'Empty space on top' => 'Tukša vieta izvēlnes augšpusē',
    /* setting name */
    'Empty space on bottom' => 'Tukša vieta izvēlnes apakšpusē',
    /* setting name */
    'How far content is from menu?' => 'Cik tālu lapas saturs atrodas no galvenās izvēlnes?',
    /* setting name */
    'Width of the left column' => 'Kreisās kolonnas platums',

    // Translations for Messy template

    /* setting name */
    'Space between images and image navigation' => 'Attālums starp attēlu un navigācijas elementu',
    /* help text */
    'Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode' => 'Vertikālais attālums starp attēlu un navigācijas elementu (zem bildes), kad galerija ir "slaidrādes" režīmā',
    /* setting name */
    'Empty space below gallery' => 'Tukšuma izmērs zem galerijas',
    /* help text */
    'Distance between the gallery and the content below' => 'Attālums starp galeriju un saturu zem tā',

    /* setting name */
    'Logo image' => 'Logo attēls',

    /* setting name */
    'Color when hovered' => 'Izgaismotā elementa krāsa',
    /* help text */
    'Color of the element under mouse cursor' => 'Krāsa elementam, kas atrodas zem peles kursora bultiņas',
    /* setting name */
    'Color when selected' => 'Aktīvā elementa krāsa',
    /* help text */
    'Color of the element of the currently opened section' => 'Krāsa patlaban atvērtās sadaļas elementam',
    /* setting name */
    'Decoration' => 'Rotājums',
    /* setting name */
    'Decoration when hovered' => 'Izgaismotā elementa rotājums',
    /* setting name */
    'Decoration when selected' => 'Aktīvā elementa rotājums',

    /* setting name */
    'Thumbnails' => 'Sīktēli',
    /* setting name */
    'Thumbnails can be turned on by setting the section type to "Thumbnails enabled" & adding more than 1 images to background gallery.' => 'Sīktēli var tikt ieslēgti iestatot sadaļas tipu kā "Thumbnails enabled" un pievienojot vairāk kā vienu bildi fona galerijai.',
    /* setting name */
    'Thumbnail container width' => 'Sīktēlu konteinera platums',
    /* help text */
    'IMPORTANT! This must be set as percentage. i.e. 60%' => 'UZMANĪBU! Šim parametram jābūt ievadītam kā procentiem. Piemēram, 60%',

    'googleFont_description' => 'Ieraksti google fonta nosaukumu. Apskati kādi fonti ir piejami: <a href="https://fonts.google.com" target="_blank">Google Fonts</a>. Ja izvēlēts google fonts, tad sistēmas fonti netiks ņemti vērā. Piemērs: <em>Marvel</em>, <em>Marvel:700italic</em> vai <em>Josefin Slab:700italic</em>',
    'Menu position' => 'Izvēlnes pozīcija',
    'Positon X' => 'X pozīcija',
    'Positon Y' => 'Y pozīcija',
    'description_tagsMenu_x' => 'Apakšizvēlnes X pozīcija pikseļos (piem.: 50px)',
    'description_tagsMenu_y' => 'Apakšizvēlnes Y pozīcija pikseļos (piem.: 50px)',
    'description_menu_position' => 'Izvēlnes pozicionēšana',
    'description_banner' => 'Banners are images which are visible in all sections. Use it for buttons or social icons in your site. Displayed image will be half of the original size, full size will be used for hi-res displays.',
    'description_banner_link' => 'Bannera saite. Adreses priekšā neaizmirsti pievienot http:// (piem.: http://www.berta.me)',
    'description_language' => 'Izvēlies interfeisa valodu.',
    'Heading position' => 'Galvenes pozīcija',
    'description_heading_position' => 'Galvenes novietojums, fiksēts vai nefiksēts',
    'description_submenu_alwaysopen' => 'Apakšizvēlnes ir vienmēr atvērtas.',
    'Submenu is allways open' => 'Apakšizvēlne vienmēr atvērta',
    'Submenu is hidden' => 'Apakšizvēlnes slēptas',
    'mobile_device_detected' => 'Labot lapas saturu ar šo mobilo ierīci nav iespējams!',
    'javascript_include' => 'Javascript kods, kurš tiks iekļauts tieši pirms &lt;/body&gt; elementa. Uzzini vairāk kā <a href="https://github.com/berta-cms/berta/wiki/Include-JavaScript-code" target="_blank" title="How to include JavaScript code">iekļaut JavaScript kodu.</a>',
    'description_custom_css' => 'Ievietojiet savu CSS kodu šeit. Iepriekš eksistējošas CSS definīcijas tiks pārrakstītas. Vairāk informācijai apskatiet mūsu <a href="https://github.com/berta-cms/berta/wiki/Add-custom-CSS" target="_blank">WIKI</a>.',

    // Videos panel & newsticker
    'To enable Berta\'s tutorial videos, your computer needs to be connected to the internet!<br />When the internet access is enabled, sign out of engine panel and log in again to view the videos.' => 'Lai skatītu Bertas pamācību video, Jūsu datoram nepieciešama interneta pieeja.<br />Kad dators pieslēgts pie interneta, izlogojieties no <em>engine</em> paneļa un ielogojieties no jauna.',
    'Show this window on startup' => 'Vienmēr rādīt šo logu pēc ielogošanās',
    'Close' => 'Aizvērt',

    'To enable Berta\'s news ticker, your computer needs to be connected to the internet!' => 'Lai redzētu Bertas jaunumus, Jūsu datoram nepieciešama interneta pieeja!',

    // shop translations
    'Shop' => 'Veikals',
    'shop' => 'veikals',
    'Inventory' => 'Noliktava',
    'Regional costs' => 'Reģionālās izmaksas',
    'Item name' => 'Vienības nosaukums',
    'Price' => 'Cena',
    'price' => 'cena',
    'In stock' => 'Noliktavā',
    'Reservation' => 'Rezervēts',
    'if weight is less than' => 'ja svars ir mazāks par',
    'weight' => 'svars',
    'then price is' => 'tad cena ir',
    'region name' => 'reģiona nosaukums',
    'vat' => 'pvn',
    '+ add new costs condition' => '+ pievienot jaunu izmaksu nosacījumu',
    '+ add new region' => '+ pievienot jaunu reģionu',
    'Save' => 'Saglabāt',
    'Configuration values' => 'Konfigurācijas vērtības',
    'Shop currency' => 'Veikala valūta',
    'Currency abbreviation or symbol displayed by all prices in the site.' => 'Valūtas abreviatūra vai simbols, kurš redzams pie preces cenas.',
    'Order Email Subject' => 'Tēmas nosaukums e-pastam',
    'Subject of order email' => 'Tēmas nosaukums e-pastam pie pasūtījuma veikšanas.',
    'Seller details' => 'Tirgotāja rekvizīti',
    'Seller details will be included in bill and e-mail message' => 'Tirgotāja rekvizīti tiks iekļauti rēķinā un e-pasta saturā.',
    'Add to basket' => 'Pievienot grozam',
    'Add to basket text' => 'Pogas "Pievienot grozam" nosaukums.',
    'Out of stock' => 'Noliktavā nav',
    'Out of stock text' => 'Paziņojuma "Noliktavā nav" teksts.',
    'Email' => 'e-pasts',
    'Email where send order data' => 'e-pasts, uz kuru sūtīt pasūtījuma datus.',
    'Payment method' => 'Maksājuma metode',
    'Payment method.' => 'Maksājuma metode.',
    'Promo code' => 'Atlaides kods',
    'If Yes - promo code entry will be displayed.' => 'Ja lauciņš ir aizpildīts, tad pircējam būs iespēja ievadīt atlaides kodu.',
    'Promo code discount' => 'Atlaides apjoms',
    'Discount in precents when user enters valid promo code' => 'Atlaides procentuāls apjoms uz precēm, ja pircējs ievadījis pareizu kodu.',
    'Weight units' => 'Svara mērvienība',
    'Weight units (g, oz) used for postage cost calculation.' => 'Svara mērvienība (g, oz), kas tie lietota pie pasta izdevumu aprēķina.',
    'Design' => 'Dizains',
    'Shop entry width' => 'Veikala ieraksta platums',
    'Title' => 'Virsraksts',
    'What is SEO?' => 'Kas ir SEO?',
    'seo_help_text' => 'Search Engine Optimization (SEO) palīdz uzlabot mājaslapas reitingu Google meklēšanas rezultātos. <a href="https://support.google.com/webmasters/answer/35624" target="_blank">Uzzini vairāk, kā tas strādā</a>.',
    'Keywords' => 'Atslēgvārdi',
    'Content description' => 'Satura apraksts',
    'section_type' => 'Veids',
    'section_type_tip' => 'Nosaka sadaļas funkcionalitāti un satura izklājumu.',
    'select_on' => 'Ieslēgts',
    'select_off' => 'Izslēgts',
    'shuffle_marked' => 'Rādīt ierakstus un galerijas jauktā secībā',
    'entries_limit' => 'Ierakstu ierobežojums',
    'entries_limit_tip' => 'Cik ierakstus rādīt šajā sadaļā.',
];
