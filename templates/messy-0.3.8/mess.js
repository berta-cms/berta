

var MessyMess = new Class({
	
	shoppingCart: null,
	reservation: null,
	pageScroller: null,
	
	initialize: function() {
		window.addEvent('domready', this.onDOMReady.bind(this));
		
		BertaGallery.implement({
			layout_update: function() {
				if(this.type == 'row') {
					var margin = 0;
					var totalHeight = 0, totalWidth = 0;
					if(!this.layout_rowOnHoverBinded) this.layout_rowOnHoverBinded = this.layout_rowOnHover.bindWithEvent(this);
					this.imageContainer.getChildren('.xGalleryItem').each(function(el) {
						totalHeight = Math.max(totalHeight, margin + parseInt(el.getStyle('height')));
						totalWidth = Math.max(totalWidth, margin + parseInt(el.getStyle('width')));
						el.setStyles({
							'left': margin + 'px',
							'top': margin + 'px'
						});
						el.addEvent('mouseover', this.layout_rowOnHoverBinded);
						
						margin += 30;
					}, this);
					
					this.imageContainer.setStyle('height', totalHeight + 'px');
					this.imageContainer.setStyle('width', totalWidth + 'px');
					this.layout_rowTotalHeight = totalHeight;
					this.layout_rowTotalWidth = totalWidth;
				}
			}, 
			
			layout_rowOnHover: bertaGlobalOptions.environment == 'site' ? function(event) {
				event.stop();
				var target = $(event.target);
				if(!target.hasClass('xGalleryItem')) target = target.getParent('.xGalleryItem');
				if(target) {
					var imElements = this.imageContainer.getChildren('.xGalleryItem');
					var z = 1000, zPlus = 200, numElements = imElements.length;
					this.imageContainer.getChildren('.xGalleryItem').each(function(el, idx) {
						
						// set correct z-index
						zSignChange = false;
						el.setStyle('z-index', z);
						if(el == target) { zPlus = -199; zSignChange = true; }
						z += zPlus;
						
						// move either to left-top or bottom-right corner
						/*var margin;
						if(zPlus > 0 || zSignChange) margin = idx * 30;
						else margin = -(numElements - 1 - idx) * 30;
						console.debug(
							margin
						);
						el.setStyles({
							left: (zPlus > 0 ? margin : this.layout_rowTotalWidth - parseInt(el.getStyle('width')) - margin) + 'px',
							top: (zPlus > 0 ? margin : this.layout_rowTotalHeight - parseInt(el.getStyle('height')) - margin) + 'px'
						});*/
						
					}, this);
					
				}
			} : $empty
		});
	},
	
	onDOMReady: function() {

		//scroll fix (iphone viewport workaround)
		window.addEvent('resize',this.stickToBottom.bindWithEvent(this));
		window.addEvent('scroll',this.stickToBottom.bindWithEvent(this));

		var messyItems = $$('.mess');
		
		if(bertaGlobalOptions.environment == 'engine') {
			messyItems.each(function(el) {
				if(!el.hasClass('xEntry')) el.adopt(new Element('div', { 'class': 'xHandle' }));
			});
			$$('.xEntryMove').addClass('xHandle');
			$$('.xEntryToBack').addEvent('click', this.editor_saveOrder.bindWithEvent(this));

			$$('.xEditableDragXY').addEvents({
				mouseenter: function(){
					$$('.xCreateNewEntry').hide();
				},
				mouseleave: function(){
					$$('.xCreateNewEntry').show();
					$$('.xEntry .xCreateNewEntry').hide();
				}
			});
		}
	},
	
	stickToBottom: function(){
		$('bottom').setStyles({
			'position': 'absolute',
			'top': (window.pageYOffset + window.innerHeight - 45) + 'px'
		});		
	},

	editor_saveOrder: function(event) {
		event.stop();
		
		
		
		var target = $(event.target);
		target = target.getParent('.xEntry');
		var entriesList = target.getParent('.xEntriesList');
		var nextEntry = entriesList.getFirst('.xEntry');
		target.inject(entriesList, 'top');
		
		/*var newOrder = new Array();
		entriesList.getElements('.xEntry').each(function(el) {
			newOrder.push(el.getClassStoredValue('xEntryId'));
		});*/
		
		new Request.JSON({
			url: bertaEditor.options.updateUrl,
			data: "json=" + JSON.encode({
				section: bertaEditor.currentSection, entry: target.getClassStoredValue('xEntryId'), entryNum: null, 
				action: 'PUT_BEFORE', property: '', value: nextEntry.getClassStoredValue('xEntryId')
			}),
			onComplete: function(resp) { 

			}.bind(this)
		}).post();
	},
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	firstPageInit:function() {
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


var messyMess = new MessyMess();