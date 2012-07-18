

if(window.FancyUpload2) {
	var myFancyUpload2 = new Class({
    	Extends: FancyUpload2,
		showProgressBars: function() {
		//	console.log('show progres bars');
			this.status.getElements('.xFUProgress').setStyle('display', 'block').fade('hide').fade('in');
		},
		hideProgressBars: function() {
			//console.log('hide progres bars');
			this.status.getElements('.xFUProgress').each(function(el) {
				el.fade('out').retrieve('tween').chain(Element.setStyle.bind(Element, [el, 'display', 'none']));
			});
		},
		changeUploadURL: function(url) {
			this.options.url = url;
		}
	});
}


var BertaEditor = new Class({
	
	Extends: BertaEditorBase,
	Implements: [ Options, UnlinearProcessDispatcher, Events ],
	
	options: {
		tips: {
			'section_delete': 'Delete this section',
			'section_add': 'Create a new section',
			'default_tag': 'Set this tag as default tag to show when a visitor opens this section',
			'entry_delete': 'Delete this entry', 
			'image_delete': 'Delete this image',
			'video_attach': 'Choose a video file to upload', 
			'video_delete': 'Detach and delete this video'
		},
		
		paths: null,
	},
	
	/* editing related variables */
	edittingMode: 'entries',
	galleries: new Array(),
	galleryEditors: new Array(),	// contains all instances of BertaGalleryEditor
	processHandler: null, 			// an instance of UnlinearProcessHandler
	
	/* DOM elements */
	entriesList: null,				// the OL element thad contains the entries
	newsTickerContainer: null,
    subMenu: null,

	/* variables containing information */
	currentSection: null,			// the name of the section opened
	currentTag: null,				// the name of the tag selected
	
	
	
	/* old */
    submenuSortables: new Array(),
	orderSortables: null,
	tagsMenu: null,
	tips: null,
	mooRainbow: null,
	/* old */
	
	
	initialize: function(options) {
		this.setOptions(options);
		this.initConsoleReplacement();
		this.tinyMCE_ConfigurationsInit();
		
		this.processHandler = new UnlinearProcessHandler();
		this.processHandler.addObservable(this);
		this.processHandler.test = 'aaa';

		window.addEvent('domready', this.onDOMReady.bindWithEvent(this));
		window.addEvent('load', this.onLoad.bindWithEvent(this));
	},
	
	onDOMReady: function() {
		// delay onDOMReady processing to allow all elements on page properly initialize
		this.onDOMReadyDo.delay(1000, this);

		if(window.tinyMCE_GZ) {
			tinyMCE_GZ.init({
				themes : "advanced",
				plugins : "save,paste,insertanything",
				languages : "en",
				disk_cache : true
			}/*, this.tinyMCE_init.bind(this)*/);
		}
		
		this.bgImageInit();
	},
	
	onDOMReadyDo: function() {

		this.edittingMode = $$('body')[0].get('x_mode');
		if(!this.edittingMode) this.edittingMode = 'entries';
		
		// init news ticker
		this.initNewsTicker();

		switch(this.edittingMode) {
						
			case 'settings':
			
				this.editablesInit();
				
				// action links
				$$(this.options.xActionClass).each(function(el) {
					this.elementEdit_init(el, this.options.xBertaEditorClassAction);
				}, this);
				
				var maxH = 0;
				if($('settingsTabs')) {
					var tabsDims = $('settingsTabs').getSize();
					$('settingsContentContainer').getElements('.settingsContent').each(function(el) {
						var dims = el.getSize();
						maxH = Math.max(maxH, dims.y);
						el.setStyle('top', (tabsDims.y) + 'px');
					});
					$('settingsContentContainer').setStyle('height', (maxH + 20) + 'px');
					this.tabsInit.delay(300);
				}
				
				if($('xNewsTickerContainer')) this.hideNewsTicker();

				break;
			
			case 'entries':
			default:
				
				this.container = document.getElementById('contentContainer');
				this.entriesList = $$('.xEntriesList')[0];
				
				// section background editing
				if($('xBgEditorPanelTrig')) $('xBgEditorPanelTrig').addEvent('click', this.onBgEditClick.bindWithEvent(this));

				if(this.newsTickerContainer) {
					this.hideNewsTicker.delay(7000);
				}

				// Tutorial videos
				this.bertaVideosInit();	
				
				if(this.entriesList) {
				
					this.currentSection = this.entriesList.getClassStoredValue('xSection');
					this.currentTag = this.entriesList.getClassStoredValue('xTag');								
					
					if(this.currentSection) {
						this.entriesList.getElements('.xEntry .xEntryEditWrap').addEvent('mouseenter', this.entryOnHover.bindWithEvent(this));
						this.entriesList.getElements('.xEntry .xEntryEditWrap').addEvent('mouseleave', this.entryOnUnHover.bindWithEvent(this));
				
						this.entriesList.getElements('.xEntry .xEntryDropdown').addEvent('mouseenter', this.entryDropdownToggle.bindWithEvent(this));
						this.entriesList.getElements('.xEntry .xEntryDropdown').addEvent('click', this.entryDropdownToggle.bindWithEvent(this));

                        if($$('.subMenu')) this.subMenu = $$('.subMenu');
                        if(this.subMenu) this.submenuSortingInit();
												
						this.entriesList.getElements('.xEntry .xEntryDropdownBox').addEvents({
						 	mouseleave: function(event){
						 		this.removeClass('xVisible');
								dropdown = this.getParent().getElement('.xEntryDropdown');
								dropdown.removeClass('xEntryDropdowHover');						    
						    }														
						});												

						// entry deleting and creating
						if(this.options.templateName.substr(0,5) != 'messy')
							createNewEntryText = this.options.i18n['create new entry here'];
						else
							createNewEntryText = this.options.i18n['create new entry'];
						new Element('A', { 'class': 'xCreateNewEntry xPanel xAction-entryCreateNew', 'href': '#'}).adopt(
							new Element('span', { 'html': createNewEntryText })
						).inject(this.entriesList, 'after');
						$$('.xEntryDelete').addEvent('click', this.entryDelete.bindWithEvent(this));
						$$('.xCreateNewEntry').addEvent('click', this.entryCreate.bindWithEvent(this));
						
						// galleries
						this.entriesList.getElements('.xGalleryContainer').each(function(item) {
							var g = new BertaGallery(item, { 
								environment: this.options.environment,
								engineRoot: this.options.paths.engineRoot, 
								engineABSRoot: this.options.paths.engineABSRoot, 
								playerType: this.options.videoPlayerType,
								slideshowAutoRewind: this.options.slideshowAutoRewind });
							this.galleries.push(g);
						}.bind(this));
						this.entriesList.getElements('.xGalleryEditButton').addEvent('click', this.onGalleryEditClick.bindWithEvent(this));
				
						// editables
						this.editablesInit();
				
						// entry sorting
						if(!this.entriesList.hasClass('xNoEntryOrdering')) {
							this.orderSortables = new Sortables(this.entriesList, {
							    handle: '.xEntryMove',
								constrain: true,
							    clone: true,
								opacity: 0.3,
							    revert: true,
								onComplete: function(el) {
									this.entriesList.getElements('.xCreateNewEntry').setStyle('visibility', 'visible');
									this.entryOrderSave(el);
								}.bind(this),
								onStart: function(el, clone) { 
									this.entriesList.getElements('.xCreateNewEntry').setStyle('visibility', 'hidden');
								}.bind(this)
							});
						}
						
						this.highlightNewEntry.delay(100, this);

					} else if(!this.currentSection) {
                        this.container.getElement('h1').hide();
					}
				} else {
					this.editablesInit();
				}
				break;
		} 

	},
	
	
	onLoad: function() {

	},
	
	
	
	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///|  INIT  |/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	editablesInit: function() {	// instantiate all xEditable elements in the page
		// simple text fields ///////////////////////////////////////////////////////////////////////////////////////////////////////
		$$(this.options.xBertaEditorClassSimple).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassSimple) }.bind(this));
		
		// textareas ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		$$(this.options.xBertaEditorClassTA).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassTA) }.bind(this));
		
		// mce textareas ////////////////////////////////////////////////////////////////////////////////////////////////////////////
		$$(this.options.xBertaEditorClassMCE).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassMCE) }.bind(this));
		$$(this.options.xBertaEditorClassMCESimple).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassMCE) }.bind(this));
		
		// "real content" fields ////////////////////////////////////////////////////////////////////////////////////////////////////
		$$(this.options.xBertaEditorClassRC).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassRC) }.bind(this));
		
		// selects and font-selects /////////////////////////////////////////////////////////////////////////////////////////////////
		$$(this.options.xBertaEditorClassFontSelect).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassFontSelect) }.bind(this));
		$$(this.options.xBertaEditorClassSelect).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassSelect) }.bind(this));
		$$(this.options.xBertaEditorClassSelectRC).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassSelectRC) }.bind(this));
		
		// color edit field (settings page) /////////////////////////////////////////////////////////////////////////////////////////
		$$(this.options.xBertaEditorClassColor).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassColor) }.bind(this));
		
		// dragging /////////////////////////////////////////////////////////////////////////////////////////
		$$(this.options.xBertaEditorClassDragXY).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassDragXY) }.bind(this));
		
		// input fields //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		$$(this.options.xEditableRealCheck).each(function(el) { this.elementEdit_init(el, this.options.xEditableRealCheck) }.bind(this));
		
		// uploads //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		$$(this.options.xBertaEditorClassImage).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassImage) }.bind(this));
		$$(this.options.xBertaEditorClassICO).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassICO) }.bind(this));


		this.fireEvent(BertaEditor.EDITABLES_INIT);
	},
	

	highlightNewEntry: function() {
		var idToHighlight = Cookie.read('_berta__entry_highlight');
		Cookie.dispose('_berta__entry_highlight', { path: this.options.paths.engineABSRoot });
		if(idToHighlight) {
			var entry = this.entriesList.getElement('.xEntryId-' + idToHighlight);
			if(entry) {
				var pos = entry.getPosition();
				window.scrollTo(pos.x, pos.y);
			}
		}
	},

	tabsInit: function() {
		var tabs = new MGFX.Tabs('.settingsTab','.settingsContent', {
			autoplay: false,
			transitionDuration: 100,
			slideInterval: 6000
		});
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
		var imContainer = $('xFilledBackground');
		var im = imContainer.getElement('img');
		var wOrig = im.width, hOrig = im.height;
		
		var imAlignment = imContainer.getClassStoredValue('xPosition');
		imContainer.setStyle('display', 'block')
		
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


	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///|  Gallery  |//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	onBgEditClick: function(event) {
		event.stop();
		
		var bgEditorPanel = null;
		var bgEditorContainer = $('xBgEditorPanelContainer');
		
		var bBgEditor = new BertaBgEditor(bgEditorContainer, { 
			engineRoot: this.options.paths.engineRoot,
		    flashUploadEnabled: this.options.flashUploadEnabled
		});
		

		bBgEditor.addEvent('load', function() {
			this.fireEvent(BertaEditorBase.EDITABLE_START, [bgEditorContainer, bBgEditor]);
			event.target.hide();
		}.bind(this));

		bBgEditor.addEvent('close', function() {
			bgEditorPanel = $('xBgEditorPanel');
		    bgEditorPanel.destroy(); bgEditorPanel.dispose();
		    bBgEditor = null;
		    event.target.show();
		    this.fireEvent(BertaEditorBase.EDITABLE_FINISH, [bgEditorContainer, bBgEditor]);
		}.bind(this));
		
		//console.debug(this);
	},

	onGalleryEditClick: function(event) {	// replaces the gallery with gallery editor
		event.stop();
		
		var galleryContainer = $(event.target).getParent('.xGalleryContainer');
		
		var galleryInstance, galleryInstanceIndex;
		if(this.galleries.some(function(item, index) { 
			//console.debug(item.container, galleryContainer, $(item.container) == $(galleryContainer));
			// if the containers match then this is the right gallery instance
			if($(item.container) == $(galleryContainer)) {
				galleryInstance = item;
				galleryInstanceIndex = index;
				return true;
			}
			return false;
		})) {
			
			// remove the gallery instance
			galleryInstance.detach();
			this.galleries.splice(galleryInstanceIndex, 1);
			
			// instantiate the gallery editor
			var bGEditor = new BertaGalleryEditor(galleryContainer, { 
				engineRoot: this.options.paths.engineRoot,
				flashUploadEnabled: this.options.flashUploadEnabled
			});
			//this.processHandler.addObservable(bGEditor);
			this.galleryEditors.push(bGEditor);

			bGEditor.addEvent('load', function() {
				this.fireEvent(BertaEditorBase.EDITABLE_START, [galleryContainer, bGEditor]);
			}.bind(this));

			// onClose destroys the editor, removes its instance and loads the gallery back
			bGEditor.addEvent('close', function() {
				//this.processHandler.removeObservable(bGEditor);
				var eIdx = this.galleryEditors.indexOf(bGEditor);
				if(eIdx >= 0) {
					this.galleryEditors.splice(eIdx);
				}
				bGEditor = null;
				
				this.galleryLoad(galleryContainer);
				
				if(this.options.templateName.substr(0,5) == 'messy') {
					$$('.xCreateNewEntry').show();
					$('xTopPanelContainer').show();
					$('xBgEditorPanelTrigContainer').show();
					$$('.xEntry .xCreateNewEntry').hide();
				}
				
			}.bind(this));
		}
	},
	
	galleryLoad: function(container) { // load the gallery HTML into the container
		container.addClass('xSavingAtLarge');
		new Request.HTML({
			url: this.options.elementsUrl, 
			update: container,
			onComplete: function(resp) {
				container.removeClass('xSavingAtLarge');
								
				// for some mysterious reason, mootools somehow looses track of what is what
				container = container.getElement('.xGalleryEditButton').getParent('.xGalleryContainer');
			
				// instantiate the gallery for the container
				var g = new BertaGallery(container, { 
					environment: this.options.environment,
					engineRoot: this.options.paths.engineRoot, 
					engineABSRoot: this.options.paths.engineABSRoot, 
					playerType: this.options.videoPlayerType,
					slideshowAutoRewind: this.options.slideshowAutoRewind });
				this.galleries.push(g);
				
				// add the "edit gallery" link event
				container.getElement('.xGalleryEditButton').addEvent('click', this.onGalleryEditClick.bindWithEvent(this));
				
				this.fireEvent(BertaEditorBase.EDITABLE_FINISH, [container]);

			}.bind(this)
		}).post({"json": JSON.encode({
				'section': this.currentSection, 'entry': container.getParent('.xEntry').getClassStoredValue('xEntryId'), 'property': 'gallery'
			})
		});
		
		
	},
	
	


	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///|  Tag management  |///////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	
	tagsSetDefault: function(tag) {
		new Request.JSON({
			url: this.options.updateUrl,
			data: "json=" + JSON.encode({
				section: $$('ol.blogroll')[0].getProperty('section'), entry: null, entryNum: null, 
				property: 'tagsSetDefault', value: tag
			}),
			onComplete: function(resp) { 
				
			}.bind(this)
		}).post();
	},
	
	



	
	
	
	
	
	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///|  Entry Management  |/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	entryCreate: function(event) {
		event = new Event(event).stop();
		var target = $(event.target);
		if(target.tagName != 'A') target = target.getParent('a');
		
		if(this.processHandler.isIdleOrWarnIfBusy()) {
			target.addClass('xSaving');
			var entryInfo = this.getEntryInfoForElement(target);
			new Request.JSON({
				url: this.options.updateUrl,
				data: "json=" + JSON.encode({
					section: this.currentSection, tag: this.currentTag, entry: null, action: 'CREATE_NEW_ENTRY', value: null, 
					mediafolder: '', before_entry: entryInfo.entryId
				}),
				onComplete: function(resp) { 
					//console.debug(resp);
					if(!resp.error_message && resp.update && resp.update.entryid) {
						Cookie.write('_berta__entry_highlight', resp.update.entryid, { path: this.options.paths.engineABSRoot });
						window.location.reload();
						/*var li = new Element('li', { class: 'entry', entryid: resp.entryid, entrynum: resp.entryNum });
						li.set('html', resp.update);
						li.injectBefore($$('.blogroll .entry')[0]);*/
					} else {
						alert(resp.error_message);
						target.removeClass('xSaving');
					}
				}.bindWithEvent(this)
			}).post();
		}
	},
	
	entryDelete: function(event) {
		event = new Event(event).stop();
		
		if(this.processHandler.isIdleOrWarnIfBusy()) {
			if(confirm("Berta asks:\n\nAre you sure you want to delete this entry along with all the images and other stuff it has attached and never have it back and never regret it afterwards?")) {
				var btn = $(event.target);
				var entryObj = $(event.target).getParent('.xEntry');
				
				btn.setProperty('display', 'none');
				entryObj.addClass('xSavingAtLarge');
				
				var deleteProcessId = this.unlinearProcess_getId('delete-entry');
				//var entryTitleEl = entryObj.getElement('h2');
				this.unlinearProcess_start(deleteProcessId, 'Deleting entry');
				
				new Request.JSON({
					url: this.options.updateUrl, 
					data: "json=" + JSON.encode({
						section: this.currentSection, entry: entryObj.getClassStoredValue('xEntryId'), action: 'DELETE_ENTRY', value: entryObj.getClassStoredValue('xEntryId')
					}),
					onComplete: function(resp, entryInfo, deleteLink, eText) { 
						if(!resp) {
							alert('Berta says, there was a server error while deleting this entry! Something has gone sooooo wrong...');
						
						} else if(resp && !resp.error_message) {
							this.unlinearProcess_stop(deleteProcessId);
							entryObj.destroy();
						} else {
							alert(resp.error_message);
							btn.setProperty('display', 'inline');
							entryObj.removeClass('xSavingAtLarge');
						}
					}.bindWithEvent(this)
				}).post();
			}
		}
	},
	
	entryOrderSave: function(elJustMoved) {
		var elId = elJustMoved.getClassStoredValue('xEntryId')
		var next = elJustMoved.getNext('.xEntry');
		var nextId = next ? next.getClassStoredValue('xEntryId') : null;
		
		new Request.JSON({
			url: this.options.updateUrl,
			data: "json=" + JSON.encode({
				section: this.currentSection, entry: elId, entryNum: null, 
				action: 'PUT_BEFORE', property: '', value: nextId
			}),
			onComplete: function(resp) { 

			}.bind(this)
		}).post();
		
		/*var newOrder = this.orderSortables.serialize(1, function(element, index) {
			var eId = element.getClassStoredValue('xEntryId');
			if(eId) return eId;
		});
		
		new Request.JSON({
			url: this.options.updateUrl,
			data: "json=" + JSON.encode({
				section: this.currentSection, entry: null, entryNum: null, 
				action: 'ORDER_ENTRIES', property: '', value: newOrder
			}),
			onComplete: function(resp) { 
				
			}.bind(this)
		}).post();*/
	},
	
	
	
	
	entryOnHover: function(event) {
		event = new Event(event);
		var target = $(event.target);
		//console.debug('in: ', target.get('tag'), target);
		if(!target.hasClass('xEntry')) target = target.getParent('.xEntry');
		target.addClass('xEntryHover');
		
	},
	entryOnUnHover: function(event) {
		event = new Event(event);
		var target = $(event.target);
		//console.debug('out: ', target.get('tag'), target);
		if(!target.hasClass('xEntry')) target = target.getParent('.xEntry');
		target.removeClass('xEntryHover');
		
	},
	entryDropdownToggle: function(event) {
		var dropdown = $(event.target);
		var dropdownPos=dropdown.getPosition();
		var dropdownSize=dropdown.getSize();		

		var entry=dropdown.getParent().getParent();
		var entryPos=parseInt(entry.getParent().getStyle('left'));
		entryPos=isNaN(entryPos)?0:entryPos;
		
		dropdownBox=entry.getElement('.xEntryDropdownBox');
		var dropdownBoxSize=dropdownBox.getDimensions();
		
		dropdownBox.toggleClass('xVisible', true);

	
		if (dropdownBox.hasClass('xVisible')){

			dropdown.addClass('xEntryDropdowHover');
		
			var mainColumn_margin_padding=0;
			var mainColumn = $('mainColumn');
			
			if (mainColumn) {
				mainColumn_margin_padding = parseInt(mainColumn.getStyle('padding-left')) + parseInt(mainColumn.getStyle('margin-left'));
			}

            if(this.container.hasClass('xCentered') && !(entry.getParent().hasClass('xFixed'))) {
                var dropdownBoxLeftPos = dropdownPos.x - dropdownBoxSize.width + parseInt(dropdownSize.x/2+1) - mainColumn_margin_padding - entryPos - ((window.getSize().x - this.container.getSize().x) / 2);
            } else {
                var dropdownBoxLeftPos = dropdownPos.x - dropdownBoxSize.width + parseInt(dropdownSize.x/2+1) - mainColumn_margin_padding - entryPos;
            }

			dropdownBox.setStyle('left', dropdownBoxLeftPos + 'px');
		}else{
			dropdown.removeClass('xEntryDropdowHover');
		}
	},


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///|  Submenu Sorting  |/////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    submenuSortingInit: function() {
        this.subMenu.each(function(item, index) {
            if(item.hasClass('xAllowOrdering')) {
                this.submenuSortables[index] = new Sortables(item, {
                    handle: '.handle',
                    constrain: true,
                    clone: true,
                    opacity: 0.3,
                    revert: true,
                    onComplete: function(el) {
                        if(item.hasClass('xSortNotClick')) {
                        	//console.log('Submenu order finish');
                        	this.submenuOrderSave(el, item);
                        	item.removeClass('xSortNotClick');
                        }
                    }.bind(this),
                    onStart: function(el, clone) {
                        //console.log('Submenu order start');
                        item.addClass('xSortNotClick');
                    }.bind(this)
                });
            }
        }.bind(this));
    },

    submenuOrderSave: function(elJustMoved, subMenu) {
        subMenu.addClass('xSaving');
        var section = subMenu.getClassStoredValue('xSection');
        var tag = elJustMoved.getClassStoredValue('xTag');
        var next = elJustMoved.getNext('li');
        var nextTag = next ? next.getClassStoredValue('xTag') : null;

        new Request.JSON({
            url: this.options.updateUrl,
            data: "json=" + JSON.encode({
                section: section, tag: tag, value: nextTag,
                action: 'ORDER_SUBMENUS', property: ''
            }),
            onComplete: function(resp) {
                subMenu.removeClass('xSaving');
            }.bind(this)
        }).post();
    },


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///|  Tutorial videos  |//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    bertaVideosInit: function(event) {
		if($('bertaVideosWrapper')) {
			var videosContainer = $('bertaVideosWrapper');
			var videosBackground = $('bertaVideosBackground');
			var videoFrame = $('videoFrame');
			var videoLinks = $('videoLinks') ? $('videoLinks').getElements('a.switchVideo') : new Array();

			videosContainer.addEvents({
				'click:relay(a.switchVideo)': function(event) {
					event.stop();
					videoFrame.set('src', this.get('href'));
					videoLinks.removeClass('selected');
					event.target.addClass('selected');
				},
				'click:relay(a.closeFrame)': function(event) {
					event.stop();
					videosContainer.destroy();
					videosBackground.destroy();
				},
				'click:relay(.togglePopup)': function(event) {
					this.toggleVideos(event);
				}.bind(this)
			});
			window.addEvent('keydown', function(event) {
				if(event.key == 'esc') {
					videosContainer.destroy();
					videosBackground.destroy();
				}
			});
		}
		// Cookie.write('_berta_videos_hidden', 1);
	},

	toggleVideos: function(event) {
		if(this.processHandler.isIdleOrWarnIfBusy()) {
			event.stop();
			var el = event.target;

			var value = el.get('checked') == true ? 'yes' : 'no';
			var property = el.getClassStoredValue('xProperty');

			var elParent = el.getParent();
			elParent.addClass('xSavingAtLarge');
			
			var processId = this.unlinearProcess_getId('toggle-videos');
			this.unlinearProcess_start(processId, 'Toggling tutorial videos');
			
			new Request.JSON({
				url: this.options.updateUrl, 
				data: "json=" + JSON.encode({
					value: value, property: property
				}),
				onComplete: function(resp) { 
					if(!resp) {
						alert('An error occured while toggling the tutorial video window state. Something has gone wrong!');
					} else if(resp && !resp.error_message) {
						this.unlinearProcess_stop(processId);
						value == 'yes' ? el.set('checked', true) : el.set('checked', false);
						elParent.removeClass('xSavingAtLarge');
					} else {
						alert(resp.error_message);
						elParent.removeClass('xSavingAtLarge');
					}
				}.bindWithEvent(this)
			}).post();
		}
	}


});

BertaEditor.EDITABLES_INIT = 'editables_init';


var bertaEditor = new BertaEditor(window.bertaGlobalOptions);
