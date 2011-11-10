/*
---
script: rotater.js
description: MGFX.Rotater, the base class that provides slides and transitions. 
authors: Sean McArthur (http://mcarthurgfx.com) 
license: MIT-style license 
requires:
 core/1.2.4: '*'
 more/1.2.4.1: [Fx.Elements]
provides: [MGFX.Rotater]
...
*/

//MGFX.Rotater. Copyright (c) 2008-2010 Sean McArthur <http://mcarthurgfx.com/>, MIT Style License.

var MGFX = MGFX || {};

MGFX.Rotater = new Class({
	
	Implements: [Options, Events],
	
	options: {
		slideInterval: 5000,
		transitionDuration: 1000,
		startIndex: 0,
		autoplay: true,
		hover:true,
		hash: true,
		onAutoPlay: $empty,
		onRotate: $empty,
		onShowSlide: $empty,
		onStop: $empty,
		onPause: $empty,
		onResume: $empty
	},
	
	initialize: function(slides,options){
		this.setOptions(options);
		this.slides = $$(slides);
		this.createFx();
		this.showSlide(this.options.startIndex);
		if(this.slides.length < 2) this.options.autoplay = false;
		if(this.options.autoplay) this.autoplay();
		return this;
	},
	
	createFx: function(){
		if (!this.slideFx) {
			this.slideFx = new Fx.Elements(this.slides, {
				duration: this.options.transitionDuration, 
				link: 'cancel'
			});
			this.slideFx.addEvent('complete', this.onFxComplete.bind(this));
		}
		this.slides.each(function(slide){
			slide.setStyle('opacity',0);
			slide.setStyle('display','none');
		});
	}.protect(),
	
	onFxComplete: function() {
		this.slides.each(function(slide){
			var op = slide.getStyle('opacity');
			slide.setStyle('display',op > 0 ? 'block' : 'none');
		});
	},
	
	setupHover: function() {
		var _timeLastRotate = new Date(),
			_timeLastPause,
			_timeTillRotate = this.options.slideInterval,
			_resumeDelay;
			
		var onRotate = this._onRotate = function() {
			if(this.slideshowInt) {
				_timeLastRotate = new Date();
				_timeTillRotate = this.options.slideInterval;
			}
		};
		var onMouseEnter = this._onMouseEnter = function() {
			this.stop();
			_timeLastPause = new Date();
			$clear(_resumeDelay);
			this.fireEvent('onPause');
		}.bind(this);
		
		var onMouseLeave = this._onMouseLeave = function() {
			var timePassed = (_timeLastPause - _timeLastRotate);
			_timeLastRotate = new Date() - timePassed;
			_resumeDelay = (function() {
				this.autoplay();
				this.rotate();
				this.fireEvent('onResume');
			}).delay(_timeTillRotate - timePassed, this);			
		}.bind(this);
		
		this.addEvent('onRotate', onRotate);
		this.slides.addEvents({
			'mouseenter': onMouseEnter,
			'mouseleave': onMouseLeave
		});
	}.protect(),
	
	removeHover: function() {
		this.removeEvent('onRotate', this._onRotate);
		this.slides.removeEvents({
			'mouseenter': this._onMouseEnter,
			'mouseleave': this._onMouseLeave
		});
	},
	
	showSlide: function(slideIndex){
		if(slideIndex == this.currentSlide) return this;
		var action = {};
		this.slides.each(function(slide, index){
			if(index == slideIndex && index != this.currentSlide){ //show
				slide.setStyle('display', 'block');
				action[index.toString()] = {
					opacity: 1
				};
			} else {
				action[index.toString()] = {
					opacity:0
				};
			}
		}, this);
		this.fireEvent('onShowSlide', slideIndex);
		this.currentSlide = slideIndex;
		this.slideFx.start(action);
		return this;
	},
	
	autoplay: function(){
		if(this.options.hover) this.setupHover();
		this.slideshowInt = this.rotate.periodical(this.options.slideInterval, this);
		this.fireEvent('onAutoPlay');
		return this;
	},
	
	stop: function(not_pause){
		$clear(this.slideshowInt);
		this.fireEvent('onStop');
		if(not_pause && this.options.hover) this.removeHover();
		return this;
	},
	
	rotate: function(){
		var next = this.getNext();
		this.showSlide(next);
		this.fireEvent('onRotate', next);
		return this;
	},
	
	random: function() {
		var index = Math.floor(Math.random() * this.slides.length);
		index = index == this.currentSlide ? this.getNext() : index;
		this.showSlide(index);
		this.fireEvent('onRandom', index);
		return this;
	},
	
	getNext: function() {
		var current = this.currentSlide;
		return (current+1 >= this.slides.length) ? 0 : current+1
	}.protect()
	
});