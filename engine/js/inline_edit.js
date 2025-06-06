var inlineEdit = new Class({
  getOptions: function () {
    return {
      onComplete: function (el, oldContent, newContent) {},
      type: "input",
      subtype: "", // 'font' for font selector (type = 'select')
      WYSIWYGSettings: 0,
      selectOptions: new Array(),
      dontHideOnBlur: false,
    };
  },

  addHTMLEntities: function (str) {
    var s = [
      new RegExp("&", "g"),
      new RegExp('"', "g"),
      new RegExp("<", "g"),
      new RegExp(">", "g"),
    ];
    var r = ["&amp;", "&quot;", "&lt;", "&gt;"];
    for (var i = 0; i < s.length; i++) {
      str = str.replace(s[i], r[i]);
    }
    return str;
  },

  removeHTMLEntities: function (str) {
    var ta = new Element("textarea");
    ta.set("html", str.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    var returnValue = ta.value;
    ta.destroy();
    return returnValue;
  },

  initialize: function (element, options) {
    options.skipSetStyles = element.getClassStoredValue("xSkipSetStyles");
    this.setOptions(this.getOptions(), options);
    if (!element.innerHTML.toLowerCase().match("<" + this.options.type)) {
      this.editting = element;

      // get element's content
      this.oldContent = this.oldContentText = element.innerHTML;
      var content = this.oldContent.trim();
      if (!this.options.WYSIWYGSettings) {
        content = content.replace(new RegExp("<br.*?/?>", "gi"), "\n");
        content = this.removeHTMLEntities(content);
      }

      var inputBoxId =
        "_replacement" + $random(0, 9999) + $random(0, 9999) + $random(0, 9999);

      // create the replacement element and set it's value
      this.inputBox = new Element(this.options.type, {
        id: inputBoxId,
        value: content,
      }).setStyles({
        margin: "-3px -4px -3px -4px",
        "border-width": "1px",
        padding: "2px",
        width: "80%",
        "font-size": "100%",
      });

      //set height for longtext - textarea
      if (this.options.type == "textarea") {
        var height = element.getSize().y;
        this.inputBox.setStyles({
          height: height + "px",
        });
      }

      if (!this.inputBox.value) {
        try {
          this.inputBox.set("html", content);
        } catch (e) {}
      }

      if (!this.options.skipSetStyles) {
        this.setAllStyles(element, this.inputBox);
      }

      // for selects create options and select the right one
      var curOption;
      if (this.options.type == "select") {
        for (var i = 0; i < this.options.selectOptions.length; i++) {
          curOption = this.options.selectOptions[i].split("|");
          if (curOption.length == 1)
            curOption[1] = this.options.selectOptions[i];

          new Element("option", {
            style:
              this.options.subtype == "font"
                ? "font-family: " + curOption[0] + "; font-size: 16px"
                : "",
          })
            .setProperty("value", curOption[0])
            .setProperty("value_title", curOption[1])
            .setProperty(
              "selected",
              this.options.subtype == "rc" || this.options.subtype == "font"
                ? curOption[1] == this.oldContentText
                : curOption[0] == this.oldContent
            )
            .set("html", curOption[1])
            .injectInside(this.inputBox);

          // for RC selects we have to save the current selected value because the editable element contains text which is not the real value
          if (
            (this.options.subtype == "rc" || this.options.subtype == "font") &&
            curOption[1] == this.oldContentText
          )
            this.oldContent = curOption[0];
        }
      }

      // inject the replacement into the DOM and give it focus
      this.editting.set("html", "");
      this.inputBox.injectInside(this.editting);
      (function () {
        try {
          this.inputBox.focus();
        } catch (e) {}
        if (this.inputBox.select) this.inputBox.select();
      })
        .bind(this)
        .delay(300);

      if (this.options.WYSIWYGSettings) {
        var WYSIWYGSettings = this;
        var ed = new tinymce.Editor(
          inputBoxId,
          this.options.WYSIWYGSettings,
          tinymce.EditorManager
        );
        tinymce.EditorManager.add(ed);
        ed.render();

        // update editor height - this is needed, if desired height is below 100.
        // tinymce wouldn't allow heights smaller than 100
        (function () {
          var e = $(ed.id + "_tbl"),
            ifr = $(ed.id + "_ifr");
          if (e) {
            e.setStyle(
              "height",
              WYSIWYGSettings.options.WYSIWYGSettings.height
            );
            ifr.setStyle(
              "height",
              WYSIWYGSettings.options.WYSIWYGSettings.height
            );
          }

          // set styles for the tinymce body element
          WYSIWYGSettings.setAllStylesMCE(element, ed);

          //correct footer position
          if (typeof messyMess == "object") {
            messyMess.copyrightStickToBottom();
          }
        }).delay(1000);
      } else {
        // add events
        this.inputBox.addEvent("change", this.onSave.bind(this));
        if (!this.options.dontHideOnBlur)
          this.inputBox.addEvent("blur", this.onSave.bind(this));
      }
    }
  },

  onSave: function () {
    this.entryUnHover(this.editting);

    this.inputBox.removeEvents();

    this.newContent = this.options.WYSIWYGSettings
      ? this.inputBox.get("value").trim()
      : this.addHTMLEntities(this.inputBox.get("value").trim()).replace(
          new RegExp("\n", "gi"),
          "<br />"
        );

    this.newContentText = this.newContent;
    if (
      (this.options.type == "select" && this.options.subtype == "rc") ||
      this.options.subtype == "font"
    ) {
      this.newContentText = this.inputBox.getSelected().get("text");

      if (this.newContentText instanceof Array) {
        this.newContentText = this.newContentText[0];
      }

      this.editting.set("html", this.newContentText);
    } else {
      this.editting.set("html", this.newContent);
    }

    this.fireEvent("onComplete", [
      this,
      this.editting,
      this.oldContent,
      this.oldContentText,
      this.newContent,
      this.newContentText,
    ]);
  },

  entryUnHover: function (el) {
    var pathParts = el.data("path").split("/");
    var isEntryTagField =
      pathParts.length === 6 &&
      pathParts.slice(1)[0] === "entry" &&
      pathParts.slice(-1)[0] === "tag";

    if (!isEntryTagField) {
      return;
    }

    var xEntryEl = el.getParent(".xEntry");

    if (xEntryEl.getAttribute("data-hover") === "off") {
      xEntryEl.removeClass("xEntryHover");
    }
  },

  setAllStyles: function (element, editor) {
    var stylesToCopy = [
      "font-family",
      "font-weight",
      "font-style",
      "text-transform",
      "line-height",
      "letter-spacing",
      "font",
      "color",
      "background-color",
    ];

    stylesToCopy.map(function (style) {
      var selector =
        style === "background-color" ? element.getParent("body") : element;
      var value = selector.getStyle(style);
      if (value) {
        editor.setStyle(style, value);
      }
    });
  },

  setAllStylesMCE: function (element, mceEditor) {
    var stylesToCopy = [
      "font-size",
      "font-family",
      "font-weight",
      "font-style",
      "text-transform",
      "line-height",
      "letter-spacing",
      "font",
      "color",
      "background-color",
    ];
    var editorBody = mceEditor.dom.select("body");

    stylesToCopy.map(function (style) {
      var selector =
        style === "background-color" ? element.getParent("body") : element;
      var value = selector.getStyle(style);
      if (value) {
        mceEditor.dom.setStyle(editorBody, style, value);
      }
    });
  },
});

Element.implement({
  inlineEdit: function (options) {
    return new inlineEdit(this, options);
  },
  inlineIsEmpty: function () {
    return this.innerHTML.indexOf('<span class="xEmpty">') == 0;
  },
});

inlineEdit.implement(new Events());
inlineEdit.implement(new Options());
