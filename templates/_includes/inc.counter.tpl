{ if not empty($berta.google_id) }

<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', '{ $berta.google_id }']);
  _gaq.push(['_trackPageview']);
  {literal}
  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
  {/literal}
</script>

{ /if }