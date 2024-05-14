<?php

return [
    'berta_copyright_text' => '<a href="http://www.berta.me/" target="_blank" title="Stwórz swój własny portfel z Berta.me w kilka minut!">Berta.me</a>',

    // Translations from the top "admin" menu

    /* menu item */ 'close this' => 'zamknąć',
    /* menu item */ 'my site' => 'moja berta',
    /* menu item */ 'sections' => 'działy',
    /* menu item */ 'settings' => 'ustawienia',
    /* menu item */ 'design' => 'wygląd',
    /* menu item */ 'profile' => 'mój profil',
    /* menu item */ 'log out' => 'wylogować się',

    // Translatins from login / logout window

    'Logout ok. Please wait...' => 'Proszę, czekać...',
    'Log in' => 'Zalogować się',

    // First visit

    'welcome' => 'Witamy!',
    'welcome_text__not_installed' => '<h2>Dziękujemy,<br/>że wybrałeś Berta.me!</h2>
                                                          <p>Berta nie jest zainstalowana.<br />Proszę <a href="%s">zaloguj się</a> i przejdź proces instalacji.</p>',

    'welcome_text__not_supported' => '<h2>Dziękujemy,<br/>że wybrałeś Berta.me!</h2>
                                                                <p>This server does not meet Berta\'s requirements.<br />
                                                                   Please check that PHP version 5 or above is installed on the server.</p>',

    'Setup your site' => 'Setup your site',
    'setup_info_text' => 'Click on the fields with yellow background to edit them.
                                      Then press Enter or click anywhere outside the field to save.
                                       This way it will be throughout your site — all that has a yellow background is editable. You will also be able to change these settings later.',
    'What is the title of your site?' => 'Jaki jest tytuł twojej strony?',
    'Site title will be visible in all sections of your site.' => 'Tytuł strony będzie widoczny w każdym dziale',
    'What is your name?' => 'Wprowadź swoje imię',
    'It will appear in the copyright notice in the footer. You may leave it blank.' => 'Imię będzie dodane do symbolu (c) na dole strony. Pole można również zostawić puste.',
    'What is this website about?' => 'Jak byś opisał swoją stronę w jednym zdaniu?',
    'It will appear under your site name in search engine results.' => 'To pojawi się w wyszukiwarce pod tytułem twojej strony jako opis.',
    'Note: the fields that already have value appear yellow only when you roll over them with your mouse. Click on the text below to edit.' => 'Uwaga: wypełnione pole stają się żółte przy najechaniu na nich kursorem myszki. Klikaj na tekście poniżej, aby poprawiać.',
    'Done!' => 'Wykonane!',

    // Translatins from sections editor (sections.php)

    /* title */ 'Sections' => 'Działy',
    /* column */ 'Title as displayed in main menu' => 'Tytuł (w głównym menu)',
    /* column */ 'Type' => 'Typ',
    /* column */ 'Details' => 'Ustawienia',
    /* column */ 'Is published?' => 'Publikowany?',
    /* column */ 'Delete' => 'Kasować',
    /* button */ 'create new section' => 'stworzyć nowy dział',
    /* button */ 'delete' => 'kasować',

    'What are sections?' => 'Co to są działy?',
    'sections_help_text' => 'Działy są podstawowe elementy strony i ich tytuły tworzą główne menu.',
    'What is the "external link"?' => 'Co to jest "external link" (link zewnētrzny)?',
    'external_link_help_text' => 'Elementem menu może być link zewnętrzny. Na przykład, adres e-mail <em>mailto:sombeody@someplace.net</em>) lub link do innej strony internetowej (na przykład, <em>http://www.example.com</em>)',

    // Translations from profile page (profile.php)
    'Profile' => 'Profil',
    'Old password' => 'Stare hasło',
    'New password' => 'Nowe hasło',
    'Retype new password' => 'Powtórz hasło',
    'Change password' => 'Zmienić hasło',
    'password_help_text' => 'Hasło musi mieć przynajmniej 6 symboli <br /> oraz zawierać jedynie duże/małe litery łaciny i/lub cyfry (A-Z, a-z, 0-9).',
    '' => '',

    // Translations from settings page (settings.php)

    /* title */ 'Settings' => 'Ustawienia',
    /* title */ 'Design' => 'Projekt',
    'These are settings for template' => 'Te są ustawienia projektu',

    'Some help with CSS values' => 'Objaśnienia wartości CSS',
    'Units' => 'Jednostki',
    'units_help_text' => 'Można wykorzystywać następujące jednostki: <br /><strong>px</strong> – piksele<br /><strong>em</strong> - 1 em = szerokość jednej litery M w odpowiedniej czcionce<br /><strong>%</strong> - procenty od rozmiaru czcionki lub procenty od rozmiaru elementu kontenera',
    'Margins' => 'Krawędzie',
    'margins_help_text' => 'Są 4 sposoby jak można ustawić rozmiar dla krawędzi (margins):<br/><strong>1 wartość</strong> – ustala szerokość krawędzi górnej, prawej, dolnej i lewej w takich samych wartościach. Na przykład, <em>10px</em>.<br /><strong>2 wartość</strong> – Pierwsza cyfra ustala szerokość krawędzi górnej i dolnej, druga – szerokość krawędzi lewej i prawej.  Na przykład: <em>0 5px</em>.<br /><strong>3 jednostki</strong> – pierwsza wartość ustala szerokość górnej krawędzi, druga – lewej i prawej krawędzi, i trzecia – szerokość dolnej krawędzi. Na przykład: <em>10px 0 20px</em>.<br /><strong>4 wartości</strong> - ustala szerokości dla wszystkich krawędzi w następującej kolejności: górna, krawędź prawa, dolna, krawędź lewa. Na przykład: <em>10px 0 20px 2px</em>',

    // Translations from inc.settings.php

    'Texts in the website' => 'Teksty na stronie',
    'Site heading' => 'Główny tytuł strony',

    /* setting tab & setting name */ 'Template' => 'Projekt',
    /* help text */    'Templates are like skins or themes for your site. You can choose one template from the ones installed in your templates folder. To add a new template to this list, upload it to the templates folder via FTP.' => 'Projekty są "skórki" lub tematy, które zmieniają umiejscowienie elementów strony lub wygląd.',

    /* setting tab */ 'Info' => 'Informacja',
    /* setting name */ 'Your name' => 'Twoje imię',
    /* help text */    'Your name will be put in a meta-tag in the code of your site. You can choose any name ;)' => 'Twoje imię będzie zapisane w kodzie strony w znaczniku meta tag. Imię może być dowolne.',
    /* setting name */ 'Page title (title bar)' => 'Tytuł strony',
    /* help text */    'Text that appears in the bowser title bar' => 'Tekst, który jest widoczny na górze przeglądarki',
    /* setting name */ '<META> description' => '<META> opis',
    /* help text */    'Site description. It should not be longer than one or two sentences.' => 'Opis strony. Nie powinien być dłuższy niż 2 zdania.',
    /* setting name */ '<META> keywords' => '<META> słowa kluczowe',
    /* help text */    'Keywords visible only to search engines. Keywords along with the description can improve your site ranking in search results.' => 'Słowa kluczowe są widoczne tylko dla wyszukiwarek, takich jak Google. Może to poprawić pozycję twojej strony w wynikach wyszukiwania. Powinny odpowiadać treści strony.',

    /* setting tab */ 'Navigation' => 'Navigacja',
    /* setting name */ 'Is first section visible in menu?' => 'Czy pierwszy dział jest widoczny w głównym menu?',
    /* help text */    'Choose "no" to hide the first section in the main menu. Link from the page title (or header image) will lead to it. NOTE: This setting has no effect, if the section has a submenu; then it is visible at all times.' => 'Wybierz "No", jeżeli chcesz, aby pierwszy dział nie byłby widoczny. Przejść do działu będzie można tylko otwierając stronę lub klikając na logo strony. Ustawienie to nie działa, jeżeli ten dział ma poddziały.',
    /* setting name */ 'Show menu in first section' => 'Pokazać menu w pierwszym dziale?',
    /* help text */    'Choose "no" to hide the menu in first section.' => 'Wybierz "No", aby schować menu w pierwszym dziale.',
    /* setting name */ 'Always auto-select a submenu item?' => 'Wybrać automatycznie pierwszy rozdział?',
    /* help text */    'Choose "yes" to automatically select the first submenu item when clicking on a menu item. This works only when there is a submenu.' => 'Wybierz "Yes", aby automatycznie wybrać pierwszy rozdział, klikając na nim w menu.',

    /* setting name */ 'Favicon' => 'Favicon',
    /* help text */    'Small picture to display in the address bar of the browser. The file must be in .ICO format and 16x16 pixels big.' => 'Obraz 16x16 pikseli, który znajduje się w oknie adresu przeglądarki. Plik musi być w formacie .ICO.',
    /* setting name */ 'Grid step' => 'Krok siatki',
    /* help text */    'Distance in pixels for snap-to-grid dragging.' => 'Rozmiar komórki w pikselach. Jeżeli jest większy nić 1, wtedy elementy będą przylepione do tej niewidocznej siatki snap to grid).',

    /* setting tab */  'Entry layout' => 'Wygląd wpisu',
    /* setting name */ 'Small image width' => 'Szerokość małego obrazu',
    /* setting name */ 'Small image height' => 'Wysokość małego obrazu',
    /* help text */    'Maximum size of a small image (visible if \'Small images\' are switched on in the gallery editor). These settings don\'t affect original image.' => 'Maksymalny rozmiar małego obrazu. Będzie to widoczne, kiedy w edytorze galerii będzie włączony "Małe obrazy"',
    /* setting name */ 'Large image width' => 'Szerokość dużego obrazu',
    /* setting name */ 'Large image height' => 'Wysokość dużego obrazu',
    /* help text */    'Maximum size of a large image (visible if \'Large images\' are switched on in the gallery editor). These settings don\'t affect original image.' => 'Maksymalny rozmiar małego obrazu. Będzie on widoczny, kiedy w edytorze galerii zostanie włączony "Duże obrazy"',

    /* setting tab */ 'Media' => 'Media',
    /* setting subcategory */ 'Lightbox settings:' => 'Lightbox ustawienia:',
    /* setting name */ 'Is enabled by default' => 'Włączony domyślnie',
    /* help text */    'Enables Lightbox mode for new entries.' => 'Włącza  tryb Lightbox dla nowych wpisów.',
    /* setting name */ 'Background color' => 'Kolor tła',
    /* help text */    'Color of the Lightbox background layer.' => 'Kolor tła Lightbox (biała/czarna/żadna)',
    /* setting name */ 'Image numbers' => 'Cyfry pod obrazem',
    /* setting name */ 'Caption alignment' => 'Pozycja napisu',
    /* help text */    'Positioning of the image caption text.' => 'Pozycja napisu obrazu',
    /* setting subcategory */ 'Image gallery appearance:' => 'Wygląd galerii obrazów:',
    /* setting name */      'Show slideshow image numbers' => 'Pokazywać numery obrazów w pokazie slajdów',
    /* help text */         'Set the default state of image number visibility in slideshow galleries.' => 'Ustanawia, czy domyślnie pokazywać numery obrazów w galeriach pokazów slajdów.',
    /* setting name */ 'Video player' => 'Wygląd video player',
    /* help text */    'Choose between the two visually different players for your video files.' => 'Wybierz pomiędzy dwoma różnymi odtwarzaczami wideo.',

    /* setting tab */ 'Banners' => 'Banery',
    /* setting name */ 'Banner image' => 'Obraz banera',
    /* setting name */ 'Banner link' => 'Link banera',

    /* setting tab */ 'Language' => 'Language',
    /* setting name */ 'Interface language' => 'Język ',

    /* setting tab */ 'Other settings' => 'Różne',

    // Translations from entries view (and editing)

    '<p>Congratulations! You have successfully installed Berta.</p><p>Now, before adding your content, you have to create a new section. Go to the <a href="sections.php">sections page</a> and do that!</p>' => '<p>Gratulacje! Z powodzeniem zainstalowałeś swoją stronę internetową!</p><p>Przed dodaniem informacji, stwórz nowy dział. Idź do <a href="sections.php">tytuł</a></p>',
    'create new entry here' => 'stworzyć nowy wpis',
    'create new entry' => 'stworzyć nowy wpis',

    // Translations for default template

    /* setting tab */ 'General font settings' => 'Ustawienia czcionki',
    /* setting name */ 'Color' => 'Kolor',
    /* setting name */ 'Font face' => 'Czcionka liter',
    /* setting name */ 'Font size' => 'Rozmiar czcionki',
    /* setting name */ 'Font weight' => 'Pogrubienie czcionki',
    /* setting name */ 'Font style' => 'Styl czcionki',
    /* setting name */ 'Font variant' => 'rodzaj czcionki',
    /* setting name */ 'Line height' => 'Wysokość wiersza',
    /* help text */    'Height of text line. Use em, px or % values or the default value "normal"' => 'Odległość pomiędzy podstawą dwóch linijek tekstu. Używaj wartości "em", "px" lub "%", oraz domyślną wartość "normal"',

    /* setting tab */ 'Hyperlinks' => 'Linki',
    /* setting name */ 'Link color' => 'Kolor linku',
    /* setting name */ 'Visited link color' => 'Kolor odwiedzonego linku',
    /* setting name */ 'Link color when hovered' => 'Kolor aktywnego (hover) linku',
    /* setting name */ 'Link color when clicked' => 'Kolor naciśniętego (clicked) linku',
    /* setting name */ 'Link decoration' => 'Dekoracja linku',
    /* setting name */ 'Visited link decoration' => 'Dekoracja odwiedzonego linku',
    /* setting name */ 'Link decoration when hovered' => 'Dekoracja aktywnego (hover) linku',
    /* setting name */ 'Link decoration when clicked' => 'Dekoracja naciśniętego  (clicked) linku',

    /* setting tab */ 'Background' => 'Tło',
    /* setting name */ 'Background color' => 'Kolor tła',
    /* help text */    'IMPORTANT! These settings will be overwritten, if you are using background gallery feature. You access it by clicking "edit background gallery" button in each section.' => 'UWAGA! Te ustawienia nie są brane pod uwagę, jeżeli jest używana galeria tła.',
    /* setting name */ 'Is background image enabled?' => 'Obraz tła uaktywniony?',
    /* setting name */ 'Background image' => 'Obraz tła',
    /* help text */    'Picture to use for page background.' => 'Wybierz obraz tła',
    /* setting name */ 'Background tiling' => 'Powtórzenie tła',
    /* help text */    'How the background fills the screen?' => 'Jak tło wypełnia ekran?',
    /* setting name */ 'Background alignment' => 'Ustawienie tła',
    /* help text */    'Where the background image is positioned?' => 'Pozycja obrazu tła',
    /* setting name */ 'Background position' => 'Pozycja tła',
    /* help text */    'Sets how background behaves in relation with the browser window.' => 'Jak zachowuje się obraz tła, jeżeli zmieniany jest rozmiar okna przeglądarki',

    /* setting name */ 'Background button type' => 'Typ przycisków tła',
    /* help name */    'Select type for background gallery buttons.' => 'Wybierz typ przycisków dla galerii tła',

    /* setting name */ 'Content position' => 'Pozycja treści',
    /* setting name */ 'Text alignment' => 'Ustawienie treści',
    /* setting name */ 'Width of content area' => 'Szerokość pasma treści',
    /* setting name */ 'Page margins' => 'Krawędzi strony',
    /* help text */    'How far the content is from browser edges. Please see the short CSS guide at the bottom of this page.' => 'Jaka jest odległość od treści strony do brzegów przeglądarki. Patrz opis wartości CSS na dole strony.',
    /* setting name */ 'Top menu margins' => 'Górna krawędź menu',
    /* help text */    'How big is the distance from the top menu to the other page elements' => 'Odległość pomiędzy głównym menu i innymi elementami strony',

    /* setting tab */ 'Page heading' => 'Tytuł strony',
    /* setting name */ 'Header image' => 'Obraz nagłówka strony',
    /* help text */    'Picture to use instead of text.' => 'Obraz, który będzie wykorzystany zamiast tekstu w nagłówku strony.',
    /* help text */    'How far the heading is from other elements in page. Please see the short CSS guide at the bottom of this page.' => 'Jak daleko nagłówek strony znajduje się od innych elementów. Patrz opis wartości CSS na dole strony.',
    /* help text */    'How far the menu is form other elements in page. Please see the short CSS guide at the bottom of this page.' => 'Jak daleko menu strony znajduje się od innych elementów strony. Patrz opis wartości CSS na dole strony.',

    /* setting tab */ 'Main menu' => 'Główne menu',
    /* setting name */ 'Menu items separator' => 'Symbol oddzielający menu',
    /* setting name */ 'Space width around separator' => 'Odległość wokół symbolu oddzielającego',
    /* help text */    'The distance from the separator to the menu item on both sides' => 'Odległość pomiędzy symbolem oddzielającym oraz jednostką menu',

    /* setting tab */ 'Submenu' => 'Menu podrzędne',

    /* setting name */ 'Entry margins' => 'Krawędzie wpisu',
    /* help text */    'Margins around entries. Please see the short CSS guide at the bottom of this page.' => 'Krawędzie wokół wpisu. Patrz opis wartości CSS na dole strony.',
    /* setting name */ 'Gallery position' => 'Pozycja galerii',
    /* setting name */ 'Default gallery type' => 'Domyślny typ galerii',
    /* help text */    'Slideshow means that an image menu plus only one image is visible at a time. Row means that all images are visible.' => '"Pokaz slajdów" oznacza, że widoczny jest obraz z cyframi, natomiast w "Rzędzie" oznacza, że wszystkie obrazy są widoczne od razu w rzędzie.',
    /* setting name */ 'Space between images in row and column' => 'Odległość pomiędzy obrazami w wierszu i kolumnie',
    /* help text */    'Horizontal/vertical space between images when gallery is in "row"/"column" mode' => 'Odległość horyzontalna/wertykalna pomiędzy obrazami w trybach "row"/"column"',
    /* setting name */ 'Gallery margins' => 'Krawędzie obrazu',
    /* help text */    'Margin around gallery block' => 'Krawędzie wokół bloku galerii',
    /* setting name */ 'Display tags by each entry' => 'Pokazywać Tagi przy każdym wpisie',
    /* help text */    'This determines whether people will see tags you set for each entry. Regardless of this settting, tags still will make up the main menu.' => 'To ustala, czy pokazywać Tagi przy każdym wpisie. Niezależnie od ustawień, Tagi będą widoczne w głównym menu.',
    /* setting name */ 'Date format in entries' => 'Format daty dla wpisów',
    /* setting name */ 'Date separator' => 'Oddzielać daty',
    /* help text */    'Separator symbol that divides year, month and day' => 'Symbol, który oddziela rok, miesiąc i dzień',
    /* setting name */ 'Time separator' => 'Symbol oddzielający cyfry godziny',

    /* setting tab */  'Entry heading' => 'Tytuł wpisu',
    /* help text */    'How far the entry heading is form other elements in page. Please see the short CSS guide at the bottom of this page.' => 'Jak daleko tytuł wpisu znajduje się od innych elementów strony. Patrz opis wartości CSS na dole strony.',

    /* setting tab */ 'Entry footer' => 'Stopka wpisu',

    // Translations for Mashup template
    /* setting name */ 'First page' => 'Pierwsza strona',
    /* setting name */ 'Sidebar' => 'Pasek boczny',
    /* setting tab */  'Page layout' => 'Wygląd strony',
    /* setting name */ 'Entry text max width' => 'Maksymalna szerokość wpisu',
    /* help text */    'Width of texts in the entries. This does not apply to the width of images.' => 'Szerokość tekstu we wpisach',
    /* setting name */ 'How far content is from page top?' => 'Odległość treści strony od góry strony.',
    /* help text */    'The vertical distance between the top of the page and the content area.' => 'Odległość wertykalna od góry strony do treści strony.',
    /* setting name */ 'How far content is from sidebar?' => 'Odległość treści strony od paska bocznego.',
    /* help text */    'The horizontal distance between the menu and the content area.' => 'Odległość horyzontalna pomiędzy głównym menu i treści strony.',

    /* setting name */ 'Space between entries' => 'Odległość pomiędzy wpisami',
    /* help text */    'Distance from entry to entry. In pixels.' => 'Odległość od wpisu do wpisu. W pikselach.',

    /* setting name */ 'Width' => 'Szerokość',
    /* setting name */ 'Left margin' => 'Odległość od lewej strony',
    /* help text */    'How far the sidebar is from the left side of the screen.' => 'Jak daleko pasek boczny znajduje się od lewej krawędzi strony?',
    /* setting name */ 'Top padding' => 'Odległość od góry',
    /* help text */    'How far the header is from the top of the screen?' => 'Jak daleko pasek boczny znajduje się od góry strony?',
    /* setting name */ 'Space between header and menu' => 'Odległość pomiędzy nagłówku i głównym menu.',
    /* help text */    'How far the menu is from the header text or header image.' => 'Jak daleko znajduje się główne menu od tekstu nagłówka lub obraza?',
    /* setting name */ 'Heading text color' => 'Kolor tekstu nagłówka',
    /* setting name */ 'Is transparent?' => 'Jest przezroczysta?',
    /* setting name */ 'Heading font' => 'Czcionka liter w nagłówku',
    /* setting name */ 'Heading font size' => 'Rozmiar liter w nagłówku',
    /* setting name */ 'Heading font weight' => 'Pogrubienie liter w nagłówku',
    /* setting name */ 'Heading font style' => 'Styl liter w nagłówku',
    /* setting name */ 'Heading font variant' => 'Styl liter w nagłówku',
    /* setting name */ 'Heading line height' => 'Wysokość wiersza w nagłówku',

    /* setting name */ 'Image size ratio' => 'Proporcja rozmiaru obrazu',
    /* help text */    'Images in the first page layout will be resized by this ratio. Think of it as percentage, e.g., 0.7 = 70% of the original image size.' => 'Rozmiary obrazów na pierwszej stronie będą zmienione według tej proporcji. Na przykład, 0.7 = 70% z pierwotnego rozmiaru.',
    /* setting name */ 'Images have shadows?' => 'Czy obrazy mają cienie?',
    /* setting name */ 'Images wiggle on mouse-over?' => 'Czy obrazy poruszają się po najechaniu na nich myszką?',

    /* setting name */ 'Color when opened' => 'Kolor otwartego elementu',
    /* setting name */ 'Decoration when opened' => 'Dekoracja otwartego elementu',

    // Translations for White template

    /* setting name */ 'Empty space on top' => 'Puste miejsce na górze',
    /* setting name */ 'Empty space on bottom' => 'Puste miejsce na dole',
    /* setting name */ 'How far content is from menu?' => 'Jak daleko treść strony znajduje się od głównego menu?',
    /* setting name */ 'Width of the left column' => 'Szerokość lewej kolumny',

    // Translations for Messy template

    /* setting name */ 'Space between images and image navigation' => 'Odległość pomiędzy obrazem i elementem nawigacji',
    /* help text */    'Vertical space between images and image navigation (the digits below the image) when gallery is in "slideshow" mode' => 'Odległość wertykalna pomiędzy obrazem i elementem nawigacji (pod obrazem), kiedy galeria jest w trybie pokazu slajdów',
    /* setting name */ 'Empty space below gallery' => 'Puste miejsce pod galerią',
    /* help text */    'Distance between the gallery and the content below' => 'Odległość pomiędzy galerią i treścią pod nią',

    /* setting name */ 'Logo image' => 'Obraz logo',

    /* setting name */ 'Color when hovered' => 'Kolor rozświetlonego elementu',
    /* help text */    'Color of the element under mouse cursor' => 'Kolor elementu, który znajduje się aktualnie pod strzałką myszki',
    /* setting name */ 'Color when selected' => 'Kolor aktywnego elementu',
    /* help text */    'Color of the element of the currently opened section' => 'Kolor elementu obecnie otwartego działu',
    /* setting name */ 'Decoration' => 'Dekoracja',
    /* setting name */ 'Decoration when hovered' => 'Dekoracja rozświetlonego  elementu',
    /* setting name */ 'Decoration when selected' => 'Dekoracja aktywnego elementu',

    /* setting name */ 'Thumbnails' => 'Miniatury',
    /* setting name */ 'Thumbnails can be turned on by setting the section type to "Thumbnails enabled" & adding more than 1 images to background gallery.' => 'Miniatury mogą być włączone ustawiając typ rozdziały jako "Thumbnails enabled" oraz dodając więcej niż jedno zdjęcie do galerii tła.',
    /* setting name */ 'Thumbnail container width' => 'Szerokość kontenera miniatur',
    /* help text */    'IMPORTANT! This must be set as percentage. i.e. 60%' => 'UWAGA! Ten parametr musi być wprowadzony jako procenty. Na przykład, 60%',

    'googleFont_description' => 'Wpisz nazwę czcionki google. Obejrzyj, jakie czcionki są dostępne: <a href="http://www.google.com/webfonts" target="_blank">Google web fonti</a> Jeżeli wybrana jest czcionka google, wtedy czcionki systemu nie będą brane pod uwagę. Na przykład: <em>Marvel</em>, <em>Marvel:700italic</em> lub <em>Josefin Slab:700italic</em>',
    'Menu position' => 'Pozycja menu',
    'Positon X' => 'Pozycja X',
    'Positon Y' => 'Pozycja Y',
    'description_tagsMenu_x' => 'Pozycja X w menu podrzędnym w pikselach (np.: 50px)',
    'description_tagsMenu_y' => 'Pozycja Y w menu podrzędnym w pikselach (np.: 50px)',
    'description_menu_position' => 'Pozycjonowanie menu',
    'description_banner' => 'Banners are images which are visible in all sections. Use it for buttons or social icons in your site. Displayed image will be half of the original size, full size will be used for hi-res displays.',
    'description_banner_link' => 'Link banera. Przed adresem nie zapomnij dodać http:// (piem.: http://www.berta.me)',
    'description_language' => 'Choose language of interface.',
    'Heading position' => 'Pozycja nagłówka',
    'description_heading_position' => 'Pozycja nagłówka, niezmienna lub zmienna',
    'description_submenu_alwaysopen' => 'Rozdziały zawsze są otwarte.',
    'Submenu is allways open' => 'Menu podrzędne zawsze otwarte',
    'Submenu is hidden' => 'Menu podrzędne schowane',
    'mobile_device_detected' => 'Poprawiać treść stronie nie jest możliwe z tym urządzeniem mobilnym!',
    'javascript_include' => 'Kod javascript, który będzie dodany przed elementem &lt;/body&gt;. Dowiedz się więcej jak <a href="https://github.com/berta-cms/berta/wiki/Include-JavaScript-code" target="_blank" title="How to include JavaScript code">Jak zawierać kod JavaScript.</a>',
    'description_custom_css' => 'Wprowadź swój kod CSS tu. Definicje CSS, które istniały wcześniej, zostaną przepisane. Do uzyskania więcej informacji obejrzyj   <a href="https://github.com/berta-cms/berta/wiki/Add-custom-CSS" target="_blank">WIKI</a>.',

    // Videos panel & newsticker
    'To enable Berta\'s tutorial videos, your computer needs to be connected to the internet!<br />When the internet access is enabled, sign out of engine panel and log in again to view the videos.' => 'Aby obejrzeć pouczenie Berty, komputer musi posiadać podłączenie internetowe.<br />Kiedy komputer jest podłączony do internetu, wyloguj się z panela <em>engine</em> i zaloguj się ponownie.',
    'Show this window on startup' => 'Zawsze pokazywać to okno po zalogowaniu się',
    'Close' => 'Zamknąć',

    'To enable Berta\'s news ticker, your computer needs to be connected to the internet!' => 'Aby zobaczyć nowości Berta, niezbędne jest połączenie internetowe do komputera!',

    //shop translations
    'Shop' => 'Sklep',
    'shop' => 'sklep',
    'Inventory' => 'Magazyn',
    'Regional costs' => 'Koszty regionalne',
    'Item name' => 'Nazwa jednostki',
    'Price' => 'Cena',
    'price' => 'cena',
    'In stock' => 'W magazynie',
    'Reservation' => 'Zarezerwowane',
    'if weight is less than' => 'jeżeli waga jest mniejsza niż',
    'weight' => 'waga',
    'then price is' => 'wtedy cena jest',
    'region name' => 'nazwa regionu',
    'vat' => 'vat',
    '+ add new costs condition' => '+ dodać nowe kryterium kosztów',
    '+ add new region' => '+ dodać nowy region',
    'Save' => 'Zapisać',
    'Configuration values' => 'Wartości konfiguracji',
    'Shop currency' => 'Waluta sklepu',
    'Currency abbreviation or symbol displayed by all prices in the site.' => 'Skrót waluty lub symbol, który będzie widoczny przy cenie towaru.',
    'Order Email Subject' => 'Nazwa tematu w e-mailu',
    'Subject of order email' => 'Nazwa tematu dla e-mailu przy dokonywaniu zamówienia.',
    'Seller details' => 'Dane sprzedawcy',
    'Seller details will be included in bill and e-mail message' => 'Dane sprzedawcy będą zawarte na fakturze oraz w treści e-mailu.',
    'Add to basket' => 'Włożyć do koszyka',
    'Add to basket text' => 'Nazwa przycisku "Włożyć do koszyka".',
    'Out of stock' => 'Nie ma w magazynie',
    'Out of stock text' => 'Tekst uwagi "Nie ma w magazynie".',
    'Email' => 'e-mail',
    'Email where send order data' => 'e-mail, na który wysyłać dane zamówienia.',
    'Payment method' => 'Metoda płatności',
    'Payment method.' => 'Metoda płatności.',
    'Promo code' => 'Kod rabatowy',
    'If Yes - promo code entry will be displayed.' => 'Jeżeli pole jest wypełnione, kupujący będzie mógł wpisać kod rabatowy.',
    'Promo code discount' => 'Wartość rabatu',
    'Discount in precents when user enters valid promo code' => 'Wartość rabatu w procentach na towary, jeżeli kupujący wprowadził poprawny kod.',
    'Weight units' => 'Jednostka wagi',
    'Weight units (g, oz) used for postage cost calculation.' => 'Jednostka wagi (g, oz), która jest używana, obliczając koszty wysyłki pocztowej.',
    'Design' => 'Projekt',
    'Shop entry width' => 'Szerokość wpisu sklepu',
    'section_type' => 'Type',
    'section_type_tip' => 'Defines the layout and functionality of the section.',
    'select_on' => 'On',
    'select_off' => 'Off',
    'shuffle_marked' => 'Shuffle marked entries and galleries',
    'entries_limit' => 'Entries limit',
    'entries_limit_tip' => 'How many entries to show in this section',
];
