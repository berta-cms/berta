var BertaBackToTop = function () {
  if (bertaGlobalOptions.backToTopEnabled !== 'yes') {
    return;
  }

  var button = document.querySelector('.js-back-to-top');
  if (!button) {
    return;
  }

  var config = {
    bufferSize: 2, // show button only when two screen are scrolled down
    scrollSpeed: 300,
    buttonShowTime: 4000
  };
  var isTouchDevice = 'ontouchstart' in document.documentElement;

  var showTimeout;

  var show = function () {
    button.style.display = 'flex';
    button.classList.add('show');

    clearTimeout(showTimeout);
    showTimeout = setTimeout(function () {
      hide();
    }, config.buttonShowTime);
  };

  var hide = function () {
    button.classList.remove('show');
    setTimeout(function () {
      button.style.display = 'none';
    }, 200);
  };

  var easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  var scrollToPos = function (to, duration) {
    var element = document.scrollingElement;
    var x = (element && element.scrollLeft) || window.pageXOffset;
    var start = (element && element.scrollTop) || window.pageYOffset,
      change = to - start,
      increment = 20;
    var currentTime = 0;

    var animateScroll = function () {
      currentTime += increment;
      var val = easeInOutQuad(currentTime, start, change, duration);
      window.scrollTo(x, val);
      if (currentTime < duration) {
        window.setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  };

  var isButtonVisible = function () {
    var element = document.scrollingElement;
    var scrollPos = (element && element.scrollTop) || window.pageYOffset;
    return scrollPos > window.innerHeight * config.bufferSize;
  };

  var toggleButtonVisibility = function () {
    if (isButtonVisible()) {
      show();
    } else {
      hide();
    }
  };

  button.addEventListener('click', function (e) {
    e.preventDefault();
    scrollToPos(0, config.scrollSpeed);
  });

  window.addEventListener('scroll', window.BertaHelpers.debounce(function () {
    toggleButtonVisibility();
  }, 200));

  window.addEventListener('resize', window.BertaHelpers.debounce(function () {
    toggleButtonVisibility();
  }, 200));

  if (!isTouchDevice) {
    window.addEventListener('mousemove', window.BertaHelpers.throttle(function () {
      if (isButtonVisible()) {
        show();
      }
    }, 200));
  }

  toggleButtonVisibility();
};

document.addEventListener('DOMContentLoaded', function () {
  BertaBackToTop();
});
