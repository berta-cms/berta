var BertaEditor = new Class({
  Extends: BertaEditorBase,
  Implements: [Options, Events],

  options: {
    paths: null,
  },

  /* editing related variables */
  edittingMode: "entries",

  /* DOM elements */
  entriesList: null, // the OL element thad contains the entries

  /* variables containing information */
  currentSection: null, // the name of the section opened
  currentTag: null, // the name of the tag selected

  /* old */
  tagsMenu: null,
  /* old */

  initialize: function (options) {
    this.setOptions(options);

    ["sitesMenuRerendered", "sectionsMenuRerendered"].forEach(
      function (e) {
        window.addEventListener(e, this.onDOMReadyDo.bindWithEvent(this));
      }.bindWithEvent(this)
    );

    window.addEventListener("addEntry", this.onAddEntry.bindWithEvent(this));

    window.addEvent("domready", this.onDOMReady.bindWithEvent(this));
    window.addEvent("load", this.onLoad.bindWithEvent(this));
  },

  onAddEntry: function () {
    // after adding entry sync state
    window.redux_store.dispatch(Actions.getState(window.getCurrentSite()));
    this.onDOMReadyDo();
  },

  onDOMReady: function () {
    // delay onDOMReady processing to allow all elements on page properly initialize
    this.onDOMReadyDo.delay(1000, this);
  },

  onDOMReadyDo: function () {
    this.edittingMode = $$("body")[0].get("x_mode");
    if (!this.edittingMode) this.edittingMode = "entries";

    switch (this.edittingMode) {
      case "multipage":
        break;

      case "entries":
      default:
        this.container = document.getElementById("contentContainer");
        this.entriesList = $$(".xEntriesList")[0];

        // section background editing
        if ($("xBgEditorPanelTrig"))
          $("xBgEditorPanelTrig").addEvent(
            "click",
            this.onBgEditClick.bindWithEvent(this)
          );

        if (this.entriesList) {
          this.currentSection =
            window.BertaHelpers.getClassStoredValue(this.entriesList, "xSection");
          this.currentTag = window.BertaHelpers.getClassStoredValue(this.entriesList, "xTag");

          if (this.currentSection) {
            this.entriesList
              .getElements(".xEntry .xEntryEditWrap")
              .addEvent("mouseenter", this.entryOnHover.bindWithEvent(this));
            this.entriesList
              .getElements(".xEntry .xEntryEditWrap")
              .addEvent("mouseleave", this.entryOnUnHover.bindWithEvent(this));

            this.entriesList
              .getElements(".xEntry .xEntryDropdown")
              .addEvent(
                "mouseenter",
                this.entryDropdownToggle.bindWithEvent(this)
              );
            this.entriesList
              .getElements(".xEntry .xEntryDropdown")
              .addEvent("click", this.entryDropdownToggle.bindWithEvent(this));

            this.entriesList
              .getElements(".xEntry .xEntryDropdownBox")
              .addEvents({
                mouseleave: function (event) {
                  this.removeClass("xVisible");
                  dropdown = this.getParent().getElement(".xEntryDropdown");
                  dropdown.removeClass("xEntryDropdowHover");
                },
              });

            // entry deleting and creating
            if (
              this.options.templateName.substr(0, 5) != "messy" &&
              this.options.sectionType != "portfolio"
            )
              createNewEntryText = this.options.i18n["create new entry here"];
            else createNewEntryText = this.options.i18n["create new entry"];
            var existingCreateNewEntry =
              this.entriesList.getNext(".xCreateNewEntry");
            if (existingCreateNewEntry) existingCreateNewEntry.destroy();
            new Element("A", {
              class: "xCreateNewEntry xPanel xAction-entryCreateNew",
              href: "#",
            })
              .adopt(
                new Element("span", {
                  html: createNewEntryText,
                })
              )
              .inject(this.entriesList, "after");
            $$(".xEntryDelete").addEvent(
              "click",
              this.entryDelete.bindWithEvent(this)
            );
            $$(".xCreateNewEntry").addEvent(
              "click",
              this.entryCreate.bindWithEvent(this)
            );

            if (this.options.templateName.substr(0, 5) == "messy") {
              $$(".xCreateNewEntry").addClass("mess");
              $$(".xCreateNewEntry").adopt(
                new Element("div", {
                  class: "xHandle",
                  events: {
                    click: function () {
                      return false;
                    },
                  },
                })
              );
            }

            // galleries
            this.entriesList.getElements(".xGalleryContainer").each(
              function (item) {
                if (!item.getParent(".xEntry").hasClass("xHidden")) {
                  this.initGallery(item);
                }
              }.bind(this)
            );
            this.entriesList
              .getElements(".xGalleryEditButton")
              .addEvent("click", this.onGalleryEditClick.bindWithEvent(this));

            // Entry moving to other section
            document
              .querySelectorAll(".js-bt-open-move-entry-to-section")
              .forEach(function (el) {
                el.addEventListener("click", function (e) {
                  e.preventDefault();
                  var xEntryEditWrap = this.closest(".xEntryEditWrap");
                  var xEntryDropdownBox =
                    xEntryEditWrap.querySelector(".xEntryDropdownBox");
                  var moveEntryToSectionContainer =
                    xEntryEditWrap.querySelector(".bt-move-entry-to-section");
                  xEntryDropdownBox.classList.remove("xVisible");
                  moveEntryToSectionContainer.style.display = "block";
                });
              });

            document.querySelectorAll(".js-move-entry-to-section").forEach(
              function (el) {
                el.addEventListener(
                  "change",
                  this.entryMoveToSection.bind(this)
                );
              }.bind(this)
            );

            this.highlightNewEntry.delay(100, this);
          } else if (!this.currentSection) {
            var h1 = this.container.getElement("h1");
            if (h1) {
              h1.hide();
            }
          }
        }
        break;
    }
  },

  initGallery: function (item) {
    var galleryType = window.BertaHelpers.getClassStoredValue(item, "xGalleryType");

    switch (galleryType) {
      case "row":
        new BertaGalleryRow(item);
        break;
      case "column":
        new BertaGalleryColumn(item);
        break;
      case "pile":
        new BertaGalleryPile(item);
        break;
      case "link":
        // link galleries are plain markup and need no JS
        break;
      case "grid":
        new BertaGalleryGrid(item);
        break;
      default:
        new BertaGallerySlideshow(item);
    }
  },

  onLoad: function () {},

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///|  INIT  |/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  highlightNewEntry: function () {
    var idToHighlight = Cookie.read("_berta__entry_highlight");
    Cookie.dispose("_berta__entry_highlight", {
      path: this.options.paths.engineABSRoot,
    });
    if (idToHighlight) {
      var entry = this.entriesList.getElement(".xEntryId-" + idToHighlight);
      if (entry) {
        var pos = entry.getPosition();
        if (this.options.templateName.substr(0, 5) == "messy") {
          window.scrollTo(pos.x, pos.y);
        } else {
          window.scrollTo(0, pos.y);
        }
      }
    }
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///|  Gallery  |//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  onBgEditClick: function (event) {
    event.stop();
    var site = getCurrentSite();

    window.parent.postMessage(
      {
        action: "BackgroundGalleryEditorOpen",
        site: site,
        section: this.currentSection,
      },
      "*"
    );
  },

  onGalleryEditClick: function (event) {
    event.stop();
    var site = getCurrentSite();
    var entryObj = $(event.target).getParent(".xEntry");
    var entryId = window.BertaHelpers.getClassStoredValue(entryObj, "xEntryId");

    window.parent.postMessage(
      {
        action: "EntryGalleryEditorOpen",
        site: site,
        section: this.currentSection,
        entryId: entryId,
      },
      "*"
    );
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///|  Entry Management  |/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  entryCreate: function (event) {
    event = new Event(event).stop();
    var target = $(event.target);
    if (target.tagName != "A") target = target.getParent("a");
    var site = getCurrentSite();
    var entryInfo = this.getEntryInfoForElement(target);

    redux_store.dispatch(
      Actions.initCreateSectionEntry(
        site,
        this.currentSection,
        this.currentTag,
        entryInfo.entryId,
        function (resp) {
          Cookie.write("_berta__entry_highlight", resp.entryid, {
            path: this.options.paths.engineABSRoot,
          });
          window.location.hash = "entry-" + resp.entryid;
          // window.location.reload();
        }.bindWithEvent(this)
      )
    );
  },

  entryMoveToSection: function (event) {
    var site = getCurrentSite();
    var toSection = event.target.value;
    var entryObj = event.target.closest(".xEntry");
    var entryId = window.BertaHelpers.getClassStoredValue(entryObj, "xEntryId");
    var redirectUrl = window.BertaHelpers.updateQueryStringParameter(
      window.location.href,
      "section",
      toSection
    );

    redux_store.dispatch(
      Actions.initEntryMoveToSection(
        site,
        this.currentSection,
        entryId,
        toSection,
        function () {
          window.location.href = redirectUrl;
        }
      )
    );
  },

  entryDelete: function (event) {
    event = new Event(event).stop();
    var entryObj = $(event.target).getParent(".xEntry");
    var entryId = window.BertaHelpers.getClassStoredValue(entryObj, "xEntryId");
    var entryThumbnail = $$('.portfolioThumbnail[data-id="' + entryId + '"]');
    var site = getCurrentSite();

    redux_store.dispatch(
      Actions.initDeleteSectionEntry(
        site,
        this.currentSection,
        entryId,
        function () {
          entryObj.destroy();
          entryThumbnail.destroy();
        }.bindWithEvent(this)
      )
    );
  },

  entryOnHover: function (event) {
    event = new Event(event);
    var target = $(event.target);
    if (!target.hasClass("xEntry")) target = target.getParent(".xEntry");
    target.addClass("xEntryHover");
    target.setAttribute("data-hover", "on");
  },

  entryOnUnHover: function (event) {
    event = new Event(event);
    var target = $(event.target);

    if (!target.hasClass("xEntry")) {
      target = target.getParent(".xEntry");
    }

    target.removeClass("xEntryHover");
    target.setAttribute("data-hover", "off");
  },

  entryDropdownToggle: function (event) {
    var dropdown = $(event.target);
    var entry = dropdown.getParent().getParent();
    dropdownBox = entry.getElement(".xEntryDropdownBox");

    dropdownBox.toggleClass("xVisible", true);

    if (dropdownBox.hasClass("xVisible")) {
      dropdown.addClass("xEntryDropdowHover");
    } else {
      dropdown.removeClass("xEntryDropdowHover");
    }
  },
});

window.bertaEditor = new BertaEditor(window.bertaGlobalOptions);
