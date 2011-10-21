
var BertaEditor_ChangePassword = new Class({
	
	Extends: BertaEditorBase,
	Implements: [ Options, UnlinearProcessDispatcher ],
	
	options: {
		paths: null,
	},
	
	processHandler: null, 			// an instance of UnlinearProcessHandler
	
	
	initialize: function(options) {
		this.setOptions(options);
		this.initConsoleReplacement();	
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
		this.changePasswordInit();		
	},
		
	changePasswordInit: function() {
		$('password_form').addEvent('submit', this.changePassword.bindWithEvent(this));
	},	
			
	changePassword: function() {
	
        var xSectionsEditor=$('xSectionsEditor');
		var password_form=$('password_form');
		var old_password=$('old_password').value;
		var new_password=$('new_password').value;		
		var retype_password=$('retype_password').value;				

		new Request.JSON({
			url: this.options.updateUrl,
			data: "json=" + JSON.encode({
				action: 'CHANGE_PASSWORD',
				old_password: old_password, 
				new_password: new_password, 
				retype_password: retype_password,
				property: '', value: ''				
			}),
			onComplete: function(resp) { 
				if(!resp) {
                    password_form.reset();
					alert('Berta says:\n\nServer produced an error while changing password! Something went sooooo wrong...');
				} else if(resp && !resp.error_message) {
				    var p = new Element('p');
				    p.set('text', 'You have successfully changed your password!');
                    p.inject(xSectionsEditor, 'top');
                    password_form.dispose();
				} else {
                    password_form.reset();
					alert(resp.error_message);
				}
			}.bind(this)
		}).post();

		return false
	}

});

var editor = new BertaEditor_ChangePassword(window.bertaGlobalOptions);