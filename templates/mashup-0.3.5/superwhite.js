

var SuperWhite = new Class({
	
	shoppingCart: null,
	reservation: null,
	pageScroller: null,
	
	initialize: function() {
		window.addEvent('domready', this.onDOMReady.bind(this));
		
		/* Backup for versions pre 0.8.2, if not updated */
		if(parseInt(bertaGlobalOptions['lastUpdVer']) < 1082) {
			BertaGallery.implement({
				layout_update: function() {
					if(this.type == 'pile') {
						var margin = 0;
						var totalHeight = 0, totalWidth = 0;
						if(!this.layout_pileOnHoverBinded) this.layout_pileOnHoverBinded = this.layout_pileOnHover.bindWithEvent(this);
						this.imageContainer.getChildren('.xGalleryItem').each(function(el) {
							totalHeight = Math.max(totalHeight, margin + parseInt(el.getStyle('height')));
							totalWidth = Math.max(totalWidth, margin + parseInt(el.getStyle('width')));
							el.setStyles({
								'left': margin + 'px',
								'top': margin + 'px'
							});
							el.addEvent('mouseover', this.layout_pileOnHoverBinded);
							
							margin += 30;
						}, this);
						
						this.imageContainer.setStyle('height', totalHeight + 'px');
						this.imageContainer.setStyle('width', totalWidth + 'px');
						this.layout_rowTotalHeight = totalHeight;
						this.layout_rowTotalWidth = totalWidth;
					} else if(this.type == 'column' || this.type == 'row') {
			            var totalHeight = 0, maxWidth = 0, itmSize;
			            this.imageContainer.getChildren('.xGalleryItem').each(function(item) {
			                itmSize = item.getSize();
			                totalHeight += itmSize.y;
			                if(itmSize.x > maxWidth) maxWidth = itmSize.x;
			            });
			            this.imageContainer.setStyle('height', totalHeight + 'px');
			            this.imageContainer.setStyle('width', maxWidth + 'px');
			            this.imageContainer.getElements('.xGalleryItem').setStyles({'padding-bottom': '1em', 'padding-right': '0', 'float': 'none'});
			        }
				}
			});
		}
		
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