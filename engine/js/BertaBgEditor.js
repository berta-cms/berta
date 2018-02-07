var BertaBgEditor = new Class({

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


  initialize: function(bgEditorContainerElement, options) {
    var query = window.location.search.replace('?', '').parseQueryString();
    if (query.site) {
      this.options.updateUrl = this.options.updateUrl + "?site=" + query.site;
      this.options.elementsUrl = this.options.elementsUrl + "?site=" + query.site;
    }
    this.setOptions(options);
    this.tinyMCE_ConfigurationsInit();
    this.allContainer = bgEditorContainerElement;

    var selectedSection = this.allContainer.getParent().getElement('.menuItemSelected');
    this.sectionName = this.getSectionNameForElement(selectedSection);

    this.processHandler = new UnlinearProcessHandler(); // singleton process handler
    this.processHandler.addObservable(this);

    // load the editor html from the server
		this.allContainer.addClass('xSavingAtLarge');
		var data = function(obj) {
			var _data = {
				'section': obj.sectionName, 'property': 'bgEditor'
			};
			console.log('BertaBgEditor.initialize:', _data);
			return _data;
		};
		new Request.HTML({
			url: this.options.elementsUrl,
			update: this.allContainer,
			onComplete: function(resp) {
				//console.debug(resp);
				this.allContainer.removeClass('xSavingAtLarge');
				this.attach.delay(10, this);
				this.fireEvent('load');
			}.bind(this)
		}).post({"json": JSON.encode(data(this))
		});
	},

	attach: function() {

		this.container = this.allContainer.getElement('#xBgEditorPanel');
		this.strip = this.container.getElement('.images ul');

		this.sortingInit();

		this.strip.getElements('a.delete').addEvent('click', this.onDeleteClick.bindWithEvent(this));
		this.strip.getElements('li').addEvent('mouseenter', this.onElementHover.bindWithEvent(this));
		this.strip.getElements('li').addEvent('mouseleave', this.onElementUnhover.bindWithEvent(this));
		this.strip.getElements('li img').addEvent('click', this.onElementEditClick.bindWithEvent(this));

		this.uploadQueueProcessId = this.unlinearProcess_getId('upload-queue');
		this.sortingProcessId = this.unlinearProcess_getId('sorting-save');

		// tabs handle
		this.container.getElements('.xBgEditorTabs div.tab a').each(function(item) {
			item.addEvent('click', this.onGalTabClick.bindWithEvent(this));
		}, this);

		// autoplay handle
		this.elementEdit_init(this.container.getElement('.xBgAutoPlay'), this.options.xBertaEditorClassRC);

		// bg color handle
		this.container.getElements('.xBgColor').each(function(item) {
			this.elementEdit_init(item, this.options.xBertaEditorClassColor)
		}, this);

		// bg size handle
		this.elementEdit_init(this.container.getElement('.xBgImgSize'), this.options.xBertaEditorClassSelectRC);

		// bg Navigation handle
		this.elementEdit_init(this.container.getElement('.xBgNavigation'), this.options.xBertaEditorClassSelectRC);

		// bg animation handle
		this.elementEdit_init(this.container.getElement('.xBgAnimation'), this.options.xBertaEditorClassSelectRC);

		// bg fade content handle
		this.elementEdit_init(this.container.getElement('.xBgFading'), this.options.xBertaEditorClassSelectRC);

		// reset bg colors handler
		this.container.getElements('.xBgColorReset a').each(function(item) {
			this.elementEdit_init(item.getParent('div'), this.options.xBertaEditorClassReset);
		}, this);

		// close link
		this.container.getElement('a.xBgEditorCloseLink').addEvent('click', this.onCloseClick.bindWithEvent(this));

		// caption fields
		this.container.getElements('div.xEGEImageCaption').each(function(item) {
			this.elementEdit_init(item, this.options.xBertaEditorClassMCE);
		}, this);

		// main uploader
		this.addMainUploader();

		this.fireEvent('attach');
	},


	detach: function() {
		this.sortingDeactivate();
		this.processHandler.removeObservable(this);

		if(this.uploader.box) this.uploader.box.empty();
		this.container.empty();
	},



	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////  APPEARANCE  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	addMainUploader: function() {
    this.uploader = new BertaGalleryUploader(this);
	},

	addUploadedElement: function(container, uploaResponseJSON) {
    var file_idx = $(this.container).getElements('div.images>ul>li.image').length;
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
		new Element('a', {
			'href': '#', 'class': 'delete',
			'events': {
				'click': this.onDeleteClick.bindWithEvent(this)
			}
		}).inject(container);

    //add caption editor
    var site = getCurrentSite();
    var section_idx = redux_store.getState()
          .sections.getIn([site, 'section']).toJSON()
          .findIndex(function(section) {
            return section.name === this.sectionName;
          }.bind(this));
    var path = site + '/section/' + section_idx + '/mediaCacheData/file/' + file_idx + '/@value';
		var caption = new Element('div',
			{
			'class': 'xEGEImageCaption xEditableMCESimple xProperty-galleryImageCaption xCaption-caption xParam-'+uploaResponseJSON.get('filename')+' xEditableMCE'
			}).set('html','<span class="xEmpty">&nbsp;caption&nbsp;</span>'
			).inject(container);
      caption.set('data-path', path).data('data-path', true);

		//console.log(caption);
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

    var site = getCurrentSite();

    redux_store.dispatch(Actions.sectionBgOrder(
      site,
      this.sectionName,
      newOrder,
      function(resp) {
        var captions = $(this.container).getElements('.xProperty-galleryImageCaption');
        var site = getCurrentSite();
        var section_idx = redux_store.getState()
              .sections.getIn([site, 'section']).toJSON()
              .findIndex(function(section) {
                return section.name === this.sectionName;
              }.bind(this));
        var basePath = site + '/section/' + section_idx + '/mediaCacheData/file/';

        captions.forEach(function(caption, idx) {
          var path = basePath + idx + '/@value';
          caption.set('data-path', path).data('data-path', true);
        });

        this.unlinearProcess_stop(this.sortingProcessId);
      }.bind(this)
    ));
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

      var site = getCurrentSite();

      redux_store.dispatch(Actions.sectionBgDelete(
        site,
        this.sectionName,
        liElement.get('filename'),
        function(resp) {
          this.unlinearProcess_stop(deleteProcessId);
          if(!resp.error_message) {
            liElement.destroy();
          } else {
            liElement.setStyle('display', 'block');
            this.sortingAddElement(liElement);
            alert(resp.error_message);
          }
          this.sortingSave();
        }.bind(this)
      ));

    }
  },

/*
  initTabs: function() {
    var target = this.container;
    var addMedia = target.getChildren('.xBgMedia')
    var settings = target.getChildren('.xBgMediaSettings');
  },
*/

	onGalTabClick: function(event) {
		event.stop();
		var target = $(event.target);
		var tabsContainer = target.getParent('.xBgEditorTabs');

		var media = tabsContainer.getSiblings('.images');
		var addMedia = tabsContainer.getSiblings('.xBgAddMedia');
		var settings = tabsContainer.getSiblings('.xBgSettings');
		var imageSize = tabsContainer.getSiblings('.xBgImgSizeSettings');
		var slideshowSettings = tabsContainer.getSiblings('.xBgSlideshowSettings');

		var tab = target.getClassStoredValue('xParams');

		if(tab == 'media') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');

			$$(settings, imageSize, slideshowSettings).addClass('xHidden');
			$$(media, addMedia).removeClass('xHidden');
		} else if(tab == 'settings') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');

			$$(media, addMedia, imageSize, slideshowSettings).addClass('xHidden');
			settings.removeClass('xHidden');
		} else if(tab == 'image_size_settings') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');

			$$(media, addMedia, settings, slideshowSettings).addClass('xHidden');
			imageSize.removeClass('xHidden');
		} else if(tab == 'slideshow_settings') {
			tabsContainer.getElements('.tab a').removeClass('selected');
			target.addClass('selected');

			$$(media, addMedia, settings, imageSize).addClass('xHidden');
			slideshowSettings.removeClass('xHidden');
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
