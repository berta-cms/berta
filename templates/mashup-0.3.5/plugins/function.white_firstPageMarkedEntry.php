<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.white_firstPageMarkedEntry.php
 * Type:     function
 * Name:     white_firstPageMarkedEntry
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_white_firstPageMarkedEntry($params, &$smarty) {
	global $berta;

	$viewportWidth = 980;
	$viewportHeight = 800;


	if(!empty($params['entry'])) {
		$entry = $params['entry'];
		$imageSelect = !empty($params['imageselect']) ? $params['imageselect'] : 'random';
		$wiggleClass = $berta->template->settings->get('firstPage', 'hoverWiggle') == 'yes' ? 'firstPageWiggle' : '';
		$isResponsive = $berta->template->settings->get('pageLayout', 'responsive')=='yes';

		$imgs = BertaGallery::getImagesArray($params['entry']['__raw']);

		if($imgs) {
			$img = $imageSelect == 'first' ? reset($imgs) : $imgs[array_rand($imgs)];
			$sizeRatio = $berta->template->settings->get('firstPage', 'imageSizeRatio');
			if($sizeRatio <= 0) $sizeRatio = 1;

			list($html, $w, $h) = BertaGallery::getHTML(array(0 => $img), $params['entry']['__raw']['mediafolder']['value'], 'slideshow', false, true, $sizeRatio);

			$link = '';
			if($berta->environment != 'engine' && $img['@attributes']['type'] == 'image') {


				$tagKeys = array_keys($params['entry']['tags']);

				$link = smarty_function_bertaLink(array(
					'section' => $params['entry']['section']['name']['value'],
					'tag' => !empty($params['entry']['tags']) ? reset( $tagKeys ) : null
				), $smarty);
				$link = "<a class=\"firstPagePicLink\" href=\"$link\"".($isResponsive ?: "style=\"left:{$pos[0]}px;top:{$pos[1]}px;\"")."></a>";
			}

			$pos = !empty($entry['positionXY']) ? explode(',', $entry['positionXY']) : array(rand(0, $viewportWidth - $w), rand(0, $viewportHeight - $h));
			$entryClasses = smarty_function_entryClasses(array('entry' => $params['entry']), $smarty);
			$html = "<div class=\"firstPagePic $wiggleClass $entryClasses xEditableDragXY xProperty-positionXY \"".($isResponsive ?: "style=\"left:{$pos[0]}px;top:{$pos[1]}px;\"").">" .
						$html .
						($berta->environment == 'engine' ? "<div class=\"xHandle\" style=\"width:{$w}px;height:{$h}px;\"></div>" : '') .
						$link .
					'</div>';

			return $html;

		} else {

			$html = !empty($entry['description']) ? $entry['description'] : '';
			if($html) {
				$pos = !empty($entry['positionXY']) ? explode(',', $entry['positionXY']) : array(rand(0, $viewportWidth - $w), rand(0, $viewportHeight - $h));
				$entryClasses = smarty_function_entryClasses(array('entry' => $params['entry']), $smarty);
				$html = "<div class=\"firstPagePic $wiggleClass $entryClasses xEditableDragXY xProperty-positionXY \" style=\"left:{$pos[0]}px;top:{$pos[1]}px;\">" .
							$html .
							($berta->environment == 'engine' ? "<div class=\"xHandle\" style=\"width:100%;height:100%;\"></div>" : '') .
						'</div>';

				return $html;
			}
		}
	}

	return '';
}
?>