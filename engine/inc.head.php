<?php echo BertaTemplate::sentryScripts(); ?>

<script type="text/javascript">
  var bertaGlobalOptions = {
    "paths":{
	  "engineRoot":"<?php echo BertaEditor::$options['ENGINE_ROOT_URL'] ?>",
	  "engineABSRoot":"<?php echo BertaEditor::$options['ENGINE_ROOT_URL'] ?>",
	  "siteABSRoot" : "<?php echo BertaEditor::$options['SITE_ROOT_URL'] ?>",
	  "template" : "<?php echo BertaEditor::$options['SITE_ROOT_URL'] . '_templates/' . $berta->template->name . '/' ?>"
	},
    "session_id" : "<?php echo session_id() ?>"
  };
</script>
<script src="<?php echo $ENGINE_ROOT_URL ?>js/backend.min.js?<?php echo $version ?>"></script>
<script src="<?php echo $ENGINE_ROOT_URL ?>js/ng-backend.min.js?<?php echo $version ?>"></script>
