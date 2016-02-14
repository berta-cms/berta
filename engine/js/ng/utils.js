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

  window.Templates = {
    templates: {},

    loadTemplates: function() {
      var templateList = document.getElementById('templateList');

      if (templateList) {
        var templates = templateList.querySelectorAll('script');
        templates.forEach(function(template, index){
          if(template.getAttribute('type') === 'text/template'){
            this.templates[template.getAttribute('id')] = template.innerHtml;
          }
        }.bind(this));
      }
    },

    // Get template by name from hash of preloaded templates
    get: function(name) {
      return this.templates[name];
    }
  };

  String.prototype.replaceTokens = function replaceTokens(replacement) {
    return this.replace(/<\%=([^%>]+)\%>/g, function(str, match) {
      return replacement[match];
    });
  }
})(window, document);
