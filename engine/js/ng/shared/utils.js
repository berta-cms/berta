(function(window, document, redux_store) {
  'use strict';
  /** @todo: move helpers to Berta namespace */

  window.sync = function (url, data, method) {
    var token = window.getCookie('token');
    method = method || 'PATCH';
    return fetch(
      url,
      {
        method: method,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: method === 'GET' ? undefined : JSON.stringify(data)
      }
    )
      .then(function (response) {
        if (response.status === 401) {
          return {
            'error_message': 'Unauthorized'
          };
        }
        return response.json();
      })
      .catch(function (error) {
        /** @todo: create error state/reducer to manage failed requests and other app errors */
        console.error('Request failed:', error.message);
      });
  };

  window.getCookie = function (cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  };

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
    var q = window.getQueryParams();
    return q.site === undefined ? '' : q.site;
  };

  window.escapeHTML = function escapeHTML(str) {
    var div = document.createElement('div');
    var text = document.createTextNode(str);
    div.appendChild(text);
    return div.innerHTML;
  };

  window.getAllTemplates = function getAllTemplates() {
    var templates = redux_store.getState().siteTemplates.toJSON();

    return Object.getOwnPropertyNames(templates);
  };

  var Templates = {
    templates: {}
  };

  Templates.load = function load() {
    var templateList = document.getElementById('templateList');

    if (templateList) {
      var templates = Array.prototype.slice.call(
        templateList.querySelectorAll('script'),
        0
      );

      templates.forEach(function(template){
        if(template.getAttribute('type') === 'text/template'){
          this.templates[template.getAttribute('id')] = template.innerHTML;
        }
      }.bind(this));
    }
  }.bind(Templates);

  Templates.get = function get(name, ctx) {
    var tpl = this.templates[name];

    return tpl.replace(/<%=([^%>]+)%>/g, function(str, match) {
      return ctx[match];
    });
  }.bind(Templates);

  window.Templates = Templates;

  window.domReady = function(callback) {
    var ready = false,
        detach = function() {
          if(document.addEventListener) {
            document.removeEventListener('DOMContentLoaded', completed);
            window.removeEventListener('load', completed);
          } else {
            document.detachEvent('onreadystatechange', completed);
            window.detachEvent('onload', completed);
          }
        },
        completed = function() {
          if(!ready && (document.addEventListener || event.type === 'load' || document.readyState === 'complete')) {
            ready = true;
            detach();
            callback();
          }
        };

    if(document.readyState === 'complete') {
      callback();
    } else if(document.addEventListener) {
      document.addEventListener('DOMContentLoaded', completed);
      window.addEventListener('load', completed);
    } else {
      document.attachEvent('onreadystatechange', completed);
      window.attachEvent('onload', completed);

      var top = false;

      try {
        top = window.frameElement === null && document.documentElement;
      } catch(e) { /* skip */}

      if(top && top.doScroll) {
        (function scrollCheck() {
          if(ready) return;

          try {
            top.doScroll('left');
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
})(window, document, window.redux_store);
