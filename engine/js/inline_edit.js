
var inlineEdit = new Class({
	getOptions: function(){
		return {
			onComplete: function(el,oldContent,newContent){
			},
			type: 'input',
			subtype: '',			// 'font' for font selector (type = 'select')
			WYSIWYGSettings: 0,
			selectOptions: new Array(),
			dontHideOnBlur: false
		};
	},
	
	
	addHTMLEntities: function(str) {
		var s = [new RegExp("&", "g"), new RegExp('"', "g"), new RegExp("<", "g"), new RegExp(">", "g")];
		var r = ['&amp;', '&quot;', '&lt;', '&gt;'];
		for(var i = 0; i < s.length; i++) {
			str = str.replace(s[i], r[i]);
		}
		return str;
	},
	removeHTMLEntities: function(str) {
		var ta = new Element("textarea");
		ta.set('html', str.replace(/</g,"&lt;").replace(/>/g,"&gt;"));
		var returnValue = ta.value;
		ta.destroy();
		return returnValue;
	},
	
	initialize: function(element,options){
		this.setOptions(this.getOptions(), options);
		if(!element.innerHTML.toLowerCase().match('<'+this.options.type)){
			this.editting = element;
			
			// get element's content
			this.oldContent = this.oldContentText = element.innerHTML;
			var content = this.oldContent.trim();
			if(!this.options.WYSIWYGSettings) {
				content = content.replace(new RegExp("<br.*?/?>", "gi"), "\n");
				content = this.removeHTMLEntities(content);
			}
			//var content = this.removeHTMLEntities(this.oldContent.trim());
			
			var inputBoxId = '_replacement' + $random(0, 9999) + $random(0, 9999) + $random(0, 9999);

			// create the replacement element and set it's value
			this.inputBox = new Element(this.options.type, {
				id: inputBoxId,
				value: content
			}).setStyles({
				/*'margin-top': -parseInt(element.getStyle('padding-top')),
				'margin-right': -parseInt(element.getStyle('padding-right')),
				'margin-bottom': -parseInt(element.getStyle('padding-bottom')),
				'margin-left': -parseInt(element.getStyle('padding-left')),*/
				'margin': '-3px -4px -3px -4px',
				'border-width': '1px',
				'padding': '2px',
				'width': '80%',
				'font-size': '100%'
				//'border': '0'
			});

			//set height for longtext - textarea
			if (this.options.type=='textarea'){
				var height = element.getSize().y; 
				this.inputBox.setStyles({
					'height': height+'px'
				});
			}

			if(!this.inputBox.value) { 
				try {
					this.inputBox.set('html', content);
				} catch(e) { }
			}
			this.setAllStyles(element,this.inputBox);
			
			// for selects create options and select the right one
			var curOption;
			if(this.options.type == 'select') {
				for(var i = 0; i < this.options.selectOptions.length; i++) {
					curOption = this.options.selectOptions[i].split('|');
					if(curOption.length == 1) curOption[1] = this.options.selectOptions[i];
					
					new Element('option', {
							'style': this.options.subtype == 'font' ? ('font-family: ' + curOption[0] + '; font-size: 16px') : ''
						})
					    .setProperty('value', curOption[0])
					    .setProperty('value_title', curOption[1])
					    .setProperty('selected', (this.options.subtype == 'rc' || this.options.subtype == 'font') ? (curOption[1] == this.oldContentText) : (curOption[0] == this.oldContent))
						.set('html', curOption[1])
					    .injectInside(this.inputBox);
					
					// for RC selects we have to save the current selected value because the editable element contains text which is not the real value
					if((this.options.subtype == 'rc' || this.options.subtype == 'font') && curOption[1] == this.oldContentText) this.oldContent = curOption[0]
				}
			}
			
			// inject the replacement into the DOM and give it focus
			this.editting.set('html', '');
			this.inputBox.injectInside(this.editting);
			(function() {
				try { this.inputBox.focus(); } catch(e) { }
				if(this.inputBox.select) this.inputBox.select(); 
			}.bind(this)).delay(300);
			
			if(this.options.WYSIWYGSettings) {
				//console.debug(this.options.WYSIWYGSettings);
				var ed = new tinymce.Editor(inputBoxId, this.options.WYSIWYGSettings);
				tinymce.EditorManager.add(ed);
				ed.render();
				
				// update editor height - this is needed, if desired height is below 100. 
				// tinymce wouldn't allow heights smaller than 100
				var e = $(ed.id + '_tbl'), ifr = $(ed.id + '_ifr');
	            e.setStyle('height', this.options.WYSIWYGSettings.height);
				ifr.setStyle('height', this.options.WYSIWYGSettings.height);
	
				// set styles for the tinymce body element
				this.setAllStylesMCE(element, ed);
			
			} else {
				// add events
				this.inputBox.addEvent('change',this.onSave.bind(this));
				if(!this.options.dontHideOnBlur) this.inputBox.addEvent('blur',this.onSave.bind(this));
			}
		}
	},
	
	onSave: function(){
		this.inputBox.removeEvents();
		
		this.newContent = this.options.WYSIWYGSettings ? 
							this.inputBox.get('value').trim() : 
							this.addHTMLEntities(this.inputBox.get('value').trim()).replace(new RegExp("\n", "gi"), "<br />");
		//this.newContent = this.inputBox.get('value').trim();
		this.newContentText = this.newContent;
		if(this.options.type == 'select' && this.options.subtype == 'rc' || this.options.subtype == 'font') {
			this.newContentText = this.inputBox.getElement('option[selected]').get('text');
			this.editting.set('html', this.newContentText);
		} else {
			this.editting.set('html', this.newContent);
		}
			
		this.fireEvent('onComplete', [this, this.editting, this.oldContent, this.oldContentText, this.newContent, this.newContentText]);
	},
	
	setAllStyles: function(prevel, el){
        /**/
		var stylesToCopy = [ 'font-family', 'font-weight', 'font-style', 'text-transform', 'line-height', 'letter-spacing', 'font' ];
		for(var i = 0; i < stylesToCopy.length; i++) {
			if(prevel.getStyle(stylesToCopy[i])) el.setStyle(stylesToCopy[i], prevel.getStyle(stylesToCopy[i]));
		}

	},
	setAllStylesMCE: function(prevel, mceEditor){
		var stylesToCopy = [ 'font-size', 'font-family', 'font-weight', 'font-style', 'text-transform', 'line-height', 'letter-spacing', 'font' ];
		var s, b = mceEditor.dom.select('body');
		for(var i = 0; i < stylesToCopy.length; i++) {
			s = prevel.getStyle(stylesToCopy[i]);
			if(s) mceEditor.dom.setStyle(b, stylesToCopy[i], s);
		}
		//mceEditor.dom.setStyle(b, 'background-color', 'red');
	}
});


Element.implement({
	inlineEdit: function(options) {
		return new inlineEdit(this, options);
	},
	inlineIsEmpty: function() {
		return this.innerHTML.indexOf('<span class="xEmpty">') == 0;	
	}
});

inlineEdit.implement(new Events);
inlineEdit.implement(new Options);