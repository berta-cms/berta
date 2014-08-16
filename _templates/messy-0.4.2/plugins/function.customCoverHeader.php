<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.customCoverHeader.php
 * Type:     function
 * Name:     customCoverHeader
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_customCoverHeader($params, &$smarty) {
	global $berta;
	if($berta->environment != 'engine') return '';

	return <<<DOC
		<div class="xEntryEditWrap">
			<div class="xEntryEditWrapButtons">
				<a href="#" class="xEntryMove xHandle"><span>move entry</span></a>
				<div class="xEntryDropdown"></div>

			</div>
			<div class="xEntryDropdownBox">
				<ul>
					<li>
						<a href="#" class="xCoverDelete xAction-coverDelete" title="delete"><span>Delete</span></a>
					</li>
				</ul>
			</div>
DOC;
}
?>