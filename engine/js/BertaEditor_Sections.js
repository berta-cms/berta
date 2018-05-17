


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
		f(this.options.xBertaEditorClassSimple).each(function(el) {
      this.elementEdit_init(el, this.options.xBertaEditorClassSimple, this.sectionOnSave.bind(this));
    }.bind(this));

		// yes/no fields ///////////////////////////////////////////////////////////////////////////////////////////////////////
		f(this.options.xBertaEditorClassYesNo).each(function(el) {
      this.elementEdit_init(el, this.options.xBertaEditorClassYesNo, this.sectionOnSave.bind(this));
    }.bind(this));

		f(this.options.xBertaEditorClassSelect).each(function(el) {
      this.elementEdit_init(el, this.options.xBertaEditorClassSelect, this.sectionOnSave.bind(this));
    }.bind(this));

    f(this.options.xBertaEditorClassSelectRC).each(function(el) {
      this.elementEdit_init(el, this.options.xBertaEditorClassSelectRC, this.sectionOnSave.bind(this));
    }.bind(this));
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
		if (prop === 'title') {
			var li = el.getParent('li');
			el.setClassStoredValue('xSection', returnReal);
			li.setClassStoredValue('xSection', returnReal);

			var arr = li.getElements(this.options.xBertaEditorClassSimple)
				.combine(li.getElements(this.options.xBertaEditorClassYesNo))
				.combine(li.getElements(this.options.xBertaEditorClassSelect))
				.combine(li.getElements(this.options.xBertaEditorClassSelectRC));
			arr.each(function(editable) { editable.setClassStoredValue('xSection', returnReal); });

    } else if (prop === 'type') {
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

    redux_store.dispatch(Actions.orderSiteSections(
      site,
      newOrder,
      function (resp) {
        this.updatePathParams();
      }.bind(this)
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
    var site = getCurrentSite() || '0';

    redux_store.dispatch(Actions.deleteSiteSection(
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
          this.updatePathParams();
        } else {
          alert(resp.error_message);
        }
        this.sectionsEditor.removeClass('xSaving');
      }.bind(this)
    ));
			}
		}
	},


  updatePathParams: function() {
    var path;
    this.sectionsMenu.getElements('li').each(function (section, i) {
      section.getElements('[data-path]').each(function (editable) {
        path = editable.data('path').split('/');
        path[2] = i;
        editable.set('data-path', path.join('/')).data('path', true);
      });
    });
  },


	sectionCreateNew: function(event) {
		if (event) event.preventDefault();
		this.sectionsEditor.addClass('xSaving');
    var site = getCurrentSite();

    redux_store.dispatch(Actions.createSiteSection(
      site,
      this.cloneSection,
      this.cloneSectionTitle,
      // @@@:TODO: Remove this callback, when migration to ReactJS is complete
      function(resp) {
        if(!resp) {
          alert('Berta says:\n\nServer produced an error while adding new section! Something went sooooo wrong...');
        } else if(resp && !resp.error_message) {
          var state = redux_store.getState();
          var template = state.site_settings.toJSON()[site].template.template;
          var sectionTypes = state.site_templates
                .toJSON()[template]
                .sectionTypes;
          var type = resp['@attributes'].type ? resp['@attributes'].type : 'default';
          var type_value = sectionTypes[type].title;
          var type_params = sectionTypes[type].params;
          var possible_types = Object
                .getOwnPropertyNames(sectionTypes)
                .map(function(_type) {
                  return _type + '|' + sectionTypes[_type].title;
                }).join('||');
          var type_html = this.getTypeHTML(
                site,
                resp.order,
                resp,
                state.site_template_settings.toJSON()[site][template],
                type_params,
                'xSection-' + resp['name'] + ' xSectionField'
              );

          var html = Templates.get(
                'section',
                Object.assign({}, editables, {
                  name: resp.name,
                  site: site,
                  order: resp.order,
                  title: resp.title,
                  possible_types: possible_types,
                  type_value: type_value,
                  type_html: type_html,
                  published: resp['@attributes'].published
                })
              );
          var li = new Element('li', { 'class': 'xSection-'+resp.name, 'html': html }).inject(this.sectionsMenu);
          this.sectionsSortables.addItems(li);
          this.editablesInit();
          li.getElement('a.xSectionClone').addEvent('click', this.sectionOnCloneClick.bindWithEvent(this));
          li.getElement('a.xSectionDelete').addEvent('click', this.sectionOnDeleteClick.bindWithEvent(this));
        } else {
          alert(resp.error_message);
        }
        this.sectionsEditor.removeClass('xSaving');
      }.bind(this)
    ));
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
