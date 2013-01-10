
var BertaGallery = new Class({

	Implements: Options,

	options: {
	    fullscreen: null,
	    galleryFullScreenImageBorders: 'yes',
		type: 'slideshow',
		engineRoot: null,
		engineABSRoot: null,
		playerType: 'JWPlayer'
	},

	type: 'slideshow',
	time: 0,
	interval: null,

	container: null,
	imageContainer: null,
	navContainer: null,
	rowClearElement: null,

	newObjectInjectWhere: null,
	newObjectInjectPosition: null,

	currentSrc: null,
	currentType: null,
	currentVideoPath: null,
	preload: null,
	phase: null,

	imageFadeOutFx: null,
	imageResizeFx: null,
	imageShowFx: null,

	numFinishedLoading: 0,

	initialize: function(container, options) {
		this.setOptions(options);
		this.attach(container);
		this.loadFirst();
	},

	attach: function(container) {
		this.container = container;
		this.type = this.container.getClassStoredValue('xGalleryType');
		//this.container.addClass('galleryType-' + this.type);

		this.fullscreen=this.container.getElement('div.xFullscreen');
		this.imageContainer = this.container.getElement('div.xGallery');
		this.navContainer = this.container.getElement('ul.xGalleryNav');

		if(this.navContainer && this.navContainer.getElements('a').length > 0) {
			this.imageFadeOutFx = new Fx.Tween(this.imageContainer, { duration: 'short', transition: Fx.Transitions.Sine.easeInOut });
			this.imageShowFx = new Fx.Tween(this.imageContainer, { duration: 'normal', transition: Fx.Transitions.Sine.easeInOut });

			if(this.type == 'slideshow') {
				this.imageResizeFx = new Fx.Morph(this.imageContainer, { duration: 'short', transition: Fx.Transitions.Sine.easeInOut });
				this.nav_setEvents();

				this.newObjectInjectWhere = this.options.environment == 'site' ? this.imageContainer : this.imageContainer.getElement('.xGalleryEditButton');
				this.newObjectInjectPosition = this.options.environment == 'site' ? 'bottom' : 'before';
			}
			else if(this.type == 'link') {
				this.newObjectInjectWhere = this.options.environment == 'site' ? this.imageContainer : this.imageContainer.getElement('.xGalleryEditButton');
				this.newObjectInjectPosition = this.options.environment == 'site' ? 'bottom' : 'before';
			}
			else {
				this.rowClearElement = new Element('br', { 'class': 'clear' }).inject(this.imageContainer);

				this.newObjectInjectWhere = this.options.environment == 'site' ? this.rowClearElement : this.imageContainer.getElement('.xGalleryEditButton');
				this.newObjectInjectPosition = 'before';
			}
		} else
			this.navContainer = null;
	},
	detach: function() {
		if(this.navContainer) {
			this.navContainer.getElements('a').each(function(item) {
				item.removeEvents('click');
			});

			this.imageFadeOutFx.cancel();
			if(this.imageResizeFx) this.imageResizeFx.cancel();
			this.imageShowFx.cancel();
			this.imageFadeOutFx = this.imageResizeFx = this.imageShowFx = null;
		}
		this.container = this.imageContainer = this.navContainer = null;
		this.currentSrc = null;
	},





	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////| Loading  |////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	loadFirst: function() {
		if(this.navContainer) {
			var li = this.navContainer.getElement('li');
			this.nav_highlightItem(li);
			var aEl = this.navContainer.getElement('li a');
			var fistItemType = aEl.getClassStoredValue('xType');
			this.autoplay = parseInt(this.container.getClassStoredValue('xGalleryAutoPlay'));

			if(fistItemType != 'image' || ( fistItemType == 'image' && this.type == 'row' ) ) {
				// load only if not image, because if that's image, it's already written in the HTML
				this.load(aEl.get('href'), aEl.getClassStoredValue('xType'), aEl.getClassStoredValue('xW'), aEl.getClassStoredValue('xH'), aEl.getClassStoredValue('xVideoHref'), li.getElement('.xGalleryImageCaption').get('html'), true);
			} else {
				this.currentSrc = aEl.get('href');
				this.preload = this.imageContainer.getElement('div.xGalleryItem');
				//console.debug(this.preload);

				if( (this.fullscreen || this.getNext()) && this.type == 'slideshow' ) {
					this.preload.setStyle('cursor', 'pointer');

					if (this.fullscreen){
					   this.preload.addEvent('click', this.loadFullscreen.bind(this));
					}else{
					   this.preload.addEvent('click', this.loadNext.bind(this));
                    }

                    if(this.autoplay > 0) {
						var obj=this;
						this.time = this.autoplay * 1000;

						if (li.getParent().getElements('a').length>1){
							this.interval = setTimeout(function(){
								obj.loadNext(true);
							}, this.time);
						}
					}
				}

				if(this.type == 'link') {
					if(!this.getNext()) {
						var topImg = this.imageContainer.getFirst('.xGalleryItem');
						var linkHref = this.container.getClassStoredValue('xGalleryLinkAddress');
						var linkTarget = this.container.getClassStoredValue('xGalleryLinkTarget');
						//var patt = /http:\/\//i;
						//if(!patt.test(linkHref)) linkHref = 'http://' + linkHref;

						topImg.getElements('img').setStyle('cursor', 'pointer');
						topImg.addEvent('click', function(event) {
							event.stop();
							if (linkTarget=='_blank'){
								window.open(linkHref);
							}else{
								window.location = linkHref;
							}
						});
					} else {
						this.loadNext();
					}
				}

				if(this.type == 'row' || this.type == 'pile' || this.type == 'column') {
					this.layout_update();
					this.loadNext();
				}

			}
		}
	},

	loadNext: function(bRotate) {
		if(this.navContainer) {
			var nextLi = this.getNext(bRotate);
			if(nextLi) {
				this.nav_highlightItem(nextLi);
				var aEl = nextLi.getElement('a');
				this.load(aEl.get('href'), aEl.getClassStoredValue('xType'), aEl.getClassStoredValue('xW'), aEl.getClassStoredValue('xH'), aEl.getClassStoredValue('xVideoHref'), nextLi.getElement('.xGalleryImageCaption').get('html'), false, aEl.getClassStoredValue('xImgIndex'));
            } else {
				//after everything is loaded - attach fullscreen for gallery row mode
				if (this.fullscreen && (this.type == 'row' || this.type == 'pile' || this.type == 'column')) {
                    this.attachRowFullscreen();
				}
			}
		}
	},

	//gallery row mode - fullscreen
	attachRowFullscreen: function() {
        this.container.getParent().getElements('.xGalleryItem').each(function(item) {
            item.setStyle('cursor', 'pointer');
            item.addEvent('click', function() {
                var ImgIndex = this.getClassStoredValue('xImgIndex');
                var GalleryId = this.getParent('.xEntry').getClassStoredValue('xEntryId');

                milkbox.showGallery(
                    {
                    gallery:'gallery-'+GalleryId,
                    index:ImgIndex-1
                    }
                );
            });
		});
	},

	loadFullscreen: function() {
        var ImgIndex=this.preload.getClassStoredValue('xImgIndex');
        var GalleryId=this.container.getParent().getClassStoredValue('xEntryId');

        milkbox.showGallery({
            gallery:'gallery-'+GalleryId,
            index:ImgIndex-1
        });
	},

	getNext: function(bRotate) {
		if(this.navContainer) {
			var selectedLi = this.navContainer.getElement('li.selected');
			if(selectedLi) {
				var n = selectedLi.getNext();
				if(!n && bRotate) {
					n = this.navContainer.getElement('li');
				}
				return n;
			}
		}
		return null;
	},





	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////| Layout  |/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	layout_update: function() {
		// implementable
		// in a template you can implement this function

		// this is a default implementation that assumes that "row" mode is horizontal
		if(this.type == 'row') {
			var totalWidth = 0, maxHeight = 0, itmSize, numImages = 0;
			this.imageContainer.getChildren('.xGalleryItem').each(function(item) {
				item.setStyle('height', 'auto');
				itmSize = item.getSize();
				totalWidth += itmSize.x;
				if(itmSize.y > maxHeight) maxHeight = itmSize.y;
				numImages++;
			});

			this.imageContainer.setStyle('width', (totalWidth + numImages /* for "em" discrepancy */) + 'px');
			this.imageContainer.getElements('.xGalleryItem').setStyle('position', 'relative');
			//this.imageContainer.setStyle('height', maxHeight + 'px');
		} else if(this.type == 'pile') {
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
			this.imageContainer.getElements('.xGalleryItem').setStyle('position', 'absolute');
			this.layout_rowTotalHeight = totalHeight;
			this.layout_rowTotalWidth = totalWidth;
		} else if(this.type == 'column') {
            //this.imageContainer.getChildren('.xGalleryItem').setStyle('height', 'auto');
            //this.imageContainer.setStyle('height', 'auto');
            var totalHeight = 0, maxWidth = 0, itmSize;
            this.imageContainer.getChildren('.xGalleryItem').each(function(item) {
                itmSize = item.getSize();
                totalHeight += itmSize.y;
                if(itmSize.x > maxWidth) maxWidth = itmSize.x;
            });
            this.imageContainer.setStyle('height', totalHeight + 'px');
            this.imageContainer.setStyle('width', maxWidth + 'px');
			this.imageContainer.getElements('.xGalleryItem').setStyle('position', 'relative');
        }

       	if (typeof(messyMess)=='object') {
			messyMess.copyrightStickToBottom();
       	}
	},

	layout_pileOnHover: bertaGlobalOptions.environment == 'site' ? function(event) {
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
	} : $empty,

/*
	if(mType == 'image') this.layout_inject(bDeleteExisting, true);
	this.layout_finisage(src, mType, mWidth, mHeight);
*/

	layout_inject: function(bDeleteExisting, bDoContainerFade) {
		//console.debug('inject ', this.preload, ' with bDeleteExisting = ', bDeleteExisting);
		if(bDeleteExisting) this.imageContainer.getChildren('.xGalleryItem').destroy();
		this.preload.inject(this.newObjectInjectWhere, this.newObjectInjectPosition);

		if(bDoContainerFade) {
			this.imageShowFx.set('opacity', 0).start('opacity', 1);
		} else {
			// just fade in the newly added image
			new Fx.Tween(this.preload, { duration: 'short', transition: Fx.Transitions.Sine.easeInOut })
					.set('opacity', 0).start('opacity', 1);

		}

		this.layout_update();
	},

	layout_finisage: function(src, mType, mWidth, mHeight) {
		if(mType == 'image') {
            if ( this.fullscreen || this.getNext(this.options.slideshowAutoRewind == 'yes') ){
		        this.preload.setStyle('cursor', 'pointer');
    			this.preload.addEvent('click', this.layout_onImageClick.bindWithEvent(this));
			}
		}
	},

	layout_onImageClick: function(event) {
		if (this.fullscreen){
            this.loadFullscreen();
		}else{
			if ( this.interval ){
				clearTimeout(this.interval);
			}
            this.loadNext(this.options.slideshowAutoRewind == 'yes');
        }
	},




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////| Navigation  |/////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	nav_setEvents: function() {
		// implementable in the future
		this.navContainer.getElements('a').addEvent('click', this.nav_onItemClick.bindWithEvent(this));
	},

	nav_onItemClick: function(event) {
		// implementable in the future
		event.stop();
		if ( this.interval ){
			clearTimeout(this.interval);
		}
		var linkElement = $(event.target);
		if(linkElement.tagName != 'A') linkElement = linkElement.getParent('a');

		var li = linkElement.getParent('li');
		this.nav_highlightItem(li);
		var caption = li.getElement('.xGalleryImageCaption').get('html');

		this.load(linkElement.get('href'), linkElement.getClassStoredValue('xType'), linkElement.getClassStoredValue('xW'), linkElement.getClassStoredValue('xH'), linkElement.getClassStoredValue('xVideoHref'), caption, false, linkElement.getClassStoredValue('xImgIndex'));
	},
	nav_highlightItem: function(liElement) {
		// implementable in the future
		this.navContainer.getElements('li').removeClass('selected');
		liElement.addClass('selected');
	},








	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////| Loading engine  |/////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// load: starts the actual loading of next image/video into the container

	load: function(src, mType, mWidth, mHeight, videoPath, caption, bDeleteExisting, xImgIndex) {
		//console.debug('load', src);
		switch(this.phase) {
			case 'fadeout': this.imageFadeOutFx.cancel(); break;
			case 'fadein': this.imageResizeFx.cancel(); this.imageShowFx.cancel(); break;
			default: this.imageShowFx.cancel(); break;
		}

		if(this.currentSrc && this.type == 'slideshow') {
			this.currentSrc = null;
			this.phase = "fadeout";
			this.imageFadeOutFx.start('opacity', 0).chain(this.load_Render.bind(this, [ src, mType, mWidth, mHeight, videoPath, caption, bDeleteExisting, xImgIndex ]));
		} else {
			this.currentSrc = null;
			this.load_Render(src, mType, mWidth, mHeight, videoPath, caption, bDeleteExisting, xImgIndex);
		}
	},
	load_Render: function(src, mType, mWidth, mHeight, videoPath, caption, bDeleteExisting, xImgIndex) {
		//console.debug('load_Render', src);
		this.currentSrc = src;
		this.currentType = mType;
		this.currentVideoPath = videoPath;
		this.currentCaption = caption;
		this.xImgIndex = xImgIndex;

		if(this.type == 'slideshow') {
			var obj;
			if(obj = this.imageContainer.getElement('div.xGalleryItem')) obj.destroy();
		}

		switch(mType) {
			case 'image':
				this.phase = "preload";
				this.preload = new Asset.image(src, this.type == 'slideshow' ? {
					'onload': this.load_Finish.bind(this, [ src, mType, mWidth, mHeight, bDeleteExisting ])
				} : {});

				this.preload = new Element('div', { 'class': 'image' }).adopt(this.preload);
				if(this.type == 'row' || this.type == 'pile' || this.type == 'column') {
					if(mWidth) this.preload.setStyle('width', mWidth + 'px');
					if(mHeight) this.preload.setStyle('height', mHeight + 'px');
				}

				this.preload = new Element('div', { 'class': 'xGalleryItem xGalleryItemType-image xImgIndex-'+this.xImgIndex }).adopt(this.preload);
				if(this.type == 'row' || this.type == 'pile' || this.type == 'column') {
					if(mWidth) this.preload.setStyle('width', mWidth + 'px');
					if(mHeight) this.preload.setStyle('height', mHeight + 'px');
				}

				new Element('div', { 'class': 'xGalleryImageCaption' }).set('html', caption).inject(this.preload);

				if(this.type != 'slideshow') this.load_Finish(src, mType, mWidth, mHeight, bDeleteExisting);
				break;

			case 'video':
				this.preload = new Element('div', { 'class': 'xGalleryItem xGalleryItemType-video', 'style': { 'opacity': 0 } });
				//this.preload.setStyle('background-image', 'url(\'' + src + '\')');
				//this.preload.setStyle('background-repeat', 'no-repeat');

				if(mWidth) this.preload.setStyle('width', mWidth + 'px');
				this.layout_inject(bDeleteExisting, true);

				if(this.options.playerType == 'JWPlayer' || this.options.playerType == 'JWPlayer_Overlay') {
					if(mHeight) mHeight = parseInt(mHeight) + 25;

					var vars = {
						'file': videoPath,
						'image': src,
						'stretching': 'fill'
						//'skin': '/' + this.options.engineRoot + 'jwplayer/bekle.swf'
					};
					if(this.options.playerType == 'JWPlayer_Overlay') {
						if(mHeight) mHeight = parseInt(mHeight) - 25;
						vars.skin = this.options.engineABSRoot + '_lib/jwplayer/bekle/bekle.xml';
						vars.controlbar = 'over';
					}

					if(mHeight) this.preload.setStyle('height', mHeight + 'px');

					new Swiff(this.options.engineABSRoot + '_lib/jwplayer/player.swf', {
						'container': this.preload,
						'width': mWidth,
						'height': mHeight,
						'params': {
							'allowFullScreen': true,
							'menu': false
						},
						'vars': vars
					});
				}
				else {
					if(mHeight) {
						mHeight = parseInt(mHeight);
						this.preload.setStyle('height', mHeight + 'px');
					}
					new Swiff(this.options.engineABSRoot + '_lib/nonverblaster/NonverBlaster.swf', {
						container: this.preload,
						width: mWidth,
						height: mHeight,
						params: {
							'allowFullScreen': true,
							'menu': false,
							'allowScriptAccess': 'always'
						},
						vars: {
							'mediaURL': videoPath,
							'teaserURL': src,
							'allowSmoothing': 'true',
							'autoPlay': 'false',
							'controlColor': "0xffffff",
							'crop': "false",
							'scaleIfFullScreen': 'true',
							'showScalingButton': 'false'

						}
					});
				}

				new Element('img', { 'src': src, 'class' : 'xGalleryImageVideoBack', 'styles': {
					'width' : mWidth + 'px',
					'height' : mHeight + 'px'
				} }).inject(this.preload, 'top');

				new Element('div', { 'class': 'xGalleryImageCaption' }).set('html', caption).inject(this.preload);
				this.load_Finish(src, mType, mWidth, mHeight, bDeleteExisting);

				break;
		}

	},
	load_Finish: function(src, mType, mWidth, mHeight, bDeleteExisting) {
		//console.debug('load_Finish', src);
		var obj=this;
		// test if the loaded image's src is the last invoked image's src
		if(src == this.currentSrc) {
			if(this.type == 'slideshow') {
				//console.debug(this.preload);
				this.phase = "fadein";
				this.imageResizeFx.start({
					'width': mWidth,
					'height': mHeight
				}).chain(function() {
					this.phase = "done";
					if(mType == 'image') this.layout_inject(bDeleteExisting, true);
					this.layout_finisage(src, mType, mWidth, mHeight);

					if ( this.interval ){
						this.interval = setTimeout(function(){
							obj.loadNext(true);
						}, this.time);
					}

				}.bind(this));
			}
			else if(this.type == 'link') {
				this.phase = "done";
				if(mType == 'image') this.layout_inject(bDeleteExisting, false);
				var topImg = this.imageContainer.getFirst('.xGalleryItem');
				var bottomImg = this.imageContainer.getLast('.xGalleryItem');

				var linkHref = this.container.getClassStoredValue('xGalleryLinkAddress');
				var linkTarget = this.container.getClassStoredValue('xGalleryLinkTarget');

				bottomImg.setStyle('display', 'none');
				bottomImg.getElements('img').setStyle('cursor', 'pointer');
				topImg.addEvent('mouseenter', function(event) {
					event.stop();
					topImg.setStyle('display', 'none');
					bottomImg.setStyle('display', '');
				});
				bottomImg.addEvent('mouseleave', function(event) {
					event.stop();
					bottomImg.setStyle('display', 'none');
					topImg.setStyle('display', '');
				});

				bottomImg.addEvent('click', function(event) {
					event.stop();
					if (linkTarget=='_blank'){
						window.open(linkHref);
					}else{
						window.location = linkHref;
					}
				});
			}
			else {
				this.phase = "done";
				//console.debug(this.preload);
				if(mType == 'image') this.layout_inject(bDeleteExisting, false);
				//this.preload.inject(this.newObjectInjectWhere, this.newObjectInjectPosition);
				this.layout_update();

				//new Fx.Tween(this.preload, { duration: 'normal', transition: Fx.Transitions.Sine.easeInOut }).set('opacity', 0).start('opacity', 1);
            	this.loadNext();
			}
		}
	}

});
