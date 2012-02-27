//MooTools More, <http://mootools.net/more>. Copyright (c) 2006-2009 Aaron Newton <http://clientcide.com/>, Valerio Proietti <http://mad4milk.net> & the MooTools team <http://mootools.net/developers>, MIT Style License.

(function(d,f){var c=/(.*?):relay\(((?:\(.*?\)|.)+)\)$/,b=/[+>~\s]/,g=function(h){var i=h.match(c);
return !i?{event:h}:{event:i[1],selector:i[2]};},a=function(n,h){var l=n.target;if(b.test(h=h.trim())){var k=this.getElements(h);for(var j=k.length;j--;
){var m=k[j];if(l==m||m.hasChild(l)){return m;}}}else{for(;l&&l!=this;l=l.parentNode){if(Element.match(l,h)){return document.id(l);}}}return null;};Element.implement({addEvent:function(l,k){var j=g(l);
if(j.selector){var i=this.retrieve("delegation:_delegateMonitors",{});if(!i[l]){var h=function(n){var m=a.call(this,n,j.selector);if(m){this.fireEvent(l,[n,m],0,m);
}}.bind(this);i[l]=h;d.call(this,j.event,h);}}return d.apply(this,arguments);},removeEvent:function(l,k){var j=g(l);if(j.selector){var i=this.retrieve("events");
if(!i||!i[l]||(k&&!i[l].keys.contains(k))){return this;}if(k){f.apply(this,[l,k]);}else{f.apply(this,l);}i=this.retrieve("events");if(i&&i[l]&&i[l].keys.length==0){var h=this.retrieve("delegation:_delegateMonitors",{});
f.apply(this,[j.event,h[l]]);delete h[l];}return this;}return f.apply(this,arguments);},fireEvent:function(l,i,h,n){var j=this.retrieve("events");var m,k;
if(i){m=i[0];k=i[1];}if(!j||!j[l]){return this;}j[l].keys.each(function(o){o.create({bind:n||this,delay:h,arguments:i})();},this);return this;}});})(Element.prototype.addEvent,Element.prototype.removeEvent);
try{if(typeof HTMLElement!="undefined"){HTMLElement.prototype.fireEvent=Element.prototype.fireEvent;}}catch(e){}