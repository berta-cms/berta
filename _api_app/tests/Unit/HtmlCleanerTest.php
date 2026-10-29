<?php

use App\Shared\HtmlCleaner;

it('removes what can run scripts', function (string $html, string $cleaned) {
    expect((new HtmlCleaner)->clean($html))->toBe($cleaned);
})->with([
    'script element' => ['<p>Hi<script>steal()</script></p>', '<p>Hi</p>'],
    'script in svg' => ['<svg><script>steal()</script></svg>', '<svg></svg>'],
    'event handler' => ['<p onclick="steal()" class="intro">Hi</p>', '<p class="intro">Hi</p>'],
    'event handler on an image' => ['<img src="a.jpg" ONERROR="steal()">', '<img src="a.jpg">'],
    'javascript link' => ['<a href="javascript:steal()">Hi</a>', '<a>Hi</a>'],
    'javascript link with hidden characters' => ['<a href=" java&#x09;script:steal()">Hi</a>', '<a>Hi</a>'],
    'vbscript link' => ['<a href="VBScript:steal">Hi</a>', '<a>Hi</a>'],
    'javascript form action' => ['<form action="javascript:steal()"><button formaction="javascript:steal()">Go</button></form>', '<form><button>Go</button></form>'],
    'iframe document' => ['<iframe srcdoc="&lt;script&gt;steal()&lt;/script&gt;"></iframe>', '<iframe></iframe>'],
]);

it('keeps what the editor allows unchanged', function (string $html) {
    expect((new HtmlCleaner)->clean($html))->toBe($html);
})->with([
    'formatting and links' => ['<p><span>Released&nbsp;</span><strong>Velvet Blood Noir</strong><a href="https://example.com/" target="_blank">&nbsp;from the publisher</a>.</p>'],
    'video embed' => ['<iframe src="https://player.vimeo.com/video/1" width="640" height="360" frameborder="0" allowfullscreen></iframe>'],
    'shop button' => ['<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"><input type="hidden" name="cmd" value="_s-xclick" /><select name="os0"><option value="A">A</option></select><input type="image" src="https://www.paypal.com/btn.gif" border="0" /></form>'],
    'styles' => ['<p style="text-align: center; color: #ff0000;">Hi<br /></p>'],
    'plain text' => ['Studio'],
    'empty' => [''],
]);
