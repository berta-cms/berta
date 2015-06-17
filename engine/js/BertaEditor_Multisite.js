var BertaEditor_Multisite = new Class({

	Extends: BertaEditorBase,
	Implements: [ Options, UnlinearProcessDispatcher ],

	options: {
		paths: null,
	},

	/* editing related variables */
	edittingMode: 'sites',
	processHandler: null, 			// an instance of UnlinearProcessHandler
	cloneSite: -1,

	/* DOM elements */
	newsTickerContainer: null,


	initialize: function(options) {
		this.setOptions(options);
		this.initConsoleReplacement();
		this.initNewsTicker();

		this.processHandler = new UnlinearProcessHandler();
		this.processHandler.addObservable(this);
		this.processHandler.test = 'aaa';

		window.addEvent('domready', this.onDOMReady.bindWithEvent(this));
	},

	onDOMReady: function() {
		// delay onDOMReady processing to allow all elements on page properly initialize
		this.onDOMReadyDo.delay(50, this);
	},
	onDOMReadyDo: function() {
		this.edittingMode = $$('body')[0].get('x_mode');
		this.sitesEditorInit();

		if($('xNewsTickerContainer')) this.hideNewsTicker();
	},


	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///|  INIT  |/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	editablesInit: function(inElement) {	// instantiate all xEditable elements in the page
		var f = inElement ? $(inElement).getElements.bind($(inElement)) : $$;

		// simple text fields ///////////////////////////////////////////////////////////////////////////////////////////////////////
		f(this.options.xBertaEditorClassSimple).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassSimple, this.siteOnSave.bind(this)) }.bind(this));

		// yes/no fields ///////////////////////////////////////////////////////////////////////////////////////////////////////
		f(this.options.xBertaEditorClassYesNo).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassYesNo, this.siteOnSave.bind(this)) }.bind(this));

		f(this.options.xBertaEditorClassSelect).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassSelect, this.siteOnSave.bind(this)) }.bind(this));
		f(this.options.xBertaEditorClassSelectRC).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassSelectRC, this.siteOnSave.bind(this)) }.bind(this));
	},


	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///|  Site list management  |//////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	sitesEditor: null,
	sitesMenu: null,
	sitesSortables: null,

	sitesEditorInit: function() {
		this.sitesEditor = $('xMultisiteEditor');
        if (!this.sitesEditor) return;
		this.sitesMenu = this.sitesEditor.getElement('ul');

		// ordering
		this.sitesSortables = new Sortables(this.sitesMenu, {
		    handle: '.handle',
			constrain: true,
		    clone: false,
			opacity: 0.5,
		    revert: true
		});
		this.sitesSortables.addEvent('onComplete', this.siteOrderSave.bind(this));

		// create new and delete and clone
		$('xCreateNewSite').addEvent('click', this.siteCreateNew.bindWithEvent(this));
		this.sitesMenu.getElements('a.xSiteClone').addEvent('click', this.siteOnCloneClick.bindWithEvent(this));
		this.sitesMenu.getElements('a.xSiteDelete').addEvent('click', this.siteOnDeleteClick.bindWithEvent(this));

		// editables: titles, links etc.
		this.editablesInit();
	},

	siteOnSave: function(el, returnUpdate, returnReal, returnError, returnParams) {
		// update the properties of the site list item and title editable
		var prop = el.getClassStoredValue('xProperty');
		if(prop == 'name') {
			var li = el.getParent('li');
			el.setClassStoredValue('xSite', returnReal);
			li.setClassStoredValue('xSite', returnReal);

			var arr = li.getElements(this.options.xBertaEditorClassSimple)
				.combine(li.getElements(this.options.xBertaEditorClassYesNo))
				.combine(li.getElements(this.options.xBertaEditorClassSelect))
				.combine(li.getElements(this.options.xBertaEditorClassSelectRC));
			arr.each(function(editable) { editable.setClassStoredValue('xSite', returnReal); });
		}
	},

	siteOrderSave: function() {
		var newOrder = this.sitesSortables.serialize(false, function(element, index) {
			return element.getClassStoredValue('xSite');
		});

		new Request.JSON({
			url: this.options.updateUrl,
			data: "json=" + JSON.encode({
				site: this.sitesMenu.getElement('li').getClassStoredValue('xSite'), entry: null, entryNum: null,
				action: 'ORDER_SITES', property: '', value: newOrder
			}),
			onComplete: function(resp) {

			}.bind(this)
		}).post();
	},

	siteOnCloneClick: function(event) {
		event = new Event(event).stop();
		var li = $(event.target).getParent('li');
		this.siteClone(li.getClassStoredValue('xSite'));
	},

	siteClone: function(siteName) {
		if(confirm('Berta asks:\n\nAre you sure you want to clone this site to new one?')) {
			this.cloneSite = siteName;
			this.siteCreateNew();
		}
	},

	siteOnDeleteClick: function(event) {
		event = new Event(event).stop();
		var li = $(event.target).getParent('li');
		this.siteDelete(li.getClassStoredValue('xSite'));
	},

	siteDelete: function(siteName) {
		if(confirm('Berta asks:\n\nAre you sure you want to delete this site? All its content will be lost... FOREVAAA!')) {
			if(confirm('Berta asks again:\n\nAre you really sure?')) {
				this.sitesEditor.addClass('xSaving');
				new Request.JSON({
					url: this.options.updateUrl,
					data: "json=" + JSON.encode({
						site: 'null', entry: null, entryNum: null,
						action: 'DELETE_SITE',
						property: '', value: siteName
					}),
					onComplete: function(resp) {
						if(!resp) {
							alert('Berta says:\n\nServer produced an error while deleting this site! Something went sooooo wrong...');
						} else if(resp && !resp.error_message) {
							var element = this.sitesMenu.getElement('li.xSite-' + resp.real);
							this.sitesSortables.removeItems(element);
							element.destroy();
						} else {
							alert(resp.error_message);
						}
						this.sitesEditor.removeClass('xSaving');
					}.bind(this)
				}).post();
			}
		}
	},

	siteCreateNew: function(site) {
		this.sitesEditor.addClass('xSaving');
		new Request.JSON({
			url: this.options.updateUrl,
			data: "json=" + JSON.encode({
				site: this.cloneSite,
				entry: null,
				entryNum: null,
				action: 'CREATE_NEW_SITE',
				property: '', value: ''
			}),
			onComplete: function(resp) {
				if(!resp) {
					alert('Berta says:\n\nServer produced an error while adding new site! Something went sooooo wrong...');
				} else if(resp && !resp.error_message) {
					var li = new Element('li', { 'class': 'xSite-'+resp.real, 'html': resp.update }).inject(this.sitesMenu);
					this.sitesSortables.addItems(li);
					this.editablesInit();
					li.getElement('a.xSiteClone').addEvent('click', this.siteOnCloneClick.bindWithEvent(this));
					li.getElement('a.xSiteDelete').addEvent('click', this.siteOnDeleteClick.bindWithEvent(this));
				} else {
					alert(resp.error_message);
				}
				this.sitesEditor.removeClass('xSaving');
			}.bind(this)
		}).post();

		this.cloneSite = -1;
	}
});

var editor_multisite = new BertaEditor_Multisite(window.bertaGlobalOptions);