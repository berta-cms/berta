<?php

return [
    'berta_copyright_text' => 'Construido con <a href="http://www.berta.me/" target="_blank" title="¡Crea tu propio sitio web con Berta.me en minutos!">Berta.me</a>',

    'margins_help_text' => 'Los márgenes son difíciles. Usa px o em como unidades. Puede establecer los márgenes de 4 maneras, by entering:<br/><strong>1 value</strong> - Establece la parte superior, los márgenes derecho, inferior e izquierdo con el mismo valor. Ejemplo: <em>10px</em>.<br /><strong>2 valores</strong> - establece los márgenes superior e inferior al primer valor, izquierda y derecha - a la segunda. Ejemplo: <em>0 5px</em>.<br /><strong>3 values</strong> - establecer el margen superior al primer valor, izquierda y derecha - a la segunda, parte inferior - al tercer valor. Ejemplo: <em>10px 0 20px</em>.<br /><strong>4 valores</strong> - establece los márgenes en el siguiente orden: arriba, derecha, abajo, izquierda. Ejemplo: <em>10px 0 20px 2px</em>.',
    'units_help_text' => 'Las unidades válidas para cualquier valor numérico son:<br /><strong>px</strong> - pixels. Ejemplo: <em>10px</em>. Mediante el uso de sólo los valores de los números, NO VA A CAMBIAR.<br /><strong>em</strong> - 1em = un tramo de la letra M en la fuente utilizada. Ejemlo: <em>1em</em><br /><strong>%</strong> - un porcentaje del tamaño de la fuente o un porcentaje de las dimensiones del elemento de contenedor (por ejemplo: la página, etc)',

    'sections_help_text' => 'Las secciones son las divisiones principales en su sitio. Piense en ellos como contenedores para el contenido. Aparecen como elementos de menú en el menú principal. ',
    'external_link_help_text' => 'Si desea cualquiera de los artículos en su menú principal para dirigir al visitante a otro lugar que no sea su sitio, especificar el enlace externo. Puede ser un enlace de correo electrónico (por ejemplo: <em>mailto:sombeody@someplace.net</em>) o un enlace a otro sitio web (por ejemplo: <em>http://www.example.com</em>).',

    'password_help_text' => 'La contraseña debe tener como mínimo 6 caracteres<br /> y que contiene alfanuméricos (A-Z, a-z, 0-9) caracteres.',

    'welcome_text__not_installed' => '<h2>¡Gracias por elegir Berta.me!</h2>
           <p>Berta no esta instalado.<br />Por favor, <a href="%s">iniciar sesion</a> y siga el procedimiento de instalación.</p>',

    'welcome_text__not_supported' => '<h2>¡Gracias por elegir Berta.me!</h2>
                                        <p>Este servidor no cumple los requisitos Berta\'s.<br />
                                        Compruebe que PHP versión 5 o superior este instalado en el servidor.</p>',
    'setup_info_text' => 'Haga clic en los campos con fondo amarillo para modificarlas.
                            A continuación, pulse Intro o haga clic en cualquier lugar fuera del campo para guardar.
                            De esta manera, será a través de su sitio - todo lo que tiene un fondo de color amarillo es editable. También será capaz de cambiar esta configuración más tarde.',

    'googleFont_description' => 'Escriba un nombre de fuente google fuente. Para comprobar las fuentes disponibles vaya a <a href="http://www.google.com/webfonts" target="_blank">Google web fonts</a>. Recuerde - fuente del sistema anula la google fuente. Dejar en blanco si desea utilizar la fuente del sistema. Ejemplo: <em>Marvel</em>, <em>Marvel:700italic</em> or <em>Josefin Slab:700italic</em>',
    'description_tagsMenu_x' => 'Submenu X posición en píxeles (es decir, 10px)',
    'description_tagsMenu_y' => 'Submenu Y posición en píxeles (es decir, 10px)',
    'description_menu_position' => 'Posición de menú',
    'description_banner' => 'Banners are images which are visible in all sections. Use it for buttons or social icons in your site. Displayed image will be half of the original size, full size will be used for hi-res displays.',
    'description_banner_link' => 'Enlace banner \'http://\' debe estar al frente de la dirección',
    'description_language' => 'Elija el idioma de la interfaz de Berta. Actualiza sitio, para aplicar.',
    'Heading position' => 'Fija o absoluta la posición de la cabecera. Fijo siempre se queda en un solo lugar, absoluta se mueve junto con el contenido.',
    'description_heading_position' => 'Fija o absoluta la posición de la cabecera. Fijo siempre se queda en un solo lugar, absoluta se mueve junto con el contenido.',
    'description_submenu_alwaysopen' => 'Submenú está abierto cuando elemento de menú está actualizada.',
    'mobile_device_detected' => '¡Usted no puede usar un dispositivo móvil para editar su sitio!',
    'javascript_include' => 'incluir código Javascript justo antes de cerrar el elemento &lt;/body&gt;. Obtenga más información de cómo <a href="https://github.com/berta-cms/berta/wiki/Include-JavaScript-code" target="_blank" title="Cómo incluir código JavaScript">incluir código JavaScript</a>.',
    'description_custom_css' => 'Coloca el código CSS personalizado aquí. Cualquier definiciones CSS existentes se sobrescribirán. Para obtener más información, visite nuestro <a href="https://github.com/berta-cms/berta/wiki/Add-custom-CSS" target="_blank">WIKI</a>.',
    'section_type' => 'Type',
    'section_type_tip' => 'Defines the layout and functionality of the section.',
    'select_on' => 'On',
    'select_off' => 'Off',
    'shuffle_marked' => 'Shuffle marked entries and galleries',
    'entries_limit' => 'Entries limit',
    'entries_limit_tip' => 'How many entries to show in this section',
];
