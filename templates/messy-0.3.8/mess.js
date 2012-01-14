

var MessyMess = new Class({
	
	shoppingCart: null,
	reservation: null,
	pageScroller: null,
	
	initialize: function() {
		window.addEvent('domready', this.onDOMReady.bind(this));
		
		BertaGallery.implement({
			layout_update: function() {
				if(this.type == 'row') {
					var margin = 0;
					var totalHeight = 0, totalWidth = 0;
					if(!this.layout_rowOnHoverBinded) this.layout_rowOnHoverBinded = this.layout_rowOnHover.bindWithEvent(this);
					this.imageContainer.getChildren('.xGalleryItem').each(function(el) {
						totalHeight = Math.max(totalHeight, margin + parseInt(el.getStyle('height')));
						totalWidth = Math.max(totalWidth, margin + parseInt(el.getStyle('width')));
						el.setStyles({
							'left': margin + 'px',
							'top': margin + 'px'
						});
						el.addEvent('mouseover', this.layout_rowOnHoverBinded);
						
						margin += 30;
					}, this);
					
					this.imageContainer.setStyle('height', totalHeight + 'px');
					this.imageContainer.setStyle('width', totalWidth + 'px');
					this.layout_rowTotalHeight = totalHeight;
					this.layout_rowTotalWidth = totalWidth;
				}
			}, 
			
			layout_rowOnHover: bertaGlobalOptions.environment == 'site' ? function(event) {
				event.stop();
				var target = $(event.target);
				if(!target.hasClass('xGalleryItem')) target = target.getParent('.xGalleryItem');
				if(target) {
					var imElements = this.imageContainer.getChildren('.xGalleryItem');
					var z = 1000, zPlus = 200, numElements = imElements.length;
					this.imageContainer.getChildren('.xGalleryItem').each(function(el, idx) {
						
						// set correct z-index
						zSignChange = false;
						el.setStyle('z-index', z);
						if(el == target) { zPlus = -199; zSignChange = true; }
						z += zPlus;
						
						// move either to left-top or bottom-right corner
						/*var margin;
						if(zPlus > 0 || zSignChange) margin = idx * 30;
						else margin = -(numElements - 1 - idx) * 30;
						console.debug(
							margin
						);
						el.setStyles({
							left: (zPlus > 0 ? margin : this.layout_rowTotalWidth - parseInt(el.getStyle('width')) - margin) + 'px',
							top: (zPlus > 0 ? margin : this.layout_rowTotalHeight - parseInt(el.getStyle('height')) - margin) + 'px'
						});*/
						
					}, this);
					
				}
			} : $empty
		});
	},
	
	onDOMReady: function() {

		//scroll fix (iphone viewport workaround)
		window.addEvent('resize',this.stickToBottom.bindWithEvent(this));
		window.addEvent('scroll',this.stickToBottom.bindWithEvent(this));

		var messyItems = $$('.mess');
		
		if(bertaGlobalOptions.environment == 'engine') {
			messyItems.each(function(el) {
				if(!el.hasClass('xEntry')) el.adopt(new Element('div', { 'class': 'xHandle' }));
			});
			$$('.xEntryMove').addClass('xHandle');
			$$('.xEntryToBack').addEvent('click', this.editor_saveOrder.bindWithEvent(this));

			$$('.xEditableDragXY').addEvents({
				mouseenter: function(){
					$$('.xCreateNewEntry').hide();
					$('xTopPanelContainer').hide();
					$('xBgEditorPanelTrigContainer').hide();
					$('xBackgroundNext').hide();
					$('xBackgroundPrevious').hide();
				},
				mouseleave: function(){
					$$('.xCreateNewEntry').show();
					$('xTopPanelContainer').show();
					$('xBgEditorPanelTrigContainer').show();
					$('xBackgroundNext').show();
					$('xBackgroundPrevious').show();
					$$('.xEntry .xCreateNewEntry').hide();
				}
			});
		}
	},
	
	stickToBottom: function(){
		$('bottom').setStyles({
			'position': 'absolute',
			'top': (window.pageYOffset + window.innerHeight - 45) + 'px'
		});		
	},

	editor_saveOrder: function(event) {
		event.stop();
		
		
		
		var target = $(event.target);
		target = target.getParent('.xEntry');
		var entriesList = target.getParent('.xEntriesList');
		var nextEntry = entriesList.getFirst('.xEntry');
		target.inject(entriesList, 'top');
		
		/*var newOrder = new Array();
		entriesList.getElements('.xEntry').each(function(el) {
			newOrder.push(el.getClassStoredValue('xEntryId'));
		});*/
		
		new Request.JSON({
			url: bertaEditor.options.updateUrl,
			data: "json=" + JSON.encode({
				section: bertaEditor.currentSection, entry: target.getClassStoredValue('xEntryId'), entryNum: null, 
				action: 'PUT_BEFORE', property: '', value: nextEntry.getClassStoredValue('xEntryId')
			}),
			onComplete: function(resp) { 

			}.bind(this)
		}).post();
	},
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	firstPageInit:function() {
		this.entriesContainer = $('firstPageMarkedEntries');
		if(this.entriesContainer && bertaGlobalOptions.environment == 'site') {
			this.entriesContainer.getElements('.firstPagePic').each(function(el) {
				el.addEvent('mouseenter', this.onFirstPagePicMouseEnter.bindWithEvent(this));
				el.addEvent('mouseleave', this.onFirstPagePicMouseLeave.bindWithEvent(this));
				el.addEvent('mousemove', this.onFirstPagePicMouseMove.bindWithEvent(this));
				el.store('prevMouseX', 0);
				el.store('prevMouseY', 0);
				el.store('mouseMoveOn', false);
			}.bind(this));
		}
	},
	
	onFirstPagePicMouseEnter: function(event) {
		var target = $(event.target);
		if(!target.hasClass('firstPagePic')) {
			target = target.getParent('.firstPagePic');
		}
		
		target.store('mouseMoveOn', true);
		
		target.store('prevMouseX', event.page.x);
		target.store('prevMouseY', event.page.y);
		target.store('initPosX', target.getStyle('left'));
		target.store('initPosY', target.getStyle('top'));
		
	},
	
	onFirstPagePicMouseLeave: function(event) {
		var target = $(event.target);
		if(!target.hasClass('firstPagePic')) {
			target = target.getParent('.firstPagePic');
		}
		
		target.setStyle('left', target.retrieve('initPosX'));
		target.setStyle('top', target.retrieve('initPosY'));		
	},
	
	onFirstPagePicMouseMove: function(event) {
		var target = $(event.target);
		if(!target.hasClass('firstPagePic')) {
			target = target.getParent('.firstPagePic');
		}		
		if(target.retrieve('mouseMoveOn')) {
			
			//console.debug(event.page.x, target.retrieve('prevMouseX'), event.page.y, target.retrieve('prevMouseY'));
			
			var xDiff = event.page.x > target.retrieve('prevMouseX') ? 1 : (event.page.x == target.retrieve('prevMouseX') ? 0 : -1);
			var yDiff = event.page.y > target.retrieve('prevMouseY') ? 1 : (event.page.y == target.retrieve('prevMouseY') ? 0 : -1);
		
			target.store('prevMouseX', event.page.x);
			target.store('prevMouseY', event.page.y);
			target.store('mouseMoveOn', !xDiff && !yDiff);
			
			if(target.hasClass('firstPageWiggle')) {
				target.setStyle('left', parseInt(target.getStyle('left')) + xDiff * 5);
				target.setStyle('top', parseInt(target.getStyle('top')) + yDiff * 5);

			}		
		}
	}
	
});


var BertaBackground = new Class({
	
	Implements: Options,
	
	options: {
		type: 'image',
		alignment: 'center',
		negMarginTop: 0,
		negMarginBottom: 0
	},
	
	container: null,
	images: null,
	
	// methods: {
// 
		// destroy: function() {
			// this.each(function() {
// 
			// });
// 
			// return this;
		// },
// 
		// /**
		 // * Sets/retrieves options variable
		 // *
		 // * @param name  string  option name
		 // * @param value mixed   (optional) value for option
		 // */
		// option: function(name, value) {
			// var data = $(this).data('background');
			// if(value === undefined) {
				// return data.options[name];
			// } else {
				// data.options[name] = value;
			// }
		// },
// 
		// /*'enable': function() {
			// return this.each(function() {
// 
			// })
		// },
		// 'disable': function() {
			// return this.each(function() {
// 
			// })
		// }*/
	// },
	
	initialize: function(options) {
		this.setOptions(options);
		this.container = $('xBackground');
		this.images = this.container.getElements('img');
		// if ( methods[methodOrOptions] ) {
			// return methods[methodOrOptions].apply( this, Array.prototype.slice.call( arguments, 1 ));
// 
		// } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
			return this._init.apply( this, arguments );

		// } else {
			// $.error( 'Method ' +  method + ' does not exist on jQuery.background' );
			// return this;
		// }
	},
	
	_init: function() {
		this.images.each(function(item, index) {
			var $el = item,
				data = { options: this.options };
				
/*
			for (var attrname in item.dataset) {
				data.options[attrname] = item.dataset[attrname];
			}
*/
			
			data.width = $el.getSize().x;
			data.height = $el.getSize().y;

			// VIDEO
/*
			switch(data.options.type) {
				case 'image':
				case 'cycle':
				case 'camera':

				break;
 
				case 'video':
 
					$el.setStyle('width', 'auto')
					   .setStyle('height', 'auto');
 
					//backgroundElement = $('#background .visualVideoContainer');
 
				break;
			}
*/

			data.resizeFunc = this._onResize;
			
			$el.store('background', data);
			
			window.addEvent('resize', function() { data.resizeFunc(item) });
			data.resizeFunc(item);
			//console.debug(data);
		}.bind(this));
		return this;
	},
	
	_onResize: function(target) {		
		var wnd = window,
			w = wnd.getSize().x,
			h = wnd.getSize().y,
			
			$el = target,
			data = $el.retrieve('background');
		
		var posX, posY;
		
		// scale
		var scaleX = w / data.width, scaleY = h / (data.height - data.options.negMarginTop - data.options.negMarginBottom);
		if(scaleX > scaleY) scaleY = scaleX; else scaleX = scaleY;

		// position X
/*
		if(data.options.alignment == 'top_left' || data.options.alignment == 'bottom_left') {
			posX = 0;
		} else if(data.options.alignment == 'top_right' || data.options.alignment == 'bottom_right') {
			posX = Math.round(w - data.width * scaleX);
		} else {
*/
			posX = Math.round((w - data.width * scaleX) / 2);
/* 		} */

		// position Y
/*
		if(data.options.alignment == 'top_left' || data.options.alignment == 'top_center' || data.options.alignment == 'top_right') {
			posY = 0;
		} else if(data.options.alignment != 'center') {
			posY = Math.round(h - data.height * scaleY + data.options.negMarginBottom * scaleY);
		} else {
*/
			//console.debug((h - (backgroundOrigHeight * scaleY)) / 2, (h - (backgroundOrigHeight * scaleY)) / 2 - backgroundNegMarginTop * scaleY);
			posY = Math.round((h - (data.height * scaleY)) / 2 - data.options.negMarginTop * scaleY);
/* 		} */

		$el.setStyle('width', data.width * scaleX)
		   .setStyle('height', data.height * scaleY)
		   .setStyle('left', posX)
		   .setStyle('top', posY);

	},
});


var messyMess = new MessyMess();
