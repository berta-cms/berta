
var BertaGalleryEditor = new Class({
	
	Extends: BertaEditorBase,
	Implements: [Options, Events, UnlinearProcessDispatcher],
	
	options: {
		updateUrl: 'update.php',
		engineRoot: './',
		flashUploadEnabled: true
	},
	
	// DOM elements
	allContainer: null,
	container: null,
	editorContainer: null,
	curSelectedImage: null,
	strip: null,
	stripSortables: null,
	
	// content context settings
	sectionName: null,
	entryId: null,
	
	// uploadiung stuff
	uploader: null,
	isUploading: false,
	
	// sorting stuff
	sortingSaveTimeout: 0,
	sortingChanged: false,
	
	// process identifiers
	uploadQueueProcessId: null,
	sortingProcessId: null, 
	processHandler: null,

	
	initialize: function(galleryEditorContainerElement, options) {
		this.setOptions(options);
		this.tinyMCE_ConfigurationsInit();
		this.allContainer = galleryEditorContainerElement;
		
		var entryInfo = this.getEntryInfoForElement(this.allContainer);
		this.sectionName = entryInfo.section;
		this.entryId = entryInfo.entryId;
		this.entryNum = entryInfo.entryNum;
		//this.options.editorInstance = editorInstance;
		
		this.processHandler = new UnlinearProcessHandler(); // singleton process handler
		this.processHandler.addObservable(this);

		// load the editor html from the server
		this.allContainer.addClass('xSavingAtLarge');
		new Request.HTML({
			url: this.options.elementsUrl, 
			update: this.allContainer,
			onComplete: function(resp) {
				//console.debug(resp);
				this.allContainer.removeClass('xSavingAtLarge');
				this.attach.delay(10, this);
				this.fireEvent('load');
			}.bind(this)
		}).post({"json": JSON.encode({
				'section': this.sectionName, 'entry': this.entryId, 'property': 'galleryEditor'
			})
		});
	},
	
	attach: function() {
		
		this.container = this.allContainer.getElement('.xEntryGalleryEditor');
		this.strip = this.container.getElement('.images ul');
		this.editorContainer = this.container.getElement('.xEntryGalleryProps');
		
/* 		this.initTabs(); */
		
		this.stripUpdate();
		$clear(this.stripUpdatePeriod);
		this.stripUpdatePeriod = this.stripUpdate.periodical(300, this);
		
		this.sortingInit();
		
		this.strip.getElements('a.delete').addEvent('click', this.onDeleteClick.bindWithEvent(this));
		this.strip.getElements('li').addEvent('mouseenter', this.onElementHover.bindWithEvent(this));
		this.strip.getElements('li').addEvent('mouseleave', this.onElementUnhover.bindWithEvent(this));
		this.strip.getElements('li img').addEvent('click', this.onElementEditClick.bindWithEvent(this));
		
		this.uploadQueueProcessId = this.unlinearProcess_getId('upload-queue');
		this.sortingProcessId = this.unlinearProcess_getId('sorting-save');
		
		// gallery type handle
		this.elementEdit_init(this.container.getElement('.xEntrySetGalType'), this.options.xBertaEditorClassSelectRC);
		
		// tabs handle
		this.container.getElements('.xEntryGalleryMenu div.tab a').each(function(item) {
			item.addEvent('click', this.onGalTabClick.bindWithEvent(this));
		}, this);

		// image size for gallery handle		
		this.elementEdit_init(this.container.getElement('.xEntrySetImageSize'), this.options.xBertaEditorClassSelectRC);

		// fullscreen handle	
		this.elementEdit_init(this.container.getElement('.xEntrySetFullScreen'), this.options.xBertaEditorClassSelectRC);

		// autoplay handle
		this.elementEdit_init(this.container.getElement('.xEntryAutoPlay'), this.options.xBertaEditorClassRC);
		
		// link address handle
		this.elementEdit_init(this.container.getElement('.xEntryLinkAddress'), this.options.xBertaEditorClassRC);

		// close link
		this.container.getElement('a.xEntryGalCloseLink').addEvent('click', this.onCloseClick.bindWithEvent(this));
		
		// caption fields
		this.container.getElements('div.xEGEImageCaption').each(function(item) {
			this.elementEdit_init(item, this.options.xBertaEditorClassMCE);
		}, this);
		
		// poster frame uploader
		this.addElementPosterUploader();
		
		// main uploader
		this.addMainUploader();
		
		this.fireEvent('attach');
	},
	
	
	detach: function() {
		$clear(this.stripUpdatePeriod);
		this.uploader.detatch();
		this.container.getElements('.xEntrySetGalType a').removeEvents();
		this.sortingDeactivate();
		this.processHandler.removeObservable(this);
		
		if(this.uploader.box) this.uploader.box.empty();
		this.allContainer.empty();
	},
	
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////  APPEARANCE  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	addMainUploader: function() {
		var uploader = this.uploader = new BertaGalleryUploader(this.strip, this, { 
			verbose: false,
			flashEnabled: this.options.flashUploadEnabled,
			url: this.container.getElement('.xEntryGalleryForm').get('action'),
			path: this.options.engineRoot + 'js/swiff/Swiff.Uploader.swf',
			fileClass: BertaGalleryUploader.File,

			limitSize: 300 * 1024 * 1024,
			//typeFilter: {'Images (*.jpg, *.jpeg, *.gif, *.png)': '*.jpg; *.jpeg; *.gif; *.png'},
			instantStart: true,

			// this is our browse button, *target* is overlayed with the Flash movie
			container: this.container,
			target: this.container.getElement('.xEntryAddImagesLink'),
			fallback: this.container.getElement('.xEntryAddImagesFallback'),

			onStart: function() {
				this.isUploading = true;
				this.strip.addClass('processing');
				this.sortingDeactivate();
				this.sortingChanged = true;
				this.unlinearProcess_start(this.uploadQueueProcessId, 'Uploading files');
			}.bind(this),
			
			onComplete: function() {
				this.isUploading = false;
				this.strip.removeClass('processing');
				this.unlinearProcess_stop(this.uploadQueueProcessId);
				this.sortingActivate();
			}.bind(this),

			onSelectSuccess: function(files) {
				if(files.length > 0) {
					var placeholder = this.strip.getElement('li.placeholder');
					if(placeholder) {
						this.sortingRemoveElement(placeholder);
						placeholder.destroy();
					}
					this.stripUpdate();
				}
			}.bind(this),


			onFileComplete: function(file) {
				//console.debug('onFileCompelte: ', file, file.response);
				var json = $H(JSON.decode(file.response.text, true) || {});
				if(json.get('status') > 0) {
					file.element.retrieve('FXProgressBar').start(100).chain(function() {
						var el = file.element;

						// clear the LI element
						el.getChildren().each(function(child) { child.destroy(); });

						// render
						this.addUploadedElement(el, json);
					}.bind(this));
				} else {
					file.element.retrieve('FXProgressBar').start(100).chain(function() {
						file.element.addClass('file-failed');
						file.info.set('html', json.get('error'));
						file.remove.delay(5000, file);
					}.bind(this.uploader));
				}
			}.bind(this),

			onFallbackFileComplete: function(responseString) {
				//console.debug('onFallbackFileComplete: ', responseString);
				var json = $H(JSON.decode(responseString, true) || {});
				if(json.get('status') > 0) {
					var el = new Element('li', {'class': 'file'}).inject(this.strip);
					this.stripUpdate();
					this.addUploadedElement(el, json);

				} else {
					var el = new Element('li', {'class': 'file', 'html': json.get('error') })
								.inject(this.strip)
								.addClass('file-failed');
					el.destroy.delay(5000, el);
					this.stripUpdate();
				}
				
			}.bind(this)
		});
	},
	
	addUploadedElement: function(container, uploaResponseJSON) {
		
		var targetElDims = { w: null, h: null };
				
		if(uploaResponseJSON.get('type') == 'image') {
			// create the image element inside the LI element
			new Element('img', { 
				'class': 'img',
				'src': uploaResponseJSON.get('smallthumb_path'), 
				'styles': { 'width': uploaResponseJSON.get('smallthumb_width'), 'height': uploaResponseJSON.get('smallthumb_height') },
				'events': { 'click': this.onElementEditClick.bindWithEvent(this) }
			}).inject(container);
			
			targetElDims.w = uploaResponseJSON.get('smallthumb_width');
			targetElDims.h = uploaResponseJSON.get('smallthumb_height');
		
		} else if(uploaResponseJSON.get('type') == 'video') {
			new Element('div', { 
				'class': 'placeholderContainer' 
			}).adopt(
				new Element('div', { 'class': 'placeholder' })
			).inject(container);
		}

		
		// add move handle and close button
		new Element('span', { 'class': 'grabHandle xMAlign-container' })
				.set('html', '<span class="xMAlign-outer"><a class="xMAlign-inner" title="click and drag to move"><span></span></a></span>')
				.inject(container);
		//new Element('div', { 'class' : 'posterContainer'}).inject(container);
		new Element('a', { 
			'href': '#', 'class': 'delete', 
			'events': {
				'click': this.onDeleteClick.bindWithEvent(this)
			} 
		}).inject(container);
		
		//add caption editor
		var caption = new Element('div', 
			{ 
			'class': 'xEGEImageCaption xEditableMCESimple xProperty-galleryImageCaption xCaption-caption xParam-'+uploaResponseJSON.get('filename')+' xEditableMCE' 
			}).set('html','<span class="xEmpty">&nbsp;caption&nbsp;</span>'
			).inject(container);
		
		//console.log(caption);
		this.elementEdit_init(caption, this.options.xBertaEditorClassMCE);
		
		
		if(uploaResponseJSON.get('type') == 'video') {
			container.addClass('video');
			targetElDims.w = 150;
			targetElDims.h = 80;
			
			var posterLink = new Element('a', { 'class': 'poster', 'href': '#', 'html': 'upload poster image' });
			new Element('DIV', { 
				'class': 'dimsForm'
			}).adopt(
				new Element('div', { 'class': 'posterContainer' }),
				posterLink
			).inject(container);
			
			this.addElementPosterUploader.delay(1000, this, [ posterLink ]);
			
			/*this.elementEdit_init(container.getElement('span[property="width"]'), this.options.xBertaEditorClassSimple);
			this.elementEdit_init(container.getElement('span[property="height"]'), this.options.xBertaEditorClassSimple);*/
		}
		
		// animate file block to the real dimensions; update image strip when completed
		new Fx.Morph(container, {
			duration: 500, 
			transition: Fx.Transitions.Sine.easeInOut,
			onComplete: function() {
				container.removeClass('file').removeClass('file-success');
				//container.set('class', '');
				this.stripUpdate();
			}.bind(this)
		}).start({
			'width' : targetElDims.w,
			'height' : targetElDims.h
		});
		
		// add common properties, events, and add to sortables
		container.set('filename', uploaResponseJSON.get('filename'));
		container.set('filetype', uploaResponseJSON.get('type'));
		container.addEvent('mouseenter', this.onElementHover.bindWithEvent(this));
		container.addEvent('mouseleave', this.onElementUnhover.bindWithEvent(this));
		this.sortingAddElement(container);
	},
	
	
	
	
	addElementPosterUploader: function(uploadLinkElement) {
		var links = uploadLinkElement ? [ uploadLinkElement ] : this.allContainer.getElements('a.poster');
		links.each(function(posterLink) {
			
			var liElement = posterLink.getParent('li.video');
			var videoSrc = liElement.get('filename');

			var uploader = new BertaGalleryUploader(false, this, { 
				verbose: false,
				flashEnabled: true,
				url: this.container.getElement('.xEntryGalleryForm').get('action') + '&poster_for=' + videoSrc,
				path: this.options.engineRoot + 'js/swiff/Swiff.Uploader.swf',
				fileClass: Swiff.Uploader.File,

				imitSize: 10 * 1024 * 1024,
				limitFiles: 1,
				typeFilter: {'Images (*.jpg, *.jpeg, *.gif, *.png)': '*.jpg; *.jpeg; *.gif; *.png'},
				instantStart: true,

				// this is our browse button, *target* is overlayed with the Flash movie
				container: liElement.getElement('div.posterContainer'),
				target: posterLink,
				fallback: null,

				onStart: function() {
					this.isUploading = true;
					this.strip.addClass('processing');
					this.sortingDeactivate();
					this.sortingChanged = true;
					this.unlinearProcess_start(this.uploadQueueProcessId, 'Uploading poster frame for ' + videoSrc);
				}.bind(this),

				onComplete: function() {
					this.isUploading = false;
					this.strip.removeClass('processing');
					this.unlinearProcess_stop(this.uploadQueueProcessId);
					this.sortingActivate();
				}.bind(this),

				onFileComplete: function(file) {
					//console.debug('onFileCompelte: ', file.response);
					var json = $H(JSON.decode(file.response.text, true) || {});
					if(json.get('status') > 0) {
						//file.element.retrieve('FXProgressBar').start(100).chain(function() {
							liElement.setStyle('width', 'auto');
							var placeHolder = liElement.getElement('div.placeholderContainer');
							placeHolder.setStyle('background-image', 'url(' + json.get('smallthumb_path') + '?no_cache=' + Math.random() + ')')
							placeHolder.setStyle('width', json.get('smallthumb_width'));
							posterLink.set('html', 'replace poster frame');

							this.stripUpdate();

							// enable sorting
							if(!this.isUploading) this.sortingActivate();
						//}.bind(this));
					} else {
						alert(json.get('error'));
					}
					
					uploader.fileRemove(file);

				}.bind(this)
			});
			
		}, this);
	},
	
	
	stripUpdate: function() {
		var strip = this.strip;
		var totalWidth = 0;
		var itemWidth, hasZeroWidth = false;
		strip.getElements('li').each(function(el) {
			//console.debug('strip update ', el.getSize().x);
			itemWidth = el.getSize().x + el.getStyle('margin-right').toInt() + el.getStyle('padding-right').toInt();
			totalWidth += itemWidth;
			hasZeroWidth |= !itemWidth
		});
		
		if(!hasZeroWidth) {
			$clear(this.stripUpdatePeriod);
		}
		
		strip.setStyle('width', totalWidth + 'px');
	},
	
	
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////  SORTING  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	sortingInit: function() {
		//console.debug('------------------ sorting init');
		this.stripSortables = new Sortables(this.strip, {
		    'handle': '.grabHandle',
			'revert': { duration: 500, transition: 'elastic:out' },
			'constrain': true,
			'opacity': 0.8,
			'snap': 0,
			'onStart': function(el) {
				this.strip.addClass('sorting');
				this.strip.addClass('processing');
				el.addClass('grabbing');
				this.sortingChanged = true;
			}.bind(this),
			'onComplete': function(el) {
				this.strip.removeClass('sorting');
				this.strip.removeClass('processing');
				el.removeClass('grabbing');
				this.sortingChanged = true;
				this.sortingSave();
			}.bind(this)
		});
	},
	
	sortingAddElement: function(el) { 
		//console.debug('------------------ sorting add ', el);
		this.stripSortables.addItems(el); this.sortingChanged = true; 
	},
	sortingRemoveElement: function(el) { 
		//console.debug('------------------ sorting remove ', el);
		this.stripSortables.removeItems(el); this.sortingChanged = true; 
	},
	sortingActivate: function(el) {
		//console.debug('------------------ sorting activate');
		this.stripSortables.attach();
		if(this.sortingChanged) this.sortingSave();			// do a quick save - just in case
	},
	sortingDeactivate: function() {
		//console.debug('------------------ sorting deactivate');
		this.stripSortables.detach();
		this.sortingSaveCancel();			// cancel any saving
	},
	
	sortingSave: function() {
		//console.debug('------------------ sorting save (isUploading: ' + this.isUploading + ')');
		this.unlinearProcess_start(this.sortingProcessId, "Saving images order");
		if(!this.isUploading) {
			$clear(this.sortingSaveTimeout);
			this.sortingSaveTimeout = this.sortingSaveDo.delay(1000, this);
		}
	},
	sortingSaveCancel: function() {
		this.unlinearProcess_stop(this.sortingProcessId);
		$clear(this.sortingSaveTimeout);
		this.sortingSaveTimeout = 0;
	},
	sortingSaveDo: function() {
		//console.debug('------------------ sorting save do');
		$clear(this.sortingSaveTimeout);
		this.sortingSaveTimeout = 0;
		this.sortingChanged = false;
		
		var newOrder = this.stripSortables.serialize(0, function(element, index){
		    //console.debug(index, element);
			return element.getProperty('filename');
		});
		
		this.unlinearProcess_start(this.sortingProcessId, "Saving images order");
		
		new Request.JSON({
			url: this.options.updateUrl,
			data: "json=" + JSON.encode({
				section: this.sectionName, entry: this.entryId,
				property: 'galleryOrder', value: newOrder
			}),
			onComplete: function(resp) { 
				this.unlinearProcess_stop(this.sortingProcessId);
			}.bind(this)
		}).post();
	},
	



	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////  EVENT LISTENERS  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	onElementHover: function(event) {
		event = new Event(event).stop();
		var target = $(event.target);
		if(target.tagName != 'LI') target = target.getParent('li');
		target.addClass('hover');
	},
	
	onElementUnhover: function(event) {
		event = new Event(event).stop();
		var target = $(event.target);
		if(target.tagName != 'LI') target = target.getParent('li');
		target.removeClass('hover');
	},
	
	onElementEditClick: function(event) {
		event = new Event(event).stop();
		this.strip.getElements('li').removeClass('selected');
		
		var liEl = $(event.target).getParent('li');
		liEl.addClass('selected');
		this.editorOpen(liEl);
	},
	
	
	
	onDeleteClick: function(event) {
		event = new Event(event).stop();
		var target = $(event.target);
		var liElement = target.getParent('li');
		
		if(!this.isUploading) {
			this.sortingSaveCancel();
			this.sortingRemoveElement(liElement);
			liElement.setStyle('display', 'none');
			
			var deleteProcessId = this.unlinearProcess_getId('delete-image');
			this.unlinearProcess_start(deleteProcessId, "Deleting image");
			new Request.JSON({
				url: this.options.updateUrl,
				data: "json=" + JSON.encode({
					section: this.sectionName, entry: this.entryId,
					property: 'galleryImageDelete', value: liElement.get('filename')
				}),
				onComplete: function(resp) { 
					this.unlinearProcess_stop(deleteProcessId);
					if(resp.update == 'ok') {
						liElement.destroy();
					} else {
						liElement.setStyle('display', 'block');
						this.sortingAddElement(liElement);
						alert(resp.error_message);
					}
					this.sortingSave();
				}.bind(this)
			}).post();
		
		}
	},

/*
	initTabs: function() {
		var target = this.container;
		var settings = target.getChildren('.xEntryGallerySettings');
		var fullscreen = target.getChildren('.xEntryGalleryFullScreen');
		var imageSize = target.getChildren('.xEntryGalleryImageSize');
	},
*/
	
	onGalTabClick: function(event) {
		event.stop();
		var target = $(event.target);
		var tabsContainer = target.getParent('.xEntryGalleryMenu');
		
		var media = tabsContainer.getSiblings('.images');
		var addMedia = tabsContainer.getSiblings('.xEntryGalleryAddMedia');
		var settings = tabsContainer.getSiblings('.xEntryGallerySettings');
		var swiffEl = tabsContainer.getSiblings('.swiff-uploader-box');
		var fullscreen = tabsContainer.getSiblings('.xEntryGalleryFullScreen');
		var imageSize = tabsContainer.getSiblings('.xEntryGalleryImageSize');
		
		var tab = target.getClassStoredValue('xParams');
		//console.debug(tab);
		
		if(tab == 'media') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');

			$$(settings, fullscreen, imageSize).addClass('xHidden');
			$$(media, addMedia, swiffEl).removeClass('xHidden');
		}
		
		if(tab == 'media_settings') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');
			
			$$(media, swiffEl, addMedia, fullscreen, imageSize).addClass('xHidden');
			settings.removeClass('xHidden');
		}
		
		if(tab == 'fullscreen') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');
			
			$$(media, swiffEl, addMedia, settings, imageSize).addClass('xHidden');
			fullscreen.removeClass('xHidden');
		}
		
		if(tab == 'image_size') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');
			
			$$(media, swiffEl, addMedia, settings, fullscreen).addClass('xHidden');
			imageSize.removeClass('xHidden');
		}
	},

	onCloseClick: function(event) {
		event.stop();
		$(event.target).blur();
		
		if(this.processHandler.isIdleOrWarnIfBusy(this)) {
			this.detach();
			this.fireEvent("close", this, 10);
			this.removeEvents();
		}
	}
	
});