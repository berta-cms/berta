
var BertaEditor_Seo = new Class({

	Extends: BertaEditorBase,
	Implements: [ Options, UnlinearProcessDispatcher ],

	options: {
		paths: null,
	},

	/* editing related variables */
	edittingMode: 'seo',
	processHandler: null, 			// an instance of UnlinearProcessHandler

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
		this.seoEditorInit();

		if($('xNewsTickerContainer')) this.hideNewsTicker();
	},


	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///|  INIT  |/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	editablesInit: function(inElement) {	// instantiate all xEditable elements in the page
		var f = inElement ? $(inElement).getElements.bind($(inElement)) : $$;

		// simple text fields ///////////////////////////////////////////////////////////////////////////////////////////////////////
		f(this.options.xBertaEditorClassSimple).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassSimple) }.bind(this));
  		f(this.options.xBertaEditorClassTA).each(function(el) { this.elementEdit_init(el, this.options.xBertaEditorClassTA) }.bind(this));
	},


	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///|  Seo management  |//////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	seoEditor: null,

	seoEditorInit: function() {
		this.seoEditor = $('xSeoEditor');
		this.editablesInit();
	}

});

var editor = new BertaEditor_Seo(window.bertaGlobalOptions);
