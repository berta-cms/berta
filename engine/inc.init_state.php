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
</script>
