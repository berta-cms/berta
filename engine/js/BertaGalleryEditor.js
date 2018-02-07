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
		this.entryId = entryInfo.entryId;
		this.entryNum = entryInfo.entryNum;
		//this.options.editorInstance = editorInstance;

		this.processHandler = new UnlinearProcessHandler(); // singleton process handler
		this.processHandler.addObservable(this);

		// load the editor html from the server
		this.allContainer.addClass('xSavingAtLarge');
		var data = function(obj) {
			var _data = {
				'section': obj.sectionName, 'entry': obj.entryId, 'property': 'galleryEditor'
			};
			console.log('BertaGalleryEditor.initialize:', _data);
			return _data;
		};
		new Request.HTML({
			url: this.options.elementsUrl,
			update: this.allContainer,
			onComplete: function(resp) {
				this.allContainer.removeClass('xSavingAtLarge');
				this.attach.delay(10, this);
				this.fireEvent('load');

				//correct footer position
				if (typeof(messyMess)=='object') {
			  			messyMess.copyrightStickToBottom();
       			}

			}.bind(this)
		}).post({"json": JSON.encode(data(this))
		});
	},

	attach: function() {

		this.container = this.allContainer.getElement('.xEntryGalleryEditor');
		this.strip = this.container.getElement('.images ul');
		this.editorContainer = this.container.getElement('.xEntryGalleryProps');

		this.sortingInit();

		this.strip.getElements('a.crop').addEvent('click', this.onCropClick.bindWithEvent(this));
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

		// slide number visibility handle
		this.elementEdit_init(this.container.getElement('.xEntrySlideNumberVisibility'), this.options.xBertaEditorClassSelectRC);

		// link address handle
		this.elementEdit_init(this.container.getElement('.xEntryLinkAddress'), this.options.xBertaEditorClassRC);

		// link address target handle
		this.elementEdit_init(this.container.getElement('.xEntryLinkTarget'), this.options.xBertaEditorClassSelectRC);

		// row gallery padding
		this.elementEdit_init(this.container.getElement('.xRowGalleryPadding'), this.options.xBertaEditorClassRC);

		// close link
		this.container.getElement('a.xEntryGalCloseLink').addEvent('click', this.onCloseClick.bindWithEvent(this));

		// caption fields
		this.container.getElements('div.xEGEImageCaption').each(function(item) {
			this.elementEdit_init(item, this.options.xBertaEditorClassMCE);
		}, this);

		// poster frame uploader
		this.addElementPosterUploader();

		//video autoplay button
		this.container.getElements('.xEditableRealCheck').each(function(el) {
			this.elementEdit_init(el, this.options.xEditableRealCheck);
		}, this);

		// main uploader
		this.addMainUploader();

		this.fireEvent('attach');
	},


	detach: function() {
		this.container.getElements('.xEntrySetGalType a').removeEvents();
		this.sortingDeactivate();
		this.processHandler.removeObservable(this);

		if(this.uploader.box) this.uploader.box.empty();
		this.allContainer.empty();
	},



	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////  APPEARANCE  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	addMainUploader: function() {
    this.uploader = new BertaGalleryUploader(this);
	},

	addUploadedElement: function(container, uploaResponseJSON) {

		var targetElDims = { w: null, h: null };

		if(uploaResponseJSON.get('type') == 'image') {
			// create the image element inside the LI element
			new Element('img', {
				'class': 'img',
				'src': uploaResponseJSON.get('smallthumb_path'),
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

		new Element('a', {
			'href': '#',
			'class': 'crop',
			'data-src': uploaResponseJSON.get('path_orig'),
			'events': {
				'click': this.onCropClick.bindWithEvent(this)
			}
		}).inject(container);

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

		if(uploaResponseJSON.get('type') == 'video') {
			container.addClass('video');
			targetElDims.w = 150;
			targetElDims.h = 80;

			var fileInput = new Element('input', {'type': 'file'});
      var posterLink = new Element('a', { 'class': 'poster', 'href': '#', 'html': 'upload poster image' });
			new Element('DIV', {
				'class': 'dimsForm'
			}).adopt(
				new Element('div', { 'class': 'posterContainer' }),
        fileInput,
				posterLink
			).inject(container);

			var autoPlayCheckbox = new Element('span', { 'class': 'xEditableRealCheck xProperty-videoAutoplay xParam-'+uploaResponseJSON.get('filename'), 'text': 0 });
			this.elementEdit_init(autoPlayCheckbox, this.options.xEditableRealCheck);
			var autoPlayLabel =  new Element('label', { 'html': 'autoplay' });
			autoPlayCheckbox.inject(autoPlayLabel, 'top');
			new Element('div', { 'class': 'xAutoPlay' }).adopt(
				autoPlayLabel
			).inject(container);

			this.addElementPosterUploader.delay(1000, this, [ posterLink ]);
		}

		container.removeClass('file').removeClass('file-success');

		// add common properties, events, and add to sortables
		container.set('filename', uploaResponseJSON.get('filename'));
		container.set('filetype', uploaResponseJSON.get('type'));
		container.set('class', uploaResponseJSON.get('type'));
		container.addEvent('mouseenter', this.onElementHover.bindWithEvent(this));
		container.addEvent('mouseleave', this.onElementUnhover.bindWithEvent(this));
		this.sortingAddElement(container);
	},


	addElementPosterUploader: function(uploadLinkElement) {
		var links = uploadLinkElement ? [ uploadLinkElement ] : this.allContainer.getElements('a.poster');

		links.each(function(posterLink) {
			var liElement = posterLink.getParent('li.video');
			var videoSrc = liElement.get('filename');

      var uploader = new BertaPosterUploader(this, posterLink, videoSrc);
		}, this);
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

		var data = {
				section: this.sectionName, entry: this.entryId,
				property: 'galleryOrder', value: newOrder
			};
		console.log('BertaGalleryEditor.sortingSaveDo:', data);
		new Request.JSON({
			url: this.options.updateUrl,
			data: "json=" + JSON.encode(data),
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
			var data = {
					section: this.sectionName, entry: this.entryId,
					property: 'galleryImageDelete', value: liElement.get('filename')
				};
			console.log('BertaGalleryEditor.onDeleteClick:', data);
			new Request.JSON({
				url: this.options.updateUrl,
				data: "json=" + JSON.encode(data),
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

	onCropClick: function(event) {
		event = new Event(event).stop();
		var target = $(event.target);
		var editor = this;
		var galleryEditor = target.getParent('.xEntryGalleryEditor');
		var media = galleryEditor.getElement('.xEntryGalleryAddMedia');
		var images = galleryEditor.getElement('.images');
		var cropToolbox = galleryEditor.getElement('.xEntryGalleryCrop');
		var checkBoard = cropToolbox.getElement('.checkBoard');
		var cancel = cropToolbox.getElement('.cancel');
		var cropImage = cropToolbox.getElement('.cropImage');
    var id = 'el' + new Date().getTime();
    var imageSrc = target.get('data-src');
    var imageThumb = target.getPrevious('img');
    var liEl = target.getParent('li');
    var filename = liEl.get('filename');
    var topInput = cropToolbox.getElement('.topReal');
		var leftInput = cropToolbox.getElement('.leftReal');
		var widthInput = cropToolbox.getElement('.widthReal');
		var heightInput = cropToolbox.getElement('.heightReal');
		var widthOrigUI = cropToolbox.getElement('.widthOrigUI');
		var heightOrigUI = cropToolbox.getElement('.heightOrigUI');
		var ratio = cropToolbox.getElement('.ratio');
		var processCrop = cropToolbox.getElement('.processCrop');
		var loader = checkBoard.getElement('.loader');
		var manualInput = false;
		var manualInputHeight = false;
		var manualInputWidth = false;

		loader.addClass('xHidden');
		$$(cancel, processCrop).removeProperty('disabled');

		$$(media, images).addClass('xHidden');
		cropToolbox.removeClass('xHidden');

		cancel.addEvent('click', function(e){
			try {
        e.stop();
      } catch(err){
      }
			cropToolbox.addClass('xHidden');
			$$(media, images).removeClass('xHidden');
		});

		//delete old lasso
		var oldLasso = cropImage.getNext('div');
		if (oldLasso) {
			oldLasso.destroy();
		}

		Asset.image(imageSrc, {
		    onLoad: function() {

		    cropImage.set('src', imageSrc);
				cropImage.set('id', id);
				cropImage.setStyle('display', 'block');

				var origImage = new Image();
				origImage.src = imageSrc;

				origImage.onload = function(){

					var widthOrig = origImage.width;
					var heightOrig = origImage.height;
					widthOrigUI.set('text', widthOrig);
					heightOrigUI.set('text', heightOrig);

					var diffPercent = 1;
					var widthReal = 0;
					var heightReal = 0;
					var leftReal = 0;
					var topReal = 0;

					var lasso = new Lasso.Crop(id,{
						preset : [0,0,120,120],
						min: [10,10],
						color: '#000',
						border: '#000',
						opacity: 0.5,
						onResize: function(crop) {

							var widthContainer = cropImage.getNext().getSize().x;
							var widthCrop = crop.w;
							var heightCrop = crop.h;
							var leftCrop = crop.x;
							var topCrop = crop.y;

							diffPercent = 100 * widthOrig / widthContainer;
							widthReal = widthCrop * diffPercent / 100;
							heightReal = heightCrop * diffPercent / 100;
							leftReal = Math.round(leftCrop * diffPercent / 100);
							topReal = Math.round(topCrop * diffPercent / 100);

							widthReal = widthReal > widthOrig ? widthOrig : (parseInt(widthReal));
							heightReal = heightReal > heightOrig ? heightOrig : Math.round(heightReal);

							topInput.set('value', topReal);
							leftInput.set('value', leftReal);

							if ( !manualInputWidth && (!manualInput || leftReal+widthReal>=widthOrig) ) {
								widthInput.set('value', widthReal);
							}
							if ( !manualInputHeight && (!manualInput || topReal+heightReal>=heightOrig) ) {
								heightInput.set('value', heightReal);
							}

							manualInput = false;
							manualInputWidth = false;
							manualInputHeight = false;
						}
					});

					var cropWrapper = cropImage.getNext();

					//align image in middle
					cropWrapper.setStyles({
						'margin-left': Math.round((checkBoard.getSize().x - cropWrapper.getSize().x) / 2) + 'px',
						'margin-top': Math.round((checkBoard.getSize().y - cropWrapper.getSize().y) / 2) + 'px'
					});

					$$(widthInput, heightInput).addEvent('keyup',function(event){

						manualInput = true;

						if ( ratio.hasClass('ratioOn') ) {
							try {
								var inputCoord = $(event.target);

								if (inputCoord == widthInput) {
									manualInputWidth = true;
									heightInput.set('value', Math.round(parseInt(inputCoord.get('value')) * lasso.options.ratio[1] / 100));
								}
								if (inputCoord == heightInput) {
									manualInputHeight = true;
									widthInput.set('value', Math.round(parseInt(inputCoord.get('value')) * 100 / lasso.options.ratio[1]));
								}
							}catch(err){}
						}

						var x = parseInt(widthInput.get('value')) || 0;
						var y = parseInt(heightInput.get('value')) || 0;
						var cropX = Math.round(x * 100 / diffPercent);
						var cropY = Math.round(y * 100 / diffPercent);

						lasso.options.preset = [lasso.coords.left, lasso.coords.top, lasso.coords.left+cropX, lasso.coords.top+cropY];
						lasso.resetCoords();
						lasso.setDefault();
					});

					var _berta_crop_width = Cookie.read('_berta_crop_width');
					var _berta_crop_height = Cookie.read('_berta_crop_height');

					if (_berta_crop_width && _berta_crop_height){
						widthInput.set('value', _berta_crop_width);
						heightInput.set('value', _berta_crop_height);
						widthInput.fireEvent('keyup');
					}

					var _berta_crop_ratio = Cookie.read('_berta_crop_ratio');

					if (_berta_crop_ratio){
						ratio.addClass('ratioOn');
					}

					ratio.removeEvents().addEvent('setRatio', function(){

						if ( ratio.hasClass('ratioOn') ) {

							if (widthReal && heightReal) {
								lasso.options.ratio = [100, heightReal * 100 / widthReal];
							}else if (_berta_crop_width && _berta_crop_height){
								lasso.options.ratio = [100, _berta_crop_height * 100 / _berta_crop_width];
							}else{
								lasso.options.ratio = [1,1];
							}
						}else {
							lasso.options.ratio = false;
						}

						lasso.options.preset = [lasso.coords.left, lasso.coords.top, lasso.coords.left + lasso.coords.w, lasso.coords.top + lasso.coords.h];

						lasso.resetCoords();
						lasso.setDefault();
					});

					ratio.fireEvent('setRatio');

					ratio.addEvent('click', function(event){
						if ( ratio.hasClass('ratioOn') ) {
							ratio.removeClass('ratioOn');
							Cookie.dispose('_berta_crop_ratio');
						}else{
							ratio.addClass('ratioOn');
							Cookie.write('_berta_crop_ratio', 1);
						}
						ratio.fireEvent('setRatio');
					});

					processCrop.removeEvents().addEvent('click', function(){

						Cookie.write('_berta_crop_width', widthReal);
						Cookie.write('_berta_crop_height', heightReal);

						$$(cancel, processCrop).set('disabled', 'disabled');
						loader.removeClass('xHidden');

						//center loader
						loader.setStyles({
							'top': Math.round( checkBoard.getSize().y / 2 - loader.getSize().y / 2 ) + 'px',
							'left': Math.round( checkBoard.getSize().x / 2 - loader.getSize().x / 2 ) + 'px'
						});

						var data = {
								section: editor.sectionName, entry: editor.entryId,
								property: 'galleryImageCrop',
								value: filename,
								x: leftInput.get('value'),
								y: topInput.get('value'),
								w: widthInput.get('value'),
								h: heightInput.get('value')
							};
						console.log('BertaGalleryEditor.onCropClick:', data);
						new Request.JSON({
							url: editor.options.updateUrl,
							data: "json=" + JSON.encode(data),
							onComplete: function(resp) {
								imageThumb.src = resp.params.smallThumb;
								liEl.set('filename', resp.update);
								target.set('data-src', resp.params.path+resp.update);
								liEl.getElement('.xEGEImageCaption').removeClass('xParam-'+resp.real).addClass('xParam-'+resp.update);
								cancel.fireEvent('click');
								loader.addClass('xHidden');
								$$(processCrop, cancel).removeProperty('disabled');
							}
						}).post();

					});
				};
		    }
		});
	},

	onGalTabClick: function(event) {
		event.stop();
		var target = $(event.target);
		var tabsContainer = target.getParent('.xEntryGalleryMenu');

		var media = tabsContainer.getSiblings('.images');
		var addMedia = tabsContainer.getSiblings('.xEntryGalleryAddMedia');
		var cropToolbox = tabsContainer.getSiblings('.xEntryGalleryCrop');
		var settings = tabsContainer.getSiblings('.xEntryGallerySettings');
		var fullscreen = tabsContainer.getSiblings('.xEntryGalleryFullScreen');
		var imageSize = tabsContainer.getSiblings('.xEntryGalleryImageSize');

		var tab = target.getClassStoredValue('xParams');

		cropToolbox.addClass('xHidden');

		if(tab == 'media') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');

			$$(settings, fullscreen, imageSize).addClass('xHidden');
			$$(media, addMedia).removeClass('xHidden');
		}

		if(tab == 'media_settings') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');

			$$(media,  addMedia, fullscreen, imageSize).addClass('xHidden');
			settings.removeClass('xHidden');
		}

		if(tab == 'fullscreen') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');

			$$(media, addMedia, settings, imageSize).addClass('xHidden');
			fullscreen.removeClass('xHidden');
		}

		if(tab == 'image_size') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');

			$$(media, addMedia, settings, fullscreen).addClass('xHidden');
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
