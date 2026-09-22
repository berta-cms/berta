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
    xBertaEditorClassMCE: ".xEditableMCE",
    xBertaEditorClassMCESimple: ".xEditableMCESimple",
    xBertaEditorClassRC: ".xEditableRC",
    xBertaEditorClassDragXY: ".xEditableDragXY",
    xEmptyClass: ".xEmpty",
  },

  tinyMCESettings: {
    Base: null, // base class
    simple: null,
    full: null,
  },

  elementEdit_instances: new Array(),

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
      case this.options.xBertaEditorClassMCE:
      case this.options.xBertaEditorClassMCESimple:
        el.store("onElementSave", onElementSave);
        el.addClass(editorClass.substr(1));

        el.addEvent(
          "click",
          function (event, editor) {
            $$(".xEditOverlay").destroy();
            if (!this.hasClass("xSaving") && !this.hasClass("xEditing")) {
              el.addClass("xEditing");
              if (this.inlineIsEmpty()) this.innerHTML = "";
              editor.elementEdit_instances.push(
                this.inlineEdit({
                  type: "textarea",
                  WYSIWYGSettings: el.hasClass(
                    editor.options.xBertaEditorClassMCESimple.substr(1)
                  )
                    ? editor.tinyMCESettings.simple.options
                    : editor.tinyMCESettings.full.options,
                  onComplete: editor.elementEdit_save.bind(editor),
                })
              );
              editor.fireEvent(BertaEditorBase.EDITABLE_START, [
                el,
                editor.elementEdit_instances[
                  editor.elementEdit_instances.length - 1
                ],
              ]);
            }
          }.bindWithEvent(el, this)
        );

        self.initEditOverlay(el);
        break;

      case this.options.xBertaEditorClassRC:
        el.store("onElementSave", onElementSave);
        el.addClass(editorClass.substr(1));
        el.addEvent(
          "click",
          function (event, editor) {
            if (!this.hasClass("xSaving") && !this.hasClass("xEditing")) {
              el.addClass("xEditing");
              if (this.inlineIsEmpty()) this.innerHTML = "";
              this.set("old_content", this.innerHTML);
              this.set("text", this.get("title"));
              editor.elementEdit_instances.push(
                this.inlineEdit({
                  onComplete: editor.elementEdit_save.bind(editor),
                })
              );
              editor.fireEvent(BertaEditorBase.EDITABLE_START, [
                el,
                editor.elementEdit_instances[
                  editor.elementEdit_instances.length - 1
                ],
              ]);
            }
          }.bindWithEvent(el, this)
        );
        break;

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

  initEditOverlay: function (el) {
    var editButton = new Element("a", {
      class: "xEditOverlay",
    });

    el.addEvents({
      mouseenter: function () {
        if (!el.hasClass("xEditing")) {
          editButton.style.width = el.getSize().x + "px";
          editButton.style.height = el.getSize().y + "px";
          editButton.inject(el);
        }
      },
      mouseleave: function () {
        editButton.destroy();
      },
    });
  },

  drawGuideLines: function (el) {
    var x = el.getStyle("top");
    var y = el.getStyle("left");
    this.xGuideLineX.setStyle("top", x);
    this.xGuideLineY.setStyle("left", y);
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///|  Saving edited element  |////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  findEditByReplacement: function (replacementElement) {
    var editToReturn;
    replacementElement = $(replacementElement);
    this.elementEdit_instances.each(function (edit) {
      if (edit.inputBox == replacementElement) {
        editToReturn = edit;
      }
    });
    return editToReturn;
  },

  elementEdit_save: function (
    elEditor,
    el,
    oldContent,
    oldContentText,
    newContent,
    newContentText
  ) {
    var args = arguments;
    var params = [
      "elEditor",
      "el",
      "oldContent",
      "oldContentText",
      "newContent",
      "newContentText",
    ];

    if (oldContent == newContent && !el.hasClass("xBgColor")) {
      var content = oldContent;
      if (content.test("^([s\xA0]|&nbsp;)+$")) content = ""; // empty, if contains only rubbish (\xA0 == &nbsp;)
      if (content) {
        el.set(
          "html",
          el.get("old_content") ? el.get("old_content") : oldContentText
        );
      } else {
        this.makePlaceholder(el);
      }
      el.removeClass("xEditing");
    } else if (oldContent != newContent || el.hasClass("xBgColor")) {
      var property = el.getClassStoredValue("xProperty");
      var useCSSUnits = el.getClassStoredValue("xCSSUnits") > 0;
      var xUnits = el.getClassStoredValue("xUnits");
      var isToPrice = el.getClassStoredValue("xFormatModifier") == "toPrice";
      var isCartAttributes = property == "cartAttributes";
      var noHTMLEntities = el.hasClass("xNoHTMLEntities");
      var isLink = el.hasClass("xLink");
      var entryInfo = this.getEntryInfoForElement(el);
      if (entryInfo.section == "") entryInfo.section = this.sectionName;

      // px/em/pt value validator
      if (el.hasClass(this.options.xBertaEditorClassRC.substr(1))) {
        if (/(\spx|\spt|\sem)$/i.test(newContent)) {
          newContent = newContent.replace(
            /(\spx|\spt|\sem)$/i,
            newContent.substr(-2)
          );
          newContentText = newContent;
        }
      }

      // check if new content is not empty and revert it to default value, if specified
      if (!newContent || newContent.test("^([s\xA0]|&nbsp;)+$")) {
        var isRequired = el.getClassStoredValue("xRequired");
        newContent = newContentText = isRequired ? el.get("title") : "";
        el.set("html", newContentText);
      }

      newContent = newContent ? newContent.trim() : "";
      if (noHTMLEntities && elEditor && elEditor.removeHTMLEntities)
        newContent = elEditor.removeHTMLEntities(newContent);
      //console.debug(newContent, parseInt(newContent), newContent == parseInt(newContent));
      if (newContent == parseInt(newContent) && useCSSUnits) {
        if (!newContent || newContent == "0") newContent = "0";
        else {
          newContent = String(newContent) + "px";
        }
      }

      //for integer numbers with custom units
      if (xUnits && xUnits.length) {
        newContent = parseInt(newContent);
        newContent = newContent ? newContent : 0;
        newContent = String(newContent) + xUnits;
      }

      //create prefix for links
      if (isLink) {
        if (newContent.length && newContent.search(":") < 0) {
          newContent = "http://" + newContent;
        }
      }

      if (isToPrice) {
        //add "add to cart" button
        var aele = el.getNext(".aele");
        var cartAttributes = el.getNext(".cartAttributes");
        if (aele) {
          newContent = parseFloat(newContent);

          if (newContent) {
            aele.removeClass("hidden");
            cartAttributes.removeClass("hidden");
          } else {
            aele.addClass("hidden");
            cartAttributes.addClass("hidden");
          }
        }
      }

      if (isCartAttributes) {
        var cartAttributes = el
          .getParent(".xEntry")
          .getElement(".cartAttributes");
        var cartPrice = el
          .getParent(".xEntry")
          .getElement(".cartPrice")
          .get("text");
        var values = newContent.split(",");
        var isList = !(values.length == 1 && values[0] == "");

        cartAttributes.set("text", "").addClass("hidden");

        //generate select box on the fly - is price is > 0
        if (isList) {
          var selectBox = new Element("select", {
            class: "cart_attributes",
          });
          for (var i = 0; i < values.length; i++) {
            var val = values[i].trim();
            val = this.unescapeHtml(val);
            var selectBoxOption = new Element("option", {
              value: val,
            });
            selectBoxOption.set("text", val);
            selectBoxOption.inject(selectBox);
          }
          selectBox.inject(cartAttributes);
          if (parseInt(cartPrice) > 0) {
            cartAttributes.removeClass("hidden");
          }
        }
      }

      if (el.hasClass("xProperty-width")) {
        var entry = el.getParent(".xEntry");
        if (newContent.length) {
          entry.setStyle("width", newContent);
        } else {
          entry.setStyle("width", null);
        }
      }

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

        if (path_arr[0] === "site") {
          prop = path_arr[2];
          if (prop === "name") {
            updateAction = Actions.renameSite;
          } else {
            updateAction = Actions.initUpdateSite;
          }
        }

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

          case el.hasClass(this.options.xBertaEditorClassRC.substr(1)):
            // for simple RC textfields we additionally set the real_content property
            if (
              (el.hasClass("xEntryAutoPlay") || el.hasClass("xBgAutoPlay")) &&
              !/^\d+$/.test(newContentText)
            ) {
              el.set("title", 0);
              el.set("text", 0);
            } else if (el.hasClass("xEntryLinkAddress") && !newContentText) {
              el.set("title", "http://");
              el.set("html", "http://");
            } else {
              el.set("title", elEditor.removeHTMLEntities(resp.real));
              el.set("html", resp.update);
            }
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
        el.removeProperty("old_content");

        try {
          this.setWmodeTransparent();
        } catch (e) {}
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
  ///  tinyMCE  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  tinyMCE_onSave: function (mceInstance) {
    if (mceInstance) {
      var tAElement = mceInstance.getElement();
      mceInstance.remove();
      tAElement.setStyle("visibility", "hidden");

      var elInlineEdit = this.findEditByReplacement(tAElement);
      elInlineEdit.onSave.delay(100, elInlineEdit);
    }
  },

  tinyMCE_ConfigurationsInit: function () {
    this.tinyMCESettings.Base = new Class({
      Implements: Options,
      options: {
        icons_url: "../_lib/tinymce/icons.js",
        icons: "berta",
        license_key: "gpl",
        promotion: false,
        branding: false,
        menubar: false,
        plugins: "save code table lists link",
        toolbar:
          "save undo redo bold italic forecolor backcolor bullist numlist link unlink code | fontsize blocks alignleft aligncenter alignright alignjustify outdent indent table removeformat",
        width: "563px",
        height: "300",
        save_enablewhendirty: false,
        save_onsavecallback: this.tinyMCE_onSave.bind(this),
        invalid_elements: "script",
        block_formats: "Paragraph=p;  Heading 2=h2; Heading 3=h3",
        convert_urls: false,
        relative_urls: false,
        sandbox_iframes: false,
      },
      initialize: function (options) {
        this.setOptions(options);
      },
    });

    this.tinyMCESettings.full = new this.tinyMCESettings.Base();
    this.tinyMCESettings.simple = new this.tinyMCESettings.Base({
      width: "100%",
      plugins: "save link code",
      toolbar: "save bold italic link unlink removeformat code",
    });
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///  Utilities  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  unescapeHtml: function (str) {
    var temp = document.createElement("div");
    temp.innerHTML = str;
    var result = temp.childNodes[0].nodeValue;
    temp.removeChild(temp.firstChild);
    return result;
  },

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

BertaEditorBase.EDITABLE_START = "editable_start";
BertaEditorBase.EDITABLE_FINISH = "editable_finish";
