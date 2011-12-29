//MooTools More, <http://mootools.net/more>. Copyright (c) 2006-2009 Aaron Newton <http://clientcide.com/>, Valerio Proietti <http://mad4milk.net> & the MooTools team <http://mootools.net/developers>, MIT Style License.

(function(){var a=function(c,b){return(c)?($type(c)=="function"?c(b):b.get(c)):"";};this.Tips=new Class({Implements:[Events,Options],options:{onShow:function(){this.tip.setStyle("display","block");
},onHide:function(){this.tip.setStyle("display","none");},title:"title",text:function(b){return b.get("rel")||b.get("href");},showDelay:100,hideDelay:100,className:"tip-wrap",offset:{x:16,y:16},windowPadding:{x:0,y:0},fixed:false},initialize:function(){var b=Array.link(arguments,{options:Object.type,elements:$defined});
this.setOptions(b.options);if(b.elements){this.attach(b.elements);}this.container=new Element("div",{"class":"tip"});},toElement:function(){if(this.tip){return this.tip;
}return this.tip=new Element("div",{"class":this.options.className,styles:{position:"absolute",top:0,left:0}}).adopt(new Element("div",{"class":"tip-top"}),this.container,new Element("div",{"class":"tip-bottom"}));
},attach:function(b){$$(b).each(function(d){var f=a(this.options.title,d),e=a(this.options.text,d);d.erase("title").store("tip:native",f).retrieve("tip:title",f);
d.retrieve("tip:text",e);this.fireEvent("attach",[d]);var c=["enter","leave"];if(!this.options.fixed){c.push("move");}c.each(function(h){var g=d.retrieve("tip:"+h);
if(!g){g=this["element"+h.capitalize()].bindWithEvent(this,d);}d.store("tip:"+h,g).addEvent("mouse"+h,g);},this);},this);return this;},detach:function(b){$$(b).each(function(d){["enter","leave","move"].each(function(e){d.removeEvent("mouse"+e,d.retrieve("tip:"+e)).eliminate("tip:"+e);
});this.fireEvent("detach",[d]);if(this.options.title=="title"){var c=d.retrieve("tip:native");if(c){d.set("title",c);}}},this);return this;},elementEnter:function(c,b){this.container.empty();
["title","text"].each(function(e){var d=b.retrieve("tip:"+e);if(d){this.fill(new Element("div",{"class":"tip-"+e}).inject(this.container),d);}},this);$clear(this.timer);
this.timer=(function(){this.show(b);this.position((this.options.fixed)?{page:b.getPosition()}:c);}).delay(this.options.showDelay,this);},elementLeave:function(c,b){$clear(this.timer);
this.timer=this.hide.delay(this.options.hideDelay,this,b);this.fireForParent(c,b);},fireForParent:function(c,b){b=b.getParent();if(!b||b==document.body){return;
}if(b.retrieve("tip:enter")){b.fireEvent("mouseenter",c);}else{this.fireForParent(c,b);}},elementMove:function(c,b){this.position(c);},position:function(e){if(!this.tip){document.id(this);
}var c=window.getSize(),b=window.getScroll(),f={x:this.tip.offsetWidth,y:this.tip.offsetHeight},d={x:"left",y:"top"},g={};for(var h in d){g[d[h]]=e.page[h]+this.options.offset[h];
if((g[d[h]]+f[h]-b[h])>c[h]-this.options.windowPadding[h]){g[d[h]]=e.page[h]-this.options.offset[h]-f[h];}}this.tip.setStyles(g);},fill:function(b,c){if(typeof c=="string"){b.set("html",c);
}else{b.adopt(c);}},show:function(b){if(!this.tip){document.id(this);}if(!this.tip.getParent()){this.tip.inject(document.body);}this.fireEvent("show",[this.tip,b]);
},hide:function(b){if(!this.tip){document.id(this);}this.fireEvent("hide",[this.tip,b]);}});})();