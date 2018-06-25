<?php echo BertaTemplate::sentryScripts(); ?>

<script type="text/javascript">
  var bertaGlobalOptions = {
    "paths":{
	  "engineRoot":"<?php echo BertaEditor::$options['ENGINE_BASE_URL'] ?>",
	  "engineABSRoot":"<?php echo BertaEditor::$options['ENGINE_ABS_ROOT'] ?>",
	  "siteABSRoot" : "<?php echo BertaEditor::$options['SITE_ABS_ROOT'] ?>",
	  "template" : "<?php echo BertaEditor::$options['SITE_ABS_ROOT'] . '_templates/' . $berta->template->name . '/' ?>"
	},
    "skipTour": <?php echo (isset($sections) && count($sections)) || $berta->settings->get('siteTexts', 'tourComplete') ? 'true' : 'false' ?>,
    "session_id" : "<?php echo session_id() ?>"
  };
</script>
<script src="<?php echo $ENGINE_ABS_ROOT ?>js/backend.min.js?<?php echo $int_version ?>"></script>
<script src="<?php echo $ENGINE_ABS_ROOT ?>js/ng-backend.min.js?<?php echo $int_version ?>"></script>
