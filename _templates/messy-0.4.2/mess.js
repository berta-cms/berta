var MessyMess = class {
  constructor() {
    this.fadeContent = null;
    this.bgContainer = null;
    this.bgImage = null;
    this.bgCaption = null;
    this.bgLoader = null;

    this.bgGridViewTrigger = null;
    this.bgNext = null;
    this.bgPrevious = null;
    this.bgRightCounter = null;
    this.bgLeftCounter = null;
    this.isResponsive = false;
    this.isAutoResponsive = false;
    this.mobileBreakpoint = 768;

    window.BertaHelpers.onDomReady(this.onDOMReady.bind(this));
    window.BertaHelpers.onWindowLoad(this.onLoad.bind(this));
  }

  onDOMReady() {
    var helpers = window.BertaHelpers;

    this.isResponsive = document.querySelectorAll(".xResponsive").length > 0;

    this.isAutoResponsive =
      document.querySelectorAll(".bt-auto-responsive").length > 0;

    // Berta Background
    this.bgContainer = document.getElementById("xBackground");
    this.bgLoader = document.getElementById("xBackgroundLoader");

    // The background video is sized by CSS, it only needs the embed's aspect ratio
    this.setBackgroundVideoRatio();

    if (this.bgContainer) {
      this.bgImage = this.bgContainer.querySelector(".visual-image img");
      this.bgCaption = this.bgContainer.querySelector(".visual-caption");

      this.bgGridViewTrigger = document.getElementById("xGridViewTrigger");
      this.bgNext = document.getElementById("xBackgroundNext");
      this.bgPrevious = document.getElementById("xBackgroundPrevious");
      this.bgRightCounter = document.getElementById("xBackgroundRightCounter");
      this.bgLeftCounter = document.getElementById("xBackgroundLeftCounter");

      if (this.bgImage || this.bgCaption) {
        new BertaBackground();
        this.fadeContent = helpers.getClassStoredValue(
          this.bgContainer,
          "xBgDataFading",
        );
      }

      if (this.bgImage) {
        this.bgImage.style.display = "none";
        this.bgLoader.style.display = "block";
      }
    }

    // Grid view
    if (document.getElementById("xGridView")) {
      document.querySelectorAll(".xGridItem").forEach(function (item) {
        item.addEventListener("click", function () {
          var _berta_grid_img_link = item.src.substr(
            item.src.lastIndexOf("/") + 2,
          );
          _berta_grid_img_link = _berta_grid_img_link.substr(
            _berta_grid_img_link.indexOf("_") + 1,
          );
          helpers.setCookie("_berta_grid_img_link", _berta_grid_img_link);
        });
      });
    }

    if (this.bgGridViewTrigger) {
      var setGridViewCookie = function () {
        helpers.setCookie("_berta_grid_view", "berta_grid_view");
      };
      this.bgGridViewTrigger.addEventListener("click", setGridViewCookie);

      // Key events
      window.addEventListener("keydown", (event) => {
        if (event.key == "ArrowUp") {
          setGridViewCookie();
          window.location.href = this.bgGridViewTrigger.getAttribute("href");
        }
      });
    }

    if (helpers.getCookie("_berta_grid_img_link"))
      helpers.removeCookie("_berta_grid_img_link");

    if (helpers.getCookie("_berta_grid_view"))
      helpers.removeCookie("_berta_grid_view");

    setInterval(() => {
      this.copyrightStickToBottom();
    }, 1000);

    if (bertaGlobalOptions.environment == "engine") {
      document.querySelectorAll(".xEntryToBack").forEach((link) => {
        link.addEventListener("click", this.editor_saveOrder.bind(this));
      });
    }

    // Centering
    var container = document.getElementById("contentContainer");

    if (container) {
      var centeredLayout = container.classList.contains("xCentered")
        ? true
        : false;
    }

    if (centeredLayout) {
      var bottom = document.getElementById("bottom");
      var bottomRight = parseInt(helpers.getStyle(bottom, "right"));
      var fixedItems = container.parentElement.querySelectorAll(".xFixed");
      var fixedItemsInitLeft = new Map();
      var guidesWidth =
        (helpers.getWindowSize().x - container.offsetWidth) / 2 >= 0
          ? (helpers.getWindowSize().x - container.offsetWidth) / 2
          : 0;
      var containerW = container.offsetWidth;
      var bottomW;

      if (helpers.getWindowSize().x < containerW) {
        bottomW =
          helpers.getWindowSize().x -
          parseInt(helpers.getStyle(bottom, "right"));
      } else {
        bottomW = containerW - parseInt(helpers.getStyle(bottom, "right"));
      }

      bottom.style.width = bottomW - bottomRight + "px";
      bottom.style.left = "auto";

      fixedItems.forEach(function (item) {
        var left = parseInt(helpers.getStyle(item, "left"));
        var w = guidesWidth + left;

        fixedItemsInitLeft.set(item, left);
        item.style.left = w + "px";
      });

      bottom.style.right = guidesWidth + bottomRight + "px";

      window.addEventListener("resize", function () {
        var guidesWidth =
          (helpers.getWindowSize().x - container.offsetWidth) / 2 >= 0
            ? (helpers.getWindowSize().x - container.offsetWidth) / 2
            : 0;

        fixedItems.forEach(function (item) {
          var w = guidesWidth + fixedItemsInitLeft.get(item);
          item.style.left = w + "px";
        });

        bottom.style.right = guidesWidth + bottomRight + "px";

        if (helpers.getWindowSize().x < containerW) {
          bottomW =
            helpers.getWindowSize().x -
            parseInt(helpers.getStyle(bottom, "right"));
        } else {
          bottomW = containerW - bottomRight;
        }

        bottom.style.width = bottomW - bottomRight + "px";
      });

      if (bertaGlobalOptions.environment == "engine") {
        document.body.style.overflowY = "scroll";

        var el1 = helpers.createElement("div", { class: "xCenteringGuide" });
        el1.style.left = "0px";
        el1.style.width = guidesWidth + "px";
        var el2 = helpers.createElement("div", { class: "xCenteringGuide" });
        el2.style.right = "0px";
        el2.style.width = guidesWidth + "px";

        document.body.prepend(el1);
        document.body.prepend(el2);

        window.addEventListener("resize", function () {
          var guidesWidth =
            (helpers.getWindowSize().x - container.offsetWidth) / 2;
          el1.style.width = guidesWidth + "px";
          el2.style.width = guidesWidth + "px";
        });
      }
    }

    setTimeout(this.gridBackgroundPosition.bind(this), 100);

    window.addEventListener("resize", this.gridBackgroundPosition.bind(this));
    window.addEventListener("scroll", this.gridBackgroundPosition.bind(this));

    if (this.isResponsive) {
      if (bertaGlobalOptions.environment == "site") {
        this.iframeResponsiveFix(this.getEntryIframes(), false);
      }
    }

    if (this.isAutoResponsive && bertaGlobalOptions.environment == "site") {
      window.addEventListener(
        "resize",
        helpers.debounce(() => {
          this.iframeResponsiveFix(this.getEntryIframes(), true);
        }, 250),
      );
    }

    helpers.triggerResize();
  }

  // "Fill window" and "Keep ratio" are CSS (_content.scss), they read the ratio from --video-ratio
  setBackgroundVideoRatio() {
    var videoEmbed = document.getElementById("xBackgroundVideoEmbed");
    var video = videoEmbed && videoEmbed.querySelector("iframe");

    if (!video) {
      return;
    }

    var width = video.getAttribute("width");
    var height = video.getAttribute("height");
    var isSize = function (value) {
      return /^\d+(\.\d+)?$/.test(value) && Number(value) > 0;
    };

    // without plain pixel sizes the CSS default 16:9 stays
    if (isSize(width) && isSize(height)) {
      videoEmbed.style.setProperty("--video-ratio", width + " / " + height);
    }
  }

  // Iframes in the page content, the background video is never wrapped
  getEntryIframes() {
    return Array.from(document.querySelectorAll("iframe")).filter(
      function (iframe) {
        return !iframe.closest("#xBackgroundVideoEmbed");
      },
    );
  }

  // Auto-responsive layouts unwrap the iframes again above the mobile breakpoint
  iframeResponsiveFix(iframes, removeWrapper) {
    var unwrap =
      removeWrapper &&
      this.mobileBreakpoint <= window.BertaHelpers.getWindowSize().x;
    window.BertaHelpers.wrapResponsiveIframes(iframes, unwrap);
  }

  gridBackgroundPosition() {
    var xGridBackground = document.getElementById("xGridBackground");

    if (xGridBackground) {
      var xPos = -window.pageXOffset;
      var yPos = -window.pageYOffset;

      var xCenteringGuide = document.querySelectorAll(".xCenteringGuide");

      if (xCenteringGuide.length) {
        xPos = xPos + xCenteringGuide[0].offsetWidth;
      }

      xGridBackground.style.backgroundPosition = xPos + "px " + yPos + "px";
    }
  }

  onLoad() {
    var helpers = window.BertaHelpers;

    if (this.bgContainer && this.bgImage) {
      this.bgLoader.style.display = "none";
      this.bgImage.style.display = "block";
    }

    // Fade content
    if (
      this.fadeContent == "enabled" &&
      this.bgContainer.querySelector(".visual-image")
    ) {
      var hideContent, lastX, lastY;
      window.addEventListener("mousemove", (event) => {
        if (!lastX && !lastY) {
          lastX = event.pageX;
          lastY = event.pageY;
        }

        if (event.pageX != lastX && event.pageY != lastY) {
          if (hideContent) {
            clearTimeout(hideContent);
            hideContent = 0;
          }

          helpers.setOpacity(document.getElementById("allContainer"), 1);
          helpers.setOpacity(document.getElementById("bottom"), 1);
          if (this.bgLeftCounter && this.bgRightCounter) {
            helpers.setOpacity(this.bgLeftCounter, 1);
            helpers.setOpacity(this.bgRightCounter, 1);
          } else if (this.bgNext && this.bgPrevious) {
            helpers.setOpacity(this.bgNext, 1);
            helpers.setOpacity(this.bgPrevious, 1);
          }

          hideContent = setTimeout(() => {
            helpers.fadeTo(document.getElementById("allContainer"), 0, 500);
            helpers.fadeTo(document.getElementById("bottom"), 0, 500);
            if (this.bgLeftCounter && this.bgRightCounter) {
              helpers.fadeTo(this.bgLeftCounter, 0, 500);
              helpers.fadeTo(this.bgRightCounter, 0, 500);
            } else if (this.bgNext && this.bgPrevious) {
              helpers.fadeTo(this.bgNext, 0, 500);
              helpers.fadeTo(this.bgPrevious, 0, 500);
            }
          }, 3000);

          lastX = event.pageX;
          lastY = event.pageY;
        }
      });
    }

    // Masonry grid
    var gridView = document.getElementById("xGridView");
    if (gridView) {
      if (navigator.userAgent.match(/iPhone/i))
        setTimeout(function () {
          gridView.style.visibility = "visible";
        }, 100);
      else gridView.style.visibility = "visible";

      new BertaMasonry(gridView, ".box");
    }
  }

  copyrightStickToBottom() {
    var helpers = window.BertaHelpers;
    var y;
    var bottom = document.getElementById("bottom");

    if (bottom) {
      var bottomPaddingTop = parseInt(helpers.getStyle(bottom, "padding-top"));
      var allDraggables = document.querySelectorAll(
        ".xNgEditableDragXY:not(.xFixed)",
      );
      var maxY = (y = 0);
      var windowH = helpers.getWindowSize().y;
      var windowW = helpers.getWindowSize().x;
      var bottomH = 0;

      Array.prototype.forEach.call(bottom.children, function (item) {
        var bottomElH = item.offsetHeight;
        if (bottomElH > bottomH) {
          bottomH = bottomElH;
        }
      });

      if (
        this.isResponsive ||
        (this.isAutoResponsive &&
          bertaGlobalOptions.environment == "site" &&
          windowW < this.mobileBreakpoint)
      ) {
        maxY = document.getElementById("allContainer").offsetHeight;
        //add h1 margin-top to the height
        var h1 = document.querySelector("h1");
        // Without an h1 the MooTools version added NaN, so `top` below is ignored and stays as it was
        maxY = maxY + (h1 ? parseInt(helpers.getStyle(h1, "margin-top")) : NaN);
      } else {
        allDraggables.forEach(function (item) {
          y =
            parseInt(helpers.getStyle(item, "top")) +
            parseInt(item.offsetHeight);
          if (maxY < y) {
            maxY = y;
          }
        });
      }

      if (maxY < windowH - bottomH) {
        maxY = windowH - bottomH - bottomPaddingTop;
      }

      bottom.style.top = maxY + "px";
    }
  }

  editor_saveOrder(event) {
    event.preventDefault();
    event.stopPropagation();

    var target = event.target.closest(".xEntry");
    var entriesList = target.closest(".xEntriesList");
    var nextEntry = entriesList.querySelector(":scope > .xEntry");
    entriesList.prepend(target);

    var entryId = window.BertaHelpers.getClassStoredValue(target, "xEntryId");
    var value = window.BertaHelpers.getClassStoredValue(nextEntry, "xEntryId");
    var site = getCurrentSite();

    redux_store.dispatch(
      Actions.initOrderSectionEntries(
        site,
        bertaEditor.currentSection,
        entryId,
        value,
      ),
    );
  }
};

var BertaBackground = class {
  constructor() {
    this.options = {
      type: "image",
      image_size: "medium",
      autoplay: 0,
      image_scale: null,
    };

    this.container = null;
    this.nextButton = null;
    this.previousButton = null;
    this.nextClickArea = null;
    this.previousClickArea = null;
    this.loader = null;

    this.imageContainer = null;
    this.captionContainer = null;
    this.imagesList = null;
    this.bgElements = null;
    this.bgElementCount = null;
    this.caption = null;
    this.image = null;
    // the image being loaded for the newest slide, older loads finishing late are ignored
    this.loadingImage = null;

    this.selected = null;
    this.selectedIndex = null;
    this.rightCounter = null;
    this.leftCounter = null;
    this.rightCounterContent = null;
    this.leftCounterContent = null;

    this.autoplayInterval = null;
    this.data = null;

    this.fadeElements = null;
    this.bgAnimationEnabled = null;
    this.onResize = null;

    this._init();

    // If not mobile device
    if (this.nextClickArea && this.previousClickArea) {
      this.nextClickArea.addEventListener("click", () => {
        this._getNext();
        this._getCounter();
      });
      this.nextClickArea.addEventListener("mouseenter", () => {
        this._hide(this.leftCounter);
        this._show(this.rightCounter);
      });
      this.nextClickArea.addEventListener("mouseleave", () => {
        this._hide(this.leftCounter);
        this._hide(this.rightCounter);
      });

      this.previousClickArea.addEventListener("click", () => {
        this._getPrevious();
        this._getCounter();
      });
      this.previousClickArea.addEventListener("mouseenter", () => {
        this._hide(this.rightCounter);
        this._show(this.leftCounter);
      });
      this.previousClickArea.addEventListener("mouseleave", () => {
        this._hide(this.rightCounter);
        this._hide(this.leftCounter);
      });

      window.addEventListener("keydown", (event) => {
        if (event.key == "ArrowRight") {
          this._getNext();
          this._getCounter();
        } else if (event.key == "ArrowLeft") {
          this._getPrevious();
          this._getCounter();
        }
      });
      window.addEventListener("mousemove", (event) => {
        this._moveCounter(event);
      });

      //set default cursor if navigation is hidden
      if (this.rightCounter.classList.contains("xHidden")) {
        this.previousClickArea.style.cursor = "default";
        this.nextClickArea.style.cursor = "default";
      }
    }
    // If mobile device
    else if (this.nextButton && this.previousButton) {
      // Image click event
      this.imageContainer.addEventListener("click", (event) => {
        if (event.target.closest("img")) {
          this._getNext();
        }
      });

      // Caption click event
      this.captionContainer.addEventListener("click", () => {
        this._getNext();
      });

      // Next image button click
      this.nextButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this._getNext();
      });

      // Previous image button click
      this.previousButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this._getPrevious();
      });
    }
  }

  _init() {
    var helpers = window.BertaHelpers;

    this.nextButton = document.getElementById("xBackgroundNext");
    this.previousButton = document.getElementById("xBackgroundPrevious");
    this.nextClickArea = document.getElementById("xBackgroundRight");
    this.previousClickArea = document.getElementById("xBackgroundLeft");
    this.rightCounter = document.getElementById("xBackgroundRightCounter");
    this.leftCounter = document.getElementById("xBackgroundLeftCounter");
    this.loader = document.getElementById("xBackgroundLoader");
    this.container = document.getElementById("xBackground");

    this.imagesList = this.container.querySelector(".visual-list");
    this.bgElements = Array.from(this.imagesList.children);
    this.bgElementCount = this.bgElements.length;

    this.imageContainer = this.container.querySelector(".visual-image");
    this.captionContainer = this.container.querySelector(".visual-caption");
    this.image = this.imageContainer.querySelector("img");
    this.caption = this.captionContainer.querySelector(".caption-content");
    this.bgAnimationEnabled =
      helpers.getClassStoredValue(this.container, "xBgDataAnimation") !==
      "disabled";

    this.selected = this.imagesList.querySelector(".sel");
    if (this.rightCounter && this.leftCounter) {
      this.rightCounterContent =
        this.rightCounter.querySelector(".counterContent");
      this.leftCounterContent =
        this.leftCounter.querySelector(".counterContent");
      this._getCounter();
      this._hide(this.rightCounter);
      this._hide(this.leftCounter);
    }

    this.data = { options: this.options };
    this.data.options.image_size = helpers.getClassStoredValue(
      this.container,
      "xBgDataImageSize",
    );
    this.data.options.autoplay = helpers.getClassStoredValue(
      this.container,
      "xBgDataAutoplay",
    );
    if (this.data.options.image_size == "large")
      this.data.options.image_scale = 1;
    else if (
      !this.data.options.image_size ||
      this.data.options.image_size == "medium"
    )
      this.data.options.image_scale = 0.85;
    else if (this.data.options.image_size == "small")
      this.data.options.image_scale = 0.65;

    this.fadeElements = [this.imageContainer, this.captionContainer];

    if (this.image) this._centerImage();
    else if (this.caption) this._centerCaption();

    // Autoplay
    if (this.data.options.autoplay > 0) {
      this._autoplay();
    }
  }

  // Same as MooTools More show()/hide() on the counters
  _show(el) {
    if (window.getComputedStyle(el).display == "none") {
      el.style.display = "block";
    }
  }

  _hide(el) {
    if (window.getComputedStyle(el).display != "none") {
      el.style.display = "none";
    }
  }

  _autoplay() {
    var time = this.data.options.autoplay * 1000;
    this.autoplayInterval = setInterval(() => {
      var newBgContent =
        this.selected.nextElementSibling || this.imagesList.firstElementChild;

      this.selected.classList.remove("sel");
      newBgContent.classList.add("sel");
      this.selected = newBgContent;

      if (this.rightCounter && this.leftCounter) this._getCounter();

      this._changeBgContent(newBgContent);
    }, time);
  }

  _getCounter() {
    this.selectedIndex = this.bgElements.indexOf(this.selected) + 1;
    this.rightCounterContent.textContent =
      (this.selectedIndex == this.bgElementCount ? 1 : this.selectedIndex + 1) +
      "/" +
      this.bgElementCount;
    this.leftCounterContent.textContent =
      (this.selectedIndex == 1 ? this.bgElementCount : this.selectedIndex - 1) +
      "/" +
      this.bgElementCount;
  }

  _moveCounter(e) {
    this.rightCounter.style.left = e.clientX + "px";
    this.rightCounter.style.top = e.clientY + "px";
    this.leftCounter.style.left = e.clientX + "px";
    this.leftCounter.style.top = e.clientY + "px";
  }

  _getNext() {
    if (this.data.options.autoplay > 0) {
      clearInterval(this.autoplayInterval);
      this._autoplay();
    }

    var newBgContent =
      this.selected.nextElementSibling || this.imagesList.firstElementChild;

    this.selected.classList.remove("sel");
    newBgContent.classList.add("sel");
    this.selected = newBgContent;

    this._changeBgContent(newBgContent);
  }

  _getPrevious() {
    if (this.data.options.autoplay > 0) {
      clearInterval(this.autoplayInterval);
      this._autoplay();
    }

    var newBgContent =
      this.selected.previousElementSibling || this.imagesList.lastElementChild;

    this.selected.classList.remove("sel");
    newBgContent.classList.add("sel");
    this.selected = newBgContent;

    this._changeBgContent(newBgContent);
  }

  // Fade out the current slide, then show the new one. A newer change cancels the fade of an older one.
  _changeBgContent(newBgContent) {
    // drop the image an older change is still loading
    if (this.loadingImage) {
      this.loadingImage = null;
      this.loader.style.display = "none";
    }

    if (this.bgAnimationEnabled) {
      Promise.all(
        this.fadeElements.map(function (el) {
          return window.BertaHelpers.fadeTo(el, 0, 250);
        }),
      ).then(() => {
        this._getNewBgContent(newBgContent);
      });
    } else {
      this._getNewBgContent(newBgContent);
    }
  }

  _getNewBgContent(newContent) {
    var tagName = newContent.tagName.toLowerCase();

    if (tagName == "input") {
      if (this.image) this.image.remove();
      if (this.caption) this.caption.remove();

      this.loader.style.display = "block";
      var image = window.BertaHelpers.createElement("img", {
        class: "bg-element",
        width: newContent.getAttribute("width"),
        height: newContent.getAttribute("height"),
      });
      image.onload = () => {
        if (image !== this.loadingImage) {
          return;
        }
        this.loadingImage = null;
        // Like MooTools Asset.image: missing or invalid width/height fall back to the natural size
        image.setAttribute("width", image.width);
        image.setAttribute("height", image.height);
        this._getNewBgImageFinish();
      };
      this.image = this.loadingImage = image;
      image.src = newContent.getAttribute("src");
    } else if (tagName == "textarea") {
      if (this.image) this.image.remove();
      if (this.caption) this.caption.remove();

      this.caption = window.BertaHelpers.createElement(
        "div",
        { class: "caption-content" },
        newContent.textContent,
      );
      this._getNewBgCaptionFinish();
    }
  }

  _getNewBgImageFinish() {
    this.loader.style.display = "none";
    this.imageContainer.append(this.image);
    this._centerImage();
    this._fadeInBgContent();
  }

  _getNewBgCaptionFinish() {
    this.captionContainer.append(this.caption);
    this._centerCaption();
    this._fadeInBgContent();
  }

  _fadeInBgContent() {
    this.fadeElements.forEach((el) => {
      if (this.bgAnimationEnabled) {
        window.BertaHelpers.setOpacity(el, 0);
        window.BertaHelpers.fadeTo(el, 1, 500);
      } else {
        window.BertaHelpers.setOpacity(el, 1);
      }
    });
  }

  _centerCaption() {
    this.captionContainer.style.marginTop =
      "-" + this.captionContainer.offsetHeight / 2 + "px";
  }

  _centerImage() {
    this.data.width = parseInt(this.image.getAttribute("width"));
    this.data.height = parseInt(this.image.getAttribute("height"));

    if (!this.onResize) {
      this.onResize = this._onResize.bind(this);
      window.addEventListener("resize", this.onResize);
    }
    this._onResize();
  }

  _onResize() {
    var w = window.BertaHelpers.getWindowSize().x,
      h = window.BertaHelpers.getWindowSize().y;

    var posX, posY;

    // scale
    var scaleX = w / this.data.width,
      scaleY = h / this.data.height;

    if (
      this.data.width >= this.data.height &&
      this.data.options.image_scale == 1
    )
      if (scaleX > scaleY) scaleY = scaleX;
      else scaleX = scaleY;
    else if (scaleX > scaleY) scaleX = scaleY;
    else scaleY = scaleX;

    // scale based on background image size
    scaleX = scaleX * this.data.options.image_scale;
    scaleY = scaleY * this.data.options.image_scale;

    // position X
    posX = Math.round((w - this.data.width * scaleX) / 2);

    // position Y
    posY = Math.round((h - this.data.height * scaleY) / 2);

    this.image.style.width = Math.round(this.data.width * scaleX) + "px";
    this.image.style.height = Math.round(this.data.height * scaleY) + "px";
    this.image.style.left = posX + "px";
    this.image.style.top = posY + "px";
  }
};

new MessyMess();
