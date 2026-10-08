var BertaEditor = class {
  constructor(options) {
    this.options = Object.assign({ paths: null }, options);

    /* DOM elements */
    this.container = null;
    this.entriesList = null; // the OL element thad contains the entries

    /* variables containing information */
    this.currentSection = null; // the name of the section opened
    this.currentTag = null; // the name of the tag selected

    // Bound once: onDOMReadyDo runs again after every re-render and adds these
    // listeners again, adding the same function twice is a no-op
    this.onDOMReadyDo = this.onDOMReadyDo.bind(this);
    this.onEntriesRerendered = this.onEntriesRerendered.bind(this);
    this.onBgEditClick = this.onBgEditClick.bind(this);
    this.onGalleryEditClick = this.onGalleryEditClick.bind(this);
    this.entryCreate = this.entryCreate.bind(this);
    this.entryMoveToSection = this.entryMoveToSection.bind(this);
    this.entryDelete = this.entryDelete.bind(this);

    ["sitesMenuRerendered", "sectionsMenuRerendered"].forEach((e) => {
      window.addEventListener(e, this.onDOMReadyDo);
    });

    window.addEventListener("entriesRerendered", this.onEntriesRerendered);

    window.BertaHelpers.onDomReady(this.onDOMReady.bind(this));
  }

  onEntriesRerendered() {
    // the entries were replaced after a state change, sync the state
    window.redux_store.dispatch(Actions.getState(window.getCurrentSite()));
    this.onDOMReadyDo();
  }

  onDOMReady() {
    // delay onDOMReady processing to allow all elements on page properly initialize
    setTimeout(this.onDOMReadyDo, 1000);
  }

  onDOMReadyDo() {
    var getValue = window.BertaHelpers.getClassStoredValue;

    this.container = document.getElementById("contentContainer");
    this.entriesList = document.querySelector(".xEntriesList");

    // section background editing
    var bgEditorPanelTrig = document.getElementById("xBgEditorPanelTrig");
    if (bgEditorPanelTrig) {
      bgEditorPanelTrig.addEventListener("click", this.onBgEditClick);
    }

    if (!this.entriesList) {
      return;
    }

    this.currentSection = getValue(this.entriesList, "xSection");
    this.currentTag = getValue(this.entriesList, "xTag");

    if (!this.currentSection) {
      var h1 = this.container.querySelector("h1");
      if (h1) {
        h1.style.display = "none";
      }
      return;
    }

    // Bound on the elements themselves, not delegated: the Angular InlineEditService
    // stops these mouseleave handlers with a capture listener on the same element
    this.entriesList
      .querySelectorAll(".xEntry .xEntryEditWrap")
      .forEach((el) => {
        el.addEventListener("mouseenter", BertaEditor.entryOnHover);
        el.addEventListener("mouseleave", BertaEditor.entryOnUnHover);
      });

    this.entriesList
      .querySelectorAll(".xEntry .xEntryDropdown")
      .forEach((el) => {
        el.addEventListener("mouseenter", BertaEditor.entryDropdownToggle);
        el.addEventListener("click", BertaEditor.entryDropdownToggle);
      });

    this.entriesList
      .querySelectorAll(".xEntry .xEntryDropdownBox")
      .forEach((el) => {
        el.addEventListener("mouseleave", BertaEditor.entryDropdownBoxOnLeave);
      });

    // entry deleting and creating
    var createNewEntryText;
    if (
      this.options.templateName.substr(0, 5) != "messy" &&
      this.options.sectionType != "portfolio"
    )
      createNewEntryText = this.options.i18n["create new entry here"];
    else createNewEntryText = this.options.i18n["create new entry"];

    var existingCreateNewEntry = this.entriesList.nextElementSibling;
    while (
      existingCreateNewEntry &&
      !existingCreateNewEntry.matches(".xCreateNewEntry")
    ) {
      existingCreateNewEntry = existingCreateNewEntry.nextElementSibling;
    }
    if (existingCreateNewEntry) existingCreateNewEntry.remove();

    var createNewEntry = window.BertaHelpers.createElement("a", {
      class: "xCreateNewEntry xPanel xAction-entryCreateNew",
      href: "#",
    });
    createNewEntry.appendChild(
      window.BertaHelpers.createElement("span", {}, createNewEntryText)
    );
    this.entriesList.after(createNewEntry);

    document.querySelectorAll(".xEntryDelete").forEach((el) => {
      el.addEventListener("click", this.entryDelete);
    });
    document.querySelectorAll(".xCreateNewEntry").forEach((el) => {
      el.addEventListener("click", this.entryCreate);
    });

    if (this.options.templateName.substr(0, 5) == "messy") {
      document.querySelectorAll(".xCreateNewEntry").forEach((el) => {
        el.classList.add("mess");
      });

      var handle = window.BertaHelpers.createElement("div", {
        class: "xHandle",
      });
      handle.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
      });
      // only the link after the list gets a drag handle, messy hides the links inside entries
      createNewEntry.appendChild(handle);
    }

    // galleries
    this.entriesList.querySelectorAll(".xGalleryContainer").forEach((item) => {
      if (!item.closest(".xEntry").classList.contains("xHidden")) {
        window.BertaHelpers.initGallery(item);
      }
    });
    this.entriesList.querySelectorAll(".xGalleryEditButton").forEach((el) => {
      el.addEventListener("click", this.onGalleryEditClick);
    });

    // Entry moving to other section
    document
      .querySelectorAll(".js-bt-open-move-entry-to-section")
      .forEach(function (el) {
        el.addEventListener("click", BertaEditor.openMoveEntryToSection);
      });

    document.querySelectorAll(".js-move-entry-to-section").forEach((el) => {
      el.addEventListener("change", this.entryMoveToSection);
    });

    setTimeout(() => this.highlightNewEntry(), 100);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///|  INIT  |/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  highlightNewEntry() {
    var idToHighlight = window.BertaHelpers.getCookie("_berta__entry_highlight");
    window.BertaHelpers.removeCookie(
      "_berta__entry_highlight",
      this.options.paths.engineABSRoot
    );
    if (idToHighlight) {
      var entry = this.entriesList.querySelector(".xEntryId-" + idToHighlight);
      if (entry) {
        // position in the document, a fixed entry is placed in the viewport so the scroll isn't added
        var rect = entry.getBoundingClientRect();
        var isFixed = window.getComputedStyle(entry).position == "fixed";
        var pos = {
          x: Math.trunc(rect.left) + (isFixed ? 0 : window.scrollX),
          y: Math.trunc(rect.top) + (isFixed ? 0 : window.scrollY),
        };
        if (this.options.templateName.substr(0, 5) == "messy") {
          window.scrollTo(pos.x, pos.y);
        } else {
          window.scrollTo(0, pos.y);
        }
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///|  Gallery  |//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  onBgEditClick(event) {
    event.preventDefault();
    event.stopPropagation();
    var site = getCurrentSite();

    window.parent.postMessage(
      {
        action: "BackgroundGalleryEditorOpen",
        site: site,
        section: this.currentSection,
      },
      "*"
    );
  }

  onGalleryEditClick(event) {
    event.preventDefault();
    event.stopPropagation();
    var site = getCurrentSite();
    var entryObj = event.target.closest(".xEntry");
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
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///|  Entry Management  |/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  entryCreate(event) {
    event.preventDefault();
    event.stopPropagation();
    var site = getCurrentSite();
    // the new entry goes before the entry this link belongs to, or last without one
    var entryObj = event.target.closest(".xEntry");
    var entryId = entryObj
      ? window.BertaHelpers.getClassStoredValue(entryObj, "xEntryId")
      : "";

    redux_store.dispatch(
      Actions.initCreateSectionEntry(
        site,
        this.currentSection,
        this.currentTag,
        entryId,
        (resp) => {
          window.BertaHelpers.setCookie(
            "_berta__entry_highlight",
            resp.entryid,
            this.options.paths.engineABSRoot
          );
          window.location.hash = "entry-" + resp.entryid;
          // window.location.reload();
        }
      )
    );
  }

  entryMoveToSection(event) {
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
  }

  entryDelete(event) {
    event.preventDefault();
    event.stopPropagation();
    var entryObj = event.target.closest(".xEntry");
    var entryId = window.BertaHelpers.getClassStoredValue(entryObj, "xEntryId");
    var entryThumbnails = document.querySelectorAll(
      '.portfolioThumbnail[data-id="' + entryId + '"]'
    );
    var site = getCurrentSite();

    redux_store.dispatch(
      Actions.initDeleteSectionEntry(
        site,
        this.currentSection,
        entryId,
        function () {
          entryObj.remove();
          entryThumbnails.forEach(function (thumbnail) {
            thumbnail.remove();
          });
        }
      )
    );
  }

  static entryOnHover(event) {
    var entry = event.currentTarget.closest(".xEntry");
    entry.classList.add("xEntryHover");
    entry.setAttribute("data-hover", "on");
  }

  static entryOnUnHover(event) {
    var entry = event.currentTarget.closest(".xEntry");
    entry.classList.remove("xEntryHover");
    entry.setAttribute("data-hover", "off");
  }

  static entryDropdownToggle(event) {
    var dropdown = event.currentTarget;
    var entry = dropdown.parentElement.parentElement;
    var dropdownBox = entry.querySelector(".xEntryDropdownBox");

    dropdownBox.classList.add("xVisible");
    dropdown.classList.add("xEntryDropdowHover");
  }

  static entryDropdownBoxOnLeave(event) {
    var dropdownBox = event.currentTarget;
    dropdownBox.classList.remove("xVisible");
    dropdownBox.parentElement
      .querySelector(".xEntryDropdown")
      .classList.remove("xEntryDropdowHover");
  }

  static openMoveEntryToSection(event) {
    event.preventDefault();
    var xEntryEditWrap = event.currentTarget.closest(".xEntryEditWrap");
    var xEntryDropdownBox = xEntryEditWrap.querySelector(".xEntryDropdownBox");
    var moveEntryToSectionContainer = xEntryEditWrap.querySelector(
      ".bt-move-entry-to-section"
    );
    xEntryDropdownBox.classList.remove("xVisible");
    moveEntryToSectionContainer.style.display = "block";
  }
};

window.bertaEditor = new BertaEditor(window.bertaGlobalOptions);
