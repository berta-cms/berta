<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.responsiveImage.php
 * Type:     function
 * Name:     responsiveImage
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_responsiveImage($params, &$smarty) {
	extract($params);
	$img_attr = '';

	$width = isset($image[$prefix.'_width']) ? $image[$prefix.'_width'] : false;
	$height = isset($image[$prefix.'_height']) ? $image[$prefix.'_height'] : false;

	if ($width && $height) {
		$imageName = '_'. $width . 'x' . $height . '_' .  $image[$prefix];
		$img_attr .= ' width="' . $width . '" height="' . $height . '" srcset="' . $path . $imageName . ' 1x, ' . $path . $image[$prefix] . ' 2x" ';
	}else{
		$imageName = $image[$prefix];
	}

    $alt = isset($alt) ? htmlspecialchars(strip_tags($alt)) : '';

    return '<img src="' . $path . $imageName . '"' . $img_attr . ' alt="' . $alt . '">';
}
?>