<?php

return array(

	'berta_copyright_text' => 'Développé avec <a href="http://www.berta.me/" target="_blank" title="Créez votre portfolio avec Berta en quelques minutes !">Berta</a>',

	// Translations from the top "admin" menu

		/* menu item */ 'close this' => 'fermer',
		/* menu item */ 'my site' => 'mon site',
		/* menu item */ 'sections' => 'sections',
		/* menu item */ 'settings' => 'paramètres',
		/* menu item */ 'template design' => 'design des templates',
		/* menu item */ 'profile' => 'profil',
		/* menu item */ 'sign out' => 'se déconnecter',

	// Translatins from login / logout window

		'Logout ok. Please wait...' => 'Déconnexion. Merci de patienter…',
		'Log in' => 'Se connecter',

	// First visit

		'welcome' => 'Bienvenue !',
		'welcome_text__not_installed' => '<h2>Merci d\'avoir choisi Berta !</h2>
		<p>Berta n\'est pas encore installé.<br />Merci de vous <a href="%s">connecter</a> et de suivre la procédure d\'installation.</p>',

		'welcome_text__not_supported' => '<h2>Merci d\'avoir choisi Berta !</h2>
		<p>Ce serveur n\'est pas compatible avec Berta.<br />
		Merci de vérifier que la version de PHP installée sur le serveur est égale ou supérieure à 5.</p>',

		'Setup your site' => 'Paramétrez votre site',
		'setup_info_text' => 'Cliquez sur les champs sur fond jaune pour les éditer.
		Puis, appuyez sur Entrée ou cliquez ailleurs pour enregistrer.
		Chaque élément de votre site ayant un fond jaune est donc modifiable. Vous serez en mesure de changer ces paramètres plus tard.',
		'What is the title of your site?' => 'Quel est le titre de votre site ,',
		'Site title will be visible in all sections of your site.' => 'Le titre du site est visible dans toutes les sections du site',
		'What is your name?' => 'Quel est votre nom ?',
		'Your name will be put in the copyright notice in the footer of yout site. You can leave it blank.' => 'Votre nom sera affiché dans la note de copyright en bas de site. Vous pouvez laisser le champ vide.',
		'How would you — in one sentence — describe your site?' => 'En une phrase, décrivez votre site.',
		'This will appear under your site name as an excerpt in search engine results.' => 'Cela aparaitra en dessous du titre de votre site dans les moteurs de recherche.',
		'Note: the fields that already have value appear yellow only when you roll over them with your mouse. Click on the text below to edit.' => 'À noter : Les champs déjà saisis n’aparaissent en jaune qu’au survol. Cliquez sur le texte survolé pour l’éditer.',
		'Done!' => 'Fait !',


	// Translatins from sections editor (sections.php)

		/* title */ 'Sections' => 'Sections',
		/* column */ 'Title as displayed in main menu' => 'Titre affiché dans le menu principal',
		/* column */ 'Type' => 'Type',
		/* column */ 'Details' => 'Détails',
		/* column */ 'Is published?' => 'Publié ?',
		/* column */ 'Delete' => 'Supprimer',
		/* button */ 'create new section' => 'créer une nouvelle section',
		/* button */ 'delete' => 'supprimer',

		'What are sections?' => 'Que sont les sections ?',
		'sections_help_text' => 'Les sections sont les principales divisions de votre site. Elles servent à contenir et organiser votre contenu. Chaque section est accessible dans le menu principal. ',
		'What is the "external link"?' => 'Qu’est-ce qu’un « lien externe » ?',
		'external_link_help_text' => 'Si vous désirez qu\'un élément de votre menu principal pointe ailleurs que sur une section de votre site, utilisez le lien externe. Il peut être un lien de type email (ex., <em>mailto:exemple@site.net</em>) ou un lien vers un autre site web (ex. <em>http://www.example.com</em>).',


	// Translations from profile page (profile.php)
		'Profile' => 'Profil',
		'Old password' => 'Ancien mot de passe',
		'New password' => 'Nouveau mot de passe',
		'Retype new password' => 'Confirmez le mot de passe',
		'Change password' => 'Changer le mot de passe',
		'password_help_text' => 'Le mot de passe doit comporter au moins 6 caractères alphanumériques (A-Z, a-z, 0-9).',
		'' => '',

	// Translations from settings page (settings.php)

		/* title */ 'Settings' => 'Paramètres',
		/* title */ 'Template design' => 'Design des templates',
		'These are settings for template' => 'Voici les paramètres des templates',

		'Some help with CSS values' => 'Un peu d’aide avec les propriétés CSS',
		'Units' => 'Unités',
		'units_help_text' => 'Les unités valides pour les valeurs numériques sont : <br /><strong>px</strong> - pixels<br /><strong>em</strong> - 1 em = une longueur de lettre M dans la fonte utilisée<br /><strong>%</strong> - pourcentage en fonction de la taille de la fonte ou de la dimension de l\'élément conteneur (ex. la page).',
		'Margins' => 'Marges',
		'margins_help_text' => 'Se servir des marges est un peu délicat. Utilisez les unités px ou em. Vous pouvez déclarer des marges de 4 façons, en écrivant : <br/><strong>1 valeur</strong> - déclarez la marge du haut, droite, bas et gauche en une seule valeur. Exemple : <em>10px</em>.<br /><strong>2 valeurs</strong> - déclarez la marge de haut et bas avec la première valeur, et gauche et droite avec la seconde valeur. Exemple : <em>0 5px</em>.<br /><strong>3 valeurs</strong> - déclarez la marge de haut avec la première valeur, de gauche et droite avec la seconde valeur et la marge de bas avec la troisième valeur. Exemple : <em>10px 0 20px</em>.<br /><strong>4 valeurs</strong> - déclarez toutes les marges selon l\'ordre suivant: haut, droit, bas, gauche. Exemple : <em>10px 0 20px 2px</em>.',

	// Translations from inc.settings.php

		'Texts in the website' => 'Textes dans le site',
		'Main heading' => 'Titre principal',

		/* setting tab & setting name */ 'Template' => 'Template',
		/* help text */    'Templates are like skins or themes for your site. You can choose one template from the ones installed in your templates folder. To add a new template to this list, upload it to the templates folder via FTP.' => 'Les templates définissent l’apparence de votre site. Vous pouvez choisir un jeu de templates parmi ceux installés dans votre dossier de templates. Pour ajouter un nouveau jeu à cette liste, téléchargez-le dans ce dossier via FTP.',

		/* setting tab */ 'Info' => 'Info',
		/* setting name */ 'Your name' => 'Votre nom',
		/* help text */    'Your name will be put in a meta-tag in the code of your site. You can choose any name ;)' => 'Votre nom sera affiché dans une balise meta au sein du code de votre site. Vous pouvez choisir celui que vous souhaitez ;)',
		/* setting name */ 'Page title (title bar)' => 'Titre de la page',
		/* help text */    'Text that appears in the bowser title bar' => 'Ce texte apparaîtra dans la barre de titre de votre navigateur',
		/* setting name */ '<META> description' => '&lt;META&gt; description',
		/* help text */    'Site description. It should not be longer than one or two sentences.' => 'Description du site. Pas plus d’une ou deux phrases.',
		/* setting name */ '<META> keywords' => '&lt;META&gt; mots-clés',
		/* help text */    'Keywords visible only to search engines. Keywords along with the description can improve your site ranking in search results.' => 'Ces mots-clés ne sont visibles que pour les moteurs de recherche. Associés à la description, ils permettent d’améliorer votre positionnement dans les moteurs.',

		/* setting tab */ 'Navigation' => 'Navigation',
		/* setting name */ 'Is first section visible in menu?' => 'Afficher la première section dans le menu ?',
		/* help text */    'Choose "no" to hide the first section in the main menu. Link from the page title (or header image) will lead to it. NOTE: This setting has no effect, if the section has a submenu; then it is visible at all times.' => 'Choisissez « non » pour masquer la première section. Le lien créé depuis le titre du site (ou l’image d’entête) y mènera. À noter : ce paramètre n’a pas d’effet si la section a un sous-menu ; elle sera alors visible en permanence.',
		/* setting name */ 'Show menu in first section?' => 'Afficher le menu dans la première section ?',
		/* help text */    'Choose "no" to hide the menu in first section.' => 'Choisissez « non » pour masquer le menu dans la première section.',
		/* setting name */ 'Always auto-select a submenu item?' => 'Sélectionner automatiquement un élément du sous-menu ?',
		/* help text */    'Choose "yes" to automatically select the first submenu item when clicking on a menu item. This works only when there is a submenu.' => 'Choisissez « oui » pour sélectionner automatiquement le premier sous-menu en cliquant sur un élément du menu. Ne fonctionne que si un sous-menu existe.',

		/* setting name */ 'Favicon' => 'Favicon',
		/* help text */    'Small picture to display in the address bar of the browser. The file must be in .ICO format and 16x16 pixels big.' => 'L’icône de votre site dans la barre de titre du navigateur. Le fichier doit être au format .ICO et mesurer 16x16 pixels.',
		/* setting name */ 'Grid step' => 'Divisions de la grille',
		/* help text */    'Distance in pixels for snap-to-grid dragging.' => 'La distance en pixels pour le magnétisme de la grille lors du glisser/déposer',

		/* setting tab */  'Entry layout' => 'Entrées',
		/* setting name */ 'Small image width' => 'Largeur des vignettes',
		/* setting name */ 'Small image height' => 'Hauteur des vignettes',
		/* help text */    'Maximum size of a small image (visible if \'Small images\' are switched on in the gallery editor). These settings don\'t affect original image.' => 'Taille maximale des vignettes (visible si « Vignettes » est activé dans l’éditeur de la galerie. Ce paramètre n’affecte pas l’image originale.',
		/* setting name */ 'Large image width' => 'Largeur des grandes images',
		/* setting name */ 'Large image height' => 'Hauteur des grandes images',
		/* help text */    'Maximum size of a large image (visible if \'Large images\' are switched on in the gallery editor). These settings don\'t affect original image.' => 'Taille maximale des grandes images (visible si « Grandes images » est activé dans l’éditeur de la galerie. Ce paramètre n’affecte pas l’image originale.',

		/* setting tab */ 'Media' => 'Média',
		/* setting subcategory */ 'Lightbox settings:' => '<strong>Paramètres Lightbox :</strong>',
		/* setting name */ 'Is enabled by default' => 'Activée par défaut',
		/* help text */    'Enables Lightbox mode for new entries.' => 'Activer le mode Lightbox pour les nouvelles entrées.',
		/* setting name */ 'Background color' => 'Couleur de fond',
		/* help text */    'Color of the Lightbox background layer.' => 'Couleur du calque Lightbox',
		/* setting name */ 'Image frame' => 'Cadre d’image',
		/* help text */    'Enables/Disables a frame around image.' => 'Crée un cadre autour de l’image',
		/* setting name */ 'Close button' => 'Bouton « fermer »',
		/* help text */    '&quot;Close&quot; symbol. You can enter your own.' => 'Symbole pour fermer la Lightbox.',
		/* setting name */ 'Image numbers' => 'Numéros d’image',
		/* help text */    'Enables/disables numbers below the image.' => 'Affiche les numéros sous les images',
		/* setting name */ 'Caption alignment' => 'Alignement de la légende',
		/* help text */    'Positioning of the image caption text.' => 'Positionnement du texte de légende.',
		/* setting subcategory */ 'Image gallery appearance:' => '<strong>Apparence de la galerie d’image :</strong>',
		/* setting name */ 'Auto-rewind gallery slideshow' => 'Slideshow continu',
		/* help text */    'Display the first image after clicking on the last image in galleries that are in slideshow mode.' => 'Affiche la première image après avoir cliqué sur la dernière dans le mode slideshow.',
		/* setting name */ 'Video player' => 'Lecteur vidéo',
		/* help text */    'Choose between the two visually different players for your video files.' => 'Choisissez parmie les deux lecteurs pour la lecture de vos vidéos.',

		/* setting tab */ 'Banners' => 'Bannières',
		/* setting name */ 'Banner image' => 'Image de la bannière',
		/* setting name */ 'Banner link' => 'Lien de la bannière',

		/* setting tab */ 'Language' => 'Langue',
		/* setting name */ 'Interface language' => 'Langue de l’interface',

		/* setting tab */ 'Other settings' => 'Autres paramètres',
		/* setting name */ 'Google Analytics ID' => 'ID Google Analytics',
		/* setting name */ 'Google site verification tag' => 'Balise META de vérification Google',
		/* help text */    'The ID of the Google Analytics site profile (example: <em>UA-1234567-12</em>). To obtain an ID, register in <a href="http://google.com/analytics" target="_blank">Google Analytics</a> and create a profile for your site.' => 'L’identifiant de votre compte Google Analytics (exemple : <em>UA-1234567-12</em>). Pour obtenir un identifiant, enregistrez vous sur <a href="http://google.com/analytics" target="_blank">Google Analytics</a> et créez un profil pour votre site.',
		/* setting name */ 'Advanced file uploading enabled' => 'Activer le mode de téléchargement avancé',
		/* help text */    'Set if the advanced uploading features (selecting multiple files at once, asynchronous uploading) are enabled. You should not disable them UNLESS you are experiencing problems with file uploads.' => 'Activé si les fonctions avancées de téléchargement sont disponibles (multi-fichiers, chargement asynchrone). Ne désactiver que si vous rencontrez des problèmes lors du téléchargement de fichiers.',


	// Translations from entries view (and editing)

		'<p>Congratulations! You have successfully installed Berta.</p><p>Now, before adding your content, you have to create a new section. Go to the <a href="sections.php">sections page</a> and do that!</p>' => '<p>Bravo ! Vous avez bien installé Berta.</p><p>Maintenant, avant d’ajouter du contenu, vous devez créer une première section. Allez à <a href="sections.php">la page sections</a> et faites-le !</p>',
		'create new entry here' => 'ajoutez une entrée ici',
		'create new entry' => 'ajoutez une entrée',


	// Translations for default template

		/* setting tab */ 'General font settings' => 'Paramètres typo',
		/* setting name */ 'Color' => 'Couleur',
		/* setting name */ 'Font face' => 'Famille',
		/* setting name */ 'Font size' => 'Corps',
		/* setting name */ 'Font weight' => 'Graisse',
		/* setting name */ 'Font style' => 'Style',
		/* setting name */ 'Font variant' => 'Variantes',
		/* setting name */ 'Line height' => 'Interligne',
		/* help text */    'Height of text line. Use em, px or % values or the default value "normal"' => 'La hauteur des lignes de texte. Utilisez les unités em, px ou %, ou la valeur par défaut « normal ».',

		/* setting tab */ 'Hyperlinks' => 'Liens',
		/* setting name */ 'Link color' => 'Couleur des liens',
		/* setting name */ 'Visited link color' => 'Couleur des liens visités',
		/* setting name */ 'Link color when hovered' => 'Couleur des liens survolés',
		/* setting name */ 'Link color when clicked' => 'Couleur des liens au click',
		/* setting name */ 'Link decoration' => 'Décoration des liens',
		/* setting name */ 'Visited link decoration' => 'Décoration des liens visités',
		/* setting name */ 'Link decoration when hovered' => 'Décoration des liens au survol',
		/* setting name */ 'Link decoration when clicked' => 'Décoration des liens au click',

		/* setting tab */ 'Background' => 'Arrière plan',
		/* setting name */ 'Background color' => 'Couleur d’arrière plan',
		/* help text */    'IMPORTANT! These settings will be overwritten, if you are using background gallery feature. You access it by clicking "edit background gallery" button in each section.' => 'Important ! Ces paramètres seront surchargés si vous utilisez la fonctionnalité d’image d’arrière plan dans les galeries. Pour y accéder, cliquez sur le bouton « éditez l’image de fond de la galerie » dans chaque section.',
		/* setting name */ 'Is background image enabled?' => 'Activer l’image d’arrière plan ?',
		/* setting name */ 'Background image' => 'Image d’arrière plan',
		/* help text */    'Picture to use for page background.' => 'L’image à utiliser en tant qu’arrière plan.',
		/* setting name */ 'Background tiling' => 'Répéter l’arrière plan ?',
		/* help text */    'How the background fills the screen?' => 'Mode de répétition de l’arrière plan.',
		/* setting name */ 'Background alignment' => 'Position de l’arrière plan',
		/* help text */    'Where the background image is positioned?' => 'Positionnement de l’arrière plan',
		/* setting name */ 'Background position' => 'Comportement de l’arrière plan',
		/* help text */    'Sets how background behaves in relation with the browser window.' => 'Définit le comportement de l’arrière plan par rapport à la fenêtre du navigateur.',

		/* setting name */ 'Background button type' => 'Type de bouton d’arrière plan',
		/* help name */    'Select type for background gallery buttons.' => 'Sélectionnez la couleur des boutons pour les galeries en arrière plan.',

		/* setting name */ 'Content position' => 'Poistion du contenu',
		/* setting name */ 'Text alignment' => 'Alignement du texte',
		/* setting name */ 'Width of content area' => 'Largeur de la zone de contenu',
		/* setting name */ 'Page margins' => 'Marges de la page',
		/* help text */    'How far the content is from browser edges. Please see the short CSS guide at the bottom of this page.' => 'Distance entre le contenu et les limites du navigateur. Référez-vous au guide CSS en bas de page.',
		/* setting name */ 'Top menu margins' => 'Marges du menu supérieur',
		/* help text */    'How big is the distance from the top menu to the other page elements' => 'Distance entre le menu supérieur et les autres éléments de la page.',

		/* setting tab */ 'Page heading' => 'Entête de page',
		/* setting name */ 'Header image' => 'Image d’entête',
		/* help text */    'Picture to use instead of text.' => 'Image à utiliser au lieu du texte',
		/* help text */    'How far the heading is form other elements in page. Please see the short CSS guide at the bottom of this page.' => 'Distance entre l’entête et les autres éléments de la page. Référez-vous au guide CSS en bas de page.',
		/* help text */    'How far the menu is form other elements in page. Please see the short CSS guide at the bottom of this page.' => 'Distance entre le menu  et les autres éléments de la page. Référez-vous au guide CSS en bas de page.',

		/* setting tab */ 'Main menu' => 'Menu principal',
		/* setting name */ 'Menu items separator' => 'Séparateur des éléments de menu',
		/* setting name */ 'Space width around separator' => 'Espacement des séparateurs',
		/* help text */    'The distance from the separator to the menu item on both sides' => 'Distance entre le séparateur et les éléments de menu.',

		/* setting tab */ 'Submenu' => 'Sous-menu',

		/* setting name */ 'Entry margins' => 'Marges',
		/* help text */    'Margins around entries. Please see the short CSS guide at the bottom of this page.' => 'MArges autour de l’entrée. Référez-vous au guide CSS en bas de page.',
		/* setting name */ 'Gallery position' => 'Position de la galerie',
		/* setting name */ 'Default gallery type' => 'Type de galerie par défaut',
		/* help text */    'Slideshow means that an image menu plus only one image is visible at a time. Row means that all images are visible.' => 'Le mode « slideshow » n’affiche qu’une image à la fois. Le mode « row » rend toutes les images visibles.',
		/* setting name */ 'Space between images in row and column' => 'Espace entre les images',
		/* help text */    'Horizontal/vertical space between images when gallery is in "row"/"column" mode' => 'Espace entre les images pquand la galerie est en mode « row » ou « column ».',
		/* setting name */ 'Gallery margins' => 'Marges de la galerie',
		/* help text */    'Margin around gallery block' => 'Marges autour de la galerie',

		/* setting tab */  'Entry heading'=> 'Entête d’entrée',
		/* help text */    'How far the entry heading is form other elements in page. Please see the short CSS guide at the bottom of this page.' => 'Distance entre l’entête de l’entrée et les autres éléments de la page. Référez-vous au guide CSS en bas de page.',

		/* setting tab */ 'Entry footer' =>  'Pied de page',


    // Translations for Mashup template

		/* setting name */ 'First page' => 'Première page',
		/* setting name */ 'Sidebar' => 'Sidebar',
		/* setting tab */  'Page layout' => 'Mise en page',
		/* setting name */ 'Entry text max width' => 'Largeur maximale du texte',
		/* help text */    'Width of texts in the entries. This does not apply to the width of images.' => 'Détermine la largeur maximale des textes. Ne s’applique pas aux images',
		/* setting name */ 'How far content is from page top?' => 'Distance du contenu par rapport au haut de page',
		/* help text */    'The vertical distance between the top of the page and the content area.' => 'Distance verticale entre le haut de page et la zone de contenu.',
		/* setting name */ 'How far content is from sidebar?' => 'Distance entre le contenu et la sidebar',
		/* help text */    'The horizontal distance between the menu and the content area.' => 'Distance horizontale entre le menu et la zone de contenu.',

		/* setting name */ 'Space between entries' => 'Espace entre les entrées',
		/* help text */    'Distance from entry to entry. In pixels.' => 'Distance entre les entrées, en pixels.',

		/* setting name */ 'Width' => 'Largeur',
		/* setting name */ 'Left margin' => 'Marge gauche',
		/* help text */    'How far the sidebar is from the left side of the screen.' => 'Distance entre le menu et la gauche de l’écran.',
		/* setting name */ 'Top padding' => 'Marge supérieure',
		/* help text */    'How far the header is from the top of the screen?' => 'Distance entre l’entête et le haut de l’écran.',
		/* setting name */ 'Space between header and menu' => 'Espace entre l’entête et le menu',
		/* help text */    'How far the menu is from the header text or header image.' => 'Distance entre l’entête (texte ou image) et le menu.',
		/* setting name */ 'Heading text color' => 'Couleur du texte d’entête',
		/* setting name */ 'Is transparent?' => 'Transparent ?',
		/* setting name */ 'Heading font' => 'Typo d’entête',
		/* setting name */ 'Heading font size' => 'Corps',
		/* setting name */ 'Heading font weight' => 'Graisse',
		/* setting name */ 'Heading font style' => 'Style',
		/* setting name */ 'Heading font variant' => 'Variantes',
		/* setting name */ 'Heading line height' => 'Interligne',

		/* setting name */ 'Image size ratio' => 'Ratio de taille d’image',
		/* help text */    'Images in the first page layout will be resized by this ratio. Think of it as percentage, e.g., 0.7 = 70% of the original image size.' => 'Les images dans la mise en page de la première page seront redimensionnée par ce ratio. Envisagez le comme un pourcentage ; 0.7 = 70% de l’image originale.',
		/* setting name */ 'Images have shadows?' => 'Ombres associées aux images ?',
		/* setting name */ 'Images wiggle on mouse-over?' => 'Tremblement des images au survol ?',

		/* setting name */ 'Color when opened' => 'Couleur à l’ouverture',
		/* setting name */ 'Decoration when opened' => 'Décoration à l’ouverture',


    // Translations for White template

		/* setting name */ 'Empty space on top' => 'Espace vide en haut',
		/* setting name */ 'Empty space on bottom' => 'Espace vide en bas',
		/* setting name */ 'How far content is from menu?' => 'Distance entre le contenu et le menu',
		/* setting name */ 'Width of the left column' => 'Largeur de la colonne gauche',


    // Translations for Messy template

		/* setting name */ 'Space between images and image navigation' => 'Distance entre les images et leur barre de navigation',
		/* help text */    'Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode' => 'Espace vertical entre les images et les numéros lorsque la galerie est en mode « slideshow ».',
		/* setting name */ 'Empty space below gallery' => 'Esapce sous la galerie',
		/* help text */    'Distance between the gallery and the content below' => 'Distance entre la galerie et le contenu',

		/* setting name */ 'Logo image' => 'Image d’entête',

		/* setting name */ 'Color when hovered' => 'Couleur au survol',
		/* help text */    'Color of the element under mouse cursor' => 'Couleur de l’élément survolé par la souris.',
		/* setting name */ 'Color when selected' => 'Couleur si sélectionné',
		/* help text */    'Color of the element of the currently opened section' => 'Couleur de l’élément de la section courante.',
		/* setting name */ 'Decoration' => 'Décoration',
		/* setting name */ 'Decoration when hovered' => 'Décoration au survol',
		/* setting name */ 'Decoration when selected' => 'Décoration si sélectionné',

		/* setting name */ 'Thumbnails' => 'Vignettes',
		/* setting name */ 'Thumbnails can be turned on by setting the section type to "Thumbnails enabled" & adding more than 1 images to background gallery.' => 'Les vignettes peuvent être activées en paramétrant le type de la section à « Thumbnails enabled » et en ajoutant plus d’une image à la galerie d’arrière plan. ',
		/* setting name */ 'Thumbnail container width' => 'Largeur de la zone des vignettes',
		/* help text */    'IMPORTANT! This must be set as percentage. i.e. 60%' => 'Important : à spécifier en pourcentages, ex. : 60%',

		'googleFont_description' => 'Tapez le nom d’une fonte Google font. Pour voir les fontes disponibles, rendez-vous sur <a href="http://www.google.com/webfonts" target="_blank">Google web fonts</a>. Attention  – les fontes Google font prennent le dessus sur les fontes système. Laissez le champ vide pour utiliser une fonte système. Exemple : <em>Marvel</em>, <em>Marvel:700italic</em> ou <em>Josefin Slab:700italic</em>',
		'Menu position' => 'Position du menu',
		'Positon X' => 'Position X',
		'Positon Y' => 'Position Y',
		'description_tagsMenu_x' => 'Position X du sous-menu en pixels (ex. 50px)',
		'description_tagsMenu_y' => 'Position Y du sous-menu en pixels (ex. 50px)',

		'description_menu_position' => 'Position du menu',
		'description_banner' => 'Banners are images which are visible in all sections. Use it for buttons or social icons in your site. Displayed image will be half of the original size, full size will be used for hi-res displays.',
		'description_banner_link' => 'N’oubliez pas « http:// » devant les liens de bannière.',
		'description_language' => 'Choisissez votre langue pour l’interface de Berta. Rafraîchissez la page pour pour appliquer les modifications.',
		'Heading position' => 'Position de l’entête',
		'description_heading_position' => 'Position de la description d’entête : fixe (Fixed) ou absolue (Absolute). La position fixe restera toujours en place sur la page, la positions absolue se déplace avec le contenu au défilement.',
		'description_submenu_alwaysopen' => 'Un sous-menu est ouvert lorsqu’un élément de menu est actif.',

		'Submenu is allways open' => 'Le sous-menu est toujours ouvert',
		'Submenu is hidden' => 'Le sous-menu est masqué',
		'mobile_device_detected' => 'Détection des interfaces mobiles',
		'javascript_include' => 'Code javascript qui sera inclus avant la balise &lt;/body&gt;. Pour en savoir plus <a href="https://github.com/berta-cms/berta/wiki/Include-JavaScript-code" target="_blank" title="How to include JavaScript code">visitez notre page consacrée aux inclusions javascript.</a>',
		'description_custom_css' => 'Insérez votre code CSS personnalisé ici. Il surchargera toutes les autres règles précédemment définies. Pour en savoir plus, consultez notre <a href="https://github.com/berta-cms/berta/wiki/Add-custom-CSS" target="_blank">Wiki</a>.',
		'' => '',
		'Custom CSS' => 'CSS perso.',
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