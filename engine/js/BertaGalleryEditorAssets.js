
var BertaGalleryUploader = new Class({

	Implements: Options,
	Extends: Swiff.Uploader,

	options: {
		queued: 1,
		// compat
		limitSize: 0,
		limitFiles: 0,
		validateFile: $lambda(true)
	},

	initialize: function(list, processHub, options) {
		this.processHandler = new UnlinearProcessHandler(); // singleton process handler
		this.processHub = processHub;	// the current parent for the processed that might interfere with this instance
		this.list = $(list);

		// compat
		options.fileClass = options.fileClass || Swiff.Uploader.File;
		options.fileSizeMax = options.limitSize || options.fileSizeMax;
		options.fileListMax = options.limitFiles || options.fileListMax;

		this.addEvents({
			'load': this.onLoad,
			'fail': this.onFail,
			'selectSuccess': this.onSelectSuccess,
			'selectFail': this.onSelectFail,
			'fileOpen': this.onFileOpen,
			'fileProgress': this.onFileProgress,
			'fileRemove': this.onFileRemove
		});

		//console.debug(options);
		this.parent(options);
		
	},
	
	detatch: function() {
		this.removeEvents();
		if(this.box) this.box.destroy();
		$clear(this.fallbackTimeout);
	},
	
	// graceful degradation, onLoad is only called if all went well with Flash
	onLoad: function() {
		//console.debug('load');
		
		if(this.options.fallback)
			this.options.fallback.setStyle('display', 'none'); // ... and hide the plain form

		// We relay the interactions with the overlayed flash to the link
		this.target
		    .removeClass('xHidden')
			.addEvents({
				click: function() { return false; },
				mouseenter: function() { this.addClass('hover'); },
				mouseleave: function() { this.removeClass('hover'); this.blur(); },
				mousedown: function() { /*this.focus();*/ }
		});
	},

	onFail: function(error) {
		//console.debug('fail');
		this.fallbackInit();
		this.target.addClass('xHidden');
		
		switch (error) {
			case 'hidden': // works after enabling the movie and clicking refresh
				alert('To enable the embedded uploader, unblock it in your browser and refresh (see Adblock).');
				break;
			case 'blocked': // This no *full* fail, it works after the user clicks the button
				alert('To enable the embedded uploader, enable the blocked Flash movie (see Flashblock).');
				break;
			
			// commenting out  because error received a lot in inapropriate places...
			/*case 'empty': // Oh oh, wrong path
				alert('A required file was not found, please be patient and we fix this.');
				break;*/
				
			case 'flash': // no flash 9+ :(
				alert('To enable the embedded uploader, install the latest Adobe Flash plugin.')
		}
	},
	
	
	onSelectSuccess: function(files) {
		//console.debug('onSelectSuccess: ', files);
	},
	onSelectFail: function(files) {
		//console.debug('onSelectFail: ', files);
		/*files.each(function(file) {
			new Element('li', {
				'class': 'validation-error',
				html: file.validationErrorMessage || file.validationError,
				title: MooTools.lang.get('FancyUpload', 'removeTitle'),
				events: {
					click: function() {
						this.destroy();
					}
				}
			}).inject(this.list, 'top');
		}, this);*/
	},
	
	
	onFileOpen: function(file) {
		
		if(file.element) {
			file.element.store('FXProgressBar', new Fx.ProgressBar(file.element));
			file.element.retrieve('FXProgressBar').cancel().set(0);
		}
	},
	onFileProgress: function(file/*, current, overall*/) {
		// update the progress bar for the file
		if(file.element) {
			file.element.retrieve('FXProgressBar').start(file.progress.bytesLoaded, file.size);
		}
	},
	
	onFileRemove: function(file) {
		if(file.element) {
			file.element.getElements('a').setStyle('visibility', 'hidden');
			file.element.fade('out').retrieve('tween').chain(file.element.destroy.bind(file.element));
		}
	},
	
	
	// fallback functions
	fallbackTimeout: null,
	gallbackContainer: null,
	fileInputElement: null,
	
	fallbackInit: function() {
		if(this.options.fallback) {
			this.fallbackContainer = this.options.fallback;
			this.fallbackContainer.getElement('form').addEvent('submit', this.onFallbackSubmit.bindWithEvent(this));
			
			this.fileInputElement = new Element('input', {
				'type': 'file',
				'name': 'Filedata',
				'class': 'xUploadFile'
			}).inject(this.fallbackContainer.getElement('input[type="submit"]'), 'before');
			
			this.fallbackIFrame = new IFrame(this.fallbackContainer.getElement('iframe'), {
				events: {
					load: this.onFallbackIframeLoad.bindWithEvent(this)
				}
			})
		}
	},
	onFallbackSubmit: function(event) {
		if(this.processHandler.isIdleOrWarnIfBusy(this.processHub) && this.fileInputElement.get('value') != '') {
			this.fallbackKey = Math.random();
			this.fallbackContainer.getElement('input[name="upload_key"]').set('value', this.fallbackKey);
			this.fallbackContainer.getElements('input[type="submit"]').set('disabled', true);
			this.fallbackContainer.addClass('xSaving');
			this.fireEvent('selectSuccess', [ [this.fileInputElement.get('value')] ]);
			this.fireEvent('start');
		} else {
			event.stop();
		}
	},
	onFallbackIframeLoad: function(event) {
		var body = $(this.fallbackIFrame.contentDocument.body);
		if(body) {
			var responseText = body.get('html')
			if(responseText) {
				this.fileInputElement.destroy();
				this.fileInputElement = new Element('input', {
					'type': 'file',
					'name': 'Filedata',
					'class': 'xUploadFile'
				}).inject(this.fallbackContainer.getElement('input[type="submit"]'), 'before');
				
				this.fallbackContainer.getElements('input').set('disabled', '');
				this.fallbackContainer.removeClass('xSaving');
				
				this.fireEvent('fallbackFileComplete', [responseText]);
				this.fireEvent('complete');
			}
		}
	}
	
	
	

});


BertaGalleryUploader.File = new Class({

	Extends: Swiff.Uploader.File,

	render: function() {
		if (this.invalid) {
			if (this.validationError) {
				var msg = MooTools.lang.get('FancyUpload', 'validationErrors')[this.validationError] || this.validationError;
				this.validationErrorMessage = msg.substitute({
					name: this.name,
					size: Swiff.Uploader.formatUnit(this.size, 'b'),
					fileSizeMin: Swiff.Uploader.formatUnit(this.base.options.fileSizeMin || 0, 'b'),
					fileSizeMax: Swiff.Uploader.formatUnit(this.base.options.fileSizeMax || 0, 'b'),
					fileListMax: this.base.options.fileListMax || 0,
					fileListSizeMax: Swiff.Uploader.formatUnit(this.base.options.fileListSizeMax || 0, 'b')
				});
			}
			this.remove();
			return;
		}
	
		/*this.addEvents({
			'start': this.onStart,
			'progress': this.onProgress,
			'complete': this.onComplete,
			'error': this.onError,
			'remove': this.onRemove
		});*/
	
	
		this.info = new Element('span', {'class': 'file-info'});
		this.element = new Element('li', {'class': 'file'}).adopt(
			new Element('a', {
				'class': 'file-remove',
				'href': '#',
				'events': {
					'click': function(event) {
						new Event(event).preventDefault().stop();
						this.remove(file);
						return false;
					}.bind(this)
				}, 
				html: MooTools.lang.get('FancyUpload', 'remove'),
				title: MooTools.lang.get('FancyUpload', 'removeTitle'),
			}),
			//new Element('span', {'class': 'file-size', 'html': this.sizeToKB(file.size)}),
			new Element('span', {'class': 'file-name', 'html': this.name}),
			this.info
		).inject(this.base.list);
	},

	validate: function() {
		return (this.parent() && this.base.options.validateFile(this));
	},

	/*onStart: function() {
		this.element.addClass('file-uploading');
		this.base.currentProgress.cancel().set(0);
		this.base.currentTitle.set('html', MooTools.lang.get('FancyUpload', 'currentFile').substitute(this));
	},

	onProgress: function() {
		this.base.overallProgress.start(this.base.percentLoaded);
		this.base.currentText.set('html', MooTools.lang.get('FancyUpload', 'currentProgress').substitute({
			rate: (this.progress.rate) ? Swiff.Uploader.formatUnit(this.progress.rate, 'bps') : '- B',
			bytesLoaded: Swiff.Uploader.formatUnit(this.progress.bytesLoaded, 'b'),
			timeRemaining: (this.progress.timeRemaining) ? Swiff.Uploader.formatUnit(this.progress.timeRemaining, 's') : '-'
		}));
		this.base.currentProgress.start(this.progress.percentLoaded);
	},

	onComplete: function() {
		this.element.removeClass('file-uploading');
	
		this.base.currentText.set('html', 'Upload completed');
		this.base.currentProgress.start(100);
	
		if (this.response.error) {
			var msg = MooTools.lang.get('FancyUpload', 'errors')[this.response.error] || '{error} #{code}';
			this.errorMessage = msg.substitute($extend({
				name: this.name,
				size: Swiff.Uploader.formatUnit(this.size, 'b')
			}, this.response));
			var args = [this, this.errorMessage, this.response];
		
			this.fireEvent('error', args).base.fireEvent('fileError', args);
		} else {
			this.base.fireEvent('fileSuccess', [this, this.response.text || '']);
		}
	},

	onError: function() {
		this.element.addClass('file-failed');
		var error = MooTools.lang.get('FancyUpload', 'fileError').substitute(this);
		this.info.set('html', '<strong>' + error + ':</strong> ' + this.errorMessage);
	},*/

});