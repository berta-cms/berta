window.BertaHelpers = (function () {
  return {

    /**
     * Logout user by reloading the page
     */
    logoutUser: function () {
      if (window.parent === window) {
        window.location.reload();
      } else {
        window.parent.postMessage('user:logout', '*');
      }
    },

    /**
     * Detect mobile device
     */
    isMobile: function () {
      var agent = navigator.userAgent || navigator.vendor || window.opera;
      return  (/(ipad|playbook|silk|android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(agent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substr(0, 4))) ? true : false;
    },

    debounce: function (func, wait, immediate) {
      var timeout;
      return function () {
        var context = this, args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },

    throttle: function (callback, limit) {
      var wait = false; // Initially, we're not waiting
      return function () { // We return a throttled function
        if (!wait) { // If we're not waiting
          callback.call(); // Execute users function
          wait = true; // Prevent future invocations
          setTimeout(function () { // After a period of time
            wait = false; // And allow future invocations
          }, limit);
        }
      };
    },

    updateQueryStringParameter: function (uri, key, value) {
      var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
      var separator = uri.indexOf('?') !== -1 ? '&' : '?';
      if (uri.match(re)) {
        return uri.replace(re, '$1' + key + '=' + value + '$2');
      } else {
        return uri + separator + key + '=' + value;
      }
    },

    /**
     * Dispatch a native window resize event, it reaches both MooTools and native listeners.
     * UIEvent is used because MooTools compat replaces the global Event constructor.
     */
    triggerResize: function () {
      window.dispatchEvent(new UIEvent('resize'));
    },

    /**
     * Read a value stored in a `varName-value` class name, e.g. `xEntryId-5`
     */
    getClassStoredValue: function (el, varName) {
      for (var i = 0; i < el.classList.length; i++) {
        var className = el.classList[i];
        var dashPos = className.indexOf('-');
        if (dashPos !== -1 && className.slice(0, dashPos) === varName) {
          return className.slice(dashPos + 1);
        }
      }
      return null;
    },

    setClassStoredValue: function (el, varName, varValue) {
      var curValue = window.BertaHelpers.getClassStoredValue(el, varName);
      if (curValue) {
        el.classList.remove(varName + '-' + curValue);
      }
      el.classList.add(varName + '-' + varValue);
    },

    /**
     * Create an element with attributes and optional inner HTML;
     * null, undefined and false attribute values are skipped, true sets a boolean attribute
     */
    createElement: function (tagName, attributes, html) {
      var el = document.createElement(tagName);
      Object.keys(attributes || {}).forEach(function (name) {
        var value = attributes[name];
        if (value === null || value === undefined || value === false) {
          return;
        }
        el.setAttribute(name, value === true ? '' : value);
      });
      if (html !== undefined) {
        el.innerHTML = html;
      }
      return el;
    },

    /**
     * Fade an element in from transparent (250ms, sine ease-in-out)
     */
    fadeIn: function (el) {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      el.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 250,
        easing: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)'
      });
    },

    /**
     * Set opacity, canceling a running fadeTo() of the element
     */
    setOpacity: function (el, opacity) {
      if (el.bertaFade) {
        el.bertaFade.cancel();
        el.bertaFade = null;
      }
      el.style.opacity = opacity;
    },

    /**
     * Animate opacity like a MooTools tween (sine ease-in-out).
     * A new fade or setOpacity() of the same element cancels the running one.
     * Resolves when the fade finishes, never when it was canceled.
     */
    fadeTo: function (el, opacity, duration) {
      var from = window.getComputedStyle(el).opacity;
      window.BertaHelpers.setOpacity(el, opacity);

      var animation = el.animate([{ opacity: from }, { opacity: opacity }], {
        duration: duration,
        easing: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)'
      });
      el.bertaFade = animation;

      return new Promise(function (resolve) {
        // A timer, like MooTools: animation.finished only settles on a rendering update,
        // which a background tab doesn't get, so a slideshow would stall there
        setTimeout(function () {
          if (el.bertaFade !== animation) {
            return;
          }
          el.bertaFade = null;
          resolve();
        }, duration);
      });
    },

    /**
     * Run a callback once the DOM is ready, right away if it already is
     */
    onDomReady: function (callback) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        callback();
      }
    },

    /**
     * Run a callback once the page has loaded, right away if it already has
     */
    onWindowLoad: function (callback) {
      if (document.readyState === 'complete') {
        callback();
      } else {
        window.addEventListener('load', callback);
      }
    },

    /**
     * Read a style like MooTools getStyle: the inline value, otherwise the computed one.
     * Takes a hyphenated property name, e.g. `padding-top`.
     */
    getStyle: function (el, property) {
      return el.style.getPropertyValue(property) || window.getComputedStyle(el).getPropertyValue(property);
    },

    /**
     * Viewport size without the scrollbar, same as MooTools window.getSize()
     */
    getWindowSize: function () {
      return {
        x: document.documentElement.clientWidth,
        y: document.documentElement.clientHeight
      };
    },

    /**
     * Aspect ratio from the width and height attributes, e.g. `560 / 315`,
     * null unless both are plain positive numbers (no `px`, no `%`)
     */
    getSizeRatio: function (el) {
      var width = el.getAttribute('width');
      var height = el.getAttribute('height');
      var isSize = function (value) {
        return /^\d+(\.\d+)?$/.test(value) && Number(value) > 0;
      };

      return isSize(width) && isSize(height) ? width + ' / ' + height : null;
    },

    getCookie: function (name) {
      var match = document.cookie.match('(?:^|;)\\s*' + name.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)');
      return match ? decodeURIComponent(match[1]) : null;
    },

    /**
     * Set a session cookie for the whole site
     */
    setCookie: function (name, value) {
      document.cookie = name + '=' + encodeURIComponent(value) + '; path=/';
    },

    removeCookie: function (name) {
      document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };
})();
