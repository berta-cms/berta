


var BertaEditor_Sections = new Class({

	Extends: BertaEditorBase,
	Implements: [ Options, UnlinearProcessDispatcher ],

	options: {

		paths: null,
	},

	/* editing related variables */
	edittingMode: 'sections',
	processHandler: null, 			// an instance of UnlinearProcessHandler

	cloneSection: null,
	cloneSectionTitle: null,

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
		this.sectionsEditorInit();

		if($('xNewsTickerContainer')) this.hideNewsTicker();
	},


	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///|  INIT  |/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	editablesInit: function(inElement) {	// instantiate all xEditable elements in the page
		var f = inElement ? $(inElement).getElements.bind($(inElement)) : $$;

		// simple text fields ///////////////////////////////////////////////////////////////////////////////////////////////////////
		f(this.options.xBertaEditorClassSimple).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassSimple, this.sectionOnSave.bind(this)) }.bind(this));

		// yes/no fields ///////////////////////////////////////////////////////////////////////////////////////////////////////
		f(this.options.xBertaEditorClassYesNo).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassYesNo, this.sectionOnSave.bind(this)) }.bind(this));

		f(this.options.xBertaEditorClassSelect).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassSelect, this.sectionOnSave.bind(this)) }.bind(this));
		f(this.options.xBertaEditorClassSelectRC).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassSelectRC, this.sectionOnSave.bind(this)) }.bind(this));
	},


	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///|  Section list management  |//////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	sectionsEditor: null,
	sectionsMenu: null,
	sectionsSortables: null,

	sectionsEditorInit: function() {
		this.sectionsEditor = $('xSectionsEditor');
        var xCreateNewSection = $('xCreateNewSection');
        if (!xCreateNewSection) return;
		this.sectionsMenu = this.sectionsEditor.getElement('ul');

		// ordering
		this.sectionsSortables = new Sortables(this.sectionsMenu, {
		    handle: '.handle',
			constrain: true,
		    clone: false,
			opacity: 0.5,
		    revert: true
		});
		this.sectionsSortables.addEvent('onComplete', this.sectionOrderSave.bind(this));

		// create new, clone and delete events
		xCreateNewSection.addEvent('click', this.sectionCreateNew.bindWithEvent(this));
		this.sectionsMenu.getElements('a.xSectionClone').addEvent('click', this.sectionOnCloneClick.bindWithEvent(this));
		this.sectionsMenu.getElements('a.xSectionDelete').addEvent('click', this.sectionOnDeleteClick.bindWithEvent(this));

		// editables: titles, links etc.
		this.editablesInit();
	},

	sectionOnSave: function(el, returnUpdate, returnReal, returnError, returnParams) {
		// update the properties of the section list item and title editable
		var prop = el.getClassStoredValue('xProperty');
		if(prop == 'title') {
			var li = el.getParent('li');
			el.setClassStoredValue('xSection', returnReal);
			li.setClassStoredValue('xSection', returnReal);

			var arr = li.getElements(this.options.xBertaEditorClassSimple)
				.combine(li.getElements(this.options.xBertaEditorClassYesNo))
				.combine(li.getElements(this.options.xBertaEditorClassSelect))
				.combine(li.getElements(this.options.xBertaEditorClassSelectRC));
			arr.each(function(editable) { editable.setClassStoredValue('xSection', returnReal); });
		}

		else if(prop == 'type') {
			var detailsElement = el.getParent('li').getElement('.csDetails');
			detailsElement.empty();
			detailsElement.set('html', returnParams);
			this.editablesInit(detailsElement);
		}
	},

	sectionOrderSave: function() {
		var newOrder = this.sectionsSortables.serialize(false, function(element, index) {
			return element.getClassStoredValue('xSection');
		});
    var site = getCurrentSite();

    redux_store.dispatch(Actions.orderSections(
      site,
      newOrder
    ));
	},

	sectionOnDeleteClick: function(event) {
		event = new Event(event).stop();
		var li = $(event.target).getParent('li');
		this.sectionDelete(li.getClassStoredValue('xSection'));
	},
	sectionDelete: function(sectionName) {
		if(confirm('Berta asks:\n\nAre you sure you want to delete this section? All its content will be lost... FOREVAAA!')) {
			if(confirm('Berta asks again:\n\nAre you really sure?')) {
				this.sectionsEditor.addClass('xSaving');
    var site = getCurrentSite();

    redux_store.dispatch(Actions.deleteSection(
      site,
      sectionName,
      // @@@:TODO: Remove this callback, when migration to ReactJS is complete
      function(resp) {
        if(!resp) {
          alert('Berta says:\n\nServer produced an error while deleting this section! Something went sooooo wrong...');
        } else if(resp && !resp.error_message) {
          var element = this.sectionsMenu.getElement('li.xSection-' + resp.name);
          this.sectionsSortables.removeItems(element);
          element.destroy();
        } else {
          alert(resp.error_message);
        }
        this.sectionsEditor.removeClass('xSaving');
      }.bind(this)
    ));

				// var data = {
				// 		section: 'null', entry: null, entryNum: null,
				// 		action: 'DELETE_SECTION',
				// 		property: '', value: sectionName
				// 	};
				// console.log('BertaEditor_Sections.sectionDelete:', data);
				// new Request.JSON({
				// 	url: this.options.updateUrl,
				// 	data: "json=" + JSON.encode(data),
				// 	onComplete: function(resp) {
				// 		if(!resp) {
				// 			alert('Berta says:\n\nServer produced an error while deleting this section! Something went sooooo wrong...');
				// 		} else if(resp && !resp.error_message) {
				// 			var element = this.sectionsMenu.getElement('li.xSection-' + resp.real);
				// 			this.sectionsSortables.removeItems(element);
				// 			element.destroy();
				// 		} else {
				// 			alert(resp.error_message);
				// 		}
				// 		this.sectionsEditor.removeClass('xSaving');
				// 	}.bind(this)
				// }).post();
			}
		}
	},

	sectionCreateNew: function(event) {
		if (event) event.preventDefault();
		this.sectionsEditor.addClass('xSaving');
    var site = getCurrentSite();

    // redux_store.dispatch(Actions.createSection(
    //   {
    //     site: site,
    //     name: this.cloneSection,
    //     title: this.cloneSectionTitle
    //   },
    //   // @@@:TODO: Remove this callback, when migration to ReactJS is complete
    //   function(resp) {
    //     if(!resp) {
    //       alert('Berta says:\n\nServer produced an error while adding new section! Something went sooooo wrong...');
    //     } else if(resp && !resp.error_message) {
    //       var li = new Element('li', { 'class': 'xSection-'+resp.real, 'html': resp.update }).inject(this.sectionsMenu);
    //       this.sectionsSortables.addItems(li);
    //       this.editablesInit();
    //       li.getElement('a.xSectionClone').addEvent('click', this.sectionOnCloneClick.bindWithEvent(this));
    //       li.getElement('a.xSectionDelete').addEvent('click', this.sectionOnDeleteClick.bindWithEvent(this));
    //     } else {
    //       alert(resp.error_message);
    //     }
    //     this.sectionsEditor.removeClass('xSaving');
    //   }.bind(this)
    // ));

		var data = {
				section: 'null',
				entry: null,
				entryNum: null,
				action: 'CREATE_NEW_SECTION',
				property: '', value: '',
				cloneSection: this.cloneSection,
				cloneSectionTitle: this.cloneSectionTitle
			};
		console.log('BertaEditor_Sections.sectionCreateNew:', data);
		new Request.JSON({
			url: this.options.updateUrl,
			data: "json=" + JSON.encode(data),
			onComplete: function(resp) {
				if(!resp) {
					alert('Berta says:\n\nServer produced an error while adding new section! Something went sooooo wrong...');
				} else if(resp && !resp.error_message) {
					var li = new Element('li', { 'class': 'xSection-'+resp.real, 'html': resp.update }).inject(this.sectionsMenu);
					this.sectionsSortables.addItems(li);
					this.editablesInit();
					li.getElement('a.xSectionClone').addEvent('click', this.sectionOnCloneClick.bindWithEvent(this));
					li.getElement('a.xSectionDelete').addEvent('click', this.sectionOnDeleteClick.bindWithEvent(this));
				} else {
					alert(resp.error_message);
				}
				this.sectionsEditor.removeClass('xSaving');
			}.bind(this)
		}).post();
	},

	sectionOnCloneClick: function(event) {
		event.preventDefault();
		var li = $(event.target).getParent('li');
		this.sectionClone(li);
	},

	sectionClone: function(sectionRow) {
		if(confirm('Berta asks:\n\nAre you sure you want to clone this section to new one?')) {
			this.cloneSection = sectionRow.getClassStoredValue('xSection');
			this.cloneSectionTitle = sectionRow.getElement('.xProperty-title');

			if (this.cloneSectionTitle.getElement('.xEmpty')) {
				this.cloneSectionTitle = null;
			}else{
				this.cloneSectionTitle = this.cloneSectionTitle.get('text');
			}
			this.sectionCreateNew();
			this.cloneSection = null;
			this.cloneSectionTitle = null;
		}
	}
});

var editor_sections = new BertaEditor_Sections(window.bertaGlobalOptions);
