/*
---
script: tabs.js
description: MGFX.Tabs, extension of base class that adds tabs to control the rotater. 
authors: Sean McArthur (http://mcarthurgfx.com) 
license: MIT-style license 
requires:
 core/1.2.4: '*'
 more/1.2.4.1: [Fx.Elements]
provides: [MGFX.Tabs]
...
*/

//MGFX.Tabs. Copyright (c) 2008-2010 Sean McArthur <http://mcarthurgfx.com/>, MIT Style License.

var MGFX = MGFX || {};

MGFX.Tabs = new Class({
	
	Extends: MGFX.Rotater,
	
	options: {
		autoplay: false,
		onShowSlide: function(slideIndex) {
			this.tabs.removeClass('active');
			this.tabs[slideIndex].addClass('active');
		}
	},
	
	initialize: function(tabs, slides, options){
		this.setOptions(options);
		this.tabs = $$(tabs);
		this.createTabs();
		if(this.options.hash && window.location.hash) {
			var hash = window.location.hash.substring(1);
			this.tabs.each(function(el, index) {
				if(el.get('id') == hash) {
					options.startIndex = index;
				}
			});
		}
		return this.parent(slides,options);
	},
	
	createTabs: function () {
		this.tabs.each(function(tab,index){
			tab.addEvent('click', function(event){ 
				event.preventDefault();
				this.showSlide(index);
				this.stop(true);
			}.bind(this));
		}.bind(this));
	}.protect()
	
});