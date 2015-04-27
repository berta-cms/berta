var WhiteTemplate = new Class({

    isResponsive: false,
    breakPointWidth: 767,

	sideColumnBottom: null,
	sideColumn: null,
	mainColumn: null,
	allContainer: null,
	contentContainer: null,
	isCenteredLayout: false,

	initialize: function() {
		window.addEvent('domready', this.onDOMReady.bind(this));
	},

	onDOMReady: function() {
        this.isResponsive = $$('.xResponsive').length;

		this.sideColumnBottom = $('sideColumnBottom');
		this.sideColumn = $('sideColumn');
		this.mainColumn = $('mainColumn');
		this.allContainer = $('allContainer');
		this.contentContainer = $('contentContainer');

		this.isCenteredLayout = this.sideColumn.hasClass('xCentered');

		if (this.isCenteredLayout) {
			this.sidebarPositionFix();
		}

        if (this.isResponsive) {
            if (bertaGlobalOptions.environment == 'site'){
                this.iframeResponsiveFix($$('iframe'));
            }
            this.mainColumnPaddingFix();
            this.sideColumnBottomSwitching();
        }
    },

    iframeResponsiveFix: function(el) {
        el.each(function(item) {
            var source = item.get('src');

            berta.options.iframeWrapperWhiteList.each(function(whiteList){
                if (source.indexOf(whiteList) > -1) {
                    var width = item.get('width');
                    var height = item.get('height');
                    var wrapper = new Element('div', {'class': 'iframeWrapper'});

                    if (width && height){
                        wrapper.setStyle('padding-bottom', height*100/width + '%');
                    }

                    if ( !item.getParent().hasClass('iframeWrapper') ) { //if no iframeWrapper already exists
                        wrapper.wraps(item);
                    }
                }
            });
        });
    },

    sidebarPositionFix: function(){
		var allContainerWidth = parseInt(this.allContainer.getStyle('max-width'));

		window.addEvent('resize', function() {
			if( window.getSize().x < allContainerWidth ) {
				this.allContainer.addClass('xNarrow');
			}else{
				this.allContainer.removeClass('xNarrow');
			}
		}).fireEvent('resize');
    },

    mainColumnPaddingFix: function(){
		var breakPointWidth = this.breakPointWidth;
		var mainColumnPaddingTop = this.mainColumn.get('data-paddingtop');

        window.addEvent('resize', function(){
        	var sideColumnHeight = this.sideColumn.getSize().y;

            if (breakPointWidth < this.getSize().x){
            	this.mainColumn.setStyle('padding-top', mainColumnPaddingTop);
            // small tablet
            }else{
            	this.mainColumn.setStyle('padding-top', sideColumnHeight + 'px');
            }
        });

        var headerImage = this.sideColumn.getElement('img');

        if (headerImage) {
            Asset.image(headerImage.get('src'), {
                onLoad: function(){
                    window.fireEvent('resize');
                }
            });
        }

        setTimeout(
        	function(){
        		window.fireEvent('resize');
        	},
        	100
        );
    },

	sideColumnBottomSwitching: function(){
		var breakPointWidth = this.breakPointWidth;

        window.addEvent('resize', function(){
            if (breakPointWidth < this.getSize().x){
                this.sideColumnBottom.inject(this.sideColumn);
            // small tablet
            }else{
                this.sideColumnBottom.inject(this.allContainer).setStyle('position', 'static');
            }
        }).fireEvent('resize');
	}
});

var whiteTemplate = new WhiteTemplate();