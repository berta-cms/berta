

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
	
	/* variables containing information */
	currentSection: null,			// the name of the section opened
	currentTag: null,				// the name of the tag selected
	
	
	
	/* old */
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

				// New section tip
				if(!Cookie.read('_berta_tips')) {
				    var newSection_tip_anchor = document.getElementById('xSections');
			
				    var newSectionTip = new Tips(newSection_tip_anchor, {
				    	fixed: true,
				    	className: 'xTipNewSection',
				    	showDelay: 0,
				    	offset: {'x': 8, 'y': 20},
				    	onHide: function(tip, el) {
				    		tip.show();
				    	},
				    	onShow: function(tip, el) {
				    		document.getElementById('xRemoveTips').addEvent('click', function(event) {
				    			event.stop();
				    		
				    			if(confirm("Berta asks:\n\nAre you sure you want to remove tips?\nYou will not be able to view them again.")) {
				    				// Destroys and disposes of newEntryContentTip & sets cookie
				    				$$('.xTipNewSection').destroy(); $$('.xTipNewSection').dispose();
				    				Cookie.write('_berta_tips', 'hidden', {duration: 365, path: '/'});
									window.location.reload();
				    			}
				    		});
				    	}
				    });
				    
				    newSection_tip_anchor.store('tip:title', this.options.i18n.newSectionTip_title);
				    newSection_tip_anchor.store('tip:text', this.options.i18n.newSectionTip_text);
				    	
				    newSection_tip_anchor.fireEvent('mouseenter');
				}

				//Go to my site tip
				if(Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'create_entry') {
					var goToMySiteCookie_tip_anchor = document.getElementById('xMySite');
				    		
				    var goToMySiteTip = new Tips(goToMySiteCookie_tip_anchor, {
				        fixed: true,
				        className: 'xTipGoToMySite',
				        offset: {'x': 4, 'y': 20},
				        onHide: function(tip, el) {
				        	tip.show();
				        }
				    });
				    
				    goToMySiteCookie_tip_anchor.store('tip:title', this.options.i18n.goToMySiteTip_title);
				    goToMySiteCookie_tip_anchor.store('tip:text', this.options.i18n.goToMySiteTip_text);
				        
				    goToMySiteCookie_tip_anchor.fireEvent('mouseenter');
				}

				// Template design tip
				if(Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'template_design') {    
				    var templateDesign_tip_anchor = document.getElementById('xTemplateDesign');
				    		
				    var templateDesignTip = new Tips(templateDesign_tip_anchor, {
				        fixed: true,
				        className: 'xTipTemplateDesign',
				        offset: {'x': 30, 'y': 20},
				        onHide: function(tip, el) {
				        	tip.show();
				        }
				    });
				    
				    templateDesign_tip_anchor.store('tip:title', this.options.i18n.templateDesignTip_title);
				    templateDesign_tip_anchor.store('tip:text', this.options.i18n.templateDesignTip_text);
				        
				    templateDesign_tip_anchor.fireEvent('mouseenter');
				    
				    templateDesign_tip_anchor.addEvent('click', function() {
				    	Cookie.write('_berta_tips', 'settings', {duration: 365, path: '/'});
				    });
				}

				// Settings tip
				if(Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'settings') {
				    var settings_tip_anchor = document.getElementById('xSettings');
				    
				    var settingsTip = new Tips(settings_tip_anchor, {
				        fixed: true,
				        className: 'xTipSettings',
				        offset: {'x': 20, 'y': 20},
				        onHide: function(tip, el) {
				        	tip.show();
				        }
				    });
				    
				  	settings_tip_anchor.store('tip:title', this.options.i18n.settingsTip_title);
				   	settings_tip_anchor.store('tip:text', this.options.i18n.settingsTip_text);
				    
					settings_tip_anchor.fireEvent('mouseenter');
		    
				    settings_tip_anchor.addEvent('click', function() {
				    	Cookie.write('_berta_tips', 'hidden', {duration: 365, path: '/'});
				    });
				}
				
				// Shop sections tip
				if(this.options.shopEnabled && this.options.templateName.substr(0,5) == 'messy' &&
				   Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'hidden' &&
				   (!Cookie.read('_berta_shop_tips') || Cookie.read('_berta_shop_tips') == 'create_shop_cart')) {
				    var shopSections_tip_anchor = document.getElementById('xSections');
				    
				    var shopSectionsTip = new Tips(shopSections_tip_anchor, {
				    	fixed: true,
				        className: 'xTipShopSections',
				        offset: {'x': 8, 'y': 20},
				        onHide: function(tip, el) {
				        	tip.show();
				        },
				        onShow: function(tip, el) {
				    		document.getElementById('xRemoveTips').addEvent('click', function(event) {
				    			event.stop();
				    		
				    			if(confirm("Berta asks:\n\nAre you sure you want to remove tips?\nYou will not be able to view them again.")) {
				    				// Destroys and disposes of newEntryContentTip & sets cookie
				    				$$('.xTipShopSections').destroy(); $$('.xTipShopSections').dispose();
				    				Cookie.write('_berta_shop_tips', 'hidden', {duration: 365, path: '/'});
				    			}
				    		});
				    	}
				    });
				    
				    shopSections_tip_anchor.store('tip:title', this.options.i18n.shopSectionsTip_title);
				    shopSections_tip_anchor.store('tip:text', this.options.i18n.shopSectionsTip_text);
				        
				    shopSections_tip_anchor.fireEvent('mouseenter');
				}
				
				// Go to shop settings tip
				if(this.options.shopEnabled && this.options.templateName.substr(0,5) == 'messy' &&
				   Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'hidden' &&
				   Cookie.read('_berta_shop_tips') && Cookie.read('_berta_shop_tips') == 'shop_settings') {
				
				    var shopSettings_tip_anchor = document.getElementById('shopSettings');
				        	
				    var shopSettingsTip = new Tips(shopSettings_tip_anchor, {
				        fixed: true,
				        className: 'xTipShopSettings',
				        offset: {'x': 4, 'y': 30},
				        onHide: function(tip, el) {
				        	tip.show();
				        }
				    });
				    
				    shopSettings_tip_anchor.store('tip:title', this.options.i18n.shopSettingsTip_title);
				    shopSettings_tip_anchor.store('tip:text', this.options.i18n.shopSettingsTip_text);
				        
				    shopSettings_tip_anchor.fireEvent('mouseenter');
				    
				    shopSettings_tip_anchor.addEvent('click', function() {
				    	$$('.xTipShopSettings').destroy(); $$('.xTipShopSettings').dispose();
				    	Cookie.write('_berta_shop_tips', 'create_shop_entry', {duration: 365, path: '/'});
				    	
						var createShopEntry_tip_anchor = document.getElementById('xMySite');
						    	
						var createShopEntryTip = new Tips(createShopEntry_tip_anchor, {
						    fixed: true,
						    className: 'xTipCreateShopEntry',
						    offset: {'x': 4, 'y': 20},
						    onHide: function(tip, el) {
						    	tip.show();
						    }
						});

						createShopEntry_tip_anchor.store('tip:title', this.options.i18n.goToMySiteShopTip_title);
						createShopEntry_tip_anchor.store('tip:text', this.options.i18n.goToMySiteShopTip_text);
						    
						createShopEntry_tip_anchor.fireEvent('mouseenter');
				    }.bind(this));
				}
				
				// Create shop entry
				if(this.options.shopEnabled && this.options.templateName.substr(0,5) == 'messy' && 
				   Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'hidden' &&
				   Cookie.read('_berta_shop_tips') && Cookie.read('_berta_shop_tips') == 'create_shop_entry') {
				    
				    var createShopEntry_tip_anchor = document.getElementById('xMySite');
				        	
				    var createShopEntryTip = new Tips(createShopEntry_tip_anchor, {
				        fixed: true,
				        className: 'xTipCreateShopEntry',
				        offset: {'x': 4, 'y': 20},
				        onHide: function(tip, el) {
				        	tip.show();
				        }
				    });
				    
				    createShopEntry_tip_anchor.store('tip:title', this.options.i18n.goToMySiteShopTip_title);
				    createShopEntry_tip_anchor.store('tip:text', this.options.i18n.goToMySiteShopTip_text);
				        
				    createShopEntry_tip_anchor.fireEvent('mouseenter');
				}
				
				// Go to shopping cart tip
				if(this.options.shopEnabled && this.options.templateName.substr(0,5) == 'messy' &&
				   Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'hidden' &&
				   Cookie.read('_berta_shop_tips') && Cookie.read('_berta_shop_tips') == 'goto_shopping_cart') {
				    
				    var goToShoppingCart_tip_anchor = document.getElementById('xMySite');
				        
				    var templateDesignTip = new Tips(goToShoppingCart_tip_anchor, {
				        fixed: true,
				        className: 'xTipGoToShoppingCart',
				        offset: {'x': 4, 'y': 20},
				        onHide: function(tip, el) {
				        	tip.show();
				        }
				    });
				    
				    goToShoppingCart_tip_anchor.store('tip:title', this.options.i18n.goToShoppingCartTip_title);
				    goToShoppingCart_tip_anchor.store('tip:text', this.options.i18n.goToShoppingCartTip_text);
				        
				    goToShoppingCart_tip_anchor.fireEvent('mouseenter');
				}
				
				
				break;
			
			case 'entries':
			default:
				
				this.container = document.getElementById('contentContainer');
				this.entriesList = $$('.xEntriesList')[0];
				
				// section background editing
				if($('xBgEditorPanelTrig')) $('xBgEditorPanelTrig').addEvent('click', this.onBgEditClick.bindWithEvent(this));
				
				if($('xNewsTickerContainer') && (Cookie.read('_berta_tips') != 'hidden' || Cookie.read('_berta_shop_tips') != 'hidden')) this.hideNewsTicker();

				if(this.entriesList) {
				
					this.currentSection = this.entriesList.getClassStoredValue('xSection');
					this.currentTag = this.entriesList.getClassStoredValue('xTag');
					
					if(this.currentSection) {
						this.entriesList.getElements('.xEntry .xEntryEditWrap').addEvent('mouseenter', this.entryOnHover.bindWithEvent(this));
						this.entriesList.getElements('.xEntry .xEntryEditWrap').addEvent('mouseleave', this.entryOnUnHover.bindWithEvent(this));
				
						this.entriesList.getElements('.xEntry .xEntryDropdown').addEvent('mouseenter', this.entryDropdownToggle.bindWithEvent(this));
						this.entriesList.getElements('.xEntry .xEntryDropdown').addEvent('click', this.entryDropdownToggle.bindWithEvent(this));
												
						this.entriesList.getElements('.xEntry .xEntryDropdownBox').addEvents({
						 	mouseleave: function(event){
						 		this.removeClass('xVisible');
								dropdown = this.getParent().getElement('.xEntryDropdown');
								dropdown.removeClass('xEntryDropdowHover');						    
						    }														
						});												
						
						// entry deleting and creating
						new Element('A', { 'class': 'xCreateNewEntry xPanel xAction-entryCreateNew', 'href': '#'}).adopt(
							new Element('span', { 'html': this.options.i18n['create new entry here'] })
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
						
						// Hide tips if site has sections & no cookie, or template has been changed
						if(!Cookie.read('_berta_tips') || 
						   (Cookie.read('_berta_tips') != 'hidden' && this.options.templateName.substr(0,5) != 'messy')) {
							Cookie.write('_berta_tips', 'hidden', {duration: 365, path: '/'});
						}

						// New entry tip
						if(Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'create_entry') {							
							var newEntry_tip_anchor = this.container.getElement('a.xCreateNewEntry');
							
							var newEntryTip = new Tips(newEntry_tip_anchor, {
								fixed: true,
								className: 'xTipNewEntry',
								offset: {'x': 80, 'y': 28},
								onHide: function(tip, el) {
									tip.show();
								}
							});
							
							newEntry_tip_anchor.store('tip:title', this.options.i18n.newEntryTip_title);
							newEntry_tip_anchor.store('tip:text', this.options.i18n.newEntryTip_text);
							
							newEntry_tip_anchor.fireEvent('mouseenter');
							
							newEntry_tip_anchor.addEvent('click', function() {
								Cookie.write('_berta_tips', 'entry_content', {duration: 365, path: '/'});
							});
						}
				
						// New entry content tip
						if(Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'entry_content'  &&
				           this.container.getElements('.xEntry .xEntryEditWrap .xGalleryHasImages').length == 0) {
							
							var newEntryContent_tip_anchor = this.entriesList.getElements('.xEntry');
							
							var newEntryContentTip = new Tips(newEntryContent_tip_anchor, {
								fixed: true,
								className: 'xTipNewEntryContent',
								offset: {'x': 20, 'y': 42},
								onHide: function(tip, el) {
									tip.show();
								}
							});
							
							newEntryContent_tip_anchor.store('tip:title', this.options.i18n.newEntryContentTip_title);
							newEntryContent_tip_anchor.store('tip:text', this.options.i18n.newEntryContentTip_text);
								
							newEntryContent_tip_anchor.fireEvent('mouseenter');
							// Fixes 'create new entry' button's & top panel display problems
							document.getElementById('xTopPanelContainer').setStyle('display', 'block');
							this.container.getChildren('a.xCreateNewEntry')[0].setStyle('display', 'block'); 
						}
						
						// Template design tip
						if(Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'template_design') {
							
							var templateDesign_tip_anchor = document.getElementById('xTemplateDesign');
									
							var templateDesignTip = new Tips(templateDesign_tip_anchor, {
							    fixed: true,
							    className: 'xTipTemplateDesign',
							    offset: {'x': 30, 'y': 20},
							    onHide: function(tip, el) {
							    	tip.show();
							    }
							});
							
							templateDesign_tip_anchor.store('tip:title', this.options.i18n.templateDesignTip_title);
							templateDesign_tip_anchor.store('tip:text', this.options.i18n.templateDesignTip_text);
							    
							templateDesign_tip_anchor.fireEvent('mouseenter');
							
							templateDesign_tip_anchor.addEvent('click', function() {
								Cookie.write('_berta_tips', 'settings', {duration: 365, path: '/'});
							});
						}
						
						// Settings tip
						if(Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'settings') {
							var settings_tip_anchor = document.getElementById('xSettings');
							
							var settingsTip = new Tips(settings_tip_anchor, {
							    fixed: true,
							    className: 'xTipSettings',
							    offset: {'x': 20, 'y': 20},
							    onHide: function(tip, el) {
							    	tip.show();
							    }
							});
							
							settings_tip_anchor.store('tip:title', this.options.i18n.settingsTip_title);
							settings_tip_anchor.store('tip:text', this.options.i18n.settingsTip_text);
							    
							settings_tip_anchor.fireEvent('mouseenter');
							
							settings_tip_anchor.addEvent('click', function() {
				    			Cookie.write('_berta_tips', 'hidden', {duration: 365, path: '/'});
				    		});
						}
												
						// Shop sections tip
						if(this.options.shopEnabled && this.options.templateName.substr(0,5) == 'messy' &&
						   Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'hidden' &&
						   (!Cookie.read('_berta_shop_tips') || Cookie.read('_berta_shop_tips') == 'create_shop_cart')) {
							var shopSections_tip_anchor = document.getElementById('xSections');
							
							var shopSectionsTip = new Tips(shopSections_tip_anchor, {
								fixed: true,
							    className: 'xTipShopSections',
							    offset: {'x': 8, 'y': 20},
							    onHide: function(tip, el) {
							    	tip.show();
							    },
						        onShow: function(tip, el) {
						    		document.getElementById('xRemoveTips').addEvent('click', function(event) {
						    			event.stop();
						    		
						    			if(confirm("Berta asks:\n\nAre you sure you want to remove tips?\nYou will not be able to view them again.")) {
						    				// Destroys and disposes of newEntryContentTip & sets cookie
						    				$$('.xTipShopSections').destroy(); $$('.xTipShopSections').dispose();
						    				Cookie.write('_berta_shop_tips', 'hidden', {duration: 365, path: '/'});
						    			}
						    		});
						    	}
							});
							
							shopSections_tip_anchor.store('tip:title', this.options.i18n.shopSectionsTip_title);
							shopSections_tip_anchor.store('tip:text', this.options.i18n.shopSectionsTip_text);
							    
							shopSections_tip_anchor.fireEvent('mouseenter');
						}
						
						// Go to shop settings tip
						if(this.options.shopEnabled && this.options.templateName.substr(0,5) == 'messy' && 
						   Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'hidden' &&
						   Cookie.read('_berta_shop_tips') && (Cookie.read('_berta_shop_tips') == 'goto_shop_settings' || Cookie.read('_berta_shop_tips') == 'shop_settings') ) {
						
						    var goToShopSettings_tip_anchor = document.getElementById('xSettings');
						        	
						    var goToShopSettingsTip = new Tips(goToShopSettings_tip_anchor, {
						        fixed: true,
						        className: 'xTipGoToShopSettings',
						        offset: {'x': 4, 'y': 20},
						        onHide: function(tip, el) {
						        	tip.show();
						        }
						    });
						    
						    goToShopSettings_tip_anchor.store('tip:title', this.options.i18n.goToShopSettingsTip_title);
						    goToShopSettings_tip_anchor.store('tip:text', this.options.i18n.goToShopSettingsTip_text);
						        
						    goToShopSettings_tip_anchor.fireEvent('mouseenter');
						    
						    goToShopSettings_tip_anchor.addEvent('click', function() {
						    	Cookie.write('_berta_shop_tips', 'shop_settings', {duration: 365, path: '/'});
						    });
						}
						
						// Create shop entry
						if(this.options.shopEnabled && this.options.templateName.substr(0,5) == 'messy' && 
						   Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'hidden' &&
						   Cookie.read('_berta_shop_tips') && Cookie.read('_berta_shop_tips') == 'create_shop_entry') {
						    						    
						    if(this.options.sectionType == 'shop') {	
						    	if(this.galleries.length == 0) {				    
						    		var createShopEntry_tip_anchor = this.container.getElement('a.xCreateNewEntry');
						    		
						    		var createShopEntryTip = new Tips(createShopEntry_tip_anchor, {
						    		    fixed: true,
						    		    className: 'xTipCreateShopEntry',
						    		    offset: {'x': 80, 'y': 28},
						    		    onHide: function(tip, el) {
						    		    	tip.show();
						    		    }
						    		});
						    		
						    		createShopEntry_tip_anchor.store('tip:title', this.options.i18n.createShopEntryTip_title);
						    		createShopEntry_tip_anchor.store('tip:text', this.options.i18n.createShopEntryTip_text);
						    		createShopEntry_tip_anchor.addEvent('click', function() {
						    			Cookie.write('_berta_shop_tips', 'goto_shopping_cart', {duration: 365, path: '/'});
						    		});
						    	} else {
						    		// Go to shopping cart tip
						    		Cookie.write('_berta_shop_tips', 'goto_shopping_cart', {duration: 365, path: '/'});
									var createShopEntry_tip_anchor = document.getElementById('xShoppingCart');
									    
									var templateDesignTip = new Tips(createShopEntry_tip_anchor, {
									    fixed: true,
									    className: 'xTipGoToShoppingCartMySite',
									    offset: {'x': -28, 'y': 20},
									    onHide: function(tip, el) {
									    	tip.show();
									    }
									});
									
									createShopEntry_tip_anchor.store('tip:title', this.options.i18n.goToShoppingCartTip_title);
									createShopEntry_tip_anchor.store('tip:text', this.options.i18n.goToShoppingCartTip_text);
									
									createShopEntry_tip_anchor.addEvent('click', function() {
									    Cookie.write('_berta_shop_tips', 'hidden', {duration: 365, path: '/'});
									});
									    
									createShopEntry_tip_anchor.fireEvent('mouseenter');
						    	}
						    } else {
						    	var createShopEntry_tip_anchor = document.getElementById('xMySite');
						    	
						    	var createShopEntryTip = new Tips(createShopEntry_tip_anchor, {
						        	fixed: true,
						        	className: 'xTipCreateShopEntry',
						        	offset: {'x': 4, 'y': 20},
						        	onHide: function(tip, el) {
						        		tip.show();
						        	}
						    	});
						    	
						    	createShopEntry_tip_anchor.store('tip:title', this.options.i18n.goToMySiteShopTip_title);
						    	createShopEntry_tip_anchor.store('tip:text', this.options.i18n.goToMySiteShopTip_text);						    
						    }						    						        
						    
						    createShopEntry_tip_anchor.fireEvent('mouseenter');
						}
						
						// Go to shopping cart tip
						if(this.options.shopEnabled && this.options.templateName.substr(0,5) == 'messy' &&
						   Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'hidden' &&
						   Cookie.read('_berta_shop_tips') && Cookie.read('_berta_shop_tips') == 'goto_shopping_cart') {
							
							var goToShoppingCart_tip_anchor = document.getElementById('xShoppingCart');
							    
							var templateDesignTip = new Tips(goToShoppingCart_tip_anchor, {
							    fixed: true,
							    className: 'xTipGoToShoppingCartMySite',
							    offset: {'x': -28, 'y': 20},
							    onHide: function(tip, el) {
							    	tip.show();
							    }
							});
							
							goToShoppingCart_tip_anchor.store('tip:title', this.options.i18n.goToShoppingCartTip_title);
							goToShoppingCart_tip_anchor.store('tip:text', this.options.i18n.goToShoppingCartTip_text);
							
							goToShoppingCart_tip_anchor.addEvent('click', function() {
							    Cookie.write('_berta_shop_tips', 'hidden', {duration: 365, path: '/'});
							});
							    
							goToShoppingCart_tip_anchor.fireEvent('mouseenter');
						}
				
				
					} else if(!this.currentSection && !Cookie.read('_berta_tips')) {
						// New section tip
						if(this.options.templateName.substr(0,5) != 'messy')
							Cookie.write('_berta_tips', 'hidden', {duration: 365, path: '/'});
						
						this.container.getElement('h1').hide();

						var newSection_tip_anchor = document.getElementById('xSections');
			
						var newSectionTip = new Tips(newSection_tip_anchor, {
							fixed: true,
							className: 'xTipNewSection',
							showDelay: 0,
							offset: {'x': 8, 'y': 20},
							onHide: function(tip, el) {
								tip.show();
							},
							onShow: function(tip, el) {
								document.getElementById('xRemoveTips').addEvent('click', function(event) {
									event.stop();
								
									if(confirm("Berta asks:\n\nAre you sure you want to remove tips?\nYou will not be able to view them again.")) {
										// Destroys and disposes of newEntryContentTip & sets cookie
										$$('.xTipNewSection').destroy(); $$('.xTipNewSection').dispose();
										Cookie.write('_berta_tips', 'hidden', {duration: 365, path: '/'});
										window.location.reload();
									}
								});
							}
						});
						
						newSection_tip_anchor.store('tip:title', this.options.i18n.newSectionTip_title);
						newSection_tip_anchor.store('tip:text', this.options.i18n.newSectionTip_text);
							
						newSection_tip_anchor.fireEvent('mouseenter');
					
					
					} else if(!this.currentSection && Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'hidden' && (!Cookie.read('_berta_shop_tips') || Cookie.read('_berta_shop_tips') == 'create_shop_cart')) {
						// Shop sections tip
						if(this.options.shopEnabled && this.options.templateName.substr(0,5) == 'messy') {
							this.container.getElement('h1').hide();

							var shopSections_tip_anchor = document.getElementById('xSections');
							
							var shopSectionsTip = new Tips(shopSections_tip_anchor, {
								fixed: true,
								className: 'xTipShopSections',
								offset: {'x': 8, 'y': 20},
								onHide: function(tip, el) {
									tip.show();
								},
								onShow: function(tip, el) {
									document.getElementById('xRemoveTips').addEvent('click', function(event) {
										event.stop();
									
										if(confirm("Berta asks:\n\nAre you sure you want to remove tips?\nYou will not be able to view them again.")) {
											// Destroys and disposes of newEntryContentTip & sets cookie
											$$('.xTipShopSections').destroy(); $$('.xTipShopSections').dispose();
											Cookie.write('_berta_shop_tips', 'hidden', {duration: 365, path: '/'});
										}
									});
								}
							});
							
							shopSections_tip_anchor.store('tip:title', this.options.i18n.shopSectionsTip_title);
							shopSections_tip_anchor.store('tip:text', this.options.i18n.shopSectionsTip_text);
								
							shopSections_tip_anchor.fireEvent('mouseenter');
						}
					}
				} else {
					this.editablesInit();
				}
				break;
		} 
		
		// init news ticker
		this.newsTickerContainer = $('xNewsTickerContainer');
		if(this.newsTickerContainer) {
			this.newsTickerContainer.getElement('a.close').addEvent('click', function(event) {
				event.stop();
				new Fx.Slide(this.newsTickerContainer, { duration: 800, transition: Fx.Transitions.Quint.easeInOut }).show().slideOut();
				this.newsTickerContainer.addClass('xNewsTickerHidden');
				Cookie.write('_berta_newsticker_hidden', 1);
			}.bind(this));
			
			this.hideNewsTicker.delay(7000);
		}
	},
	
	
	onLoad: function() {

	},
	
	
	// Hide news ticker function
	hideNewsTicker: function() {
		this.newsTickerContainer = $('xNewsTickerContainer');
		if(!this.newsTickerContainer.hasClass('xNewsTickerHidden')) {
			new Fx.Slide(this.newsTickerContainer, { duration: 800, transition: Fx.Transitions.Quint.easeInOut }).show().slideOut();
			Cookie.write('_berta_newsticker_hidden', 1);
		}
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
		
		// Destroys and disposes of newEntryContentTip		
		if(Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'entry_content')  {
			$$('.xTipNewEntryContent').destroy(); $$('.xTipNewEntryContent').dispose();
		}
		
		
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
					$('xBackgroundNext').show();
					$('xBackgroundPrevious').show();
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
				
				// Template design tip
				if(Cookie.read('_berta_tips') && Cookie.read('_berta_tips') == 'entry_content' &&
				   this.container.getElements('.xEntry .xEntryEditWrap .xGalleryHasImages').length > 0) {
					
					$('xTopPanelContainer').show();
					
					Cookie.write('_berta_tips', 'template_design', {duration: 365, path: '/'});
					
					var templateDesign_tip_anchor = document.getElementById('xTemplateDesign');
							
					var templateDesignTip = new Tips(templateDesign_tip_anchor, {
					    fixed: true,
					    className: 'xTipTemplateDesign',
					    offset: {'x': 30, 'y': 20},
					    onHide: function(tip, el) {
					    	tip.show();
					    }
					});
					
					templateDesign_tip_anchor.store('tip:title', this.options.i18n.templateDesignTip_title);
					templateDesign_tip_anchor.store('tip:text', this.options.i18n.templateDesignTip_text);
					    
					templateDesign_tip_anchor.fireEvent('mouseenter');
					
					templateDesign_tip_anchor.addEvent('click', function() {
						Cookie.write('_berta_tips', 'settings', {duration: 365, path: '/'});
					});
				}
				
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
							
							// Deletes newEntryContentTip (will show on mouseover)
							$$('.xTipNewEntryContent').dispose();
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
		
			var dropdownBoxLeftPos = dropdownPos.x - dropdownBoxSize.width + parseInt(dropdownSize.x/2+1)  - mainColumn_margin_padding - entryPos;
		
			dropdownBox.setStyle('left', dropdownBoxLeftPos + 'px');
		}else{
			dropdown.removeClass('xEntryDropdowHover');
		}
	}
	
});

BertaEditor.EDITABLES_INIT = 'editables_init';


var bertaEditor = new BertaEditor(window.bertaGlobalOptions);
