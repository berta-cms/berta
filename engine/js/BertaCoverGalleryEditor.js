
var BertaCoverGalleryEditor = new Class({

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
	coverId: null,

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
		var query = window.location.search.replace('?', '').parseQueryString();
		if (query.site) {
			this.options.updateUrl = this.options.updateUrl + "?site=" + query.site;
			this.options.elementsUrl = this.options.elementsUrl + "?site=" + query.site;
		}
		this.setOptions(options);
		this.tinyMCE_ConfigurationsInit();
		this.allContainer = galleryEditorContainerElement;

		var entryInfo = this.getEntryInfoForElement(this.allContainer);
		this.sectionName = entryInfo.section;
		this.coverId = entryInfo.coverId;

		this.processHandler = new UnlinearProcessHandler(); // singleton process handler
		this.processHandler.addObservable(this);

		// load the editor html from the server
		this.allContainer.addClass('xSavingAtLarge');
		new Request.HTML({
			url: this.options.elementsUrl,
			update: this.allContainer,
			onComplete: function(resp) {
				this.allContainer.removeClass('xSavingAtLarge');
				this.attach.delay(10, this);
				this.fireEvent('load');
			}.bind(this)
		}).post({"json": JSON.encode({
				'section': this.sectionName, 'cover': this.coverId, 'property': 'coverGalleryEditor'
			})
		});
	},

	attach: function() {

		this.container = this.allContainer.getElement('.xEntryGalleryEditor');
		this.strip = this.container.getElement('.images ul');

		this.sortingInit();

		this.strip.getElements('a.delete').addEvent('click', this.onDeleteClick.bindWithEvent(this));
		this.strip.getElements('li').addEvent('mouseenter', this.onElementHover.bindWithEvent(this));
		this.strip.getElements('li').addEvent('mouseleave', this.onElementUnhover.bindWithEvent(this));
		this.strip.getElements('li img').addEvent('click', this.onElementEditClick.bindWithEvent(this));

		this.uploadQueueProcessId = this.unlinearProcess_getId('upload-queue');
		this.sortingProcessId = this.unlinearProcess_getId('sorting-save');

		// tabs handle
		this.container.getElements('.xEntryGalleryMenu div.tab a').each(function(item) {
			item.addEvent('click', this.onGalTabClick.bindWithEvent(this));
		}, this);

		// autoplay handle
		this.elementEdit_init(this.container.getElement('.xEntryAutoPlay'), this.options.xBertaEditorClassRC);

		// useNextImgAsBg handle
		this.elementEdit_init(this.container.getElement('.xUseNextImgAsBg'), this.options.xBertaEditorClassSelectRC);

		// close link
		this.container.getElement('a.xEntryGalCloseLink').addEvent('click', this.onCloseClick.bindWithEvent(this));

		// caption fields
		this.container.getElements('div.xEGEImageCaption').each(function(item) {
			this.elementEdit_init(item, this.options.xBertaEditorClassMCE);
		}, this);

		// main uploader
		this.addMainUploader();

		this.fireEvent('attach');
	},

	detach: function() {
		this.uploader.detatch();
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
			url: this.container.getElement('.xCoverGalleryForm').get('action'),
			path: this.options.engineRoot + 'js/swiff/Swiff.Uploader.swf',
			fileClass: BertaGalleryUploader.File,

			limitSize: 300 * 1024 * 1024,
			typeFilter: {'Images (*.jpg, *.jpeg, *.gif, *.png)': '*.jpg; *.jpeg; *.gif; *.png'},
			instantStart: true,

			// this is our browse button, *target* is overlayed with the Flash movie
			container: this.container,
			target: this.container.getElement('.xCoverAddImagesLink'),
			fallback: this.container.getElement('.xCoverAddImagesFallback'),

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
				}
			}.bind(this),


			onFileComplete: function(file) {
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
				var json = $H(JSON.decode(responseString, true) || {});
				if(json.get('status') > 0) {
					var el = new Element('li', {'class': 'file'}).inject(this.strip);
					this.addUploadedElement(el, json);

				} else {
					var el = new Element('li', {'class': 'file', 'html': json.get('error') })
								.inject(this.strip)
								.addClass('file-failed');
					el.destroy.delay(5000, el);
				}

			}.bind(this)
		});
	},

	addUploadedElement: function(container, uploaResponseJSON) {

		var targetElDims = { w: null, h: null };

		// create the image element inside the LI element
		new Element('img', {
			'class': 'img',
			'src': uploaResponseJSON.get('smallthumb_path'),
			'events': { 'click': this.onElementEditClick.bindWithEvent(this) }
		}).inject(container);

		targetElDims.w = uploaResponseJSON.get('smallthumb_width');
		targetElDims.h = uploaResponseJSON.get('smallthumb_height');

		// add move handle and close button
		new Element('span', { 'class': 'grabHandle xMAlign-container' })
				.set('html', '<span class="xMAlign-outer"><a class="xMAlign-inner" title="click and drag to move"><span></span></a></span>')
				.inject(container);

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

		this.elementEdit_init(caption, this.options.xBertaEditorClassMCE);

		container.removeClass('file').removeClass('file-success');

		// add common properties, events, and add to sortables
		container.set('filename', uploaResponseJSON.get('filename'));
		container.set('filetype', uploaResponseJSON.get('type'));
		container.set('class', uploaResponseJSON.get('type'));
		container.addEvent('mouseenter', this.onElementHover.bindWithEvent(this));
		container.addEvent('mouseleave', this.onElementUnhover.bindWithEvent(this));
		this.sortingAddElement(container);
	},



	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////  SORTING  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	sortingInit: function() {
		this.stripSortables = new Sortables(this.strip, {
		    'handle': '.grabHandle span a',
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
		this.stripSortables.addItems(el); this.sortingChanged = true;
	},
	sortingRemoveElement: function(el) {
		this.stripSortables.removeItems(el); this.sortingChanged = true;
	},
	sortingActivate: function(el) {
		this.stripSortables.attach();
		if(this.sortingChanged) this.sortingSave();			// do a quick save - just in case
	},
	sortingDeactivate: function() {
		this.stripSortables.detach();
		this.sortingSaveCancel();			// cancel any saving
	},

	sortingSave: function() {
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
		$clear(this.sortingSaveTimeout);
		this.sortingSaveTimeout = 0;
		this.sortingChanged = false;

		var newOrder = this.stripSortables.serialize(0, function(element, index){
			return element.getProperty('filename');
		});

		this.unlinearProcess_start(this.sortingProcessId, "Saving images order");

		new Request.JSON({
			url: this.options.updateUrl,
			data: "json=" + JSON.encode({
				section: this.sectionName, cover: this.coverId,
				property: 'coverGalleryOrder', value: newOrder
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
		if (target) target.removeClass('hover');
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
					section: this.sectionName, cover: this.coverId,
					property: 'coverGalleryImageDelete', value: liElement.get('filename')
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

	onGalTabClick: function(event) {
		event.stop();
		var target = $(event.target);
		var tabsContainer = target.getParent('.xEntryGalleryMenu');

		var media = tabsContainer.getSiblings('.images');
		var addMedia = tabsContainer.getSiblings('.xEntryGalleryAddMedia');
		var cropToolbox = tabsContainer.getSiblings('.xEntryGalleryCrop');
		var settings = tabsContainer.getSiblings('.xEntryGallerySettings');
		var swiffEl = tabsContainer.getSiblings('.swiff-uploader-box');
		var fullscreen = tabsContainer.getSiblings('.xEntryGalleryFullScreen');
		var imageSize = tabsContainer.getSiblings('.xEntryGalleryImageSize');

		var tab = target.getClassStoredValue('xParams');

		cropToolbox.addClass('xHidden');

		if(tab == 'media') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');

			$$(settings, fullscreen, imageSize).addClass('xHidden');
			$$(media, addMedia).removeClass('xHidden');
			swiffEl.setStyle('visibility', 'visible');
		}

		if(tab == 'media_settings') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');

			$$(media,  addMedia, fullscreen, imageSize).addClass('xHidden');
			swiffEl.setStyle('visibility', 'hidden');
			settings.removeClass('xHidden');
		}
	},

	onCloseClick: function(event) {
		event.stop();
		$(event.target).blur();

		if(this.processHandler.isIdleOrWarnIfBusy(this)) {
			this.detach();
			this.fireEvent("close", this, 10);
			this.removeEvents();
			location.reload();
		}
	}

});
