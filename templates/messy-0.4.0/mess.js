

var MessyMess = new Class({
	
	shoppingCart: null,
	reservation: null,
	pageScroller: null,
    
    fadeContent: null,
    bgContainer: null,
    bgImage: null,
    bgCaption: null,
    bgLoader: null,
	
	bgGridViewTrigger: null,
	bgNext: null,
	bgPrevious: null,
	bgRightCounter: null,
	bgLeftCounter: null,
	
	
	initialize: function() {
		window.addEvent('domready', this.onDOMReady.bind(this));
		window.addEvent('load', this.onLoad.bind(this));
		
		/* Backup for versions pre 0.8.2, if not updated */
		if(parseInt(bertaGlobalOptions['lastUpdVer']) < 1082) {
			BertaGallery.implement({
				layout_update: function() {
					if(this.type == 'pile' || this.type == 'row') {
						var margin = 0;
						var totalHeight = 0, totalWidth = 0;
						if(!this.layout_pileOnHoverBinded) this.layout_pileOnHoverBinded = this.layout_pileOnHover.bindWithEvent(this);
						this.imageContainer.getChildren('.xGalleryItem').each(function(el) {
							totalHeight = Math.max(totalHeight, margin + parseInt(el.getStyle('height')));
							totalWidth = Math.max(totalWidth, margin + parseInt(el.getStyle('width')));
							el.setStyles({
								'left': margin + 'px',
								'top': margin + 'px'
							});
							el.addEvent('mouseover', this.layout_pileOnHoverBinded);
							
							margin += 30;
						}, this);
						
						this.imageContainer.setStyle('height', totalHeight + 'px');
						this.imageContainer.setStyle('width', totalWidth + 'px');
						this.imageContainer.getElements('.xGalleryItem').setStyles({'position': 'absolute', 'float': 'none', 'padding-right': '0'});
						this.layout_rowTotalHeight = totalHeight;
						this.layout_rowTotalWidth = totalWidth;
					} else if(this.type == 'column') {
			            var totalHeight = 0, maxWidth = 0, itmSize;
			            this.imageContainer.getChildren('.xGalleryItem').each(function(item) {
			                itmSize = item.getSize();
			                totalHeight += itmSize.y;
			                if(itmSize.x > maxWidth) maxWidth = itmSize.x;
			            });
			            this.imageContainer.setStyle('height', totalHeight + 'px');
			            this.imageContainer.setStyle('width', maxWidth + 'px');
			        }
				}
			});
		}
	},
	
	onDOMReady: function() {
		// Berta Background
		this.bgContainer = $('xBackground');
        this.bgLoader = $('xBackgroundLoader');
        
		if(this.bgContainer)  {
            this.bgImage = this.bgContainer.getElement('.visual-image img');
            this.bgCaption = this.bgContainer.getElement('.visual-caption');
			
			this.bgGridViewTrigger = $('xGridViewTrigger');
			this.bgNext = $('xBackgroundNext');
			this.bgPrevious = $('xBackgroundPrevious');
			this.bgRightCounter = $('xBackgroundRightCounter');
			this.bgLeftCounter = $('xBackgroundLeftCounter');

            if(this.bgImage || this.bgCaption) {
                var bertaBackground = new BertaBackground();
                this.fadeContent = this.bgContainer.getClassStoredValue('xBgDataFading');
            }

            if(this.bgImage) {
                this.bgImage.setStyle('display', 'none');
                this.bgLoader.setStyle('display', 'block');
            }
        }
		
        // Grid view
		if($('xGridView')) {
			$$('.xGridItem').addEvent('click', function() {
                _berta_grid_img_link = this.src.substr(this.src.lastIndexOf('/')+2);
                _berta_grid_img_link = _berta_grid_img_link.substr(_berta_grid_img_link.indexOf('_')+1);
                Cookie.write('_berta_grid_img_link', _berta_grid_img_link, {duration: 0});
			});
		}

		if(this.bgGridViewTrigger) {
			this.bgGridViewTrigger.addEvent('click', function() {
				Cookie.write('_berta_grid_view', 'berta_grid_view', {duration: 0});
			});
            
            // Key events
            window.addEvent('keydown', function(event) {
                if(event.key == 'up') {
                    this.bgGridViewTrigger.fireEvent('click');
                    window.location.href = this.bgGridViewTrigger.get('href');
                }
            }.bind(this)); 
        }

        if(Cookie.read('_berta_grid_img_link'))
            Cookie.dispose('_berta_grid_img_link');

        if(Cookie.read('_berta_grid_view'))
            Cookie.dispose('_berta_grid_view');

		//scroll fix (iphone viewport workaround)
        if(!navigator.userAgent.match(/OS 5_\d like Mac OS X/i) && /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())) {
            window.addEvent('resize',this.stickToBottom.bindWithEvent(this));
            window.addEvent('scroll',this.stickToBottom.bindWithEvent(this));
        }

		var messyItems = $$('.mess');
		
		if(bertaGlobalOptions.environment == 'engine') {
			messyItems.each(function(el) {
				if(!el.hasClass('xEntry')) el.adopt(new Element('div', { 'class': 'xHandle' }));
			});
			$$('.xEntryMove').addClass('xHandle');
			$$('.xEntryToBack').addEvent('click', this.editor_saveOrder.bindWithEvent(this));

			$$('.xEditableDragXY').addEvents({
				mouseenter: function(){
					$('xTopPanelContainer').hide();
					if($('xBgEditorPanelTrigContainer')) $('xBgEditorPanelTrigContainer').hide();
				},
				mouseleave: function(){
					$('xTopPanelContainer').show();
					if($('xBgEditorPanelTrigContainer')) $('xBgEditorPanelTrigContainer').show();
				}
			});
		}
	},
	
	onLoad: function() {
        if(this.bgContainer && this.bgImage) {
            this.bgLoader.setStyle('display', 'none');
            this.bgImage.setStyle('display', 'block')
        }

        // Fade content
        if(this.fadeContent == 'enabled' && this.bgContainer.getElement('.visual-image')) {
            var hideContent, lastX, lastY;
            window.addEvent('mousemove', function(event) {       
                if(!lastX && !lastY) {
                    lastX = event.page.x;
                    lastY = event.page.y;
                }

                if(event.page.x != lastX && event.page.y != lastY) {
                    if(hideContent) {
                        clearTimeout(hideContent);
                        hideContent = 0;
                    }
                    
                    $('allContainer').setStyle('opacity', '1');
                    $('bottom').setStyle('opacity', '1');
					if(this.bgLeftCounter && this.bgRightCounter) {
                        this.bgLeftCounter.setStyle('opacity', 1);
                        this.bgRightCounter.setStyle('opacity', 1);
                    } else if(this.bgNext && this.bgPrevious) {
                        this.bgNext.setStyle('opacity', '1');
                        this.bgPrevious.setStyle('opacity', '1');
                    }

                    hideContent = setTimeout(function() {
                        $('allContainer').tween('opacity', '0');
                        $('bottom').tween('opacity', '0');
                        if(this.bgLeftCounter && this.bgRightCounter) {
                            this.bgLeftCounter.tween('opacity', '0');
                            this.bgRightCounter.tween('opacity', '0');
                        }
						else if(this.bgNext && this.bgPrevious) {
                            this.bgNext.tween('opacity', '0');
                            this.bgPrevious.tween('opacity', '0');
                        }
                    }.bind(this), 3000);
                    
                    lastX = event.page.x;
                    lastY = event.page.y;
                }           
            }.bind(this));
        }

		// Massonry grid
		if($('xGridView')) {
            if((navigator.userAgent.match(/iPhone/i)))
                setTimeout(function() {$('xGridView').setStyle('visibility', 'visible');}, 100);
            else
                $('xGridView').setStyle('visibility', 'visible');
		   
            $('xGridView').masonry({
		    	singleMode: true,
    	    	itemSelector: '.box'
		    });
		}

	},
	
	stickToBottom: function(){
        bottomWidth = $('bottom').getSize().x
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
		image_size: 'medium',
        autoplay: 0,
        image_scale: null
	},

    container: null,
    nextButton: null,
    previousButton: null,
    nextClickArea: null,
    previousClickArea: null,
    loader: null,

    imageContainer: null,
    captionContainer: null,
	imagesList: null,
    bgElements: null,
    bgElementCount: null,
	caption: null,
	image: null,

    selected: null,
    selectedIndex: null,
    rightCounter: null,
    leftCounter: null,
    rightCounterContent: null,
    leftCounterContent: null,
    
    autoplayInterval: null,
    data: null,

    fadeElements: null,
    fadeOutFx: null,
    fadeInFx: null,
    
    
	initialize: function(options) {
		this.setOptions(options);
		
        this._init();

        // If not mobile device
        if (this.nextClickArea && this.previousClickArea) {

            this.nextClickArea.addEvents({
                'click': function() {
                    this._getNext();
                    this._getCounter();
                }.bind(this),
                'mouseenter': function() {
                    this.leftCounter.hide();
                    this.rightCounter.show();
                }.bind(this),
                'mouseleave': function() {
                    this.leftCounter.hide();
                    this.rightCounter.hide();
                }.bind(this)
            });

            this.previousClickArea.addEvents({
                'click': function() {
                    this._getPrevious();
                    this._getCounter();
                }.bind(this),
                'mouseenter': function() {
                    this.rightCounter.hide();
                    this.leftCounter.show();
                }.bind(this),
                'mouseleave': function() {
                    this.rightCounter.hide();
                    this.leftCounter.hide();
                }.bind(this)
            });

            window.addEvents({
                'keydown': function(event) {
                    if(event.key == 'right') {
                        this._getNext();
                        this._getCounter();
                    } else if(event.key == 'left') {
                        this._getPrevious();
                        this._getCounter();
                    }
                }.bind(this),
                'mousemove': function(event) {
                    this._moveCounter(event);
                }.bind(this)
            });

        }
        // If mobile device
        else if (this.nextButton && this.previousButton) {

            // Image click event
            this.imageContainer.addEvent('click:relay(img)', function() {
                this._getNext();
            }.bind(this));

            // Caption click event
            this.captionContainer.addEvent('click', function() {
                this._getNext();
            }.bind(this));

            // Next image button click
            this.nextButton.addEvent('click', function(event) {
                event.stop();
                this._getNext();
            }.bind(this));

            // Previous image button click
            this.previousButton.addEvent('click', function(event) {
                event.stop();
                this._getPrevious();
            }.bind(this));

        }
	},

    _init: function() {
        this.nextButton = $('xBackgroundNext');
        this.previousButton = $('xBackgroundPrevious');
        this.nextClickArea = $('xBackgroundRight');
        this.previousClickArea = $('xBackgroundLeft');
        this.rightCounter = $('xBackgroundRightCounter');
        this.leftCounter = $('xBackgroundLeftCounter');
        this.loader = $('xBackgroundLoader');
        this.container = $('xBackground');

        this.imagesList = this.container.getElement('.visual-list');
        this.bgElements = this.imagesList.getChildren();
        this.bgElementCount = this.bgElements.length;

        this.imageContainer = this.container.getElement('.visual-image');
        this.captionContainer = this.container.getElement('.visual-caption');
        this.image = this.imageContainer.getElement('img');
        this.caption = this.captionContainer.getElement('.caption-content');

        this.selected = this.imagesList.getElement('.sel');
        if (this.rightCounter && this.leftCounter) {
            this.rightCounterContent = this.rightCounter.getElement('.counterContent');
            this.leftCounterContent = this.leftCounter.getElement('.counterContent');
            this._getCounter();
            this.rightCounter.hide();
            this.leftCounter.hide();
        }

        this.data = { options: this.options };
        this.data.options.image_size = this.container.getClassStoredValue('xBgDataImageSize');
        this.data.options.autoplay = this.container.getClassStoredValue('xBgDataAutoplay');
        if(this.data.options.image_size == 'large')
            this.data.options.image_scale = 1;
        else if(!this.data.options.image_size || this.data.options.image_size == 'medium')
            this.data.options.image_scale = 0.85;
        else if(this.data.options.image_size == 'small')
            this.data.options.image_scale = 0.65;

        this.fadeElements = $$('.visual-image, .visual-caption');
        this.fadeOutFx = new Fx.Elements(this.fadeElements, { duration: 'short', transition: Fx.Transitions.Sine.easeInOut });
        this.fadeInFx  = new Fx.Elements(this.fadeElements, { duration: 'normal', transition: Fx.Transitions.Sine.easeInOut });

        if(this.image) this._centerImage();
        else if(this.caption) this._centerCaption();

        // Autoplay
        if(this.data.options.autoplay > 0) {
            this._autoplay();
        }
    },

    _autoplay: function() {
        time = this.data.options.autoplay * 1000;
        this.autoplayInterval = setInterval(function() {
			if(this.selected.getNext())
                newBgContent = this.selected.getNext();
            else
                newBgContent = this.imagesList.getFirst();

            this.selected.removeClass('sel');
            newBgContent.addClass('sel');
            this.selected = newBgContent;

            if(this.rightCounter && this.leftCounter) this._getCounter();

            this.fadeOutFx.start({ '0': { 'opacity': 0 }, '1': { 'opacity': 0 } }).chain(
                function() { this._getNewBgContent(newBgContent); }.bind(this)
            );
        }.bind(this), time);
    },

    _getCounter: function() {
        this.selectedIndex = this.bgElements.indexOf(this.selected) + 1;
        this.rightCounterContent.set('text', (this.selectedIndex == this.bgElementCount ? 1 : (this.selectedIndex + 1) ) + '/' + this.bgElementCount);
        this.leftCounterContent.set('text', (this.selectedIndex == 1 ? this.bgElementCount : (this.selectedIndex - 1) ) + '/' + this.bgElementCount);
    },

    _moveCounter: function(e) {
        this.rightCounter.setStyles({'left': e.client.x+'px', 'top': e.client.y+'px'});
        this.leftCounter.setStyles({'left': e.client.x+'px', 'top': e.client.y+'px'});
    },

    _getNext: function() {
        if(this.data.options.autoplay > 0) {
            clearInterval(this.autoplayInterval);
            this._autoplay();
        }

        if(this.selected.getNext())
            newBgContent = this.selected.getNext();
        else
            newBgContent = this.imagesList.getFirst();

        this.selected.removeClass('sel');
        newBgContent.addClass('sel');
        this.selected = newBgContent;

        this.fadeOutFx.start({ '0': { 'opacity': 0 }, '1': { 'opacity': 0 } }).chain(
            function() { this._getNewBgContent(newBgContent); }.bind(this)
        );
    },

    _getPrevious: function() {
        if(this.data.options.autoplay > 0) {
            clearInterval(this.autoplayInterval);
            this._autoplay();
        }

        if(this.selected.getPrevious())
            newBgContent = this.selected.getPrevious();
        else
            newBgContent = this.imagesList.getLast();

        this.selected.removeClass('sel');
        newBgContent.addClass('sel');
        this.selected = newBgContent;

        this.fadeOutFx.start({ '0': { 'opacity': 0 }, '1': { 'opacity': 0 } }).chain(
            function() { this._getNewBgContent(newBgContent); }.bind(this)
        );
    },

	_getNewBgContent: function(newContent) {
        if(newContent.get('tag') == 'input') {
            if(img = this.image) img.destroy();
            if(caption = this.caption) caption.destroy();

            this.loader.setStyle('display', 'block');
            newImage = newContent; newWidth = newImage.get('width'); newHeight = newImage.get('height'); newSrc = newImage.get('src');
            this.image = new Asset.image(newSrc, { 'class': 'bg-element', 'width': newWidth, 'height': newHeight, 'onLoad': this._getNewBgImageFinish.bind(this) });
        }
        else if(newContent.get('tag') == 'textarea') {
            if(img = this.image) img.destroy();
            if(caption = this.caption) caption.destroy();

            newCaption = newContent.get('text');
            this.caption = new Element('div', { 'class': 'caption-content', 'html': newCaption });
            this._getNewBgCaptionFinish();
        }
	},
    
    _getNewBgImageFinish: function() {
        this.loader.setStyle('display', 'none');
        this.imageContainer.adopt(this.image);
        this._centerImage();
        this.fadeInFx.set({ '0': { 'opacity': 0 }, '1': { 'opacity': 0 } }).start({ '0': { 'opacity': 1 }, '1': { 'opacity': 1 } });
    },

    _getNewBgCaptionFinish: function() {
        this.captionContainer.adopt(this.caption);
        this._centerCaption();
        this.fadeInFx.set({ '0': { 'opacity': 0 }, '1': { 'opacity': 0 } }).start({ '0': { 'opacity': 1 }, '1': { 'opacity': 1 } });
    },

    _centerCaption: function() {
        this.captionContainer.setStyle('margin-top', '-' + (this.captionContainer.getSize().y / 2) + 'px');
    },

    _centerImage: function() {
		this.data.width = parseInt(this.image.get('width'));
		this.data.height = parseInt(this.image.get('height'));

        window.removeEvent('resize');
		window.addEvent('resize', function() { this._onResize() }.bind(this));
		this._onResize();
	},
	
	_onResize: function() {
		var wnd = window,
			w = wnd.getSize().x,
			h = wnd.getSize().y;
		
		var posX, posY;
       
		// scale
		var scaleX = w / this.data.width, scaleY = h / this.data.height;
        
		if(this.data.width>=this.data.height && this.data.options.image_scale == 1)
			if(scaleX > scaleY) scaleY = scaleX; else scaleX = scaleY;
		else
			if(scaleX > scaleY) scaleX = scaleY; else scaleY = scaleX;
		
        // scale based on background image size
        scaleX = scaleX*this.data.options.image_scale;
        scaleY = scaleY*this.data.options.image_scale;
		
		// position X
		posX = Math.round((w - this.data.width * scaleX) / 2);

		// position Y
		posY = Math.round((h - (this.data.height * scaleY)) / 2);

        this.image.setStyles({
            'width': this.data.width * scaleX,
            'height': this.data.height * scaleY,
            'left': posX,
            'top': posY
        });
	},
});


var messyMess = new MessyMess();

		// VIDEO for _centerImage();
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