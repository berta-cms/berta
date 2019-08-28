Element.implement({
	getIndex: function(type) {
        type = (type) ? type : '';
        return $$(type).indexOf(this);
    },

	exists: function() {
		return this;
    },

	getClassStoredValue: function(varName) {
		var c = this.get('class').split(' ');
		for(var i = 0; i < c.length; i++) {
			if(c[i].substr(0, c[i].indexOf('-')) == varName) {
				return c[i].substr(c[i].indexOf('-') + 1);
			}
		}
		return null;
	},

	setClassStoredValue: function(varName, varValue) {
		var c = this.get('class').split(' ');
		var curValue = this.getClassStoredValue(varName);
		if(curValue) {
			this.removeClass(varName + '-' + curValue);
		}
		this.addClass(varName + '-' + varValue);
	}

});

var BertaEditorBase = new Class({

	Implements: [Options, Events],

	options: {
		xBertaEditorClassSimple: '.xEditable',
		xBertaEditorClassColor: '.xEditableColor',
		xBertaEditorClassSelect: '.xEditableSelect',
		xBertaEditorClassSelectRC: '.xEditableSelectRC',
		xBertaEditorClassFontSelect: '.xEditableFontSelect',
		xBertaEditorClassTA: '.xEditableTA',
		xBertaEditorClassMCE: '.xEditableMCE',
		xBertaEditorClassMCESimple: '.xEditableMCESimple',
		xBertaEditorClassRC: '.xEditableRC',
		xBertaEditorClassImage: '.xEditableImage',
		xBertaEditorClassICO: '.xEditableICO',
		xBertaEditorClassYesNo: '.xEditableYesNo',
		xEditableRealCheck: '.xEditableRealCheck',
		xBertaEditorClassDragXY: '.xEditableDragXY',

		xBertaEditorClassAction: '.xAction',
		xBertaEditorClassReset: '.xReset',

		xBertaEditorClassGallery: '.xEntryGalleryEditor',

		xEmptyClass: '.xEmpty',
		updateUrl: 'update.php',
		elementsUrl: 'elements.php'
	},

	tinyMCESettings: {
		Base: null,	// base class
		simple: null,
		full: null
	},

	elementEdit_instances: new Array(),

	shiftPressed: false,

	query: null,

	intialize: function() {
        this.initConsoleReplacement();
	},

	initConsoleReplacement: function() {
		this.query = window.location.search.replace('?', '').parseQueryString();
		if (this.query.site) {
			this.options.updateUrl = this.options.updateUrl + "?site=" + this.query.site;
			this.options.elementsUrl = this.options.elementsUrl + "?site=" + this.query.site;
		}
		if(!window.console) window.console = {};
		if(!window.console.debug) window.console.debug = function() { };
		if(!window.console.log) window.console.log = function() { };

		var editor=this;
		$(document).addEvent('keydown', function(event){
		    if (event.code == 16){
				editor.shiftPressed=true;
		    }
		}).addEvent('keyup', function() {
			editor.shiftPressed=false;
		});
	},

	fixDragHandlePos: function() {

		$$(this.options.xBertaEditorClassDragXY).each(function(el) {
			if (!el.hasClass('xEntry')){

				handle = el.getElement('.xHandle');
				handlePad = Math.abs(parseInt(handle.getStyle('margin-left')));
				left = parseInt(el.getStyle('left'));

				if (left<handlePad) {
					handle.setStyle('left', (handlePad-left)+'px');
				}else{
					handle.setStyle('left', 0);
				}
			}
		});

	},

	// News ticker functions
	initNewsTicker: function() {
		// init news ticker for all pages
		this.newsTickerContainer = $('xNewsTickerContainer');
		if(this.newsTickerContainer) {
			this.newsTickerContainer.getElement('a.close').addEvent('click', function(event) {
				event.stop();
				this.hideNewsTicker();
			}.bind(this));
		}
	},

	hideNewsTicker: function(event) {
		this.newsTickerContainer = $('xNewsTickerContainer');

		if(!this.newsTickerContainer.hasClass('xNewsTickerHidden')) {
			this.newsTickerContainer.addClass('xNewsTickerHidden');

			var topPanel = $('xTopPanel');
			var editorMenu = $('xEditorMenu');
			var totalWidth = 0;

			editorMenu.getElements('li').each(function(el) {
				totalWidth += el.getSize().x;
			});
			totalWidth += parseInt(editorMenu.getStyle('padding-left')) + parseInt(editorMenu.getStyle('padding-right')) + 1;

			new Fx.Slide(this.newsTickerContainer, { duration: 800, transition: Fx.Transitions.Quint.easeInOut }).show().slideOut();
			topPanel.set('tween', {duration: 800, transition: Fx.Transitions.Quint.easeInOut }).tween('width', topPanel.getSize().x + 1 + 'px', totalWidth + 'px');

			Cookie.write('_berta_newsticker_hidden', 1 /*,{ domain: window.location.host, path: window.location.pathname }*/);
		}
	},


	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///|  Element initialization  |///////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	elementEdit_init: function(el, editorClass, onElementSave) {

		if(el.retrieve('elementEdit_init')) return false;	// already initialized
		el.store('elementEdit_init', true);

		var bPlaceholderSet = this.makePlaceholderIfEmpty(el),
			self = this;


		switch(editorClass) {
			case this.options.xBertaEditorClassSimple:
				el.store('onElementSave', onElementSave);
				el.addClass(editorClass.substr(1));
				el.addEvent('click', function(event, editor) {
					if(!this.hasClass('xSaving') && !this.hasClass('xEditing')) {
						this.addClass('xEditing');
						editor.makeEmptyIfEmpty(this);
						editor.elementEdit_instances.push(this.inlineEdit({ onComplete: editor.elementEdit_save.bind(editor) }));
						editor.fireEvent(BertaEditorBase.EDITABLE_START, [el, editor.elementEdit_instances[editor.elementEdit_instances.length - 1]]);
					}
				}.bindWithEvent(el, this));
				//this.makePlaceholderIfEmpty(el);
				break;

			case this.options.xBertaEditorClassTA:
				el.store('onElementSave', onElementSave);
				el.addClass(editorClass.substr(1));
				el.addEvent('click', function(event, editor) {
					if(!this.hasClass('xSaving') && !this.hasClass('xEditing')) {
						this.addClass('xEditing');
						if(this.inlineIsEmpty()) this.innerHTML = '&nbsp;';
						editor.elementEdit_instances.push(this.inlineEdit({ type: 'textarea', onComplete: editor.elementEdit_save.bind(editor)  }));
						editor.fireEvent(BertaEditorBase.EDITABLE_START, [el, editor.elementEdit_instances[editor.elementEdit_instances.length - 1]]);
					}
				}.bindWithEvent(el, this));
				break;

			case this.options.xBertaEditorClassMCE:
			case this.options.xBertaEditorClassMCESimple:
				el.store('onElementSave', onElementSave);
				el.addClass(editorClass.substr(1));

				el.addEvent('click', function(event, editor) {
					$$('.xEditOwerlay').destroy();
					if(!this.hasClass('xSaving') && !this.hasClass('xEditing')) {
						el.addClass('xEditing');
						if(this.inlineIsEmpty()) this.innerHTML = '';
						editor.elementEdit_instances.push(this.inlineEdit({
							type: 'textarea',
							WYSIWYGSettings: el.hasClass(editor.options.xBertaEditorClassMCESimple.substr(1)) ?
												editor.tinyMCESettings.simple.options :
												editor.tinyMCESettings.full.options,
							onComplete: editor.elementEdit_save.bind(editor) }));
						editor.fireEvent(BertaEditorBase.EDITABLE_START, [el, editor.elementEdit_instances[editor.elementEdit_instances.length - 1]]);
					}
				}.bindWithEvent(el, this));

				self.initEditOwerlay(el);
				break;

			case this.options.xBertaEditorClassRC:
				el.store('onElementSave', onElementSave);
				el.addClass(editorClass.substr(1));
				el.addEvent('click', function(event, editor) {
					if(!this.hasClass('xSaving') && !this.hasClass('xEditing')) {
						el.addClass('xEditing');
						if(this.inlineIsEmpty()) this.innerHTML = '';
						this.set('old_content', this.innerHTML);
						this.set('text', this.get('title'));
						editor.elementEdit_instances.push(this.inlineEdit({ onComplete: editor.elementEdit_save.bind(editor) }));
						editor.fireEvent(BertaEditorBase.EDITABLE_START, [el, editor.elementEdit_instances[editor.elementEdit_instances.length - 1]]);
					}
				}.bindWithEvent(el, this));
				break;

			case this.options.xBertaEditorClassSelect:
			case this.options.xBertaEditorClassSelectRC:
			case this.options.xBertaEditorClassFontSelect:
				el.store('onElementSave', onElementSave);
				el.addClass(editorClass.substr(1));
				el.addEvent('click', function(event, editor) {
					if(!this.hasClass('xSaving') && !this.hasClass('xEditing')) {
						this.addClass('xEditing');

						if(this.inlineIsEmpty()) this.innerHTML = '';
						editor.elementEdit_instances.push(
							this.inlineEdit({
								type: 'select',
								subtype: this.hasClass(editor.options.xBertaEditorClassFontSelect.substr(1)) ? 'font' : (this.hasClass(editor.options.xBertaEditorClassSelectRC.substr(1)) ? 'rc' : ''),
								selectOptions: this.getProperty('x_options').split('||'),
								onComplete: editor.elementEdit_save.bind(editor)
							})
						);
						editor.fireEvent(BertaEditorBase.EDITABLE_START, [el, editor.elementEdit_instances[editor.elementEdit_instances.length - 1]]);
					}
				}.bindWithEvent(el, this));
				break;

			case this.options.xBertaEditorClassYesNo:
				el.store('onElementSave', onElementSave);
				el.addClass(editorClass.substr(1));
				var isSetToYes = bPlaceholderSet ? false : (el.get('html') == '1' ? true : false);
				el.empty();
				var prop = el.getClassStoredValue('xProperty');

				var aYes = 	new Element('a', { 'href': '#', 'class': (isSetToYes ? 'active' : '') + ' xValue-1' }).set('html', 'yes');
				var aNo = 	new Element('a', { 'href': '#', 'class': (isSetToYes ? '' : 'active') + ' xValue-0' }).set('html', 'no');
				el.grab(aYes).appendText(' / ').grab(aNo);
				aNo.addEvent('click', this.eSup_onYesNoClick.bindWithEvent(this));
				aYes.addEvent('click', this.eSup_onYesNoClick.bindWithEvent(this));
				break;

			case this.options.xBertaEditorClassImage:
			case this.options.xBertaEditorClassICO:
				el.store('onElementSave', onElementSave);
				el.addClass(editorClass.substr(1));
				var currentFile = bPlaceholderSet ? '' : el.get('html');
				el.empty();
				var prop = el.getClassStoredValue('xProperty');

				// construct uploader
				var fileNameContainer = new Element('span', { 'class': 'name' }).set('html', currentFile).inject(el);
				var aNew = 				new Element('a', { 'href': '#' }).set('html', 'choose file').inject(el);
				var aDelete = 			new Element('a', { 'href': '#' }).set('html', 'delete').inject(el);
										new Element('br', { 'class': 'clear' }).inject(el);

				if(!currentFile) aDelete.setStyle('display', 'none');
				aDelete.addEvent('click', this.eSup_onImageDeleteClick.bindWithEvent(this));

				params = [];
				var paramNames = ['xMinWidth', 'xMinHeight', 'xMaxWidth', 'xMaxHeight'],
					urlParamNames = ['min_width', 'min_height', 'max_width', 'max_height'], p;
				for(var i = 0; i < paramNames.length; i++) {
					p = el.getClassStoredValue(paramNames[i]);
					if(p) params.push(urlParamNames[i] + '=' + p);
				}
				if( this.query.site ) {
					params.push('site=' + this.query.site);
				}

                params.push('session_id=' + this.options.session_id);

				// instantiate fancy upload
				var filesFilter = {'Images (*.jpg, *.jpeg, *.gif, *.png)': '*.jpg; *.jpeg; *.gif; *.png'};
				if(editorClass == this.options.xBertaEditorClassICO) filesFilter = {'Icons (*.ico)': '*.ico'};
				var uploader = new BertaGalleryUploader(false, this, {
					verbose: false,
					flashEnabled: true,
					url: this.options.paths.engineRoot + 'upload.php?property=' + prop + '&' + params.join('&'),
					path: this.options.paths.engineRoot + 'js/swiff/Swiff.Uploader.swf',
					fileClass: Swiff.Uploader.File,

					imitSize: 10 * 1024 * 1024,
					limitFiles: 1,
					typeFilter: filesFilter,
					instantStart: true,

					// this is our browse button, *target* is overlayed with the Flash movie
					container: el,
					target: aNew,
					fallback: null,

					onStart: function() {
						el.removeClass('xEditing');
						el.addClass('xSaving');
					}.bind(this),
					onComplete: function() {
						el.removeClass('xSaving');
						el.addClass('xEditing');
					}.bind(this),

					onFileComplete: function(file) {
						var json = $H(JSON.decode(file.response.text, true) || {});
                        if(file.response.code == 401) {
                            window.location.href = this.options.paths.engineRoot;
                        } else if(json.get('status') > 0) {
							fileNameContainer.empty();
							fileNameContainer.set('html', json.get('filename'));
							aDelete.setStyle('display', 'block');
						} else {
							alert(json.get('error'));
						}

						uploader.fileRemove(file);

					}.bind(this)
				});
				break;

			case this.options.xBertaEditorClassColor:
				el.store('onElementSave', onElementSave);
				el.addClass(editorClass.substr(1));

				if(results = el.get('html').match(/\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)) {
					new Element('SPAN', {
						'class': 'colorPreview',
						'styles': {
					        'background-color': results[0]
					    }
					}).inject(el, 'top');
				}

				el.addEvent('click', function(event, editor) {
					if(!this.hasClass('xSaving') && !this.hasClass('xEditing')) {
						this.addClass('xEditing');
						this.set('old_content', el.get('html'));

						var tempValue;
						if(results = this.get('html').match(/\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/))
							tempValue = results[0];			// set to the matched color value
						else
							tempValue = el.get('title');	// set to default value

						if(!editor.mooRainbow)
							editor.mooRainbow = new MooRainbow(null, {
								id: 'xMooRainbow',
								wheel: true,
								imgPath: '_lib/moorainbow/images/'
							});
						editor.mooRainbow.element = this;

						editor.mooRainbow.removeEvents('change');
						editor.mooRainbow.removeEvents('complete');
						editor.mooRainbow.removeEvents('abort');
						editor.mooRainbow.addEvent('change', function(color) {
							//inlineBertaEditor.inputBox.set('value', color.hex);
						});
						editor.mooRainbow.addEvent('complete', function(color) {
							editor.elementEdit_save(editor, el, tempValue, tempValue, color.hex, color.hex);
							//inlineBertaEditor.onSave();
						});
						editor.mooRainbow.addEvent('abort', function(color) {
							editor.elementEdit_save(editor, el, tempValue, tempValue, color.hex, color.hex);
							//inlineBertaEditor.inputBox.set('value', tempValue);
							//inlineBertaEditor.onSave();
						});

						var currentColor = new Color(tempValue, 'RGB');
						editor.mooRainbow.show.delay(10, editor.mooRainbow);
						editor.mooRainbow.backupColor = currentColor;
						editor.mooRainbow.layout.backup.setStyle('background-color', editor.mooRainbow.backupColor.rgbToHex());
						editor.mooRainbow.manualSet(currentColor);

						editor.fireEvent(BertaEditorBase.EDITABLE_START, [el, null]);
					}
				}.bindWithEvent(el, this));
				break;

			case this.options.xEditableRealCheck:

				el.store('onElementSave', onElementSave);
				el.addClass(editorClass.substr(1));

				var value = String(el.get('html'));

				el.empty();
				var checkEl = new Element('input', { 'type': 'button', 'class': value == 1 ? 'checked' : '', 'value': '' }).inject(el);

				el.addEvent('click', this.eSup_onRealCheckClick.bindWithEvent(this, [el, checkEl]));
				break;

			case this.options.xBertaEditorClassDragXY:
				el.store('onElementSave', onElementSave);
				el.addClass(editorClass.substr(1));

				var xGuideLineX;
				var xGuideLineY;

				el.getElement('.xHandle').addEvents({
					click: function(event) {
						event.preventDefault();
					},
					mouseenter: function(event){
						//create guidelines
						winSize=document.getScrollSize();

						xGuideLineX = new Element('div', {
						    'id': 'xGuideLineX',
						    'class': 'xGuideLine',
							styles: {
						    	width: winSize.x +'px'
						    }
						});
						xGuideLineY = new Element('div', {
						    'id': 'xGuideLineY',
						    'class': 'xGuideLine',
							styles: {
						    	height: winSize.y +'px'
						    }
						});

						xGuideLineX.inject(document.body);
						if(document.body.getElement('#contentContainer.xCentered') && el.hasClass('xFixed') == false) {
							xGuideLineY.inject(document.body.getElement('#contentContainer'));
						} else if(document.body.getElement('#allContainer.xCentered') && el.hasClass('xFixed') == false) {
							xGuideLineY.inject(document.body.getElement('#allContainer'));
						} else {
							xGuideLineY.inject(document.body);
						}
						self.drawGuideLines(el, xGuideLineX, xGuideLineY);
					},
					mouseleave: function(event){
						xGuideLineX.destroy();
						xGuideLineY.destroy();
					}
				});

				var gridStep=parseInt(bertaGlobalOptions.gridStep);
				gridStep=isNaN(gridStep)||gridStep<1?1:gridStep;

				if( $('pageEntries') ) var allEntries = $('pageEntries').getElements('.mess');

				var dragAll = false;

				el.makeDraggable({
				    snap: 0,
				    grid: gridStep,
					handle: el.getElement('.xHandle'),
				    onSnap: function(el) {
						el.addClass('xEditing');
						var xCoords = new Element('div', {
							id: 'xCoords'
						});
						el.grab(xCoords , 'top');
						dragAll = self.shiftPressed && el.hasClass('xEntry');
						if(dragAll){
							el.startTop = parseInt(el.getStyle('top'));
							el.startLeft = parseInt(el.getStyle('left'));

							i=0;
							var entriesStartTop = new Array();
							var entriesStartLeft = new Array();

							allEntries.each(function(entry){
								if (el != entry){
									entriesStartTop[i]=parseInt(entry.getStyle('top'));
									entriesStartLeft[i]=parseInt(entry.getStyle('left'));
									i++;
								}
							});

							el.entriesStartTop = entriesStartTop;
							el.entriesStartLeft = entriesStartLeft;
						}
				    },
					onDrag: function(){
						$('xTopPanelContainer').hide();
                        if (parseInt(el.getStyle('left'))<0){
                            el.setStyle('left', '0');
                        }

                        if (el.hasClass('xEntry') && parseInt(el.getStyle('top'))<20 ){
	                        el.setStyle('top', '20px');
                        }else if (parseInt(el.getStyle('top'))<0){
                            el.setStyle('top', '0');
                        }
						$('xCoords').set('html', 'X:'+parseInt(el.getStyle('left'))+' Y:'+parseInt(el.getStyle('top')));
						self.drawGuideLines(el, xGuideLineX, xGuideLineY);

						if (dragAll){
							el.movedTop = parseInt(el.getStyle('top')) - el.startTop;
							el.movedLeft = parseInt(el.getStyle('left')) - el.startLeft;

							i=0;
							allEntries.each(function(entry){
								if (el != entry){
									entry.setStyles({
										top: el.movedTop + el.entriesStartTop[i] + 'px',
										left: el.movedLeft + el.entriesStartLeft[i] + 'px'
									});
									i++;
								}
							});
						}
					},
				    onComplete: function(el) {

						$('xTopPanelContainer').show();
						this.hideControlPanel(el);
					    $('xCoords').destroy();
				       	el.removeClass('xEditing');

				       	var editor = this;

				       	if (typeof(messyMess)=='object') {
							messyMess.copyrightStickToBottom();
				       	}

				       	if (dragAll){
							allEntries.each(function(entry) {
								if(this.container.hasClass('xCentered') && (entry.hasClass('xFixed'))) {
						    		var left = parseInt(entry.getStyle('left')) - (window.getSize().x - this.container.getSize().x) / 2;
						    	} else {
						    		var left = parseInt(entry.getStyle('left'));
						    	}
								var value = left + ',' + parseInt(entry.getStyle('top'));
								editor.elementEdit_save(null, entry, null, null, value, value);
							}.bind(this));

					    }else{
					    	if(this.container.hasClass('xCentered') && (el.hasClass('xFixed'))) {
					    		var left = parseInt(el.getStyle('left')) - (window.getSize().x - this.container.getSize().x) / 2;
					    	} else {
					    		var left = parseInt(el.getStyle('left'));
					    	}
							var value = left + ',' + parseInt(el.getStyle('top'));
							this.elementEdit_save(null, el, null, null, value, value);

							editor.fixDragHandlePos();
						}
						dragAll = false;

				    }.bind(this)
				});
				this.hideControlPanel(el);
				break;

			case this.options.xBertaEditorClassAction:
				el.store('onActionComplete', onElementSave);
				el.addClass(editorClass.substr(1));
				el.addEvent('click', function(event, editor) {
					if(!this.hasClass('xSaving') && !this.hasClass('xEditing')) {
						var action = this.getClassStoredValue('xCommand');
						var params = this.getClassStoredValue('xParams');
						if(action) editor.elementEdit_action(el, action, params);
					}
				}.bindWithEvent(el, this));

			case this.options.xBertaEditorClassReset:
				el.store('onActionComplete', onElementSave);
				el.addClass(editorClass.substr(1));
				el.addEvent('click', function(event, editor) {
					event.stop();
					if(!this.hasClass('xSaving') && !this.hasClass('xEditing')) {
						var action = this.getClassStoredValue('xCommand');
						var params = this.getClassStoredValue('xParams');
						if(action) editor.elementEdit_reset(el, action, params);
					}
				}.bindWithEvent(el, this));

			default:
				break;
		}
	},



	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///  Supporting functions for editables  /////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	initEditOwerlay: function (el){
		var editButton = new Element('a', {class:'xEditOwerlay'});

		el.addEvents({
		    mouseenter: function(){
		    	if (!el.hasClass('xEditing')){
		    		editButton.style.width = el.getSize().x + 'px';
		    		editButton.style.height = el.getSize().y + 'px';
					editButton.inject(el, 'top');
		    	}
		    },
		    mouseleave: function(){
		      editButton.destroy();
		    }
		});
	},


	drawGuideLines: function (el, xGuideLineX, xGuideLineY){
		var x = el.getStyle('top');
		var y = el.getStyle('left');
		xGuideLineX.setStyle('top', x);
		xGuideLineY.setStyle('left', y);
	},

	eSup_onYesNoClick: function(event) {
		event.stop();
		var target = $(event.target);
		var el = target.getParent();
		var value = target.getClassStoredValue('xValue');

		this.elementEdit_save(null, el, null, null, value, value);
	},

	eSup_onRealCheckClick: function(event, el, checkBoxEl) {
		if(!el.hasClass('xSaving')) {
			checkBoxEl.toggleClass('checked');
			var value = checkBoxEl.hasClass('checked') ? "1" : "0";

			if (el.hasClass('xProperty-fixed')){
				var entry = el.getParent('.xEntry');
				if (value=="1"){
					entry.addClass('xFixed');
					if(this.container.hasClass('xCentered')) {
						var left = parseInt(entry.getStyle('left')) + (window.getSize().x - this.container.getSize().x) / 2;
		                entry.setStyle('left', left + 'px');
		            }
				}else{
					entry.removeClass('xFixed');
					if(this.container.hasClass('xCentered')) {
						var left = parseInt(entry.getStyle('left')) - (window.getSize().x - this.container.getSize().x) / 2;
		                entry.setStyle('left', left + 'px');
		            }
				}
			}

			this.elementEdit_save(null, el, null, null, value, value);
		}
	},

	eSup_onImageDeleteClick: function(event) {
		event.stop();
		var target = $(event.target);
		var el = target.getParent();
		var prop = el.getClassStoredValue('xProperty');

		el.removeClass('xEditing');
		el.addClass('xSaving');

		new Request.JSON({
			url: this.options.updateUrl,
			data: "json=" + JSON.encode({ property: prop, params: 'delete', value: '' }),
			onComplete: function(resp, respRaw) {
				if(resp.error_message)
					alert(resp.error_message);
				else {
					el.getElement('span.name').set('html', '');
					target.setStyle('display', 'none');
				}
				el.removeClass('xSaving');
				el.addClass('xEditing');
			}
		}).post();
	},

	hideControlPanel: function(el) {
		if ( (el.hasClass('xEntry') || el.hasClass('xProperty-additionalTextXY')) &&  parseInt(el.getStyle('top'))<40 ){
			el.addEvent('mouseenter', function(){
				$('xTopPanelContainer').hide();
			});
			el.addEvent('mouseleave', function(){
				$('xTopPanelContainer').show();
			});
		}
	},

	entryLayoutStyles: function(el, response) {
		var entry = el.getParent('.xEntry');
		var entryText = entry.getElement('.entryText');
		var galleryContainer = entry.getElement('.xGalleryContainer');
		var layout = entry.getElement('.xProperty-layout').get('text');
		var leftColWidth = parseInt(entry.getElement('.xProperty-leftColWidth').get('text'));

		var entryTextWidth = null;
		var galleryContainerWidth = null;

		if (leftColWidth > 0) {
			if (layout == 'gallery-right-description-left') {
				entryTextWidth = leftColWidth + '%';
				galleryContainerWidth = (100 - leftColWidth) + '%';
			}else if( layout == 'gallery-left-description-right' ){
				entryTextWidth = (100 - leftColWidth) + '%';
				galleryContainerWidth = leftColWidth + '%';
			}
		}

		entryText.setStyle('width', entryTextWidth);
		galleryContainer.setStyle('width', galleryContainerWidth);
	},


	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///|  Saving edited element  |////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	findEditByReplacement: function(replacementElement) {
		var editToReturn;
		replacementElement = $(replacementElement);
		this.elementEdit_instances.each(function(edit) {
			if(edit.inputBox == replacementElement) {
				editToReturn = edit;
			}
		});
		return editToReturn;
	},

	elementEdit_save: function(elEditor, el, oldContent, oldContentText, newContent, newContentText) {

		if(oldContent == newContent && !el.hasClass('xBgColor')) {
			var content = oldContent;
			if(content.test('^([\s\xA0]|\&nbsp\;)+$')) content = ''; // empty, if contains only rubbish (\xA0 == &nbsp;)
			if(content) {
				el.set('html', el.get('old_content') ? el.get('old_content') : oldContentText);
			} else {
				this.makePlaceholder(el);
			}
			el.removeClass('xEditing');

		} else if(oldContent != newContent || el.hasClass('xBgColor')) {
			var property = el.getClassStoredValue('xProperty');
			var useCSSUnits = el.getClassStoredValue('xCSSUnits') > 0;
			var xUnits = el.getClassStoredValue('xUnits');
			var isToPrice = el.getClassStoredValue('xFormatModifier') == 'toPrice';
			var isCartAttributes = property == 'cartAttributes';
			var noHTMLEntities = el.hasClass('xNoHTMLEntities');
			var isLink = el.hasClass('xLink');
			var editorParams = el.getClassStoredValue('xParam');
			var entryInfo = this.getEntryInfoForElement(el);
			if(entryInfo.section == '') entryInfo.section = this.sectionName;

			// px/em/pt value validator
			if(el.hasClass(this.options.xBertaEditorClassSimple.substr(1)) || el.hasClass(this.options.xBertaEditorClassRC.substr(1))) {
				if(/(\spx|\spt|\sem)$/i.test(newContent)) {
					newContent = newContent.replace(/(\spx|\spt|\sem)$/i, newContent.substr(-2));
					newContentText = newContent;
				}
			}

			// check if new content is not empty and revert it to default value, if specified
			if(!el.hasClass(this.options.xBertaEditorClassYesNo.substr(1)) && (!newContent || newContent.test('^([\s\xA0]|\&nbsp\;)+$'))) {
				var isRequired = el.getClassStoredValue('xRequired');
				newContent = newContentText = isRequired ? el.get('title') : '';
				el.set('html', newContentText);
			}

			newContent = newContent ? newContent.trim() : '';
			if(noHTMLEntities && elEditor && elEditor.removeHTMLEntities) newContent = elEditor.removeHTMLEntities(newContent);
			//console.debug(newContent, parseInt(newContent), newContent == parseInt(newContent));
			if(newContent == parseInt(newContent) && useCSSUnits) {
				if(!newContent || newContent == '0')
					newContent = '0';
				else {
					newContent = String(newContent) + 'px';
				}
			}

			//for integer numbers with custom units
			if (xUnits && xUnits.length) {
				newContent = parseInt(newContent);
				newContent = newContent ? newContent : 0;
				newContent = String(newContent) + xUnits;
			}

			//create prefix for links
			if ( isLink ) {
				if (newContent.length && newContent.search(":") < 0 ) {
					newContent = 'http://' + newContent;
				}
			}

			if ( isToPrice ) {
				//add "add to cart" button
				var aele = el.getNext('.aele');
				var cartAttributes = el.getNext('.cartAttributes');
				if (aele) {
					newContent = parseFloat(newContent);

					if (newContent){
						aele.removeClass('hidden');
						cartAttributes.removeClass('hidden');
					}else{
						aele.addClass('hidden');
						cartAttributes.addClass('hidden');
					}
				}
			}

			if (isCartAttributes) {

				var cartAttributes = el.getParent('.xEntry').getElement('.cartAttributes');
				var cartPrice = el.getParent('.xEntry').getElement('.cartPrice').get('text');
    			var values = newContent.split(",");
				var isList = !(values.length == 1 && values[0]=='');

				cartAttributes.set('text','').addClass('hidden');

				//generate select box on the fly - is price is > 0
				if ( isList ){
					var selectBox = new Element('select', {class:'cart_attributes'});
					for (var i = 0; i < values.length; i++) {
						var val = values[i].trim();
						val = this.unescapeHtml(val);
						var selectBoxOption = new Element('option', {value: val});
						selectBoxOption.set('text', val);
						selectBoxOption.inject(selectBox);
					};
					selectBox.inject(cartAttributes);
					if( parseInt(cartPrice) > 0 ){
						cartAttributes.removeClass('hidden');
					}
				}

			}

			if (el.hasClass('xProperty-width')){
				var entry = el.getParent('.xEntry');
				if (newContent.length){
					entry.setStyle('width', newContent);
				}else{
					entry.setStyle('width', null);
				}
			}

			// SAVE
			el.removeClass('xEditing');
			el.addClass('xSaving');

			// Get action for Gallery type, Autoplay, Full screen & Image size
			var action = el.getClassStoredValue('xCommand');
			if(action) {
				if(action == 'SET_BG_CAPTION_BACK_COLOR') editorParams = newContentText.hexToRgb(true).join(',');
				else editorParams = this.escapeForJSON(newContentText);
				//console.debug(editorParams);
			}

			new Request.JSON({
				url: this.options.updateUrl,
				data: "json=" + JSON.encode({
					site: entryInfo.site,
					section: entryInfo.section,
					entry: entryInfo.entryId,
					cover: entryInfo.coverId,
					property: property,
					params: editorParams,
					value: newContent ? this.escapeForJSON(newContent) : null,
					action: action,
					before: this.escapeForJSON(el.get('old_content') ? el.get('old_content') : oldContent),
					before_real: this.escapeForJSON(el.get('title') ? el.get('title') : oldContent),
					format_modifier: el.getClassStoredValue('xFormatModifier')
					/*use_css_units: useCSSUnits*/
				}),
				onComplete: function(resp, respRaw) {
					var elIsStillInDOM = el ? el.exists() : false;

					// perform any element updates only if the element is still in DOM
					// otherwise the update is not necessary
					if(elIsStillInDOM) {
						switch(true) {

							case !resp.update:
								// update with the placeholder
								this.makePlaceholder(el);
								break;

							case el.hasClass(this.options.xBertaEditorClassYesNo.substr(1)):
								el.getElements('a').removeClass('active');
								el.getElement('a.xValue-' + resp.update).addClass('active');
								break;

							case el.hasClass(this.options.xBertaEditorClassColor.substr(1)):
								// for color select we need to inject the color block
								el.set('html', resp.update);
								new Element('SPAN', {
									'class': 'colorPreview',
									'styles': {
								        'background-color': resp.update
								    }
								}).inject(el, 'top');

								break;

							case el.hasClass(this.options.xBertaEditorClassSelectRC.substr(1)):
							case el.hasClass(this.options.xBertaEditorClassFontSelect.substr(1)):
								var editInitializer = this.elementEdit_instances[this.elementEdit_instances.length-1].editting,
									oldValue;
								if(editInitializer.hasClass('xEntrySlideNumberVisibility')) {
									if(resp.update == 'no') oldValue = 'yes';
									else oldValue = 'no';

									editInitializer.getParent('.xGalleryContainer').removeClass('xSlideNumbersVisible-' + oldValue).addClass('xSlideNumbersVisible-' + resp.update);
								}

								if(editInitializer.hasClass('xUseNextImgAsBg')) {
									if(resp.update == 'no') oldValue = 'yes';
									else oldValue = 'no';
								}

								// for the RC selects we check:
								// 1) either the returned update equals the newly set content, which means that the saving was successful
								if(resp.update == newContent) {
									el.set('html', newContentText);

								// 2) the returned update differs from the newly set content
								//      => look for the returned "real" value in the select's options
								} else {
									var curOption; newContentText = false;
									for(var i = 0; i < this.options.selectOptions.length; i++) {
										curOption = this.options.selectOptions[i].split('|');
										if(curOption[0] == resp.real) {
											resp.update = curOption[1];
											break;
										}
									}
									el.set('html', resp.update);
								}

								//set entry layout class
								if (el.hasClass('xProperty-layout')){
									var entry = el.getParent('.xEntry');
									var classes = entry.getProperty('class').split(" ");
									for (var i = classes.length - 1; i >= 0; i--) {
										if ( classes[i].substring(0,8) === 'xgallery' ) {
											entry.removeClass(classes[i]);
										}
									};
									entry.addClass('x'+resp.update);
									this.entryLayoutStyles(el, resp.update);
								}

								// Don't hide the settings if we're updating cover gallery. Don't know why we're hiding them in the first place
								if (!editInitializer.hasClass('xUseNextImgAsBg')) {
									$$('.galleryTypeSettings').addClass('xHidden');
								}

								//console.debug(newContentText);
								if(newContentText == 'slideshow') {
									el.getSiblings('.xEntrySlideshowSettings').removeClass('xHidden');
									// el.getSiblings('.xEntryLinkSettings').addClass('xHidden');
								}
								if(newContentText == 'row') {
									el.getSiblings('.xEntryRowSettings').removeClass('xHidden');
									// el.getSiblings('.xEntrySlideshowSettings').addClass('xHidden');
									// el.getSiblings('.xEntryLinkSettings').addClass('xHidden');
								}
								if(newContentText == 'link') {
									el.getSiblings('.xEntryLinkSettings').removeClass('xHidden');
									// el.getSiblings('.xEntrySlideshowSettings').addClass('xHidden');
								}
								break;


							case el.hasClass(this.options.xBertaEditorClassRC.substr(1)):
								// for simple RC textfields we additionally set the real_content property
								if( (el.hasClass('xEntryAutoPlay') || el.hasClass('xBgAutoPlay')) && !(/^\d+$/.test(newContentText)) ) {
									el.set('title', 0);
									el.set('text', 0);
								} else if( el.hasClass('xEntryLinkAddress') && !newContentText ) {
									el.set('title', 'http://');
									el.set('html', 'http://');
								} else {
									el.set('title', elEditor.removeHTMLEntities(resp.real));
									el.set('html', resp.update);
								}
								break;


							default:
								if ( el.hasClass('xProperty-leftColWidth') ){
									this.entryLayoutStyles(el, resp.update);
								}

								// for all other cases just update the HTML, if the editor instance is present
								// (editor instance is not present, for instance, in real input fields (checkbox, etc..))
								if(elEditor) {
									el.empty();
									el.set('html', resp.update);
								}

						}

						if(resp.error_message) alert(resp.error_message);

						el.removeClass('xSaving');
						el.removeClass('xEditing');
						el.removeProperty('old_content');

						try	{
							this.setWmodeTransparent();
						} catch(e) {

						}
					}

					// if there is a stored onSave event, execute it
					onSave = el.retrieve('onElementSave');
					if(onSave) onSave(el, resp.update, resp.real, resp.error_message, resp.params);
					this.fireEvent(BertaEditorBase.EDITABLE_FINISH, [el]);

					//correct footer position
					if (typeof(messyMess)=='object') {
  			  			messyMess.copyrightStickToBottom();
           			}

				 }.bind(this)
			}).post();

		}
	},



	elementEdit_action: function(el, action, params) {
		el.addClass('xSaving');
		var entryInfo = this.getEntryInfoForElement(el);
		if(entryInfo.section == '') entryInfo.section = this.sectionName;

		new Request.JSON({
			url: this.options.updateUrl,
			data: "json=" + JSON.encode({
				section: entryInfo.section, entry: entryInfo.entryId,
				action: action, property: null, value: null, params: params
			}),
			onComplete: function(resp) {
				if(!resp) {
					alert('server produced an error while performing the requested action! something went sooooo wrong...');
				} else if(resp && !resp.error_message) {
				} else {
					alert(resp.error_message);
				}
				if(el) {
					el.removeClass.delay(500, el, 'xSaving');
					onComplete = el.retrieve('onActionComplete');
					if(onComplete) onComplete(el, action, params, resp);
				}
			}.bind(this)
		}).post();
	},



	elementEdit_reset: function(el, action, params) {
		if(el.hasClass('xBgColorReset') && confirm('Berta asks:\n\nAre you sure you want to remove this color?')) {
			el.addClass('xSaving');
			var entryInfo = this.getEntryInfoForElement(el);
			if(entryInfo.section == '') entryInfo.section = this.sectionName;

			new Request.JSON({
				url: this.options.updateUrl,
				data: "json=" + JSON.encode({
					section: entryInfo.section,	action: action, property: null, value: null
				}),
				onComplete: function(resp) {
					if(!resp) {
						alert('server produced an error while performing the requested action! something went sooooo wrong...');
					} else if(resp && !resp.error_message) {
					} else {
						alert(resp.error_message);
					}
					if(el) {
						el.removeClass.delay(500, el, 'xSaving');
						elem = el.getSiblings('.xCommand-' + params);
						if(elem.length == 0) elem = el.getSiblings('.xProperty-' + params);
						elem.each(function(item) {
							item.set('title', '#ffffff').set('text', 'none');
							//new Element('SPAN', {
							//	'class': 'colorPreview',
							//	'styles': {
							//		'background-color': 'rgb(255, 255, 255)'
							//	}
							//}).inject(item, 'top');
						});
					}
				}.bind(this)
			}).post();
		}
	},



	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///  tinyMCE  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	tinyMCE_onSave: function(mceInstance) {
		if(mceInstance) {
			var tAElement = mceInstance.getElement();
			mceInstance.remove();
			tAElement.setStyle('visibility', 'hidden');

			var elInlineEdit = this.findEditByReplacement(tAElement)
			elInlineEdit.onSave.delay(100, elInlineEdit);
		}
	},

	tinyMCE_ConfigurationsInit: function() {
		this.tinyMCESettings.Base = new Class({
			Implements: Options,
			options: {
				mode : "exact",
				theme : "advanced",
				width : "563px", height : "300px !important",
				theme_advanced_buttons1 : "save,|,pasteword,|,undo,redo,|,bold,italic,forecolor,backcolor,fontsizeselect,formatselect,bullist,numlist,|,link,unlink,insertanything,|,code,pdw_toggle",
				theme_advanced_buttons2 : "justifyleft,justifycenter,justifyright,justifyfull,|,outdent,indent,|,tablecontrols,|,removeformat,cleanup",
				theme_advanced_buttons3 : "",
				theme_advanced_path : true,
				theme_advanced_toolbar_location : "top",
				theme_advanced_toolbar_align : "left",
				theme_advanced_statusbar_location : "bottom",
				theme_advanced_resizing : true,

				save_enablewhendirty : false,
				save_onsavecallback: this.tinyMCE_onSave.bind(this),

				plugins: "save,insertanything,paste,table,pdw",

				pdw_toggle_on : 1,
            	pdw_toggle_toolbars : "2",

				theme_advanced_blockformats : "p,h2,h3",

				valid_elements : "iframe[*],object[*],embed[*],param[*],form[*],input[*],textarea[*],select[*],option[*]," +
								 "p[class|style|id],b[class],i[class],strong[class],em[class],a[*],br[*],u[class]," +
								 "ul[*],li,ol[*],img[*],hr[class],h2[class|style|id],h3[class|style|id],div[*],table[*],thead[*],tbody[*],tr[*],td[*],span[*],ins[*]",
				custom_elements : '',
				extended_valid_elements : '',
				convert_urls: false,
				relative_urls: false,

				media_use_script: false,
			},
			initialize: function(options){
				this.setOptions(options);
			}
		});

		this.tinyMCESettings.full = new this.tinyMCESettings.Base();
		this.tinyMCESettings.simple = new this.tinyMCESettings.Base({
			mode : "exact",
			theme_advanced_buttons1 : "save,bold,italic,removeformat,link,code",
			theme_advanced_buttons2 : "",
			valid_elements : "p[*],b,i,strong,em,a[*],br[*],u,img[*],div[*],iframe[*],span[*],ins[*]",
			width : "100%", height: "60px !important",
			theme_advanced_statusbar_location : null,
			plugins: "save,insertanything"
			//paste_postprocess : function(pl,o) { o.node.innerHTML = TidyEditor("paste_postprocess", o.node.innerHTML); }
		});
	},




	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///  Utilities  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	unescapeHtml: function (str) {
	    var temp = document.createElement("div");
	    temp.innerHTML = str;
	    var result = temp.childNodes[0].nodeValue;
	    temp.removeChild(temp.firstChild);
	    return result;
	},

	getEmptyPlaceholder: function(property, caption) {
		if(caption)
			property = caption.replace(/\+/g, ' ');
		else {
			property = property.split('/');
			property = property[property.length - 1];
		}
		return new Element('span', { 'class': this.options.xEmptyClass.substr(1), 'html': '&nbsp;' + property + '&nbsp;' });
	},
	makePlaceholder: function(el) {
		var property = el.getClassStoredValue('xProperty');
		var caption = el.getClassStoredValue('xCaption');
		el.empty();
		this.getEmptyPlaceholder(property, caption).inject(el);
		return true;
	},


	makePlaceholderIfEmpty: function(el) {
		if(el.get('html').trim() == '')
			return this.makePlaceholder(el);
		return false;
	},
	makeEmptyIfEmpty: function(el) {
		if(el.inlineIsEmpty()) el.innerHTML = '';
	},


	escapeForJSON: function(str) {
		return encodeURIComponent(String(str).replace(/\"/g, '\\"'));
	},

	getEntryInfoForElement:function(el) {
		var retObj = {};

		retObj.site = el.getClassStoredValue('xSite');

		retObj.entryObj = el.getClassStoredValue('xEntryId') ? el : el.getParent('.xEntry');
		retObj.listObj = el.getClassStoredValue('xSection') ? el : el.getParent('.xEntriesList');

		// get entryId and entryNum from the entryObj
		retObj.entryId = retObj.entryObj ? retObj.entryObj.getClassStoredValue('xEntryId') : '';
		retObj.entryNum = retObj.entryObj ? retObj.entryObj.getClassStoredValue('xEntryNum') : '';

		coverObj = el.getParent('.cover');
		retObj.coverId = coverObj ? coverObj.getClassStoredValue('xCoverId') : '';

        // try to get section from entryObj, and if not successful — then from listObj
        retObj.section = retObj.entryObj ? retObj.entryObj.getClassStoredValue('xSection') : '';
        if(!retObj.section)
            retObj.section = retObj.listObj ? retObj.listObj.getClassStoredValue('xSection') : '';

		if(!retObj.section && coverObj)
			retObj.section = el.getParent('body').getClassStoredValue('xContent');

		return retObj;
	},

	getSectionNameForElement:function(el) {
		var retString;

		retString = el.getClassStoredValue('xSection') ? el.getClassStoredValue('xSection') : null;

		return retString;
	}

});

BertaEditorBase.EDITABLE_START = 'editable_start';
BertaEditorBase.EDITABLE_FINISH = 'editable_finish';


// Toggles top panel's visibility
window.addEvent('domready', function(){
	var slideEl = document.getElementById('xTopPanel');
	if(slideEl) {
		var slideOutEl = document.getElementById('xTopPanelSlideOut');
		var slideInEl = document.getElementById('xTopPanelSlideIn');

		var fxOut = new Fx.Tween(slideEl);
		var fxIn = new Fx.Tween(slideInEl);

		slideOutEl.getElement('span').addEvent('click', function(event) {
			event.stop();

			if ($('xNewsTickerContainer')){
				$('xNewsTickerContainer').hide();
			}

			fxOut.start('top', -19).chain(function() {
				fxIn.start('top', 0);
			});
		});

		slideInEl.getElement('span').addEvent('click', function(event) {
			event.stop();

			fxIn.start('top', -19).chain(function() {
				fxOut.start('top', 0);
			});
		});
	}

    tourInit = function(){

        if (!Cookie.read('_berta_videos_hidden') || typeof(bertaGlobalOptions)=='undefined' || bertaGlobalOptions.skipTour) {
            return;
        }

        var steps = [];
        var engine_path = window.location.pathname.split( '/' );
        engine_path.pop();
        engine_path = engine_path.join('/') + '/';
        var next = null;
        var doneLabel = null;
        var query = window.location.search.replace('?', '').parseQueryString();
        var query_site = '';
        if (query.site) {
            query_site = "?site=" + query.site;
        }

        if ($$('.page-xSections').length) {
            steps = [
                {
                    element: document.querySelector('#xSections'),
                    intro: "Add, copy, hide or delete your sections here.",
                    position: 'right'
                }
            ];
            next = engine_path + 'settings.php' + query_site;
        }else if($$('.page-xSettings').length){
            steps = [
                {
                    element: document.querySelector('#xSettings'),
                    intro: "Choose your template and edit general settings.",
                    position: 'right'
                }
            ];
            next = engine_path + 'settings.php?mode=template' + (query.site ? '&site=' + query.site : '');
        }else if($$('.page-xTemplate').length){

            steps.push(
                {
                    element: document.querySelector('#xMySite'),
                    intro: "Site editing view. Add, drag & drop text and images",
                    position: 'right'
                }
            );

            steps.push(
                {
                    element: document.querySelector('#xTemplateDesign'),
                    intro: "Customize web design: font, size, colors, spacing and other. You can even add your custom CSS code.",
                    position: 'right'
                }
            );

            var xHelpDesk = document.querySelector('#xHelpDesk');
            if (xHelpDesk){
                steps.push(
                    {
                        element: document.querySelector('#xHelpDesk'),
                        intro: "Find help here - videos, tutorials, FAQs and a discussion board.",
                        position: 'left'
                    }
                );
            }

            steps.push(
                {
                    element: document.querySelector('#xSections'),
                    intro: "Start your website!",
                    position: 'right'
                }
            );

            doneLabel = 'Done';

        }else if($$('.page-xMySite').length){
            steps = [
                {
                    element: document.querySelector('#xTopPanelContainer'),
                    intro: "Hey! This is a control panel.",
                    position: 'right'
                }
            ];
            next = engine_path + 'sections.php' + query_site;
        }

        if (steps.length) {

            var tour = introJs();
            var exitButton =  new Element('a', {
                    'href': '#',
                    'class': 'introjs-button introjs-exit'
                }).set('html', 'Exit');

            tour.setOptions({
                steps: steps,
                'doneLabel': doneLabel ? doneLabel : 'Next',
                'nextLabel': 'Next',
                'prevLabel': 'Back',
                showBullets: false,
                showStepNumbers: false,
                exitOnOverlayClick: false
            });

            tour.start().onafterchange(function(){
                var skipbutton = $$('.introjs-skipbutton');
                if (skipbutton.length){
                    if (skipbutton[0].get('text') == 'Done'){
                        exitButton.hide();
                        skipbutton[0].setStyles({'display': 'inline', 'float': 'left'});
                    }else{
                        exitButton.show();
                        skipbutton[0].setStyles({'display': 'none', 'float':'none'});
                    }
                }
            }).oncomplete(function() {
                if (next) {
                    window.location.href = next;
                }else{
                    exitTour();
                }
            }).onexit(function() {
                exitTour();
            });

            //add exit button
            setTimeout(function(){
                var tooltipbuttons = $$('.introjs-tooltipbuttons');

                exitButton.addEvent('click', function(e){
                    e.preventDefault();
                    tour.exit();
                    exitTour();
                });
                exitButton.inject( tooltipbuttons[0] , 'top' );
            }, 200);

            var exitTour = function(){
                var editor = new BertaEditorBase;
                var updateUrl = editor.options.updateUrl;

                if (query.site) {
                    updateUrl = updateUrl + query_site;
                }

                new Request.JSON({
                    url: updateUrl,
                    data: "json=" + JSON.encode({
                        property: 'tourComplete', value: 1
                    }),
                    onComplete: function(resp) {
                        window.location.href = engine_path + 'sections.php' + query_site;
                    }.bind(this)
                }).post();
            }
        }
    }
    tourInit();

});


function TidyEditor(t, v){
    alert(v);
    switch (t)
    {
        case "paste_postprocess":
            var p4 = /<div id="_mcePaste[^>]*>(?!<div>)([\s\S]*)<\/div>([\s\S]*)$/i;
            v = v.replace(p4, '<div>$1</div>');
            var p5 = /<div id="_mcePaste[^>]*>/gi;
            v = v.replace(p5, '<div>');
    }
    return v;
}
