{ if not empty($berta.google_id) }
    <script>
        {literal}
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        {/literal}

        ga('create', '{ $berta.google_id }', '{ $smarty.server.HTTP_HOST }');
        ga('send', 'pageview');
    </script>
{ /if }