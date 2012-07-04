

var SuperWhite = new Class({
	
	shoppingCart: null,
	reservation: null,
	pageScroller: null,

	initialize: function() {
		window.addEvent('domready', this.onDOMReady.bind(this));
	},
	
	onDOMReady: function() {
		this.entriesContainer = $('firstPageMarkedEntries');
		if(this.entriesContainer && bertaGlobalOptions.environment == 'site') {
			this.entriesContainer.getElements('.firstPagePic').each(function(el) {
				el.addEvent('mouseenter', this.onFirstPagePicMouseEnter.bindWithEvent(this));
				el.addEvent('mouseleave', this.onFirstPagePicMouseLeave.bindWithEvent(this));
				el.addEvent('mousemove', this.onFirstPagePicMouseMove.bindWithEvent(this));
				el.store('prevMouseX', 0);
				el.store('prevMouseY', 0);
				el.store('mouseMoveOn', false);
			}.bind(this));
		}
		
		$$("#sideColumnTop ul select").addEvent('change', function(event) {
			var loc = $(event.target).get('value');
			if(loc) window.location = loc;
		});
		

		// Centering
		var sideCol = $('sideColumn');
		var centeredLayout = sideCol.hasClass('xCentered') ? true : false;

		if(centeredLayout) {
			var container = $('contentContainer');
			var sideColInitStyles = sideCol.getStyles('left', 'margin-left');

			if( window.getSize().x < container.getSize().x ) {
				sideCol.setStyles( { 'left': 0, 'margin-left': 0 } );
			}

			window.addEvent('resize', function() {
				if( window.getSize().x < container.getSize().x ) {
					sideCol.setStyles( { 'left': 0, 'margin-left': 0 } );
				} else {
					sideCol.setStyles( {'left': sideColInitStyles['left'], 'margin-left': sideColInitStyles['margin-left']} );
				}
			});
		}
		
	},
	
	onFirstPagePicMouseEnter: function(event) {
		var target = $(event.target);
		if(!target.hasClass('firstPagePic')) {
			target = target.getParent('.firstPagePic');
		}
		
		target.store('mouseMoveOn', true);
		
		target.store('prevMouseX', event.page.x);
		target.store('prevMouseY', event.page.y);
		target.store('initPosX', target.getStyle('left'));
		target.store('initPosY', target.getStyle('top'));
		
	},
	
	onFirstPagePicMouseLeave: function(event) {
		var target = $(event.target);
		if(!target.hasClass('firstPagePic')) {
			target = target.getParent('.firstPagePic');
		}
		
		target.setStyle('left', target.retrieve('initPosX'));
		target.setStyle('top', target.retrieve('initPosY'));
	},
	
	onFirstPagePicMouseMove: function(event) {
		var target = $(event.target);
		if(!target.hasClass('firstPagePic')) {
			target = target.getParent('.firstPagePic');
		}
		
		if(target.retrieve('mouseMoveOn')) {
			
			//console.debug(event.page.x, target.retrieve('prevMouseX'), event.page.y, target.retrieve('prevMouseY'));
			
			var xDiff = event.page.x > target.retrieve('prevMouseX') ? 1 : (event.page.x == target.retrieve('prevMouseX') ? 0 : -1);
			var yDiff = event.page.y > target.retrieve('prevMouseY') ? 1 : (event.page.y == target.retrieve('prevMouseY') ? 0 : -1);
		
			target.store('prevMouseX', event.page.x);
			target.store('prevMouseY', event.page.y);
			target.store('mouseMoveOn', !xDiff && !yDiff);
			
			if(target.hasClass('firstPageWiggle')) {
				target.setStyle('left', parseInt(target.getStyle('left')) + xDiff * 5);
				target.setStyle('top', parseInt(target.getStyle('top')) + yDiff * 5);
			}
		}
	}
	

	
	
});


var superWhite = new SuperWhite();