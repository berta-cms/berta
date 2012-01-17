

var MessyMess = new Class({
	
	shoppingCart: null,
	reservation: null,
	pageScroller: null,
	
	initialize: function() {
		window.addEvent('domready', this.onDOMReady.bind(this));
		window.addEvent('load', this.onLoad.bind(this));
		
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
		// Init BertaBackground
		var bgNextButton = $('xBackgroundNext'),
			bgPreviousButton = $('xBackgroundPrevious'),
			bgContainer = $('xBackground');
		
		var bgImage = bgContainer.getElement('.visual-image img');

		if(bgImage) {
			var bgImagesList = bgContainer.getElement('.visual-list');
			var	bgCaption = bgContainer.getElement('.visual-caption');
			
			/*
	bgItems.each(function(item) {
				if(item.getNext()) {
					bgNext = item.getNext();
					bgPrevious = item.getPrevious();
				}
				else {
					bgNext = container.getFirst();
					bgPrevious = container.getLast();
				}
			});
	*/
			
			bgNextButton.addEvent('click', function(event) {
				event.stop();
			
				bgSelected = bgImagesList.getElement('.sel');
			
				if(bgSelected.getNext())
					bgNext = bgSelected.getNext();
				else
					bgNext = bgImagesList.getFirst();
				
				myFx = new Fx.Tween(bgImage, {duration: 'short', property: 'opacity'});
				
				newWidth = bgNext.get('width');	newHeight = bgNext.get('height'); newSrc = bgNext.get('src'); newCaption = bgNext.get('caption');
				
				bgSelected.removeClass('sel');
				bgNext.addClass('sel');
				bgImage.set('width', newWidth); bgImage.set('height', newHeight); bgImage.set('src', newSrc); bgCaption.set('html', newCaption);
			});
	
			
			bgPreviousButton.addEvent('click', function(event) {
				event.stop();
			
				bgSelected = bgImagesList.getElement('.sel');		
				
				if(bgSelected.getPrevious())
					bgPrevious = bgSelected.getPrevious();
				else
					bgPrevious = bgImagesList.getLast();
				
				newWidth = bgPrevious.get('width');	newHeight = bgPrevious.get('height'); newSrc = bgPrevious.get('src'); newCaption = bgPrevious.get('caption');
				
				bgSelected.removeClass('sel');
				bgPrevious.addClass('sel');
				bgImage.set('width', newWidth);	bgImage.set('height', newHeight); bgImage.set('src', newSrc); bgCaption.set('html', newCaption);
			});
			
			/*
	var time = 4000;
			setInterval(function(){ 
			 	var selected = bgContainer.getElement('.sel');
	 
				if(selected.getNext()) {
					nextEl = selected.getNext();
				}
				else {
					nextEl = bgContainer.getFirst();
				}
				selected.removeClass('sel');
				nextEl.addClass('sel');
	 		 
			}, time);
	*/
			
			var bertaBackground = new BertaBackground();
		}
		
		$$('.gridItem').each(function(item) {
			item.addEvent('click', function() {
				/*
alert('aa');
				return false;
*/
			}.bind(this));
		});
		
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
	
	onLoad: function() {
		// Massonry grid
		if($('gridView')) {
		    $('gridView').masonry({
		    	singleMode: true,
    	    	itemSelector: '.box' 
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
	image: null,
	nextButton: null,
	previousButton: null,
	
	initialize: function(options) {
		this.setOptions(options);
		this.container = $('xBackground');
		this.image = this.container.getElement('img');
		this.nextButton = $('xBackgroundNext');
		this.previousButton = $('xBackgroundPrevious');

		this.nextButton.addEvent('click', function() { return this._init() }.bind(this));
		this.previousButton.addEvent('click', function() { return this._init() }.bind(this));	
		return this._init();
	},
	
	_init: function() {
		var el = this.image,
		    data = { options: this.options };
		
		data.width = parseInt(el.get('width'));
		data.height = parseInt(el.get('height'));

/*
		for (var attrname in item.dataset) {
		    data.options[attrname] = item.dataset[attrname];
		}
*/

		// VIDEO
/*
		switch(data.options.type) {
		    case 'image':
		    case 'cycle':
		    case 'camera':

		    break;
 
		    case 'video':
 
		    	el.setStyle('width', 'auto')
		    	   .setStyle('height', 'auto');
 
		    	//backgroundElement = $('#background .visualVideoContainer');
 
		    break;
		}
*/

		data.resizeFunc = this._onResize;
		
		window.addEvent('resize', function() {data.resizeFunc(el, data)}.bind(this));
		data.resizeFunc(el, data);
		
		return this;
	},
	
	_onResize: function(target, data) {		
		var wnd = window,
			w = wnd.getSize().x,
			h = wnd.getSize().y;
		
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

		target.setStyle('width', data.width * scaleX)
		   	.setStyle('height', data.height * scaleY)
		   	.setStyle('left', posX)
		   	.setStyle('top', posY);
	},
});


var messyMess = new MessyMess();
