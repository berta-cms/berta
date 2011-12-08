tinyMCEPopup.requireLangPack();

var oldWidth, oldHeight, ed, url;

function init() {
	var pl = "", f, val;
	var type = "flash", fe, i;

	ed = tinyMCEPopup.editor;

	tinyMCEPopup.resizeToInnerSize();
	f = document.forms[0]

	fe = ed.selection.getNode();
	if (/mceItemInsertAnything/.test(ed.dom.getAttrib(fe, 'class'))) {
		pl = unescape(fe.title);
		document.forms[0].insert.value = ed.getLang('update', 'Insert', true); 
	}

	// Setup form
	if (pl != "") {
		//pl = tinyMCEPopup.editor.plugins.media._parse(pl);

		var f = document.forms[0];
		f.elements['src'].value = pl;
	}

	//generatePreview();
}

function insertMedia() {
	var fe, f = document.forms[0], h;
	var ed = tinyMCEPopup.editor;

	tinyMCEPopup.restoreSelection();

	if (!AutoValidator.validate(f)) {
		tinyMCEPopup.alert(ed.getLang('invalid_data'));
		return false;
	}
	
	var src = f.src.value;
	src = src.replace(/[\n\r]/g, '');
	var re = new Array(/<object[^>]*>.*<\/object>/gim, /<embed[^>]*>.*<\/embed>/gim, /<iframe[^>]*>.*<\/iframe>/gim);
	var imgs = new Array();
	tinymce.each(re, function(r) {
		var itms = src.match(r);
		if(itms) tinymce.each(itms, function(itm) {
			imgs.push(createImgHTML(itm));
		})
		src = src.replace(r, "");
	});
	var newSrc = imgs.join('');
	
	fe = ed.selection.getNode();
	if (fe != null && /mceItemInsertAnything/.test(ed.dom.getAttrib(fe, 'class'))) {
		try {
			ed.selection.setContent(newSrc);
		} catch(e) { }
		
		//fe.title = newSrc;
		ed.execCommand('mceRepaint');
	
	} else if(newSrc) {
		try {
			ed.execCommand('mceInsertContent', false, newSrc);
		} catch(e) { }
	}

	tinyMCEPopup.close();
}

function createImgHTML(elHTML) {
	var ed = tinyMCEPopup.editor;
	var w = elHTML.match(/\W+width=["']*(\d+)["']*/); 
	var h = elHTML.match(/\W+height=["']*(\d+)["']*/);
	
	var im = ed.dom.create('img', {
		src : tinyMCEPopup.getWindowArg("plugin_url") + '/img/trans.gif',
		'class' : 'mceItemInsertAnything',
		width: w ? w[1] : '100%',
		height: h ? h[1] : '20',
		_moz_resizing: 'false'
	});
	var html = ed.dom.getOuterHTML(im);
	html = html.substr(0, html.length - 1) + ' title="' + escape(elHTML) + '" />';
	return html;
}



tinyMCEPopup.onInit.add(init);
