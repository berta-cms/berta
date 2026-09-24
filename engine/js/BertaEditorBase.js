Element.implement({
  getIndex: function (type) {
    type = type ? type : "";
    return $$(type).indexOf(this);
  },

  exists: function () {
    return this;
  },

  getClassStoredValue: function (varName) {
    var c = this.get("class").split(" ");
    for (var i = 0; i < c.length; i++) {
      if (c[i].substr(0, c[i].indexOf("-")) == varName) {
        return c[i].substr(c[i].indexOf("-") + 1);
      }
    }
    return null;
  },

  setClassStoredValue: function (varName, varValue) {
    var curValue = this.getClassStoredValue(varName);
    if (curValue) {
      this.removeClass(varName + "-" + curValue);
    }
    this.addClass(varName + "-" + varValue);
  },
});

var BertaEditorBase = new Class({
  Implements: [Options, Events],

  options: {
    xBertaEditorClassDragXY: ".xEditableDragXY",
    xEmptyClass: ".xEmpty",
  },

  shiftPressed: false,
  xGuideLineX: null,
  xGuideLineY: null,

  query: null,

  initConsoleReplacement: function () {
    this.query = window.location.search.replace("?", "").parseQueryString();
    if (!window.console) window.console = {};
    if (!window.console.debug) window.console.debug = function () {};
    if (!window.console.error) window.console.error = function () {};
    if (!window.console.log) window.console.log = function () {};
    if (!window.console.info) window.console.info = function () {};

    var editor = this;
    $(document)
      .addEvent("keydown", function (event) {
        if (event.code == 16) {
          editor.shiftPressed = true;
        }
      })
      .addEvent("keyup", function () {
        editor.shiftPressed = false;
      });
  },

  fixDragHandlePos: function () {
    $$(this.options.xBertaEditorClassDragXY).each(function (el) {
      if (!el.hasClass("xEntry")) {
        var handle = el.getElement(".xHandle");
        var handlePad = Math.abs(parseInt(handle.getStyle("margin-left")));
        var left = parseInt(el.getStyle("left"));

        if (left < handlePad) {
          handle.setStyle("left", handlePad - left + "px");
        } else {
          handle.setStyle("left", 0);
        }
      }
    });
  },

  initGuideLines: function () {
    if ($("xGuideLineX")) {
      return;
    }

    this.xGuideLineX = new Element("div", {
      id: "xGuideLineX",
      class: "xGuideLine",
    });

    this.xGuideLineY = new Element("div", {
      id: "xGuideLineY",
      class: "xGuideLine",
    });
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///|  Element initialization  |///////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elementEdit_init: function (el, editorClass, onElementSave) {
    if (el.retrieve("elementEdit_init")) return false; // already initialized
    el.store("elementEdit_init", true);

    this.makePlaceholderIfEmpty(el);
    var self = this;

    switch (editorClass) {
      case this.options.xBertaEditorClassDragXY:
        el.store("onElementSave", onElementSave);
        el.addClass(editorClass.substr(1));

        var handleEl = el.getElement(".xHandle");
        if (!handleEl) {
          handleEl = new Element("div", {
            class: "xHandle",
            styles: {
              left: "0px",
            },
          });
          handleEl.inject(el);
        }

        el.getElement(".xHandle").addEvents({
          click: function (event) {
            event.preventDefault();
          },
          mouseenter: function (event) {
            //create guidelines
            var winSize = document.getScrollSize();

            self.xGuideLineX.setStyle("width", winSize.x + "px");
            self.xGuideLineY.setStyle("height", winSize.y + "px");

            self.xGuideLineX.inject(document.body);
            if (
              document.body.getElement("#contentContainer.xCentered") &&
              el.hasClass("xFixed") == false
            ) {
              self.xGuideLineY.inject(
                document.body.getElement("#contentContainer")
              );
            } else if (
              document.body.getElement("#allContainer.xCentered") &&
              el.hasClass("xFixed") == false
            ) {
              self.xGuideLineY.inject(
                document.body.getElement("#allContainer")
              );
            } else {
              self.xGuideLineY.inject(document.body);
            }
            self.drawGuideLines(el);
          },
          mouseleave: function (event) {
            self.xGuideLineX.setStyle("width", "0px");
            self.xGuideLineY.setStyle("height", "0px");
          },
        });

        var gridStep = parseInt(bertaGlobalOptions.gridStep);
        gridStep = isNaN(gridStep) || gridStep < 1 ? 1 : gridStep;

        if ($("pageEntries"))
          var allEntries = $("pageEntries").getElements(".xEntry.mess");

        var dragAll = false;

        el.makeDraggable({
          snap: 0,
          grid: gridStep,
          handle: el.getElement(".xHandle"),
          onSnap: function (el) {
            el.addClass("xEditing");
            var xCoords = new Element("div", {
              id: "xCoords",
            });
            el.grab(xCoords, "top");
            dragAll = self.shiftPressed && el.hasClass("xEntry");
            if (dragAll) {
              el.startTop = parseInt(el.getStyle("top"));
              el.startLeft = parseInt(el.getStyle("left"));

              i = 0;
              var entriesStartTop = new Array();
              var entriesStartLeft = new Array();

              allEntries.each(function (entry) {
                if (el != entry) {
                  entriesStartTop[i] = parseInt(entry.getStyle("top"));
                  entriesStartLeft[i] = parseInt(entry.getStyle("left"));
                  i++;
                }
              });

              el.entriesStartTop = entriesStartTop;
              el.entriesStartLeft = entriesStartLeft;
            }
          },
          onDrag: function () {
            if (parseInt(el.getStyle("left")) < 0) {
              el.setStyle("left", "0");
            }

            if (el.hasClass("xEntry") && parseInt(el.getStyle("top")) < 20) {
              el.setStyle("top", "20px");
            } else if (parseInt(el.getStyle("top")) < 0) {
              el.setStyle("top", "0");
            }
            $("xCoords").set(
              "html",
              "X:" +
                parseInt(el.getStyle("left")) +
                " Y:" +
                parseInt(el.getStyle("top"))
            );
            self.drawGuideLines(el);

            if (dragAll) {
              el.movedTop = parseInt(el.getStyle("top")) - el.startTop;
              el.movedLeft = parseInt(el.getStyle("left")) - el.startLeft;

              i = 0;
              allEntries.each(function (entry) {
                if (el != entry) {
                  entry.setStyles({
                    top: el.movedTop + el.entriesStartTop[i] + "px",
                    left: el.movedLeft + el.entriesStartLeft[i] + "px",
                  });
                  i++;
                }
              });
            }
          },
          onComplete: function (el) {
            $("xCoords").destroy();
            el.removeClass("xEditing");

            var editor = this;

            if (typeof messyMess == "object") {
              messyMess.copyrightStickToBottom();
            }

            if (dragAll) {
              allEntries.each(
                function (entry) {
                  if (
                    this.container.hasClass("xCentered") &&
                    entry.hasClass("xFixed")
                  ) {
                    var left =
                      parseInt(entry.getStyle("left")) -
                      (window.getSize().x - this.container.getSize().x) / 2;
                  } else {
                    var left = parseInt(entry.getStyle("left"));
                  }
                  var value = left + "," + parseInt(entry.getStyle("top"));
                  editor.elementEdit_save(
                    null,
                    entry,
                    null,
                    null,
                    value,
                    value
                  );
                }.bind(this)
              );
            } else {
              if (
                this.container.hasClass("xCentered") &&
                el.hasClass("xFixed")
              ) {
                var left =
                  parseInt(el.getStyle("left")) -
                  (window.getSize().x - this.container.getSize().x) / 2;
              } else {
                var left = parseInt(el.getStyle("left"));
              }
              var value = left + "," + parseInt(el.getStyle("top"));
              this.elementEdit_save(null, el, null, null, value, value);

              editor.fixDragHandlePos();
            }
            dragAll = false;
          }.bind(this),
        });
        break;

      default:
        break;
    }
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///  Supporting functions for editables  /////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  drawGuideLines: function (el) {
    var x = el.getStyle("top");
    var y = el.getStyle("left");
    this.xGuideLineX.setStyle("top", x);
    this.xGuideLineY.setStyle("left", y);
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///|  Saving edited element  |////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elementEdit_save: function (
    elEditor,
    el,
    oldContent,
    oldContentText,
    newContent,
    newContentText
  ) {
    if (oldContent != newContent) {
      newContent = newContent ? newContent.trim() : "";

      // SAVE
      el.removeClass("xEditing");
      el.addClass("xSaving");

      var path = el.dataset.path;
      var path_arr = [];
      var prop;
      var value = newContent ? this.escapeForJSON(newContent) : null;
      var callback = this.onElementEditComplete(
        elEditor,
        el,
        newContent,
        newContentText
      );
      var updateAction;

      if (path) {
        var new_callback = callback;
        path_arr = path.split("/");

        if (path_arr[1] === "settings") {
          updateAction = Actions.initUpdateSiteSettings;
        }

        if (path_arr[1] === "site_template_settings") {
          updateAction = Actions.initUpdateSiteTemplateSettings;
        }

        if (path_arr[1] === "section") {
          prop = path_arr.pop();

          if (prop === "title") {
            updateAction = Actions.initRenameSiteSection;
          } else {
            updateAction = Actions.initUpdateSiteSection;
          }
        }

        if (path_arr[1] === "entry") {
          updateAction = Actions.initUpdateSectionEntry;
        }

        if (typeof updateAction === "function") {
          redux_store.dispatch(updateAction(path, value, new_callback));
        } else {
          console.error(
            "BertaEditorBase.elementEdit_save: Undefined updateAction!"
          );
        }
      }
    }
  },

  onElementEditComplete: function (elEditor, el, newContent, newContentText) {
    return function (resp, respRaw) {
      var elIsStillInDOM = el ? el.exists() : false;

      // perform any element updates only if the element is still in DOM
      // otherwise the update is not necessary
      if (elIsStillInDOM) {
        switch (true) {
          case !resp.update:
            // update with the placeholder
            this.makePlaceholder(el);
            break;

          default:
            // for all other cases just update the HTML, if the editor instance is present
            // (editor instance is not present, for instance, in real input fields (checkbox, etc..))
            if (elEditor) {
              el.empty();
              el.set("html", resp.update);
            }
        }

        if (resp.error_message) alert(resp.error_message);

        el.removeClass("xSaving");
        el.removeClass("xEditing");
      }

      // if there is a stored onSave event, execute it
      var onSave = el.retrieve("onElementSave");
      if (onSave)
        onSave(el, resp.update, resp.real, resp.error_message, resp.params);
      this.fireEvent(BertaEditorBase.EDITABLE_FINISH, [el]);

      //correct footer position
      if (typeof messyMess == "object") {
        messyMess.copyrightStickToBottom();
      }
    }.bind(this);
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///  Utilities  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getEmptyPlaceholder: function (property, caption) {
    if (caption) property = caption.replace(/\+/g, " ");
    else {
      property = property.split("/");
      property = property[property.length - 1];
    }
    return new Element("span", {
      class: this.options.xEmptyClass.substr(1),
      html: "&nbsp;" + property + "&nbsp;",
    });
  },

  makePlaceholder: function (el) {
    var property = el.getClassStoredValue("xProperty");
    var caption = el.getClassStoredValue("xCaption");
    el.empty();
    this.getEmptyPlaceholder(property, caption).inject(el);
    return true;
  },

  makePlaceholderIfEmpty: function (el) {
    if (el.get("html").trim() == "") return this.makePlaceholder(el);
    return false;
  },

  escapeForJSON: function (str) {
    // Replace &quot: some editors read value from element html instead of text
    return String(str).replace(/\&quot;/g, '"');
  },

  getEntryInfoForElement: function (el) {
    var retObj = {};

    retObj.site = el.getClassStoredValue("xSite");

    retObj.entryObj = el.getClassStoredValue("xEntryId")
      ? el
      : el.getParent(".xEntry");
    retObj.listObj = el.getClassStoredValue("xSection")
      ? el
      : el.getParent(".xEntriesList");

    // get entryId and entryNum from the entryObj
    retObj.entryId = retObj.entryObj
      ? retObj.entryObj.getClassStoredValue("xEntryId")
      : "";
    retObj.entryNum = retObj.entryObj
      ? retObj.entryObj.getClassStoredValue("xEntryNum")
      : "";

    // try to get section from entryObj, and if not successful — then from listObj
    retObj.section = retObj.entryObj
      ? retObj.entryObj.getClassStoredValue("xSection")
      : "";
    if (!retObj.section)
      retObj.section = retObj.listObj
        ? retObj.listObj.getClassStoredValue("xSection")
        : "";

    return retObj;
  },

});

BertaEditorBase.EDITABLE_FINISH = "editable_finish";
