

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
		var bgContainer = $('xBackground');
		
		if(bgContainer) var bgImage = bgContainer.getElement('.visual-image img');

		if(bgImage) {
			var bertaBackground = new BertaBackground();
		}
		
		$$('.gridItem').each(function(item) {
			item.addEvent('click', function(event) {
				_berta_grid_img_link = this.src.substr(this.src.lastIndexOf('/')+2);
				_berta_grid_img_link = _berta_grid_img_link.substr(_berta_grid_img_link.indexOf('_')+1);
				Cookie.write('_berta_grid_img_link', _berta_grid_img_link, {duration: 0});
			});
		}.bind(this));
		
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
		
		if(Cookie.read('_berta_grid_img_link'))
			Cookie.dispose('_berta_grid_img_link');
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
		image_size: 'large',
        autoplay: 0,
	},
	
    container: null,
	imagesList: null,
	caption: null,
	image: null,
    
	nextButton: null,
	previousButton: null,
    
    selected: null,
    autoplayInterval: null,
    
	initialize: function(options) {
		this.setOptions(options);
		
        this.nextButton = $('xBackgroundNext');
		this.previousButton = $('xBackgroundPrevious');
		this.container = $('xBackground');
		
		this.imagesList = this.container.getElement('.visual-list');
		this.caption = this.container.getElement('.visual-caption');
		this.image = this.container.getElement('.visual-image img');
        
        var data = { options: this.options };
            data.options.image_size = this.container.dataset['image_size'];
            data.options.autoplay = this.container.dataset['autoplay'];
        
        var imgFx = new Fx.Tween(this.image, {duration: 'short', property: 'opacity'});
        
        this._init(data);
        
        // Next image button click    
        this.nextButton.addEvent('click', function(event) {
            event.stop();
            
            this.selected = this.imagesList.getElement('.sel');
            
            if(data.options.autoplay > 0) {
                clearInterval(this.autoplayInterval);
                this._autoplay(data, imgFx);
            }
            
			if(this.selected.getNext())
                nextImage = this.selected.getNext();
            else
                nextImage = this.imagesList.getFirst();
            
            imgFx.start(1,0).chain(
                function() { this._newImageData(nextImage); this._init(data); imgFx.start(0,0); }.bind(this),
                function() { imgFx.start(0,1); }.bind(this)
            );
            
        }.bind(this));
        
        // Previous image button click
        this.previousButton.addEvent('click', function(event) {
            event.stop();
            
            this.selected = this.imagesList.getElement('.sel');
           
            if(data.options.autoplay > 0) {
                clearInterval(this.autoplayInterval);
                this._autoplay(data, imgFx);
            }
            
			if(this.selected.getPrevious())
                nextImage = this.selected.getPrevious();
            else
                nextImage = this.imagesList.getLast();
            
            imgFx.start(1,0).chain(
                function() { this._newImageData(nextImage); this._init(data); imgFx.start(0,0); }.bind(this),
                function() { imgFx.start(0,1); }.bind(this)
            );            
        }.bind(this));
        
        // Autoplay
        if(data.options.autoplay > 0) {
            this._autoplay(data, imgFx);
        }
	},

    _autoplay: function(data, imgFx) {
        time = data.options.autoplay * 1000;
        this.autoplayInterval = setInterval(function() {
            this.selected = this.imagesList.getElement('.sel');
        
            if(this.selected.getNext())
                nextImage = this.selected.getNext();
            else
                nextImage = this.imagesList.getFirst();
            
            imgFx.start(1,0).chain(
                function() { this._newImageData(nextImage); this._init(data); imgFx.start(0,0); }.bind(this),
                function() { imgFx.start(0,1); }.bind(this)
            );
        }.bind(this), time);
    },
    
	_newImageData: function(nextImage) {
		newWidth = nextImage.get('width'); newHeight = nextImage.get('height'); newSrc = nextImage.get('src');
        newCaption = nextImage.get('caption');
            	
        this.selected.removeClass('sel');
        nextImage.addClass('sel');
        
        this.image.set('width', newWidth); this.image.set('height', newHeight); this.image.set('src', newSrc);
        this.caption.set('html', newCaption);
	},

	_init: function(data) {
		var el = this.image, scaleMultiplier;

		data.width = parseInt(el.get('width'));
		data.height = parseInt(el.get('height'));
        
        if(!data.options.image_size || data.options.image_size == 'large') {
            scaleMultiplier = 1;
            scaleMultiplier = 1;
        } else if(data.options.image_size == 'medium') {
            scaleMultiplier = 0.7;
            scaleMultiplier = 0.7;
        } else if(data.options.image_size == 'small') {
            scaleMultiplier = 0.5;
            scaleMultiplier = 0.5;
        }

        window.removeEvent('resize');
		window.addEvent('resize', function() { this._onResize(el, data, scaleMultiplier) }.bind(this));
		this._onResize(el, data, scaleMultiplier);
	},
	
	_onResize: function(el, data, scaleMultiplier) {
		var wnd = window,
			w = wnd.getSize().x,
			h = wnd.getSize().y;
		
		var posX, posY;

		// scale
		var scaleX = w / data.width, scaleY = h / data.height;
        
		if(data.width>=data.height)
			if(scaleX > scaleY) scaleY = scaleX; else scaleX = scaleY;
		else
			if(scaleX > scaleY) scaleX = scaleY; else scaleY = scaleX;
		
        // scale based on background image size
        scaleX = scaleX*scaleMultiplier;
        scaleY = scaleY*scaleMultiplier;
		
		// position X
		posX = Math.round((w - data.width * scaleX) / 2);

		// position Y
		posY = Math.round((h - (data.height * scaleY)) / 2);

		el.setStyle('width', data.width * scaleX)
		   	.setStyle('height', data.height * scaleY)
		   	.setStyle('left', posX)
		   	.setStyle('top', posY);
	},
});


var messyMess = new MessyMess();

		// VIDEO for _init();
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