
/**
 * Singleton
 *
 * @version		1.0
 *
 * @license		MIT License
 *
 * @author		http://www.nwhite.net/2008/10/10/mootools-singleton-class-mutator/
 * @copyright	Authors
 */
Class.Mutators.Singleton = function(self,flag){
	if(!flag) return;
	self.constructor.__instance = undefined;
	if($defined(self.initialize) && $type(self.initialize) == 'function') var init = self.initialize;
	self.initialize = function(){
		if(!$defined(this.constructor.__instance)){
			if($defined(init) && $type(init) == 'function') init.apply(this,arguments);
			this.constructor.__instance = this;
		}
		return this.constructor.__instance;
	}
}





/**
 * UnlinearProcessHandler
 *
 * @version		1.0
 *
 * @license		MIT License
 *
 * @author		Ernests Karlsons <ernests [at] hungrylab [dot] lv>
 * @copyright	Authors
 */
var UnlinearProcessHandler = new Class({
	
	Implements: Options,
	Singleton: true,
	
	_processes: null,
	_observables: null,
	
	options: {
		debug: false
	},
	
	initialize: function(options) {
		this._processes = new Hash();
		this._observables = new Array();
	},
	
	addObservable: function(object) {
		if(object.hasUnlinearProcessDispatcher) {
			object.addEvent('onUnlinearProcessStart', this._onStart.bind(this));
			object.addEvent('onUnlinearProcessStop', this._onEnd.bind(this));
			this._observables.push(object);
			return true;
		}
		
		return false;
	},
	
	removeObservable: function(object) {
		var index = this._observables.indexOf(object);
		if(index >= 0) {
			this._observables.erase(object);
			return true;
		}
		
		return false;
	},
	
	getRunningTitles: function() {
		var retArray = new Array();
		this._processes.each(function(item, key) {
			retArray.push(item.title ? item.title : key);
		})
		return retArray;
	},
	
	hasRunning: function(initiator) {
		if(initiator) {
			return this._processes.some(function(item) {
				return item.initiator == initiator
			});
		} else {
			return this._processes.getLength() > 0;
		}
	},
	
	
	isIdleOrWarnIfBusy: function(initiator) {
		if(this.hasRunning(initiator)) {
			var titles = this.getRunningTitles();
			alert("This can't be done! Berta is too busy now with:\n\n" + titles.join("\n") + "\n\nPlease wait a couple of moments and try again!");
			return false;
		}
		
		return true;
	},




	_onStart: function(processInitiator, processId, processTitle) {
		if(this.options.debug) console.log('*** process "' + processId + '" started, initiator: ', processInitiator);
		this._processes.set(processId, { initiator: processInitiator, title: processTitle, started: (new Date()).getTime() });
	},

	_onEnd: function(processInitiator, processId, processTitle) {
		if(this.options.debug) console.log('*** process "' + processId + '" finito, initiator: ', processInitiator);
		if(this._processes.has(processId)) {
			this._processes.erase(processId);
		}
	}

});






/**
 * UnlinearProcessDispatcher
 *
 * @version		1.0
 *
 * @license		MIT License
 *
 * @author		Ernests Karlsons <ernests [at] hungrylab [dot] lv>
 * @copyright	Authors
 */
var UnlinearProcessDispatcher = new Class({
	
	Implements: Events,
	hasUnlinearProcessDispatcher: true,
	
	/*initialize: function(options) {
		//this._hash = new Hash();
	},*/
	
	unlinearProcess_getId: function(prefix) {
		return (prefix ? (prefix + '-') : '') + (new Date()).getTime();
	},
	
	unlinearProcess_start: function(processId, processTitle) {
		this.fireEvent("onUnlinearProcessStart", [this, processId, processTitle], 10);
	},
	
	unlinearProcess_stop: function(processId) {
		this.fireEvent("onUnlinearProcessStop", [this, processId], 10);
	}

});











/**
 * FancyUpload - Flash meets Ajax for simply working uploads
 *
 * @version		1.0
 *
 * @license		MIT License
 *
 * @author		Harald Kirschner <mail [at] digitarald [dot] de>
 * @copyright	Authors
 */
Fx.ProgressBar = new Class({

	Extends: Fx,

	options: {
		text: null,
		transition: Fx.Transitions.Circ.easeOut,
		link: 'cancel'
	},

	initialize: function(element, options) {
		this.element = $(element);
		this.parent(options);
		this.text = $(this.options.text);
		this.set(0);
	},

	start: function(to, total) {
		return this.parent(this.now, (arguments.length == 1) ? to.limit(0, 100) : to / total * 100);
	},

	set: function(to) {
		this.now = to;
		this.element.setStyle('backgroundPosition', (100 - to) + '% 0px');
		if (this.text) this.text.set('text', Math.round(to) + '%');
		return this;
	}

});

