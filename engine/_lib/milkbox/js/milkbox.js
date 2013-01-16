/*
	Milkbox v2.3.2 - required: mootools.js v1.2.3 core + more 1.2.3.1: Assets

	by Luca Reghellin (http://www.reghellin.com) August 2009, MIT-style license.
	Inspiration Lokesh Dhakar (http://www.lokeshdhakar.com/projects/lightbox2/)
	AND OF COURSE, SPECIAL THANKS TO THE MOOTOOLS DEVELOPERS
*/

var Milkbox = new Class({

	Implements:[Options,Events],

	options:{//set all the options here
		overlayOpacity:0.85,
		topPosition:50,
		initialWidth:250,
		initialHeight:250,
		canvasBorderWidth:'0px',
		canvasBorderColor:'#000000',
		canvasPadding:'0px',
		resizeDuration:500,
		resizeTransition:'sine:in:out',/*function (ex. Transitions.Sine.easeIn) or string (ex. 'bounce:out')*/
		autoPlay:false,
		autoPlayDelay:7,
		removeTitle:false,
		autoSize:true,
		maxHeight:0,//only if autoSize==true
		imageOfText:'/',
		onXmlGalleries:$empty,
		onClosed:$empty,
		onFileReady:$empty
	},

	initialize: function(options){

		this.setOptions(options);
		this.autoPlayBkup = { autoPlayDelay:this.options.autoPlayDelay, autoPlay:this.options.autoPlay };
		this.fullOptionsBkup = {};
		this.galleries = [];
		this.families = [];
		this.xmlFiles = [];
		this.loadedImages = [];//to check the preloaded images
		this.currentFile = null;
		this.currentIndex = null;
		this.currentGallery = null;
		this.currentRequest = null;
		this.currentResponse = null;

		this.mode = null;//'singleFile','fileGallery'
		this.closed = true;
		this.busy = true;//to control keyboard and autoplay events
		this.paused = true;
		this.fileReady = false;//to prevent overlapping loadFile calls via next_prev_aux()
		this.eventsok = false;
		this.first = true;//true if it's the first file since it opened
		this.activated = false;//true after initMilkbox

		this.intObj = null;

		this.formtags = null;
		this.prepareGalleries();

		if(this.options.overlayOpacity == 0 || bertaGlobalOptions.galleryFullScreenBackground=='none'){ this.options.overlayOpacity = 0.0001 }
		this.saveOptions();//then use restoreOptions()

		//if no galleries, stop here and prevent extra memory usage.
		//so you can keep milkbox in every page of a site.
		if(this.galleries.length == 0){ return; };

		this.initMilkbox(true);
	},//end init

	initMilkbox:function(checkTags){

		if(checkTags){ this.formtags = $$('select','textarea'); }

		this.prepareHTML();
		this.prepareEffects();
		this.prepareEvents();

		this.activated = true;
	},

	/* ****** SHOW/HIDE ****** */

	//runs only 1 time per gallery
	openMilkbox:function(gallery,index){
		this.closed = false;
		if(this.formtags && this.formtags.length != 0){ this.formtags.setStyle('display','none') };
		this.overlay.setStyles({ 'top': -$(window).getScroll().y,'height':$(window).getScrollSize().y+$(window).getScroll().y });
		this.center.setStyles({'top': this.options.topPosition, 'visibility': 'visible'});

		this.currentGallery = gallery;
		this.currentIndex = index;
		this.overlay.tween('opacity',this.options.overlayOpacity);//onComplete: center.tween opacity

		if(gallery.length == 1){
			this.mode = 'singleFile';
			this.loadFile(gallery[index],index);
		} else {
			this.mode = 'fileGallery';
			var playpauseWidth = 0;
			//interface
			$$(this.close, this.prev, this.next).setStyle('display','inline');

			if (bertaGlobalOptions.galleryFullScreenImageNumbers=='yes') {
				$$(this.count).setStyle('display','inline');
			}

			if(this.options.autoPlay){
				this.playpause.setStyle('display','block');
				playpauseWidth = this.playpause.getSize().x;
			}
			var border = this.center.getStyle('border-right-width').toInt();//border-right is just ok for design purposes..
			//var navWidth = this.prev.getSize().x+this.next.getSize().x+this.close.getSize().x+playpauseWidth+border;
			//var navWidth = this.prev.getSize().x+this.next.getSize().x+playpauseWidth+border;
			//this.navigation.setStyle('width',navWidth);
			//this.description.setStyle('margin-right',navWidth);
			//files
			var next = (index != gallery.length-1) ? gallery[index+1] : gallery[0];
			var prev = (index != 0) ? gallery[index-1] : gallery[gallery.length-1];
			var preloads = (prev == next) ? [prev] : [prev,next]; //if gallery.length == 2, then prev == next

			this.loadFile(gallery[index],preloads);
		}//end else
	},

	loadFile:function(fileObj,preloads){
		this.fileReady = false;
		var swf = this.checkFileType(fileObj,'swf');
		if(!swf){
			if(!this.loadedImages.contains(fileObj.retrieve('href'))){ this.center.addClass('mbLoading'); }
			this.loadImage(fileObj.retrieve('href'));
		} else {
			this.loadSwf(fileObj);
		}

		if(preloads){ this.preloadFiles(preloads); }
	},

	preloadFiles:function(preloads){
		preloads.each(function(fileObj,index){
			var swf = this.checkFileType(fileObj.retrieve('href'),"swf");
			if(!swf){ this.preloadImage(fileObj.retrieve('href')); }
		},this);
	},

	loadImage:function(file){
		var imageAsset = new Asset.image(file, { onload:function(img){
			if(!this.loadedImages.contains(file)){ this.loadedImages.push(file); };//see next/prev events
			this.currentFile = img;
			this.loadAux(this.currentFile);
		}.bindWithEvent(this)});
	},

	preloadImage:function(file){
		if(!this.loadedImages.contains(file)){
			var imageAsset = new Asset.image(file, { onload:function(img){
					this.loadedImages.push(file);
			}.bindWithEvent(this)});
		}
	},


	loadSwf:function(swf){

		var swfObj = new Swiff(swf.retrieve('href'),{
			width:swf.retrieve('width').toInt(),
			height:swf.retrieve('height').toInt(),
			params:{ wMode:'opaque', swLiveConnect:'false' }
		});

		this.currentFile = swfObj;
		this.loadAux(swf);
	},

	loadAux:function(file){
		this.fileReady = true; //the file is loaded and ready to be showed (see next_prev_aux())
		this.fireEvent('fileReady');
		$$(this.description,this.navigation).setStyle('visibility','hidden');
		this.navigation.setStyle('height','');//reset the height setted in center.morph.onComplete
		//$$(this.next,this.prev).setStyle('backgroundPosition','0 0');
		this.showFile(file);
	},


	showFile:function(file){

 		if(this.closed){ return; };//if you close the Milkbox and an onload event is still running

 		var fileSize = new Hash();
 		var centerSize = new Hash();
 		var targetSize, canvasSize;
		var canvasAddSize, gap, b, p, d;
 		targetSize = canvasSize = {};
 		canvasAddSize = gap = b = p = d = 0;

 		if(this.options.canvasBorderWidth.toInt() != 0 && this.canvas.getStyle('borderWidth').toInt() == 0){
 			b = this.options.canvasBorderWidth + ' solid ' + this.options.canvasBorderColor;
 			this.canvas.setStyle('border',b);
 		}

 		if(this.options.canvasPadding.toInt() != 0 && this.canvas.getStyle('padding').toInt() == 0){
 			p = this.options.canvasPadding;
 			this.canvas.setStyle('padding',p);
 		}

 		canvasSize = this.canvas.getSize();
 		canvasAddSize = this.canvas.getStyle('borderWidth').toInt()*2 + this.canvas.getStyle('padding').toInt()*2;
 		this.canvas.setStyles({'opacity':0, 'width':'', 'height':''});

 		if(!file.retrieve('width')){//is an image file
 			fileSize = fileSize.extend(file.getProperties('width','height')).map(function(item){ return item.toInt(); });
 			if(this.options.autoSize){
 				fileSize = this.computeSize(fileSize);
 				file.setProperties({ 'width':fileSize.width, 'height':fileSize.height });
 			}

 			//add onclick event when image is clicked - shows next image
 			if (this.currentGallery.length>1){

 			    file.addEvent('click',this.next_prev_aux.bindWithEvent(this,'next'));

 			}else{
 			 	file.setStyle('cursor','default');
            }

 		} else {//is an swf file
 			fileSize.extend({ 'height':file.retrieve('height').toInt(), 'width':file.retrieve('width').toInt() });
 		}


 		centerSize = centerSize.extend(this.center.getStyles('width','height')).map(function(item){ return item.toInt(); });

 		if(fileSize.width != centerSize.width){
 			//also include padding
            var paddings = this.center.getStyles('padding-left','padding-right');
            paddings = parseInt(paddings['padding-left'])+parseInt(paddings['padding-right']);

 			targetSize.width = fileSize.width + canvasAddSize ;
 			targetSize.marginLeft = -((targetSize.width+paddings)/2).round();
 		}

 		gap = (canvasSize.y-canvasAddSize > 0) ? centerSize.height - canvasSize.y : 0;

		targetSize.height = fileSize.height + canvasAddSize + gap;

		//so nav doesn't move when you click next/prev
		this.canvas.setStyles({'width':fileSize.width, 'height':fileSize.height});

 		this.center.removeClass('mbLoading');

 		if(this.first){ d = 500; this.first = false; }
 		(function(){ this.center.morph(targetSize); }).delay(d,this)//onComplete: show all items
	},

	computeSize:function(oSize){

		var size = oSize;
		var wSize = window.getSize();
		var baseSize = { width:wSize.x-60, height:wSize.y-68-this.options.topPosition*2 };//cut out some pixels to make it better
		var ratio;
		var check;

		var max = Math.max( baseSize.height, baseSize.width );

		if(max == baseSize.width){
			ratio = max/size.width;
			check = 'height';
		} else {
			ratio = max/size.height;
			check = 'width';
		}

		ratio = (ratio <= 1) ? ratio : 1;
		size = size.map(function(item){ return Math.floor(item*ratio); });

		ratio = (baseSize[check]/size[check] <= 1) ? baseSize[check]/size[check] : 1;
		size = size.map(function(item){ return Math.floor(item*ratio); });

		if(this.options.maxHeight > 0){
			ratio = (this.options.maxHeight/size.height < 1) ? this.options.maxHeight/size.height : 1;
			size = size.map(function(item){ return Math.floor(item*ratio); });
		}

		return size;
	},

	//{ gallery:'gall1', index:2, autoplay:true, delay:7 }
	showGallery:function(opt){
		if(!opt || !opt.gallery){ return; }
		var fileIndex = ($chk(opt.index)) ? opt.index : 0;
		var g = this.getGallery(opt.gallery);
		var auto = false;
		var d;
		if(opt.autoplay || (g['options'] && g['options'].autoplay)){ auto = true; }
		if(g != -1 && !this.opened){
			if(auto){
				d = (opt && opt.delay) ? opt.delay : (g['options'] && g['options'].delay) ? g['options'].delay : this.autoPlayDelay;
				this.startAutoPlay({ gallery:g, index:fileIndex, delay:d });
			} else {
				this.openMilkbox(g,fileIndex);
			}
		}
	},

	/* ******* XML/AJAX ******* */

	addGalleries:function(xmlfile){

		this.currentRequest = new Request({
			method:'get',
			autoCancel:true,
			url:xmlfile,
			onRequest:function(){
				//placeholder
			}.bindWithEvent(this),
			onSuccess:function(text,xml){
				var t = text.replace(/(<a.+)\/>/gi,"$1></a>");
				this.setGalleries(new Element('div',{ html:t }),xmlfile);
			}.bindWithEvent(this),
			onFailure:function(transport){ alert('Milkbox :: addGalleries: XML file path error or local Ajax test: please test addGalleries() on-line'); }
		});

		this.currentRequest.send();
	},

	setGalleries:function(container,xmlfile){
		if(!this.xmlFiles.contains(xmlfile)){ this.xmlFiles.push(xmlfile); }
		var c = container;
		var galleries = c.getElements('.gallery');
		var links = [];
		var aplist = [];
		galleries.each(function(gallery,i){

			var obj = {
				gallery:gallery.getProperty('name'),
				autoplay:Boolean(gallery.getProperty('autoplay')),
				delay:Number(gallery.getProperty('delay'))
			}

			var l = gallery.getChildren('a');
			var lx = l.map(function(link){ return link.setProperty('rel','milkbox['+obj.gallery+']'); });
			links.push(lx);
			if(obj.autoplay){ aplist.push(obj); }
		});

		this.prepareGalleries(links.flatten());
		this.setAutoPlay(aplist);

		if(!this.activated){ this.initMilkbox(); }

		this.fireEvent('xmlGalleries');
	},



	/* ****** UTILS ****** */

	checkFileType:function(file,type){
		var href = null;
		if($type(file) != 'string'){ href = file.retrieve('href'); }
		else{ href = file; }
		var regexp = new RegExp("\.("+type+")$","i");
		return href.split('?')[0].test(regexp);
	},

	//retrieves galleries from strings like 'gall1' or 'milkbox[gall1]' or 'milkbox:gall1'
	getGallery:function(gallery){
		var f = null;
		if(gallery.test(/^milkbox/i)){
			f = this.families;
		} else {
			//create a temporary array with names without 'milkbox'
			f = this.families.map(function(item){
				var trimmed = item.trim();
				var name = trimmed.slice(0,trimmed.length).substr(8);
				var cleanName = name.replace(/(.+)]$/,"$1");
				return cleanName;
			});
		}
		var i = f.indexOf(gallery);
		var g = (i != -1) ? this.galleries[i] : i;
		return g;
	},

	setFileProps:function(fileObj,propString){
		var s = propString.split(',');
		s.each(function(p,i){
			var clean = p.trim().split(':');
			fileObj.store(clean[0].trim(),clean[1].trim())
		},this);
	},

	changeOptions:function(obj){
		if(!obj){ return; }
		this.setOptions(obj);
 		this.center.get('morph').setOptions({ transition:this.options.resizeTransition,  duration:this.options.resizeDuration });
	},

	saveOptions:function(obj){
		if($chk(obj)){
			this.fullOptionsBkup = obj;
		} else {
			this.fullOptionsBkup = this.options;
		}
	},

	restoreOptions:function(){
		this.setOptions(this.fullOptionsBkup);
 		var b = this.options.canvasBorderWidth + ' solid ' + this.options.canvasBorderColor;
 		this.canvas.setStyles({ 'border':b, 'padding':this.options.canvasPadding});
 		this.center.get('morph').setOptions({ transition:this.options.resizeTransition,  duration:this.options.resizeDuration });
	},

	reloadGalleries:function(){

		this.galleries = [];
		this.families = [];
		//re-check for tags
		this.formtags = $$('select','textarea');

		if(!this.activated){ this.initMilkbox(false); }

		//reload standard galleries
		this.prepareGalleries();
		this.removeGalleriesEvents();
		this.setGalleriesEvents();

		if(this.xmlFiles.length == 0){ return; }
		//reload xmlGalleries
		this.xmlFiles.each(function(xmlfile,index){
			this.addGalleries(xmlfile);
		}.bind(this));
	},

	/* ****** AUTOPLAY ****** */

	//list:Array of objects or an object > [ { gallery:'gall1', autoplay:true, delay:6 } ]
	//to permanently define autoplay options for any gallery
	setAutoPlay:function(list){
		var l = ($type(list) == 'object') ? [list] : list;
		l.each(function(item){
			var g = this.getGallery(item.gallery);
			if(g == -1){ return; }
			var a = (item.autoplay == true) ? item.autoplay : false;
			var d = ($chk(item.delay) && a) ? item.delay : this.options.autoPlayDelay;
			g['options'] = { autoplay:a, delay:d }
		},this);
	},

	startAutoPlay:function(opt){//opt: gallery, index, delay (in seconds)

		var g = -1;
		var i,d;
		if(opt && opt.gallery){
			if($type(opt.gallery) == 'array'){ g = opt.gallery }
			else if($type(opt.gallery) == 'string'){
				g = this.getGallery(opt.gallery);
			}
		}

		if(g == -1){ g = this.galleries[0]; }

		d = (opt && opt.delay && ($type(opt.delay) == 'number')) ? opt.delay*1000 : (g['options'] && g['options'].delay) ? g['options'].delay*1000 : this.options.autoPlayDelay*1000;
		i = (opt && opt.index && ($type(opt.index) == 'number')) ? opt.index : 0;
		if(d < this.options.resizeDuration*2){ d = this.options.resizeDuration*2 };
		this.options.autoPlayDelay = d/1000;//save autoPlayDelay because now it is customized

		if(!this.options.autoPlay){ this.setOptions({ autoPlay:true, autoPlayDelay:this.options.autoPlayDelay }); }

		if(this.closed){
			this.openMilkbox(g,i);
			if(this.mode != 'fileGallery'){ return; }
			this.addEvent('fileReady',function(){
				//wait until the first file is loaded
				this.intObj = this.next_prev_aux.periodical(d,this,[null,'next']);
				this.removeEvents('fileReady');
			}.bindWithEvent(this));
		} else {
			if(!this.closed){ this.next_prev_aux(null,'next'); }
			this.intObj = this.next_prev_aux.periodical(d,this,[null,'next']);
		}

		this.paused = false;
	},

	stopAutoPlay:function(){
		if(this.intObj){ $clear(this.intObj); this.intObj = null; }
		this.playpause.setStyle('backgroundPosition','0 -44px');
		this.paused = true;
	},


	/* ****** INIT/CLOSE ****** */

	removeGalleriesEvents:function(){
		this.galleries.each(function(gallery){
			$$(gallery).removeEvents('click');
		},this);
	},

	setGalleriesEvents:function(){
		this.galleries.each(function(gallery){

			$$(gallery).addEvent('click',function(e){
				var button=($(e.target).match('a')) ? $(e.target) : $(e.target).getParent('a');
				e.preventDefault();

				var g = this.getGallery(button.rel);
				if(g.options && g.options.autoplay){
					this.setOptions({ autoPlay:g.options.autoplay, autoPlayDelay:g.options.delay });
				}

				if(this.options.autoPlay){
					this.startAutoPlay({ gallery:gallery, index:gallery.indexOf(button) });
				} else {
					this.openMilkbox(gallery, gallery.indexOf(button));
				}

			}.bindWithEvent(this));
		},this);
	},

	//all the main events
	prepareEvents:function(xml){

		//galleries
		this.setGalleriesEvents();

		//next, prev, see next_prev_aux()
		this.next.addEvent('click',this.next_prev_aux.bindWithEvent(this,'next'));
		this.prev.addEvent('click',this.next_prev_aux.bindWithEvent(this,'prev'));


		//css hover doesn't work in ie6, so I must do it via js...
		$$(this.next,this.prev).addEvents({
			'mouseover':function(){ this.setStyle('backgroundPosition','0 -22px'); },
			'mouseout':function(){ this.setStyle('backgroundPosition','0 0'); }
		});

		//keyboard next/prev/close
		$(window.document).addEvent('keydown',function(e){
			if(this.mode != 'fileGallery' || this.busy == true){ return; }
			if(e.key == 'right' || e.key == 'space'){ this.next_prev_aux(e,'next'); }
			else if(e.key == 'left'){ this.next_prev_aux(e,'prev'); }
			else if(e.key == 'esc'){ this.closeMilkbox(); }
		}.bindWithEvent(this));

		//playpause for autoPlay
		this.playpause.addEvents({
				'mouseover':function(e){
					if(this.paused == false){ this.playpause.setStyle('backgroundPosition','0 -22px'); }
					else { this.playpause.setStyle('backgroundPosition','0 -66px'); }
				}.bindWithEvent(this),
				'mouseout':function(){
					if(this.paused == false){ this.playpause.setStyle('backgroundPosition','0 0'); }
					else { this.playpause.setStyle('backgroundPosition','0 -44px'); }
				}.bindWithEvent(this),
				'click':function(){
					if(this.paused == false){
						this.stopAutoPlay();
						this.paused = true;
						this.playpause.setStyle('backgroundPosition','0 -66px');
					} else {
						var d = (this.currentGallery.options && this.currentGallery.options.delay) ? this.currentGallery.options.delay : this.options.autoPlayDelay;
						this.startAutoPlay({gallery:this.currentGallery, index:this.currentIndex+1, delay:d });
						this.paused = false;
						this.playpause.setStyle('backgroundPosition','0 0');
					}
				}.bindWithEvent(this)
		});

		//overlay
		this.overlay.get('tween').addEvent('onComplete',function(){
			if(this.overlay.getStyle('opacity') == this.options.overlayOpacity){
				this.center.tween('opacity',1);
			} else if(this.overlay.getStyle('opacity') == 0) {
				this.overlay.setStyles({'height':0,'top':''});
			};
		}.bindWithEvent(this));

		//center
		this.center.get('morph').addEvent('onComplete',function(){

			 if($type(this.currentFile) == "element"){//is image file
				this.canvas.grab(this.currentFile);
			 } else {//object: is swf file
			 	(function(){ this.canvas.grab(this.currentFile); }).delay(500,this);
			 }

			 this.canvas.tween('opacity',1);

			 var d = (!(this.mode == 'showThisImage')) ? this.currentGallery[this.currentIndex].retrieve('title') : this.specialDescription;
			 if($chk(d)){ this.description.innerHTML = d; };

			 if(this.mode == 'fileGallery'){
			 	this.count.appendText((this.currentIndex+1)+''+this.options.imageOfText+''+this.currentGallery.length);
			 }

			 var currentCenterHeight = this.center.getStyle('height').toInt();

			 //this.navigation.setStyle('height',this.bottom.getStyle('height').toInt());//to have the right-border height == total bottom height
			 var bottomSize = this.bottom.getSize().y;

			 //after the 1st time, currentCenterHeight is always > this.canvas.getSize().y

			 var targetOffset = (currentCenterHeight > this.canvas.getSize().y) ? (this.bottom.getSize().y+this.canvas.getSize().y)-currentCenterHeight : bottomSize;

			 targetOffset = targetOffset + this.close.getSize().y;

			 this.bottom.setStyle('display','none');//to avoid rendering problems during setFinalHeight

			 this.center.retrieve('setFinalHeight').start(currentCenterHeight,currentCenterHeight+targetOffset);
		}.bindWithEvent(this));

		this.center.retrieve('setFinalHeight').addEvent('onComplete',function(){
			this.bottom.setStyles({'visibility':'visible','display':'block'});
			$$(this.description,this.navigation).setStyle('visibility','visible');
			//reset overlay height based on position and height
			var scrollSize = $(window).getScrollSize().y;
			var scrollTop = $(window).getScroll().y;

			this.overlay.setStyles({'height':scrollSize+scrollTop, 'top':-scrollTop });
			this.busy = false;
		}.bindWithEvent(this));

		//reset overlay height and position onResize
		window.addEvent('resize',function(){
			if(this.overlay.getStyle('opacity') == 0){ return; };//resize only if visible
			var scrollSize = $(window).getScrollSize().y;
			var scrollTop = $(window).getScroll().y;
			this.overlay.setStyles({ 'height':scrollSize+scrollTop,'top':-scrollTop });
		}.bindWithEvent(this));

		//close
		$$(this.overlay,this.close).addEvent('click',this.closeMilkbox.bindWithEvent(this));

		//check
		this.eventsok = true;
	},

	next_prev_aux:function(e,direction){

		if(e){
			e.preventDefault();
			this.stopAutoPlay();
		} else {
			//if there's no event obj, than this is called by autoPlay()
			if(this.busy || !this.fileReady){ return; }//stop autoplay()
		}

		this.busy = true; //for keyboard and autoplay

		var i, _i;

		if(direction == "next"){
			i= (this.currentIndex != this.currentGallery.length-1) ? this.currentIndex += 1 : this.currentIndex = 0;
			_i= (this.currentIndex != this.currentGallery.length-1) ? this.currentIndex + 1 : 0;
		} else {
			i= (this.currentIndex != 0) ? this.currentIndex -= 1 : this.currentIndex = this.currentGallery.length-1;
			_i= (this.currentIndex != 0) ? this.currentIndex - 1 : this.currentGallery.length-1;
		};

		this.canvas.empty();
		this.description.empty();
		this.count.empty();

		this.loadFile(this.currentGallery[i],[this.currentGallery[_i]]);
	},

	prepareEffects:function(){
		this.overlay.set('tween',{ duration:'short',link:'cancel' });
		this.center.set('tween',{ duration:'short',link:'chain' });
		this.center.set('morph',{ duration:this.options.resizeDuration,link:'chain',transition:this.options.resizeTransition });
		this.center.store('setFinalHeight',new Fx.Tween(this.center,{property:'height',duration:'short'}));
		this.canvas.set('tween',{ link:'chain' });
	},

	prepareGalleries:function(responseElements){
		var milkbox_a = [];
		var a_tags = (responseElements) ? responseElements : $$('a');

		a_tags.each(function(a){
			//test 'milkbox' and link extension, and collect all milkbox links
			if(a.rel && a.rel.test(/^milkbox/i) && a.href.split('?')[0].test(/\.(gif|jpg|jpeg|png|swf)$/i)){
				if(a.rel.length>7 && !this.families.contains(a.rel)){ this.families.push(a.rel); };
				milkbox_a.push(a);
			}
		},this);

		//create an array of arrays with all galleries
		milkbox_a.each(function(a){
			$(a).store('href',a.href);
			$(a).store('rel',a.rel);
			$(a).store('title',a.title);
			if(this.checkFileType(a.href,"swf")){ this.setFileProps($(a),a.rev); }

			if(this.options.removeTitle){ $(a).removeProperty('title'); }
			if(a.rel.length > 7){
				this.families.each(function(f,i){
					if(a.rel == f){
						var gMounted = false;
						var index;
						this.galleries.each(function(g,k){
							if(g[0].rel == f){
								gMounted = true;
								index = k;
								return;
							}
						});

						if(gMounted == true){ this.galleries[index].push($(a)); }
						else { this.galleries.push([$(a)]); }
					};
				},this);
			} else { this.galleries.push([$(a)]); };
		},this);

	},

	prepareHTML:function(){

		this.overlay = new Element('div', { 'id':'mbOverlay','styles':{ 'opacity':0,'visibility':'visible','height':0,'overflow':'hidden' }}).inject($(document.body));
		if (bertaGlobalOptions.galleryFullScreenBackground=='white'){
			this.overlay.setStyle('background-color','#fff');
		}
		this.center = new Element('div', {'id':'mbCenter', 'styles':{'width':this.options.initialWidth,'height':this.options.initialHeight,'marginLeft':-(this.options.initialWidth/2),'opacity':0, 'visibility': 'hidden' }}).inject($(document.body));
		if (bertaGlobalOptions.galleryFullScreenFrame=='no'){
			this.center.setStyle('background','none');

			if (bertaGlobalOptions.galleryFullScreenBackground=='black'){
				this.center.addClass('milkbox_theme_white');
			}
		}

		this.canvas = new Element('div', {'id':'mbCanvas'}).inject(this.center);
		this.bottom = new Element('div',{'id':'mbBottom'}).inject(this.center).setStyle('visibility','hidden');
		this.bottom.setStyle('text-align',bertaGlobalOptions.galleryFullScreenCaptionAlign);
		this.navigation = new Element('div',{'id':'mbNavigation'}).setStyle('visibility','hidden');
		this.description = new Element('div',{'id':'mbDescription'}).setStyle('visibility','hidden');

		this.bottom.adopt(this.navigation, this.description, new Element('div',{'class':'mbClear'}));
		this.close = new Element('a',{'id':'mbCloseLink'});
		this.close.set('text', bertaGlobalOptions.galleryFullScreenCloseText);
		this.next = new Element('a',{'id':'mbNextLink'});
		this.next.set('text', '>');
		this.prev = new Element('a',{'id':'mbPrevLink'});
		this.prev.set('text', '<');
		this.playpause = new Element('a',{'id':'mbPlayPause'});
		this.count = new Element('span',{'id':'mbCount'});

		//this.close

		$$(this.next, this.prev, this.count, this.playpause).setStyle('display','none');

		//this.navigation.adopt(this.next, this.prev, this.playpause, new Element('div',{'class':'mbClear'}), this.count);
		this.navigation.adopt(this.prev, this.count, this.next);

		this.close.inject(this.center, 'top');
	},

	closeMilkbox:function(){
		this.cancelAllEffects();
		this.stopAutoPlay();
		this.setOptions(this.autoPlayBkup);

		this.currentFile = null;
		this.currentIndex = null;
		this.currentGallery = null;
		this.currentRequest = null;
		this.currentResponse = null;

 		//this.close,
		$$(this.prev, this.next, this.playpause, this.count).setStyle('display','none');
		this.playpause.setStyle('backgroundPosition','0 0');
		var border = this.center.getStyle('border-right-width').toInt();
		var navWidth = this.close.getSize().x+border;
		this.navigation.setStyles({'visibility':'hidden'});
		//this.description.setStyle('margin-right',navWidth);
		this.description.empty();
		this.bottom.setStyles({'visibility':'hidden','display':''});

   	    this.canvas.setStyles({'opacity':0, 'width':'', 'height':''});
 		this.canvas.empty();

 		this.count.empty();

		this.center.setStyles({'opacity':0, 'visibility':'hidden', 'width':this.options.initialWidth,'height':this.options.initialHeight,'marginLeft':-(this.options.initialWidth/2)});
		this.overlay.tween('opacity',0);//see onComplete in prepareEvents()

		if(this.formtags && this.formtags.length != 0){ this.formtags.setStyle('display','') };

		this.mode = null;
		this.closed = true;
		this.first = true;
		this.fileReady = false;
		this.fireEvent('closed');
	},

	cancelAllEffects:function(){
		this.overlay.get('tween').cancel();
		this.center.get('morph').cancel();
		this.center.get('tween').cancel();
		this.center.retrieve('setFinalHeight').cancel();
		this.canvas.get('tween').cancel();
	}

});//END MILKBOX;

window.addEvent('domready', function(){
	milkbox = new Milkbox();
});
