
Element.implement({
	getIndex: function(type) {
        type = (type) ? type : '';
        return $$(type).indexOf(this);
    },

	exists: function() {
        return this;
    },

	getClassStoredValue: function(varName) {
		var c = this.get('class').split(' ');
		for(var i = 0; i < c.length; i++) {
			if(c[i].substr(0, c[i].indexOf('-')) == varName) {
				return c[i].substr(c[i].indexOf('-') + 1);
			}
		}
		return null;
	},

	setClassStoredValue: function(varName, varValue) {
		var c = this.get('class').split(' ');
		var curValue = this.getClassStoredValue(varName);
		if(curValue) {
			this.removeClass(varName + '-' + curValue);
		}
		this.addClass(varName + '-' + varValue);
	}
});



var Berta = new Class({

	Implements: Options,

	options: {
		paths: null,
		playerType: 'JWPlayer'
	},

	entriesList: null,
	galleries: new Array(),

	initialize: function(options) {
		this.setOptions(options);
		window.addEvent('domready', this.onDOMReady.bindWithEvent(this));
		window.addEvent('load', this.onLoad.bindWithEvent(this));

		if(!window.console) {
			window.console = { debug: function() { }, log: function() { } };
		}
	},

	onDOMReady: function(event) {
		//console.debug('Berta: dom_ready');
		this.entriesList = $$('.xEntriesList');
		if(this.entriesList) this.entriesList = this.entriesList[0];
		this.bgImageInit();
		this.windowResizeEvents();
	},

	onLoad: function(event) {
		//console.debug('Berta: load');

		// init entry galleries only in "load" event because otherwise in some browsers
		// (eg. safari), the CSS sometimes is not loaded in time to get the styles from
		// the elements with javascript
		this.initEntriesList();
	},

	initEntriesList: function() {
		$$('.xEntriesList .xGalleryContainer').each(function(item) {
			var g = new BertaGallery(item, {
				environment: this.options.environment,
				engineRoot: this.options.paths.engineRoot,
				engineABSRoot: this.options.paths.engineABSRoot,
				playerType: this.options.videoPlayerType,
				slideshowAutoRewind: this.options.slideshowAutoRewind,
				galleryFullScreenImageBorders: this.options.galleryFullScreenImageBorders
			});
			this.galleries.push(g);
		}.bind(this));
	},

	bgImageInit: function() {
		var imContainer = $('xFilledBackground');
		if(imContainer) {
			var im = imContainer.getElement('img');
			if(im.complete) {
				this.bgImageInit_do();
			} else {
				im.onload = this.bgImageInit_do.bind(this);
			}
		}
	},
	bgImageInit_do: function() {
		// allow one tick for image to initialize
		this.bgImageInit_do_do.delay(1, this);
	},
	bgImageInit_do_do: function() {
		var imContainer = $('xFilledBackground');
		imContainer.setStyle('display', 'block')

		var im = imContainer.getElement('img');
		var wOrig = im.width, hOrig = im.height;

		var imAlignment = imContainer.getClassStoredValue('xPosition');


		var fnOnResize = function() {
			var wndSize = $(window).getSize();
			var w  = wndSize.x, h = wndSize.y;
			var posX, posY;

			// scale
			var scaleX = w / wOrig, scaleY = h / hOrig;
			if(scaleX > scaleY)
				scaleY = scaleX;
			else
				scaleX = scaleY;

			// position X
			if(imAlignment == 'top_left' || imAlignment == 'center_left' || imAlignment == 'bottom_left') {
				posX = 0;
			} else if(imAlignment == 'top_right' || imAlignment == 'center_right' || imAlignment == 'bottom_right') {
				posX = Math.round(w - wOrig * scaleX);
			} else {
				posX = Math.round((w - wOrig * scaleX) / 2);
			}

			// position Y
			if(imAlignment == 'top_left' || imAlignment == 'top_center' || imAlignment == 'top_right') {
				posY = 0;
			} else if(imAlignment != 'center' && imAlignment != 'center_left' && imAlignment != 'center_right') {
				posY = Math.round(h - hOrig * scaleY);
			} else {
				posY = Math.round((h - hOrig * scaleY) / 2);
			}

			im.setStyle('width', wOrig * scaleX + 'px');
			im.setStyle('height', hOrig * scaleY + 'px');
			//console.debug(Math.round((w - wOrig * scaleX) / 2), Math.round((h - hOrig * scaleY) / 2));
			im.setStyle('left', posX + 'px');
			im.setStyle('top', posY + 'px');
		}

		$(window).addEvent('resize', fnOnResize);
		fnOnResize();
	},

	windowResizeEvents: function(){
		var templateName = this.options.templateName.split('-');
		templateName = templateName[0];

		var footerOverlayFix = function() {
			var windowHeight = window.getSize().y;
			var sideColumnTop = $('sideColumnTop');
			var sideColumnBottom = $('sideColumnBottom');

			if (sideColumnBottom && sideColumnBottom) {
				var sideColumnTopHeight = sideColumnTop.getSize().y;
				var sideColumnBottomHeight = sideColumnBottom.getSize().y;
				if (windowHeight < sideColumnTopHeight + sideColumnBottomHeight){
					sideColumnBottom.setStyle('position', 'static');
				}else{
					sideColumnBottom.setStyle('position', 'absolute');
				}
			}
		}

		if (templateName=='mashup' || templateName=='white'){
			footerOverlayFix.delay(1000);
			$(window).addEvent('resize', footerOverlayFix);
		}
	}

});

var berta = new Berta(window.bertaGlobalOptions);