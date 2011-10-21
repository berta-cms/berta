Milkbox.implement({

	options:{
		htmlBoxWidth :'750px',
		htmlBoxHeight :'400px'
	},
    showHTML: function(data){

		var mWidth = this.options.htmlBoxWidth;
		var mHeight= this.options.htmlBoxHeight;

		this.closed = false;
		if(this.formtags && this.formtags.length != 0){ this.formtags.setStyle('display','none') };
		this.overlay.setStyles({ 'top': -$(window).getScroll().y,'height':$(window).getScrollSize().y+$(window).getScroll().y });
		this.center.setStyle('top',/*$(window).getScroll().y+*/this.options.topPosition);

		//this.currentGallery = gallery;
		//this.currentIndex = index;
		this.overlay.tween('opacity',this.options.overlayOpacity);//onComplete: center.tween opacity
		
		//load html data...
		//this.canvas.grab('http://www.delfi.lv/');
		this.canvas.tween('opacity',1);
		this.center.removeClass('mbLoading');
		this.canvas.setStyles({'width':mWidth, 'height':mHeight,'visibility':'visible','font-size':'12px','overflow':'auto'});
		//this.canvas.setStyles({'width':fileSize.width, 'height':fileSize.height});
		
		this.canvas.grab(new Element('div',{html:data,style:'background: #fff; color: #000'}));
		this.center.setStyles({'width':mWidth, 'height':mHeight, 'margin-left':'-'+(parseInt(mWidth)/2).round()+'px'});
		
		var fz = new Hash();
		fz = fz.extend({'width':parseInt(mWidth),'height':parseInt(mHeight)});
		var bfz = this.computeSize(fz);
		this.center.setStyles({'height':bfz.height+'px'});
		this.canvas.setStyles({'height':bfz.height+'px'});
 		
    },

	loadUrl:function(url) {
		var req = new Request({
		  method: 'get',
		  url: url,
			evalScripts : true,
		  onComplete: function(response) {milkbox.showHTML(response); }
		}).send();
	}
});