(function(window, document) {
  'use strict';

  window.getQueryParams = function getQueryParams() {
    var pairs = location.search.slice(1).split('&');
    var result = {};

    pairs.forEach(function(pair) {
      if (pair[0]) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
      }
    });

    return result;
  };

  window.getCurrentSite = function getCurrentSite() {
    var q = getQueryParams();
    return q.site === undefined ?  '0' : q.site;
  };

  var Templates = {
        templates: {}
      };

  Templates.load = function load() {
    var self = this,
        templateList = document.getElementById('templateList');

    if (templateList) {
      var templates = Array.prototype.slice.call(
            templateList.querySelectorAll('script'),
            0
          );

      templates.forEach(function(template, index){
        if(template.getAttribute('type') === 'text/template'){
          this.templates[template.getAttribute('id')] = template.innerHTML;
        }
      }.bind(this));
    }
  }.bind(Templates);

  Templates.get = function get(name) {
    return this.templates[name];
  }.bind(Templates);

  window.Templates = Templates;

  String.prototype.replaceTokens = function replaceTokens(replacement) {
    return this.replace(/<\%=([^%>]+)\%>/g, function(str, match) {
      return replacement[match];
    });
  };

  window.domReady = function(callback) {
    var ready = false,
        detach = function() {
          if(document.addEventListener) {
            document.removeEventListener("DOMContentLoaded", completed);
            window.removeEventListener("load", completed);
          } else {
            document.detachEvent("onreadystatechange", completed);
            window.detachEvent("onload", completed);
          }
        },
        completed = function() {
          if(!ready && (document.addEventListener || event.type === "load" || document.readyState === "complete")) {
            ready = true;
            detach();
            callback();
          }
        };

    if(document.readyState === "complete") {
      callback();
    } else if(document.addEventListener) {
      document.addEventListener("DOMContentLoaded", completed);
      window.addEventListener("load", completed);
    } else {
      document.attachEvent("onreadystatechange", completed);
      window.attachEvent("onload", completed);

      var top = false;

      try {
        top = window.frameElement === null && document.documentElement;
      } catch(e) {}

      if(top && top.doScroll) {
        (function scrollCheck() {
          if(ready) return;

          try {
              top.doScroll("left");
          } catch(e) {
              return setTimeout(scrollCheck, 50);
          }

          ready = true;
          detach();
          callback();
        })();
      }
    }
  };
})(window, document);
