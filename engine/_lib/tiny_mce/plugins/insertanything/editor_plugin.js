/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	var each = tinymce.each;

	tinymce.create('tinymce.plugins.InsertAnythingPlugin', {
		init : function(ed, url) {
			var t = this;
			
			t.editor = ed;
			t.url = url;

			function isMediaElm(n) {
				return /^(mceItemInsertAnything)$/.test(n.className);
			};

			// Register commands
			ed.addCommand('mceInsertAnything', function() {
				ed.windowManager.open({
					file : url + '/insertanything.htm',
					width : 430,
					height : 300,
					inline : 1
				}, {
					plugin_url : url
				});
			});

			// Register buttons
			ed.addButton('insertanything', {
				'title' : 'media.desc', 
				'image' : url + '/img/obj_button.gif',
				'cmd'   : 'mceInsertAnything'
			});

			ed.onNodeChange.add(function(ed, cm, n) {
				cm.setActive('insertanything', n.nodeName == 'IMG' && isMediaElm(n));
			});

			ed.onInit.add(function() {
				var lo = {
					mceItemInsertAnything : 'insertanything'
				};

				ed.selection.onSetContent.add(t._divsToImgs, t);

				if (ed.settings.content_css !== false)
					ed.dom.loadCSS(url + "/css/content.css");

				/*if (ed.theme && ed.theme.onResolveName) {
					ed.theme.onResolveName.add(function(th, o) {
						if (o.name == 'img') {
							each(lo, function(v, k) {
								if (ed.dom.hasClass(o.node, k)) {
									o.name = v;
									o.title = ed.dom.getAttrib(o.node, 'title');
									return false;
								}
							});
						}
					});
				}*/

				/*if (ed && ed.plugins.contextmenu) {
					ed.plugins.contextmenu.onContextMenu.add(function(th, m, e) {
						if (e.nodeName == 'IMG' && /mceItemInsertAnything/.test(e.className)) {
							m.add({title : 'media.edit', icon : 'media', cmd : 'mceInsertAnything'});
						}
					});
				}*/
			});

			// convet all <div class="mceItemInsertAnything">...</div> to images
			ed.onSetContent.add(function() {
				t._encodeObjects(ed.getBody());
			});

			// on postprocess convert all imgs to divs 
			ed.onPreProcess.add(function(ed, o) {
				var dom = ed.dom;

				if (o.get) {
					each(dom.select('IMG.mceItemInsertAnything', o.node), function(n) {
						//console.debug(n, t._buildDiv(n));
						dom.setOuterHTML(n, t._restoreObject(n));
						//dom.replace(t._restoreObject(n), n);
					});
				}
			});
		},

		getInfo : function() {
			return {
				longname : 'InsertAnything',
				author : 'Karlsons',
				authorurl : 'http://www.karlsons.net',
				infourl : 'http://www.karlsons.net',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},


		_restoreObject : function(n) {
			/*var dom = this.editor.dom;
			var div = dom.create('div', {
				'class': 'mceItemInsertAnything'
			});
			//div.className = 'mceItemInsertAnything';
			dom.setHTML(div, n.title);
			
			
			var s = n.title;
			//s = s.replace(/(<object[^>]*>.*<\/object>)/gi, '<img class="mceItemInsertAnything" title="$1" />');
			
			
			return div;*/
			//alert(unescape(n.title));
			return unescape(n.title);
		},




		_encodeObjects : function(p) {
			var t = this, dom = t.editor.dom, im, ci;

			each(dom.select('object', p), function(n) {
				// Convert object into image
				/*if (dom.getAttrib(n, 'class') == 'mceItemInsertAnything') {
					dom.replace(t._createImg('mceItemInsertAnything', n), n);
					return;
				}*/
				dom.replace(t._createImg('mceItemInsertAnything', n), n);
			});
			each(dom.select('embed', p), function(n) {
				dom.replace(t._createImg('mceItemInsertAnything', n), n);
			});
			each(dom.select('iframe', p), function(n) {
				dom.replace(t._createImg('mceItemInsertAnything', n), n);
			});
		},

		_createImg : function(cl, n) {
			var im, dom = this.editor.dom;
			var elHTML = dom.getOuterHTML(n);
			var w = elHTML.match(/\W+width=["']*(\d+)["']*/);
			var h = elHTML.match(/\W+height=["']*(\d+)["']*/);
			
			//console.debug(elHTML, w, h);

			// Create image
			im = dom.create('img', {
				src : this.url + '/img/trans.gif',
				'class' : cl,
				'align': '',
				'width': w ? w[1] : '100%',
				'height': h ? h[1] : '20',
				_moz_resizing: 'false'
			});
			
			im.title = escape(elHTML);

			return im;
		},







		_parse : function(s) {
			return tinymce.util.JSON.parse('{' + s + '}');
		},

		_serialize : function(o) {
			return tinymce.util.JSON.serialize(o).replace(/[{}]/g, '');
		}
	});

	// Register plugin
	tinymce.PluginManager.add('insertanything', tinymce.plugins.InsertAnythingPlugin);
})();