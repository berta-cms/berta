<script type="text/javascript">
  var bertaGlobalOptions = {
    "paths":{
	  "engineRoot":"<?php echo BertaEditor::$options['ENGINE_ROOT'] ?>",
	  "engineABSRoot":"<?php echo BertaEditor::$options['ENGINE_ABS_ROOT'] ?>",
	  "siteABSRoot" : "<?php echo BertaEditor::$options['SITE_ABS_ROOT'] ?>",
	  "template" : "<?php echo BertaEditor::$options['SITE_ABS_ROOT'] . '_templates/' . $berta->template->name . '/' ?>"
	},
    "skipTour": <?php echo count($sections) || $berta->settings->get('siteTexts', 'tourComplete') ? 'true' : 'false' ?>,
    "session_id" : "<?php echo session_id() ?>"
  };
  /*
  <?php
  /*
  	foreach(BertaContent::getSites() as $site) {
  		$site_name = empty($site['name']) ? 0 : $site['name']['value'];
		$sections = BertaContent::getSectionsBySite($site_name);

		echo "\n===> SITE: ". $site_name . "\n";
		var_dump($sections);

		foreach ($sections as $section_name => $section) {
			$entries = BertaContent::getEntriesBySiteSection($site_name, $section_name);
			echo "\n===> SECTION: ". $section_name . "\n";
			var_dump($entries);
		}
   	}
   	*/
  ?>
  */
</script>
