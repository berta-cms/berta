/*
---

name: data-mootools

description: An API for access to data-attributes in elements.

authors: [Dimitar Christoff]

license: MIT-style license.

provides: Element.data

requires:
 - Core/Element

...
*/
/*jshint mootools:true */
;(function(){
	'use strict';

	var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/;

	function formatDataProperty(prop){
		return prop.replace('data-', '').camelCase();
	}

	var wrap = function(){

		[Document, Element].invoke('implement', {

			data: function(property, force){
				var data = this.retrieve('dataCollection'),
					ii = 0,
					len,
					hasData = false,
					attribs;

				if (!data || force === true) {
					data = {};
					attribs = this.attributes || [];
					for (len = attribs.length; ii < len; ++ii) {
						if (attribs[ii].name.indexOf('data-') === 0) {
							data[formatDataProperty(attribs[ii].name)] = attribs[ii].value.test(rbrace)
								? JSON.decode(attribs[ii].value)
								: attribs[ii].value;

							hasData = true;
						}
					}

					if (!hasData)
						data = null;

					this.store('dataCollection', data);
				}
				else {
					hasData = true;
				}

				return property ? hasData && data[formatDataProperty(property)] || null : data;
			}
		});
	};

	if (typeof define === 'function' && define.amd) {
		// returns an empty module
		define(wrap);
	}
	else {
		wrap();
	}
}());