

Element.implement({
	getIndex: function(type) {
        type = (type) ? type : '';
        return $$(type).indexOf(this);
    },

	exists: function() {
        return (this.getIndex() >= 0);
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
	
	
	intialize: function() {
		this.initConsoleReplacement();
	},
	
	initConsoleReplacement: function() {
		if(!window.console) window.console = {};
		if(!window.console.debug) window.console.debug = function() { };
		if(!window.console.log) window.console.log = function() { };
	},
	
	initNewsTicker: function() {
		// init news ticker for all pages
		this.newsTickerContainer = $('xNewsTickerContainer');
		if(this.newsTickerContainer) {
			this.newsTickerContainer.getElement('a.close').addEvent('click', function(event) {
				event.stop();
				new Fx.Slide(this.newsTickerContainer, { duration: 800, transition: Fx.Transitions.Quint.easeInOut }).show().slideOut();
				Cookie.write('_berta_newsticker_hidden', 1 /*,{ domain: window.location.host, path: window.location.pathname }*/);
			}.bind(this));
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
				//el.addClass(editorClass.substr(1) + 'Applied');
				
				el.addEvent('click', function(event, editor) {
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
						editor.elementEdit_instances.push(this.inlineEdit({ type: 'select', 
																  subtype: this.hasClass(editor.options.xBertaEditorClassFontSelect.substr(1)) ? 'font' : 
																			(this.hasClass(editor.options.xBertaEditorClassSelectRC.substr(1)) ? 'rc' : ''), 
																  selectOptions: this.getProperty('x_options').split('||'), 
																  onComplete: editor.elementEdit_save.bind(editor) }));
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
						//this.unlinearProcess_start(this.uploadQueueProcessId, 'Uploading file for ' + prop);
					}.bind(this),
					onComplete: function() {
						el.removeClass('xSaving');
						el.addClass('xEditing');
						//this.unlinearProcess_stop(this.uploadQueueProcessId);
					}.bind(this),

					onFileComplete: function(file) {
						//console.debug('onFileCompelte: ', file.response);
						var json = $H(JSON.decode(file.response.text, true) || {});
						if(json.get('status') > 0) {
							fileNameContainer.empty();
							/*(new Element('img', { 'src': self.options.paths.siteABSRoot + 'storage/media/' + json.get('filename') }))
								.inject(fileNameContainer);*/
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
				//var checkEl = new Element('input', { 'type': 'checkbox', 'checked': value == 1 ? true : false }).inject(el);
				
				el.addEvent('click', this.eSup_onRealCheckClick.bindWithEvent(this, [el, checkEl]));
				break;
			
			case this.options.xBertaEditorClassDragXY:
				el.store('onElementSave', onElementSave);
				el.addClass(editorClass.substr(1));
				el.getElement('.xHandle').addEvent('click', function(event) {
					event.preventDefault();
				})

				var gridStep=parseInt(bertaGlobalOptions.gridStep);
				gridStep=isNaN(gridStep)||gridStep<1?1:gridStep;

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
				    },
					onDrag: function(){
                        if (parseInt(el.getStyle('left'))<0){
                            el.setStyle('left', '0');
                        }
                        if (parseInt(el.getStyle('top'))<0){
                            el.setStyle('top', '0');
                        }
						$('xCoords').set('html', 'X:'+parseInt(el.getStyle('left'))+' Y:'+parseInt(el.getStyle('top')));
					},
				    onComplete: function(el) {
					    $('xCoords').destroy();
				       	el.removeClass('xEditing');
						var value = parseInt(el.getStyle('left')) + ',' + parseInt(el.getStyle('top'));
						this.elementEdit_save(null, el, null, null, value, value);
				    }.bind(this)
				});
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
			
			
			default:
				break;
		}
	},
	
	
	
	
	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///  Supporting functions for editables  /////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
		//console.log(oldContent);
		//console.log(newContent)
		//console.log(oldContentText);
		//console.log(newContentText);;
		
		if(oldContent == newContent) {
			var content = oldContent;
			if(content.test('^([\s\xA0]|\&nbsp\;)+$')) content = ''; // empty, if contains only rubbish (\xA0 == &nbsp;)
			if(content) {
				el.set('html', el.get('old_content') ? el.get('old_content') : oldContentText);
			} else {
				this.makePlaceholder(el);
			}
			el.removeClass('xEditing');
		
		} else if(oldContent != newContent) {
			var property = el.getClassStoredValue('xProperty');
			var useCSSUnits = el.getClassStoredValue('xCSSUnits') > 0;
			var noHTMLEntities = el.hasClass('xNoHTMLEntities');
			var editorParams = el.getClassStoredValue('xParam');
			var entryInfo = this.getEntryInfoForElement(el);
			
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
			//console.debug(newContent);

			// SAVE
			el.removeClass('xEditing');
			el.addClass('xSaving');
			
			new Request.JSON({
				url: this.options.updateUrl, 
				data: "json=" + JSON.encode({
					section: entryInfo.section, entry: entryInfo.entryId, property: property, params: editorParams, value: newContent ? this.escapeForJSON(newContent) : null,
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
								break;
								
							case el.hasClass(this.options.xBertaEditorClassRC.substr(1)):
								// for simple RC textfields we additionally set the real_content property
								el.set('title', elEditor.removeHTMLEntities(resp.real));
								el.set('html', resp.update);
								break;
							
							default:
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
					}
					
					// if there is a stored onSave event, execute it
					onSave = el.retrieve('onElementSave');
					if(onSave) onSave(el, resp.update, resp.real, resp.error_message, resp.params);
					this.fireEvent(BertaEditorBase.EDITABLE_FINISH, [el]);
					
				 }.bind(this)
			}).post();
			
		}
	},
	
	
	
	elementEdit_action: function(el, action, params) {
		el.addClass('xSaving');
		var entryInfo = this.getEntryInfoForElement(el);
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
				width : "600px", height : "300px",
				//content_css : "<? echo $ENGINE_ABS_ROOT ?>css/mce.css.php",
				theme_advanced_buttons1 : "save,|,pasteword,|,undo,redo,|,bold,italic,removeformat,cleanup,styleprops,|,bullist,numlist,outdent,indent,|,hr,link,unlink,insertanything,|,code",
				theme_advanced_buttons2 : "",
				theme_advanced_buttons3 : "",
				theme_advanced_path : true,
				theme_advanced_toolbar_location : "top",
				theme_advanced_toolbar_align : "left",
				theme_advanced_statusbar_location : "bottom",
				theme_advanced_resizing : true,

				save_enablewhendirty : false,
				save_onsavecallback: this.tinyMCE_onSave.bind(this),

				plugins: "save,insertanything,paste",

				valid_elements : "script[src],fb:comments[*],iframe[*],object[*],embed[*],param[*],form[*],input[*],textarea[*],select[*]," + 
								 "p[class],b[class],i[class],span[class],strong[class],em[class],a[href|target|class|style|title],br[*],u[class]," + 
								 "ul,li,ol,img[*],hr[class]",
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
			valid_elements : "p,b,i,strong,em,a[href|target|class|style],br[*],u,img[*]",
			width : "100%", height: "60px",
			theme_advanced_statusbar_location : null,
			plugins: "save,insertanything"
			//paste_postprocess : function(pl,o) { o.node.innerHTML = TidyEditor("paste_postprocess", o.node.innerHTML); }
		});
	},



	
	  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 ///  Utilities  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
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
		
		retObj.entryObj = el.getClassStoredValue('xEntryId') ? el : el.getParent('.xEntry');
		retObj.listObj = el.getClassStoredValue('xSection') ? el : el.getParent('.xEntriesList');
		
		// get entryId and entryNum from the entryObj
		retObj.entryId = retObj.entryObj ? retObj.entryObj.getClassStoredValue('xEntryId') : '';
		retObj.entryNum = retObj.entryObj ? retObj.entryObj.getClassStoredValue('xEntryNum') : '';
		
		// try to get section from entryObj, and if not successful — then from listObj
		retObj.section = retObj.entryObj ? retObj.entryObj.getClassStoredValue('xSection') : '';
		if(!retObj.section)
			retObj.section = retObj.listObj ? retObj.listObj.getClassStoredValue('xSection') : '';
			
		return retObj;
	}
	
	
	
});

BertaEditorBase.EDITABLE_START = 'editable_start';
BertaEditorBase.EDITABLE_FINISH = 'editable_finish';




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